import { Container, Box, TextField, Button, Typography, Divider } from '@mui/material';
import { Google, GitHub, HowToReg } from '@mui/icons-material';
import { useState } from 'react';
import { styleTrackAuthProvider } from '../util/styleTrackUtil';
import { useSnackbar } from '../context/SnackbarContext';

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { showSnackbar } = useSnackbar();

  const handleLogin = async () => {
    // Validation for empty fields
    if (!username.trim()) {
      showSnackbar({
        severity: "error",
        message: "Username cannot be empty",
        duration: 3000,
      });
      return;
    }

    if (!password.trim()) {
      showSnackbar({
        severity: "error",
        message: "Password cannot be empty",
        duration: 3000,
      });
      return;
    }

    try {
      const success = await styleTrackAuthProvider.signIn(username, password);
      if (success) {
        location.replace("/"); // Redirect to home on successful login
      }
    } catch (error) {
      console.error("Login failed:", error);
      showSnackbar({
        severity: "error",
        message: "Login failed. Please check your credentials.",
        duration: 3000,
      });
    }
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
      }}
    >
      <Box
        sx={{
          padding: 4,
          borderRadius: 2,
          boxShadow: 3,
          backgroundColor: 'white',
          width: '100%',
          maxWidth: 400,
        }}
      >
        {/* Page Title */}
        <Typography id='login-header' variant="h5" component="h1" gutterBottom align="center">
          Login
        </Typography>

        {/* Username and Password Fields */}
        <TextField
          id='user-name'
          label="Username"
          variant="outlined"
          fullWidth
          margin="normal"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        <TextField
          id="password"
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        {/* Login Button */}
        <Button
          id='login-button'
          variant="contained"
          color="primary"
          fullWidth
          sx={{ marginTop: 2, marginBottom: 2 }}
          onClick={handleLogin}
        >
          Login
        </Button>

        {/* Divider */}
        <Divider sx={{ marginY: 2 }}>OR</Divider>

        {/* SSO Buttons */}
        <Button
          variant="outlined"
          startIcon={<Google />}
          fullWidth
          sx={{ marginBottom: 1 }}
          onClick={() => {
            styleTrackAuthProvider.googleLogin();
          }}
        >
          Sign in with Google
        </Button>
        <Button
          variant="outlined"
          startIcon={<GitHub />}
          sx={{ marginBottom: 1 }}
          fullWidth
          onClick={() => {
            styleTrackAuthProvider.githubLogin();
          }}
        >
          Sign in with GitHub
        </Button>

        <Divider sx={{ marginY: 2 }}>NEW HERE?</Divider>

        <Button
          variant="outlined"
          startIcon={<HowToReg />}
          fullWidth
        >
          <a id='goto-register' href='/register'>Let&apos;s sign you up!</a>
        </Button>
      </Box>
    </Container>
  );
}
