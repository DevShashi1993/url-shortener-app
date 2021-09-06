import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import jwt_decode from "jwt-decode";
import setJWTToken from "./utilities/setJWTToken";
import "./App.css";
import Main from "./components/Main/Main";
import Navbar from "./components/Navbar/Navbar";
import Signup from "./components/Signup/Signup";
import Login from "./components/Login/Login";
import GenerateKey from "./components/GenerateKey/GenerateKey";

function App() {
  const [isLoggedin, setIsLoggedin] = useState(false);
  const [userData, setUserData] = useState({});

  useEffect(() => {
    const jwtToken = localStorage.jwtToken;
    if (jwtToken) {
      const userData = JSON.parse(localStorage.usappuser);

      if (userData.isLoggedin) {
        setIsLoggedin(true);
        setUserData(userData);
      }

      setJWTToken(jwtToken);
      const decoded_jwtToken = jwt_decode(jwtToken);

      const currentTime = Date.now() / 1000;

      if (decoded_jwtToken.exp < currentTime) {
        localStorage.removeItem("jwtToken");
        setJWTToken(false);
        window.location.href = "/login";
      }
    }
  }, []);

  const SecuredRoute = ({ component: Component, ...otherProps }) => (
    <Route
      {...otherProps}
      render={() =>
        isLoggedin === true ? (
          <Component isLoggedin={isLoggedin} {...otherProps} />
        ) : (
          <Login isLoggedin={isLoggedin} {...otherProps} />
        )
      }
    />
  );

  return (
    <Router>
      <div className="App">
        <Navbar isLoggedin={isLoggedin} setIsLoggedin={setIsLoggedin}/>
        <div className="app-container">
          <Switch>
            <SecuredRoute
              exact path="/"
              isLoggedin={isLoggedin}
              userData={userData}
              component={Main}
            />
            <SecuredRoute
              exact path="/generatekey"
              isLoggedin={isLoggedin}
              userData={userData}
              setUserData={setUserData}
              component={GenerateKey}
            />
            <Route exact path="/login" component={Login} />
            <Route exact path="/signup" component={Signup} />
            
          </Switch>
        </div>
      </div>
    </Router>
  );
}

export default App;
