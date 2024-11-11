import React from 'react';
import { AppBar, Toolbar, IconButton, Typography, Button, Menu, MenuItem, Box, Avatar } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { styleTrackAuthProvider } from '../util/styleTrackUtil';

export default function ResponsiveAppBar() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // State for managing the mobile menu
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    styleTrackAuthProvider.logOut();
    location.replace("/");
  }

  const getRandomColor = () => {
    // Define an array of background colors
    const colors = ["#FF5733", "#33FF57", "#3357FF", "#FF33A5", "#FFC300", "#DAF7A6", "#900C3F", "#581845"];
    // Pick a random color from the array
    return colors[Math.floor(Math.random() * colors.length)];
  }

  return (
    <AppBar position="static" color="transparent" sx={{ boxShadow: "none" }}>
      <Toolbar sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
        {/* Logo */}
        <Typography variant="h6" component="div" sx={{ }}>
          <img src="/path/to/logo.png" alt="StyleTrack" style={{ height: '40px' }} />
        </Typography>

        {/* Navigation Buttons for Desktop */}
        {!isMobile && (
          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
            <Button color="inherit"><a href='/'>Home</a></Button>
          </Box>
        )}

        {/* Login Button */}
        {
          !styleTrackAuthProvider.isAuthenticated && <Button color="inherit" sx={{ marginLeft: 'auto' }}><a href='/login'>Login</a></Button> 
        }

        {
          styleTrackAuthProvider.isAuthenticated && (
            <div className='flex flex-row'>
              {
              styleTrackAuthProvider.username && 
              <div onClick={() => {location.replace("/profile")}} className='cursor-pointer'>
                <Avatar alt={styleTrackAuthProvider.username.toUpperCase()} sx={{ backgroundColor: getRandomColor() }} src={styleTrackAuthProvider.profilePic || "/"}/>
              </div>  
              }
              <Button color="inherit" sx={{ marginLeft: '10px' }} onClick={handleLogout}>Logout</Button>
            </div>
          )
        }

        {/* Menu Icon for Mobile */}
        {isMobile && (
          <IconButton edge="end" color="inherit" aria-label="menu" onClick={handleMenuOpen}>
            <MenuIcon />
          </IconButton>
        )}

        {/* Mobile Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <MenuItem onClick={handleMenuClose}>Home</MenuItem>
          <MenuItem onClick={handleMenuClose}>About</MenuItem>
          <MenuItem onClick={handleMenuClose}>Services</MenuItem>
          <MenuItem onClick={handleMenuClose}>Contact</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
