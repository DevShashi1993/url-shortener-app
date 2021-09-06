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
    } else {
      const res = await axios.post("/auth/signup", userData);
      if (res.status === 200) {
        console.log(res.data);
        window.location.href = "/login";
      }
    }
  };

  return (
    <>
      <form className="signup-form-container" onSubmit={handleSubmit}>
        <label htmlFor="firstname">
          <b>Enter first name</b>
        </label>
        <input id="firstname" name="firstname" type="text" required />

        <label htmlFor="lastName">
          <b>Enter last name</b>
        </label>
        <input id="lastName" name="lastName" type="text" required />

        <label htmlFor="email">
          <b>Enter email</b>
        </label>
        <input id="email" name="email" type="text" required />

        <label htmlFor="password">
          <b>Enter password</b>
        </label>
        <input id="password" name="password" type="password" required />

        <button>Sign up</button>
      </form>
      <Link to="/login">Click to Login</Link>
    </>
  );
}
