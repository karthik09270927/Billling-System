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
import { generateQRCode } from '../utils/api-collection';

interface UPIPaymentProps {
  amount: number;
  email: string;
  onSubmit: () => Promise<void>;
}

const StyledTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'white',
    borderRadius: 8,
  }
});

const UPIPayment: React.FC<UPIPaymentProps> = ({ amount, onSubmit, email }) => {
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


  const initializeScanner = () => {
    scannerRef.current = new Html5QrcodeScanner("qr-reader", {
      fps: 10,
      qrbox: 250,
    }, false);
    scannerRef.current.render(onScanSuccess, onScanError);
  };

  const onScanSuccess = (decodedText: string) => {
    console.log("QR Code scanned: ", decodedText);
    // Handle the scanned QR code value here
    // For example, you can set the UPI ID or perform any action
    setIsQrScannerOpen(false); // Close the scanner after successful scan
  };

  const onScanError = (error: any) => {
    console.warn("QR Code scan error: ", error);
  };

  const handleQrIconClick = () => {
    setIsQrScannerOpen(true);
    setTimeout(() => {
      initializeScanner();
    }, 100);
  };


  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await onSubmit();
    } catch (error) {
      console.error('Payment failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhonePeClick = async () => {
    try {
      const response = await generateQRCode(email, amount);
      console.log('QR Code generated:', response.data);
      // Handle the response as needed, e.g., display the QR code
    } catch (error) {
      console.error('Error generating QR code:', error);
      // Handle error (e.g., show a toast notification)
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
                  setShowOtpField(true);
                } else {
                  setIsVerifying(true);
                  // Add verification logic here
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
            <Box sx={{
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
            </Box>

            {/* Payment Details */}
            <Typography variant="h5" sx={{ color: '#48269f', fontWeight: 'bold' }}>
              ₹{amount.toFixed(2)}
            </Typography>

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

            <Typography variant="body2" color="textSecondary">
              Scan QR code using PhonePe app
            </Typography>

            <Box sx={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              my: 2
            }}>
              {/* <Box sx={{ flex: 1, height: '1px', bgcolor: '#e0e0e0' }} />
              <Typography color="textSecondary" sx={{ fontSize:20 }}>OR</Typography>
              <Box sx={{ flex: 1, height: '1px', bgcolor: '#e0e0e0' }} /> */}
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