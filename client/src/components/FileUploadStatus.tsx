import { useMutation } from "@apollo/client";
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { useEffect } from "react";
import { CREATE_FILE } from "../graphql/mutations/files";
import { Button } from "./common/Button";
import ProgressBar from "./ProgressBar";

type FileUploadProps = {
  show: boolean;
  files: File[];
  clear: () => void;
};

const FileUploadStatus = ({ show, files, clear }: FileUploadProps) => {
  const [uploadFiles] = useMutation(CREATE_FILE);

  useEffect(() => {
    if (show && files.length > 0)
      uploadFiles({
        variables: {
          input: files,
        },
      });
  }, [show, files, uploadFiles]);

  return (
    <Dialog
      open={show}
      sx={{
        "& .MuiDialog-container": {
          alignItems: "flex-end",
          justifyContent: "flex-end",
        },
      }}
      PaperProps={{
        sx: { minWidth: 500 },
      }}
      maxWidth="xs"
      aria-labelledby="add-fodd-dialog"
    >
      <DialogTitle>Uploading...</DialogTitle>
      <DialogContent>
        {files.map((file: File) => (
          <Box key={file.name} mb={2}>
            <Box>{file.name}</Box>
            <ProgressBar value={0} />
          </Box>
        ))}
      </DialogContent>
      <DialogActions>
        <Box mt={5} display="flex" justifyContent="flex-end">
          <Button onClick={clear} autoFocus sx={{ marginRight: 2 }}>
            Clear
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default FileUploadStatus;
