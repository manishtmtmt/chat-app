import React from "react";
import { Navigate } from "react-router-dom";
import { Container, Loader } from "rsuite";
import { useProfile } from "../context/profile.context";

const PublicRoute = ({ children }) => {
  const { profile, isLoading } = useProfile();

  if (isLoading && !profile) {
    return (
      <Container>
        <Loader center vertical size="md" speed="slow" />
      </Container>
    );
  }

  if (profile && !isLoading) {
    return <Navigate to={"/"} />;
  }

  return children;
};

export default PublicRoute;
