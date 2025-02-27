import React from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import "../styles/footer.css";

const Footer = () => {
    return (
    <footer className="footer">
        <div className="footer-container">
        {/* Company Info */}
        <div className="footer-section">
        <h3>Expense Tracker</h3>
        <p>Manage your expenses efficiently with our intuitive platform.</p>
        </div>

        {/* Features */}
        <div className="footer-section">
        <h3>Features</h3>
        <ul>
        <li><a href="#">Expense Reports</a></li>
        <li><a href="#">Budget Management</a></li>
        <li><a href="#">Financial Analytics</a></li>
        </ul>
        </div>

        {/* Resources */}
        <div className="footer-section">
        <h3>Resources</h3>
        <ul>
        <li><a href="#">Help Center</a></li>
        <li><a href="#">Privacy Policy</a></li>
        <li><a href="#">Terms of Service</a></li>
        </ul>
        </div>

        {/* Social Media */}
        <div className="footer-section social-media">
        <h3>Follow Us</h3>
        <div className="footer-icons">
        <a href="#" target="_blank" rel="noopener noreferrer"><FaFacebook /></a>
        <a href="#" target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
        <a href="#" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
        <a href="#" target="_blank" rel="noopener noreferrer"><FaLinkedin /></a>
        </div>
        </div>
        </div>

        {/* Copyright */}
        <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Expense Tracker. All rights reserved.</p>
        </div>
        </footer>
    );
};

export default Footer;
