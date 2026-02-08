import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <header className="navbar">
      <div className="logo-container">
        <Link to="/" className="logo" style={{ textDecoration: "none" }}>
          Kur'an<span>Merkezi</span>
        </Link>
        <p className="tagline">Dijital Dini Portal</p>
      </div>
      <nav>
        <Link to="/">Ana Sayfa</Link>
        <Link to="/sureler">Sureler</Link>
        <Link to="/kitaplar">Kitaplar</Link>
      </nav>
    </header>
  );
}
export default Navbar;
