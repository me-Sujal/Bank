import React, { useState } from "react";
import "./TransferFunds.css";

// === Consistent Constants (match Dashboard.jsx) ===
const DEFAULT_BALANCE = 25685;
const AVAILABLE_PERCENT = 0.85;
const MONTHLY_GROWTH = 6.5;
const DEFAULT_TRANSFER_PLACEHOLDER = "0.00"; // Use as placeholder for amount

const RECIPIENTS = [
  "Balen Karmer",
  "Slava Kornilov",
  "Kenny Coil",
  "Nathan Riley",
  "Maciej Kataska"
];

function TransferFunds({ user, availableBalance, updateBalance, addTransaction, addNotification, addStatement, onClose }) {
  const [amount, setAmount] = useState("");
  const [fromAccount, setFromAccount] = useState("");
  const [toAccount, setToAccount] = useState("");
  const [showPinEntry, setShowPinEntry] = useState(false);
  const [enteredPin, setEnteredPin] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [enteredOtp, setEnteredOtp] = useState("");

  const accounts = ["Checking", "Savings", "Business"].map(a => `${user} - ${a}`);

  // Helper to show browser notification
  const showNotification = (otp) => {
    if (window.Notification && Notification.permission === "granted") {
      new Notification("Your OTP Code", { body: `Your OTP is: ${otp}` });
    } else if (window.Notification && Notification.permission !== "denied") {
      Notification.requestPermission().then(permission => {
        if (permission === "granted") {
          new Notification("Your OTP Code", { body: `Your OTP is: ${otp}` });
        } else {
          alert(`Your OTP is: ${otp}`);
        }
      });
    } else {
      alert(`Your OTP is: ${otp}`); // fallback
    }
  };

  const handleInitialSubmit = e => {
    e.preventDefault();
    setShowPinEntry(true);
    setEnteredPin("");
  };

  const handlePinSubmit = e => {
    e.preventDefault();
    
    // Simple PIN validation (you can customize this logic)
    if (enteredPin.length !== 4 || !/^\d{4}$/.test(enteredPin)) {
      alert("Please enter a valid 4-digit PIN.");
      return;
    }

    // In a real app, you would verify the PIN against stored user PIN
    // For demo purposes, we'll accept any 4-digit PIN
    // Generate OTP after successful PIN verification
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(otp);
    setOtpSent(true);
    setEnteredOtp("");
    showNotification(otp);
  };

  const handleOtpSubmit = e => {
    e.preventDefault();
    if (enteredOtp === generatedOtp) {
      const amt = parseFloat(amount);

      // 1. Decrease balance
      updateBalance(amt);

      // 2. Create transaction object
      const transaction = {
        id: Date.now(),
        type: 'debit',
        amount: amt,
        description: `Transfer to ${toAccount}`,
        date: new Date().toISOString().split('T')[0],
        from: fromAccount,
        to: toAccount
      };

      // 3. Add to transactions (recent), statements, and notifications
      addTransaction(transaction);
      addStatement(transaction);
      addNotification({
        id: Date.now(),
        title: "Transfer Successful",
        message: `You sent $${amt} to ${toAccount}`,
        date: new Date().toLocaleString()
      });

      // 4. Show browser notification
      if (window.Notification && Notification.permission === "granted") {
        new Notification("Transfer Successful", { body: `Transferred $${amt} to ${toAccount}` });
      } else if (window.Notification && Notification.permission !== "denied") {
        Notification.requestPermission().then(permission => {
          if (permission === "granted") {
            new Notification("Transfer Successful", { body: `Transferred $${amt} to ${toAccount}` });
          } else {
            alert(`Transferred $${amt} to ${toAccount}`);
          }
        });
      } else {
        alert(`Transferred $${amt} to ${toAccount}`);
      }

      // 5. Reset form
      setAmount("");
      setFromAccount("");
      setToAccount("");
      setShowPinEntry(false);
      setOtpSent(false);
      setGeneratedOtp("");
      setEnteredOtp("");
      setEnteredPin("");

      // 6. Close the modal
      if (onClose) onClose();
    } else {
      alert("Incorrect OTP. Please try again.");
    }
  };

  const handlePinChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // Only allow digits
    if (value.length <= 4) {
      setEnteredPin(value);
    }
  };

  return (
    <div className="tfund-root">
      <form className="tfund-form" onSubmit={otpSent ? handleOtpSubmit : (showPinEntry ? handlePinSubmit : handleInitialSubmit)}>
        <div className="tfund-title">
          <span className="tfund-icon">⚡</span> <span className="tfund-bank">Bank Transfer</span>
        </div>
        <div className="tfund-subtitle">Deposit funds into an account</div>

        {!showPinEntry && !otpSent && (
          <>
            <div className="tfund-amount-label">
              Amount
              <span style={{ float: "right", fontSize: "0.9em", color: "#888" }}>
                Available: ${availableBalance?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <div className="tfund-amount-row">
              <span className="tfund-money-sign">$</span>
              <input
                className="tfund-amount"
                type="number"
                min="0"
                max={availableBalance}
                step="0.01"
                placeholder={DEFAULT_TRANSFER_PLACEHOLDER}
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
              {RECIPIENTS.map((name, i) => (
                <option key={i} value={name}>{name}</option>
              ))}
            </select>

            <button className="tfund-button" type="submit">
              Continue →
            </button>
          </>
        )}

        {showPinEntry && !otpSent && (
          <>
            <div className="tfund-amount-label">Enter your 4-digit PIN</div>
            <input
              className="tfund-amount"
              type="password"
              maxLength={4}
              placeholder="Enter PIN"
              value={enteredPin}
              onChange={handlePinChange}
              required
              style={{ textAlign: 'center', fontSize: '18px', letterSpacing: '4px' }}
            />
            <button className="tfund-button" type="submit">
              Verify PIN & Send OTP →
            </button>
          </>
        )}

        {otpSent && (
          <>
            <div className="tfund-amount-label">Enter OTP sent to your browser notification</div>
            <input
              className="tfund-amount"
              type="text"
              maxLength={4}
              placeholder="4-digit OTP"
              value={enteredOtp}
              onChange={e => setEnteredOtp(e.target.value)}
              required
            />
            <button className="tfund-button" type="submit">
              Confirm Transfer →
            </button>
          </>
        )}

        <div className="tfund-note">
          By clicking {!showPinEntry ? 'Continue' : (otpSent ? 'Confirm Transfer' : 'Verify PIN')}, I authorize Bank to initiate the transaction detailed above.
        </div>
      </form>
    </div>
  );
}

export default TransferFunds;