import React from "react";
import { Link, NavLink } from "react-router-dom";
import "./Sidebar.css";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand">
        <Link to="/">SWUTC</Link>
      </div>

      <nav className="menu">
        <NavLink to="/" end className="item">
          Home
        </NavLink>
        <NavLink to="/login" className="item">
          Tenant Login
        </NavLink>
        <NavLink to="/admin-login" className="item">
          Admin Login
        </NavLink>
        <NavLink to="/landlord-login" className="item">
          Landlord Login
        </NavLink>
      </nav>
    </aside>
  );
}