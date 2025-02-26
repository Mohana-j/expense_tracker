import React from "react";
import "../styles/settings.css";

const Settings = () => {
    return (
        <div className="settings-container">
            <h2>⚙️ Settings</h2>
            <div className="settings-sections">
                
                <div className="settings-section">
                    <h3>👤 Account Settings</h3>
                    <p>Manage your profile, email, and security preferences.</p>
                    <div className="button-group">
                        <button className="btn-primary">Edit Profile</button>
                        <button className="btn-outline">Change Password</button>
                    </div>
                </div>

                <div className="settings-section">
                    <h3>🔔 Notifications</h3>
                    <p>Customize your email and push notification settings.</p>
                    <button className="btn-primary">Manage Notifications</button>
                </div>

                <div className="settings-section">
                    <h3>💳 Payment & Billing</h3>
                    <p>Update billing information and view invoices.</p>
                    <button className="btn-primary">Update Billing</button>
                </div>

                <div className="settings-section">
                    <h3>🔒 Privacy & Security</h3>
                    <p>Control data privacy, authentication, and security settings.</p>
                    <button className="btn-primary">Privacy Settings</button>
                </div>

                <div className="settings-section">
                    <h3>🛠️ App Preferences</h3>
                    <p>Adjust theme, language, and default settings.</p>
                    <button className="btn-primary">Manage Preferences</button>
                </div>
            </div>
        </div>
    );
};

export default Settings;
