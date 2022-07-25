import { useMutation } from "@apollo/client";
import { Box, TextField, Typography } from "@mui/material";
import { useFormik } from "formik";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { Button } from "../../components/common/Button";
import { parseErrorMessage } from "../../graphql/helper";
import { REGISTER } from "../../graphql/mutations/auth";
import { StyledLink } from "./styled";

const initialValues = {
  name: "",
  email: "",
  password: "",
};

const Register = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string>("");

  const FormSchema = Yup.object().shape({
    name: Yup.string()
      .required("Name is required")
      .min(2, "Please input valid name")
      .max(35, "Please input valid name")
      .matches(/^[a-zA-Z ]*$/, "Only alphabets are allowed for first name"),
    email: Yup.string().email("Invalid Email").required("Email is required"),
    password: Yup.string()
      .required("Password is required")
      .min(8, "Password should be at least 8 letters"),
  });

  const [registerUser] = useMutation(REGISTER, {
    onCompleted: (res) => {
      if (res.register) {
        localStorage.setItem("token", res.register.token);
        navigate("/dashboard");
      }
    },
    onError: (err) => {
      setErrorMessage(parseErrorMessage(err));
    },
  });

  const formik = useFormik({
    initialValues,
    validationSchema: FormSchema,
    onSubmit: async (values) => {
      registerUser({
        variables: {
          data: {
            ...values,
          },
        },
      });
    },
  });

  const { values, setFieldValue, touched, errors } = formik;

  return (
    <Box
      sx={{
        boxShadow: 3,
        width: 500,
        margin: "50px auto",
        padding: 3,
      }}
    >
      <Typography variant="h4" component="div" sx={{ marginBottom: 4 }}>
        Register
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
            id="name"
            name="name"
            label="Enter Name"
            placeholder="John Doe"
            value={values.name}
            onChange={(e) => setFieldValue("name", e.target.value)}
            error={touched.name && Boolean(errors.name)}
            helperText={touched.name && errors.name}
          />
        </Box>
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
            onChange={(e) => setFieldValue("password", e.target.value)}
            error={touched.password && Boolean(errors.password)}
            helperText={touched.password && errors.password}
          />
        </Box>
        <Box my={2}>
          <Button variant="contained" type="submit">
            Register
          </Button>
        </Box>
        <Box mt={4} display="flex" alignItems="center" justifyContent="center">
          Already have an account?&nbsp;
          <StyledLink to="/login">Click Here To Login</StyledLink>
        </Box>
      </form>
    </Box>
  );
};

export default Register;
