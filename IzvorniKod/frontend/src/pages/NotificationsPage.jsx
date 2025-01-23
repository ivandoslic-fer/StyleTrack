import { useEffect, useState } from "react";
import {
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  IconButton,
  Box,
} from "@mui/material";
import { CheckCircle, MailOutline, ShoppingBagOutlined } from "@mui/icons-material";
import { requestHandler, styleTrackAuthProvider } from "../util/styleTrackUtil";

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (styleTrackAuthProvider.isAuthenticated) {
        try {
          const result = await styleTrackAuthProvider.getCurrentUser();
          if (result) {
            setUser(result);
            fetchNotifications(result.id); // Fetch notifications for the logged-in user
          }
        } catch (error) {
          console.error("Failed to fetch user:", error);
        }
      }
    };

    const fetchNotifications = async (userId) => {
      try {
        const response = await requestHandler.getRequest(`/notifications/${userId}`);
        setNotifications(response.data);
        console.log(response.data);
        
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      }
    };

    fetchUser();
  }, []);

  const markAsRead = async (notificationId) => {
    try {
      const response = requestHandler.putRequest(`/notifications/${notificationId}/read`);
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notificationId ? { ...n, read: true } : n
        )
      );
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Notifications
      </Typography>
      <List>
        {notifications.map((notification) => (
          <ListItem
            key={notification.id}
            sx={{
              backgroundColor: notification.read ? "#f0f0f0" : "#e8f5e9",
              borderRadius: 2,
              mb: 2,
            }}
            secondaryAction={
              !notification.read && (
                <IconButton
                  edge="end"
                  color="primary"
                  onClick={() => markAsRead(notification.id)}
                >
                  <CheckCircle />
                </IconButton>
              )
            }
          >
            <ListItemAvatar>
              <Avatar sx={{ backgroundColor: "#1976d2" }}>
                {notification.sender ? (
                  <MailOutline />
                ) : (
                  <ShoppingBagOutlined />
                )}
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={notification.message}
              secondary={
                <>
                  <Typography
                    component="span"
                    variant="body2"
                    color="text.secondary"
                  >
                    {notification.senderContactInfo || "Anonymous"} |{" "}
                    {new Date(notification.createdAt).toLocaleString()}
                  </Typography>
                  <br />
                  <Typography
                    component="span"
                    variant="body2"
                    color="text.primary"
                  >
                    Related Item: {notification.itemId}
                  </Typography>
                </>
              }
            />
          </ListItem>
        ))}
      </List>
      {notifications.length === 0 && (
        <Typography variant="body2" color="text.secondary">
          You have no notifications.
        </Typography>
      )}
    </Box>
  );
};

export default NotificationsPage;
