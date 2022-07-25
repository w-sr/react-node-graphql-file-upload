import { Box } from "@mui/material";
import React from "react";
import { Navigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import { isAuthenticated } from "../utils/authentication";

interface Props {
  children: React.ReactNode;
}

const PublicRoute: React.FC<Props> = ({ children }) => {
  if (isAuthenticated()) {
    return <Navigate to="/" />;
  }

  return (
    <>
      <NavBar />
      <Box sx={{ display: "flex" }}>{children}</Box>
    </>
  );
};

export default PublicRoute;
