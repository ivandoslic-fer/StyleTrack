import { Avatar, Button, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useLoaderData } from "react-router-dom";
import { getRandomColor, requestHandler } from "../util/styleTrackUtil";

export default function ProfileSettingsPage() {
  const user = useLoaderData();

  const [formData, setFormData] = useState({
    username: user.username,
    email: user.email,
    displayName: user.displayName,
  });

  const [uploadedFile, setUploadedFile] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newUserData = {
        id: user.id,
        username: formData.username,
        displayName: formData.displayName,
        email: formData.email
    };

    await requestHandler.putRequest(`/users/${user.id}`, newUserData);

    if (uploadedFile) {
      // Create FormData and append the file
      const formData = new FormData();
      formData.append("file", uploadedFile); // Pass the file object here
      formData.append("fileName", uploadedFile.name);

      // Make the image upload request
      const response = await requestHandler.imagePostRequest(
        "/users/profileImage/upload",
        formData
      );

      // Save new profile picture URL
      newUserData.profilePictureUrl = response.data.profilePictureUrl;
    }

    localStorage.setItem('userData', JSON.stringify(newUserData));

    location.replace(`/profile/${user.username}`);
  };

  return (
    <div className="bg-gray-100 py-6 px-4 md:flex md:justify-center md:items-center md:h-screen">
      <div className="md:bg-white p-6 rounded-lg md:shadow-lg w-full md:max-w-md md:flex-grow">
        <a>{ JSON.stringify(user) }</a>
        <Typography variant="h5" className="text-center mb-4">
          Profile Settings
        </Typography>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex justify-center">
            <Avatar
              alt={formData.username.toUpperCase()}
              src={user.profilePictureUrl || "/"}
              sx={{
                width: 80,
                height: 80,
                marginTop: "25px",
                backgroundColor: getRandomColor(),
              }}
            />
          </div>
          <div className="flex justify-center">
            <Button variant="outlined" component="label">
              Upload New Picture
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleFileChange}
              />
            </Button>
          </div>
          <TextField
            fullWidth
            label="Display Name"
            name="displayName"
            variant="outlined"
            value={formData.displayName}
            onChange={handleChange}
            className="w-full"
          />
          <TextField
            fullWidth
            label="Username"
            name="username"
            disabled={true}
            variant="outlined"
            value={formData.username}
            onChange={handleChange}
            className="w-full"
          />
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            disabled={true}
            variant="outlined"
            value={formData.email}
            onChange={handleChange}
            className="w-full"
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
              onClick={() => location.replace(`/profile/${user.username}`)}
            >
              Cancel
            </Button>
          </Stack>
        </form>
        <p className="text-gray-500 text-xs mt-10">
            * Soon you&apos;ll be able to modify all of the settings
          </p>
      </div>
    </div>
  );
}
