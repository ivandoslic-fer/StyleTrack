import { Avatar, Button, IconButton, Tooltip, Typography } from "@mui/material";
import { useLoaderData } from "react-router-dom";
import { getRandomColor, styleTrackAuthProvider, requestHandler } from "../util/styleTrackUtil";
import { Settings, ShoppingBagOutlined } from "@mui/icons-material";
import { useEffect, useState } from "react";
import LocationsMiniMap from "../components/LocationsMiniMap";
import { useSnackbar } from "../context/SnackbarContext";

export default function ProfilePage() {
  const user = useLoaderData();
  const [canEdit, setCanEdit] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState([0, 0]);
  const [existingLocations, setExistingLocations] = useState([]);
  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    const fetchUser = async () => {
      if (styleTrackAuthProvider.isAuthenticated) {
        try {
          const result = await styleTrackAuthProvider.getCurrentUser();
          setCanEdit(result.username === user.username);
          
          if (user.advertiser) fetchLocations();
        } catch (error) {
          showSnackbar({
            severity: "error",
            message: "Failed to fetch the user!",
            duration: 3000
          });
        }
      }
    };

    const fetchLocations = async () => {
      try {
        const locations = await requestHandler.getRequest(`/advertisers/${user.id}/locations`);

        locations.data.forEach(location => location.isShop = true);

        setExistingLocations(locations.data);
      } catch (error) {
        showSnackbar({
          severity: "error",
          message: "Failed to fetch locations!",
          duration: 3000
        });
      }
    };

    fetchUser();
  }, [user]);

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
            src={user.profilePictureUrl || "/"}
          />
          <div className="ml-10">
            <Typography variant="h5" sx={{ display: "flex", alignItems: "center" }}>
              {user.displayName || user.username} {user.advertiser && (
                <Tooltip title="Advertiser" placement="top" arrow>
                  <ShoppingBagOutlined className="text-orange-500" sx={{ mr: 5 }} />
                </Tooltip>
              )}
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

      {user.advertiser && (
        <>
          <div className="flex w-[45%] h-[70%] mt-6">
            <LocationsMiniMap
              editing={false}
              selectedLocation={selectedLocation}
              onSelectedLocationChange={setSelectedLocation}
              existingLocations={existingLocations}
            />
          </div>
          <div className="flex w-[15%] mt-2">
            { canEdit && (
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={() => location.assign(`/advertiser/locations`)}
              >
                Edit locations
              </Button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
