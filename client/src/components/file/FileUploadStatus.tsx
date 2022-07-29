import { useMutation } from "@apollo/client";
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { MAX_FILE_SIZE } from "../../constants";
import { UPLOAD_FILE } from "../../graphql/mutations/files";
import { GET_FILES } from "../../graphql/queries/files";
import { Button } from "../common/Button";
import ProgressBar from "../common/ProgressBar";

const UPLOAD_SUCCESS = "Successfully uploaded!";
const UPLOAD_FAILED = "Upload failed!";

type FileUploadProps = {
  open: boolean;
  files: File[];
  close: () => void;
};

const FileUploadStatus = ({ open, files, close }: FileUploadProps) => {
  const currentFileName = useRef<string>("");
  const [progress, setProgress] = useState<Record<string, number>>({});
  const [message, setMessage] = useState<Record<string, string>>({});
  const [total, setTotal] = useState<number>(0);
  const [clearVisible, setClearVisible] = useState(false);
  const [uploadFile] = useMutation(UPLOAD_FILE, {
    onCompleted: (res) => {
      if (res.uploadFile) {
        const newMessage = { ...message };
        newMessage[currentFileName.current] = UPLOAD_SUCCESS;
        setMessage(newMessage);
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
      const newMessage = { ...message };
      newMessage[currentFileName.current] = UPLOAD_FAILED;
      setMessage(newMessage);
      const pro = { ...progress };
      pro[currentFileName.current] = 0;
      setProgress(pro);
    },
  });

  useEffect(() => {
    const uploadFiles = async () => {
      for (const file of files) {
        if (file.size > MAX_FILE_SIZE) {
          const newMessage = { ...message };
          newMessage[file.name] = "You can only upload gifs";
          setMessage(newMessage);
        } else if (file.type.toLowerCase() !== "image/gif") {
          const newMessage = { ...message };
          newMessage[file.name] = "You can upload up to 10 MB";
          setMessage(newMessage);
        } else {
          currentFileName.current = file.name;
          await uploadFile({
            variables: {
              input: file,
            },
          });
        }
      }
    };
    if (open && files.length > 0) {
      setTotal(files.length);
      uploadFiles();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, files, uploadFile]);

  useEffect(() => {
    if (total > 0 && Object.values(message).length === total) {
      setClearVisible(true);
    }
  }, [message, total]);

  const onClose = () => {
    currentFileName.current = "";
    setClearVisible(false);
    setMessage({});
    setProgress({});
    close();
  };

  const renderTitle = () => {
    if (Object.values(message).length === total) {
      const success = Object.values(message).every((m) => m === UPLOAD_SUCCESS);
      if (success) return "All files successfully uploaded";
      return "Uploading of some files were failed!";
    }
    return "Uploading...";
  };

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
        {message[file.name] && (
          <Box
            sx={{
              fontSize: "0.75rem",
              color: message[file.name] === UPLOAD_SUCCESS ? "green" : "red",
            }}
          >
            {message[file.name]}
          </Box>
        )}
      </Box>
    );
  };

  return (
    <Dialog
      open={open}
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
      aria-labelledby="file-upload-dialog"
    >
      <DialogTitle>{renderTitle()}</DialogTitle>
      <DialogContent>
        {files.map((file: File) => (
          <Box key={file.name} mb={2}>
            <Box>{file.name}</Box>
            {renderStatusBar(file)}
          </Box>
        ))}
      </DialogContent>
      {clearVisible && (
        <DialogActions>
          <Box mt={5} display="flex" justifyContent="flex-end">
            <Button onClick={onClose} autoFocus sx={{ marginRight: 2 }}>
              Clear
            </Button>
          </Box>
        </DialogActions>
      )}
    </Dialog>
  );
};

export default FileUploadStatus;
