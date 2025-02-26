import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";

const Login = () => {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });

      const result = await response.json();
      console.log("Login Response:", result);

      if (response.ok) {
        // Store the user details in localStorage properly
        localStorage.setItem("user", JSON.stringify(result.user));
        navigate("/profile"); // Redirect to Profile page
      } else {
        setError(result.error || result.message || "Login failed.");
      }
    } catch (error) {
      console.error("Login Error:", error);
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login</h2>
        {error && <div className="error-msg">{error}</div>}
        <form onSubmit={handleSubmit}>
          <input type="email" name="email" placeholder="Email" value={loginData.email} onChange={handleChange} required />
          <input type="password" name="password" placeholder="Password" value={loginData.password} onChange={handleChange} required />
          <button type="submit" disabled={loading}>{loading ? "Logging in..." : "Login"}</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
