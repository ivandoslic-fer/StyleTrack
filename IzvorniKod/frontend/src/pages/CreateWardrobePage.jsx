import { Box, Button, Modal, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { requestHandler } from "../util/styleTrackUtil";
import { useLoaderData } from "react-router-dom";
import Minimap from "../components/MiniMap";
import useUserLocation from "../hooks/useUserLocation";
import { useSnackbar } from "../context/SnackbarContext";

export default function CreateWardrobePage() {
  const user = useLoaderData();
  const { showSnackbar } = useSnackbar();
  const { userLocation } = useUserLocation();
  const [formData, setFormData] = useState({
    wardobeName: "",
    wardrobeDescription: "",
    longitude: 0.0,
    latitute: 0.0
  });

  const [selectedLocation, setSelectedLocation] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const showSuccessSnackbar = () => {
    showSnackbar({
      message: "Wardrobe created",
      severity: "success",
      duration: 3000
    })
  }

  const handleLocationSelect = (lnglat) => {
    setSelectedLocation(lnglat);
  }

  const handleUseCurrentLocation = () => {
    setSelectedLocation(userLocation);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newWardrobe = {
        ownerId: user.id,
        wardrobeName: formData.wardobeName,
        description: formData.wardrobeDescription,
        isPublic: false
    };

    if (selectedLocation) {
      newWardrobe.latitude = selectedLocation[0];
      newWardrobe.longitude = selectedLocation[1];
    }

    await requestHandler.postRequest(`/wardrobes/new`, newWardrobe);

    showSuccessSnackbar();

    location.replace(`/wardrobes?user=${user.username}`);
  };

  return (
    <div className="bg-gray-100 py-6 px-4 md:flex md:justify-center md:items-center md:h-screen">
      <div className="md:bg-white p-6 rounded-lg md:shadow-lg w-full md:w-[80%] md:flex-grow h-full">
        <Typography variant="h5" className="text-center">
          Create wardrobe
        </Typography>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2 h-3/4">
          <div className="w-full h-full flex flex-col md:flex-row h-full mb-4 justify-center items-center">
            <div className="flex flex-col h-full w-full md:w-1/3 m-4">
              <TextField
                fullWidth
                id="wardrobe-name-field"
                label="Wardrobe name"
                name="wardobeName"
                variant="outlined"
                value={formData.wardobeName}
                onChange={handleChange}
                className="w-full"
              />
              <TextField
                id="wardrobe-description-field"
                fillWidth
                multiline
                name="wardrobeDescription"
                label="Description"
                variant="outlined"
                value={formData.wardrobeDescription}
                onChange={handleChange}
                className="w-full"
                margin="normal"
                rows={5}
              />
              {selectedLocation ? (
                <div className="flex w-full justify-center items-center border border-green-500 p-3 text-green-500 rounded mt-2 mb-3 hover:bg-green-500 hover:text-black transition ease-in-out delay-10">
                  <p>Location selected.</p>
                </div>
              ) : (
                <div className="flex w-full justify-center items-center border border-red-500 p-3 text-red-500 rounded mt-2 mb-3 hover:bg-red-500 hover:text-black transition ease-in-out delay-10">
                  <p>Location not selected.</p>
                </div>
              )}
              <Button variant="contained" color="primary" onClick={handleUseCurrentLocation} disabled={selectedLocation === userLocation}>
                Set to Current Location
              </Button>
              <div className="w-full flex flex-col md:hidden">
                <div className="min-h-3">{ /** THIS IS A SPACER */} </div>
                <Button variant="contained" color="primary" onClick={() => setModalOpen(true)}>
                  Pick another location
                </Button>
                <Modal
                  open={modalOpen}
                  onClose={() => setModalOpen(false)}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                >
                  <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '100%',
                    height: '60%',
                    bgcolor: 'black',
                    boxShadow: 24,
                  }}
                  >
                    <div className="flex flex-row w-full h-[10%] items-center justify-between px-2">
                      <h2 className="text-white">Select a location</h2>
                      <Button
                        variant="contained"
                        color="success"
                        className="hover:bg-green-700 text-white"
                        onClick={() => setModalOpen(false)}
                      >
                        Done
                      </Button>
                    </div>
                    <div className="h-[90%] w-full">
                      <Minimap selectedLocation={selectedLocation} onSelectedLocationChange={handleLocationSelect} />
                    </div>
                  </Box>
                </Modal>
              </div>
              <div className="min-h-3">{ /** THIS IS A SPACER */} </div>
              {selectedLocation && (
                <Button
                  variant="outlined"
                  color="error"
                  className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                  onClick={() => setSelectedLocation(null)}
                >
                  Remove selection
                </Button>
              )}
            </div>
            <div className="hidden md:flex flex-col md:h-full md:w-2/3 m-4">
              <Minimap selectedLocation={selectedLocation} onSelectedLocationChange={handleLocationSelect} displayOnly={false}/>
            </div>
          </div>
          <div className="m-5 min-h-3">{ /** THIS IS A SPACER */} </div>
          <Stack
            direction="row"
            spacing={2}
            justifyContent="center"
            className="mt-4"
          >
            <Button
              id="save-button"
              variant="contained"
              color="primary"
              type="submit"
              className="hover:bg-green-700 text-white"
            >
              Save Changes
            </Button>
            <Button
              variant="outlined"
              color="error"
              className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
              onClick={() => history.back()}
            >
              Cancel
            </Button>
          </Stack>
        </form>
      </div>
    </div>
  );
}
