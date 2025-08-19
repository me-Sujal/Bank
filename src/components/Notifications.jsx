/* src/components/Notifications.jsx */
import React, { useState, useEffect } from "react";
import "./Notifications.css";

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
    <div className="notifications-container">
      {/* Header */}
      <div className="notifications-header">
        <div className="header-left">
          <h1 className="notifications-title">
            🔔 Notifications
          </h1>
          {unreadCount > 0 && (
            <span className="unread-badge">
              {unreadCount} unread
            </span>
          )}
        </div>
        <div className="header-actions">
          <button
            onClick={fetchNotifications}
            className="btn btn-secondary"
            disabled={loading}
          >
            {loading ? <div className="loading"></div> : "🔄"}
            Refresh
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

      {/* Filter Buttons */}
      <div className="notifications-filter">
        {["all", "unread", "transaction", "security", "account", "promotion"].map(ftype => (
          <button
            key={ftype}
            className={`filter-btn ${filter === ftype ? "active" : ""}`}
            onClick={() => setFilter(ftype)}
          >
            {ftype.charAt(0).toUpperCase() + ftype.slice(1)}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="notifications-list">
        {filteredNotifications.length === 0 && (
          <div className="no-notifications">
            <div className="no-notifications-icon">📭</div>
            <h3>No notifications found</h3>
            <p>There are no notifications for the selected filter.</p>
          </div>
        )}

        {filteredNotifications.map(notif => (
          <div
            key={notif.id}
            className={`notification-item ${!notif.read ? 'unread' : ''} ${notif.priority === 'high' ? 'high-priority' : ''}`}
          >
            <div
              className="notif-icon"
              style={{ background: getTypeColor(notif.type) }}
            >
              {notif.icon}
            </div>
            
            <div className="notif-content">
              <div className="notif-title">{notif.title}</div>
              <div className="notif-message">{notif.message}</div>
              
              <div className="notif-footer">
                <span className="notif-time">{notif.time}</span>
                <div className="notif-actions">
                  {!notif.read && (
                    <button
                      className="notif-action"
                      onClick={() => markAsRead(notif.id)}
                    >
                      Mark as read
                    </button>
                  )}
                  <button
                    className="notif-action delete"
                    onClick={() => deleteNotification(notif.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Notifications;