import React, { useState } from 'react';
import {
  Box,
  TextField,
  Typography,
  Button,
  CircularProgress,
  styled
} from '@mui/material';

interface UPIPaymentProps {
  amount: number;
  onSubmit: () => void;
}

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 8,
    backgroundColor: 'white',
    '&:hover fieldset': {
      borderColor: '#74D52B',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#74D52B',
    }
  }
}));

const UPIPayment: React.FC<UPIPaymentProps> = ({ amount, onSubmit }) => {
  const [upiId, setUpiId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const validateUpiId = (id: string) => {
    const upiRegex = /^[\w.-]+@[\w.-]+$/;
    return upiRegex.test(id);
  };

  const handleSubmit = async () => {
    if (!validateUpiId(upiId)) {
      setError('Please enter a valid UPI ID');
      return;
    }

    setIsLoading(true);
    try {
      // Generate UPI payment link
      const upiUrl = `upi://pay?pa=${upiId}&pn=FreshHypermarket&am=${amount}&cu=INR`;
      
      await onSubmit();
    } catch (error) {
      setError('Payment failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ 
      width: '100%',
      maxWidth: 450,
      mx: 'auto',
      textAlign: 'center'
    }}>
      {/* <Box sx={{ 
        p: 3,
        bgcolor: '#f5f5f5',
        borderRadius: 2,
        mb: 3
      }}>
        <QRCode 
          value={`upi://pay?pa=${upiId}&pn=FreshHypermarket&am=${amount}&cu=INR`}
          size={200}
          level="H"
          includeMargin
        />
      </Box> */}

      <Typography variant="h6" sx={{ mb: 2 }}>
        Pay using UPI
      </Typography>

      <StyledTextField
        fullWidth
        label="Enter UPI ID"
        placeholder="example@upi"
        value={upiId}
        onChange={(e) => {
          setUpiId(e.target.value);
          setError('');
        }}
        error={!!error}
        helperText={error}
        sx={{ mb: 3 }}
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
          `PAY ₹ ${amount.toLocaleString('en-IN', {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2
          })}`
        )}
      </Button>
    </Box>
  );
};

export default UPIPayment;