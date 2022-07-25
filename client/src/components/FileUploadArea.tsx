import { Box } from "@mui/material";
import { useState } from "react";
import { useDropzone } from "react-dropzone";

type Props = {
  submit: (files: File[]) => void;
};
const FileUploadArea = ({ submit }: Props) => {
  const [overlayVisible, setOverlayVisible] = useState(false);

  const onDrop = (acceptedFiles: File[]) => {
    submit(acceptedFiles);
    setOverlayVisible(false);
  };

  const onDragEnter = () => {
    setOverlayVisible(true);
  };

  const onDragLeave = () => {
    setOverlayVisible(false);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    onDragEnter,
    onDragLeave,
    noClick: true,
  });

  return (
    <Box
      sx={{
        position: "absolute",
        textAlign: "center",
        width: "100%",
        height: "calc(100% - 64px)",
      }}
      {...getRootProps()}
    >
      <Box
        sx={{
          display: overlayVisible ? "block" : "none",
          position: "relative",
          background: "grey",
          width: "100%",
          height: "100%",
        }}
      >
        <Box
          sx={{
            margin: 0,
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <input {...getInputProps()} />
          <p>Drag image file to this area to upload.</p>
        </Box>
      </Box>
    </Box>
  );
};

export default FileUploadArea;
