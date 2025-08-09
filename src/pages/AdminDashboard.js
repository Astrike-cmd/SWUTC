import React, { useEffect, useState } from "react";
import { db } from "../firebase-config";
import {
  collection,
  getDocs,
  query,
  orderBy,
  // eslint-disable-next-line
  limit,
  // eslint-disable-next-line
  where,
} from "firebase/firestore";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const [usageLogs, setUsageLogs] = useState([]);
  const [tenantsMap, setTenantsMap] = useState({}); 
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    setError("");
    try {
      
      const tenantsSnapshot = await getDocs(collection(db, "tenants"));
      const tmap = {};
      tenantsSnapshot.forEach((doc) => {
        const data = doc.data();

        if (data.uid) tmap[data.uid] = data.flatNo || data.flat || data.flatNoString;
        if (data.email) tmap[data.email] = data.flatNo || data.flat || data.flatNoString;
      });
      setTenantsMap(tmap);

      // 2) Load waterUsage logs (newest first)
      const q = query(collection(db, "waterUsage"), orderBy("date", "desc"));
      const snapshot = await getDocs(q);
      const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));

      setUsageLogs(list);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load data. Check console for details.");
    } finally {
      setLoading(false);
    }
  }

  function shortId(uid) {
    if (!uid) return "—";
    return uid.slice(0, 6) + (uid.length > 6 ? "…" : "");
  }

  function formatDate(ts) {
    if (!ts) return "—";
    // ts may be Firestore Timestamp
    if (ts.toDate) {
      const d = ts.toDate();
      return d.toLocaleString();
    }
    // fallback string
    try {
      const d = new Date(ts);
      return d.toLocaleString();
    } catch {
      return String(ts);
    }
  }

  const toggleExpand = (id) => {
    setExpanded((prev) => (prev === id ? null : id));
  };

  return (
    <div className="admindash-wrap">
      <h2>Admin Dashboard — Usage Logs</h2>

      {error && <div className="error">{error}</div>}
      {loading ? (
        <div className="loading">Loading usage logs…</div>
      ) : usageLogs.length === 0 ? (
        <div className="empty">No usage logs found.</div>
      ) : (
        <div className="table-wrap">
          <table className="usage-table">
            <thead>
              <tr>
                <th>Tenant</th>
                <th>Date</th>
                <th>Total (L)</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {usageLogs.map((log) => {
                const uid = log.uid || log.userId || "unknown";
                // try to find flat number by uid or by email if stored
                const flatByUid = tenantsMap[uid];
                const flatByEmail = tenantsMap[log.email]; // if usage had email
                const displayName = flatByUid || flatByEmail || shortId(uid);

                return (
                  <React.Fragment key={log.id}>
                    <tr className="row-main">
                      <td>{displayName}</td>
                      <td>{formatDate(log.date)}</td>
                      <td>{log.totalLitres ?? calculateTotalFromUsage(log.usage)}</td>
                      <td>
                        <button
                          className="btn"
                          onClick={() => toggleExpand(log.id)}
                        >
                          {expanded === log.id ? "Hide" : "View Details"}
                        </button>
                      </td>
                    </tr>

                    {expanded === log.id && (
                      <tr className="row-details">
                        <td colSpan="4">
                          <div className="details-panel">
                            <h4>Breakdown</h4>
                            {log.usage ? (
                              <div className="breakdown-grid">
                                {Object.entries(log.usage).map(([key, val]) => (
                                  <div key={key} className="breakdown-item">
                                    <div className="cat">{prettyName(key)}</div>
                                    <div className="val">{val} times</div>
                                    {/* if possible show litre estimate per category if stored in doc */}
                                    <div className="litres">
                                      {computeLitres(key, val)} L estimated
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div>No category data available for this entry.</div>
                            )}

                            <div className="details-footer">
                              <strong>Total:</strong>{" "}
                              {log.totalLitres ?? calculateTotalFromUsage(log.usage)} L
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ---------- Helper functions ---------- */

/** prettyName: turn key strings into readable labels */
function prettyName(key) {
  const map = {
    toothbrushing: "Toothbrushing",
    shower: "Shower",
    washingMachine: "Washing Machine",
    dishwashing: "Dishwashing",
    cooking: "Cooking",
    drinking: "Drinking",
    cleaning: "Cleaning / Mopping",
    gardening: "Gardening / Plants",
  };
  return map[key] || key;
}

/** presets (must match TenantDashboard presets) */
const PRESETS = {
  toothbrushing: 2,
  shower: 50,
  washingMachine: 60,
  dishwashing: 15,
  cooking: 10,
  drinking: 3,
  cleaning: 20,
  gardening: 15,
};

/** computeLitres: estimate litres from count */
function computeLitres(key, times) {
  const per = PRESETS[key] ?? 0;
  const t = Number(times) || 0;
  return per * t;
}

/** calculateTotalFromUsage: sum category estimates if total not stored */
function calculateTotalFromUsage(usageObj) {
  if (!usageObj) return 0;
  return Object.entries(usageObj).reduce((sum, [k, v]) => {
    return sum + computeLitres(k, v);
  }, 0);
}