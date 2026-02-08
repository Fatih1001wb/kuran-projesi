import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import AyetCard from "../components/AyetCard";
import { sureListesi } from "../data/surelerData";

const TOTAL_PAGES = 604;

function QuranPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [mode, setMode] = useState("arabic");
  const [apiAyetler, setApiAyetler] = useState([]);
  const [translationId, setTranslationId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [playingId, setPlayingId] = useState(null);
  const [translitCache, setTranslitCache] = useState({});
  const [bookmarks, setBookmarks] = useState([]);
  const audioRef = useRef(null);

  const rawPage = Number(searchParams.get("page") || "1");
  const page = Number.isFinite(rawPage)
    ? Math.min(Math.max(rawPage, 1), TOTAL_PAGES)
    : 1;

  const pageButtons = useMemo(
    () => Array.from({ length: TOTAL_PAGES }, (_, index) => index + 1),
    [],
  );

  const sureNameMap = useMemo(
    () =>
      sureListesi.reduce((acc, sure) => {
        acc[sure.id] = sure.ad;
        return acc;
      }, {}),
    [],
  );

  const bookmarkKeys = useMemo(
    () => new Set(bookmarks.map((item) => item.key)),
    [bookmarks],
  );

  const bookmarkedPages = useMemo(
    () => new Set(bookmarks.map((item) => item.page).filter(Boolean)),
    [bookmarks],
  );

  const displayAyetler = useMemo(
    () =>
      apiAyetler.map((ayet) => {
        const sureTranslit = translitCache[ayet.sureId] || {};
        return {
          ...ayet,
          okunus: sureTranslit[ayet.ayetNo] || "",
          sureAd: sureNameMap[ayet.sureId] || `Sure ${ayet.sureId}`,
        };
      }),
    [apiAyetler, translitCache, sureNameMap],
  );

  const pad = (value) => String(value).padStart(3, "0");
  const getAudioUrl = (sureNo, ayetNo) =>
    `https://everyayah.com/data/Alafasy_128kbps/${pad(sureNo)}${pad(ayetNo)}.mp3`;
  const bookmarkKey = "quranBookmarks";
  const getBookmarkId = (ayet) => `${ayet.sureId}:${ayet.ayetNo}`;

  const goToPage = (nextPage) => {
    setSearchParams({ page: String(nextPage) });
  };

  const readBookmarks = () => {
    try {
      const raw = localStorage.getItem(bookmarkKey);
      const parsed = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(parsed)) return [];
      return parsed
        .map((item) => {
          if (typeof item === "string") {
            const [sureId, ayetNo] = item.split(":").map(Number);
            if (!sureId || !ayetNo) return null;
            return {
              key: item,
              sureId,
              ayetNo,
              page: null,
              sureAd: sureNameMap[sureId] || `Sure ${sureId}`,
              savedAt: null,
            };
          }
          if (!item || typeof item !== "object") return null;
          return {
            key: item.key,
            sureId: item.sureId,
            ayetNo: item.ayetNo,
            page: item.page || null,
            sureAd:
              item.sureAd || sureNameMap[item.sureId] || `Sure ${item.sureId}`,
            savedAt: item.savedAt || null,
          };
        })
        .filter(Boolean);
    } catch {
      return [];
    }
  };

  const writeBookmarks = (next) => {
    localStorage.setItem(bookmarkKey, JSON.stringify(next));
  };

  useEffect(() => {
    if (rawPage !== page) {
      setSearchParams({ page: String(page) }, { replace: true });
    }
  }, [rawPage, page, setSearchParams]);

  useEffect(() => {
    setBookmarks(readBookmarks());
  }, [page, sureNameMap]);

  useEffect(() => {
    const fetchTranslations = async () => {
      try {
        const response = await fetch(
          "https://api.quran.com/api/v4/resources/translations?language=tr",
        );
        if (!response.ok) throw new Error("API hatası");
        const data = await response.json();
        const translations = data.translations || [];
        const diyanet = translations.find((t) =>
          (t.name || "").toLowerCase().includes("diyanet"),
        );
        setTranslationId(diyanet?.id || translations[0]?.id || null);
      } catch (error) {
        console.error(error);
      }
    };

    fetchTranslations();
  }, []);

  useEffect(() => {
    const fetchVerses = async () => {
      if (!page || !translationId) return;
      setLoading(true);
      try {
        const response = await fetch(
          `https://api.quran.com/api/v4/verses/by_page/${page}?language=tr&words=false&translations=${translationId}&fields=text_uthmani,text_imlaei,text_uthmani_simple&per_page=300`,
        );
        if (!response.ok) throw new Error("API hatası");
        const data = await response.json();
        const verses = data.verses || [];
        const mapped = verses.map((verse) => {
          const arapca =
            verse.text_uthmani ||
            verse.text_imlaei ||
            verse.text_uthmani_simple ||
            "";
          const [sureNo, ayetNo] = String(verse.verse_key || "").split(":");
          return {
            id: verse.id,
            sureId: Number(sureNo) || verse.chapter_id || 0,
            ayetNo: Number(ayetNo) || verse.verse_number || 0,
            arapca,
            turkce: verse.translations?.[0]?.text || "",
            okunus: "",
          };
        });
        setApiAyetler(mapped);
      } catch (error) {
        console.error(error);
        setApiAyetler([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVerses();
  }, [page, translationId]);

  useEffect(() => {
    const buildMap = (ayahs = []) =>
      ayahs.reduce((acc, ayah) => {
        acc[ayah.numberInSurah] = ayah.text;
        return acc;
      }, {});

    const fetchTransliteration = async (sureId) => {
      try {
        const response = await fetch(
          `https://api.alquran.cloud/v1/surah/${sureId}/tr.transliteration`,
        );
        if (!response.ok) throw new Error("TR transliterasyon yok");
        const data = await response.json();
        const ayahs = data?.data?.ayahs || [];
        const map = buildMap(ayahs);
        if (Object.keys(map).length) return map;
        throw new Error("TR transliterasyon boş");
      } catch (error) {
        try {
          const fallbackResponse = await fetch(
            `https://api.alquran.cloud/v1/surah/${sureId}/en.transliteration`,
          );
          if (!fallbackResponse.ok)
            throw new Error("EN transliterasyon hatası");
          const fallbackData = await fallbackResponse.json();
          const fallbackAyahs = fallbackData?.data?.ayahs || [];
          return buildMap(fallbackAyahs);
        } catch (fallbackError) {
          console.error(fallbackError);
          return {};
        }
      }
    };

    const loadMissing = async () => {
      const sureIds = [
        ...new Set(apiAyetler.map((ayet) => ayet.sureId)),
      ].filter((sureId) => sureId && !translitCache[sureId]);
      if (!sureIds.length) return;
      const results = await Promise.all(
        sureIds.map(async (sureId) => ({
          sureId,
          map: await fetchTransliteration(sureId),
        })),
      );
      setTranslitCache((prev) => {
        const next = { ...prev };
        results.forEach(({ sureId, map }) => {
          next[sureId] = map;
        });
        return next;
      });
    };

    loadMissing();
  }, [apiAyetler, translitCache]);

  const playAyet = (ayetId) => {
    const selectedAyet = apiAyetler.find((item) => item.id === ayetId);
    if (!selectedAyet || !audioRef.current) return;
    const nextSrc = getAudioUrl(selectedAyet.sureId, selectedAyet.ayetNo);
    const audio = audioRef.current;
    if (audio.src === nextSrc && !audio.paused) {
      audio.pause();
      return;
    }
    if (audio.src !== nextSrc) {
      audio.src = nextSrc;
    }
    audio
      .play()
      .then(() => setPlayingId(selectedAyet.id))
      .catch(() => setPlayingId(null));
  };

  const toggleBookmark = (ayet) => {
    const key = getBookmarkId(ayet);
    const next = readBookmarks();
    const exists = next.find((item) => item.key === key);
    let updated;
    if (exists) {
      updated = next.filter((item) => item.key !== key);
    } else {
      updated = [
        {
          key,
          sureId: ayet.sureId,
          ayetNo: ayet.ayetNo,
          page,
          sureAd: sureNameMap[ayet.sureId] || `Sure ${ayet.sureId}`,
          savedAt: Date.now(),
        },
        ...next,
      ];
    }
    writeBookmarks(updated);
    setBookmarks(updated);
    const latest = updated[0] || null;
    window.dispatchEvent(
      new CustomEvent("quran:bookmark-updated", { detail: latest }),
    );
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const handleEnded = () => setPlayingId(null);
    const handlePause = () => setPlayingId(null);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("pause", handlePause);
    return () => {
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("pause", handlePause);
    };
  }, []);

  return (
    <div className="reading-container quran-reading">
      <div className="ad-banner">Reklam Alanı</div>

      <div className="reading-header">
        <div className="reading-title">Kur&apos;an Sayfası {page}</div>
        <div className="page-controls">
          <button
            type="button"
            className="page-btn"
            onClick={() => goToPage(Math.max(1, page - 1))}
            disabled={page === 1}
          >
            ← Önceki
          </button>
          <button
            type="button"
            className="page-btn"
            onClick={() => goToPage(Math.min(TOTAL_PAGES, page + 1))}
            disabled={page === TOTAL_PAGES}
          >
            Sonraki →
          </button>
        </div>
      </div>

      <div className="mode-toggle">
        <button
          className={`mode-button ${mode === "arabic" ? "is-active" : ""}`}
          onClick={() => setMode("arabic")}
        >
          Arapça Yazılış + Okunuş
        </button>
        <button
          className={`mode-button ${mode === "turkish" ? "is-active" : ""}`}
          onClick={() => setMode("turkish")}
        >
          Türkçe Yazılış + Okunuş
        </button>
      </div>

      <div className="page-buttons" role="navigation" aria-label="Sayfa seç">
        {pageButtons.map((pageNumber) => (
          <button
            key={pageNumber}
            type="button"
            className={`page-btn ${pageNumber === page ? "is-active" : ""} ${
              bookmarkedPages.has(pageNumber) ? "has-bookmark" : ""
            }`}
            onClick={() => goToPage(pageNumber)}
          >
            {pageNumber}
          </button>
        ))}
      </div>

      <audio ref={audioRef} preload="none" />

      {loading && <div className="loading-text">İçerik yükleniyor...</div>}

      {!loading && !apiAyetler.length && (
        <div className="empty-state">
          Bu sayfa için içerik yüklenemedi. İnternet bağlantısını kontrol edip
          tekrar deneyin.
        </div>
      )}

      {displayAyetler.map((ayet) => (
        <AyetCard
          key={ayet.id}
          ayet={ayet}
          mode={mode}
          isPlaying={playingId === ayet.id}
          onListen={() => playAyet(ayet.id)}
          onBookmark={() => toggleBookmark(ayet)}
          isBookmarked={bookmarkKeys.has(getBookmarkId(ayet))}
        />
      ))}
    </div>
  );
}

export default QuranPage;
