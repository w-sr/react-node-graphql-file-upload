import { Box, Dialog, DialogActions, DialogTitle } from "@mui/material";
import { Button } from "./common/Button";

type ModalProps = {
  open: boolean;
  title: string;
  onClose: () => void;
  onConfirm: () => void;
};

const ConfirmModal = ({ open, title, onClose, onConfirm }: ModalProps) => {
  return (
    <Dialog
      open={open}
      sx={{ "& .MuiDialog-paper": { minWidth: 500 } }}
      maxWidth="xs"
      aria-labelledby="confirm-dialog"
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogActions>
        <Box mt={5} display="flex" justifyContent="flex-end">
          <Button onClick={onClose} autoFocus sx={{ marginRight: 2 }}>
            Cancel
          </Button>
          <Button variant="contained" onClick={onConfirm}>
            OK
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmModal;
