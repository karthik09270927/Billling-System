import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Grid, Box, InputAdornment, IconButton, Typography, Divider } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import {
  loginCard, loginGrid, loginMaingrid, userNamefield, PasswordField, signIn, BtnSignIn, OrTypo, checkBoxForgotBox
} from '../../src/styles/home.style';
import ButtonComponents from '../centralizedComponents/forms/Button.Component';
import { Inputtextcomponent } from '../centralizedComponents/forms/InputText.Component';
// import { loginUser } from '../utils/api-collections';
import { toast } from 'react-toastify';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import WeatherLoader from '../centralizedComponents/forms/WeatherLoader';
import logo from '../assets/weblogo.png';



export const LoginPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [showPassword, setShowPassword] = useState(false);
  const [formValues, setFormValues] = useState({ userMail: '', password: '' });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showSplash, setShowSplash] = useState(false);
  const navigate = useNavigate();

  const buttonLabel = "Sign in";
  const head = "Log in";
  const subhead1 = "Email address*";
  const subhead2 = "Password*";
  const subhead3 = "Forgot Password?";
  const subhead4 = "Don't have an account?";


  const SplashScreen = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: ${theme.palette.mode === "dark" ? "#333333" : "#ffffff"}; 
  color: ${theme.palette.mode === "dark" ? "#ffffff" : "#333333"};
  text-align: center;
  `;

  if (isLoggedIn) {
    console.log(isLoggedIn);
  }


  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;
    setFormValues({ ...formValues, [id]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // try {
    //   const result = await loginUser(formValues.userMail, formValues.password);
    //   console.log('Login Successful:', result);
    //   toast.success('Login Successful');
    //   // Show splash screen
    //   setShowSplash(true);

    //   // Hide splash screen and navigate after 5 seconds
    //   setTimeout(() => {
    //     setShowSplash(false);
    //     navigate('/Layout');
    //   }, 5000);

    //   setIsLoggedIn(true);
    // } catch (error: any) {
    //   console.error('Login Failed:', error);
    //   toast.error('Login Failed');
    //   setErrorMessage(error || 'Login failed. Please try again.');
    // }
  };

  const handleForgotPasswordClick = () => {
    navigate('/ForgotPassword', { state: { userMail: formValues.userMail } });
  };

  if (showSplash) {
    return (
      <SplashScreen>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 1,
            ease: "easeOut",
            delay: 0.5,
            stiffness: 100,
            damping: 10,
            mass: 1,
          }}
        >
          <Typography
            variant="h2"
            component="div"
            sx={{
              textAlign: 'center',
              mb: 2,
              color: 'linear-gradient(90deg, hsla(59, 86%, 68%, 1) 0%, hsla(134, 36%, 53%, 1) 100%)',
            }}
          >
            Welcome to Weather Dashboard
          </Typography>
        </motion.div>
        <WeatherLoader />
      </SplashScreen>
    );
  }

  return (
    <Box >
      <Grid container sx={loginGrid}>
        {!isMobile && (
          <Grid item xs={12} md={6} sx={{ height: '100vh' }}>
            <Box sx={{ borderRadius: "20px", overflow: "hidden", mt: 2, mx: 2, height: "95%" }}>
              <img src={logo} alt="login" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </Box>

          </Grid>

        )}
        <Grid item xs={12} md={6} sx={loginMaingrid}>
          <Box sx={loginCard}>
            <Typography variant="h5" sx={signIn}>{head}</Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ marginTop: 4 }}>
              {errorMessage && <Typography color="error">{errorMessage}</Typography>}
              <Typography variant="subtitle2" mb={1}>{subhead1}</Typography>
              <Inputtextcomponent
                label=""
                id={'userMail'}
                value={formValues.userMail}
                onChange={handleInputChange}
                type="email"
                sx={userNamefield}
                height="46px"
              />
              <Typography variant="subtitle2" mb={1}>{subhead2}</Typography>
              <Inputtextcomponent
                label=""
                id="password"
                value={formValues.password}
                onChange={handleInputChange}
                type={showPassword ? 'text' : 'password'}
                sx={PasswordField}
                height="46px"
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                }
              />

              <Box sx={checkBoxForgotBox}>
                {/* <FormControlLabel
                  control={<Checkbox />}
                  label="Remember me"
                  sx={loginCheckbox}
                /> */}
                <Link style={{ flex: '2 2 auto', textAlign: 'right', }} to='/ForgotPassword' onClick={handleForgotPasswordClick}>
                  <Typography variant="subtitle2">
                    {subhead3}
                  </Typography>
                </Link>
              </Box>


              <ButtonComponents
                label={buttonLabel}
                onClick={handleSubmit}
                variant="contained"
                size="large"
                sx={BtnSignIn}
              />
              {/* <Box display="flex" alignItems="center" mt={3} mb={3} gap={2}>
                <Divider sx={{ flexGrow: 1 }} />
                <Typography sx={{ ...OrTypo, color: theme.palette.text.primary }}>{subhead4}</Typography>
                <Divider sx={{ flexGrow: 1 }} />
              </Box>
              <ButtonComponents
                label="Sign Up"
                size="large"
                variant="outlined"
                onClick={() => navigate('/Register')}
                sx={{ color: theme.palette.text.primary }}
              /> */}
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};
