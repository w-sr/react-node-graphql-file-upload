import { useQuery } from "@apollo/client";
import { Box, TextField } from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";
import EmptyCard from "../../components/common/EmptyCard";
import FileCard from "../../components/file/FileCard";
import FileUploadStatus from "../../components/file/FileUploadStatus";
import Pagination from "../../components/common/Pagination";
import CustomSnackbar, {
  CustomSnackbarProps,
} from "../../components/common/Snackbar";
import { GET_FILES } from "../../graphql/queries/files";
import { useQueryTag } from "../../graphql/queries/tags";
import { FileModel, Tag } from "../../graphql/types";
import FileModal from "../../components/file/FileDetailModal";
import debounce from "lodash.debounce";
import { useDropzone } from "react-dropzone";

const Dashboard = () => {
  const [currentId, setCurrentId] = useState<string>("");
  const [files, setFiles] = useState<File[]>([]);
  const [page, setPage] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);
  const [filter, setFilter] = useState<string>("");
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [snackBarDetails, setSnackBar] = useState<CustomSnackbarProps>({});

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

  const debouncedChange = useMemo(
    () => debounce(filterChange, 500),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const onDrop = (acceptedFiles: File[]) => {
    uploadFiles(acceptedFiles);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, page, pageSize]);

  useEffect(() => {
    return () => {
      debouncedChange.cancel();
    };
  });

  return (
    <Box flexGrow={1} {...getRootProps()} sx={{ position: "relative" }}>
      <Box
        sx={{
          width: "80%",
          height: "80%",
          position: "absolute",
          top: "10%",
          right: "10%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: overlayVisible ? "rgba(255,255,255,0.7)" : "transparent",
          borderStyle: overlayVisible ? "dotted" : "none",
          zIndex: overlayVisible ? 1 : -1,
        }}
      >
        <input {...getInputProps()} />
        <Box display={"flex"} alignItems="center" fontSize={24}>
          Drag images to this area to upload.
        </Box>
      </Box>

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
          padding: 2,
          margin: "40px auto 0",
          background: "white",
          borderRadius: 2,
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
        open={files.length > 0}
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
