import React, { useState, useEffect } from "react";
import "./AccountSettings.css";

function AccountSettings({ user }) {
  const [activeTab, setActiveTab] = useState("profile");
  const [profile, setProfile] = useState({
    name: "",
    email: user || "",
    phone: "",
    address: "",
    dateOfBirth: "",
    avatar: null
  });
  const [security, setSecurity] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    twoFactorEnabled: false,
    biometricEnabled: true,
    loginNotifications: true
  });
  const [preferences, setPreferences] = useState({
    darkMode: JSON.parse(localStorage.getItem('darkMode') || 'false'),
    language: "en",
    currency: "USD",
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    // Load saved profile data
    const savedProfile = localStorage.getItem(`profile_${user}`);
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }
  }, [user]);

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      localStorage.setItem(`profile_${user}`, JSON.stringify(profile));
      setLoading(false);
      showMessage("success", "Profile updated successfully!");
    }, 1000);
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (security.newPassword !== security.confirmPassword) {
      showMessage("error", "Passwords don't match!");
      return;
    }

    if (security.newPassword.length < 6) {
      showMessage("error", "Password must be at least 6 characters!");
      return;
    }

    setLoading(true);
    
    setTimeout(() => {
      setSecurity(prev => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      }));
      setLoading(false);
      showMessage("success", "Password changed successfully!");
    }, 1000);
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfile(prev => ({ ...prev, avatar: event.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const togglePreference = (key) => {
    setPreferences(prev => {
      const updated = { ...prev, [key]: !prev[key] };
      if (key === 'darkMode') {
        localStorage.setItem('darkMode', JSON.stringify(updated[key]));
        document.body.className = updated[key] ? 'dark-mode' : 'light-mode';
      }
      return updated;
    });
    showMessage("success", "Preference updated!");
  };

  const tabs = [
    { id: "profile", label: "👤 Profile", icon: "👤" },
    { id: "security", label: "🔒 Security", icon: "🔒" },
    { id: "preferences", label: "⚙️ Preferences", icon: "⚙️" },
    { id: "cards", label: "💳 Cards", icon: "💳" }
  ];

  return (
    <div className="settings-container">
      <div className="settings-header">
        <h1>Account Settings</h1>
        <p>Manage your account preferences and security</p>
      </div>

      {message.text && (
        <div className={`message message-${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="settings-content">
        <div className="settings-sidebar">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`settings-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tab-icon">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        <div className="settings-main">
          {activeTab === "profile" && (
            <div className="settings-section">
              <h2>Profile Information</h2>
              <form onSubmit={handleProfileSubmit}>
                <div className="avatar-section">
                  <div className="avatar-container">
                    <img
                      src={profile.avatar || `https://ui-avatars.com/api/?name=${profile.name}&background=random`}
                      alt="Profile"
                      className="avatar-image"
                    />
                    <label className="avatar-upload">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        style={{ display: 'none' }}
                      />
                      📷 Change Photo
                    </label>
                  </div>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      className="form-input"
                      value={profile.name}
                      onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input
                      type="email"
                      className="form-input"
                      value={profile.email}
                      onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="Enter your email"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input
                      type="tel"
                      className="form-input"
                      value={profile.phone}
                      onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Date of Birth</label>
                    <input
                      type="date"
                      className="form-input"
                      value={profile.dateOfBirth}
                      onChange={(e) => setProfile(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                    />
                  </div>

                  <div className="form-group form-group-full">
                    <label className="form-label">Address</label>
                    <textarea
                      className="form-input"
                      rows="3"
                      value={profile.address}
                      onChange={(e) => setProfile(prev => ({ ...prev, address: e.target.value }))}
                      placeholder="Enter your address"
                    />
                  </div>
                </div>

                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? <div className="loading"></div> : "Update Profile"}
                </button>
              </form>
            </div>
          )}

          {activeTab === "security" && (
            <div className="settings-section">
              <h2>Security Settings</h2>
              
              <div className="security-options">
                <div className="security-item">
                  <div className="security-info">
                    <h3>Two-Factor Authentication</h3>
                    <p>Add an extra layer of security to your account</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={security.twoFactorEnabled}
                      onChange={() => setSecurity(prev => ({ 
                        ...prev, 
                        twoFactorEnabled: !prev.twoFactorEnabled 
                      }))}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="security-item">
                  <div className="security-info">
                    <h3>Biometric Login</h3>
                    <p>Use fingerprint or face recognition to log in</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={security.biometricEnabled}
                      onChange={() => setSecurity(prev => ({ 
                        ...prev, 
                        biometricEnabled: !prev.biometricEnabled 
                      }))}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="security-item">
                  <div className="security-info">
                    <h3>Login Notifications</h3>
                    <p>Get notified when someone logs into your account</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={security.loginNotifications}
                      onChange={() => setSecurity(prev => ({ 
                        ...prev, 
                        loginNotifications: !prev.loginNotifications 
                      }))}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>

              <form onSubmit={handlePasswordChange} className="password-form">
                <h3>Change Password</h3>
                <div className="form-group">
                  <label className="form-label">Current Password</label>
                  <input
                    type="password"
                    className="form-input"
                    value={security.currentPassword}
                    onChange={(e) => setSecurity(prev => ({ ...prev, currentPassword: e.target.value }))}
                    placeholder="Enter current password"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">New Password</label>
                  <input
                    type="password"
                    className="form-input"
                    value={security.newPassword}
                    onChange={(e) => setSecurity(prev => ({ ...prev, newPassword: e.target.value }))}
                    placeholder="Enter new password"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Confirm New Password</label>
                  <input
                    type="password"
                    className="form-input"
                    value={security.confirmPassword}
                    onChange={(e) => setSecurity(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    placeholder="Confirm new password"
                  />
                </div>

                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? <div className="loading"></div> : "Change Password"}
                </button>
              </form>
            </div>
          )}

          {activeTab === "preferences" && (
            <div className="settings-section">
              <h2>Preferences</h2>
              
              <div className="preference-groups">
                <div className="preference-group">
                  <h3>Appearance</h3>
                  <div className="preference-item">
                    <div className="preference-info">
                      <span>Dark Mode</span>
                      <small>Switch between light and dark theme</small>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={preferences.darkMode}
                        onChange={() => togglePreference('darkMode')}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>

                <div className="preference-group">
                  <h3>Localization</h3>
                  <div className="form-group">
                    <label className="form-label">Language</label>
                    <select
                      className="form-select"
                      value={preferences.language}
                      onChange={(e) => setPreferences(prev => ({ ...prev, language: e.target.value }))}
                    >
                      <option value="en">English</option>
                      <option value="ne">नेपाली</option>
                      <option value="hi">हिंदी</option>
                      <option value="es">Español</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Currency</label>
                    <select
                      className="form-select"
                      value={preferences.currency}
                      onChange={(e) => setPreferences(prev => ({ ...prev, currency: e.target.value }))}
                    >
                      <option value="USD">USD - US Dollar</option>
                      <option value="NPR">NPR - Nepali Rupee</option>
                      <option value="EUR">EUR - Euro</option>
                      <option value="GBP">GBP - British Pound</option>
                    </select>
                  </div>
                </div>

                <div className="preference-group">
                  <h3>Notifications</h3>
                  <div className="preference-item">
                    <div className="preference-info">
                      <span>Email Notifications</span>
                      <small>Receive updates via email</small>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={preferences.emailNotifications}
                        onChange={() => togglePreference('emailNotifications')}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  <div className="preference-item">
                    <div className="preference-info">
                      <span>SMS Notifications</span>
                      <small>Receive updates via text message</small>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={preferences.smsNotifications}
                        onChange={() => togglePreference('smsNotifications')}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  <div className="preference-item">
                    <div className="preference-info">
                      <span>Push Notifications</span>
                      <small>Receive browser notifications</small>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={preferences.pushNotifications}
                        onChange={() => togglePreference('pushNotifications')}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "cards" && (
            <div className="settings-section">
              <h2>Payment Cards</h2>
              <div className="cards-grid">
                <div className="card-item">
                  <div className="payment-card">
                    <div className="card-header">
                      <span className="card-type">VISA</span>
                      <span className="card-status active">Active</span>
                    </div>
                    <div className="card-number">•••• •••• •••• 4521</div>
                    <div className="card-footer">
                      <span className="card-name">{profile.name || user.split('@')[0]}</span>
                      <span className="card-expiry">12/27</span>
                    </div>
                  </div>
                  <div className="card-actions">
                    <button className="btn btn-secondary">Freeze Card</button>
                    <button className="btn btn-primary">Manage</button>
                  </div>
                </div>

                <div className="add-card">
                  <div className="add-card-icon">+</div>
                  <h3>Add New Card</h3>
                  <p>Connect your debit or credit card</p>
                  <button className="btn btn-primary">Add Card</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AccountSettings;