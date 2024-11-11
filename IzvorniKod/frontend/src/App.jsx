import { RouterProvider } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { router } from './util/styleTrackUtil';
import StyleTrackLayout from './components/layout';

const theme = createTheme({
  palette: {
    primary: {
      main: '#000000', // Set primary color to black
    },
    secondary: {
      main: '#f50057', // Optional: Set a custom secondary color
    },
    background: {
      default: '#f4f4f4', // Optional: Set a default background color
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <StyleTrackLayout>
        <RouterProvider router={router} fallbackElement={<p>Loading...</p>} />
      </StyleTrackLayout>
    </ThemeProvider>
  );
}

export default App;
