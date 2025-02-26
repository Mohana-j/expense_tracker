import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useAuthStore from "../context/authStore"; // ✅ Ensure correct import
import "../styles/login.css"; // ✅ Ensure correct CSS path

const Login = () => {
  const navigate = useNavigate();
  const { setUser, setToken } = useAuthStore(); // ✅ Zustand store for authentication

  // ✅ Controlled form state
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // ✅ Handle input changes
  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("http://localhost:8000/api/login", {
        email,
        password,
      });

      console.log("Login Response:", response.data); // ✅ Debugging

      if (response.data?.token && response.data?.user) {
        setUser(response.data.user);
        setToken(response.data.token);
        localStorage.setItem("token", response.data.token); // ✅ Store token for persistence
        navigate("/profile"); // ✅ Redirect to dashboard
      } else {
        setError("Invalid credentials. Please try again.");
      }
    } catch (err) {
      console.error("Login Error:", err.response?.data || err.message);
      setError(err.response?.data?.error || "Something went wrong. Try again.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login</h2>
        <p className="subtext">Sign in to continue</p>
        <form onSubmit={handleLogin}>
          {error && <p className="error-message">{error}</p>}

          <div className="input-group">
            <input 
              type="email" 
              name="email" 
              placeholder="Email" 
              value={email} // ✅ Fixed 
              onChange={handleEmailChange} // ✅ Fixed 
              required
            />
            <input 
              type="password" 
              name="password" 
              placeholder="Password" 
              value={password} // ✅ Fixed 
              onChange={handlePasswordChange} // ✅ Fixed 
              required
            />
          </div>

          <button type="submit" className="login-btn">Login</button>
        </form>

        <p className="register-text">
          Don't have an account?{" "}
          <span className="register-link" onClick={() => navigate("/register")}>
            Register
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
