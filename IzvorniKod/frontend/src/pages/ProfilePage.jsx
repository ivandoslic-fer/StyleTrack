import { Avatar, IconButton, Typography } from "@mui/material";
import { useLoaderData } from "react-router-dom";
import { getRandomColor, styleTrackAuthProvider } from "../util/styleTrackUtil";
import { Settings } from "@mui/icons-material";
import { useEffect, useState } from "react";

export default function ProfilePage() {
  const user = useLoaderData();
  const [canEdit, setCanEdit] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      if (styleTrackAuthProvider.isAuthenticated) {
        try {
          const result = await styleTrackAuthProvider.getCurrentUser();
          
          setCanEdit(result.username === user.username);
        } catch (error) {
          console.error("Failed to fetch user:", error);
        }
      }
    };
  
    fetchUser();
  }, []);

  return (
    <div className="flex flex-col h-[100vh] text-2 text-bold p-8">
      <div className="flex flex-row justify-between">
        <div className="flex flex-row">
          <Avatar
            alt={user.username.toUpperCase()}
            sx={{
              width: 100,
              height: 100,
              backgroundColor: getRandomColor(),
              fontSize: 40,
            }}
            src={user.profilePic || "/"}
          />
          <div className="ml-10">
            <Typography variant="h5">
              {user.displayName || user.username}
            </Typography>
            <Typography variant="subtitle1" color="textSecondary">
              @{user.username}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Email address: {user.email}
            </Typography>
          </div>
        </div>
        {canEdit && (
                <IconButton
                    onClick={() => location.replace(`/profile/${user.username}/settings`)}
                    sx={{
                        fontSize: '2rem',
                        color: '#000',
                        height: '40px',
                        width: '40px'
                    }}
                >
                    <Settings sx={{ fontSize: 32 }} />
                </IconButton>
            )}
      </div>
    </div>
  );
}
