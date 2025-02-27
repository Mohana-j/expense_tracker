import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/navbar.css";

const Navbar = () => {
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const navigate = useNavigate();

    // ✅ Logout function
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login"); // Redirect to login page
    };

    return (
        <nav className="navbar">
            {/* Logo / Brand */}
            <div className="navbar-brand">
                <h1>Expense Tracker</h1>
            </div>

            

            {/* User Actions */}
            <div className="user-actions">
                <Link to="/" className="btn">Home</Link>
                <Link to="/register" className="btn">Register</Link>
                <Link to="/login" className="btn btn-primary">Login</Link>

                {/* Profile Dropdown */}
                <div 
                    className="profile-menu" 
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                >
                    <span className="profile-icon">👤</span>
                    {showProfileMenu && (
                        <div className="dropdown-menu">
                            <Link to="/amount">Account</Link>
                            <Link to="/login" onClick={handleLogout} className="logout">Logout</Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
