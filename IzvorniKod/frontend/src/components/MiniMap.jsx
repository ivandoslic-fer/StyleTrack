import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet'
import 'leaflet/dist/leaflet.css';
import useUserLocation from '../hooks/useUserLocation';
import { Button } from '@mui/material';
import Lottie from 'react-lottie';
import animationData from '../assets/lotties/wired-flat-18-location-pin-hover-jump-roll.json'

const UserFollower = ({ location, selectedLocation, onSelectedLocationChange }) => {
    const map = useMap();

    const clickHandler = useMapEvents({
        click(event) {
            const {lat, lng} = event.latlng;
            onSelectedLocationChange([lat, lng]);
        }
    });

    useEffect(() => {
        if (location) {
            map.flyTo(location);
        }
      }, [location])

    return (<></>)
}

const Minimap = ({ selectedLocation, onSelectedLocationChange, displayOnly }) => {
  const { userLocation, getCurrentPosition } = useUserLocation();
  const [hasUserApprovedLocation, setHasUserApprovedLocation] = useState(false);
  const [isFirstVisit, setIsFirstVisit] = useState(true);

  const wardrobeIcon = new L.Icon({
    iconUrl: "https://img.icons8.com/?size=100&id=WbqhJjjts8qI&format=png&color=000000",
    iconSize: [36, 36]
  });

  const userIcon = new L.Icon({
    iconUrl: "https://img.icons8.com/?size=100&id=8NzonSPORfzB&format=png&color=000000",
    iconSize: [36, 36]
  });

  const defaultLottieOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
        preserveAspectRatio: "xMidYMid slice"
    }
  }

  useEffect(() => {
    // Check if the user has granted location permission
    if (navigator.permissions) {
      navigator.permissions.query({ name: 'geolocation' }).then((result) => {
        setHasUserApprovedLocation(result.state === 'granted');
      });
    }

    // Check for first visit in local storage
    const storedValue = localStorage.getItem('minimap-first-visit');
    setIsFirstVisit(storedValue === null);
  }, []);

  useEffect(() => {
    // Store visit status in local storage on change
    localStorage.setItem('minimap-first-visit', 'false');
  }, [isFirstVisit]); // Update on firstVisit change

  if (!hasUserApprovedLocation || !userLocation) {
    return (
    <div className='flex w-full h-full justify-center items-center'>
          <Button variant='contained' onClick={getCurrentPosition}>Allow Location</Button>
    </div>
    );
  }

  return (
    <div className='w-full h-full relative'>
        {isFirstVisit && (
            <div className='minimap-overlay py-4' onClick={() => setIsFirstVisit(false)}>
                <Lottie options={defaultLottieOptions} height={64} width={64} />
                <h2 className='mb-4 text-center'>Click/Tap anywhere on the map to select your wardrobe location.</h2>
            </div>
        )}
        <MapContainer center={displayOnly ? selectedLocation : userLocation} zoom={13} className='h-full' style={{ zIndex: 0 }}>
          <TileLayer
            attribution='&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png"
          />
          <Marker position={userLocation} icon={userIcon}>
            <Popup>You are here</Popup>
          </Marker>
          { selectedLocation && (
          <Marker position={selectedLocation} icon={wardrobeIcon}>
            <Popup>Wardrobe here</Popup>
          </Marker>
          )}
          {<UserFollower location={displayOnly ? selectedLocation : userLocation} selectedLocation={selectedLocation} onSelectedLocationChange={displayOnly ? () => {} : onSelectedLocationChange}/>}
        </MapContainer>
    </div>
  );
};

export default Minimap;