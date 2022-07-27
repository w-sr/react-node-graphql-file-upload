import { useMutation, useSubscription } from "@apollo/client";
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { useEffect } from "react";
import { CREATE_FILE, FILE_UPLOAD_PROGRESS } from "../graphql/mutations/files";
import { GET_FILES } from "../graphql/quries/files";
import { MAX_FILE_SIZE } from "../utils/common";
import { Button } from "./common/Button";
import ProgressBar from "./ProgressBar";

type FileUploadProps = {
  show: boolean;
  files: File[];
  clear: () => void;
};

const FileUploadStatus = ({ show, files, clear }: FileUploadProps) => {
  const { data } = useSubscription(FILE_UPLOAD_PROGRESS, {
    variables: {
      sessionId: "1",
    },
  });

  console.log(data);

  const [uploadFiles] = useMutation(CREATE_FILE, {
    onCompleted: (res) => {
      if (res.createFile) {
        clear();
      }
    },
    refetchQueries: [GET_FILES],
  });

  useEffect(() => {
    if (show && files.length > 0) {
      const filteredFiles = files.filter(
        (file) =>
          file.size < MAX_FILE_SIZE && file.type.toLowerCase() === "image/gif"
      );
      if (filteredFiles.length > 0) {
        uploadFiles({
          variables: {
            input: filteredFiles,
          },
        });
      }
    }
  }, [show, files, uploadFiles]);

  const renderStatusBar = (file: File) => {
    if (file.type.toLowerCase() !== "image/gif") {
      return (
        <Box sx={{ fontSize: "0.75rem", color: "red" }} mt={1}>
          You can only upload gifs
        </Box>
      );
    } else if (file.size > MAX_FILE_SIZE) {
      return (
        <Box sx={{ fontSize: "0.75rem", color: "red" }} mt={1}>
          You can upload up to 10 MB
        </Box>
      );
    }
    return <ProgressBar value={0} />;
  };

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
            {renderStatusBar(file)}
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
