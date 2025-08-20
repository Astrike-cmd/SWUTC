import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";

import Home from "./pages/Home";
import Login from "./pages/Login";               
import AdminLogin from "./pages/AdminLogin";
import LandlordLogin from "./pages/LandlordLogin";

import TenantDashboard from "./pages/TenantDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import LandlordDashboard from "./pages/LandlordDashboard";

function App() {
  return (
    <Router>
      <div style={{ display: "flex" }}>
        <Sidebar />
        {/* Keep this margin in sync with Sidebar width */}
        <div style={{ marginLeft: "200px", padding: "20px", flexGrow: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            {/* keep if you use a generic login */}
            <Route path="/login" element={<Login />} />

            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/landlord-login" element={<LandlordLogin />} />

            <Route path="/tenant-dashboard" element={<TenantDashboard />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/landlord-dashboard" element={<LandlordDashboard />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;