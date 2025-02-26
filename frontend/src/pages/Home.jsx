import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { FaCheckCircle, FaUsers, FaChartLine, FaMoneyBillWave } from "react-icons/fa";
import "../styles/home.css";

const Home = () => {
  const navigate = useNavigate(); // Initialize useNavigate

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Track & Manage Your Expenses with Ease</h1>
          <p>Smart, secure, and efficient financial tracking at your fingertips.</p>
          <div className="hero-buttons">
            <button className="btn btn-primary" onClick={() => navigate("/register")}>
              Get Started for Free
            </button>
            <button className="btn btn-secondary" onClick={() => navigate("/about")}>
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2>Powerful Features for Smarter Financial Management</h2>
        <div className="features-grid">
          <div className="feature-card">
            <FaChartLine className="feature-icon" />
            <h3>Real-Time Insights</h3>
            <p>Analyze spending patterns with interactive charts and reports.</p>
          </div>
          <div className="feature-card">
            <FaMoneyBillWave className="feature-icon" />
            <h3>Expense Categorization</h3>
            <p>Organize transactions effortlessly with custom categories.</p>
          </div>
          <div className="feature-card">
            <FaUsers className="feature-icon" />
            <h3>Multi-User Collaboration</h3>
            <p>Manage expenses with teams, family, or friends seamlessly.</p>
          </div>
          <div className="feature-card">
            <FaCheckCircle className="feature-icon" />
            <h3>Secure & Encrypted</h3>
            <p>Your financial data is protected with enterprise-grade security.</p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <h2>What Our Users Say</h2>
        <div className="testimonials-grid">
          <div className="testimonial-card">
            <p>“This app transformed the way I track my expenses. Highly recommended!”</p>
            <h4>- Sarah M.</h4>
          </div>
          <div className="testimonial-card">
            <p>“Effortless budgeting and real-time insights. A game-changer!”</p>
            <h4>- John D.</h4>
          </div>
          <div className="testimonial-card">
            <p>“I love the simplicity and effectiveness of this app!”</p>
            <h4>- Alex W.</h4>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="call-to-action">
        <h2>Start Managing Your Finances Like a Pro</h2>
        <p>Join thousands of users and take control of your expenses today.</p>
        <button className="btn btn-primary" onClick={() => navigate("/register")}>
          Create a Free Account
        </button>
      </section>
    </div>
  );
};

export default Home;
