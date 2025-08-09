import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase-config';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // your existing CSS

function Login() {
  const [flatNo, setFlatNo] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const email = `${flatNo}@swutc.com`;
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/tenant-dashboard');
    } catch (err) {
      setErr('Invalid flat number or password');
    }
  };

  return (
    <div className="login-container">
      <h2>Tenant Login</h2>
      <form onSubmit={handleLogin}>
        <label>Flat No.:</label>
        <input value={flatNo} onChange={(e)=>setFlatNo(e.target.value)} placeholder="e.g., 101" required />
        <label>Password:</label>
        <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Password" required />
        <button type="submit">Login</button>
        {err && <p className="error">{err}</p>}
      </form>
    </div>
  );
}

export default Login;