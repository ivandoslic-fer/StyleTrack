import React from 'react';
import { Card, CardContent, Typography, IconButton, Box } from '@mui/material';
import { Delete } from '@mui/icons-material';

export default function OutfitCard({ outfit, onDelete }) {
  return (
    <Card
      sx={{
        borderRadius: '15px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        transition: 'transform 0.2s',
        '&:hover': { transform: 'scale(1.05)' },
      }}
    >
      <CardContent>
        <Typography variant="h5" gutterBottom>
          <a href={`/outfits/${outfit.id}`}>{outfit.name}</a>
        </Typography>
        <Box sx={{ marginBottom: '10px' }}>
          <Typography variant="body2" color="textSecondary">
            Weather Preferences:
          </Typography>
          <Typography variant="body2">
            {outfit.forSummer && 'Summer, '}
            {outfit.forWinter && 'Winter, '}
            {outfit.forRain && 'Rain, '}
            {outfit.forAutumnSpring && 'Autumn/Spring, '}
            {outfit.forSnow && 'Snow'}
          </Typography>
        </Box>
        <IconButton
          aria-label="delete"
          onClick={onDelete}
          sx={{ color: 'red' }}
        >
          <Delete />
        </IconButton>
      </CardContent>
    </Card>
  );
}
