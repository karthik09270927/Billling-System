import React, { useState } from 'react';
import {
  Box,
  TextField,
  InputAdornment,
  Typography,
  Card,
  styled,
  MenuItem,
  Select,
  SelectChangeEvent,
  Button
} from '@mui/material';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import PersonIcon from '@mui/icons-material/Person';
import EventIcon from '@mui/icons-material/Event';
import LockIcon from '@mui/icons-material/Lock';

interface CreditCardProps {
  onSubmit: () => void;
  amount: number;
}

const StyledCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: 16,
  background: 'linear-gradient(135deg, #799F0C 0%, #ACBB78 100%)',
  color: 'white',
  width: '100%',
  maxWidth: 450,
  aspectRatio: '1.8/1',
  position: 'relative',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 40px #ACBB78'
  }
}));

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

const CreditCard: React.FC<CreditCardProps> = ({ onSubmit, amount }) => {
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardType, setCardType] = useState('CREDIT');
  const [errors, setErrors] = useState({
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: ''
  });

  const validateForm = () => {
    const newErrors = {
      cardNumber: '',
      cardName: '',
      expiry: '',
      cvv: ''
    };

    if (!cardNumber || cardNumber.replace(/\s/g, '').length !== 16) {
      newErrors.cardNumber = 'Enter valid 16-digit card number';
    }

    if (!cardName) {
      newErrors.cardName = 'Enter cardholder name';
    }

    if (!expiry || !expiry.match(/^(0[1-9]|1[0-2])\/([0-9]{2})$/)) {
      newErrors.expiry = 'Enter valid expiry date (MM/YY)';
    }

    if (!cvv || cvv.length !== 3) {
      newErrors.cvv = 'Enter valid CVV';
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    const formattedValue = value.match(/.{1,4}/g)?.join(' ') || '';
    if (formattedValue.length <= 19) {
      setCardNumber(formattedValue);
      setErrors(prev => ({ ...prev, cardNumber: '' }));
    }
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 4) {
      const month = value.slice(0, 2);
      const year = value.slice(2);
      setExpiry(value.length > 2 ? `${month}/${year}` : month);
      setErrors(prev => ({ ...prev, expiry: '' }));
    }
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit();
    }
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 450, mx: 'auto' }}>
      <StyledCard>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 3 
        }}>
          <Box sx={{ 
            width: 50, 
            height: 40,
            bgcolor: 'rgba(255,255,255,0.2)',
            borderRadius: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <CreditCardIcon sx={{ fontSize: 30, opacity: 0.9 }} />
          </Box>
          <Select
            value={cardType}
            onChange={(e: SelectChangeEvent) => setCardType(e.target.value)}
            sx={{
              color: 'white',
              '.MuiOutlinedInput-notchedOutline': { border: 'none' },
              '&:hover .MuiOutlinedInput-notchedOutline': { border: 'none' },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': { border: 'none' },
              '.MuiSvgIcon-root': { color: 'white' }
            }}
          >
            <MenuItem value="CREDIT">Credit Card</MenuItem>
            <MenuItem value="DEBIT">Debit Card</MenuItem>
          </Select>
        </Box>

        <Typography sx={{ 
          fontSize: '1.8rem', 
          letterSpacing: '0.2em',
          mb: 3,
          fontFamily: 'monospace',
          textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
        }}>
          {cardNumber || '•••• •••• •••• ••••'}
        </Typography>

        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'flex-end'
        }}>
          <Box>
            <Typography variant="caption" sx={{ opacity: 0.8 }}>
              Card Holder
            </Typography>
            <Typography sx={{ 
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              fontWeight: 500
            }}>
              {cardName || 'YOUR NAME'}
            </Typography>
          </Box>

          <Box>
            <Typography variant="caption" sx={{ opacity: 0.8 }}>
              Expires
            </Typography>
            <Typography sx={{ letterSpacing: '0.1em' }}>
              {expiry || 'MM/YY'}
            </Typography>
          </Box>
        </Box>
      </StyledCard>

      <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <StyledInput
          label="Card Number"
          value={cardNumber}
          onChange={handleCardNumberChange}
          error={!!errors.cardNumber}
          helperText={errors.cardNumber}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <CreditCardIcon sx={{ color: '#666' }} />
              </InputAdornment>
            ),
          }}
          fullWidth
          required
        />

        <StyledInput
          label="Cardholder Name"
          value={cardName}
          onChange={(e) => {
            setCardName(e.target.value.toUpperCase());
            setErrors(prev => ({ ...prev, cardName: '' }));
          }}
          error={!!errors.cardName}
          helperText={errors.cardName}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PersonIcon sx={{ color: '#666' }} />
              </InputAdornment>
            ),
          }}
          fullWidth
          required
        />

        <Box sx={{ display: 'flex', gap: 2 }}>
          <StyledInput
            label="Expiry Date"
            value={expiry}
            onChange={handleExpiryChange}
            error={!!errors.expiry}
            helperText={errors.expiry}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EventIcon sx={{ color: '#666' }} />
                </InputAdornment>
              ),
            }}
            required
          />

          <StyledInput
            label="CVV"
            value={cvv}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '');
              if (value.length <= 3) {
                setCvv(value);
                setErrors(prev => ({ ...prev, cvv: '' }));
              }
            }}
            type="password"
            error={!!errors.cvv}
            helperText={errors.cvv}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon sx={{ color: '#666' }} />
                </InputAdornment>
              ),
            }}
            required
          />
        </Box>

        <Button
          variant="contained"
          fullWidth
          onClick={handleSubmit}
          disabled={Object.values(errors).some(error => error) || !cardNumber || !cardName || !expiry || !cvv}
          sx={{
            mt: 2,
            height: "50px",
            backgroundColor: "#74D52B",
            fontSize: "16px",
            fontWeight: "bold",
            borderRadius: "8px",
            '&:hover': {
              backgroundColor: "#5fb321"
            },
            '&:disabled': {
              backgroundColor: "#cccccc"
            }
          }}
        >
          PAY ₹ {amount.toFixed(2)}
        </Button>
      </Box>
    </Box>
  );
};

export default CreditCard;