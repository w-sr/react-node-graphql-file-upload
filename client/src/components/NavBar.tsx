import AccountCircle from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { NavLink, useNavigate } from "react-router-dom";
import client from "../graphql/ApiClient";
import { useQueryMe } from "../graphql/queries/me";
import { isAuthenticated } from "../utils/authentication";

type RouterProps = {
  label: string;
  path: string;
};

const routes: RouterProps[] = [
  {
    label: "Login",
    path: "/login",
  },
  {
    label: "Register",
    path: "/register",
  },
];

const NavBar = () => {
  const navigate = useNavigate();
  const { pathname } = window.location;
  const isLoggedIn = isAuthenticated();
  const { data: me } = useQueryMe();

  const logout = async () => {
    localStorage.removeItem("token");
    client.clearStore();
    navigate("/");
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Box sx={{ flexGrow: 1 }} display="flex" alignItems={"center"}>
            <NavLink to="/" style={{ textDecoration: "none" }}>
              <Typography
                variant="h5"
                component="div"
                sx={{ marginRight: 3, color: "white" }}
              >
                Gifs Drive
              </Typography>
            </NavLink>
          </Box>

          <Box display={"flex"} alignItems={"center"}>
            {isLoggedIn ? (
              <>
                <Typography variant="subtitle1">{me?.name}</Typography>
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  color="inherit"
                >
                  <AccountCircle />
                </IconButton>
                <IconButton
                  size="large"
                  aria-label="log out"
                  color="inherit"
                  onClick={logout}
                >
                  <LogoutIcon />
                </IconButton>
              </>
            ) : (
              routes.map((router: RouterProps) => (
                <NavLink
                  key={router.label.toLowerCase()}
                  to={router.path}
                  style={{
                    textDecoration: pathname.includes(router.path)
                      ? "underline"
                      : "none",
                    color: "white",
                  }}
                >
                  <Box ml={2}>{router.label}</Box>
                </NavLink>
              ))
            )}
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default NavBar;
