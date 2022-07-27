import { Box, CardContent } from "@mui/material";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import { FileModel } from "../graphql/type";

type FileCardProps = {
  file: FileModel;
  edit: (_id: string) => void;
};

const FileCard = ({ file, edit }: FileCardProps) => {
  return (
    <Card
      sx={{ maxWidth: 220, cursor: "pointer" }}
      onClick={() => edit(file._id)}
    >
      <CardContent sx={{ width: 200, height: 200 }}>
        <img
          src={file.url}
          alt={file.name}
          style={{ width: "100%", height: "100%" }}
        />
        <Box sx={{ display: "flex" }}>
          {file.tags.map((tag) => (
            <Box
              key={tag._id}
              sx={{
                color: "white",
                background: "grey",
                borderRadius: 2,
                padding: 1,
                marginLeft: 1,
              }}
            >
              {tag.name}
            </Box>
          ))}
        </Box>
      </CardContent>
      <CardHeader title={file.name} sx={{ textAlign: "center" }} />
    </Card>
  );
};

export default FileCard;
