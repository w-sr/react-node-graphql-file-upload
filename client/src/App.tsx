import { ApolloProvider } from "@apollo/client";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { BrowserRouter } from "react-router-dom";
import "./App.css";
import client from "./graphql/ApiClient";
import { renderRoutes } from "./routes/routes";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
  },
});

function App() {
  return (
    <ApolloProvider client={client}>
      <ThemeProvider theme={theme}>
        <BrowserRouter>{renderRoutes()}</BrowserRouter>
      </ThemeProvider>
    </ApolloProvider>
  );
}

export default App;
