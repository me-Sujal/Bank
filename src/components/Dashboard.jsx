import React, { useState } from "react";
import "./Dashboard.css";
import TransferFunds from "./TransferFunds";
import PaymentForm from "./PaymentForm";

function Dashboard({ user = "User", balance = 25685, transactions = [], updateBalance, addTransaction, addNotification: addGlobalNotification }) {
  const [activePage, setActivePage] = useState("overview");
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [chartTab, setChartTab] = useState("day");
  const [paymentModal, setPaymentModal] = useState(null);

  // Use the global notification function passed from parent
  const addNotification = (notification) => {
    if (addGlobalNotification) {
      addGlobalNotification(notification);
    }
  };

  // Keep statements locally for now (can be moved to global state later)
  const [statements, setStatements] = useState([]);
  const addStatement = (statement) => {
    setStatements(prev => [statement, ...prev]);
  };

  const handleTransfer = (transferData) => {
    const newTransaction = {
      id: Date.now(),
      type: 'debit',
      amount: parseFloat(transferData.amount),
      description: `Transfer to ${transferData.toAccount}`,
      date: new Date().toISOString().split('T')[0],
      from: transferData.fromAccount,
      to: transferData.toAccount
    };
    
    addTransaction(newTransaction);
    updateBalance(parseFloat(transferData.amount), 'debit');
    setShowTransferModal(false);
    setActivePage("overview");
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Extract user display name
  const userDisplayName = user.includes('@') ? user.split('@')[0] : user;

  return (
    <div className="dashboard-root">
      <div className="db-main-split">
        {/* Left main content area */}
        <div className="db-main">
          {activePage === "overview" && (
            <>
              <div className="db-welcome">
                <h1>Welcome back, {userDisplayName}! 👋</h1>
                <p>Here's what's happening with your account today.</p>
              </div>

              <div className="db-top-row">
                <div className="db-card balance-card">
                  <div className="card-header">
                    <h3>Total Balance</h3>
                    <span className="balance-icon">💰</span>
                  </div>
                  <div className="card-balance">{formatCurrency(balance)}</div>
                  <div className="card-deposit">Available: <span>{formatCurrency(balance * 0.85)}</span></div>
                  <div className="card-growth">+6.5% this month</div>
                  <button className="card-action-btn">💳 ADD FUNDS</button>
                </div>

                <div className="db-card chart-card">
                  <div className="chart-header">
                    <h3>Balance History</h3>
                    <div className="chart-tabs">
                      <button className="active">Day</button>
                    </div>
                  </div>
                  <div className="chart-wrapper">
                    <div className="chart-bars">
                      {[5,8,6,9,7,8,6].map((v,i) => (
                        <div key={i} className="chart-bar-container">
                          <div className="chart-bar" style={{height: 14 + v*7 + "px"}} />
                        </div>
                      ))}
                    </div>
                    <div className="chart-days">
                      <span className="chart-day">Sat</span>
                      <span className="chart-day">Sun</span>
                      <span className="chart-day">Mon</span>
                      <span className="chart-day">Tue</span>
                      <span className="chart-day">Wed</span>
                      <span className="chart-day">Thu</span>
                      <span className="chart-day">Fri</span>
                    </div>
                  </div>
                </div>

                <div className="db-card quick-stats">
                  <h3>Quick Stats</h3>
                  <div className="stats-grid">
                    <div className="stat-item">
                      <span className="stat-icon">📈</span>
                      <div>
                        <div className="stat-value">+12.5%</div>
                        <div className="stat-label">Growth</div>
                      </div>
                    </div>
                    <div className="stat-item">
                      <span className="stat-icon">💸</span>
                      <div>
                        <div className="stat-value">{transactions.length}</div>
                        <div className="stat-label">Transactions</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="db-row card-actions-row">
                <h3>Quick Actions</h3>
                <div className="actions-grid">
                  {[
                    {icon: "💸", label: "Transfer", onClick: () => setShowTransferModal(true)},
                    {icon: "🏧", label: "Withdraw", onClick: () => alert("Withdraw feature coming soon!")},
                    {icon: "🏠", label: "Pay Bills", onClick: () => setPaymentModal("bills")},
                    {icon: "⚡", label: "Utilities", onClick: () => setPaymentModal("utilities")},
                    {icon: "🎓", label: "Education", onClick: () => setPaymentModal("education")},
                    {icon: "💧", label: "Water", onClick: () => setPaymentModal("water")},
                  ].map((action, idx) =>
                    <div className="action-card" key={idx} onClick={action.onClick}>
                      <div className="action-icon">{action.icon}</div>
                      <span className="action-label">{action.label}</span>
                    </div>)
                  }
                </div>
              </div>

              <div className="db-row">
                <div className="db-card breakdown-card">
                  <h3>Monthly Overview</h3>
                  <div className="breakdown-stats">
                    <div className="breakdown-item income">
                      <span className="breakdown-icon">📈</span>
                      <div>
                        <div className="breakdown-amount">{formatCurrency(24685)}</div>
                        <div className="breakdown-label">Income</div>
                      </div>
                    </div>
                    <div className="breakdown-item expense">
                      <span className="breakdown-icon">📉</span>
                      <div>
                        <div className="breakdown-amount">{formatCurrency(14455)}</div>
                        <div className="breakdown-label">Expenses</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="db-card send-money-card">
                  <h3>Recent Recipients</h3>
                  <div className="recipients-list">
                    <div className="recipient-item">
                      <div className="contact-avatar c1">D</div>
                      <span>Dohan Hodeermin</span>
                    </div>
                    <div className="recipient-item">
                      <div className="contact-avatar c2">J</div>
                      <span>John Smith</span>
                    </div>
                    <div className="recipient-item">
                      <div className="contact-avatar c3">L</div>
                      <span>Levin Locker</span>
                    </div>
                    <div className="recipient-item add-recipient">
                      <div className="contact-avatar add">+</div>
                      <span>Add New Contact</span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Simplified Sidebar - Removed Notifications and Statements */}
        <aside className="db-sidebar">
          <div className="sidebar-header">
            <div className="user-info">
              <div className="user-avatar">
                {userDisplayName.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="user-name">{userDisplayName}</div>
                <div className="user-email">{user}</div>
              </div>
            </div>
          </div>

          <div className="sidebar-section">
            <h3>Recent Transactions</h3>
            <div className="transactions-list">
              {transactions.slice(0, 5).map((transaction, idx) =>
                <div key={idx} className="transaction-item">
                  <div className={`trans-icon ${transaction.type}`}>
                    {transaction.type === 'credit' ? '📈' : '📉'}
                  </div>
                  <div className="trans-details">
                    <div className="trans-description">{transaction.description}</div>
                    <div className="trans-date">{transaction.date}</div>
                  </div>
                  <div className={`trans-amount ${transaction.type}`}>
                    {transaction.type === 'credit' ? '+' : '-'}{formatCurrency(transaction.amount)}
                  </div>
                </div>
              )}
              {transactions.length === 0 && (
                <div className="no-transactions">
                  <p>No transactions yet</p>
                  <small>Start by making a transfer!</small>
                </div>
              )}
            </div>
          </div>

          <div className="sidebar-section">
            <div className="section-header">
              <h3>My Bank Accounts</h3>
              <button className="add-card-btn">+</button>
            </div>
            <div className="bank-accounts-list">
              <div className="bank-account-item">
                <div className="account-icon">🏛️</div>
                <div className="account-details">
                  <div className="account-name">{userDisplayName} - Checking</div>
                  <div className="account-balance">{formatCurrency(balance * 0.6)}</div>
                </div>
              </div>
              <div className="bank-account-item">
                <div className="account-icon">💰</div>
                <div className="account-details">
                  <div className="account-name">{userDisplayName} - Savings</div>
                  <div className="account-balance">{formatCurrency(balance * 0.3)}</div>
                </div>
              </div>
              <div className="bank-account-item">
                <div className="account-icon">🏢</div>
                <div className="account-details">
                  <div className="account-name">{userDisplayName} - Business</div>
                  <div className="account-balance">{formatCurrency(balance * 0.1)}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="sidebar-section">
            <div className="section-header">
              <h3>Payment Cards</h3>
              <button className="add-card-btn">+</button>
            </div>
            <div className="card-list">
              <div className="credit-card">
                <div className="card-chip">💳</div>
                <div className="card-type">VISA</div>
                <div className="card-number">•••• •••• •••• 4521</div>
                <div className="card-holder">{userDisplayName}</div>
                <div className="card-expiry">12/27</div>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Transfer Modal */}
      {showTransferModal && (
        <div className="modal-overlay" onClick={() => setShowTransferModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Transfer Funds</h2>
              <button 
                className="close-btn"
                onClick={() => setShowTransferModal(false)}
              >
                ×
              </button>
            </div>
            <TransferFunds 
              user={userDisplayName} 
              availableBalance={balance * 0.85}
              updateBalance={updateBalance}
              addTransaction={addTransaction}
              addNotification={addNotification}
              addStatement={addStatement}
              onClose={() => setShowTransferModal(false)}
            />
          </div>
        </div>
      )}

      {paymentModal && (
        <div className="modal-overlay" onClick={() => setPaymentModal(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Make Payment</h2>
              <button className="close-btn" onClick={() => setPaymentModal(null)}>×</button>
            </div>
            <PaymentForm
              user={userDisplayName} 
              availableBalance={balance * 0.85}
              paymentType={paymentModal}
              updateBalance={updateBalance}
              addTransaction={addTransaction}
              addNotification={addNotification}
              addStatement={addStatement}
              onClose={() => setPaymentModal(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;