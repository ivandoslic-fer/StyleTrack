import { useEffect, useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  Grid,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import OutfitCard from '../components/OutfitCard';
import { requestHandler } from '../util/styleTrackUtil';
import axios from 'axios';
import { useSnackbar } from '../context/SnackbarContext';

export default function OutfitsPage() {
  const [outfits, setOutfits] = useState([]);
  const [filteredOutfits, setFilteredOutfits] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [weatherData, setWeatherData] = useState(null);
  const [filter, setFilter] = useState('all');
  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    const getMyOutfits = async () => {
      setIsLoading(true);
      try {
        const result = await requestHandler.getRequest('/outfits/my');
        setOutfits(result.data);
        setFilteredOutfits(result.data); // Initially display all outfits
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
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

        console.log(weatherData);

        setWeatherData(weatherData);
      } catch (error) {
        console.error('Failed to fetch weather data or location:', error);

        if (error.code === 1) {
          console.error('Location access denied by user.');
        }
      }
    };

    getMyOutfits();
    fetchWeatherData();
  }, []);

  useEffect(() => {
    if (filteredOutfits.length == 0) {
      showSnackbar({
        severity: "info",
        message: "Looks like you don't have an outfit for the current weather :(",
        duration: 3000
      });
    }
  }, [filteredOutfits]);

  const handleDeleteOutfit = async (id) => {
    try {
      await requestHandler.deleteRequest(`/outfits/${id}`);
      setOutfits((prevOutfits) => prevOutfits.filter((outfit) => outfit.id !== id));
      setFilteredOutfits((prevOutfits) =>
        prevOutfits.filter((outfit) => outfit.id !== id)
      );
      showSnackbar({
        severity: "success",
        message: "Successfully deleted an outfit!",
        duration: 3000
      });
    } catch (e) {
      showSnackbar({
        severity: "error",
        message: "There was a problem deleting your outfit.",
        duration: 3000
      });
    }
  };

  const handleCreateOutfit = () => {
    location.assign('/outfits/create');
  };

  const handleFilterChange = (event) => {
    const value = event.target.value;
    setFilter(value);
  
    if (value === 'all') {
      setFilteredOutfits(outfits);
    } else if (value === 'current') {
      if (weatherData && weatherData.current) {
        const { temp_c, condition } = weatherData.current;
        
        const isCold = temp_c <= 5; // Cold if temperature is 5°C or lower
        const isRainy = condition.text.toLowerCase().includes('rain'); // Check for rain
        const isSnowy = condition.text.toLowerCase().includes('snow'); // Check for snow
        const isOvercast = condition.text.toLowerCase().includes('overcast'); // Cloudy or overcast
  
        // Filter outfits based on these conditions
        setFilteredOutfits(
          outfits.filter((outfit) => {
            return (
              (isCold && (outfit.forWinter || outfit.forSnow)) || // Include winter/snow outfits if cold
              (isRainy && outfit.forRain) || // Include rain outfits if rainy
              (isSnowy && outfit.forSnow) || // Include snow outfits if snowy
              (isOvercast && outfit.forAutumnSpring) // Include autumn/spring outfits if overcast
            );
          })
        );
      } else {
        console.error('Weather data is not available.');
      }
    } else {
      const isCold = value === 'cold';
      const isRainy = value === 'rainy';
  
      setFilteredOutfits(
        outfits.filter(
          (outfit) =>
            (isCold && (outfit.forWinter || outfit.forAutumnSpring || outfit.forSnow)) ||
            (isRainy && outfit.forRain)
        )
      );
    }
  };  

  return (
    <Container>
      <Typography variant="h3" sx={{ marginBottom: '25px' }}>
        My Outfits
      </Typography>
      <Box sx={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between' }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleCreateOutfit}
          sx={{ textTransform: 'none' }}
        >
          Create New Outfit
        </Button>
        {weatherData && (
          <FormControl sx={{ width: '200px' }}>
            <InputLabel>Filter</InputLabel>
            <Select value={filter} onChange={handleFilterChange}>
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="current">Current Weather</MenuItem>
              <MenuItem value="cold">Cold Weather</MenuItem>
              <MenuItem value="rainy">Rainy Weather</MenuItem>
            </Select>
          </FormControl>
        )}
      </Box>
      {isLoading ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '50vh',
          }}
        >
          <CircularProgress />
        </Box>
      ) : filteredOutfits.length > 0 ? (
        <Grid container spacing={3}>
          {filteredOutfits.map((outfit) => (
            <Grid item xs={12} sm={6} md={4} key={outfit.id}>
              <OutfitCard outfit={outfit} onDelete={() => handleDeleteOutfit(outfit.id)} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography>No outfits match the selected filter.</Typography>
      )}
    </Container>
  );
}
