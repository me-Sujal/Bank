import React, { useState, useEffect } from "react";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import AccountSettings from "./components/AccountSettings";
import AccountStatement from "./components/AccountStatement";
import Notifications from "./components/Notifications";
import "./index.css";

function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("login");
  const [darkMode, setDarkMode] = useState(false);
  const [balance, setBalance] = useState(25685);
  const [transactions, setTransactions] = useState([
    { id: 1, type: 'credit', amount: 2500, description: 'Salary Deposit', date: '2025-08-15', from: 'Employer Inc.', to: user || 'Your Account' },
    { id: 2, type: 'debit', amount: 150, description: 'Grocery Store', date: '2025-08-14', from: 'Your Account', to: 'FreshMart' },
    { id: 3, type: 'credit', amount: 500, description: 'Freelance Payment', date: '2025-08-13', from: 'Client ABC', to: user || 'Your Account' },
    { id: 4, type: 'debit', amount: 75, description: 'Coffee Shop', date: '2025-08-12', from: 'Your Account', to: 'Brew & Bean' },
    { id: 5, type: 'debit', amount: 1200, description: 'Rent Payment', date: '2025-08-11', from: 'Your Account', to: 'Property Management' }
  ]);

  useEffect(() => {
    const savedUser = localStorage.getItem('bankUser');
    const savedTheme = localStorage.getItem('darkMode');
    if (savedUser) {
      setUser(savedUser);
      setPage('dashboard');
    }
    if (savedTheme) {
      setDarkMode(JSON.parse(savedTheme));
    }
  }, []);

  useEffect(() => {
    document.body.className = darkMode ? 'dark-mode' : 'light-mode';
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  const handleLogin = (email) => {
    setUser(email);
    setPage('dashboard');
    localStorage.setItem('bankUser', email);
  };

  const handleLogout = () => {
    setUser(null);
    setPage('login');
    localStorage.removeItem('bankUser');
  };

  const updateBalance = (amount, type) => {
    if (type === 'credit') {
      setBalance(prev => prev + amount);
    } else {
      setBalance(prev => prev - amount);
    }
  };

  const addTransaction = (transaction) => {
    setTransactions(prev => [{ ...transaction, id: Date.now() }, ...prev]);
  };

  if (!user) {
    return (
      <div className={`app-container ${darkMode ? 'dark' : 'light'}`}>
        <div className="theme-toggle">
          <button onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>
        {page === "login" && <Login setUser={handleLogin} setPage={setPage} />}
        {page === "register" && <Register setPage={setPage} />}
      </div>
    );
  }

  return (
    <div className={`app-container ${darkMode ? 'dark' : 'light'}`}>
      <nav className="app-nav">
        <div className="nav-brand">🏦 MODERN BANK</div>
        <div className="nav-links">
          <button onClick={() => setPage('dashboard')} className={page === 'dashboard' ? 'active' : ''}>
            📊 Dashboard
          </button>
          <button onClick={() => setPage('statement')} className={page === 'statement' ? 'active' : ''}>
            📋 Statement
          </button>
          <button onClick={() => setPage('settings')} className={page === 'settings' ? 'active' : ''}>
            ⚙️ Settings
          </button>
          <button onClick={() => setPage('notifications')} className={page === 'notifications' ? 'active' : ''}>
            🔔 Notifications
          </button>
        </div>
        <div className="nav-controls">
          <button className="theme-btn" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? '☀️' : '🌙'}
          </button>
          <span className="user-greeting">Hi, {user.split('@')[0]}!</span>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </nav>

      <main className="app-main">
        {page === 'dashboard' && (
          <Dashboard 
            user={user} 
            balance={balance} 
            transactions={transactions}
            updateBalance={updateBalance}
            addTransaction={addTransaction}
          />
        )}
        {page === 'statement' && <AccountStatement user={user} transactions={transactions} />}
        {page === 'settings' && <AccountSettings user={user} />}
        {page === 'notifications' && <Notifications />}
      </main>
    </div>
  );
}

export default App;