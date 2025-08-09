import React, { useState } from 'react';
import { createUserWithEmailAndPassword, updatePassword } from 'firebase/auth';
import { auth } from '../firebase-config';
import './AdminDashboard.css';

function AdminDashboard() {
  const [flatNo, setFlatNo] = useState("");
  const [password, setPassword] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleAddTenant = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, `${flatNo}@swutc.com`, password);
      setMessage(`Tenant for Flat ${flatNo} created successfully!`);
      setFlatNo("");
      setPassword("");
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      const user = auth.currentUser;
      await updatePassword(user, newPassword);
      setMessage(`Password updated for ${resetEmail}`);
      setResetEmail("");
      setNewPassword("");
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>

      {message && <p className="message">{message}</p>}

      <div className="admin-section">
        <h3>Add New Tenant</h3>
        <form onSubmit={handleAddTenant}>
          <input
            type="text"
            placeholder="Flat Number"
            value={flatNo}
            onChange={(e) => setFlatNo(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Set Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Add Tenant</button>
        </form>
      </div>

      <div className="admin-section">
        <h3>Reset Tenant Password</h3>
        <form onSubmit={handleResetPassword}>
          <input
            type="email"
            placeholder="Tenant Email"
            value={resetEmail}
            onChange={(e) => setResetEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <button type="submit">Reset Password</button>
        </form>
      </div>
    </div>
  );
}

export default AdminDashboard;