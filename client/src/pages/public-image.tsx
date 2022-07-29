import { useQuery } from "@apollo/client";
import { Box, CircularProgress } from "@mui/material";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { parseErrorMessage } from "../graphql/helpers";
import { GET_PUBLIC_FILE_CONTENT } from "../graphql/queries/files";

const PublicImagePage = () => {
  const { url } = useParams();
  const [error, setError] = useState<string>("");
  const { data, loading } = useQuery(GET_PUBLIC_FILE_CONTENT, {
    variables: {
      data: url,
    },
    onError: (error) => {
      const errorMessage = parseErrorMessage(error);
      setError(errorMessage);
    },
  });

  const imageContent =
    data && JSON.parse(data.getPublicFileContent.content).blob;

  return (
    <>
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Box>{error}</Box>
      ) : (
        <img
          src={`data:image/gif;base64, ${imageContent}`}
          alt="alt"
          style={{ width: 200, height: 200 }}
        />
      )}
    </>
  );
};

export default PublicImagePage;
