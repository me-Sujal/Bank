// ... existing imports ...
import React, { useState } from "react";
import "./Login.css"; // Reuse the login styles

function Register({ setPage }) {
  const [form, setForm] = useState({ name: "", email: "", username: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert("Registration bypassed for demo!");
      setPage("login");
    }, 1500);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>🏦 Modern Bank</h1>
          <p>Create your account</p>
        </div>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label className="form-label">Name</label>
            <input
              name="name"
              className="form-input"
              placeholder="Enter your name"
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              name="email"
              type="email"
              className="form-input"
              placeholder="Enter your email"
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Username</label>
            <input
              name="username"
              className="form-input"
              placeholder="Choose a username"
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
              placeholder="Create a password"
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary login-btn" disabled={loading}>
            {loading ? <div className="loading"></div> : "Register"}
          </button>
        </form>
        <div className="login-footer">
          <p>Already have an account?</p>
          <button
            type="button"
            className="link-btn"
            onClick={() => setPage("login")}
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default Register;