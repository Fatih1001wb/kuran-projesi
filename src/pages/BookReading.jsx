import React from "react";
import { useParams, Link } from "react-router-dom";
import { kitaplarListesi } from "../data/kitaplarData";
import { kitapIcerikMap } from "../data/kitaplarIcerik";

function BookReading() {
  const { id } = useParams();
  const bookId = Number(id);
  const kitap = kitaplarListesi.find((item) => item.id === bookId);
  const kitapIcerik = kitapIcerikMap[bookId];

  if (!kitap) {
    return (
      <div className="page-content">
        <div className="hero-section books-hero">
          <h1>Icerik bulunamadi</h1>
          <p className="hero-subtitle">Aradiginiz kitap mevcut degil</p>
        </div>
        <div className="books-detail">
          <Link className="book-btn" to="/kitaplar">
            Kitaplara don
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content books-page">
      <div className="hero-section books-hero">
        <h1>{kitap.ad}</h1>
        <p className="hero-subtitle">Tam metin okuma</p>
      </div>

      <div className="books-detail">
        <div className="books-card">
          <h3>Tam Metin</h3>
          {kitapIcerik?.sections?.length ? (
            <div className="book-reader">
              <div className="book-reader-header">{kitap.ad}</div>
              {kitapIcerik.sections.map((section, index) => (
                <div
                  key={`${kitap.id}-full-${index}`}
                  className="book-reader-text"
                >
                  {section.title ? <strong>{section.title}</strong> : null}
                  {section.text ? <p>{section.text}</p> : null}
                </div>
              ))}
            </div>
          ) : (
            <p className="book-reader-text">
              Tam metin altyapisi hazir. Telifsiz kaynaklar eklendiginde bu
              bolum otomatik guncellenecek.
            </p>
          )}
          <div className="book-actions">
            <Link className="book-btn" to={`/kitap/${kitap.id}`}>
              Kitap detayina don
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookReading;
