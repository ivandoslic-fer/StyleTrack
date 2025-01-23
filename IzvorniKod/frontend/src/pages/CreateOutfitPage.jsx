import {
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  Divider,
  Box,
} from "@mui/material";
import { useState, useEffect } from "react";
import axios from "axios";
import { requestHandler } from "../util/styleTrackUtil";
import { useSnackbar } from "../context/SnackbarContext";

const CreateOutfitPage = () => {
  const [outfitName, setOutfitName] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [userItems, setUserItems] = useState([]);
  const [weatherData, setWeatherData] = useState(null);
  const [booleanAttributes, setBooleanAttributes] = useState({
    forRain: false,
    forSnow: false,
    forWinter: false,
    forSummer: false,
    forAutumnSpring: false
  });

  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    fetchUserItems();
    fetchWeatherData();
  }, []);

  const fetchUserItems = async () => {
    try {
      const response = await requestHandler.getRequest(`/items/my-items`);
      setUserItems(response.data);
    } catch (error) {
      console.error("Failed to fetch user items:", error);
      showSnackbar({
        severity: "error",
        message: "Couldn't fetch users items.",
        duration: 3000
      });
    }
  };

  const fetchWeatherData = async () => {
    try {
      const getLocation = () =>
        new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            (position) => resolve(position),
            (error) => reject(error)
          );
        });

      const position = await getLocation();
      const { latitude, longitude } = position.coords;

      const response = await axios.get(
        `http://api.weatherapi.com/v1/current.json`,
        {
          params: {
            key: import.meta.env.VITE_WEATHER_API_KEY,
            q: `${latitude},${longitude}`,
          },
        }
      );

      const weatherData = {
        location: response.data.location,
        current: response.data.current,
      };

      setWeatherData(weatherData);
    } catch (error) {
      showSnackbar({
        severity: "error",
        message: "Failed to fetch weather data or location:",
        duration: 3000
      });
      console.error("Failed to fetch weather data or location:", error);

      if (error.code === 1) {
        showSnackbar({
          severity: "error",
          message: "Location access denied by user.",
          duration: 3000
        });
        console.error("Location access denied by user.");
      }
    }
  };

  const handleCheckboxToggle = (item) => {
    setSelectedItems((prev) =>
      prev.find((i) => i === item.itemId)
        ? prev.filter((i) => i !== item.itemId)
        : [...prev, item.itemId]
    );
  };

  const handleSubmit = () => {
    const newOutfit = {
      name: outfitName,
      itemIds: selectedItems,
      ...booleanAttributes
    };

    try {
      requestHandler.postRequest('/outfits/create', newOutfit);
    } catch (e) {
      showSnackbar({
        severity: "error",
        message: "Failed to create the outfit.",
        duration: 3000
      });  
      console.error(e);
      return;
    }

    showSnackbar({
      severity: "success",
      message: "Successfully created an outfit.",
      duration: 3000
    });

    location.assign(`/outfits`);
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Create Your Outfit
      </Typography>

      {/* Outfit Name */}
      <TextField
        label="Outfit Name"
        variant="outlined"
        fullWidth
        value={outfitName}
        onChange={(e) => setOutfitName(e.target.value)}
        sx={{ mb: 3 }}
      />

      {/* Boolean Attributes */}
      <Typography variant="h6">Attributes</Typography>
      <Box>
        {Object.keys(booleanAttributes).map((attr) => (
          <FormControlLabel
            key={attr}
            control={
              <Checkbox
                checked={booleanAttributes[attr]}
                onChange={(e) =>
                  setBooleanAttributes({
                    ...booleanAttributes,
                    [attr]: e.target.checked,
                  })
                }
              />
            }
            label={attr
              .replace(/([A-Z])/g, " $1")
              .replace(/^./, (str) => str.toUpperCase())} // Format label
          />
        ))}
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* Weather Data */}
      {weatherData && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6">Current Weather</Typography>
          <Typography>
            {weatherData.location.name}, {weatherData.location.region}
          </Typography>
          <Typography>Temperature: {weatherData.current.temp_c}°C</Typography>
          <Typography>
            Condition: {weatherData.current.condition.text}
          </Typography>
          <img src={weatherData.current.condition.icon} alt="Weather Icon" />
          <Typography>Humidity: {weatherData.current.humidity}%</Typography>
          <Typography>UV Index: {weatherData.current.uv}</Typography>
        </Box>
      )}

      <Divider sx={{ my: 3 }} />

      {/* Item Selection */}
      <Typography variant="h6">Select Items</Typography>
      <TextField
        label="Search Items"
        variant="outlined"
        fullWidth
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 2 }}
      />
      <List>
        {userItems
          .filter((item) =>
            item.itemName.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map((item) => (
            <ListItem
              key={item.itemId}
              sx={{ display: "flex", alignItems: "center" }}
            >
              <ListItemAvatar>
                <Avatar src={item.mainImageUrl} />
              </ListItemAvatar>
              <ListItemText primary={item.itemName} />
              <Checkbox
                checked={
                  selectedItems.find((i) => i === item.itemId) !== undefined
                }
                onChange={() => handleCheckboxToggle(item)}
              />
            </ListItem>
          ))}
      </List>

      {/* Submit Button */}
      <Button
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mt: 3 }}
        onClick={handleSubmit}
      >
        Create Outfit
      </Button>
    </Box>
  );
};

export default CreateOutfitPage;
