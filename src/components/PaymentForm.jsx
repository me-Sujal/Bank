import React, { useState } from "react";
import "./TransferFunds.css";

// Map payment types to recipients
const PAYMENT_RECIPIENTS = {
  bills: "John Smith",
  utilities: "NEA",
  water: "NDWA",
  education: "Pulchowk Campus"
};

function PaymentForm({
  user,
  availableBalance,
  paymentType, // "bills", "utilities", "water", or "education"
  updateBalance,
  addTransaction,
  addNotification,
  addStatement,
  onClose
}) {
  const [amount, setAmount] = useState("");
  const [fromAccount, setFromAccount] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [enteredOtp, setEnteredOtp] = useState("");

  const accounts = ["Checking", "Savings", "Business"].map(a => `${user} - ${a}`);
  const recipient = PAYMENT_RECIPIENTS[paymentType];

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
      alert(`Your OTP is: ${otp}`);
    }
  };

  const handleTransfer = e => {
    e.preventDefault();
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
      updateBalance(amt);
      const transaction = {
        id: Date.now(),
        type: 'debit',
        amount: amt,
        description: `Payment to ${recipient}`,
        date: new Date().toISOString().split('T')[0],
        from: fromAccount,
        to: recipient
      };
      addTransaction(transaction);
      addStatement(transaction);
      addNotification({
        id: Date.now(),
        title: "Payment Successful",
        message: `You paid $${amt} to ${recipient}`,
        date: new Date().toLocaleString()
      });
      if (window.Notification && Notification.permission === "granted") {
        new Notification("Payment Successful", { body: `Paid $${amt} to ${recipient}` });
      } else if (window.Notification && Notification.permission !== "denied") {
        Notification.requestPermission().then(permission => {
          if (permission === "granted") {
            new Notification("Payment Successful", { body: `Paid $${amt} to ${recipient}` });
          } else {
            alert(`Paid $${amt} to ${recipient}`);
          }
        });
      } else {
        alert(`Paid $${amt} to ${recipient}`);
      }
      setAmount("");
      setFromAccount("");
      setOtpSent(false);
      setGeneratedOtp("");
      setEnteredOtp("");
      if (onClose) onClose();
    } else {
      alert("Incorrect OTP. Please try again.");
    }
  };

  return (
    <div className="tfund-root">
      <form className="tfund-form" onSubmit={otpSent ? handleOtpSubmit : handleTransfer}>
        <div className="tfund-title">
          <span className="tfund-icon">💸</span> <span className="tfund-bank">Payment</span>
        </div>
        <div className="tfund-subtitle">Pay to: <b>{recipient}</b></div>
        
        {!otpSent && (
          <>
            <div className="tfund-amount-label">Amount</div>
            <div className="tfund-amount-row">
              <span className="tfund-money-sign">$</span>
              <input
                className="tfund-amount"
                type="number"
                min="0"
                max={availableBalance}
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                required
              />
            </div>

            <div className="tfund-select-label">Pay from</div>
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

            <button className="tfund-button" type="submit">
              Send OTP →
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
              Confirm Payment →
            </button>
          </>
        )}

        <div className="tfund-note">
          By clicking Pay, I authorize Bank to initiate the transaction detailed above.
        </div>
      </form>
    </div>
  );
}

export default PaymentForm;
