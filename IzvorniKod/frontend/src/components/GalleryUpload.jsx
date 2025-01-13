import { useState } from "react";
import { Button, Box, Typography, IconButton } from "@mui/material";
import { requestHandler } from "../util/styleTrackUtil";
import { ArrowBack, ArrowForward, Delete, Upload } from "@mui/icons-material";

export default function GalleryUpload({ imageUrls, setImageUrls, disabled = false }) {
  const [uploading, setUploading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0); // Track the currently displayed image

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    const response = await requestHandler.imagePostRequest("/items/uploadImage", formData);

    console.log(response);

    setImageUrls((prevUrls) => [...prevUrls, response.data]);
    setUploading(false);
  };

  const handleRemoveImage = () => {
    if (imageUrls.length > 0) {
      const urlToRemove = imageUrls[activeIndex];
  
      // Remove the currently active image
      setImageUrls((prevUrls) => prevUrls.filter((imageUrl) => imageUrl !== urlToRemove));
  
      // Adjust the active index to ensure it stays valid
      if (activeIndex >= imageUrls.length - 1) {
        setActiveIndex(Math.max(0, activeIndex - 1));
      }
    }
  };  

  const handleNext = () => {
    if (activeIndex < imageUrls.length - 1) {
      setActiveIndex(activeIndex + 1);
    }
  };

  const handlePrev = () => {
    if (activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="min-h-[30svh] w-full mb-3 flex flex-col justify-center items-center border border-gray-300 p-2 rounded">
        {imageUrls && imageUrls.length > 0 ? (
          <div className="flex flex-col items-center w-full">
            <div className="flex flex-row justify-between items-center w-full">
                <IconButton
                    variant="outlined"
                    color="primary"
                    onClick={handlePrev}
                    disabled={activeIndex === 0}
                    sx={{ marginRight: 1 }}
                >
                    <ArrowBack />
                </IconButton>
                <img
                src={imageUrls[activeIndex]}
                alt={`Uploaded ${activeIndex}`}
                style={{ height: "150px", maxWidth: "100%", objectFit: "contain" }}
                />
                <IconButton
                    variant="outlined"
                    color="primary"
                    onClick={handleNext}
                    disabled={activeIndex === imageUrls.length - 1}
                    sx={{ marginRight: 1 }}
                >
                    <ArrowForward />
                </IconButton>
            </div>
            <Typography variant="body2" color="textSecondary" sx={{ marginTop: "8px" }}>
              {`Image ${activeIndex + 1} of ${imageUrls.length}`}
            </Typography>
          </div>
        ) : (
          <Typography className="text-gray-500 text-center">No images uploaded yet.</Typography>
        )}
      </div>
      <div className="flex flex-row w-full items-center justify-center gap-2">
        <Button
            variant="contained"
            component="label"
            disabled={uploading || disabled}
            color="primary"
            endIcon={<Upload />}
        >
            Add
            <input
            type="file"
            accept="image/*"
            hidden
            onChange={handleImageUpload}
            />
        </Button>
        <Button
            variant="outlined"
            component="label"
            disabled={uploading || disabled}
            color="error"
            onClick={handleRemoveImage}
            className="hover:bg-red-500 hover:text-white"
            endIcon={<Delete />}
        >
            Delete
        </Button>
      </div>
    </div>
  );
}
