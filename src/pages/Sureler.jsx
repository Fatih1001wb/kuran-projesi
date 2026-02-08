import React, { useEffect, useMemo, useState } from "react";
import { sureListesi } from "../data/surelerData";
import { Link } from "react-router-dom";

function Sureler() {
  const [searchTerm, setSearchTerm] = useState("");
  const [appliedQuery, setAppliedQuery] = useState("");
  const [motivation, setMotivation] = useState("");
  const [sureler, setSureler] = useState(sureListesi);
  const [favoriteIds, setFavoriteIds] = useState(new Set());
  const favoritesKey = "favoriteSureIds";

  const normalizeText = (value) =>
    value
      .toLocaleLowerCase("tr-TR")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

  const filteredSureler = useMemo(() => {
    const normalizedQuery = normalizeText(appliedQuery.trim());
    return sureler.filter((sure) => {
      if (!normalizedQuery) return true;
      return normalizeText(sure.ad).includes(normalizedQuery);
    });
  }, [appliedQuery, sureler]);

  useEffect(() => {
    const messages = [
      "Kalbine iyi gelen sureyi seç, huzurla oku.",
      "Bugün bir ayet, kalbini aydınlatsın.",
      "Okudukça anlamı derinleşen bir yolculuk.",
      "Sakin bir zihin, güzel bir niyet.",
      "Kısa bir sure bile huzur verir.",
      "Her okunuş yeni bir fark ediştir.",
      "Günün bereketi, güzel bir niyetle başlar.",
      "Kalbine dokunan sureyi bul ve devam et.",
      "Okumaya küçük bir adımla başla.",
      "Bugün bir sure, yarın bir huzur.",
      "Sözlerin en güzeliyle buluş.",
      "Dinginlik, düzenli okumayla gelir.",
    ];
    const randomIndex = Math.floor(Math.random() * messages.length);
    setMotivation(messages[randomIndex]);
  }, []);

  useEffect(() => {
    const fetchChapters = async () => {
      try {
        const response = await fetch("https://api.quran.com/api/v4/chapters");
        if (!response.ok) throw new Error("API hatası");
        const data = await response.json();
        const chapters = data.chapters || [];
        const merged = chapters.map((chapter) => {
          const local = sureListesi.find((item) => item.id === chapter.id);
          return {
            id: chapter.id,
            ad: local?.ad || chapter.name_simple || chapter.name_arabic,
            ayetSayisi: chapter.verses_count,
          };
        });
        if (merged.length) setSureler(merged);
      } catch (error) {
        console.error(error);
      }
    };

    fetchChapters();
  }, []);

  useEffect(() => {
    const loadFavorites = () => {
      try {
        const raw = localStorage.getItem(favoritesKey);
        const parsed = raw ? JSON.parse(raw) : [];
        setFavoriteIds(new Set(Array.isArray(parsed) ? parsed : []));
      } catch {
        setFavoriteIds(new Set());
      }
    };

    loadFavorites();
    const handleStorage = () => loadFavorites();
    window.addEventListener("storage", handleStorage);
    window.addEventListener("favorites:updated", handleStorage);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("favorites:updated", handleStorage);
    };
  }, []);

  return (
    <div className="page-content">
      <div className="hero-section">
        <h1>Sureler</h1>
        <p className="hero-subtitle">Kur'an-ı Kerim Sureleri</p>
        <div className="hero-badges">
          <span className="hero-badge">📖 Okuma</span>
          <span className="hero-badge">🎧 Dinleme</span>
          <span className="hero-badge">🔖 Favori</span>
        </div>
        <div className="hero-stats">
          <div className="hero-stat">
            <span className="hero-stat-value">114</span>
            <span className="hero-stat-label">Sure</span>
          </div>
          <div className="hero-divider" />
          <div className="hero-stat">
            <span className="hero-stat-value">6236</span>
            <span className="hero-stat-label">Ayet</span>
          </div>
        </div>
      </div>

      <section className="featured-section">
        <div className="divider-strip" role="note">
          <span className="divider-icon">✨</span>
          <span className="divider-text">{motivation}</span>
        </div>

        <div className="sure-search">
          <div className="search-field">
            <label htmlFor="sure-ara">Arama</label>
            <div className="search-input-wrapper">
              <span className="search-icon" aria-hidden="true">
                🔍
              </span>
              <input
                id="sure-ara"
                type="text"
                value={searchTerm}
                onChange={(event) => {
                  const value = event.target.value;
                  setSearchTerm(value);
                  setAppliedQuery(value);
                  if (!value.trim()) {
                    setAppliedQuery("");
                  }
                }}
                placeholder="Sure adı yazın (örn: Fâtiha)"
                className="search-input"
              />
              {searchTerm.trim() ? (
                <button
                  type="button"
                  className="search-clear"
                  onClick={() => {
                    setSearchTerm("");
                    setAppliedQuery("");
                  }}
                  aria-label="Aramayı temizle"
                >
                  ✕
                </button>
              ) : null}
            </div>
          </div>
          <button
            className="search-button"
            type="button"
            onClick={() => setAppliedQuery(searchTerm)}
          >
            Ara
          </button>
          <div className="search-result">{filteredSureler.length} sonuç</div>
        </div>

        <div className="sure-grid">
          {filteredSureler.map((sure) => (
            <Link to={`/oku/${sure.id}`} key={sure.id} className="sure-kutu">
              {favoriteIds.has(sure.id) && (
                <span className="fav-badge">✔ Favori</span>
              )}
              <div className="sure-number">
                {String(sure.id).padStart(3, "0")}
              </div>
              <h3>{sure.ad} Suresi</h3>
              <div className="sure-info">
                <span className="ayet-count">📖 {sure.ayetSayisi} Ayet</span>
              </div>
              <div className="sure-arrow">→</div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Sureler;
