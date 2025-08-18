// import React, { useState } from "react";
// function Register({ setPage }) {
//   const [form, setForm] = useState({ name: "", email: "", username: "", password: "" });
//   const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
//   const handleSubmit = async e => {
//     e.preventDefault();
//     let res = await fetch("http://localhost:5000/api/register", {
//       method: "POST",
//       headers: {"Content-Type": "application/json"},
//       body: JSON.stringify(form)
//     });
//     let data = await res.json();
//     alert(data.message);
//     if (res.ok) setPage("login");
//   };
//   return (
//     <form onSubmit={handleSubmit}>
//       <input name="name" placeholder="Name" onChange={handleChange} /><br />
//       <input name="email" placeholder="Email" onChange={handleChange} /><br />
//       <input name="username" placeholder="Username" onChange={handleChange} /><br />
//       <input name="password" type="password" placeholder="Password" onChange={handleChange} /><br />
//       <button type="submit">Register</button>
//       <button type="button" onClick={() => setPage("login")}>Back to Login</button>
//     </form>
//   );
// }
// export default Register;


import React, { useState } from "react";

function Register({ setPage }) {
  const [form, setForm] = useState({ name: "", email: "", username: "", password: "" });
  
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  
  const handleSubmit = e => {
    e.preventDefault();
    alert("Registration bypassed for demo!");
    setPage("login");
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input name="name" placeholder="Name" onChange={handleChange} required /><br />
      <input name="email" placeholder="Email" onChange={handleChange} required /><br />
      <input name="username" placeholder="Username" onChange={handleChange} required /><br />
      <input name="password" type="password" placeholder="Password" onChange={handleChange} required /><br />
      <button type="submit">Register</button>
      <button type="button" onClick={() => setPage("login")}>Back to Login</button>
    </form>
  );
}

export default Register;
