import { Container, Box, Button, Typography, Divider, Avatar, Card } from "@mui/material";
import { useLoaderData } from "react-router-dom";

export default function ClosetPage() {
  const data = useLoaderData();

  const textStyle = {
    fontSize: "18px",
    fontWeight: 500,
    lineHeight: "22px",
    textAlign: "left",
    textUnderlinePosition: "from-font",
    textDecorationSkipInk: "none",
  };

  const handleAddSection = () => {
    console.log("Navigate to Add Section form");
    location.assign(`/wardrobes/${data.wardrobeId}/addSection`);
  };

  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
        minHeight: "100vh",
        paddingTop: "20px",
      }}
    >
      <Typography variant="h4" sx={{ marginBottom: "20px", fontWeight: 600 }}>
        Wardrobe Sections
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
        {/* Add Section Card */}
        <Card
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            background: "transparent",
            border: "2px dashed #ccc",
            borderRadius: "10px",
            padding: "20px",
            textAlign: "center",
            cursor: "pointer",
            transition: "0.3s",
            "&:hover": {
              backgroundColor: "#e5e7eb",
            },
            boxShadow: "none"
          }}
          onClick={handleAddSection}
        >
          <Typography
            variant="h6"
            sx={{
              fontFamily: "Roboto, sans-serif",
              fontSize: "20px",
              fontWeight: 500,
              marginBottom: "10px",
            }}
          >
            Add Section
          </Typography>
          <Button
            variant="contained"
            color="primary"
            sx={{
              textTransform: "none",
            }}
          >
            Create
          </Button>
        </Card>

        {/* Render Wardrobe Sections */}
        {data.sections.map((section) => (
          <Box
            key={section.sectionId}
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
            {/* Section Image */}
            <Avatar
              alt={section.sectionName}
              src={section.image || '/'}
              sx={{
                width: 100,
                height: 100,
                borderRadius: "10%",
                border: "1px solid #ddd",
                boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
                marginRight: "15px",
              }}
            />

            {/* Section Details */}
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" sx={{ ...textStyle, marginBottom: "5px" }}>
                {section.sectionName}
              </Typography>
              <Typography sx={{ ...textStyle, color: "#757575" }}>
                Type: {section.sectionType}
              </Typography>
              <Divider sx={{ marginY: "10px" }} />
              <Typography sx={{ ...textStyle, fontWeight: 400 }}>
                Items: ??/{section.sectionCapacity}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                size="small"
                sx={{
                  marginTop: "10px",
                  textTransform: "none",
                }}
                onClick={() => location.assign(`/wardrobes/${data.wardrobeId}/${section.sectionId}`)}
              >
                View Items
              </Button>
            </Box>
          </Box>
        ))}
      </Box>
    </Container>
  );
}
