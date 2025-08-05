import React from 'react';
import './Login.css';

function Login() {
  return (
    <div className="login-container">
      <h1>Login</h1>
      <form>
        <label>Flat No. :</label>
        <input type="text" required />
        
        <label>Password:</label>
        <input type="password" required />
        
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;