import { Snackbar, SnackbarProps } from "@mui/material";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import * as React from "react";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export type CustomSnackbarProps = SnackbarProps & AlertProps;

const CustomSnackbar = ({ message, ...props }: CustomSnackbarProps) => {
  return (
    <Snackbar {...props} autoHideDuration={5000}>
      <Alert severity={props.severity} sx={{ width: "100%" }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default CustomSnackbar;
