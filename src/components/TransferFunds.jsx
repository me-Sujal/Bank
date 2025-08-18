import React, { useState } from "react";
import "./TransferFunds.css";

function TransferFunds({ user }) {
  const [amount, setAmount] = useState("");
  const [fromAccount, setFromAccount] = useState("");
  const [toAccount, setToAccount] = useState("");
  const accounts = ["Checking", "Savings", "Business"].map(a => `${user} - ${a}`);

  const handleTransfer = e => {
    e.preventDefault();
    alert(`Transferred $${amount} from ${fromAccount} to ${toAccount} (demo)`);
    setAmount("");
    setFromAccount("");
    setToAccount("");
  };

  return (
    <div className="tfund-root">
      <form className="tfund-form" onSubmit={handleTransfer}>
        <div className="tfund-title">
          <span className="tfund-icon">⚡</span> <span className="tfund-bank">Bank Transfer</span>
        </div>
        <div className="tfund-subtitle">Deposit funds into an account</div>

        <div className="tfund-amount-label">Amount</div>
        <div className="tfund-amount-row">
          <span className="tfund-money-sign">$</span>
          <input
            className="tfund-amount"
            type="number"
            min="0"
            step="0.01"
            placeholder="0.00"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            required
          />
        </div>

        <div className="tfund-select-label">Transfer from</div>
        <select
          className="tfund-select"
          value={fromAccount}
          onChange={e => setFromAccount(e.target.value)}
          required
        >
          <option value="">Select</option>
          {accounts.map((acc, i) => (
            <option key={i} value={acc}>{acc}</option>
          ))}
        </select>

        <div className="tfund-select-label">Transfer to</div>
        <select
          className="tfund-select"
          value={toAccount}
          onChange={e => setToAccount(e.target.value)}
          required
        >
          <option value="">Select</option>
          {accounts.map((acc, i) => (
            <option key={i} value={acc}>{acc}</option>
          ))}
        </select>

        <button className="tfund-button" type="submit">
          Transfer →
        </button>

        <div className="tfund-note">
          By clicking Transfer, I authorize Bank to initiate the transaction detailed above.
        </div>
      </form>
    </div>
  );
}

export default TransferFunds;
