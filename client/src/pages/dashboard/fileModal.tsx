import {
  Autocomplete,
  Box,
  Dialog,
  DialogContent,
  TextField,
} from "@mui/material";
import { Button } from "../../components/common/Button";
import { useFormik } from "formik";
import { useState } from "react";
import * as Yup from "yup";
import CustomSnackbar, { CustomSnackbarProps } from "../../components/Snackbar";
import { FileModel } from "../../graphql/type";
import { copyTextToClipboard } from "../../utils/common";
import { useMutation } from "@apollo/client";
import { parseErrorMessage } from "../../graphql/helper";
import { UPDATE_FILE } from "../../graphql/mutations/files";

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

const FileModal = ({ onClose, open, file, tags }: Props) => {
  const [isCopied, setIsCopied] = useState(false);
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
  });

  const formik = useFormik({
    initialValues: {
      name: file.name,
      tags: file.tags,
      publicUrl: file.publicUrl,
    },
    validationSchema: FormSchema,
    onSubmit: async (values) => {
      console.log(values);
      // await updateFile({
      //   variables: {
      //     _id: file._id,
      //     input: {
      //       name: values.name,
      //       tags: values.tags,
      //     },
      //   },
      // });
    },
  });

  const { values, setFieldValue, touched, errors } = formik;

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

  const modalClose = () => {
    formik.resetForm();
    onClose();
  };

  return (
    <>
      <Dialog
        open={open}
        sx={{ "& .MuiDialog-paper": { minWidth: 500 } }}
        maxWidth="sm"
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
                defaultValue={[...file.tags]}
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
                <Button variant="contained" type="submit">
                  Get Public URL
                </Button>
              )}
              <Button variant="contained" type="submit" sx={{ marginLeft: 2 }}>
                Save
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
