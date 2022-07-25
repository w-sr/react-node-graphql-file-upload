import { Box, TextField } from "@mui/material";
import { useCallback, useState } from "react";

import ConfirmModal from "../../components/ConfirmModal";
import FileUploadArea from "../../components/FileUploadArea";
import CustomSnackbar, { CustomSnackbarProps } from "../../components/Snackbar";
import FileModal from "./fileModal";
import FileUploadStatus from "../../components/FileUploadStatus";
import EmptyCard from "../../components/EmptyCard";
import { useQueryTag } from "../../graphql/quries/tags";
import { Tag } from "../../graphql/type";

const Dashboard = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [confirmModal, setConfirmModal] = useState(false);
  const [snackBarDetails, setSnackBar] = useState<CustomSnackbarProps>({});
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [filter, setFilter] = useState<string>("");

  const { data, loading } = useQueryTag();

  const tags = data?.map((x: Tag) => x.name);

  const onConfirm = () => console.log("xxx");

  const filterChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setFilter(event.target.value);
    },
    []
  );

  const uploadFiles = useCallback((data: File[]) => {
    setFiles(data);
  }, []);

  return (
    <Box flexGrow={1}>
      {/* File upload area */}
      <FileUploadArea submit={uploadFiles} />

      {/* Search area */}
      <Box sx={{ flexGrow: 1 }} mt={5} mx={5}>
        <TextField
          fullWidth
          placeholder="Search your GIFs by name or tags..."
          onChange={filterChange}
        />
      </Box>

      {/* File List */}
      <Box sx={{ flexGrow: 1 }} mt={5}>
        <EmptyCard content="No Uploaded Files!" />
      </Box>

      {/* File detail modal */}
      {/* <FileModal
        open={true}
        onClose={() => console.log(false)}
        tags={tags}
        file={{
          _id: "1111",
          name: "xxxx",
          tags: [],
          public: true,
          publicUrl: "xxx",
          url: "xxx",
          user: "xxx",
        }}
      /> */}

      {/* Upload progress modal */}
      <FileUploadStatus
        show={files.length > 0}
        files={files}
        clear={() => setFiles([])}
      />

      {/* Confirm modal */}
      <ConfirmModal
        open={confirmModal}
        onClose={() => setConfirmModal(false)}
        title={"Are you sure to delete this file?"}
        onConfirm={onConfirm}
      />

      {/* Snackbar */}
      <CustomSnackbar
        {...snackBarDetails}
        onClose={() => setSnackBar({ open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </Box>
  );
};

export default Dashboard;
