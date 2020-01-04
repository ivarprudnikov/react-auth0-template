import React from "react";
import { useAuth0 } from "../react-auth0-spa";
import { Link } from "react-router-dom";

const NavBar = () => {
  const { isAuthenticated, loginWithRedirect, logoutWithRedirect } = useAuth0();

  return (<nav className="navbar navbar-expand navbar-light bg-light">
    <div className="container">
      <Link className="navbar-brand" to={process.env.PUBLIC_URL + "/"}>
        Brnd
      </Link>
      <ul className="navbar-nav mr-auto">
        <li className="nav-item-divider"/>
      </ul>
      {!isAuthenticated && (<ul className="navbar-nav">
        <form className="form-inline">
          <button className="btn btn-outline-primary"
                  type="button"
                  onClick={() => loginWithRedirect({})}>
            Log in
          </button>
        </form>
      </ul>)}
      {isAuthenticated && (<>
        <ul className="navbar-nav">
          <li className="nav-item">
            <Link className="nav-link" to={process.env.PUBLIC_URL + "/"}>Home</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to={process.env.PUBLIC_URL + "/profile"}>Profile</Link>
          </li>
        </ul>
        <form className="form-inline ml-4">
          <button className="btn btn-outline-secondary"
                  type="button"
                  onClick={() => logoutWithRedirect()}>
            Log out
          </button>
        </form>
      </>)}
    </div>
  </nav>);

};

export default NavBar;
