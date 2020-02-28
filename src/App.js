import React, { useState } from 'react';
import NavBar from "./components/NavBar";
import { Router, Route, Switch } from "react-router-dom";
import axios from 'axios';
import Profile from "./components/Profile";
import history from "./utils/history";
import PrivateRoute from "./components/PrivateRoute";
import Home from './components/Home';
import { useAuth0 } from './react-auth0-spa';

let axiosRequestInterceptorSetup;
let axiosResponseInterceptorSetup;
let bufferOf401PromiseResolvers = [];
let bufferOf403PromiseResolvers = [];

function App() {

  axios.defaults.baseURL = process.env.REACT_APP_SERVER;

  const { loading, getTokenSilently } = useAuth0();

  const [dialog401Open, setDialog401Open] = useState(false);
  const [dialog403Open, setDialog403Open] = useState(false);
  const [dialogServerErrorOpen, setDialogServerErrorOpen] = useState(false);

  const ERROR = {
    unauthorized: 401,
    forbidden: 403,
    serverError: 500
  };

  /**
   * Can be used only after Auth0Client is ready!
   * @param config
   * @return {Q.Promise<any> | Promise<any>}
   */
  function axiosRequestInterceptor (config) {
    console.log('axiosRequestInterceptor')
    return getTokenSilently()
      .then((token) => {
        console.log('axiosRequestInterceptor token', token)
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token.raw}`;
        return config;
      })
      .catch((err) => {
        console.log('axiosRequestInterceptor catch', err)
        return config;
      });
  }

  /**
   * Can be used only after Auth0Client is ready!
   * @param error
   * @return {Q.Promise<any> | Promise<any>}
   */
  function axiosResponseFailureInterceptor (error) {
    console.log(error)
    if (error && error.response) {
      switch (error.response.status) {
        case ERROR.unauthorized:
          return new Promise(resolve => {
            bufferOf401PromiseResolvers.push(resolve);
            setDialog401Open(true);
          }).then(() => Promise.reject(error));
        case ERROR.forbidden:
          return new Promise(resolve => {
            bufferOf403PromiseResolvers.push(resolve);
            setDialog403Open(true);
          }).then(() => Promise.reject(error));
        default:
          if (error.response.status >= ERROR.serverError){
            setDialogServerErrorOpen(true);
          }
          return Promise.reject(error);
      }
    } else {
      // Necessary to show errors without status codes like "Network Error"
      setDialogServerErrorOpen(true);
    }

    return Promise.reject(error);
  }

  function closeDialog (errorType) {
    switch (errorType) {
      case ERROR.unauthorized:
        while (bufferOf401PromiseResolvers.length > 0) {
          bufferOf401PromiseResolvers.shift().call();
        }
        setDialog401Open(false);
        break;
      case ERROR.forbidden:
        while (bufferOf403PromiseResolvers.length > 0) {
          bufferOf403PromiseResolvers.shift().call();
        }
        setDialog403Open(false);
        break;
      default:
        setDialog401Open(false);
        setDialog403Open(false);
        setDialogServerErrorOpen(false);
    }
  }

  if (axiosRequestInterceptorSetup != null) {
    axios.interceptors.request.eject(axiosRequestInterceptorSetup);
  }

  if (axiosResponseInterceptorSetup != null) {
    axios.interceptors.response.eject(axiosResponseInterceptorSetup);
  }

  if (!loading) {
    axiosRequestInterceptorSetup = axios.interceptors.request.use(axiosRequestInterceptor);
    axiosResponseInterceptorSetup = axios.interceptors.response.use((resp) => resp, axiosResponseFailureInterceptor);
  }

  let apiErrorsIfAny = null;
  let api401ErrorIfAny = null;
  let api403ErrorIfAny = null;
  let apiServerErrorIfAny = null;

  if (dialog401Open) api401ErrorIfAny = (<div className="container">
    <div className="alert alert-danger mb-2">Authentication is required
      <button type="button" onClick={() => closeDialog(ERROR.unauthorized)} className="close" aria-label="Close"><span aria-hidden="true">&times;</span></button>
    </div>
  </div>);

  if (dialog403Open) api403ErrorIfAny = (<div className="container">
    <div className="alert alert-danger mb-2">You're not authorized to perform an action.
      <button type="button" onClick={() => closeDialog(ERROR.forbidden)} className="close" aria-label="Close"><span aria-hidden="true">&times;</span></button>
    </div>
  </div>);

  if (dialogServerErrorOpen) apiServerErrorIfAny = (<div className="container">
    <div className="alert alert-danger mb-2">Server responded with an unexpected error.
      <button type="button" onClick={() => closeDialog(ERROR.serverError)} className="close" aria-label="Close"><span aria-hidden="true">&times;</span></button>
    </div>
  </div>);

  if (api401ErrorIfAny || api403ErrorIfAny || apiServerErrorIfAny) {
    apiErrorsIfAny = (<div className="bg-dark p-3">
      {api401ErrorIfAny}
      {api403ErrorIfAny}
      {apiServerErrorIfAny}
    </div>);
  }

  return (
    <div className="d-flex min-vh-100 flex-column">
      {apiErrorsIfAny}
      <Router history={history}>
        <header>
          <NavBar />
        </header>
        <main>
          { loading && <div className="d-flex align-items-center justify-content-center my-auto">
            <span className="spinner-border" aria-label="Loading ..." />
          </div> }
          { !loading && <Switch>
            <Route path={process.env.PUBLIC_URL + "/"} exact component={Home}/>
            <PrivateRoute path={process.env.PUBLIC_URL + "/profile"} component={Profile} />
          </Switch> }
        </main>
        <footer className="p-4 text-center bg-primary text-light mt-auto">
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
