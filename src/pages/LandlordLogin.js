import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../firebase-config"; // make sure auth is exported from firebase-config
import "./LandlordLogin.css";

// Change this to whatever landlord email you want to authorize
const LANDLORD_EMAIL = "landlord@swutc.com";

export default function LandlordLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    const emailLower = email.trim().toLowerCase();
    if (emailLower !== LANDLORD_EMAIL) {
      setError("This login is for the landlord only.");
      return;
    }

    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, emailLower, password);
      navigate("/landlord-dashboard");
    } catch (err) {
      // If they somehow sign in but aren't allowed, ensure signout
      try { await signOut(auth); } catch {}
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">Landlord Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Landlord Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="login-input"
            autoComplete="username"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login-input"
            autoComplete="current-password"
            required
          />
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
          {error && <p style={{ color: "#d33", marginTop: 10 }}>{error}</p>}
        </form>
      </div>
    </div>
  );
}