import React, { useState, useEffect } from "react";
import "./Notifications.css"; // Optional if you want further notification-specific tweaks

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(false);

  const mockNotifications = [
    {
      id: 1,
      type: "transaction",
      title: "Payment Received",
      message: "You received $2,500.00 from Employer Inc.",
      time: "2 hours ago",
      read: false,
      icon: "💰",
      priority: "high"
    },
    {
      id: 2,
      type: "security",
      title: "New Login Detected",
      message: "Someone logged into your account from Chrome on Windows",
      time: "5 hours ago",
      read: false,
      icon: "🔐",
      priority: "high"
    },
    {
      id: 3,
      type: "account",
      title: "Profile Updated",
      message: "Your profile information has been successfully updated",
      time: "1 day ago",
      read: true,
      icon: "👤",
      priority: "low"
    },
    {
      id: 4,
      type: "transaction",
      title: "Payment Sent",
      message: "You sent $150.00 to FreshMart Grocery Store",
      time: "1 day ago",
      read: true,
      icon: "💸",
      priority: "medium"
    },
    {
      id: 5,
      type: "promotion",
      title: "New Feature Available",
      message: "Try our new budgeting tools to better manage your finances",
      time: "2 days ago",
      read: false,
      icon: "✨",
      priority: "low"
    },
    {
      id: 6,
      type: "security",
      title: "Password Changed",
      message: "Your account password was successfully changed",
      time: "3 days ago",
      read: true,
      icon: "🔑",
      priority: "medium"
    }
  ];

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    setTimeout(() => {
      setNotifications(mockNotifications);
      setLoading(false);
    }, 700);
  };

  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const filteredNotifications = notifications.filter(notif => {
    if (filter === "all") return true;
    if (filter === "unread") return !notif.read;
    return notif.type === filter;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const getTypeColor = (type) => {
    const colors = {
      transaction: "var(--secondary-color)",
      security: "#ef4444",
      account: "var(--primary-color)",
      promotion: "#8b5cf6"
    };
    return colors[type] || "var(--text-secondary)";
  };

  return (
    <div className="card" style={{ maxWidth: 600, margin: "2rem auto" }}>
      <div className="notifications-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <h1 style={{ fontSize: "1.4em", color: "var(--primary-color)" }}>🔔 Notifications</h1>
          {unreadCount > 0 && (
            <span className="unread-badge" style={{
              background: "var(--secondary-color)",
              color: "#fff",
              padding: "0.3rem 0.8rem",
              borderRadius: "1rem",
              fontWeight: "600",
              fontSize: "1em"
            }}>{unreadCount} unread</span>
          )}
        </div>
        <div style={{ display: "flex", gap: "0.7rem", alignItems: "center" }}>
          <button
            onClick={fetchNotifications}
            className="btn btn-secondary"
            disabled={loading}
            style={{ minWidth: 90 }}
          >
            {loading ? <div className="loading"></div> : "🔄 Refresh"}
          </button>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="btn btn-primary"
            >
              ✓ Mark All Read
            </button>
          )}
          {notifications.length > 0 && (
            <button
              onClick={clearAll}
              className="btn btn-danger"
            >
              🗑 Clear All
            </button>
          )}
        </div>
      </div>

      <div className="notifications-filter" style={{ display: "flex", gap: "0.5rem", marginBottom: "1.2rem" }}>
        {["all", "unread", "transaction", "security", "account", "promotion"].map(ftype =>
          <button
            key={ftype}
            className={`btn ${filter === ftype ? "btn-primary" : ""}`}
            style={{
              background: filter === ftype ? "var(--primary-color)" : "var(--bg-secondary)",
              color: filter === ftype ? "#fff" : "var(--text-secondary)",
              fontWeight: "500"
            }}
            onClick={() => setFilter(ftype)}
          >
            {ftype.charAt(0).toUpperCase() + ftype.slice(1)}
          </button>
        )}
      </div>

      <div className="notifications-list" style={{ marginTop: 12 }}>
        {filteredNotifications.length === 0 && (
          <div className="no-notifications" style={{ textAlign: "center", color: "var(--text-secondary)", margin: "2rem 0" }}>No notifications found.</div>
        )}

        {filteredNotifications.map(notif => (
          <div
            key={notif.id}
            className="notification-item card"
            style={{
              display: "flex",
              alignItems: "flex-start",
              marginBottom: "1rem",
              padding: "1.1rem",
              boxShadow: "var(--shadow)"
            }}
          >
            <span
              style={{
                background: getTypeColor(notif.type),
                color: "#fff",
                borderRadius: "0.8rem",
                width: "42px",
                height: "42px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.7em",
                marginRight: "1.1rem",
                flexShrink: 0
              }}
              title={notif.type}
            >
              {notif.icon}
            </span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: "600", fontSize: "1.06em", color: "var(--text-primary)" }}>
                {notif.title}
              </div>
              <div style={{ color: "var(--text-secondary)", marginBottom: "8px" }}>{notif.message}</div>
              <div style={{ display: "flex", gap: "0.7rem", fontSize: "0.93em", alignItems: "center" }}>
                <span style={{ color: "#999" }}>{notif.time}</span>
                {!notif.read && (
                  <button
                    className="btn btn-secondary"
                    style={{ padding: "0.35rem 0.8rem", fontSize: "0.92em" }}
                    onClick={() => markAsRead(notif.id)}
                  >
                    Mark as read
                  </button>
                )}
                <button
                  className="btn btn-danger"
                  style={{ padding: "0.35rem 0.8rem", fontSize: "0.92em" }}
                  onClick={() => deleteNotification(notif.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Notifications;
