import { CssBaseline, ThemeProvider } from '@mui/material';
import './App.css'
import AppRoutes from './routes/Routes';
import { useState } from 'react';
import { darkTheme, lightTheme } from './themes/theme';
// import ThemeSwitcher from '../../Billling-System/src/themes/ThemeSwitcher';
import Toast from './centralizedComponents/forms/Toast';




function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (

    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      {/* <ThemeSwitcher isDarkMode={isDarkMode} toggleTheme={toggleTheme} /> */}
      <Toast />
      <AppRoutes />
    </ThemeProvider>

  )
}

export default App
