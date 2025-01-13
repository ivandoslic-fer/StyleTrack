import { Card, CardContent, CardMedia, Typography, Avatar, Box } from "@mui/material";

const FeedCard = ({ item }) => {
  return (
    <Card sx={{ maxWidth: 345, background: "#f8f8f8", borderRadius: 2 }}>
      <CardMedia
        component="img"
        height={50}
        sx={{ maxHeight: 200, objectFit: "scale-down" }}
        image={item.mainImageUrl}
        alt={item.itemName}
      />
      <CardContent>
        <Typography variant="h6">{item.itemName}</Typography>
        <Typography variant="body2" color="textSecondary">
          {item.description}
        </Typography>
        <Typography variant="subtitle2" sx={{ mt: 1 }}>
          Brand: {item.brand}
        </Typography>
        <Typography variant="subtitle2">
          Season: {item.seasonCategory}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
          <Avatar src={item.ownerProfilePicture} sx={{ mr: 1 }} />
          <Typography variant="body2">
            {item.ownerDisplayName} {item.isAdvertiser && <strong>(Advertiser)</strong>}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default FeedCard;
