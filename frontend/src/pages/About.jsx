import React from "react";
import { FaShieldAlt, FaChartPie, FaUsers, FaBullseye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../styles/about.css";

const About = () => {
const navigate = useNavigate();

  return (
    <div className="about-container">
    {/* About Header */}
    <header className="about-header">
    <h1>Empowering You to Take Financial Control</h1>
    <p>Your trusted partner for managing expenses and achieving financial stability.</p>
    </header>

    {/* Our Mission Section */}
    <section className="about-mission">
    <div className="mission-content">
    <h2>Our Mission</h2>
    <p>
    Expense Tracker is built to help individuals and businesses take control of their 
    money with ease. Our goal is to provide a seamless, intuitive, and efficient solution 
    for managing finances effectively.
    </p>
    </div>
    <div className="mission-image">
    <img src="/images/mission.png" alt="Mission" />
    </div>
    </section>

    {/* Unique Features Section */}
    <section className="about-features">
    <h2>Why Choose Expense Tracker?</h2>
    <div className="features-grid">
    <div className="feature-card">
    <FaShieldAlt className="feature-icon" />
    <h3>Robust Security</h3>
    <p>We use advanced encryption to protect your financial data.</p>
    </div>
    <div className="feature-card">
    <FaChartPie className="feature-icon" />
    <h3>Data-Driven Insights</h3>
    <p>Analyze spending trends and get AI-powered recommendations.</p>
    </div>
    <div className="feature-card">
    <FaUsers className="feature-icon" />
    <h3>Community-Trusted</h3>
    <p>Thousands of users rely on us to manage their expenses.</p>
    </div>
    <div className="feature-card">
    <FaBullseye className="feature-icon" />
    <h3>Goal-Oriented Tracking</h3>
    <p>Set savings goals and track your progress effortlessly.</p>
    </div>
    </div>
    </section>

    {/* Call to Action */}
    <section className="about-cta">
    <h2>Take Control of Your Finances Today</h2>
    <p>Start managing your expenses with ease. Join now and experience the difference.</p>
    z<button className="btn btn-primary" onClick={() => navigate("/register")}>
          Get Started
        </button> 
      </section>
    </div>
  );
};

export default About;
