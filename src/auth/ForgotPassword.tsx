import React, { useState, useEffect } from 'react';
import { Box, Grid, IconButton, Typography } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { Inputtextcomponent } from '../centralizedComponents/forms/InputText.Component';
import ButtonComponents from '../centralizedComponents/forms/Button.Component';
import { forgotPasswordHeading, loginGrid, PasswordField, userNamefield, loginMaingrid, BtnSignIn } from '../../src/styles/home.style';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/system';
import { toast } from 'react-toastify';
import logo from '../assets/BrandLogo.png';
import BackArrowIconButton from '../centralizedComponents/forms/ArroeBackIconButton.Component';
import { forgotPassword, verifyOTP } from '../utils/api-collection';


const ForgotPassword: React.FC = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const location = useLocation();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [formValues, setFormValues] = useState({ userMail: '', otp: '' });
    const [isOTPVisible, setIsOTPVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);


    useEffect(() => {
        if (location.state?.userMail) {
            setFormValues({ ...formValues, userMail: location.state.userMail });
        }
    }, [location.state]);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = event.target;
        setFormValues({ ...formValues, [id]: value });
    };

    const handleSendOTP = async () => {
        setErrorMessage(null);
        setSuccessMessage(null);

        console.log('Email sent to forgotPassword API:', formValues.userMail);

        try {
            await forgotPassword(formValues.userMail);
            setSuccessMessage('OTP has been sent to your email address.');
            setIsOTPVisible(true);
            toast.success('OTP sent to your email');
        } catch (error: any) {
            console.error('Error sending OTP:', error);
            toast.error('Failed to send OTP. Please try again.');
        }
    };

    const handleSubmitOTP = async () => {
        setErrorMessage(null);
        setSuccessMessage(null);

        try {
            console.log("Submitting OTP with payload:", { userMail: formValues.userMail, otp: formValues.otp });
            await verifyOTP(formValues.userMail, formValues.otp);
            toast.success("OTP verified successfully");
            localStorage.setItem("userEmail", formValues.userMail);
            toast.success("OTP verified. Redirecting...");
            navigate("/UpdatePassword");
        } catch (error: any) {
            console.error("Error verifying OTP:", error.response?.data || error);
            const serverError = error.response?.data;
            setErrorMessage(serverError?.message || "Invalid OTP. Please try again.");
            toast.error("Invalid OTP. Please try again.");
        }
    };

    const handleClick = () => {
        navigate('/');
    }

    return (
        <Box>
            <Grid container sx={loginGrid}>
                {!isMobile && (
                    <Grid item xs={12} md={6} sx={{ height: '100vh' }}>
                        <Box sx={{ borderRadius: "20px", overflow: "hidden", mt: 2, mx: 2, height: "95%", boxShadow: '4px 4px 6px 6px rgba(0, 0, 0, 0.1)', background: '#ffffff' }}>
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
                    <Box component="form" onSubmit={(e) => e.preventDefault()} sx={{ textAlign: 'center', p: 4 }}>
                        <IconButton onClick={handleClick}>
                            <BackArrowIconButton onClick={() => { }} />
                        </IconButton>
                        <Typography variant="h5" sx={forgotPasswordHeading}>
                            Forgot Password
                        </Typography>
                        <Box component="form" onSubmit={(e) => e.preventDefault()} sx={{ marginTop: 4 }}>
                            <Typography variant="subtitle2" mb={1}>
                                Enter your email address
                            </Typography>
                            <Inputtextcomponent
                                label="Email"
                                id="userMail"
                                value={formValues.userMail}
                                onChange={handleInputChange}
                                type="email"
                                sx={userNamefield}
                                height="46px"
                            />

                            {isOTPVisible && (
                                <>
                                    <Typography variant="subtitle2" mb={1}>
                                        Enter OTP sent to your email
                                    </Typography>
                                    <Inputtextcomponent
                                        label="OTP"
                                        id="otp"
                                        value={formValues.otp}
                                        onChange={handleInputChange}
                                        type="number"
                                        sx={PasswordField}
                                        height="46px"
                                    />
                                </>
                            )}

                            <ButtonComponents
                                label={isOTPVisible ? 'Submit OTP' : 'Send OTP'}
                                onClick={isOTPVisible ? handleSubmitOTP : handleSendOTP}
                                variant="contained"
                                size="large"
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

export default ForgotPassword;
