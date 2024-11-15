import { useEffect } from "react";
import { Container, Box, Button, Typography, Divider, Avatar } from '@mui/material';

export default function MxClosets() {
  // Hardkodirani primjeri ormara
  const myClosets = [
    { name: "Wardrobe 1", image: "https://via.placeholder.com/100", parts: { shelves: 3, drawers: 4, clothingRails: 2 }, itemCount: 12 },
    { name: "Wardrobe 2", image: "https://via.placeholder.com/100", parts: { shelves: 5, drawers: 3, clothingRails: 1 }, itemCount: 15 },
    { name: "Wardrobe 3", image: "https://via.placeholder.com/100", parts: { shelves: 4, drawers: 6, clothingRails: 3 }, itemCount: 18 },
    { name: "Wardrobe 4", image: "https://via.placeholder.com/100", parts: { shelves: 2, drawers: 5, clothingRails: 1 }, itemCount: 10 },
    { name: "Wardrobe 5", image: "https://via.placeholder.com/100", parts: { shelves: 4, drawers: 2, clothingRails: 3 }, itemCount: 14 }
  ];

  const handleAddClosetClick = () => window.location.href = "/addcloset";

  const textStyle = {
    fontFamily: 'Roboto, sans-serif',
    fontSize: '20px',
    fontWeight: 500,
    lineHeight: '23.44px',
    textAlign: 'center',
    textUnderlinePosition: 'from-font',
    textDecorationSkipInk: 'none',
    paddingTop: '10px'
  };

  return (
    <Container
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',  
        alignItems: 'center',
        minHeight: '100vh',
        fontFamily: 'Roboto',
        paddingTop: 0,  
        marginTop: 0     
      }}
    >
      <Button
        variant="contained"
        color="primary"
        onClick={handleAddClosetClick}
        sx={{
          borderRadius: '45px',
          padding: '5px 20px',
          textTransform: 'none',
          width: '200px',
          height: '50px',
          border: '1px solid black',
          fontFamily: 'Roboto, sans-serif',
          fontSize: '20px',
          fontWeight: 400,
          lineHeight: '23.44px',
          textAlign: 'center',
          marginBottom: '30px'
        }}
      >
        Create a new closet
      </Button>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',  
          gap: '30px',  
          width: '100%',
          justifyItems: 'center' 
        }}
      >
        {myClosets.map((closet, index) => (
          <Box
            key={index}
            sx={{
              display: 'flex',
              flexDirection: 'row-reverse',  
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#D9D9D9',
              borderRadius: '15px',
              padding: '20px',
              width: '100%',
              maxWidth: '350px', 
              boxSizing: 'border-box'
            }}
          >
            {/* Slika ormara */}
            <Avatar
              alt={closet.name}
              src={closet.image}
              sx={{
                width: 150,
                height: 225,
                borderRadius: '10%',
                border: '1px solid black',
                boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.2)',
                marginLeft: '15px', 
              }}
            />

            {/* Tekst sa informacijama o ormaru */}
            <Box sx={{ display: 'flex', flexDirection: 'column', textAlign: 'left', marginLeft: '20px' }}>
              <Typography variant="h6" sx={textStyle}>{closet.name}</Typography>
              <Divider sx={{ width: '100%', marginBottom: '10px', borderColor: 'black' }} />

              {/* Dinamički prikaz dijelova ormara */}
              <Typography sx={textStyle}>
                {Object.entries(closet.parts).map(([part, count]) => (
                  `${part.charAt(0).toUpperCase() + part.slice(1)}: ${count}`
                )).join('\n')}
              </Typography>

              {/* Broj stavki u ormaru */}
              <Button
                variant="contained"
                sx={{
                  marginTop: '10px',
                  borderRadius: '20px',
                  padding: '5px 20px',
                  textTransform: 'none',
                  fontFamily: 'Roboto, sans-serif',
                  fontSize: '15px',
                  fontWeight: 500,
                  textAlign: 'center',
                }}
              >
                {closet.itemCount} Items
              </Button>
            </Box>
          </Box>
        ))}
      </Box>
    </Container>
  );
}
