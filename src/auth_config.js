import packageJson from '../package.json';

export default {
  domain: "ivarprudnikov.eu.auth0.com",
  clientId: "EuHrJlslqdI6h5UOuAMtau6maPa05lRd",
  audience: "https://ivarprudnikov.com",
  scope: "openid profile email",
  loginCallbackUrl: process.env.NODE_ENV === 'production' ? packageJson.homepage : window.location.origin,
  logoutRedirectUrl: process.env.NODE_ENV === 'production' ? packageJson.homepage : window.location.origin
}
