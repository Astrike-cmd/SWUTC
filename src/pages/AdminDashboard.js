import React, { useState, useEffect } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase-config";
import { collection, getDocs, doc, setDoc } from "firebase/firestore";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const [flat, setFlat] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [tenants, setTenants] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch existing tenants
  const fetchTenants = async () => {
    const tenantsSnap = await getDocs(collection(db, "tenants"));
    setTenants(tenantsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  useEffect(() => {
    fetchTenants();
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      // Auto-generate email from flat number
      const email = `${flat}@swutc.com`;

      // Create Firebase Auth user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      // ✅ Save tenant in Firestore using UID as the doc ID
      await setDoc(doc(db, "tenants", uid), {
        uid,
        name,
        flatNumber: flat,
        email,
        createdAt: new Date()
      });

      setSuccess(`Tenant for Flat ${flat} added successfully!`);
      setFlat("");
      setName("");
      setPassword("");
      fetchTenants();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>

      <form onSubmit={handleRegister} className="admin-form">
        <input
          type="text"
          placeholder="Flat Number"
          value={flat}
          onChange={(e) => setFlat(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Tenant Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
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

      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}

      <h3>Existing Tenants</h3>
      <ul>
        {tenants.map((tenant) => (
          <li key={tenant.id}>
            {tenant.name} – Flat {tenant.flatNumber} ({tenant.email})
          </li>
        ))}
      </ul>
    </div>
  );
}