import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../firebase-config";
import "./AdminLogin.css";

// Hardcode the admin email(s) here
const ADMIN_EMAIL = "admin@swutc.com";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);
      const userCred = await signInWithEmailAndPassword(auth, email.trim().toLowerCase(), password);

      // Check if this is the admin account
      if (userCred.user.email !== ADMIN_EMAIL) {
        await signOut(auth);
        setError("This login is for admins only.");
        return;
      }

      navigate("/admin-dashboard");
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">Admin Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Admin Email"
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