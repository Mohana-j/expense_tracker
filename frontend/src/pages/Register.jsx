import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/register.css";

const Register = () => {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    phone: "",
    dob: "",
    gender: "",
  });

  const [error, setError] = useState("");

  useEffect(() => {
    const registeredUser = localStorage.getItem("registeredUser");
    if (registeredUser) {
      navigate("/login");
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (Object.values(formData).some((field) => field.trim() === "")) {
      setError("All fields are required!");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long!");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:8000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        localStorage.setItem("registeredUser", JSON.stringify(result.user));
        setShowPopup(true);
      } else {
        setError(result.message || "Registration failed. Try again.");
      }
    } catch (error) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePopupClose = () => {
    setShowPopup(false);
    navigate("/profile");
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2>Join Us Today</h2>
        <p>Create your account and start tracking expenses effortlessly!</p>

        {error && <div className="error-msg">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input type="text" name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleChange} />
            <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} />
          </div>

          <div className="input-group">
            <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} />
            <input type="tel" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} />
          </div>

          <div className="input-group">
            <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} />
            <input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} />
          </div>

          <div className="input-group">
            <input type="date" name="dob" value={formData.dob} onChange={handleChange} />
            <select name="gender" value={formData.gender} onChange={handleChange}>
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="login-link">
          Already have an account? <span onClick={() => navigate("/login")}>Login</span>
        </p>
      </div>

      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <h3>🎉 Registration Successful!</h3>
            <p>Welcome to Expense Tracker. Redirecting to your profile...</p>
            <button onClick={handlePopupClose}>Go to Profile</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;
