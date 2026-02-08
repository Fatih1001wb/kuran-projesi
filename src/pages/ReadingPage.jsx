import React, { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { ornekAyetler, sureListesi } from "../data/surelerData";
import AyetCard from "../components/AyetCard";
import { useAuth } from "../contexts/AuthContext";
import { getSurahProgress, setSurahProgress } from "../services/progressService";

function ReadingPage() {
  const { id } = useParams();
  const [mode, setMode] = useState("arabic");
  const [isFavorite, setIsFavorite] = useState(false);
  const [playingId, setPlayingId] = useState(null);
  const [apiAyetler, setApiAyetler] = useState([]);
  const [loading, setLoading] = useState(false);
  const [translitMap, setTranslitMap] = useState({});
  const [progress, setProgress] = useState(null);
  const [progressError, setProgressError] = useState("");
  const audioRef = useRef(null);
  const { user } = useAuth();

  const sureId = Number(id);
  const favoritesKey = "favoriteSureIds";
  const localName = useMemo(
    () => sureListesi.find((item) => item.id === sureId)?.ad,
    [sureId],
  );
  const fallbackAyetler = useMemo(() => {
    const filtered = ornekAyetler.filter((ayet) => ayet.sureId === sureId);
    return filtered.length ? filtered : ornekAyetler;
  }, [sureId]);
  const ayetler = apiAyetler.length ? apiAyetler : fallbackAyetler;
  const displayAyetler = useMemo(
    () =>
      ayetler.map((ayet) => ({
        ...ayet,
        okunus: ayet.okunus || translitMap[ayet.ayetNo] || "",
      })),
    [ayetler, translitMap],
  );
  const hasAyet = displayAyetler.length > 0;
  const totalAyet = useMemo(() => {
    const fromList = sureListesi.find((item) => item.id === sureId)?.ayetSayisi;
    return fromList || displayAyetler.length || 0;
  }, [sureId, displayAyetler.length]);
  const lastAyetNo = progress?.lastAyetNo || 0;
  const progressPercent = totalAyet
    ? Math.min(100, Math.round((lastAyetNo / totalAyet) * 100))
    : 0;

  const pad = (value) => String(value).padStart(3, "0");
  const getAudioUrl = (sureNo, ayetNo) =>
    `https://everyayah.com/data/Alafasy_128kbps/${pad(sureNo)}${pad(ayetNo)}.mp3`;

  const readFavorites = () => {
    try {
      const raw = localStorage.getItem(favoritesKey);
      const parsed = raw ? JSON.parse(raw) : [];
      return new Set(Array.isArray(parsed) ? parsed : []);
    } catch {
      return new Set();
    }
  };

  const writeFavorites = (set) => {
    localStorage.setItem(favoritesKey, JSON.stringify([...set]));
    window.dispatchEvent(new Event("favorites:updated"));
  };

  const playAyet = (ayetId) => {
    const selectedAyet = ayetler.find((item) => item.id === ayetId);
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

  useEffect(() => {
    const buildMap = (ayahs = []) =>
      ayahs.reduce((acc, ayah) => {
        acc[ayah.numberInSurah] = ayah.text;
        return acc;
      }, {});

    const fetchTransliteration = async () => {
      if (!sureId) return;
      try {
        const response = await fetch(
          `https://api.alquran.cloud/v1/surah/${sureId}/tr.transliteration`,
        );
        if (!response.ok) throw new Error("TR transliterasyon yok");
        const data = await response.json();
        const ayahs = data?.data?.ayahs || [];
        const nextMap = buildMap(ayahs);
        if (Object.keys(nextMap).length) {
          setTranslitMap(nextMap);
          return;
        }
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
          setTranslitMap(buildMap(fallbackAyahs));
        } catch (fallbackError) {
          console.error(fallbackError);
          setTranslitMap({});
        }
      }
    };

    fetchTransliteration();
  }, [sureId]);

  useEffect(() => {
    const fetchVerses = async () => {
      if (!sureId) return;
      setLoading(true);
      try {
        const [arabicResponse, turkishResponse] = await Promise.all([
          fetch(`https://api.alquran.cloud/v1/surah/${sureId}/quran-uthmani`),
          fetch(`https://api.alquran.cloud/v1/surah/${sureId}/tr.diyanet`),
        ]);
        if (!arabicResponse.ok || !turkishResponse.ok) {
          throw new Error("API hatası");
        }
        const arabicData = await arabicResponse.json();
        const turkishData = await turkishResponse.json();
        const arabicAyahs = arabicData?.data?.ayahs || [];
        const turkishAyahs = turkishData?.data?.ayahs || [];
        const turkishMap = new Map(
          turkishAyahs.map((ayah) => [ayah.numberInSurah, ayah.text]),
        );
        const mapped = arabicAyahs.map((ayah) => ({
          id: `${sureId}:${ayah.numberInSurah}`,
          sureId,
          ayetNo: ayah.numberInSurah,
          arapca: ayah.text || "",
          turkce: turkishMap.get(ayah.numberInSurah) || "",
          okunus: "",
        }));
        const hasText = mapped.some((ayet) => ayet.arapca || ayet.turkce);
        setApiAyetler(hasText ? mapped : []);
      } catch (error) {
        try {
          const trResponse = await fetch(
            "https://api.quran.com/api/v4/resources/translations?language=tr",
          );
          if (!trResponse.ok) throw new Error("Quran.com API hatasi");
          const trData = await trResponse.json();
          const translations = trData.translations || [];
          const diyanet = translations.find((t) =>
            (t.name || "").toLowerCase().includes("diyanet"),
          );
          const translationId = diyanet?.id || translations[0]?.id || null;
          if (!translationId) throw new Error("Ceviri bulunamadi");

          const response = await fetch(
            `https://api.quran.com/api/v4/verses/by_chapter/${sureId}?language=tr&words=false&translations=${translationId}&fields=text_uthmani,text_imlaei,text_uthmani_simple&per_page=300`,
          );
          if (!response.ok) throw new Error("Quran.com API hatasi");
          const data = await response.json();
          const verses = data.verses || [];
          const mapped = verses.map((verse) => {
            const arapca =
              verse.text_uthmani ||
              verse.text_imlaei ||
              verse.text_uthmani_simple ||
              "";
            return {
              id: verse.id,
              sureId,
              ayetNo: verse.verse_number,
              arapca,
              turkce: verse.translations?.[0]?.text || "",
              okunus: "",
            };
          });
          const hasText = mapped.some((ayet) => ayet.arapca || ayet.turkce);
          setApiAyetler(hasText ? mapped : []);
        } catch (fallbackError) {
          console.error(fallbackError);
          setApiAyetler([]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchVerses();
  }, [sureId]);

  useEffect(() => {
    const favorites = readFavorites();
    setIsFavorite(favorites.has(sureId));
  }, [sureId]);

  useEffect(() => {
    const loadProgress = async () => {
      if (!user || !sureId) {
        setProgress(null);
        return;
      }
      const data = await getSurahProgress(user.uid, sureId);
      setProgress(data);
    };
    loadProgress();
  }, [user, sureId]);

  const handleMarkRead = async (ayetNo) => {
    if (!user) {
      setProgressError("Ilerleme icin giris yap.");
      return;
    }
    setProgressError("");
    const payload = {
      sureId,
      sureAd: localName || `Sure ${sureId}`,
      lastAyetNo: ayetNo,
      totalAyet,
    };
    await setSurahProgress(user.uid, payload);
    setProgress(payload);
  };

  return (
    <div className="reading-container">
      {/* Üst Reklam Alanı - Hazırda bekliyor */}
      <div className="ad-banner">Reklam Alanı</div>

      <div className="reading-header">
        <div className="reading-title">
          {localName ? `${localName} Suresi` : `Sure ${id}`}
        </div>
        <button
          type="button"
          className={`fav-toggle reading-fav ${isFavorite ? "is-active" : ""}`}
          onClick={() => {
            const nextFavorites = readFavorites();
            if (nextFavorites.has(sureId)) {
              nextFavorites.delete(sureId);
              setIsFavorite(false);
            } else {
              nextFavorites.add(sureId);
              setIsFavorite(true);
            }
            writeFavorites(nextFavorites);
          }}
          aria-pressed={isFavorite}
        >
          {isFavorite ? "★ Favoriden çıkar" : "☆ Favoriye ekle"}
        </button>
      </div>

      <div className="reading-progress">
        {user ? (
          <>
            <div className="progress-label">
              Ilerleme: {lastAyetNo}/{totalAyet} (%{progressPercent})
            </div>
            <div className="progress-bar">
              <span style={{ width: `${progressPercent}%` }} />
            </div>
          </>
        ) : (
          <div className="progress-label progress-guest">
            Ilerleme kaydi icin giris yap.
          </div>
        )}
        {progressError && <div className="progress-error">{progressError}</div>}
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

      <audio ref={audioRef} preload="none" />

      {loading && <div className="loading-text">İçerik yükleniyor...</div>}

      {!loading && !hasAyet && (
        <div className="empty-state">
          Bu sure için içerik yüklenemedi. İnternet bağlantısını kontrol edip
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
          onMarkRead={() => handleMarkRead(ayet.ayetNo)}
          isRead={Boolean(lastAyetNo && ayet.ayetNo <= lastAyetNo)}
        />
      ))}
    </div>
  );
}
export default ReadingPage;
