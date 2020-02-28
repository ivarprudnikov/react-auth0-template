import React, { useEffect, useState } from 'react';
import { useAuth0 } from "../react-auth0-spa";
import axios from 'axios';

const Profile = () => {
  const { loading, user } = useAuth0();
  const [apiUser, setApiUser] = useState({});

  useEffect(() => {
    if (!loading && user) {
      axios.get('/me')
        .then(response => setApiUser(response.data))
        .catch(() => {
          setApiUser({});
        });
    }
  }, [loading, user]);

  if (loading || !user) {
    return <div className="d-flex min-vh-100 align-items-center justify-content-center">
      <span className="spinner-border" aria-label="Loading ..." />
    </div>;
  }

  return (
    <div className="container">
      <div className="row">
        <div className="col-2">
          <img src={user.picture} alt="Profile" className="img-fluid" />
        </div>
        <div className="col-sm-4">
          <h2>{user.name}</h2>
          <p>{user.email}</p>
        </div>
        <div className="col-sm-6">
          <code className="p-3 bg-dark text-light d-block mb-3">{JSON.stringify(user, null, 2)}</code>
          <pre className="p-3 bg-dark text-light d-block">{JSON.stringify(apiUser, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
};

export default Profile;
