import {
    Box,
    Typography,
    Paper,
    TextField,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    Switch,
  } from "@mui/material";
  import { useEffect, useState } from "react";
  import { useLoaderData } from "react-router-dom";
  import { requestHandler, styleTrackAuthProvider } from "../util/styleTrackUtil";
  import { useSnackbar } from "../context/SnackbarContext";
  
  export default function OutfitPage() {
    const data = useLoaderData();
  
    const { showSnackbar } = useSnackbar();
  
    const [isEditing, setIsEditing] = useState(false);
    const [outfitName, setOutfitName] = useState("");
    const [forRain, setForRain] = useState(false);
    const [forSnow, setForSnow] = useState(false);
    const [forWinter, setForWinter] = useState(false);
    const [forSummer, setForSummer] = useState(false);
    const [forAutumnSpring, setForAutumnSpring] = useState(false);
    const [originalValues, setOriginalValues] = useState({});
    const [page, setPage] = useState(0);
    const [isUsersOutfit, setIsUsersOutfit] = useState(false);
  
    const items = data.items || [];
  
    const showSuccessSnackbar = () => {
      showSnackbar({
        message: "Outfit updated successfully",
        severity: "success",
        duration: 3000,
      });
    };
  
    useEffect(() => {
      setOutfitName(data.name);
      setForRain(data.forRain);
      setForSnow(data.forSnow);
      setForWinter(data.forWinter);
      setForSummer(data.forSummer);
      setForAutumnSpring(data.forAutumnSpring);
  
      const checkOwnership = async () => {
        const currentUser = await styleTrackAuthProvider.getCurrentUser();
        setIsUsersOutfit(currentUser.id === data.userId);
      };
  
      checkOwnership();
    }, [data]);
  
    const handleEditToggle = async () => {
      if (!isEditing) {
        setOriginalValues({
          outfitName,
          forRain,
          forSnow,
          forWinter,
          forSummer,
          forAutumnSpring,
        });
      } else {
        const updatedOutfit = {
          name: outfitName,
          forRain,
          forSnow,
          forWinter,
          forSummer,
          forAutumnSpring,
        };
  
        try {
          const result = await requestHandler.putRequest(`/outfits/${data.id}`, updatedOutfit);
  
          if (result.status === 202) {
            showSuccessSnackbar();
          }
        } catch (error) {
          console.error("Failed to update outfit:", error);
        }
      }
  
      setIsEditing((prev) => !prev);
    };
  
    const handleCancel = () => {
      setOutfitName(originalValues.outfitName);
      setForRain(originalValues.forRain);
      setForSnow(originalValues.forSnow);
      setForWinter(originalValues.forWinter);
      setForSummer(originalValues.forSummer);
      setForAutumnSpring(originalValues.forAutumnSpring);
      setIsEditing(false);
    };
  
    const handleChangePage = (event, newPage) => {
      setPage(newPage);
    };
  
    return (
      <div className="w-full h-full flex flex-col md:flex-row">
        <div className="flex-1 p-4">
          <Paper elevation={3} className="p-6 rounded-lg shadow-md bg-white">
            <Typography variant="h5" sx={{ fontWeight: "bold" }} className="mb-4 text-center">
              Outfit Details
            </Typography>
  
            <Box className="mb-4">
              <Typography variant="body1" className="font-medium">
                <b>ID:</b> {data.id}
              </Typography>
            </Box>
  
            <Box className="mb-4">
              <Typography variant="body1" className="font-medium">
                <b>Name:</b>
              </Typography>
              {isEditing ? (
                <TextField
                  fullWidth
                  value={outfitName}
                  onChange={(e) => setOutfitName(e.target.value)}
                  variant="outlined"
                  className="mt-2"
                />
              ) : (
                <Typography className="mt-2 text-gray-700">{outfitName}</Typography>
              )}
            </Box>
  
            <Box className="mb-4">
              <Typography variant="body1" className="font-medium">
                <b>Weather Preferences:</b>
              </Typography>
              <Box className="flex flex-wrap gap-4 mt-2">
                {[
                  { label: "Rain", value: forRain, setValue: setForRain },
                  { label: "Snow", value: forSnow, setValue: setForSnow },
                  { label: "Winter", value: forWinter, setValue: setForWinter },
                  { label: "Summer", value: forSummer, setValue: setForSummer },
                  { label: "Autumn/Spring", value: forAutumnSpring, setValue: setForAutumnSpring },
                ].map((pref) => (
                  <Box key={pref.label} className="flex items-center gap-2">
                    <Typography>{pref.label}:</Typography>
                    {isEditing ? (
                      <Switch
                        checked={pref.value}
                        onChange={() => pref.setValue((prev) => !prev)}
                        color="primary"
                      />
                    ) : (
                      <Typography>{pref.value ? "Yes" : "No"}</Typography>
                    )}
                  </Box>
                ))}
              </Box>
            </Box>
  
            <Box className="mt-6 flex justify-end gap-4">
              {isEditing && (
                <Button variant="outlined" color="error" onClick={handleCancel}>
                  Cancel
                </Button>
              )}
              {isUsersOutfit && (
                <Button variant="contained" color="primary" onClick={() => {
                  showSnackbar({
                    severity: "warning",
                    message: "Editing of outfits not implemented yet, sorry!",
                    duration: 3000
                  });
                }}>
                  {isEditing ? "Save" : "Edit"}
                </Button>
              )}
            </Box>
          </Paper>
        </div>
        <div className="flex-1 p-4">
          <Paper elevation={3} className="p-4 rounded-lg shadow-md bg-white">
            <Typography variant="h5" sx={{ fontWeight: "bold" }} className="mb-4 text-center">
              Outfit Items
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Item Name</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {items.slice(page * 10, page * 10 + 10).map((item) => (
                    <TableRow key={item.itemId}>
                      <TableCell>{item.itemName}</TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell>
                        <Button
                          variant="outlined"
                          color="primary"
                          onClick={() => location.assign(`/items/${item.itemId}`)}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              component="div"
              count={items.length}
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
  