import React from 'react';
import { AppBar, Toolbar, IconButton, Typography, Button, Menu, MenuItem, Box, Avatar } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { getRandomColor, styleTrackAuthProvider } from '../util/styleTrackUtil';

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

  return (
    <AppBar position="static" color="transparent" sx={{ boxShadow: "none" }}>
      <Toolbar sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
        {/* Logo */}
        <Typography variant="h6" component="div" onClick={() => location.replace("/")}>
          <img src="/path/to/logo.png" alt="StyleTrack" style={{ height: '40px' }} />
        </Typography>

        {/* Navigation Buttons for Desktop */}
        {!isMobile && (
          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
            <Button color="inherit"><a href='/'>Home</a></Button>
            <Button color="inherit"><a href='/'>My Wardrobes</a></Button>
            <Button color="inherit"><a href='/'>Search</a></Button>
          </Box>
        )}

        {/* Login Button */}
        {
          !styleTrackAuthProvider.isAuthenticated && <Button color="inherit" sx={{ marginLeft: 'auto' }}><a href='/login'>Login</a></Button> 
        }

        {
          styleTrackAuthProvider.isAuthenticated && !isMobile && (
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
          <MenuItem onClick={handleMenuClose} onMouseUp={() => location.assign("/")}>Home</MenuItem>
          <MenuItem onClick={handleMenuClose} onMouseUp={() => location.assign(`/wardrobes?user=${styleTrackAuthProvider.username}`)}>My Wardrobes</MenuItem>
          <MenuItem onClick={handleMenuClose} onMouseUp={() => location.assign("/")}>Search</MenuItem>
          {styleTrackAuthProvider.isAuthenticated && <MenuItem onClick={handleMenuClose} onMouseUp={() => location.assign("/profile")}>Profile</MenuItem>}
          {styleTrackAuthProvider.isAuthenticated ? <MenuItem onClick={handleMenuClose} onMouseUp={() => styleTrackAuthProvider.logOut()}>Logout</MenuItem> : <MenuItem onClick={handleMenuClose} onMouseUp={() => location.assign("/login")}>Login</MenuItem>}
          
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
