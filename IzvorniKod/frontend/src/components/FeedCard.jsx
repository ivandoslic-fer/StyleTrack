import { MailOutline, ShoppingBagOutlined, VolunteerActivism } from "@mui/icons-material";
import { Card, CardContent, CardMedia, Typography, Avatar, Box, Tooltip, IconButton, TextField, DialogActions, Button, DialogContent, DialogTitle, Dialog, duration } from "@mui/material";
import { useEffect, useState } from "react";
import { requestHandler, styleTrackAuthProvider } from "../util/styleTrackUtil";
import { useSnackbar } from "../context/SnackbarContext";

const FeedCard = ({ item }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [contactInfo, setContactInfo] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const { showSnackbar } = useSnackbar();

  const handleDialogOpen = () => {
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setContactInfo(""); // Reset the input
    setMessage(""); // Reset the input
  };

  const handleSendNotification = async () => {
    if (!contactInfo || !message) {
      showSnackbar({
        severity: "error",
        message: "Both Contact Information and Message are required.",
        duration: 3000
      })
      return;
    }

    setIsLoading(true);
    try {
      requestHandler.postRequest(`/notifications`, {
        senderId: currentUser?.id || null,
        receiverUsername: item.ownerUsername, // Assuming `ownerId` is available in `item`
        itemId: item.itemId,
        senderContactInfo: contactInfo,
        message: message,
      });

      showSnackbar({
        severity: "success",
        message: "Notification sent successfully!",
        duration: 3000
      });
      handleDialogClose();
    } catch (error) {
      console.error("Failed to send notification:", error);
      showSnackbar({
        severity: "error",
        message: "Failed to send notification. Please try again later.",
        duration: 3000
      })
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const user = await styleTrackAuthProvider.getCurrentUser();

      if (user) setCurrentUser(user);
    }

    fetchCurrentUser();
  }, [])
  return (
    <>
    <Card sx={{ maxWidth: 345, background: "#f8f8f8", borderRadius: 2 }}>
      <CardMedia
        component="img"
        height={50}
        sx={{ maxHeight: 200, objectFit: "scale-down" }}
        image={item.mainImageUrl}
        alt={item.itemName}
      />
      <CardContent>
      <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography variant="h6" sx={{ display: "flex", alignItems: "center" }}>
            <a href={`/items/${item.itemId}`}>{item.itemName}</a>
            {item.forSharing && (
              <Tooltip title="For Sharing" placement="top" arrow>
                <VolunteerActivism className="text-green-500" sx={{ ml: 1 }} />
              </Tooltip>
            )}
          </Typography>
        </Box>
        <Typography variant="body2" color="textSecondary">
          {item.description}
        </Typography>
        <Typography variant="subtitle2" sx={{ mt: 1 }}>
          Brand: {item.brand}
        </Typography>
        <Typography variant="subtitle2">
          Season: {item.seasonCategory}
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mt: 2,
            cursor: "pointer",
          }}
        >
          {/* Profile Section */}
          <Box
            sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}
            onClick={() => location.assign(`/profile/${item.ownerUsername}`)}
          >
            <Avatar src={item.ownerProfilePicture} sx={{ mr: 1 }} />
            <Typography variant="body2">
              {item.ownerDisplayName}{" "}
              {item.advertiser && (
                <Tooltip title="Advertiser" placement="top" arrow>
                  <ShoppingBagOutlined className="text-orange-500" sx={{ mr: 5 }} />
                </Tooltip>
              )}
            </Typography>
          </Box>

          {/* Contact Button */}
          {item.forSharing && (!currentUser || item.ownerUsername !== currentUser.username) && (
            <Tooltip title="Contact Owner" placement="top" arrow>
              <IconButton
                color="primary"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent triggering the profile redirection
                  handleDialogOpen(); // Open the dialog
                }}
              >
                <MailOutline />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </CardContent>
    </Card>
    <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Send Notification</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Contact Information"
            type="text"
            fullWidth
            value={contactInfo}
            onChange={(e) => setContactInfo(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Message"
            type="text"
            fullWidth
            multiline
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSendNotification} color="primary" disabled={isLoading}>
            {isLoading ? "Sending..." : "Send"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default FeedCard;
