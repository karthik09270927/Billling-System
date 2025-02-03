import React, { useRef, useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  Dialog,
  DialogContent,
  CircularProgress,
  styled,
  InputAdornment,
  DialogTitle
} from '@mui/material';
import PhonepeIcon from '../assets/cards/PhonePe.png';
import UPIIcon from '../assets/cards/upi.png';
import EmailIcon from '@mui/icons-material/Email';
import { Html5QrcodeScanner } from "html5-qrcode";
import KeyIcon from '@mui/icons-material/Key';
import { generateQRCode, sendOTPMail, verifyCardOtp } from '../utils/api-collection';
import { toast } from 'react-toastify';
import success from '../assets/sounds/success.mp3';
import errorsound from '../assets/sounds/error.mp3';
import { showErrorToast, showSuccessToast } from '../utils/toast';
import { useNavigate } from 'react-router-dom';
import PaymentSuccess from '../assets/sounds/paytm_payment_tune.mp3';

interface UPIPaymentProps {
  amount: number;
  email: any;
  onSubmit: () => Promise<void>;
  onClose?: () => void;
}

const StyledTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'white',
    borderRadius: 8,
  }
});

const StyledInput = styled(TextField)(({ error }) => ({
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'white',
    borderRadius: 8,
    '& fieldset': {
      borderColor: error ? '#d32f2f' : '#e0e0e0',
    },
    '&:hover fieldset': {
      borderColor: error ? '#d32f2f' : '#74D52B',
    },
    '&.Mui-focused fieldset': {
      borderColor: error ? '#d32f2f' : '#74D52B',
    }
  }
}));

