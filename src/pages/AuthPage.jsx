import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function AuthPage() {
  const { signIn, signUp, user, loading, hasConfig } = useAuth();
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    if (!hasConfig) {
      setError("Firebase ayarlari eksik. .env dosyasini doldur.");
      return;
    }
    setPending(true);
    try {
      if (mode === "login") {
        await signIn(email, password);
      } else {
        await signUp(email, password);
      }
      navigate("/");
    } catch (err) {
      setError(err?.message || "Islem basarisiz.");
    } finally {
      setPending(false);
    }
  };

  if (loading) {
    return (
      <div className="page-content auth-page">
        <div className="auth-card">Yukleniyor...</div>
      </div>
    );
  }

  if (user) {
    return (
      <div className="page-content auth-page">
        <div className="auth-card">
          <h2>Merhaba!</h2>
          <p>Giris yapmissin. Ilerleme artik kayitli.</p>
          <Link to="/" className="auth-link">
            Ana sayfaya don
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content auth-page">
      <div className="auth-card">
        <h2>{mode === "login" ? "Giris Yap" : "Kayit Ol"}</h2>
        <p className="auth-subtitle">
          Ilerleme kaydi icin hesap gereklidir.
        </p>
        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            E-posta
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>
          <label>
            Sifre
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>
          {error && <div className="auth-error">{error}</div>}
          <button type="submit" disabled={pending}>
            {pending
              ? "Isleniyor..."
              : mode === "login"
                ? "Giris Yap"
                : "Kayit Ol"}
          </button>
        </form>
        <button
          type="button"
          className="auth-switch"
          onClick={() => setMode(mode === "login" ? "signup" : "login")}
        >
          {mode === "login"
            ? "Hesabin yok mu? Kayit ol"
            : "Zaten hesabin var mi? Giris yap"}
        </button>
      </div>
    </div>
  );
}

export default AuthPage;
