import { Container, Box, TextField, Button, Typography, Divider } from '@mui/material';
import { Google, GitHub, HowToReg } from '@mui/icons-material';
import { useState } from 'react';
import { styleTrackAuthProvider } from '../util/styleTrackUtil';

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const success = await styleTrackAuthProvider.signIn(username, password);
      if (success) {
          location.replace("/"); // Redirect to home on successful login
      }
  } catch (error) {
      console.error("Login failed:", error);
  }
  }

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
        <Typography variant="h5" component="h1" gutterBottom align="center">
          Login
        </Typography>

        {/* Username and Password Fields */}
        <TextField
          label="Username"
          variant="outlined"
          fullWidth
          margin="normal"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        <TextField
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
          disabled={true}
          startIcon={<Google />}
          fullWidth
          sx={{ marginBottom: 1 }}
        >
          Sign in with Google
        </Button>
        <Button
          variant="outlined"
          disabled={true}
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
          <a href='/register'>Let&apos;s sign you up!</a>
        </Button>
      </Box>
    </Container>
  );
}
