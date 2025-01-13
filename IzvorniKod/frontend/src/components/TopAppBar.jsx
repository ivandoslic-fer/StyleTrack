import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, IconButton, Typography, Button, Menu, MenuItem, Box, Avatar } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { getRandomColor, styleTrackAuthProvider } from '../util/styleTrackUtil';
import logo from '../assets/logov1.png';

export default function ResponsiveAppBar() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // State for managing the mobile menu
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (styleTrackAuthProvider.isAuthenticated) {
        try {
          const result = await styleTrackAuthProvider.getCurrentUser();
          if (result) setUser(result);
        } catch (error) {
          console.error("Failed to fetch user:", error);
        }
      }
    };
  
    fetchUser();
  }, []);

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
        <Typography variant="h6" component="div" onClick={() => location.replace("/")} className='cursor-pointer'>
          <div className="flex flex-row justify-center items-center flex-1">
            <img src={logo} alt="StyleTrack" style={{ height: '40px' }} />
            <h6 className='ml-4'>StyleTrack</h6>
          </div>
        </Typography>

        {/* Navigation Buttons for Desktop */}
        {!isMobile && (
          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', flex: 10}}>
            <Button color="inherit"><a href='/'>Home</a></Button>
            { user && <Button id='my-wardrobes-button' color="inherit" onClick={() => location.assign(`/wardrobes?user=${user.username}`)}>My Wardrobes</Button> }
            <Button color="inherit"><a href='/search/items'>Search</a></Button>
          </Box>
        )}

        {/* Login Button */}
        {
          !styleTrackAuthProvider.isAuthenticated && <Button color="inherit" sx={{ marginLeft: 'auto' }}><a id='goto-login' href='/login'>Login</a></Button> 
        }

        {
          styleTrackAuthProvider.isAuthenticated && !isMobile && (
            <div className='flex flex-row flex-1'>
              {
              user &&
              user.username && 
              <div onClick={() => {location.replace("/profile")}} className='cursor-pointer'>
                <Avatar alt={user.username.toUpperCase()} sx={{ backgroundColor: getRandomColor() }} src={user.profilePictureUrl || "/"}/>
              </div>  
              }
              <Button id='logout-button' color="inherit" sx={{ marginLeft: '10px' }} onClick={handleLogout}>Logout</Button>
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
          {user && <MenuItem onClick={handleMenuClose} onMouseUp={() => location.assign(`/wardrobes?user=${user.username}`)}>My Wardrobes</MenuItem>}
          <MenuItem onClick={handleMenuClose} onMouseUp={() => location.assign("/search/items")}>Search</MenuItem>
          {styleTrackAuthProvider.isAuthenticated && <MenuItem onClick={handleMenuClose} onMouseUp={() => location.assign("/profile")}>Profile</MenuItem>}
          {styleTrackAuthProvider.isAuthenticated ? <MenuItem onClick={handleMenuClose} onMouseUp={() => styleTrackAuthProvider.logOut()}>Logout</MenuItem> : <MenuItem onClick={handleMenuClose} onMouseUp={() => location.assign("/login")}>Login</MenuItem>}
          
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
