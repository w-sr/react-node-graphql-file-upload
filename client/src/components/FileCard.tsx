import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";

type FileCardProps = {
  name: string;
  url: string;
  edit?: () => void;
};

const FileCard = ({ name, url, edit }: FileCardProps) => {
  return (
    <Card sx={{ maxWidth: 250, boxShadow: 3 }}>
      <CardHeader title={name} />
      <CardMedia component="img" image={url} alt={name} onClick={edit} />
    </Card>
  );
};

export default FileCard;
