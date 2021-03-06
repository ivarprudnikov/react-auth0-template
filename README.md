React website with Auth0 login
================================

[![Build Status](https://travis-ci.com/ivarprudnikov/react-auth0-template.svg?branch=master)](https://travis-ci.com/ivarprudnikov/react-auth0-template)
[![GitHub issues](https://img.shields.io/github/issues/ivarprudnikov/react-auth0-template.svg)](https://github.com/ivarprudnikov/react-auth0-template/issues)
[![GitHub last commit](https://img.shields.io/github/last-commit/ivarprudnikov/react-auth0-template.svg)](https://github.com/ivarprudnikov/react-auth0-template/commits/master)

[> PREVIEW LIVE](https://ivarprudnikov.github.io/react-auth0-template/)

![Homepage screenshot](./homepage.png "Homepage screenshot")

- Project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
- Added Auth0 steps steps from [auth0.com/docs/quickstart/spa/react](https://auth0.com/docs/quickstart/spa/react)
- Further enhancements applied as documented in [blog post](https://www.ivarprudnikov.com/auth0-authentication-website-react/) or visible in [code changes](https://github.com/ivarprudnikov/react-auth0-template/compare/50b1cd7f523dc112208b83f021c0c4113db32b00...master)

## Using token in API calls 

Auth token is sent over to the API via authrization header. API checks its validity and responds appropriately. In particular [`Profile` component](src/components/Profile.js) is using the API. Authorization header is populated through [`axios` request interceptor](src/App.js).

| API Base URL | API Github repository |
| ---------------------------- | ------------------------------------------ |
| https://te60oj36jd.execute-api.eu-west-1.amazonaws.com/Prod/ | https://github.com/ivarprudnikov/auth0-micronaut-template |
--------------------------------
