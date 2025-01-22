import { Container, Box, TextField, Button, Typography, Divider } from '@mui/material';
import { Google, GitHub, Login } from '@mui/icons-material';
import { useState } from 'react';
import { styleTrackAuthProvider } from '../util/styleTrackUtil';
import { useSnackbar } from '../context/SnackbarContext';


export default function RegisterPage() {
  const [userType, setUserType] = useState("personal");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confPassword, setConfPassword] = useState("");
  const [displayName, setDislpayName] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [companyWebsite, setCompanyWebsite] = useState("");
  const { showSnackbar } = useSnackbar();

  const handleSignUp = async () => {
    // Validation for empty fields
    if (!email.trim()) {
      showSnackbar({
        severity: "error",
        message: "Email cannot be empty",
        duration: 3000,
      });
      return;
    }

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

    if (password !== confPassword) {
      showSnackbar({
        severity: "error",
        message: "Passwords do not match",
        duration: 3000,
      });
      return;
    }

    if (!displayName.trim()) {
      showSnackbar({
        severity: "error",
        message: `Display Name cannot be empty`,
        duration: 3000,
      });
      return;
    }

    if (userType === "advertiser") {
      if (!companyAddress.trim()) {
        showSnackbar({
          severity: "error",
          message: "Company Address cannot be empty",
          duration: 3000,
        });
        return;
      }

      if (!companyWebsite.trim()) {
        showSnackbar({
          severity: "error",
          message: "Company Website cannot be empty",
          duration: 3000,
        });
        return;
      }
    }

    try {
      let success = null;
      if (userType === 'advertiser') {
        success = await styleTrackAuthProvider.signUp(username, email, password, true, displayName, companyAddress, companyWebsite);
      } else {
        success = await styleTrackAuthProvider.signUp(username, email, password, false, displayName);
      }

      if (success) location.replace("/login");
    } catch (error) {
      console.error("Registration failed:", error);
      showSnackbar({
        severity: "error",
        message: "Registration failed. Please try again.",
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
        paddingTop: '5vh',
        paddingBottom: '5vh'
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
        {/* Toggle Selector */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          {["personal", "advertiser"].map(type => (
            <Typography
              key={type}
              variant="subtitle1"
              onClick={() => setUserType(type)}
              sx={{
                cursor: 'pointer',
                mx: 2,
                position: 'relative',
                fontWeight: userType === type ? 'bold' : 'normal',
                color: userType === type ? 'primary.main' : 'text.secondary',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  bottom: -4,
                  height: 2,
                  backgroundColor: userType === type ? 'primary.main' : 'transparent',
                  transition: 'background-color 0.3s ease',
                },
              }}
            >
              {type === 'personal' ? 'Personal' : 'Advertiser'}
            </Typography>
          ))}
        </Box>

        {/* Common Fields */}
        <TextField
          label="Email"
          variant="outlined"
          type='email'
          id='email-field'
          fullWidth
          margin="normal"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <TextField
          label="Username"
          variant="outlined"
          id='username-field'
          fullWidth
          margin="normal"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          id='password-field'
          fullWidth
          margin="normal"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <TextField
          label="Confirm password"
          type="password"
          variant="outlined"
          id='conf-password-field'
          fullWidth
          margin="normal"
          value={confPassword}
          onChange={e => setConfPassword(e.target.value)}
        />

        <TextField
          label={userType === 'advertiser' ? "Company Name" : "Display Name"}
          variant="outlined"
          fullWidth
          id='display-name-field'
          margin="normal"
          value={displayName}
          onChange={e => setDislpayName(e.target.value)}
        />

        {/* Advertiser-Specific Fields */}
        {userType === "advertiser" && (
          <>
            <TextField
              label="Company Address"
              variant="outlined"
              fullWidth
              margin="normal"
              value={companyAddress}
              onChange={e => setCompanyAddress(e.target.value)}
            />
            <TextField
              label="Company Website"
              variant="outlined"
              fullWidth
              margin="normal"
              value={companyWebsite}
              onChange={e => setCompanyWebsite(e.target.value)}
            />
          </>
        )}

        {/* Register Button */}
        <Button
          variant="contained"
          color="primary"
          id='signup-button'
          fullWidth
          sx={{ marginTop: 2, marginBottom: 2 }}
          onClick={handleSignUp}
        >
          Sign up
        </Button>

        {/* Conditional SSO Buttons */}
        {userType === "personal" && (
          <>
            <Divider sx={{ marginY: 2 }}>OR</Divider>
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
            >
              Sign in with GitHub
            </Button>
          </>
        )}

        <Divider sx={{ marginY: 2 }}>HAVE AN ACCOUNT?</Divider>

        <Button
          variant="outlined"
          startIcon={<Login />}
          fullWidth
        >
          <a href='/login'>Log in</a>
        </Button>
      </Box>
    </Container>
  );
}
