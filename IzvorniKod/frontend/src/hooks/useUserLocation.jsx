import { useState, useEffect } from 'react';

const useUserLocation = () => {
  const [location, setLocation] = useState([0.0, 0.0]);
  const [error, setError] = useState(null);

  const getCurrentPosition = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        setError(`Error getting location: ${error.message}`);
      }
    );
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          setError(`Error getting location: ${error.message}`);
        }
      );
    } else {
      setError("Geolocation is not supported by your browser.");
    }
  }, []);

  return { userLocation: location, error, getCurrentPosition };
};

export default useUserLocation;