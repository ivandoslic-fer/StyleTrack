import { Box, Typography, Paper, TextField, Switch, Button, Chip } from "@mui/material";
import { useState, useEffect } from "react";
import GalleryUpload from "../components/GalleryUpload";
import { useLoaderData } from "react-router-dom";
import { VolunteerActivism } from "@mui/icons-material";
import { useSnackbar } from "../context/SnackbarContext";
import { requestHandler, styleTrackAuthProvider } from "../util/styleTrackUtil";

export default function ItemPage() {
    const data = useLoaderData();
    const { showSnackbar } = useSnackbar();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    itemName: data.itemName,
    description: data.description,
    seasonCategory: data.seasonCategory,
    brand: data.brand,
    forSharing: data.forSharing,
    categoryFields: data.categoryFields,
  });
  const [isUsersItem, setIsUsersItem] = useState(true);

  const [tags, setTags] = useState(data.itemTags);

  const handleEditToggle = async () => {
    if (editing) {
      // handle the update with the server.

      try {
        const res = await requestHandler.putRequest(`/items/${data.itemId}`, {
          ...formData,
          sectionId: data.sectionId,
          itemId: data.itemId,
          ownerUsername: data.ownerUsername,
          category: data.category,
          mainImageUrl: data.mainImageUrl,
          itemTags: data.itemTags,
          galleryImages: data.galleryImages        
        });
  
        showSnackbar({
          severity: "success",
          message: "Successfull updated the item!",
          duration: 3000
        });

        location.reload();
      } catch (e) {
        showSnackbar({
          severity: "error",
          message: "An error has occured trying to update the item",
          duration: 3000
        });
        return;
      }
    }
    setEditing((prev) => !prev)
  };

  const handleCancel = () => {
    setFormData({
      itemName: data.itemName,
      description: data.description,
      seasonCategory: data.seasonCategory,
      brand: data.brand,
      forSharing: data.forSharing,
      categoryFields: data.categoryFields,
    });
    setTags(data.itemTags);
    setEditing(false);
  };

  const handleCategoryFieldChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      categoryFields: {
        ...prev.categoryFields,
        [key]: value,
      },
    }));
  };

  useEffect(() => {
    const initialLoad = async () => {
      let user;
      try {
        user = await styleTrackAuthProvider.getCurrentUser();
      } catch (e) {
        user = null;
      }

      console.log(user);
      console.log(data);

      setIsUsersItem(user && data.ownerUsername === user.username);
    }

    initialLoad();
  }, []);

  return (
    <div className="flex-1 p-4">
      <Paper elevation={3} className="p-6 rounded-lg shadow-md bg-white">
      <Typography
          variant="h5"
          sx={{ fontWeight: "bold" }}
          className="mb-4 text-center font-bold"
        >
          Item Details
        </Typography>
        <div className="min-h-2">{/** SPACER */}</div>
        <div className="flex flex-1 flex-col md:flex-row w-full gap-6">
            <div className="flex flex-1 flex-col">
        <Box className="mb-4">
          <Typography variant="body1" className="font-medium">
            <b>Item Name:</b>
          </Typography>
          {editing ? (
            <TextField
              fullWidth
              value={formData.itemName}
              onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
              variant="outlined"
              className="mt-2"
            />
          ) : (
            <Typography className="mt-2 text-gray-700">{data.itemName}</Typography>
          )}
        </Box>

        <Box className="mb-4">
          <Typography variant="body1" className="font-medium">
            <b>Description:</b>
          </Typography>
          {editing ? (
            <TextField
              fullWidth
              multiline
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              variant="outlined"
              className="mt-2"
            />
          ) : (
            <Typography className="mt-2 text-gray-700">{data.description}</Typography>
          )}
        </Box>

        <Box className="mb-4">
          <Typography variant="body1" className="font-medium">
            <b>Category:</b> {data.category}
          </Typography>
        </Box>

        <Box className="mb-4">
          <Typography variant="body1" className="font-medium">
            <b>Season Category:</b>
          </Typography>
          {editing ? (
            <TextField
              fullWidth
              value={formData.seasonCategory}
              onChange={(e) => setFormData({ ...formData, seasonCategory: e.target.value })}
              variant="outlined"
              className="mt-2"
            />
          ) : (
            <Typography className="mt-2 text-gray-700">{data.seasonCategory}</Typography>
          )}
        </Box>

        <Box className="mb-4">
          <Typography variant="body1" className="font-medium">
            <b>Brand:</b>
          </Typography>
          {editing ? (
            <TextField
              fullWidth
              value={formData.brand}
              onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
              variant="outlined"
              className="mt-2"
            />
          ) : (
            <Typography className="mt-2 text-gray-700">{data.brand}</Typography>
          )}
        </Box>

        <Box className="mb-4">
          <Typography variant="body1" className="font-medium">
            <b>For Sharing:</b>
          </Typography>
          {editing ? (
            <Switch
            checked={formData.forSharing}
            onChange={(e) => setFormData({...formData, forSharing: e.target.checked})}
            color="primary"
          />
          ) : (
            <div className="flex flex-row items-center mt-1">
                {formData.forSharing && <VolunteerActivism className="text-green-500 mr-1"/>}
                <Typography className="mt-2 text-gray-700">
                    {formData.forSharing ? 'Sharing' : 'Not Sharing'}
                </Typography>
            </div>
          )}
        </Box>

        <Box className="mb-4" onClick={() => {
          if (editing) {
            showSnackbar({
              severity: "warning",
              message: "Sorry changing category fields is not implemented yet.",
              duration: 3000
            })
          }
        }}>
          <Typography variant="body1" className="font-medium">
            <b>Category Fields:</b>
          </Typography>
          {Object.entries(data.categoryFields).map(([key, value]) => (
            <Box key={key} className="mt-2">
              <Typography variant="body2" className="font-medium">
                {key}:
              </Typography>
              {editing ? (
                typeof value === "boolean" ? (
                  <Switch
                    checked={formData.categoryFields[key]}
                    onChange={(e) => handleCategoryFieldChange(key, e.target.checked)}
                    color="primary"
                  />
                ) : (
                  <TextField
                    fullWidth
                    value={formData.categoryFields[key]}
                    onChange={(e) => handleCategoryFieldChange(key, e.target.value)}
                    variant="outlined"
                    className="mt-1"
                  />
                )
              ) : (
                <Typography className="mt-2 text-gray-700">{String(value)}</Typography>
              )}
            </Box>
          ))}
        </Box>

        </div>
        <div className="flex flex-1 flex-col">

        <Box className="mb-4" onClick={() => {
          if (editing) {
            showSnackbar({
              severity: "warning",
              message: "Sorry changing items images is not implemented yet.",
              duration: 3000
            })
          }
        }}>
          <Typography variant="body1" className="font-medium">
            <b>Gallery:</b>
          </Typography>
          {/** DON'T FORGET TO UPDATE HERE WHEN IMPLEMENTING EDITING */}
          <GalleryUpload imageUrls={data.galleryImages} setImageUrls={setFormData} disabled={true} />
        </Box>

        <Box className="mb-4">
          <Typography variant="body1" className="font-medium">
            <b>Tags:</b>
          </Typography>
          <div className="min-h-2">{/** SPACER */}</div>
          {editing ? (
            <Box mt={2}>
              {tags.map((tag, index) => (
                <Chip
                  key={index}
                  label={tag}
                  onDelete={() => {
                    if (editing) {
                      showSnackbar({
                        severity: "warning",
                        message: "Sorry updating tags is not implemented yet.",
                        duration: 3000
                      })
                    }
                  }}
                  color="primary"
                  style={{ marginRight: 8, marginBottom: 8 }}
                />
              ))}
              <TextField
                fullWidth
                placeholder="Add new tag"
                disabled={true}
                helperText="Not available"
                onClick={() => {
                  showSnackbar({
                    severity: "warning",
                    message: "Sorry changing tags is not implemented yet.",
                    duration: 3000
                  });
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.target.value.trim()) {
                    setTags((prev) => [...prev, e.target.value.trim()]);
                    e.target.value = "";
                  }
                }}
              />
            </Box>
          ) : (
            <Box>
              {tags.map((tag, index) => (
                <Chip key={index} label={tag} color="primary" style={{ marginRight: 8, marginBottom: 8 }} component='a' href={`/search/items?tags=${tag}`} clickable/>
              ))}
            </Box>
          )}
        </Box>

        <Box className="mt-6 flex justify-end gap-4">
          {editing && (
            <Button
              variant="outlined"
              color="error"
              onClick={handleCancel}
              className="hover:bg-red-500 hover:text-white"
            >
              Cancel
            </Button>
          )}
          {isUsersItem && (
            <Button
              variant="contained"
              color="primary"
              onClick={handleEditToggle}
            >
              {editing ? "Save" : "Edit"}
            </Button>
          )}
        </Box>
        </div>
        </div>
      </Paper>
    </div>
  );
}
