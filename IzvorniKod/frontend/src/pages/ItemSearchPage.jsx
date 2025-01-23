import { useEffect, useState } from "react";
import {
  Container,
  TextField,
  Button,
  Box,
  Typography,
  Switch,
  MenuItem,
} from "@mui/material";
import { useSearchParams } from "react-router-dom";
import { requestHandler } from "../util/styleTrackUtil";
import ItemGrid from "../components/ItemGrid";
import { useSnackbar } from "../context/SnackbarContext";

const ItemSearchPage = () => {
    const { showSnackbar } = useSnackbar();
  const [filters, setFilters] = useState({
    itemName: "",
    description: "",
    seasonCategory: "",
    brand: "",
    category: "",
    fabric: "",
    size: "",
    longSleeved: false,
    shoeSize: "",
    openFoot: false,
    tags: "",
  });

  const [items, setItems] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();

  const seasonCategories = [
    "Spring",
    "Summer",
    "Autumn",
    "Winter",
    "Spring/Summer",
    "Autumn/Winter",
    "All Seasons",
  ];

  const categories = [
    { value: "CLOTHES", label: "Clothes" },
    { value: "FOOTWEAR", label: "Footwear" },
    { value: "", label: "No category" },
  ];

  useEffect(() => {
    // Parse the initial filters from the URL only once
    const initialFilters = {};
    searchParams.forEach((value, key) => {
      if (value === "true" || value === "false") {
        initialFilters[key] = value === "true"; // Convert to boolean for switches
      } else {
        initialFilters[key] = value;
      }
    });
  
    setFilters((prev) => ({ ...prev, ...initialFilters }));
  
    // Prevent multiple history entries by checking if filters are already set
    if (Object.keys(initialFilters).length > 0 && !items.length) {
      handleSearch(initialFilters); // Automatically fetch with initial filters
    } else if (!items.length) {
      fetchAllItems(); // Fetch all items if no filters are provided
    }

    showSnackbar({
        message: "New and better search coming soon",
        severity: "info",
        duration: 3000
    });
  }, []); // Empty dependency array ensures this runs only once  

  const fetchAllItems = async () => {
    const response = await requestHandler.getRequest(`/items/search`);
    setItems(response.data || []);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (e) => {
    const { name, checked } = e.target;
    setFilters((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSearch = async (overrideFilters = filters) => {
    const query = Object.entries(overrideFilters)
      .filter(([_, value]) => value !== "" && value !== null)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join("&");

    const response = await requestHandler.getRequest(`/items/search?${query}`);
    setItems(response.data || []);
  };

  const handleClearFilters = () => {
    setFilters({
      itemName: "",
      description: "",
      seasonCategory: "",
      brand: "",
      category: "",
      fabric: "",
      size: "",
      longSleeved: false,
      shoeSize: "",
      openFoot: false,
      tags: "",
    });
    setSearchParams({}); // Clear URL parameters
    fetchAllItems(); // Fetch all items without filters
  };

  return (
    <Container>
      <Typography variant="h4" sx={{ marginBottom: 4 }}>
        Search Items
      </Typography>

      <Box
        component="form"
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr", // Single column for small screens
            sm: "1fr 1fr", // Two columns for medium screens
            md: "1fr 1fr 1fr", // Three columns for large screens
          },
          gap: 2,
          marginBottom: 4,
        }}
        noValidate
        autoComplete="off"
      >
        <TextField
          name="itemName"
          label="Item Name"
          value={filters.itemName}
          onChange={handleInputChange}
          variant="outlined"
        />
        <TextField
          name="description"
          label="Description"
          value={filters.description}
          onChange={handleInputChange}
          variant="outlined"
        />
        <TextField
          name="seasonCategory"
          label="Season Category"
          value={filters.seasonCategory}
          onChange={handleInputChange}
          variant="outlined"
          select
        >
          {seasonCategories.map((season) => (
            <MenuItem key={season} value={season}>
              {season}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          name="brand"
          label="Brand"
          value={filters.brand}
          onChange={handleInputChange}
          variant="outlined"
        />
        <TextField
          name="category"
          label="Category"
          value={filters.category}
          onChange={handleInputChange}
          variant="outlined"
          select
        >
          {categories.map((cat) => (
            <MenuItem key={cat.value} value={cat.value}>
              {cat.label}
            </MenuItem>
          ))}
        </TextField>
        {filters.category === "CLOTHES" && (
          <>
            <TextField
              name="fabric"
              label="Fabric"
              value={filters.fabric}
              onChange={handleInputChange}
              variant="outlined"
            />
            <TextField
              name="size"
              label="Size"
              value={filters.size}
              onChange={handleInputChange}
              variant="outlined"
            />
            <Box display="flex" alignItems="center">
              <Typography>Long Sleeved</Typography>
              <Switch
                name="longSleeved"
                checked={filters.longSleeved}
                onChange={handleSwitchChange}
              />
            </Box>
          </>
        )}
        {filters.category === "FOOTWEAR" && (
          <>
            <TextField
              name="shoeSize"
              label="Shoe Size"
              value={filters.shoeSize}
              onChange={handleInputChange}
              variant="outlined"
            />
            <Box display="flex" alignItems="center">
              <Typography>Open Foot</Typography>
              <Switch
                name="openFoot"
                checked={filters.openFoot}
                onChange={handleSwitchChange}
              />
            </Box>
          </>
        )}
        <TextField
          name="tags"
          label="Tags (comma-separated)"
          value={filters.tags}
          onChange={handleInputChange}
          variant="outlined"
        />
      </Box>

      <Box sx={{ display: "flex", gap: 2, marginBottom: 4 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleSearch()}
        >
          Search
        </Button>
        <Button variant="outlined" color="error" onClick={handleClearFilters} className="hover:bg-red-500 hover:text-white">
          Clear Filters
        </Button>
      </Box>

      {items.length > 0 ? (
        <ItemGrid items={items} />
      ) : (
        <Typography>No items found.</Typography>
      )}
    </Container>
  );
};

export default ItemSearchPage;
