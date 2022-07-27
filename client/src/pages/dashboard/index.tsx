import { Box, TextField } from "@mui/material";
import { useCallback, useEffect, useState } from "react";

import ConfirmModal from "../../components/ConfirmModal";
import FileUploadArea from "../../components/FileUploadArea";
import CustomSnackbar, { CustomSnackbarProps } from "../../components/Snackbar";
import FileModal from "./fileModal";
import FileUploadStatus from "../../components/FileUploadStatus";
import EmptyCard from "../../components/EmptyCard";
import { useQueryTag } from "../../graphql/quries/tags";
import { FileModel, Tag } from "../../graphql/type";
import { GET_FILES, useQueryFiles } from "../../graphql/quries/files";
import { useQuery } from "@apollo/client";
import FileCard from "../../components/FileCard";
import Pagination from "../../components/Pagination";

const Dashboard = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [confirmModal, setConfirmModal] = useState(false);
  const [snackBarDetails, setSnackBar] = useState<CustomSnackbarProps>({});
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [filter, setFilter] = useState<string>("");
  const [currentId, setCurrentId] = useState<string>("");

  const { data, loading } = useQueryTag();
  const { data: filesArray, refetch } = useQuery(GET_FILES, {
    variables: {
      filters: {
        name: "",
        page,
        pageSize,
      },
    },
  });

  const tags = data?.map((x: Tag) => x.name);
  const rows = filesArray?.getFiles.files;

  const onConfirm = () => console.log("xxx");

  const filterChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setFilter(event.target.value);
    },
    []
  );

  const onEdit = (_id: string) => setCurrentId(_id);

  const uploadFiles = useCallback((data: File[]) => {
    setFiles(data);
  }, []);

  useEffect(() => {
    refetch({
      filters: {
        name: filter,
        page,
        pageSize,
      },
    });
  }, [filter]);

  return (
    <Box flexGrow={1}>
      {/* File upload area */}
      <FileUploadArea submit={uploadFiles} />

      {/* Search area */}
      <Box sx={{ flexGrow: 1, margin: "40px auto" }} maxWidth={1200}>
        <TextField
          fullWidth
          placeholder="Search your GIFs by name or tags..."
          onChange={filterChange}
        />
      </Box>

      {/* File List */}
      <Box
        sx={{
          flexGrow: 1,
          margin: "40px auto 0",
          background: "white",
          borderRadius: 2,
          padding: 2,
        }}
        display="flex"
        flexWrap={"wrap"}
        maxWidth={1200}
      >
        {rows && rows.length > 0 ? (
          rows.map((row: FileModel) => (
            <Box key={row.name} m={1}>
              <FileCard file={row} edit={onEdit} />
            </Box>
          ))
        ) : (
          <EmptyCard content="No Files!" />
        )}
        <Pagination />
      </Box>

      {/* File detail modal */}
      <FileModal
        open={Boolean(currentId)}
        onClose={() => setCurrentId("")}
        tags={tags}
        file={rows?.find((r: FileModel) => r._id === currentId) ?? {}}
      />

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
