import {
  Box,
  Typography,
  Paper,
  TextField,
  Switch,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useLoaderData } from "react-router-dom";
import Minimap from "../components/MiniMap";
import { getAddressFromCoordinates, requestHandler, styleTrackAuthProvider } from "../util/styleTrackUtil";
import { useSnackbar } from "../context/SnackbarContext";

export default function ClosetPage() {
  const data = useLoaderData();

  const { showSnackbar } = useSnackbar();

  const [isPublic, setIsPublic] = useState(false);
  const [editing, setEditing] = useState(false);
  const [wardrobeName, setWardrobeName] = useState("");
  const [wardrobeDescription, setWardrobeDescription] = useState("");
  const [selectedLocation, setSelectedLocation] = useState([0, 0]);
  const [address, setAddress] = useState("");
  const [originalValues, setOriginalValues] = useState({});
  const [page, setPage] = useState(0);
  const [isUsersWardrobe, setIsUsersWardrobe] = useState(false);

  const updateLocation = (lnglat) => {
    setSelectedLocation(lnglat);
  };

  const showSuccessSnackbar = () => {
    showSnackbar({
      message: "Item updated successfully",
      severity: "success",
      duration: 3000
    })
  }

  useEffect(() => {
    setIsPublic(data.public);
    setWardrobeName(data.wardrobeName);
    setWardrobeDescription(data.description);
    if (data.latitude) setSelectedLocation([data.latitude, data.longitude]);
  }, [data]);

  useEffect(() => {
    const fetchAddress = async () => {
      const currentUser = await styleTrackAuthProvider.getCurrentUser()
      setIsUsersWardrobe(currentUser.id == data.ownerId);
      if (data.latitude && data.longitude) {
        const fetchedAddress = await getAddressFromCoordinates(data.latitude, data.longitude);
        setAddress(fetchedAddress);
      }
    };

    fetchAddress();
  }, [data]);

  const handleEditToggle = async () => {
    if (!editing) {
      setOriginalValues({
        isPublic,
        wardrobeName,
        wardrobeDescription,
        selectedLocation,
      });
    } else {
      const updatedWardrobe = {
        wardrobeId: data.wardrobeId, // Ensure we keep the ID
        ownerId: data.ownerId, // Assuming this is part of the initial data
        wardrobeName,
        description: wardrobeDescription,
        public: isPublic,
        latitude: selectedLocation[0],
        longitude: selectedLocation[1],
      };

      try {
        const result = await requestHandler.putRequest(`/wardrobes/${data.wardrobeId}`, updatedWardrobe);

        if (result.status == 202) showSuccessSnackbar();
      } catch (error) {
        console.error(error);
      }
    }

    setEditing((prev) => !prev);
  };

  const handleCancel = () => {
    setIsPublic(originalValues.isPublic);
    setWardrobeName(originalValues.wardrobeName);
    setWardrobeDescription(originalValues.wardrobeDescription);
    setSelectedLocation(originalValues.selectedLocation);
    setEditing(false);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const sections = data.sections || [];

  return (
    <div className="w-full h-full flex flex-col md:flex-row">
      <div className="flex-1 p-4">
        <Paper elevation={3} className="p-6 rounded-lg shadow-md bg-white">
          <Typography variant="h5" sx={{ fontWeight: "bold" }} className="mb-4 text-center font-bold">
            Wardrobe Details
          </Typography>

          <Box className="mb-4">
            <Typography variant="body1" className="font-medium">
              <b>UID:</b> {data.wardrobeId}
            </Typography>
          </Box>

          <Box className="mb-4">
            <Typography variant="body1" className="font-medium" sx={{ fontWeight: "bold" }}>
              Name:
            </Typography>
            {editing ? (
              <TextField
                fullWidth
                placeholder="My Wardrobe"
                value={wardrobeName}
                variant="outlined"
                onChange={(e) => setWardrobeName(e.target.value)}
                className="mt-2"
              />
            ) : (
              <Typography className="mt-2 text-gray-700">{wardrobeName}</Typography>
            )}
          </Box>

          <Box className="mb-4">
            <Typography variant="body1" className="font-medium" sx={{ fontWeight: "bold" }}>
              Description:
            </Typography>
            {editing ? (
              <TextField
                fullWidth
                multiline
                rows={3}
                placeholder="Description of the wardrobe"
                value={wardrobeDescription}
                variant="outlined"
                onChange={(e) => setWardrobeDescription(e.target.value)}
                className="mt-2"
              />
            ) : (
              <Typography className="mt-2 text-gray-700">{wardrobeDescription}</Typography>
            )}
          </Box>

          <Box className="flex items-center mb-6">
            <Typography variant="body1" className="font-medium" sx={{ fontWeight: "bold" }}>
              Public:
            </Typography>
            {editing ? (
              <Switch
                checked={isPublic}
                onChange={() => setIsPublic((prev) => !prev)}
                color="primary"
                inputProps={{ "aria-label": "toggle public or private" }}
              />
            ) : (
              <Typography className="ml-2 text-gray-700" sx={{ ml: 1 }}>
                {isPublic ? "Yes" : "No"}
              </Typography>
            )}
          </Box>
          {data.latitude && (
          <>
            <Typography variant="body1" className="font-medium">
              <b>Location:</b> {editing ? "" : address ? address : "Loading..."}
            </Typography>
          
            <Box className="h-64 bg-gray-200 rounded-md flex items-center justify-center mt-4">
              <Minimap
                selectedLocation={selectedLocation}
                onSelectedLocationChange={updateLocation}
                displayOnly={!editing}
              />
            </Box>
          </>
          )}

          <Box className="mt-6 flex justify-end gap-4">
            {editing && (
              <Button variant="outlined" color="error" onClick={handleCancel} className="hover:bg-red-500 hover:text-white">
                Cancel
              </Button>
            )}
            {isUsersWardrobe && (
              <Button variant="contained" color="primary" onClick={handleEditToggle}>
                {editing ? "Save" : "Edit"}
              </Button>
            )}
          </Box>
        </Paper>
      </div>
      <div className="flex-1 p-4">
        <Paper elevation={3} className="p-4 rounded-lg shadow-md bg-white">
          <Typography variant="h5" sx={{ fontWeight: "bold" }} className="mb-4 text-center">
            Wardrobe Sections
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Section Name</TableCell>
                  <TableCell>Section Type</TableCell>
                  <TableCell>Capacity</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {/* Create New Section Row */}
                {/* Render Sections */}
                {sections
                  .slice(page * 10, page * 10 + 10)
                  .map((section) => (
                    <TableRow key={section.sectionId}>
                      <TableCell>{section.sectionName}</TableCell>
                      <TableCell>{section.sectionType}</TableCell>
                      <TableCell>{section.sectionCapacity}</TableCell>
                      <TableCell>
                        <Button
                          variant="outlined"
                          color="primary"
                          onClick={() =>
                            location.assign(`/wardrobes/${section.wardrobeId}/${section.sectionId}`)
                          }
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {isUsersWardrobe && (
                    <TableRow>
                      <TableCell colSpan={4}>
                        <Button
                          variant="contained"
                          color="primary"
                          fullWidth
                          onClick={() => location.assign(`/wardrobes/${data.wardrobeId}/addSection`)}
                        >
                          Create New Section
                        </Button>
                      </TableCell>
                    </TableRow>
                  )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={sections.length}
            rowsPerPage={10}
            rowsPerPageOptions={[10]}
            page={page}
            onPageChange={handleChangePage}
          />
        </Paper>
      </div>
    </div>
  );
}
