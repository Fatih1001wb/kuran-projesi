import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { kitaplarListesi } from "../data/kitaplarData";

function BookDetail() {
  const { id } = useParams();
  const bookId = Number(id);
  const kitap = kitaplarListesi.find((item) => item.id === bookId);

  if (!kitap) {
    return (
      <div className="page-content">
        <div className="hero-section books-hero">
          <h1>İçerik bulunamadı</h1>
          <p className="hero-subtitle">Aradığınız kitap mevcut değil</p>
        </div>
        <div className="books-detail">
          <Link className="book-btn" to="/kitaplar">
            Kitaplara dön
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content books-page">
      <div className="hero-section books-hero">
        <h1>{kitap.ad}</h1>
        <p className="hero-subtitle">{kitap.aciklama}</p>
      </div>

      <div className="books-detail">
        <div className="books-card">
          <h3>Bilgiler</h3>
          <div className="book-detail-grid">
            <div>
              <span className="book-detail-label">Dil</span>
              <span className="book-detail-value">{kitap.dil}</span>
            </div>
            <div>
              <span className="book-detail-label">Sayfa</span>
              <span className="book-detail-value">{kitap.sayfa}</span>
            </div>
            {kitap.sure && kitap.ayet ? (
              <>
                <div>
                  <span className="book-detail-label">Sure</span>
                  <span className="book-detail-value">{kitap.sure}</span>
                </div>
                <div>
                  <span className="book-detail-label">Ayet</span>
                  <span className="book-detail-value">{kitap.ayet}</span>
                </div>
              </>
            ) : null}
          </div>
          {kitap.id === 1 && (
            <div className="book-actions">
              <Link className="book-btn" to="/quran?page=1">
                Kur'an Okumaya Başla
              </Link>
            </div>
          )}
        </div>

        <div className="books-card">
          <h3>Okuma Önizlemesi</h3>
          <div className="book-reader">
            <div className="book-reader-header">{kitap.ad}</div>
            {Array.isArray(kitap.okumaOnizleme) &&
            kitap.okumaOnizleme.length ? (
              kitap.okumaOnizleme.map((paragraf, index) => (
                <p
                  key={`${kitap.id}-preview-${index}`}
                  className="book-reader-text"
                >
                  {paragraf}
                </p>
              ))
            ) : (
              <p className="book-reader-text">
                {kitap.aciklama ||
                  "Bu kitap için henüz okuma içeriği eklenmedi."}
              </p>
            )}
          </div>
          <Link className="book-btn" to="/kitaplar">
            Kitaplara dön
          </Link>
        </div>
      </div>
    </div>
  );
}

export default BookDetail;
