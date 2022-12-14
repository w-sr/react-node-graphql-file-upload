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
import { CopyToClipboard } from "react-copy-to-clipboard";
import * as Yup from "yup";
import { parseErrorMessage } from "../../graphql/helpers";
import { DELETE_FILE, UPDATE_FILE } from "../../graphql/mutations/files";
import { GET_FILES } from "../../graphql/queries/files";
import { GET_TAGS } from "../../graphql/queries/tags";
import { FileModel } from "../../graphql/types";
import { fileNameValidate } from "../../utils/helpers";
import { Button } from "../common/Button";
import CustomSnackbar, { CustomSnackbarProps } from "../common/Snackbar";
import ConfirmModal from "../ConfirmModal";

type Props = {
  open: boolean;
  file: FileModel;
  tags?: string[];
  onClose: () => void;
};

const initialValues = {
  name: "",
  tags: [],
  publicUrl: "",
};

const FormSchema = Yup.object().shape({
  name: Yup.string()
    .required("Name is required")
    .min(2, "Name must be at least 2 letters")
    .max(35, "Name must be up to 35 letters"),
});

const FileModal = ({ onClose, open, file, tags = [] }: Props) => {
  const [error, setError] = useState<string>("");
  const [isCopied, setIsCopied] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const [snackBarDetails, setSnackBar] = useState<CustomSnackbarProps>({});

  const [updateFile] = useMutation(UPDATE_FILE, {
    onCompleted: (res) => {
      if (res.updateFile) {
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
        setConfirmModal(false);
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

  const formik = useFormik({
    initialValues,
    validationSchema: FormSchema,
    onSubmit: async (values) => {
      const { name } = values;
      const nameError = fileNameValidate(name);
      if (nameError) {
        setFieldError("name", nameError);
        return;
      } else {
        setFieldError("name", "");
      }
      await updateFile({
        variables: {
          _id: file._id,
          input: {
            name: name
              .substring(0, name.length - 4)
              .trim()
              .concat(name.substring(name.length - 4)),
            tags: values.tags,
            publicly: false,
          },
        },
      });
    },
  });

  const getTags = useCallback(
    () => (file.tags ? file.tags.map((tag) => tag.name) : []),
    [file]
  );

  const { values, setFieldValue, touched, errors, setFieldError } = formik;

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

  const createUrl = async () => {
    await updateFile({
      variables: {
        _id: file._id,
        input: {
          publicly: true,
        },
      },
    });
  };

  const makePrivate = async () => {
    await updateFile({
      variables: {
        _id: file._id,
        input: {
          publicly: false,
        },
      },
    });
  };

  const onDelete = useCallback(() => {
    deleteFile({
      variables: {
        _id: file._id,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file]);

  const modalClose = () => {
    formik.resetForm();
    onClose();
  };

  return (
    <>
      <Dialog
        open={open}
        sx={{ "& .MuiDialog-paper": { width: 600 } }}
        aria-labelledby="file-dialog"
      >
        <DialogContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              formik.handleSubmit();
            }}
          >
            <Box my={2}>
              <TextField
                fullWidth
                id="name"
                name="name"
                label="Name"
                value={values.name}
                onChange={(e) => setFieldValue("name", e.target.value)}
                error={touched.name && Boolean(errors.name)}
                helperText={touched.name && errors.name}
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
                onChange={(_: any, newValue: string[]) => {
                  setFieldValue("tags", newValue);
                  setError("");
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Tags"
                    placeholder="Add a new tag"
                    inputProps={{
                      ...params.inputProps,
                      onKeyDown: (event) => {
                        if (event.key === "Enter") {
                          const { value } = event.target;
                          if (!/^[A-Za-z0-9]*$/.test(value)) {
                            setError("Please input correct tag name");
                            event.stopPropagation();
                          }
                          event.preventDefault();
                        }
                      },
                    }}
                    error={Boolean(error)}
                    helperText={error}
                  />
                )}
              />
            </Box>
            {file.publicly && (
              <Box my={2} display="flex" sx={{ position: "relative" }}>
                <CopyToClipboard
                  text={values.publicUrl}
                  onCopy={() => {
                    setIsCopied(true);
                    setTimeout(() => {
                      setIsCopied(false);
                    }, 2000);
                  }}
                >
                  <TextField
                    fullWidth
                    id="publicUrl"
                    name="publicUrl"
                    label="Public URL"
                    value={values.publicUrl}
                    disabled
                  />
                </CopyToClipboard>
                {isCopied && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: 20,
                      right: 10,
                      padding: 2,
                      background: "pink",
                      borderRadius: 2,
                    }}
                  >
                    Copied!
                  </Box>
                )}
              </Box>
            )}
            <Box mt={10} display="flex" justifyContent="flex-end">
              {file.publicly ? (
                <Button variant="contained" onClick={makePrivate}>
                  Make Private
                </Button>
              ) : (
                <Button variant="contained" onClick={createUrl}>
                  Get Public URL
                </Button>
              )}
              <Button variant="contained" type="submit" sx={{ marginLeft: 2 }}>
                Update
              </Button>
              <Button
                variant="contained"
                onClick={() => setConfirmModal(true)}
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
      <ConfirmModal
        open={confirmModal}
        title="Are you sure to delete this gif?"
        onClose={() => setConfirmModal(false)}
        onConfirm={onDelete}
      />
      <CustomSnackbar
        {...snackBarDetails}
        onClose={() => setSnackBar({ open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </>
  );
};

export default FileModal;
