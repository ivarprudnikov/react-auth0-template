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
            <Route path="/" exact component={Home}/>
            <PrivateRoute path="/profile" component={Profile} />
          </Switch>
        </main>
        <footer className="p-4 text-center bg-primary text-light">
          <small>Version: {window.REACT_APP_VERSION}</small>
        </footer>
      </Router>
    </div>
  );
}

export default App;
