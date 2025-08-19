import React, { useState } from "react";
import "./Login.css";

function Login({ setUser, setPage }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showBiometric, setShowBiometric] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setUser(form.email);
    }, 1500);
  };

  const handleBiometricLogin = async () => {
    setLoading(true);
    // Simulate biometric authentication
    setTimeout(() => {
      setLoading(false);
      setUser("demo@user.com");
    }, 2000);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>🏦 Modern Bank</h1>
          <p>Secure Banking, Simplified</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label className="form-label">Email or Username</label>
            <input
              name="email"
              type="email"
              className="form-input"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              name="password"
              type="password"
              className="form-input"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary login-btn" disabled={loading}>
            {loading ? <div className="loading"></div> : "Sign In"}
          </button>
        </form>

        <div className="divider">
          <span>or</span>
        </div>

        <button
          type="button"
          className="btn btn-secondary biometric-btn"
          onClick={handleBiometricLogin}
          disabled={loading}
        >
          {loading ? <div className="loading"></div> : "👤 Biometric Login"}
        </button>

        <div className="login-footer">
          <p>Don't have an account?</p>
          <button
            type="button"
            className="link-btn"
            onClick={() => setPage("register")}
          >
            Create Account
          </button>
        </div>

        <button 
        onClick={() => setUser('demo@bank.com')} 
        className="btn btn-secondary"
        style={{ marginTop: '1rem', width: '100%' }}
        >
        🚀 Quick Demo Access
        </button>
      </div>
    </div>
  );
}

export default Login;