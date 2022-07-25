import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Box, Typography } from "@mui/material";
import { styled } from "@mui/system";
import { NavLink } from "react-router-dom";

const StyledLink = styled(NavLink)({
  textDecoration: "none",
  fontSize: 18,
  color: "black",
  marginLeft: 16,
});

const NotFound = () => {
  return (
    <Box sx={{ height: "100vh", display: "flex" }}>
      <Box
        sx={{
          width: 500,
          height: 200,
          margin: "auto",
          boxShadow: 3,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          Page Not Found
        </Typography>
        <Box display="flex" alignItems="center" mt={2}>
          <ArrowBackIcon />
          <StyledLink to="/dashboard">Go back page</StyledLink>
        </Box>
      </Box>
    </Box>
  );
};

export default NotFound;
