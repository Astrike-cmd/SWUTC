import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Components
import Sidebar from './components/Sidebar';
import RequireAuth from './components/RequireAuth';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import TenantDashboard from './pages/TenantDashboard';

function App() {
  return (
    <Router>
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <div style={{ marginLeft: '200px', padding: '20px', flexGrow: 1 }}>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin-login" element={<AdminLogin />} />

            {/* Protected admin route */}
            <Route
              path="/admin-dashboard"
              element={
                <RequireAuth adminOnly={true}>
                  <AdminDashboard />
                </RequireAuth>
              }
            />

            {/* Tenant dashboard (unprotected for now) */}
            <Route path="/tenant-dashboard" element={<TenantDashboard />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;