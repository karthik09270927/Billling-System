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
  Button,
  CircularProgress,
  Grid
} from '@mui/material';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import PersonIcon from '@mui/icons-material/Person';
import EventIcon from '@mui/icons-material/Event';
import LockIcon from '@mui/icons-material/Lock';
import visaLogo from '../assets/cards/visa.png';
import mastercardLogo from '../assets/cards/mastercard.png';
import amexLogo from '../assets/cards/AMEX.png';
import rupayLogo from '../assets/cards/Rupay.png';
import chip from '../assets/cards/chip.png';
import amexBgLogo from '../assets/cards/AMEX log.png';
import visaBgLogo from '../assets/cards/visa logo.png';
import rupayBgLogo from '../assets/cards/rupay logo.png';
import mastercardBgLogo from '../assets/cards/mastercard logo.png';
import { showErrorToast, showSuccessToast } from '../utils/toast';
import { saveCardDetails, verifyCardOtp } from '../utils/api-collection';
import { useNavigate } from 'react-router-dom';

interface CreditCardProps {
  onSubmit: () => Promise<void>;
  amount: number;
  email: string;
  onClose?: () => void;
}

type CardType = 'VISA' | 'MASTERCARD' | 'AMEX' | 'RUPAY' | 'UNKNOWN';


const StyledCard = styled(Card)<{ cardtype: string }>(({ theme, cardtype }) => {
  const cardStyle = getCardType(cardtype);
  return {
    padding: theme.spacing(3),
    borderRadius: 18,
    background:
      cardStyle.type === 'AMEX'
        ? `${cardStyle.gradient}, url(${amexBgLogo}) center/50% no-repeat`

        : cardStyle.type === 'VISA'
          ? `${cardStyle.gradient}, url(${visaBgLogo}) left/80% no-repeat`

          : cardStyle.type === 'RUPAY'
            ? `${cardStyle.gradient}, url(${rupayBgLogo}) center/60% no-repeat`

            : cardStyle.type === 'MASTERCARD'
              ? `${cardStyle.gradient}, url(${mastercardBgLogo})  right/90% no-repeat`

              : cardStyle.gradient,
    backgroundBlendMode:
      cardStyle.type === 'AMEX' || cardStyle.type === 'VISA' || cardStyle.type === 'RUPAY' || cardStyle.type === 'MASTERCARD'
        ? 'overlay'
        : 'normal',
    color: 'white',
    width: '100%',
    height:'100%',
    maxWidth: 550,
    aspectRatio: '1.75/1',
    position: 'relative',
    transition: 'all 0.3s ease',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: cardStyle.type === 'AMEX'
        ? 'rgba(0, 153, 204, 0.15)'
        : cardStyle.type === 'VISA'
          ? 'rgba(26, 31, 113, 0.15)'
          : 'transparent',

      borderRadius: 'inherit'
    },
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: `0 12px 40px ${cardStyle.shadow}`
    }
  };
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

const cardLogos: Record<Exclude<CardType, 'UNKNOWN'>, string> = {
  VISA: visaLogo,
  MASTERCARD: mastercardLogo,
  AMEX: amexLogo,
  RUPAY: rupayLogo
};


const getCardType = (number: string): { type: CardType; gradient: string; shadow: string, color: any } => {
  const firstDigit = number.replace(/\s/g, '').charAt(0);
  switch (firstDigit) {
    case '3':
      return {
        type: 'AMEX',
        gradient: 'linear-gradient(135deg, #0099CC 0%, #006699 100%)',
        shadow: '#0099CC',
        color: ''
      };
    case '4':
      return {
        type: 'VISA',
        gradient: 'linear-gradient(135deg, #1A1F71 0%, #2B3990 100%)',
        shadow: '#1A1F71',
        color: ''
      };
    case '5':
      return {
        type: 'MASTERCARD',
        gradient: 'linear-gradient(135deg, #EB001B 0%, #FF5F00 100%)',
        shadow: '#EB001B',
        color: ''
      };
    case '6':
    case '8':
      return {
        type: 'RUPAY',
        gradient: 'linear-gradient(135deg, #ffe259 0%, #ffa751 100%)',
        shadow: '#ffe259',
        color: ''
      };
    default:
      return {
        type: 'UNKNOWN',
        gradient: 'linear-gradient(135deg, #799F0C 0%, #ACBB78 100%)',
        shadow: '#ACBB78',
        color: ''
      };
  }
};

