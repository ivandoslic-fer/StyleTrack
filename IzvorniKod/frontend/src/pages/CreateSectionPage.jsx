import { Button, Stack, TextField, Typography, MenuItem, duration } from "@mui/material";
import { useState } from "react";
import { requestHandler } from "../util/styleTrackUtil";
import { useParams } from "react-router-dom";
import { useSnackbar } from "../context/SnackbarContext";

export default function CreateSectionPage() {
  const { wardrobeId } = useParams();

  const { showSnackbar } = useSnackbar();

  const [formData, setFormData] = useState({
    sectionName: "",
    sectionType: "",
    itemCapacity: "",
  });

  const showSuccessSnackbar = () => {
    showSnackbar({
      message: "Section created successfully!",
      severity: "success",
      duration: 3000
    })
  }

  const showSnackbarError = (message) => {
    showSnackbar({
      message,
      severity: 'error',
      duration: 3000
    })
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const newSection = {
        wardrobeId: parseInt(wardrobeId, 10),
        sectionName: formData.sectionName,
        sectionType: formData.sectionType,
        sectionCapacity: parseInt(formData.itemCapacity, 10),
      };
  
      await requestHandler.postRequest(`/sections/new`, newSection);
    } catch (e) {
      showSnackbarError(e.message)
    }

    showSuccessSnackbar();

    location.replace(`/wardrobes/${wardrobeId}`);
  };

  const sectionTypes = [
    "Shelf",
    "Drawer",
    "Rack",
    "Compartment",
    "Hanger Area",
    "Cabinet",
    "Bin",
    "Container",
    "Storage Area",
    "Custom",
  ];

  return (
    <div className="bg-gray-100 py-6 px-4 md:flex md:justify-center md:items-center md:h-screen">
      <div className="md:bg-white p-6 rounded-lg md:shadow-lg w-full md:max-w-md md:flex-grow">
        <Typography variant="h5" className="text-center">
          Create Section
        </Typography>
        <form onSubmit={handleSubmit} className="space-y-4 mt-10">
          <TextField
            fullWidth
            label="Section Name"
            name="sectionName"
            variant="outlined"
            value={formData.sectionName}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            label="Section Type"
            name="sectionType"
            variant="outlined"
            value={formData.sectionType}
            onChange={handleChange}
            required
            select
            helperText="Select the type of wardrobe section"
          >
            {sectionTypes.map((type, index) => (
              <MenuItem key={index} value={type}>
                {type}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            fullWidth
            label="Item Capacity"
            name="itemCapacity"
            type="number"
            variant="outlined"
            value={formData.itemCapacity}
            onChange={handleChange}
            required
            helperText="Maximum number of items this section can hold"
          />
          <Stack
            direction="row"
            spacing={2}
            justifyContent="center"
            className="mt-4"
          >
            <Button
              variant="contained"
              color="primary"
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white"
            >
              Save Changes
            </Button>
            <Button
              variant="outlined"
              color="secondary"
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
