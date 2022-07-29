import { useMutation } from "@apollo/client";
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { UPLOAD_FILE } from "../graphql/mutations/files";
import { GET_FILES } from "../graphql/quries/files";
import { MAX_FILE_SIZE } from "../utils/common";
import { Button } from "./common/Button";
import ProgressBar from "./ProgressBar";

type FileUploadProps = {
  show: boolean;
  files: File[];
  close: () => void;
};

const FileUploadStatus = ({ show, files, close }: FileUploadProps) => {
  const currentFileName = useRef<string>("");
  const [progress, setProgress] = useState<Record<string, number>>({});
  const [successMessage, setSuccessMessage] = useState<Record<string, string>>(
    {}
  );
  const [errorMessage, setErrorMessage] = useState<Record<string, string>>({});
  const [uploadFile] = useMutation(UPLOAD_FILE, {
    onCompleted: (res) => {
      if (res.uploadFile) {
        const message = { ...successMessage };
        message[currentFileName.current] = "Successfully uploaded!";
        setSuccessMessage(message);
      }
    },
    refetchQueries: [GET_FILES],
    context: {
      fetchOptions: {
        useUpload: true,
        onProgress: (proEvent: ProgressEvent) => {
          const pro = { ...progress };
          pro[currentFileName.current] =
            (proEvent.loaded * 100) / proEvent.total;
          setProgress(pro);
        },
        onAbortPossible: (abortHandler: any) => {
          console.log(abortHandler);
        },
      },
    },
    onError: (err) => {
      const error = { ...errorMessage };
      error[currentFileName.current] = "Upload failed!";
      setErrorMessage(error);
      const pro = { ...progress };
      pro[currentFileName.current] = 0;
      setProgress(pro);
    },
  });

  useEffect(() => {
    const uploadFiles = async (filteredFiles: File[]) => {
      for (const file of filteredFiles) {
        currentFileName.current = file.name;
        await uploadFile({
          variables: {
            input: file,
          },
        });
      }
    };
    if (show && files.length > 0) {
      const filteredFiles = files.filter(
        (file) =>
          file.size < MAX_FILE_SIZE && file.type.toLowerCase() === "image/gif"
      );
      if (filteredFiles.length > 0) {
        uploadFiles(filteredFiles);
      }
    }
  }, [show, files, uploadFile]);

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
    return (
      <Box>
        <ProgressBar value={progress[file.name] ?? 0} />
        {successMessage[file.name] && (
          <Box sx={{ fontSize: "0.75rem", color: "green" }}>
            {successMessage[file.name]}
          </Box>
        )}
        {errorMessage[file.name] && (
          <Box sx={{ fontSize: "0.75rem", color: "red" }}>
            {errorMessage[file.name]}
          </Box>
        )}
      </Box>
    );
  };

  const onClose = () => {
    currentFileName.current = "";
    setErrorMessage({});
    setSuccessMessage({});
    setProgress({});
    close();
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
          <Button onClick={onClose} autoFocus sx={{ marginRight: 2 }}>
            Clear
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default FileUploadStatus;
