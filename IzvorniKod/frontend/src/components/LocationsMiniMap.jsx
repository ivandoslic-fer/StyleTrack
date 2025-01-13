import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import useUserLocation from '../hooks/useUserLocation';
import { Button } from '@mui/material';

const UserFollower = ({ location, selectedLocation, onSelectedLocationChange, editing }) => {
    const map = useMap();

    useMapEvents({
        click(event) {
            if (editing) {
                const { lat, lng } = event.latlng;
                onSelectedLocationChange([lat, lng]);
            }
        }
    });

    useEffect(() => {
        if (location) {
            map.flyTo(location);
        }
    }, [location]);

    return null;
};

const LocationsMiniMap = ({ selectedLocation, onSelectedLocationChange, editing, existingLocations }) => {
    const { userLocation, getCurrentPosition } = useUserLocation();
    const [hasUserApprovedLocation, setHasUserApprovedLocation] = useState(false);

    const locationIcon = new L.Icon({
        iconUrl: "https://img.icons8.com/?size=100&id=WbqhJjjts8qI&format=png&color=000000",
        iconSize: [36, 36]
    });

    const shopIcon = new L.Icon({
        iconUrl: "https://img.icons8.com/?size=100&id=ELzyEInw6DCj&format=png&color=000000",
        iconSize: [36, 36]
    })

    const userIcon = new L.Icon({
        iconUrl: "https://img.icons8.com/?size=100&id=8NzonSPORfzB&format=png&color=000000",
        iconSize: [36, 36]
    });

    const closestToUser = () => {
        if (existingLocations.length <= 0) return userLocation;
    
        let closestLocation = existingLocations[0];
        let minDistance = haversineDistance(userLocation, [existingLocations[0].latitude, existingLocations[0].longitude]);
    
        existingLocations.forEach(location => {
            const distance = haversineDistance(userLocation, [location.latitude, location.longitude]);
            if (distance < minDistance) {
                minDistance = distance;
                closestLocation = location;
            }
        });
    
        return [closestLocation.longitude, closestLocation.latitude]; // Return as [lat, lng] array
    };

    const haversineDistance = ([lat1, lon1], [lat2, lon2]) => {
        const toRad = (angle) => (Math.PI / 180) * angle;
        const R = 6371; // Radius of the Earth in km
    
        const dLat = toRad(lat2 - lat1);
        const dLon = toRad(lon2 - lon1);
    
        const a = 
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    
        return R * c; // Distance in km
    };

    useEffect(() => {
        if (navigator.permissions) {
            navigator.permissions.query({ name: 'geolocation' }).then((result) => {
                setHasUserApprovedLocation(result.state === 'granted');
            });
        }
    }, []);

    if (!hasUserApprovedLocation || !userLocation) {
        return (
            <div className='flex w-full h-full justify-center items-center'>
                <Button variant='contained' onClick={getCurrentPosition}>Allow Location</Button>
            </div>
        );
    }

    return (
        <div className='w-full h-full relative'>
            <MapContainer center={editing ? userLocation : selectedLocation} zoom={13} className='h-full'>
                <TileLayer
                    attribution='&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png"
                />
                <Marker position={userLocation} icon={userIcon}>
                    <Popup>You are here</Popup>
                </Marker>
                {!editing && selectedLocation && (
                    <Marker position={selectedLocation} icon={shopIcon}>
                        <Popup>Selected location</Popup>
                    </Marker>
                )}
                {existingLocations && existingLocations.map((loc, index) => (
                    <Marker key={loc.id} position={[loc.longitude, loc.latitude]} icon={loc.isShop ? shopIcon : locationIcon}>
                        <Popup>{ loc.name }</Popup>
                    </Marker>
                ))}
                
                <UserFollower location={editing ? userLocation : closestToUser()} selectedLocation={selectedLocation} onSelectedLocationChange={onSelectedLocationChange} editing={editing}/>
                
            </MapContainer>
        </div>
    );
};

export default LocationsMiniMap;