import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function Navbar() {
  const { user, signOutUser } = useAuth();
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
        {user ? (
          <span className="nav-user">
            <span className="nav-user-email">{user.email}</span>
            <button type="button" className="nav-button" onClick={signOutUser}>
              Cikis
            </button>
          </span>
        ) : (
          <Link to="/giris">Giris</Link>
        )}
      </nav>
    </header>
  );
}
export default Navbar;
