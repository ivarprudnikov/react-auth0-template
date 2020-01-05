import React from "react";
import NavBar from "./components/NavBar";
import { Router, Route, Switch } from "react-router-dom";
import Profile from "./components/Profile";
import history from "./utils/history";
import PrivateRoute from "./components/PrivateRoute";
import Home from './components/Home';

function App() {
  return (
    <div className="d-flex min-vh-100 flex-column justify-content-between">
      <Router history={history}>
        <header>
          <NavBar />
        </header>
        <main>
          <Switch>
            <Route path={process.env.PUBLIC_URL + "/"} exact component={Home}/>
            <PrivateRoute path={process.env.PUBLIC_URL + "/profile"} component={Profile} />
          </Switch>
        </main>
        <footer className="p-4 text-center bg-primary text-light">
          <div className="container">
            <div className="d-flex justify-content-between align-items-center">
              <small>Version: {window.REACT_APP_VERSION}</small>
              <span className="mx-auto"></span>
              <a href="https://github.com/ivarprudnikov/react-auth0-template" className="btn btn-sm btn-outline-light mr-3">Source code on Github</a>
              <a href="https://www.ivarprudnikov.com/auth0-authentication-website-react/" className="btn btn-sm btn-outline-light">About this implementation</a>
            </div>
          </div>
        </footer>
      </Router>
    </div>
  );
}

export default App;
