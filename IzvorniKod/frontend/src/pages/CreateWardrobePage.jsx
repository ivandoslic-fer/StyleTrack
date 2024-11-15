import { Button, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { requestHandler, styleTrackAuthProvider } from "../util/styleTrackUtil";

export default function CreateWardrobePage() {
  const [formData, setFormData] = useState({
    wardobeName: "",
    // tags: []
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newWardrobe = {
        ownerId: styleTrackAuthProvider.userData.id,
        wardrobeName: formData.wardobeName
    };

    await requestHandler.postRequest(`/wardrobes/new`, newWardrobe);

    location.replace(`/wardrobes?user=${styleTrackAuthProvider.username}`);
  };

  return (
    <div className="bg-gray-100 py-6 px-4 md:flex md:justify-center md:items-center md:h-screen">
      <div className="md:bg-white p-6 rounded-lg md:shadow-lg w-full md:max-w-md md:flex-grow">
        <Typography variant="h5" className="text-center">
          Create wardrobe
        </Typography>
        <form onSubmit={handleSubmit} className="space-y-4 mt-10">
          <TextField
            fullWidth
            label="Wardrobe name"
            name="wardobeName"
            variant="outlined"
            value={formData.wardobeName}
            onChange={handleChange}
            className="w-full"
          />
          <div className="flex flex-row">
            <TextField
              fullWidth
              label="Tag"
              name="tag"
              disabled={true}
              variant="outlined"
              onChange={handleChange}
              className="w-full"
            />
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={true}
              className="bg-blue-500 hover:bg-blue-700 text-white"
            >
              Add
            </Button>
          </div>
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
        <p className="text-gray-500 text-xs mt-10">
          * Soon you&apos;ll be able to add tags to your wardrobe
        </p>
      </div>
    </div>
  );
}