const CreditCard: React.FC<CreditCardProps> = ({ onSubmit, amount, email, onClose }) => {
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardType, setCardType] = useState('CREDIT');
  const [isLoading, setIsLoading] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();
  const [errors, setErrors] = useState({
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: '',
    otp: ''
  });

  const validateForm = () => {
    const newErrors = {
      cardNumber: '',
      cardName: '',
      expiry: '',
      cvv: '',
      otp: ''
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

  const formatEmail = (email: string) => {
    const cleanEmail = email.trim().toLowerCase();
    if (cleanEmail.includes('@')) {
      return cleanEmail;
    }
    // Append domain for consistent format
    return `${cleanEmail}@coherent.in`;
  };

  const handlePayClick = async () => {
    if (validateForm()) {
      setIsLoading(true);
      try {
        await saveCardDetails({
          cardType: cardType,
          cardNumber: cardNumber.replace(/\s/g, ''),
          cardValidity: expiry,
          cvvNumber: cvv,
          // email: email
          email: formatEmail(email)
        });
        setShowOtp(true);
        showSuccessToast('OTP sent successfully');
      } catch (error: any) {
        showErrorToast(error.message || 'Failed to process payment');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleOtpSubmit = async () => {
    if (otp.length === 4) {
      setIsLoading(true);
      try {
        await verifyCardOtp({
          enteredOtp: otp,
          email: email + '@coherent.in'
        });

        await onSubmit();

        showSuccessToast('Payment successful');
        setOtp('');
        setShowOtp(false);
        setCardNumber('');
        setCardName('');
        setExpiry('');
        setCvv('');
        setCardType('CREDIT');
        setErrors({
          cardNumber: '',
          cardName: '',
          expiry: '',
          cvv: '',
          otp: ''
        });


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


  return (
    <Box sx={{ width: '100%', maxWidth:'auto', mx: 'auto' }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={7.2} sx={{ mt:3 }}>
          <StyledCard cardtype={cardNumber}>
            <Box sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <Box sx={{
                width: 60,
                height: 60,
                borderRadius: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.05)',
                  bgcolor: 'rgba(255,255,255,0.3)'
                }
              }}>
                {cardNumber && getCardType(cardNumber).type !== 'UNKNOWN' ? (
                  <img
                    src={cardLogos[getCardType(cardNumber).type as Exclude<CardType, 'UNKNOWN'>]}
                    alt={getCardType(cardNumber).type || 'Unknown Card Type'}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                    }}
                  />
                ) : (
                  <CreditCardIcon sx={{ fontSize: 30, opacity: 0.9 }} />
                )}
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

            <Box sx={{
              mb: 3,
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              mt:2
            }}>
              <Box sx={{
                position: 'absolute',
                right: 0,
                top: 0,
                width: 60,
                height: 40,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Box
                  component="img"
                  src={chip}
                  alt="Card Chip"
                  sx={{
                    width: '120%',
                    height: '100%',
                    objectFit: 'contain',
                    filter: 'brightness(0.9) contrast(1.2)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'rotate(0deg) scale(1.05)',
                      filter: 'brightness(1) contrast(1.3)'
                    }
                  }}
                />
              </Box>

              <Typography sx={{
                fontSize: '1.6rem',
                letterSpacing: '0.15em',
                fontFamily: 'monospace',
                textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
              }}>
                {cardNumber || '•••• •••• •••• ••••'}
              </Typography>

              {cardNumber && (
                <Typography sx={{
                  fontSize: '1rem',
                  letterSpacing: '0.2em',
                  mt: 1,
                  opacity: 0.8,
                  textTransform: 'uppercase',
                  fontWeight: 500
                }}>
                  {getCardType(cardNumber).type}
                </Typography>
              )}
            </Box>

            <Box sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              mt:2
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
        </Grid>

        {!showOtp ? (
          <Grid item xs={12} md={4.8}>
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
                  placeholder="MM/YY"
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
                onClick={handlePayClick}
                disabled={Object.values(errors).some(error => error) || !cardNumber || !cardName || !expiry || !cvv}
                sx={{
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
                PAY ₹ {amount.toLocaleString('en-IN', {
                  maximumFractionDigits: 2,
                  minimumFractionDigits: 2
                })}
              </Button>
            </Box>
          </Grid>
        ) : (
          <Grid item xs={12} md={4.8}>
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
              OTP has been sent to your registered mobile number
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
            <Box sx={{ display: 'flex', gap: 2}}>
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
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default CreditCard;