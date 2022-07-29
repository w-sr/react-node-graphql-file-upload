import { Box } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import React from "react";
import { Navigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import { useQueryMe } from "../graphql/quries/me";
import { isAuthenticated } from "../utils/authentication";

interface Props {
  roles?: string[];
  children: React.ReactNode;
}

const PrivateRoute: React.FC<Props> = ({ children }) => {
  const { data: user, loading } = useQueryMe();

  if (loading) {
    return <CircularProgress />;
  }

  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }

  if (!user) {
    localStorage.removeItem("token");
    return <Navigate to="/login" />;
  }

  return (
    <>
      <NavBar />
      <Box sx={{ display: "flex" }}>{children}</Box>
    </>
  );
};

export default PrivateRoute;
