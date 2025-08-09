import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase-config';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
  const [flatNo, setFlatNo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const email = `${flatNo}@swutc.com`;
      await signInWithEmailAndPassword(auth, email, password);

      // Decide based on email
      if (email.toLowerCase() === "admin@swutc.com") {
        navigate("/admin-dashboard");
      } else {
        navigate("/tenant-dashboard");
      }
    } catch (err) {
      setError("Invalid flat number or password");
    }
  };

  return (
    <div className="login-container">
      <h2>Tenant Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Flat Number"
          value={flatNo}
          onChange={(e) => setFlatNo(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}

export default Login;