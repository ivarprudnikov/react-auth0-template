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
  redirect_uri,
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
        scope: config.scope,
        redirect_uri: redirect_uri
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

  }, [redirect_uri, onRedirectCallback]);

  const handleRedirectCallback = async () => {
    setLoading(true);
    await auth0Client.handleRedirectCallback();
    const user = await auth0Client.getUser();
    setLoading(false);
    setIsAuthenticated(true);
    setUser(user);
  };

  const getTokenSilently = async () => {
    const accessToken = await auth0Client.getTokenSilently();
    return { raw: accessToken, decoded: jwt_decode(accessToken) };
  };

  const hasAnyScopeAsync = async (scopes) => {
    const token = await getTokenSilently();
    const tokenScopes = (token.decoded.scope || '').split(/\W/);
    return scopes && scopes.length && scopes.some(s => tokenScopes.indexOf(s) > -1);
  };

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
        logout: (...p) => auth0Client.logout(...p)
      }}
    >
      {children}
    </Auth0Context.Provider>
  );
};
