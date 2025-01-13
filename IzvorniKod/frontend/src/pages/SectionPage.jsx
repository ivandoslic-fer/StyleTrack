import {
  Container,
  Typography,
  Button,
} from "@mui/material";
import { useLoaderData, useParams } from "react-router-dom";
import ItemGrid from "../components/ItemGrid";

export default function SectionPage() {
  const data = useLoaderData(); // Fetch section data from loader
  const { wardrobeId, sectionId } = useParams();

  return (
    <Container
      sx={{
        display: "flex",
        width: "100%",
        alignItems: "center",
        flexDirection: "column",
        minHeight: "100vh",
        paddingTop: "20px",
      }}
    >
      <Button
      variant="contained"
      color="primary"
      className="self-start"
      onClick={() => location.assign(`/wardrobes/${wardrobeId}/${sectionId}/addItem`)}
    >
      Add New Item
    </Button>
    <div className="min-h-4">{/** SPACER */}</div>
      {data.items.length > 0 ? (
        <ItemGrid items={data.items} />
      ) : (
        <Typography>No items found in this section.</Typography>
      )}
    </Container>
  );
}
