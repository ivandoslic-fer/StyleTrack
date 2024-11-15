import {
  Card,
  CardContent,
  Typography,
  Button,
} from "@mui/material";

const WardrobeCard = ({ wardrobe }) => {
  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: "#f9f9f9",
        borderRadius: "20px",
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
        padding: "20px",
        width: "100%",
        maxWidth: "100svw",
        transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.2)",
        },
      }}
    >
      <CardContent sx={{ textAlign: "center" }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
            fontSize: "18px",
            marginBottom: "10px",
            color: "#333",
          }}
        >
          {wardrobe.wardrobeName}
        </Typography>
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#007BFF",
            color: "#fff",
            textTransform: "none",
            fontSize: "14px",
            fontWeight: 500,
            borderRadius: "20px",
            padding: "5px 20px",
            "&:hover": {
              backgroundColor: "#0056b3",
            },
          }}
          onClick={() => location.assign(`/wardrobes/${wardrobe.wardrobeId}`)}
        >
          Open
        </Button>
      </CardContent>
    </Card>
  );
};

export default WardrobeCard;
