import { createContext, useContext, useState } from "react";
import { Snackbar, Alert } from "@mui/material";

// Define the context
const SnackbarContext = createContext();

// Custom hook to use the Snackbar context
export const useSnackbar = () => useContext(SnackbarContext);

// Snackbar Provider Component
export const SnackbarProvider = ({ children }) => {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info", // info | success | warning | error
    duration: 3000, // Default duration
    action: null, // Optional action button
  });

  const showSnackbar = (options) => {
    setSnackbar({ ...snackbar, ...options, open: true });
  };

  const closeSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <SnackbarContext.Provider value={{ showSnackbar, closeSnackbar }}>
      {children}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={snackbar.duration}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
            onClose={closeSnackbar}
            severity={snackbar.severity}
            variant="filled"
            action={snackbar.action}
            sx={{ width: "100%" }}
        >
            {snackbar.message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
};
