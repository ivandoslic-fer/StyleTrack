import { Button, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { requestHandler } from "../util/styleTrackUtil";
import { useParams } from "react-router-dom";

export default function CreateItemPage() {
  const { sectionId } = useParams();

  const [formData, setFormData] = useState({
    itemName: "",
    category: "",
    description: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newItem = {
      sectionId: parseInt(sectionId, 10),
      itemName: formData.itemName,
      category: formData.category,
      description: formData.description,
    };

    await requestHandler.postRequest(`/items/new`, newItem);

    history.back();
  };

  return (
    <div className="bg-gray-100 py-6 px-4 md:flex md:justify-center md:items-center md:h-screen">
      <div className="md:bg-white p-6 rounded-lg md:shadow-lg w-full md:max-w-md md:flex-grow">
        <Typography variant="h5" className="text-center">
          Create Item
        </Typography>
        <form onSubmit={handleSubmit} className="space-y-4 mt-10">
          <TextField
            fullWidth
            label="Item Name"
            name="itemName"
            variant="outlined"
            value={formData.itemName}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            label="Category"
            name="category"
            variant="outlined"
            value={formData.category}
            onChange={handleChange}
            required
            helperText="E.g., Clothing, Accessories, Shoes"
          />
          <TextField
            fullWidth
            label="Description"
            name="description"
            variant="outlined"
            value={formData.description}
            onChange={handleChange}
            multiline
            rows={3}
            helperText="Optional: Provide a brief description of the item"
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
              Save Item
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
