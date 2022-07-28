import { useQuery } from "@apollo/client";
import { Box, TextField } from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";
import EmptyCard from "../../components/EmptyCard";
import FileCard from "../../components/FileCard";
import FileUploadArea from "../../components/FileUploadArea";
import FileUploadStatus from "../../components/FileUploadStatus";
import Pagination from "../../components/Pagination";
import CustomSnackbar, { CustomSnackbarProps } from "../../components/Snackbar";
import { GET_FILES } from "../../graphql/quries/files";
import { useQueryTag } from "../../graphql/quries/tags";
import { FileModel, Tag } from "../../graphql/type";
import FileModal from "./fileModal";
import debounce from "lodash.debounce";

const Dashboard = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [snackBarDetails, setSnackBar] = useState<CustomSnackbarProps>({});
  const [page, setPage] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);
  const [filter, setFilter] = useState<string>("");
  const [currentId, setCurrentId] = useState<string>("");

  const { data } = useQueryTag();
  const { data: fileList, refetch } = useQuery(GET_FILES, {
    variables: {
      filters: {
        name: "",
        page,
        pageSize,
      },
    },
  });

  const tags = data?.map((x: Tag) => x.name);
  const rows = fileList?.getFileList.files;

  const filterChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setFilter(event.target.value);
    },
    []
  );

  const debouncedChange = useMemo(() => debounce(filterChange, 500), []);

  const onEdit = (_id: string) => setCurrentId(_id);

  const uploadFiles = useCallback((data: File[]) => {
    setFiles(data);
  }, []);

  useEffect(() => {
    setFiles([]);
    refetch({
      filters: {
        name: filter,
        page,
        pageSize,
      },
    });
  }, [filter, page, pageSize]);

  useEffect(() => {
    return () => {
      debouncedChange.cancel();
    };
  });

  return (
    <Box flexGrow={1}>
      {/* File upload area */}
      <FileUploadArea submit={uploadFiles} />

      {/* Search area */}
      <Box sx={{ flexGrow: 1, margin: "40px auto" }} maxWidth={1200}>
        <TextField
          fullWidth
          placeholder="Search your GIFs by name or tags..."
          onChange={debouncedChange}
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
        maxWidth={1200}
      >
        {rows && rows.length > 0 ? (
          <Box display="flex" flexDirection={"column"}>
            <Box display="flex" flexWrap={"wrap"}>
              {rows.map((row: FileModel) => (
                <Box key={row._id} m={1}>
                  <FileCard file={row} edit={onEdit} />
                </Box>
              ))}
            </Box>
            <Pagination
              total={fileList?.getFileList.total ?? 0}
              page={page}
              rowsPerPage={pageSize}
              setPage={(data) => setPage(data)}
              setRowsPerPage={(data) => {
                setPage(0);
                setPageSize(data);
              }}
            />
          </Box>
        ) : (
          <EmptyCard content="No Files!" />
        )}
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
        close={() => setFiles([])}
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
