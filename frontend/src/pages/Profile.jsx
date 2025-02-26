import React, { useState, useEffect } from "react";
import { useUserStore } from "../context/userStore";
import axios from "axios";
import { Bar, Pie } from "react-chartjs-2";
import "../styles/profile.css";

const Profile = () => {
  const { user, setUser } = useUserStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editableUser, setEditableUser] = useState(null);
  const [balance, setBalance] = useState(0);
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.warn("No token found, user not logged in.");
          return;
        }

        const response = await axios.get("http://localhost:8000/api/register/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 200) {
          const userData = response.data;
          setUser(userData);
          setEditableUser(userData);
          setBalance(userData.salary - userData.totalExpenses);

          setChartData({
            labels: ["Income", "Expenses"],
            datasets: [
              {
                label: "Financial Overview",
                data: [userData.salary, userData.totalExpenses],
                backgroundColor: ["#28a745", "#dc3545"],
              },
            ],
          });
        } else {
          console.error("Failed to fetch user data:", response.data);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [setUser]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    setEditableUser({ ...editableUser, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put("http://localhost:8000/api/register/update", editableUser, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser(editableUser);
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    }
  };

  if (loading) {
    return <p className="loading-text">Loading profile...</p>;
  }

  if (!user) {
    return <p className="error-text">Error loading profile. Please try again.</p>;
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h2>My Profile</h2>
        <button onClick={handleEditToggle} className="edit-btn">
          {isEditing ? "Cancel" : "Edit Profile"}
        </button>
      </div>

      <div className="profile-content">
        <div className="profile-info">
          <img src="/images/user-avatar.png" alt="User Avatar" className="profile-avatar" />
          {isEditing ? (
            <input type="text" name="name" value={editableUser?.name} onChange={handleInputChange} />
          ) : (
            <h3>{user?.name || "N/A"}</h3>
          )}
          <p>Email: {user?.email || "N/A"}</p>
          <p>Phone: {user?.phone || "N/A"}</p>
        </div>

        <div className="profile-details">
          <h3>Account Details</h3>
          <div className="profile-item"><span>Username:</span> {user?.username || "N/A"}</div>
          <div className="profile-item"><span>DOB:</span> {user?.dob || "N/A"}</div>
          <div className="profile-item"><span>Gender:</span> {user?.gender || "N/A"}</div>
        </div>
      </div>

      <div className="finance-overview">
        <h3>Financial Overview</h3>
        <div className="finance-details">
          <p><strong>Salary:</strong> ${user?.salary || "0.00"}</p>
          <p><strong>Total Expenses:</strong> ${user?.totalExpenses || "0.00"}</p>
          <p><strong>Balance:</strong> ${balance}</p>
        </div>
       
        {chartData && (
          <div className="charts">
            <Pie data={chartData} />
            <Bar data={chartData} />
          </div>
        )}
      </div>

      {isEditing && (
        <button className="save-btn" onClick={handleSave}>
          Save Changes
        </button>
      )}
    </div>
  );
};

export default Profile;