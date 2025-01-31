import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Grid, Box, InputAdornment, IconButton, Typography, Divider } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import {
  loginCard, loginGrid, loginMaingrid, userNamefield, PasswordField, signIn, BtnSignIn, checkBoxForgotBox
} from '../../src/styles/home.style';
import ButtonComponents from '../centralizedComponents/forms/Button.Component';
import { Inputtextcomponent } from '../centralizedComponents/forms/InputText.Component';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import logo from '../assets/BrandLogo.png';
import { loginUser } from '../utils/api-collection';
import { jwtDecode } from "jwt-decode";
import { MainLoader } from '../centralizedComponents/forms/MainLoader';
import { showErrorToast, showSuccessToast } from '../utils/toast';



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
  const subhead1 = "UseName*";
  const subhead2 = "Password*";
  const subhead3 = "Forgot Password ?";


  const SplashScreen = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: ${theme.palette.mode === "dark" ? "#333333" : "#fbfbe5"}; 
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

    try {
      const result = await loginUser(formValues.userMail, formValues.password);
      console.log('Login Successful:', result);
      showSuccessToast('Login Successfully');

      const { accessToken } = result.data;

      if (accessToken) {

        const decodedToken: { role: string } = jwtDecode(accessToken);
        console.log('Decoded Token:', decodedToken);
        localStorage.setItem('userRole', decodedToken.role);



        setShowSplash(true);
        if (result.data.status === 200) {
          setShowSplash(false);
        }

        setTimeout(() => {
          if (decodedToken.role === 'admin') {
            navigate('/admin-dashboard');
          } else if (decodedToken.role === 'staff') {
            navigate('/staff-dashboard');
          } else {
            showErrorToast('Invalid Role');
          }
        }, 5000);

        setIsLoggedIn(true);
      }
    } catch (error: any) {
      console.error('Login Failed:', error);
      setErrorMessage(error || 'Login failed. Please try again.');
      showErrorToast('Login failed. Please try again.');
    }
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
            Fresh HyperMarket Billing System
          </Typography>
        </motion.div>
        <Typography sx={{ mt: 2 }}>
          <MainLoader />
        </Typography>

      </SplashScreen>
    );
  }

  return (
    <Box>
      <Grid container sx={loginGrid}>
        {!isMobile && (
          <Grid item xs={12} md={6} sx={{ height: '100vh' }}>
            <Box
              sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '100%',
                height: '60px',
                background: '#80bf20',
                color: 'white',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 9999,
              }}
            >
              <motion.div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                  overflow: 'hidden',
                }}
                animate={{
                  x: ['100%', '-100%'],  
                }}
                transition={{
                  duration: 18,    
                  ease: 'linear', 
                  repeat: Infinity,  
                  repeatType: "loop",  
                  delay: 0, 
                  times: [0, 0.5, 1],
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    whiteSpace: 'nowrap',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '18px',
                    textShadow: '0px 0px 10px rgba(255, 255, 255, 0.6)',
                  }}
                >
                  Special Offer: 50% off on all items! Shop Now!
                </Typography>
              </motion.div>


            </Box>

            <Box sx={{ borderRadius: "30px", overflow: "hidden", mt: 2, mx: 2, height: "95%", background: '#ffffff' }}>
              <img src={logo} alt="login"
                style={{
                  width: "100%",
                  height: "90%",
                  objectFit: "cover",
                }} />
            </Box>
          </Grid>

        )}
        <Grid item xs={12} md={6} sx={loginMaingrid} mt={4}>
          <Box sx={loginCard}>
            <Typography variant="h5" sx={signIn}>{head}</Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ marginTop: 4 }}>
              {errorMessage && <Typography color="error">{errorMessage}</Typography>}
              <Typography variant="subtitle1" mb={1}>{subhead1}</Typography>
              <Inputtextcomponent
                label=""
                id={'userMail'}
                value={formValues.userMail}
                onChange={handleInputChange}
                type="text"
                sx={userNamefield}
                height="46px"
              />
              <Typography variant="subtitle1" mb={1}>{subhead2}</Typography>
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
                <Divider sx={{ flexGrow: 2 }} />
                <Link style={{ flex: '2 2 auto', textAlign: 'center', color: theme.palette.text.primary, textDecoration: 'none' }} to='/ForgotPassword' onClick={handleForgotPasswordClick}>
                  <Typography sx={{ '&:hover': { cursor: 'pointer', color: "#63be33" } }}>
                    {subhead3}
                  </Typography>
                </Link>
                <Divider sx={{ flexGrow: 2 }} />
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
