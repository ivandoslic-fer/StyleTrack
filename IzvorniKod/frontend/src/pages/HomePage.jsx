import { useEffect, useState } from 'react';
import { Box, Typography } from "@mui/material";
import FeedCard from "../components/FeedCard";
import { requestHandler } from "../util/styleTrackUtil";

const HomePage = () => {
  const [feedItems, setFeedItems] = useState([]);

  useEffect(() => {
    fetchFeedItems();
  }, []);

  const fetchFeedItems = async () => {
    try {
      const response = await requestHandler.getRequest("/items/feed");
      console.log(response.data);
      
      setFeedItems(response.data);
    } catch (error) {
      console.error("Failed to fetch feed items:", error);
    }
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" sx={{ mb: 4, textAlign: 'center' }}>Feed</Typography>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr", // One column for small screens
            sm: "1fr 1fr", // Two columns for medium screens
            md: "1fr 1fr 1fr", // Three columns for large screens
          },
          gap: 3,
        }}
      >
        {feedItems.length > 0 ? (
          feedItems.map((item) => <FeedCard key={item.itemId} item={item} />)
        ) : (
          <Typography>No items found.</Typography>
        )}
      </Box>
    </Box>
  );
};

export default HomePage;
