import { useQuery } from "@apollo/client";
import {
  Box,
  CardContent,
  Skeleton,
  Tooltip,
  tooltipClasses,
  TooltipProps,
  Typography,
} from "@mui/material";
import Card from "@mui/material/Card";
import { styled } from "@mui/material/styles";
import { GET_PRIVATE_FILE_CONTENT } from "../graphql/quries/files";
import { FileModel } from "../graphql/type";

type FileCardProps = {
  file: FileModel;
  edit: (_id: string) => void;
};

const StyledTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "pink",
    color: "rgba(0, 0, 0, 0.87)",
    boxShadow: theme.shadows[1],
    fontSize: 11,
  },
}));

const FileCard = ({ file, edit }: FileCardProps) => {
  const { data, loading } = useQuery(GET_PRIVATE_FILE_CONTENT, {
    variables: {
      data: file._id,
    },
  });

  const imageContent =
    data && JSON.parse(data.getPrivateFileContent.content).blob;

  return (
    <Card
      sx={{
        maxWidth: 220,
        maxHeight: 300,
        cursor: "pointer",
        position: "relative",
      }}
      onClick={() => edit(file._id)}
    >
      <CardContent sx={{ width: 200, height: 200 }}>
        {loading ? (
          <Box>
            <Skeleton animation="wave" />
            <Skeleton animation="wave" />
            <Skeleton animation="wave" />
          </Box>
        ) : (
          <img
            src={`data:image/gif;base64, ${imageContent}`}
            alt={file.name}
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
          />
        )}
        <Box
          sx={{
            width: 200,
            position: "absolute",
            top: 0,
            display: "flex",
            flexWrap: "wrap",
          }}
        >
          {file.tags.map((tag) => (
            <StyledTooltip
              key={tag._id}
              title={tag.name}
              sx={{ color: "red" }}
              placement="top"
            >
              <Box
                sx={{
                  maxWidth: 180,
                  color: "white",
                  background: "grey",
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                  borderRadius: 2,
                  padding: 1,
                  margin: 0.5,
                }}
              >
                {tag.name}
              </Box>
            </StyledTooltip>
          ))}
        </Box>
      </CardContent>
      <StyledTooltip title={file.name} placement="top">
        <Typography
          sx={{
            width: 180,
            height: 32,
            textOverflow: "ellipsis",
            overflow: "hidden",
            textAlign: "center",
            margin: "16px auto",
          }}
          variant="h5"
        >
          {file.name}
        </Typography>
      </StyledTooltip>
    </Card>
  );
};

export default FileCard;
