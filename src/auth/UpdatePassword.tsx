import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, InputAdornment, IconButton, Grid } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Inputtextcomponent } from '../centralizedComponents/forms/InputText.Component';
import ButtonComponents from '../centralizedComponents/forms/Button.Component';
import { BtnSignIn, loginGrid, loginMaingrid, userNamefield } from '../../src/styles/home.style';
// import { updatePassword } from '../utils/api-collections';
import { toast } from 'react-toastify';
import logo from '../assets/weblogo.png';
import BackArrowIconButton from '../centralizedComponents/forms/ArroeBackIconButton.Component';



const UpdatePassword: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [showPassword, setShowPassword] = useState(false);
  const [formValues, setFormValues] = useState({ newPassword: '', confirmPassword: '' });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [email, setEmail] = useState<string>('');

  const navigate = useNavigate();

  useEffect(() => {
    const storedEmail = localStorage.getItem('userEmail');
    if (storedEmail) setEmail(storedEmail);
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;
    setFormValues({ ...formValues, [id]: value });
  };

  if (email) {
    console.log(email);
  }

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleUpdatePassword = async () => {
    if (formValues.newPassword !== formValues.confirmPassword) {
      setErrorMessage('Passwords do not match');
      toast.error('Passwords do not match');
      return;
    }

    setErrorMessage(null);
    setSuccessMessage(null);

    // try {
    //   const email = localStorage.getItem('userEmail');
    //   if (!email) {
    //     setErrorMessage('Email not found. Please try again.');
    //     toast.error('Email not found. Please try again.');
    //     return;
    //   }

    //   await updatePassword(email, formValues.newPassword);
    //   toast.success('Password updated successfully');
    //   localStorage.removeItem('userEmail');
    //   setTimeout(() => navigate('/'), 2000);
    // } catch (error: any) {
    //   toast.error('Failed to update password. Please try again.');
    //   setErrorMessage(error || 'Failed to update password. Please try again.');
    // }
  };


  return (
    <Box>
      <Grid container sx={loginGrid}>
        {!isMobile && (
          <Grid item xs={12} md={6} sx={{ height: '100vh' }}>
            <Box sx={{ borderRadius: "20px", overflow: "hidden", mt: 2, mx: 2, height: "95%", boxShadow: '4px 4px 6px 6px rgba(0, 0, 0, 0.1)' }}>
              <img src={logo} alt="login" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </Box>
          </Grid>
        )}

        <Grid item xs={12} md={6} sx={loginMaingrid} mt={4}>
          <Box component="form" sx={{ textAlign: 'center', p: 4 }}>
            <IconButton onClick={() => navigate("/")}>
              <BackArrowIconButton onClick={() => { }} />
            </IconButton>
            <Typography variant="h5" mb={1}>
              Update Password
            </Typography>
            <Box component="form" onSubmit={(e) => e.preventDefault()} sx={{ marginTop: 4 }}>
              <Typography variant="subtitle2" mb={1}>
                New Password*
              </Typography>
              <Inputtextcomponent
                id="newPassword"
                label=""
                type={showPassword ? 'text' : 'password'}
                value={formValues.newPassword}
                onChange={handleInputChange}
                sx={userNamefield}
                height="46px"
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton onClick={handleTogglePasswordVisibility}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
              />
              <Typography variant="subtitle2" mb={1}>
                Confirm Password*
              </Typography>
              <Inputtextcomponent
                id="confirmPassword"
                label=""
                type={showPassword ? 'text' : 'password'}
                value={formValues.confirmPassword}
                onChange={handleInputChange}
                sx={userNamefield}
                height="46px"
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton onClick={handleTogglePasswordVisibility}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
              />
              <ButtonComponents
                variant="contained"
                onClick={handleUpdatePassword}
                size="large"
                label="Update Password"
                sx={BtnSignIn}
              />

              {errorMessage && (
                <Typography color="error" mt={2}>
                  {errorMessage}
                </Typography>
              )}
              {successMessage && (
                <Typography color="primary" mt={2}>
                  {successMessage}
                </Typography>
              )}
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default UpdatePassword;
