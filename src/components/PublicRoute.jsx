import React from "react";
import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }) => {
  const profile = true;

  if (profile) {
    return <Navigate to={"/"} />;
  }

  return children;
};

export default PublicRoute;
