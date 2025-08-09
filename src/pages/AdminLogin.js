import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase-config';
import { useNavigate } from 'react-router-dom';
import './AdminLogin.css';

function AdminLogin() {
  const [email, setEmail] = useState('admin@swutc.com'); 
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      if (email === 'admin@swutc.com') {
        navigate('/admin-dashboard');
      } else {
        setError('Not an admin account.');
      }
    } catch (err) {
      setError('Invalid admin credentials');
    }
  };

  return (
    <div className="adminlogin-container">
      <h2>Admin Login</h2>
      <form onSubmit={handleLogin}>
        <label>Admin Email:</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
        <label>Password:</label>
        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required />
        <button type="submit">Login</button>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
}

export default AdminLogin;