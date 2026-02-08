import React from "react";

function AyetCard({
  ayet,
  mode = "arabic",
  onListen,
  isPlaying = false,
  onBookmark,
  isBookmarked = false,
}) {
  const sureLabel = ayet.sureAd
    ? `${ayet.sureAd} Suresi`
    : `Sure ${ayet.sureId}`;
  return (
    <div className="verse-card" title={sureLabel}>
      <div className="verse-header">
        <div className="verse-meta">
          <span className="verse-number">
            {ayet.sureId}:{ayet.ayetNo}
          </span>
          <span className="verse-surah">{sureLabel}</span>
        </div>
        <div className="actions">
          <button type="button" onClick={onListen}>
            {isPlaying ? "⏸ Çalıyor" : "▶ Dinle"}
          </button>
          {onBookmark ? (
            <button type="button" onClick={onBookmark}>
              {isBookmarked ? "🔖 İşaretli" : "📌 İşaretle"}
            </button>
          ) : null}
        </div>
      </div>
      {mode === "arabic" ? (
        <>
          <p className="arabic-text">{ayet.arapca}</p>
          {ayet.okunus && <p className="verse-translit">{ayet.okunus}</p>}
        </>
      ) : (
        <>
          <p className="turkish-trans">{ayet.turkce}</p>
          {ayet.okunus && <p className="verse-translit">{ayet.okunus}</p>}
        </>
      )}
    </div>
  );
}
export default AyetCard;
