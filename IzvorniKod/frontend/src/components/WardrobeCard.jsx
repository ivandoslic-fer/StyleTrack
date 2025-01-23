import React, { useEffect, useState } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  CardActions, 
  Stack 
} from '@mui/material';
import { 
  LocationOn, 
  Visibility,
  VisibilityOff, 
  Delete,
  Description
} from '@mui/icons-material'; 
import { getAddressFromCoordinates } from '../util/styleTrackUtil';

const WardrobeCard = ({ wardrobe, onDelete }) => {
  const [address, setAddress] = useState('');

  useEffect(() => {
    const fetchAddress = async () => {
      if (wardrobe.latitude && wardrobe.longitude) {
        const fetchedAddress = await getAddressFromCoordinates(wardrobe.latitude, wardrobe.longitude);
        setAddress(fetchedAddress);
      }
    };

    fetchAddress();
    console.log(wardrobe)
  }, [wardrobe]);

  return (
    <Card 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        backgroundColor: '#f9f9f9', 
        borderRadius: '20px', 
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)', 
        padding: '20px', 
        width: '100%', 
        maxWidth: '100svw', 
        transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out', 
        "&:hover": { 
          transform: 'translateY(-5px)', 
          boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.2)' 
        } 
      }}
    >
      <Stack direction="row" mb={2} width="100%" justifyContent="space-between">
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 'bold', 
            fontSize: '18px', 
            marginRight: '10px', 
            color: '#333' 
          }}
        >
          {wardrobe.wardrobeName.length > 20 ? `${wardrobe.wardrobeName.substring(0, 20)}...` : wardrobe.wardrobeName}
        </Typography>
        <Delete 
          sx={{ color: 'red', cursor: 'pointer' }} 
          onClick={() => onDelete(wardrobe.wardrobeId)} 
        /> 
      </Stack>

      <Stack direction="row" alignItems="center" mb={1}>
        <LocationOn sx={{ color: 'blue', marginRight: '5px' }} />
        <Typography variant="body2" sx={{ color: '#666' }}>{ address ? address.length > 20 ? `${address.substring(0, 20)}...` : address : 'Loading...'}</Typography>
      </Stack>

      <Stack direction="row" alignItems="center" mb={1}>
        {wardrobe.public ? (
          <Visibility sx={{ color: 'green', marginRight: '5px' }} />
        ) : (
          <VisibilityOff sx={{ color: 'red', marginRight: '5px' }} /> 
        )}
        <Typography variant="body2" sx={{ color: '#666' }}>{wardrobe.public ? 'Public' : 'Private'}</Typography>
      </Stack>

      <Stack direction="row" alignItems="start" mb={1}>
        <Description sx={{ color: 'gray', marginRight: '5px' }} />
        {/* Description */}
        <Typography variant="body2" sx={{ color: '#666', flexGrow: 1 }}>{wardrobe.description.length > 30 ? `${wardrobe.description.substring(0, 30)}...` : wardrobe.description}</Typography> 
      </Stack>

      <CardActions>
        <Button 
          variant="contained" 
          sx={{ 
            backgroundColor: "#007BFF", 
            color: "#fff", 
            textTransform: 'none', 
            fontSize: "14px", 
            fontWeight: 500, 
            borderRadius: "20px", 
            padding: "5px 20px", 
            "&:hover": { 
              backgroundColor: "#0056b3" 
            } 
          }} 
          onClick={() => location.assign(`/wardrobes/${wardrobe.wardrobeId}`)}
        >
          Open
        </Button>
      </CardActions>
    </Card>
  );
};

export default WardrobeCard;