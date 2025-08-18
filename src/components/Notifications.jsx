import React, { useState } from "react";
function Notifications() {
  const [notes, setNotes] = useState([]);
  const fetchNotes = async () => {
    let res = await fetch("http://localhost:5000/api/notifications");
    let data = await res.json();
    setNotes(data.notifications);
  };
  return (
    <div>
      <button onClick={fetchNotes}>View Notifications</button>
      <ul>
        {notes.map((n,i) => <li key={i}>{n}</li>)}
      </ul>
    </div>
  );
}
export default Notifications;
