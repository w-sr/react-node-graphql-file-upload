import { useQuery } from "@apollo/client";
import { CircularProgress } from "@mui/material";
import { useParams } from "react-router-dom";
import { GET_FILE_CONTENT } from "../graphql/quries/files";

const PublicImagePage = () => {
  const { url } = useParams();
  const { data, loading } = useQuery(GET_FILE_CONTENT, {
    variables: {
      data: url,
      type: "public",
    },
  });
  const imageContent = data && JSON.parse(data.getFileContent.content).blob;
  return (
    <>
      {loading ? (
        <CircularProgress />
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
