import { Button, Stack, TextField, Typography, MenuItem, Checkbox } from "@mui/material";
import { useState } from "react";
import { requestHandler } from "../util/styleTrackUtil";
import { useParams } from "react-router-dom";
import TagInput from "../components/TagInputComponent";
import GalleryUpload from "../components/GalleryUpload";
import { useSnackbar } from "../context/SnackbarContext";

export default function CreateItemPage() {
  const { sectionId } = useParams();

  const { showSnackbar } = useSnackbar();

  const [tags, setTags] = useState([]);
  const [imageUrls, setImageUrls] = useState(["https://ik.imagekit.io/gioy4a8qh/shoeExample_NccvUeq7Q.jpg"]);

  const [formData, setFormData] = useState({
    itemName: "",
    description: "",
    category: "",
    brand: "",
    seasonCategory: "",
  });

  const [categoryFields, setCategoryFields] = useState([]);

  const seasonCategories = [
    "Spring",
    "Summer",
    "Autumn",
    "Winter",
    "Spring/Summer",
    "Autumn/Winter",
    "All Seasons",
  ];

  // Category field definitions
  const categoryFieldMap = {
    CLOTHES: [
      { name: "fabric", label: "Fabric", type: "text" },
      { name: "size", label: "Size", type: "text" },
      { name: "longSleeved", label: "Long Sleeved", type: "checkbox" },
    ],
    FOOTWEAR: [
      { name: "shoeSize", label: "Shoe Size", type: "text" },
      { name: "openFoot", label: "Open Foot", type: "checkbox" },
      { name: "highHeeled", label: "High Heeled", type: "checkbox" },
      { name: "material", label: "Material", type: "text" },
      { name: "highShoes", label: "High Shoes", type: "checkbox" },
    ],
    // Add more categories as needed
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    setFormData({ ...formData, category: selectedCategory });
    setCategoryFields(categoryFieldMap[selectedCategory] || []);
  };

  const handleSeasonChange = (e) => {
    const selectedSeason = e.target.value;
    setFormData({ ...formData, seasonCategory: selectedSeason });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const categorySpecificData = categoryFields.reduce((acc, field) => {
      acc[field.name] = formData[field.name] || (field.type === "checkbox" ? false : "");
      return acc;
    }, {});

    const newItem = {
      sectionId: parseInt(sectionId, 10),
      itemName: formData.itemName,
      description: formData.description,
      category: formData.category,
      brand: formData.brand,
      seasonCategory: formData.seasonCategory,
      categoryFields: {
        ...categorySpecificData,
      },
      itemTags: tags,
      galleryImages: imageUrls
    };

    console.log(newItem);

    try {
      await requestHandler.postRequest(`/items/new`, newItem);
      showSnackbar({
        message: "Item added successfully.",
        severity: "success",
        duration: 2000
      });
      history.back();
    } catch (e) {
      showSnackbar({
        message: e.message,
        severity: "error",
        duration: 2000
      });
    }
  };

  return (
    <div className="bg-gray-100 py-6 px-4 md:flex md:justify-center md:items-center">
      <div className="md:bg-white p-6 rounded-lg md:shadow-lg w-full md:max-w-4xl h-full">
        <Typography variant="h5" className="text-center mb-4">
          Create Item
        </Typography>
        <form onSubmit={handleSubmit} className="h-full w-full flex flex-col h-2/3 mt-3">
          <div className="flex flex-col md:flex-row h-full">
            <div className="flex flex-1 flex-col h-full p-2">
              <TextField
                fullWidth
                label="Item Name"
                name="itemName"
                variant="outlined"
                value={formData.itemName}
                onChange={handleChange}
                required
                sx={{ marginBottom: "16px" }}
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
                sx={{ marginBottom: "16px" }}
              />
              <TextField
                fullWidth
                label="Brand"
                name="brand"
                variant="outlined"
                value={formData.brand}
                onChange={handleChange}
                helperText="Item brand"
                sx={{ marginBottom: "16px" }}
              />
              <TextField
                select
                fullWidth
                label="Season Category"
                value={formData.seasonCategory}
                onChange={handleSeasonChange}
                sx={{ mb: 3 }}
                variant="outlined"
                helperText="Select the applicable season or seasons"
              >
                {seasonCategories.map((season) => (
                  <MenuItem key={season} value={season}>
                    {season}
                  </MenuItem>
                ))}
              </TextField>
              <Typography variant="h8" color="gray">
                Item images
              </Typography>
              <GalleryUpload imageUrls={imageUrls} setImageUrls={setImageUrls} />
            </div>
            <div className="flex flex-1 flex-col h-full p-2">
              <TagInput tags={tags} setTags={setTags} />
              <div className="min-h-4">{/** SPACER */}</div>
              <TextField
                  fullWidth
                  label="Category"
                  name="category"
                  variant="outlined"
                  value={formData.category}
                  onChange={handleCategoryChange}
                  sx={{ mb: 2 }}
                  select
                  required
              >
                  <MenuItem value="CLOTHES">Clothes</MenuItem>
                  <MenuItem value="FOOTWEAR">Footwear</MenuItem>
                  {/* Add more categories here */}
              </TextField>
              {categoryFields.length > 0 ? (
                categoryFields.map((field) => {
                  return field.type === 'checkbox' ? (
                      <Stack
                        key={field.name}
                        direction="row"
                        alignItems="center"
                        spacing={2}
                        sx={{ marginBottom: "16px" }}
                      >
                        <Checkbox
                          name={field.name}
                          checked={formData[field.name] || false}
                          onChange={(e) =>
                            setFormData({ ...formData, [field.name]: e.target.checked })
                          }
                          color="primary"
                        />
                        <Typography>{field.label}</Typography>
                      </Stack>
                    ) : (
                      <TextField
                        key={field.name}
                        fullWidth
                        label={field.label}
                        name={field.name}
                        type={field.type}
                        variant="outlined"
                        value={formData[field.name] || ""}
                        onChange={handleChange}
                        sx={{ marginBottom: "16px" }}
                      />
                    )
                })
              ) : (
                <Typography variant="body1" color="textSecondary">
                  Select a category to see specific fields.
                </Typography>
              )}
            </div>
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
              Save Item
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
