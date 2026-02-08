import React from "react";
import { kitaplarListesi } from "../data/kitaplarData";
import { Link } from "react-router-dom";

function Books() {
  return (
    <div className="page-content books-page">
      <div className="hero-section books-hero">
        <h1>Kur'an ve İslami Metinler</h1>
        <p className="hero-subtitle">İslam'ın önemli metinleri</p>
      </div>

      <div className="sureler-section">
        <div className="books-meta">
          <div className="books-card">
            <h3>Sık Kullanılanlar</h3>
            <div className="chip-row">
              <span className="meta-chip">Kur'an-ı Kerim</span>
              <span className="meta-chip">Yasin Suresi</span>
              <span className="meta-chip">Cevşen</span>
            </div>
          </div>
          <div className="books-card">
            <h3>İlerleme</h3>
            <div className="progress-row">
              <span>Kur'an-ı Kerim</span>
              <span>35%</span>
            </div>
            <div className="progress-bar">
              <span style={{ width: "35%" }} />
            </div>
            <div className="progress-row">
              <span>Yasin Suresi</span>
              <span>60%</span>
            </div>
            <div className="progress-bar">
              <span style={{ width: "60%" }} />
            </div>
          </div>
        </div>
        <div className="books-grid">
          {kitaplarListesi.map((kitap) => (
            <Link
              key={kitap.id}
              to={`/kitap/${kitap.id}`}
              className="book-card"
            >
              <h3>{kitap.ad}</h3>
              <p className="book-description">{kitap.aciklama}</p>
              <div className="book-stats">
                {kitap.sure && kitap.ayet ? (
                  <>
                    <span>{kitap.sure} Sure</span>
                    <span>•</span>
                    <span>{kitap.ayet} Ayet</span>
                  </>
                ) : null}
              </div>
              <div className="book-meta">Dil: {kitap.dil}</div>
              <span className="book-btn">Oku</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
export default Books;
