import React, { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Sureler from "./pages/Sureler";
import Books from "./pages/Books";
import ReadingPage from "./pages/ReadingPage";
import BookDetail from "./pages/BookDetail";
import BookReading from "./pages/BookReading";
import QuranPage from "./pages/QuranPage";
import "./index.css";

function App() {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const isQuran = location.pathname.startsWith("/quran");
  const [lastBookmark, setLastBookmark] = useState(null);
  const dailyDuas = [
    "Rabbimiz! Bize dünyada da iyilik ver, ahirette de iyilik ver ve bizi ateşin azabından koru.",
    "Rabbimiz! Bizi doğru yola ilettikten sonra kalplerimizi eğriltme, bize katından rahmet bağışla.",
    "Rabbim! Bana ilim ver ve beni iyiler arasına kat.",
    "Rabbimiz! Üzerimize sabır yağdır, ayaklarımızı sabit kıl ve kâfirler topluluğuna karşı bize yardım et.",
    "Rabbimiz! Bize eşlerimizden ve zürriyetimizden göz aydınlığı lütfet ve bizi takvâ sahiplerine önder kıl.",
    "Rabbim! Göğsüme ferahlık ver, işimi kolaylaştır, dilimden düğümü çöz ki sözümü anlasınlar.",
    "Rabbim! Beni ve soyumdan gelecekleri namazı dosdoğru kılanlardan eyle.",
  ];

  const today = new Date();
  const startOfYear = new Date(today.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((today - startOfYear) / 86400000);
  const dailyDua = dailyDuas[dayOfYear % dailyDuas.length];

  useEffect(() => {
    const readBookmarks = () => {
      try {
        const raw = localStorage.getItem("quranBookmarks");
        const parsed = raw ? JSON.parse(raw) : [];
        if (!Array.isArray(parsed) || !parsed.length) {
          setLastBookmark(null);
          return;
        }
        const normalized = parsed
          .map((item) => {
            if (typeof item === "string") return null;
            return {
              key: item.key,
              sureId: item.sureId,
              ayetNo: item.ayetNo,
              page: item.page,
              sureAd: item.sureAd,
              savedAt: item.savedAt || 0,
            };
          })
          .filter(Boolean);
        if (!normalized.length) {
          setLastBookmark(null);
          return;
        }
        const latest = normalized.sort(
          (a, b) => (b.savedAt || 0) - (a.savedAt || 0),
        )[0];
        setLastBookmark(latest);
      } catch {
        setLastBookmark(null);
      }
    };

    readBookmarks();
    const handleUpdate = (event) => {
      if (event?.detail) {
        setLastBookmark(event.detail);
      } else {
        readBookmarks();
      }
    };
    window.addEventListener("quran:bookmark-updated", handleUpdate);
    return () =>
      window.removeEventListener("quran:bookmark-updated", handleUpdate);
  }, []);

  return (
    <div className="app-container">
      {/* Navbar her sayfada sabit kalacak */}
      <Navbar />

      <div className="content-wrapper">
        {/* Sol Reklam Alanı */}
        <aside className="sidebar sidebar-left">
          <div className="ad-vertical">
            <h4>📣 Reklam Alanı</h4>
            <p>Buraya reklam yerleştirilebilir.</p>
          </div>
        </aside>

        <main className="main-content">
          <Routes>
            {/* Tarayıcı adresine göre hangi sayfayı göstereceğini seçiyor */}
            <Route path="/" element={<Home />} />
            <Route path="/sureler" element={<Sureler />} />
            <Route path="/kitaplar" element={<Books />} />
            <Route path="/kitap/:id" element={<BookDetail />} />
            <Route path="/kitap/:id/oku" element={<BookReading />} />
            <Route path="/oku/:id" element={<ReadingPage />} />
            <Route path="/quran" element={<QuranPage />} />
          </Routes>
        </main>

        {/* Sağ Reklam Alanı */}
        <aside className="sidebar sidebar-right">
          <div className="ad-vertical">
            {isHome ? (
              <>
                <h4>🌙 Günlük Dua</h4>
                <p className="daily-dua-title">Günün Duası</p>
                <p className="daily-dua-text">"{dailyDua}"</p>
              </>
            ) : isQuran ? (
              <>
                <h4>🔖 Yer İşareti</h4>
                {lastBookmark ? (
                  <>
                    <p className="daily-dua-title">Son İşaretlenen</p>
                    <p className="daily-dua-text">
                      {lastBookmark.sureAd || `Sure ${lastBookmark.sureId}`} •
                      {` ${lastBookmark.sureId}:${lastBookmark.ayetNo}`}
                    </p>
                    <p className="daily-dua-text">
                      Sayfa: {lastBookmark.page || "-"}
                    </p>
                  </>
                ) : (
                  <>
                    <p className="daily-dua-title">Henüz işaret yok</p>
                    <p className="daily-dua-text">
                      Bir ayeti işaretlediğinde burada görünecek.
                    </p>
                  </>
                )}
              </>
            ) : (
              <>
                <h4>📌 Bilgi</h4>
                <p className="daily-dua-title">Son Okuma</p>
                <p className="daily-dua-text">
                  Henüz kaydedilmiş bir okuma yok.
                </p>
              </>
            )}
          </div>
        </aside>
      </div>

      {/* Footer her sayfada sabit */}
      <footer>
        <p>© 2026 Kuran Projesi - Öğrenim İçin Yapılmıştır.</p>
      </footer>
    </div>
  );
}

export default App;
