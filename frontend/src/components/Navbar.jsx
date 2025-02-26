import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/navbar.css";

const Navbar = () => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <nav className="navbar">
      {/* Logo / Brand */}
      <div className="navbar-brand">
        <h1>Expense Tracker</h1>
      </div>

      {/* Navigation Links */}
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/features">Features</Link>
        <Link to="/pricing">Pricing</Link>
        <Link to="/reports">Reports</Link>
      </div>

      {/* User Actions */}
      <div className="user-actions">
        <Link to="/register" className="btn">Register</Link>
        <Link to="/login" className="btn btn-primary">Login</Link>

        {/* Profile Dropdown */}
        <div
          className="profile-menu"
          onMouseEnter={() => setShowProfileMenu(true)}
          onMouseLeave={() => setShowProfileMenu(false)}
        >
          <span className="profile-icon">👤</span>
          {showProfileMenu && (
            <div className="dropdown-menu">
              <Link to="/profile">My Profile</Link>
              <Link to="/settings">Settings</Link>
              <Link to="/logout" className="logout">Logout</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
