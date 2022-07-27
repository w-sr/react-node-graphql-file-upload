import { LinearProgress } from "@mui/material";
import { Fragment, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Login from "../pages/auth/login";
import Register from "../pages/auth/register";
import NotFound from "../pages/not-found";
import Dashboard from "../pages/dashboard";
import PublicImagePage from "../pages/public-image";
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";

const routes = [
  {
    path: "/",
    access: "private",
    element: <Navigate to="/dashboard" />,
  },
  {
    path: "/login",
    access: "public",
    element: <Login />,
  },
  {
    path: "/register",
    access: "public",
    element: <Register />,
  },
  {
    path: "/dashboard",
    access: "private",
    element: <Dashboard />,
  },
  {
    path: "/g/:url",
    element: <PublicImagePage />,
  },
];

export const renderRoutes = () => {
  return (
    <Suspense fallback={<LinearProgress />}>
      <Routes>
        {routes.map((route, i: number) => {
          if (route.access === "private") {
            return (
              <Route
                key={i}
                path={route.path}
                element={<PrivateRoute>{route.element}</PrivateRoute>}
              />
            );
          } else if (route.access === "public") {
            return (
              <Route
                key={i}
                path={route.path}
                element={<PublicRoute>{route.element}</PublicRoute>}
              />
            );
          } else {
            return <Route key={i} path={route.path} element={route.element} />;
          }
        })}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default routes;
