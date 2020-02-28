import React, { useContext, useEffect, useState } from 'react';
import jwt_decode from 'jwt-decode';
import createAuth0Client from '@auth0/auth0-spa-js';
import config from './auth_config';

const DEFAULT_REDIRECT_CALLBACK = () =>
  window.history.replaceState({}, document.title, window.location.pathname);

export const Auth0Context = React.createContext({});
export const useAuth0 = () => useContext(Auth0Context);
export const Auth0Provider = ({
  children,
  onRedirectCallback
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [auth0Client, setAuth0] = useState(null);
  const [loading, setLoading] = useState(true);

  if (typeof onRedirectCallback !== 'function') {
    onRedirectCallback = DEFAULT_REDIRECT_CALLBACK;
  }

  /**
   * Should run only once as options do not change
   */
  useEffect(() => {
    const initAuth0 = async () => {

      const auth0FromHook = await createAuth0Client({
        domain: config.domain,
        client_id: config.clientId,
        audience: config.audience,
        scope: config.scope,
        redirect_uri: config.loginCallbackUrl
      });
      setAuth0(auth0FromHook);

      if (window.location.search.includes('code=')) {
        const { appState } = await auth0FromHook.handleRedirectCallback();
        onRedirectCallback(appState);
      }

      const isAuthenticated = await auth0FromHook.isAuthenticated();

      setIsAuthenticated(isAuthenticated);

      if (isAuthenticated) {
        const user = await auth0FromHook.getUser();
        setUser(user);
      }

      setLoading(false);
    };

    initAuth0()
      .catch((e) => {
        console.error('initAuth0 failure', e);
        window.location.replace('/');
      });

  }, [onRedirectCallback]);

  const handleRedirectCallback = async () => {
    setLoading(true);
    await auth0Client.handleRedirectCallback();
    const user = await auth0Client.getUser();
    setLoading(false);
    setIsAuthenticated(true);
    setUser(user);
  };

  const getTokenSilently = async () => {
    let accessToken;
    try {
      accessToken = await auth0Client.getTokenSilently();
    } catch (e) {
      console.log(e);
      throw new Error("Could not obtain access token");
    }
    try {
      return { raw: accessToken, decoded: jwt_decode(accessToken) };
    } catch (e) {
      console.log(e);
      throw new Error("Could not decode access token");
    }
  };

  const getTokenScopesAsync = async () => {
    let token;
    try {
      token = await getTokenSilently();
    } catch (e) {
      return [];
    }
    const scopeString = (token.decoded.scope || '') + '';
    return scopeString.split(/\W/);
  };

  const hasAnyScopeAsync = async (scopes) => {
    const tokenScopes = await getTokenScopesAsync();
    return scopes && scopes.length && scopes.some(s => tokenScopes.indexOf(s) > -1);
  };

  const logoutWithRedirect = () => auth0Client.logout({
    returnTo: config.logoutRedirectUrl
  });

  return (
    <Auth0Context.Provider
      value={{
        isAuthenticated,
        user,
        loading,
        handleRedirectCallback,
        getIdTokenClaims: (...p) => auth0Client.getIdTokenClaims(...p),
        loginWithRedirect: (...p) => auth0Client.loginWithRedirect(...p),
        getTokenSilently,
        hasAnyScopeAsync,
        getTokenWithPopup: (...p) => auth0Client.getTokenWithPopup(...p),
        logoutWithRedirect
      }}
    >
      {children}
    </Auth0Context.Provider>
  );
};