const UPIPayment: React.FC<UPIPaymentProps> = ({ amount, onSubmit, email, onClose }) => {
  const [paymentOption, setPaymentOption] = useState('');
  const [upiId, setUpiId] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPhonePeDialog, setShowPhonePeDialog] = useState(false);
  const [emails, setEmail] = useState('');
  const [showOtpField, setShowOtpField] = useState(false);
  const [otp, setOtp] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isQrScannerOpen, setIsQrScannerOpen] = useState(false);
  const scannerRef = useRef<any>(null);
  const [apiCalled, setApiCalled] = useState(false);
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(true);
  const [showOtp, setShowOtp] = useState(false);
  const navigate = useNavigate();
  const [errors, setErrors] = useState({
    otp: ''
  });





  const initializeScanner = () => {
    scannerRef.current = new Html5QrcodeScanner("qr-reader", {
      fps: 10,
      qrbox: 350,
    }, false);
    scannerRef.current.render(onScanSuccess, onScanError);
  };

  const handleQrIconClick = async () => {
    setIsQrScannerOpen(true);
    setShowOtp(true);
    setTimeout(() => {
      initializeScanner();
    }, 100);
  };

  // const onScanSuccess = (decodedText: string) => {
  //   console.log("QR Code scanned: ", decodedText);
  //   const qrResponse = JSON.parse(decodedText);
  //   const email = qrResponse.Email;
  //   const amount = qrResponse.amount;

  //   // Call the "Email send OTP" API with the scanned email
  //   sendOTPMail(email).then((response) => {
  //     console.log('OTP sent to email:', response);
  //     toast.success('OTP sent to email');
  //     // Handle the response as needed
  //   }).catch((error) => {
  //     console.error('Error sending OTP:', error);
  //     toast.error('Error sending OTP');
  //     // Handle error (e.g., show a toast notification)
  //   });

  //   setIsQrScannerOpen(false); // Close the scanner after successful scan
  // };

  const onScanSuccess = (decodedText: string) => {
    // Parse the QR code response data as JSON  
    scannerRef.current.clear();
    setIsQrScannerOpen(false);

    // Extract the email address from the QR code response data
    const email = decodedText.split(":")[1].split(",")[0].trim();
    if (!apiCalled) {
      // Call the "sendOTPMail" API only once
      sendOTPMail(email).then(() => {
        // Set the flag to true
        setApiCalled(true);

        // Play a success sound
        const successSound = new Audio(success);
        successSound.play();

        // Display a success toast message
        showSuccessToast('QR code scanned successfully!');
      });
    }
  };

  const onScanError = (error: any) => {
    const errorSound = new Audio(errorsound);
    errorSound.play();
    toast.error('Error scanning QR code: ' + error.message);
  };

  // const handleOtpChange = (event: any) => {
  //   const value = event.target.value.replace(/\D/g, ''); // Remove non-digit characters
  //   setOtp(value);
  //   setIsButtonEnabled(value.length === 4);
  // };

  // const handleCloseScanner = () => {
  //   setIsScannerOpen(false);
  // };

  // const handleScanSuccess = () => {
  //   handleCloseScanner();
  // };


  const handleOtpSubmit = async () => {
    if (otp.length === 4) {
      setIsLoading(true);
      try {
        await verifyCardOtp({
          enteredOtp: otp,
          email: email + '@coherent.in'
        });

        const Paymentsuccess = new Audio(PaymentSuccess);
        Paymentsuccess.play();
        await onSubmit();

        showSuccessToast('Payment successful');
        setOtp('');
        setShowOtp(false);

        onClose?.();

        // Navigate to staff dashboard
        setTimeout(() => {
          navigate('/staff-dashboard');
        }, 1500);
      } catch (error: any) {
        showErrorToast(error.message || 'Invalid OTP');
      } finally {
        setIsLoading(false);
        setShowOtp(false);
        setOtp('');
      }
    }
  };

  const handlePhonePeClick = async () => {
    try {
      const QR = { email: email + '@coherent.in', billAmount: amount };
      const response = await generateQRCode(QR);
      console.log('QR Code generated:', response.data);
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 3, textAlign: 'center' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          UPI: Choose an Option
        </Typography>
      </Box>

      <Select
        value={paymentOption}
        onChange={(e) => setPaymentOption(e.target.value)}
        fullWidth
        displayEmpty
        sx={{
          mb: 3,
          '& .MuiSelect-select.MuiSelect-select': {
            color: paymentOption ? 'inherit' : 'text.secondary',
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          }
        }}
      >
        <MenuItem value="" disabled>
          <em>Select Payment Option</em>
        </MenuItem>
        <MenuItem value="phonepe" sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            component="img"
            src={PhonepeIcon}
            alt="PhonePe"
            sx={{ width: 24, height: 24 }}
          />
          PhonePe
        </MenuItem>
        <MenuItem value="upi" sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            component="img"
            src={UPIIcon}
            alt="upi"
            sx={{ width: 24, height: 24 }}
          />
          Enter UPI ID
        </MenuItem>
      </Select>

      {paymentOption === 'upi' && (
        <>
          {/* <StyledTextField
            fullWidth
            type="email"
            label="Enter UPI ID"
            placeholder="example@upi"
            value={email}
            sx={{ mb: 3 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon sx={{ color: '#666' }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <Typography sx={{ color: '#666' }}>@coherent.in</Typography>
                </InputAdornment>
              )
            }}
          />

          <Button
            variant="contained"
            fullWidth
            disabled={!upiId || isLoading}
            onClick={handleSubmit}
            sx={{
              height: "50px",
              backgroundColor: "#74D52B",
              fontSize: "16px",
              fontWeight: "bold",
              borderRadius: "8px",
              '&:hover': {
                backgroundColor: "#5fb321"
              }
            }}
          >
            {isLoading ? (
              <CircularProgress size={24} sx={{ color: 'white' }} />
            ) : (
              `Pay ₹${amount}`
            )}
          </Button> */}

          <Box sx={{ mb: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <TextField
              fullWidth
              placeholder="Enter mail id"
              value={email}
              sx={{

                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  '& fieldset': {
                    borderColor: '#e0e0e0'
                  },
                  '&:hover fieldset': {
                    borderColor: '#5fb321'
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#5fb321'
                  }
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon sx={{ color: '#666' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <Typography sx={{ color: '#666' }}>@coherent.in</Typography>
                  </InputAdornment>
                )
              }}
            />

            {showOtpField && (
              <TextField
                fullWidth
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                sx={{
                  mt: 1,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px'
                  }
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <KeyIcon sx={{ color: '#666' }} />
                    </InputAdornment>
                  ),
                }}
              />
            )}

            <Button
              variant="contained"
              onClick={() => {
                if (!showOtpField) {
                  sendOTPMail(email + '@coherent.in').then(() => {
                    setShowOtpField(true);
                  });
                } else {
                  handleOtpSubmit();
                }
              }}
              disabled={!email || (showOtpField && !otp)}
              sx={{
                bgcolor: '#5fb321',
                mt: 4,
                width: '50%', // Set width to 50%
                '&:hover': { bgcolor: '#5fb321' }
              }}
            >
              {isVerifying ? (
                <CircularProgress size={24} sx={{ color: 'white' }} />
              ) : (
                showOtpField ? 'Verify OTP' : 'Send OTP'
              )}
            </Button>
          </Box>


        </>
      )}

      {paymentOption === 'phonepe' && (
        <Button
          variant="contained"
          onClick={async () => {
            await handlePhonePeClick();
            setShowPhonePeDialog(true);
          }}
          sx={{
            height: "50px",
            backgroundColor: "#48269f",
            fontSize: "16px",
            fontWeight: "bold",
            borderRadius: "8px",
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            '&:hover': {
              backgroundColor: "#5fb321",
            }
          }}
        >
          <Box
            component="img"
            src={PhonepeIcon}
            alt="PhonePe"
            sx={{ width: 34, height: 34 }}
          />
          Continue with PhonePe
        </Button>
      )}

      <Dialog
        open={showPhonePeDialog}
        onClose={() => setShowPhonePeDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            overflow: 'hidden',
          }
        }}
      >
        {/* Header */}
        <Box sx={{
          bgcolor: '#48269f',
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2
        }}>
          <Box
            component="img"
            src={PhonepeIcon}
            alt="PhonePe"
            sx={{ width: 34, height: 34 }}
          />
          <Typography variant="h6" sx={{ color: 'white' }}>
            PhonePe Payment
          </Typography>
        </Box>


        {/* QR Code Scanner Dialog */}
        {isQrScannerOpen && (
          <Dialog
            open={isQrScannerOpen}
            onClose={() => setIsQrScannerOpen(false)}
            maxWidth="sm"
            fullWidth
            PaperProps={{
              sx: {
                borderRadius: 2,
                overflow: 'hidden',
              }
            }}
          >
            <DialogTitle>Scan QR Code</DialogTitle>
            <DialogContent>
              <Box id="qr-reader" style={{ width: '100%', height: '300px' }} />
              <Typography variant="body2" color="text.secondary" align="center">
                Position the QR code within the frame to scan
              </Typography>
            </DialogContent>
          </Dialog>
        )}

        <DialogContent sx={{ p: 0 }}>
          {/* QR Area */}
          <Box sx={{
            bgcolor: '#f5f5f5',
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2
          }}>
            {/* Empty QR Box */}
            {/* <Box sx={{
              width: 200,
              height: 200,
              border: '2px dashed #48269f',
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'white'
            }}>
              <Typography color="textSecondary">Scan QR Code</Typography>
            </Box> */}

            {/* Payment Details */}
            <Typography variant="h5" sx={{ color: '#48269f', fontWeight: 'bold' }}>
              ₹{amount.toFixed(2)}
            </Typography>

            {/* <Button
              variant="contained"
              onClick={handleQrIconClick}
              sx={{
                bgcolor: '#48269f',
                fontSize: "16px",
                fontWeight: "bold",
                borderRadius: "8px",
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                mt: 2,
                '&:hover': {
                  bgcolor: "#5fb321",
                }
              }}
            >
              Scan QR Code
            </Button> */}

            <Typography variant="body2" color="textSecondary">
              Scan QR code using PhonePe app
            </Typography>

            <Box sx={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 2,
              mt: 2,
              my: 2
            }}>
              {!showOtp ? (

                <Button
                  variant="contained"
                  onClick={handleQrIconClick}
                  sx={{
                    bgcolor: '#48269f',
                    fontSize: "16px",
                    fontWeight: "bold",
                    borderRadius: "8px",
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    mt: 2,
                    '&:hover': {
                      bgcolor: "#5fb321",
                    }
                  }}
                >
                  Scan QR Code
                </Button>

              ) : (

                <Box sx={{
                  mt: 4,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                  animation: 'fadeIn 0.3s ease-in'
                }}>
                  <Typography variant="h6" sx={{ textAlign: 'center' }}>
                    Enter OTP
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                    OTP has been sent to your registered Mail ID
                  </Typography>
                  <StyledInput
                    type="number"
                    value={otp}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      if (value.length <= 4) {
                        setOtp(value);
                        setErrors(prev => ({ ...prev, otp: '' }));
                      }
                    }}
                    error={!!errors.otp}
                    helperText={errors.otp}
                    placeholder="Enter 4-digit OTP"
                    inputProps={{
                      maxLength: 4,
                      style: { textAlign: 'center', letterSpacing: '0.2em' }
                    }}
                  />
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                      variant="outlined"
                      fullWidth
                      onClick={() => setShowOtp(false)}
                      sx={{
                        height: "50px",
                        borderColor: "#74D52B",
                        color: "#74D52B",
                        '&:hover': {
                          borderColor: "#5fb321",
                          backgroundColor: "transparent"
                        }
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={handleOtpSubmit}
                      disabled={isLoading || otp.length !== 4}
                      sx={{
                        height: "50px",
                        backgroundColor: "#74D52B",
                        fontSize: "16px",
                        fontWeight: "bold",
                        borderRadius: "8px",
                        '&:hover': {
                          backgroundColor: "#5fb321"
                        }
                      }}
                    >
                      {isLoading ? (
                        <CircularProgress size={24} sx={{ color: 'white' }} />
                      ) : (
                        'Verify OTP'
                      )}
                    </Button>
                  </Box>
                </Box>
              )}
            </Box>

          </Box>

          {/* Footer */}
          <Box sx={{
            position: 'sticky',
            bottom: 0,
            p: 2,
            bgcolor: 'white',
            borderTop: '1px solid #eee',
            display: 'flex',
            justifyContent: 'space-between'
          }}>
            <Button
              onClick={() => setShowPhonePeDialog(false)}
              sx={{ color: '#48269f' }}
            >
              Cancel
            </Button>
            <Typography variant="body2" sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              color: '#48269f'
            }}>
              <Box component="img" src={PhonepeIcon} sx={{ width: 20, height: 20 }} />
              Powered by PhonePe
            </Typography>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default UPIPayment;