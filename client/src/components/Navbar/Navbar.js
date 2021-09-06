import React from "react";
import { Link, useHistory } from "react-router-dom";
import setJWTToken from "../../utilities/setJWTToken";
import "./Navbar.css";

const Navbar = (props) => {
  let history = useHistory();
  let isLoggedin = props.isLoggedin;

  const logout = () => {
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("usappuser");
    setJWTToken(false);
    props.setIsLoggedin(false)
    history.push('/login');
  };

  return (
    <div className="navbar">
      <div className="nav-header">URL Shortener</div>
      <div className="nav-items">
        {isLoggedin && (
          <>
            <Link to="/">Home</Link>
            <Link to="/generatekey">Generate Key</Link>
            <Link to="/login" onClick={logout}>
              Logout
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
