import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase-config";
import "../pages/LandlordDashboard.css";

const LandlordDashboard = () => {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [filterFlat, setFilterFlat] = useState("");

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const logsRef = collection(db, "waterUsage");
        const snapshot = await getDocs(logsRef);
        const logsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setLogs(logsData);
        setFilteredLogs(logsData); // default: show all
      } catch (error) {
        console.error("Error fetching water usage logs:", error);
      }
    };

    fetchLogs();
  }, []);

  const handleFilter = (e) => {
    const flat = e.target.value;
    setFilterFlat(flat);
    if (flat === "") {
      setFilteredLogs(logs); // show all if no filter
    } else {
      setFilteredLogs(logs.filter(log => log.flatNumber === flat));
    }
  };

  return (
    <div className="landlord-dashboard">
      <h2>Landlord Dashboard</h2>

      {/* 🔍 Filter Section */}
      <div className="filter-bar">
        <label>Filter by Flat Number: </label>
        <input
          type="text"
          placeholder="Enter flat no."
          value={filterFlat}
          onChange={handleFilter}
        />
        <button onClick={() => setFilteredLogs(logs)}>Reset</button>
      </div>

      {filteredLogs.length === 0 ? (
        <p>No logs available yet.</p>
      ) : (
        <div className="logs-container">
          {filteredLogs.map(log => (
            <div key={log.id} className="log-card">
              <h3>Flat: {log.flatNumber ? log.flatNumber : "Unknown"}</h3>
              <p><strong>Date:</strong> {log.date?.toDate ? log.date.toDate().toLocaleString() : log.date}</p>
              <p><strong>Total Litres:</strong> {log.totalLitres}</p>
              <div className="usage-details">
                <h4>Usage Breakdown:</h4>
                <ul>
                  {Object.entries(log.usage || {}).map(([key, value]) => (
                    <li key={key}>
                      {key}: {value}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LandlordDashboard;