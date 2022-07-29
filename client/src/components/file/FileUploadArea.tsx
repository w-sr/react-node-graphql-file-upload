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
        width: "80%",
        height: 100,
        margin: "20px auto",
        borderStyle: "dotted",
      }}
      {...getRootProps()}
    >
      <Box
        sx={{
          background: overlayVisible ? "grey" : "transparent",
          width: "100%",
          height: "100%",
        }}
        display="flex"
        alignContent={"center"}
        justifyContent={"center"}
      >
        <input {...getInputProps()} />
        <Box display={"flex"} alignItems="center">
          Drag image file to this area to upload.
        </Box>
      </Box>
    </Box>
  );
};

export default FileUploadArea;
