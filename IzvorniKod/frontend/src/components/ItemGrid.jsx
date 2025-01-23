import { Box } from "@mui/material";
import ItemCard from "./ItemCard";

const ItemGrid = ({ items }) => {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr", // One column for small screens
          sm: "1fr 1fr", // Two columns for medium screens
          md: "1fr 1fr 1fr", // Three columns for large screens
        },
        gap: 2,
        padding: 2,
      }}
    >
      {items.map((item) => (
        <ItemCard key={item.itemId} item={item} />
      ))}
    </Box>
  );
};

export default ItemGrid;