import { Box, Typography } from "@mui/material";

type EmptyCardProps = {
  content: string;
};

const EmptyCard = ({ content }: EmptyCardProps) => {
  return (
    <Box
      height={600}
      flexGrow={1}
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Typography variant="h6" textAlign="center">
        {content}
      </Typography>
    </Box>
  );
};

export default EmptyCard;
