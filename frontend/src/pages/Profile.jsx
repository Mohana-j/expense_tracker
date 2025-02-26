import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/profile.css";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token"); // Ensure token is retrieved
      if (!token) {
        console.error("🚨 No token found!");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("http://localhost:8000/api/register/profile", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("✅ Fetched User Data:", data);
        setUser(data);
      } catch (error) {
        console.error("❌ Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []); // ✅ Runs only once on component mount

  if (loading) return <p>Loading...</p>;
  if (!user) return <p>No user data found.</p>;

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <img src="/default-avatar.png" alt="Profile" className="profile-avatar" />
          <h2>{user.name}</h2>
          <p className="profile-role">User</p>
        </div>
        <div className="profile-details">
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Phone:</strong> {user.phone}</p>
          <p><strong>Date of Birth:</strong> {user.dob}</p>
          <p><strong>Gender:</strong> {user.gender}</p>
          <p><strong>Salary:</strong> ${user.salary || "N/A"}</p>
          <p><strong>Total Expenses:</strong> ${user.totalExpenses || "N/A"}</p>
        </div>

        <p className="wallet-info">To see your income and transactions, visit your Wallet.</p>
        <button className="wallet-button" onClick={() => navigate("/amount")}>Go to Wallet</button>

        <button 
          onClick={() => {
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            navigate("/login");
          }} 
          className="logout-button"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
