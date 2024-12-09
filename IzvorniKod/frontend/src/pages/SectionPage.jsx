import { Container, Box, Typography, Avatar, Divider, Button } from "@mui/material";
import { useLoaderData, useParams } from "react-router-dom";

export default function SectionPage() {
  const data = useLoaderData(); // Fetch section data from loader
  const { wardrobeId, sectionId } = useParams();

  const textStyle = {
    fontSize: "18px",
    fontWeight: 500,
    lineHeight: "22px",
    textAlign: "left",
  };

  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
        minHeight: "100vh",
        fontFamily: "Roboto",
        paddingTop: "20px",
      }}
    >
      {/* Section Header */}
      <Typography variant="h4" sx={{ marginBottom: "20px", fontWeight: 600 }}>
        {data.sectionName} ({data.sectionType})
      </Typography>
      <Typography variant="subtitle1" sx={{ marginBottom: "20px", color: "#757575" }}>
        Capacity: {data.items.length}/{data.sectionCapacity}
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(1, 1fr)", // 1 column on small screens
            sm: "repeat(2, 1fr)", // 2 columns on medium screens
            md: "repeat(3, 1fr)", // 3 columns on larger screens
          },
          gap: "20px",
          width: "100%",
          maxWidth: "1200px",
        }}
      >
        {/* Render Items */}
        {data.items.map((item) => (
          <Box
            key={item.itemId}
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-start",
              alignItems: "center",
              backgroundColor: "#f5f5f5",
              borderRadius: "10px",
              padding: "15px",
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            {/* Item Image */}
            <Avatar
              alt={item.itemName}
              src={item.image || "/"}
              sx={{
                width: 80,
                height: 80,
                borderRadius: "10%",
                border: "1px solid #ddd",
                boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
                marginRight: "15px",
              }}
            />

            {/* Item Details */}
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" sx={{ ...textStyle, marginBottom: "5px" }}>
                {item.itemName}
              </Typography>
              <Typography sx={{ ...textStyle, color: "#757575" }}>
                Category: {item.category}
              </Typography>
              <Divider sx={{ marginY: "10px" }} />
              <Typography sx={{ ...textStyle, fontWeight: 400 }}>
                {item.description || "No description available"}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>

      {/* Add Item Button */}
      <Button
        variant="contained"
        color="primary"
        sx={{ marginTop: "30px", textTransform: "none" }}
        onClick={() => {
          location.assign(`/wardrobes/${wardrobeId}/${sectionId}/addItem`);
        }}
      >
        Add Item
      </Button>
    </Container>
  );
}
