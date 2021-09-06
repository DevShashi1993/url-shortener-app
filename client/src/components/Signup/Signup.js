import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Signup.css";

export default function Signup() {
    
  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    
    const firstName = data.get("firstname");
    const lastName = data.get("lastName");
    const email = data.get("email");
    const password = data.get("password");
    
    const userData = { firstName, lastName, email, password };

    if (![email, password].every(Boolean)) {
      alert("Input fields cannot be empty");
    }
    else {
      const res = await axios.post("/auth/signup", userData);
      if (res.status === 200) {
        console.log(res.data);
        window.location.href = "/login";
      }
    }
  };

  return (
    <>
    <form className="signup-form" onSubmit={handleSubmit}>
      <label htmlFor="firstname">Enter firstname</label>
      <input id="firstname" name="firstname" type="text" />

      <label htmlFor="lastName">Enter lastName</label>
      <input id="lastName" name="lastName" type="text" />

      <label htmlFor="email">Enter your email</label>
      <input id="email" name="email" type="email" />

      <label htmlFor="password">Enter Password</label>
      <input id="password" name="password" type="password" />

      <button>Sign up</button>
    </form>
    <Link to="/login">Click to Login</Link>
    </>
  );
}
