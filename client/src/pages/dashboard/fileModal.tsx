import { useMutation } from "@apollo/client";
import {
  Autocomplete,
  Box,
  Dialog,
  DialogContent,
  TextField,
} from "@mui/material";
import { useFormik } from "formik";
import { useCallback, useEffect, useState } from "react";
import * as Yup from "yup";
import { Button } from "../../components/common/Button";
import CustomSnackbar, { CustomSnackbarProps } from "../../components/Snackbar";
import { parseErrorMessage } from "../../graphql/helper";
import {
  CREATE_PUBLIC_URL,
  DELETE_FILE,
  UPDATE_FILE,
} from "../../graphql/mutations/files";
import { GET_FILES } from "../../graphql/quries/files";
import { GET_TAGS } from "../../graphql/quries/tags";
import { FileModel } from "../../graphql/type";
import { copyTextToClipboard } from "../../utils/common";

type Props = {
  onClose: () => void;
  open: boolean;
  file: FileModel;
  tags?: string[];
};

const FormSchema = Yup.object().shape({
  name: Yup.string()
    .required("Name is required")
    .min(2, "Name must be at least 2 letters")
    .max(35, "Name must be up to 35 letters"),
});

const FileModal = ({ onClose, open, file, tags = [] }: Props) => {
  const [isCopied, setIsCopied] = useState(false);
  const [snackBarDetails, setSnackBar] = useState<CustomSnackbarProps>({});

  const [updateFile] = useMutation(UPDATE_FILE, {
    onCompleted: (res) => {
      if (res.updateFile) {
        onClose();
        setSnackBar({
          open: true,
          message: "Successfully updated",
          onClose: () => setSnackBar({}),
          severity: "success",
        });
      }
    },
    onError: (err) => {
      setSnackBar({
        open: true,
        message: parseErrorMessage(err),
        onClose: () => setSnackBar({}),
        severity: "error",
      });
    },
    refetchQueries: [GET_FILES, GET_TAGS],
  });

  const [deleteFile] = useMutation(DELETE_FILE, {
    onCompleted: (res) => {
      if (res.deleteFile) {
        onClose();
        setSnackBar({
          open: true,
          message: "Successfully deleted",
          onClose: () => setSnackBar({}),
          severity: "success",
        });
      }
    },
    onError: (err) => {
      setSnackBar({
        open: true,
        message: parseErrorMessage(err),
        onClose: () => setSnackBar({}),
        severity: "error",
      });
    },
    refetchQueries: [GET_FILES],
  });

  const [createPublicUrl] = useMutation(CREATE_PUBLIC_URL, {
    onCompleted: (res) => {
      if (res.createPublicUrl) {
        setSnackBar({
          open: true,
          message: "Successfully created",
          onClose: () => setSnackBar({}),
          severity: "success",
        });
      }
    },
    onError: (err) => {
      setSnackBar({
        open: true,
        message: parseErrorMessage(err),
        onClose: () => setSnackBar({}),
        severity: "error",
      });
    },
    refetchQueries: [GET_FILES],
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      tags: [],
      publicUrl: "",
    },
    validationSchema: FormSchema,
    onSubmit: async (values) => {
      await updateFile({
        variables: {
          _id: file._id,
          input: {
            name: values.name,
            tags: values.tags,
          },
        },
      });
    },
  });

  const getTags = useCallback(
    () => (file.tags ? file.tags.map((tag) => tag.name) : []),
    [file]
  );

  const { values, setFieldValue, touched, errors } = formik;

  useEffect(() => {
    if (Object.keys(file).length > 1) {
      setFieldValue("name", file.name);
      setFieldValue("tags", getTags());
      setFieldValue(
        "publicUrl",
        `${window.location.origin}/g/${file.publicUrl}`
      );
    }
  }, [file, setFieldValue, getTags]);

  const handleCopyClick = () => {
    copyTextToClipboard(values.publicUrl)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => {
          setIsCopied(false);
        }, 2000);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const createUrl = () => {
    createPublicUrl({
      variables: {
        _id: file._id,
      },
    });
  };

  const onDelete = useCallback(() => {
    deleteFile({
      variables: {
        _id: file._id,
      },
    });
  }, [file]);

  const modalClose = () => {
    formik.resetForm();
    onClose();
  };

  return (
    <>
      <Dialog
        open={open}
        sx={{ "& .MuiDialog-paper": { minWidth: 500 } }}
        maxWidth="md"
        aria-labelledby="file-dialog"
      >
        <DialogContent>
          <form onSubmit={formik.handleSubmit}>
            <Box my={2}>
              <TextField
                fullWidth
                id="name"
                name="name"
                label="Name"
                value={values.name}
                onChange={(e) => setFieldValue("name", e.target.value)}
                error={touched.name && Boolean(errors.name)}
              />
            </Box>
            <Box my={2}>
              <Autocomplete
                multiple
                id="tags"
                options={tags ?? []}
                freeSolo
                defaultValue={[...(getTags() ?? [])]}
                value={values.tags}
                onChange={(_: any, newValue: string[]) =>
                  setFieldValue("tags", newValue)
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Tags"
                    placeholder="Add a new tag"
                  />
                )}
              />
            </Box>
            {file.public && (
              <Box my={2} display="flex">
                <TextField
                  fullWidth
                  id="publicUrl"
                  name="publicUrl"
                  label="Public URL"
                  value={values.publicUrl}
                  sx={{ width: "80%" }}
                  disabled
                />
                <Button
                  onClick={handleCopyClick}
                  sx={{ marginLeft: 1, textTransform: "none" }}
                >
                  {isCopied ? "Copied!" : "Copy"}
                </Button>
              </Box>
            )}
            <Box mt={5} display="flex" justifyContent="flex-end">
              {!file.public && (
                <Button variant="contained" onClick={createUrl}>
                  Get Public URL
                </Button>
              )}
              <Button variant="contained" type="submit" sx={{ marginLeft: 2 }}>
                Update
              </Button>
              <Button
                variant="contained"
                onClick={onDelete}
                sx={{ marginLeft: 2 }}
              >
                Delete
              </Button>
              <Button onClick={modalClose} autoFocus sx={{ marginLeft: 2 }}>
                Cancel
              </Button>
            </Box>
          </form>
        </DialogContent>
      </Dialog>
      <CustomSnackbar
        {...snackBarDetails}
        onClose={() => setSnackBar({ open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </>
  );
};

export default FileModal;
