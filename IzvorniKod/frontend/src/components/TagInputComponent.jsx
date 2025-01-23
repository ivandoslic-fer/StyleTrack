import { useState } from "react";
import { TextField, Chip, Box, Autocomplete } from "@mui/material";
import { requestHandler } from "../util/styleTrackUtil";
import { useSnackbar } from "../context/SnackbarContext";

export default function TagInput({ tags, setTags }) {
  const [inputValue, setInputValue] = useState("");
  const [suggestedTags, setSuggestedTags] = useState([]);

  const { showSnackbar } = useSnackbar();

  const fetchTags = async (query) => {
    if (!query) return;
    const response = await requestHandler.getRequest(`/tags/search?query=${query}`);
    setSuggestedTags(response.data || []);
  };

  const handleInputChange = (event, value) => {
    setInputValue(value);
    fetchTags(value);
  };

  const handleKeyDown = async (event) => {
    if (event.key === "Enter" && inputValue.trim() !== "") {
      event.preventDefault(); // Prevent default form submission or behavior
      await handleAddTag(inputValue.trim().toLocaleLowerCase());
    }
  };

  const handleAddTag = async (newTag) => {
    // Check if the tag already exists in the list
    if (tags.includes(newTag)) {
        showSnackbar({
            message: `${newTag} is already in the list`,
            severity: 'warning',
            duration: 2000
        });

        return;
    };

    // If the tag doesn't exist in the database, create it
    const response = await requestHandler.postRequest(`/tags/create/${newTag}`);

    // Add the new tag to the tags list
    setTags((prevTags) => [...prevTags, response.data.tagName || newTag]);
    setInputValue("");
  };

  return (
    <Box>
      <Autocomplete
        freeSolo
        options={suggestedTags}
        value={inputValue}
        onInputChange={handleInputChange}
        onChange={(event, value) => {
            if (value) {
                handleAddTag(value); // Call handleAddTag when an option is selected
            }
        }}
        onKeyDown={handleKeyDown}
        renderInput={(params) => (
          <TextField {...params} label="Add Tags" variant="outlined" />
        )}
      />
      <Box mt={2}>
        {tags.map((tag, index) => (
          <Chip
            key={index}
            label={tag}
            onDelete={() => setTags((prevTags) => prevTags.filter((t) => t !== tag))}
            color="primary"
            style={{ marginRight: 8, marginBottom: 8 }}
          />
        ))}
      </Box>
    </Box>
  );
}
