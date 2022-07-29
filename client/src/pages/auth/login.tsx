import { useMutation } from "@apollo/client";
import { Box, TextField, Typography } from "@mui/material";
import { useFormik } from "formik";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { Button } from "../../components/common/Button";
import { parseErrorMessage } from "../../graphql/helpers";
import { LOGIN } from "../../graphql/mutations/auth";
import { StyledLink } from "./styled";

const initialValues = {
  email: "",
  password: "",
};

const Login = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string>("");

  const FormSchema = Yup.object().shape({
    email: Yup.string().email("Invalid Email").required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  const [login] = useMutation(LOGIN, {
    onCompleted: (res) => {
      localStorage.setItem("token", res.login.token);
      navigate("/dashboard");
    },
    onError: (err) => {
      setErrorMessage(parseErrorMessage(err));
    },
  });

  const formik = useFormik({
    initialValues,
    validationSchema: FormSchema,
    onSubmit: async (values) => {
      await login({
        variables: {
          input: {
            email: values.email,
            password: values.password,
          },
        },
      });
    },
  });

  const { values, setFieldValue, touched, errors } = formik;

  return (
    <Box
      sx={{
        width: 500,
        padding: 3,
        margin: "50px auto",
        boxShadow: 2,
      }}
    >
      <Typography variant="h4" component="div" sx={{ marginBottom: 4 }}>
        Login To Your Account
      </Typography>
      <Box minHeight={30}>
        {errorMessage && (
          <Typography
            variant="subtitle2"
            sx={{ color: "red", marginBottom: 2 }}
            textAlign="center"
          >
            {errorMessage}
          </Typography>
        )}
      </Box>
      <form onSubmit={formik.handleSubmit}>
        <Box my={2}>
          <TextField
            fullWidth
            id="email"
            name="email"
            label="Enter Email"
            placeholder="john@example.com"
            value={values.email}
            onChange={(e) => {
              setErrorMessage("");
              setFieldValue("email", e.target.value);
            }}
            error={touched.email && Boolean(errors.email)}
            helperText={touched.email && errors.email}
          />
        </Box>
        <Box my={2}>
          <TextField
            fullWidth
            id="password"
            type="password"
            name="password"
            label="Enter Password"
            placeholder="****************"
            value={values.password}
            onChange={(e) => {
              setErrorMessage("");
              setFieldValue("password", e.target.value);
            }}
            error={touched.password && Boolean(errors.password)}
            helperText={touched.password && errors.password}
          />
        </Box>
        <Box my={2}>
          <Button variant="contained" type="submit">
            Login
          </Button>
        </Box>
        <Box mt={4} display="flex" alignItems="center" justifyContent="center">
          Don't have an account?&nbsp;
          <StyledLink to="/register">Create A New Account</StyledLink>
        </Box>
      </form>
    </Box>
  );
};

export default Login;
