import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";
import setJWTToken from "../../utilities/setJWTToken";
import jwt_decode from "jwt-decode";
import { GoogleLogin } from "react-google-login";
import "./Login.css";

export default function Login(props) {
  let history = useHistory();

  // useEffect(() => {
  //   if(props.isLoggedin === false) {
  //     console.log('redirecting to login page from login component');
  //     history.push('/login');
  //   }
  // }, [history, props.isLoggedin])

  const handleOnSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    const userData = {
      email: data.get("email"),
      password: data.get("password"),
    };

    const res = await axios.get("/auth/login", {
      params: userData
    });

    if (res.status === 200) {
      console.log(res.data);

      const { first_name, last_name, email, api_key, jwtToken } =
        await res.data;

      const decoded_jwtToken = jwt_decode(jwtToken);

      let userData = {
        firstName: first_name,
        lastName: last_name,
        email: email,
        apiKey: api_key,
        isLoggedin: decoded_jwtToken ? true : false,
      };

      if (jwtToken) {
        localStorage.setItem("jwtToken", jwtToken);
        localStorage.setItem("usappuser", JSON.stringify(userData));
      }

      setJWTToken(jwtToken);
      window.location.href = '/';
    }
  };

  const onLoginSuccess = (response) => {
    console.log("Google Login Success: ", response);
    var id_token = response.getAuthResponse().id_token;
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost:5000/auth/tokensignin");
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onload = function () {
      const responseData = JSON.parse(xhr.responseText);
      const { first_name, last_name, email, api_key, jwtToken } = responseData;
      const decoded_jwtToken = jwt_decode(jwtToken);

      let userData = {
        firstName: first_name,
        lastName: last_name,
        email: email,
        apiKey: api_key,
        isLoggedin: decoded_jwtToken ? true : false,
      };

      if (jwtToken) {
        localStorage.setItem("jwtToken", jwtToken);
        localStorage.setItem("usappuser", JSON.stringify(userData));
      }

      setJWTToken(jwtToken);
      window.location.href = '/';
    };
    xhr.send("idtoken=" + id_token);
  };

  const onLoginFailure = (response) => {
    console.log("Google Login Failed: ", response);
  };

  return (
    <>
      <form className="login-form" onSubmit={handleOnSubmit}>
        <input type="text" placeholder="Email" name="email" />

        <input type="password" placeholder="Password" name="password" />

        <GoogleLogin
          clientId="33139913563-3hgrkp0reqpegvc4svs6ussov05rr1g6.apps.googleusercontent.com"
          buttonText="Login"
          onSuccess={onLoginSuccess}
          onFailure={onLoginFailure}
          cookiePolicy={"single_host_origin"}
        />

        <button type="submit">Login</button>
      </form>
      <Link to="/signup">Click to Signup</Link>
    </>
  );
}
