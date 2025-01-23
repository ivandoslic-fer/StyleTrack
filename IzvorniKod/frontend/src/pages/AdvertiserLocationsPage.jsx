import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, TextField, Paper, TablePagination } from '@mui/material';
import LocationsMiniMap from '../components/LocationsMiniMap';
import { useSnackbar } from '../context/SnackbarContext';
import { requestHandler, styleTrackAuthProvider } from '../util/styleTrackUtil';

const LocationsPage = () => {
  const [locations, setLocations] = useState([]);
  const [newLocation, setNewLocation] = useState({ name: '', latitude: 0, longitude: 0, isShop: true });
  const [page, setPage] = useState(0);
  const [selectedLocation, setSelectedLocation] = useState([0, 0]);
  const { showSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);

  const updateNewLocation = (lnglat) => {
    console.log(lnglat);
    
    setNewLocation({
        longitude: lnglat[0],
        latitude: lnglat[1],
        name: newLocation.name
    });
    
    setSelectedLocation(lnglat);
  }

  useEffect(() => {
    fetchLocations(); // Load initial locations
  }, []);

  const fetchLocations = async () => {
    const currentUser = await styleTrackAuthProvider.getCurrentUser()
    const remoteLocations = await requestHandler.getRequest(`/advertisers/${currentUser.id}/locations`)
    console.log(remoteLocations);

    remoteLocations.data.forEach(location => location.isShop = true);
    
    setLocations(remoteLocations.data);
  };

  const handleAddLocation = async () => {
    if (!newLocation.name || !newLocation.latitude || !newLocation.longitude) {
      showSnackbar({
        severity: "error",
        message: "Please make sure you picked all the attributes",
        duration: 3000
      })
      return;
    }

    setLoading(true);
    // Replace with real API call to save location
    let addedLoc;
    try {
        const currentUser = await styleTrackAuthProvider.getCurrentUser();
        addedLoc = await requestHandler.postRequest(`/advertisers/${currentUser.id}/locations`, newLocation);
    } catch (e) {
        showSnackbar({
            severity: "success",
            message: "Added a new location",
            duration: 3000
        });
        setLoading(false);
        return;    
    }
    console.log(addedLoc.data);
    
    const updatedLocations = [...locations, addedLoc.data];

    updatedLocations.forEach(location => location.isShop = true);

    setLocations(updatedLocations);
    setNewLocation({ name: '', latitude: '', longitude: '' });

    showSnackbar({
        severity: "success",
        message: "Added a new location",
        duration: 3000
    });

    setLoading(false);
  };

  const handleDeleteLocation = async (id) => {
    setLoading(true);
    try {
        await requestHandler.deleteRequest(`/advertisers/locations/${id}`);
    } catch (e) {
        showSnackbar({
            severity: "error",
            message: "An error occured",
            duration: 3000
        });
        setLoading(false);
        return;
    }
    setLocations(locations.filter((location) => location.id !== id));
    showSnackbar({
        severity: "success",
        message: "Successfully deleted",
        duration: 3000
    });
    setLoading(false);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  return (
    <div className="flex min-h-screen">
      {/* Left half: Map placeholder */}
      <div className="w-1/2 bg-gray-200 flex items-center justify-center">
        <LocationsMiniMap selectedLocation={selectedLocation} onSelectedLocationChange={updateNewLocation} editing={true} existingLocations={locations}/>
      </div>

      {/* Right half: Form and Table */}
      <div className="w-1/2 p-8">
        {/* Form */}
        <h2 className="text-xl font-bold mb-4">Add New Location</h2>
        <form className="space-y-4 mb-8">
          <TextField
            fullWidth
            label="Location Name"
            value={newLocation.name}
            onChange={(e) => setNewLocation({ ...newLocation, name: e.target.value })}
          />
          <TextField
            fullWidth
            label="Latitude"
            type="number"
            value={newLocation.latitude}
            onChange={(e) => setNewLocation({ ...newLocation, latitude: e.target.value })}
          />
          <TextField
            fullWidth
            label="Longitude"
            type="number"
            value={newLocation.longitude}
            onChange={(e) => setNewLocation({ ...newLocation, longitude: e.target.value })}
          />
          <Button variant="contained" color="primary" fullWidth onClick={handleAddLocation} disabled={loading}>
            Add Location
          </Button>
        </form>

        {/* Locations Table */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Latitude</TableCell>
                <TableCell>Longitude</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {locations.slice(page * 10, page * 10 + 10).map((location) => (
                <TableRow key={location.id}>
                  <TableCell>{location.name}</TableCell>
                  <TableCell>{location.latitude}</TableCell>
                  <TableCell>{location.longitude}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => handleDeleteLocation(location.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={locations.length}
          rowsPerPage={10}
          rowsPerPageOptions={[10]}
          page={page}
          onPageChange={handleChangePage}
        />
      </div>
    </div>
  );
};

export default LocationsPage;