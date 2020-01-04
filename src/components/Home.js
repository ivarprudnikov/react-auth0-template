import React from "react";
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="container text-center">
      <h1 className="display-1">Super fancy app</h1>
      <div className="mt-5">
        <Link className="btn btn-lg btn-primary mr-2" to={process.env.PUBLIC_URL + "/profile"}>Protected profile page</Link>
      </div>
    </div>
  );
};

export default Home;
