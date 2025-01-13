import { Card, CardContent, Typography } from "@mui/material";

const InfoCard = ({ title, content }) => {
  return (
    <Card
      className="shadow-lg rounded-lg w-full md:w-[80%] mx-auto"
      sx={{
        color: "white",
        background: 'black',
        mb: 4
      }}
    >
      <CardContent>
        <Typography
          variant="body1"
          className="text-gray-300 text-center"
        >
          {content}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default InfoCard;
