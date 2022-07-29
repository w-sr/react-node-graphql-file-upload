import { useMutation } from "@apollo/client";
import { Box, TextField, Typography } from "@mui/material";
import { useFormik } from "formik";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { Button } from "../../components/common/Button";
import { parseErrorMessage } from "../../graphql/helpers";
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
      .trim()
      .required("Name is required")
      .min(2, "Please input at minimum 2 letters")
      .max(35, "Please input at maximum 35 letters")
      .matches(/^[a-zA-Z ]*$/, "Only alphabets are allowed for name"),
    email: Yup.string().email("Invalid Email").required("Email is required"),
    password: Yup.string()
      .required("Password is required")
      .min(8, "Password should be at least 8 letters"),
  });

  const [register] = useMutation(REGISTER, {
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
      const { name, ...rest } = values;
      register({
        variables: {
          input: {
            ...rest,
            name: name.trim(),
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
        boxShadow: 3,
      }}
    >
      <Typography variant="h4" component="div" sx={{ marginBottom: 4 }}>
        Create A New Account
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
