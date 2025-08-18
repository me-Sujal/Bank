import React, { useState } from "react";
function AccountStatement({ user }) {
  const [txns, setTxns] = useState([]);
  const fetchTxns = async () => {
    let res = await fetch(`http://localhost:5000/api/statement?email=${user}`);
    let data = await res.json();
    setTxns(data.transactions);
  };
  return (
    <div>
      <button onClick={fetchTxns}>View Statement</button>
      <table>
        <thead>
          <tr><th>Sender</th><th>Receiver</th><th>Amount</th></tr>
        </thead>
        <tbody>
          {txns.map((t,i) =>
            <tr key={i}><td>{t.sender}</td><td>{t.receiver}</td><td>{t.amount}</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
export default AccountStatement;
