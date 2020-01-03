import React from "react";
import { useAuth0 } from "../react-auth0-spa";

const Profile = () => {
  const { loading, user } = useAuth0();

  if (loading || !user) {
    return <div>Loading...</div>;
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
          <code className="p-3 bg-dark text-light d-block">{JSON.stringify(user, null, 2)}</code>
        </div>
      </div>
    </div>
  );
};

export default Profile;
