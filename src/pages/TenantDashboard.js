import React, { useState } from "react";
import { db, auth } from "../firebase-config";
import { collection, addDoc, serverTimestamp, doc, getDoc } from "firebase/firestore";
import "./TenantDashboard.css";

function TenantDashboard() {
  const categories = [
    { name: "Toothbrushing", key: "toothbrushing", litres: 2, tip: "Turn off the tap while brushing to save water." },
    { name: "Shower", key: "shower", litres: 50, tip: "Keep showers short and efficient." },
    { name: "Washing Machine", key: "washingMachine", litres: 60, tip: "Run full loads to save water and energy." },
    { name: "Dishwashing", key: "dishwashing", litres: 15, tip: "Use a basin instead of running water continuously." },
    { name: "Cooking", key: "cooking", litres: 10, tip: "Steam vegetables instead of boiling to use less water." },
    { name: "Drinking", key: "drinking", litres: 3, tip: "Store drinking water in the fridge instead of running the tap." },
    { name: "Cleaning / Mopping", key: "cleaning", litres: 20, tip: "Use a bucket instead of running water for cleaning." },
    { name: "Gardening / Plants", key: "gardening", litres: 15, tip: "Water plants early in the morning or late evening to reduce evaporation." }
  ];

  const [usage, setUsage] = useState(
    categories.reduce((acc, category) => ({ ...acc, [category.key]: 0 }), {})
  );

  const handleChange = (categoryKey, times) => {
    setUsage((prev) => ({ ...prev, [categoryKey]: parseInt(times) }));
  };

  const totalLitres = categories.reduce(
    (sum, category) => sum + (usage[category.key] * category.litres),
    0
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) return alert("Not logged in");

    try {
      // 🔹 Get tenant flat number from tenants collection
      const tenantRef = doc(db, "tenants", user.uid);
      const tenantSnap = await getDoc(tenantRef);

      let flatNumber = "Unknown";
      if (tenantSnap.exists()) {
        flatNumber = tenantSnap.data().flatNumber;
      }

      // 🔹 Save usage log with flatNumber
      await addDoc(collection(db, "waterUsage"), {
        uid: user.uid,
        flatNumber: flatNumber,
        usage,
        totalLitres,
        date: serverTimestamp()
      });

      alert("Usage logged!");
      setUsage(categories.reduce((acc, category) => ({ ...acc, [category.key]: 0 }), {}));
    } catch (err) {
      console.error(err);
      alert("Error logging usage");
    }
  };

  return (
    <div className="tenant-dashboard">
      <h2>Tenant Dashboard</h2>
      <form onSubmit={handleSubmit}>
        <div className="usage-grid">
          {categories.map((category) => (
            <div key={category.key} className="usage-card">
              <label>{category.name}</label>
              <select
                value={usage[category.key]}
                onChange={(e) => handleChange(category.key, e.target.value)}
              >
                {Array.from({ length: 11 }, (_, i) => (
                  <option key={i} value={i}>{i} times</option>
                ))}
              </select>
              <p className="litres-info">
                {usage[category.key] * category.litres} L estimated
              </p>
              <p className="usage-tip">{category.tip}</p>
            </div>
          ))}
        </div>
        <h3 className="total-usage">Total Daily Usage: {totalLitres} L</h3>
        <button type="submit" className="submit-btn">Log Usage</button>
      </form>
    </div>
  );
}

export default TenantDashboard;