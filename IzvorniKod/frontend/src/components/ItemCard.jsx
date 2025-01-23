import { VolunteerActivism } from "@mui/icons-material";
import {
    Card,
    CardContent,
    Typography,
    CardActions,
    Button,
    Box,
    Tooltip,
} from "@mui/material";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

const ItemCard = ({ item }) => {
const { wardrobeId, sectionId } = useParams();

useEffect(() => {
    console.log(item);
    
})
    
return (
    <Card
        className="w-full md:w-[25svw]"
        sx={{
            maxHeight: "50svh",
            margin: "auto",
            display: "flex",
            justifyContent: "between",
            alignItems: "center",
            transition: "transform 0.3s ease, box-shadow 0.3s ease",
            "&:hover": {
            transform: "scale(1.05)",
            boxShadow: 4,
            },
        }}
        >
        <img src={item.galleryImages[0] || "https://via.placeholder.com/200"} alt={item.itemName} className="max-w-[34%]" />
        <div className="flex flex-col w-[66%]">
            <CardContent>
                <Typography variant="h6" component="div">
                {item.itemName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                {item.description || "No description available."}
                </Typography>
                <Box mt={1}>
                <Typography variant="body2" color="text.secondary">
                    <b>Category:</b> {item.category || "N/A"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    <b>Brand:</b> {item.brand || "N/A"}
                </Typography>
                </Box>
            </CardContent>
            <CardActions sx={{
                display: "flex",
                flexGrow: 1,
                width: "100%",
                justifyContent: "end"

            }}>
                {item.forSharing && (
                    <Tooltip title="For Sharing" placement="top" arrow>
                        <VolunteerActivism className="text-green-500" sx={{ mr: 5}}/>
                    </Tooltip>
                )}
                <Button size="small" variant="contained" href={item.itemUrl ? item.itemUrl : `/wardrobes/${wardrobeId}/${sectionId}/item/${item.itemId}`}>
                View Details
                </Button>
            </CardActions>
        </div>
    </Card>
)};

export default ItemCard;