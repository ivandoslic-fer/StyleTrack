import { Avatar, IconButton, Typography } from "@mui/material";
import { useEffect } from "react";
import { useLoaderData } from "react-router-dom";
import { getRandomColor, styleTrackAuthProvider } from "../util/styleTrackUtil";
import { Settings } from "@mui/icons-material";

export default function ProfilePage() {
  const user = useLoaderData();

  useEffect(() => {
    console.log(user);
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
        {styleTrackAuthProvider.username == user.username && (
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
