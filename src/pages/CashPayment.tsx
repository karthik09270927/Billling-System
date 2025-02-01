import React, { useState } from 'react';
import { Box, Typography, Paper, Button, CircularProgress } from '@mui/material';
import rupee from '../assets/rupee.png';

interface CashPaymentProps {
  amount: number;
  onSubmit: () => Promise<void>;
}

const CashPayment: React.FC<CashPaymentProps> = ({ amount, onSubmit }) => {

  const [isLoading, setIsLoading] = useState(false);

  const handlePayClick = async () => {
    setIsLoading(true);
    try {
      await onSubmit();
    } catch (error) {
      console.error('Payment failed:', error);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <>
      <Paper
        elevation={5}
        sx={{
          p: 4,
          borderRadius: 4,
          background: `linear-gradient(135deg, 
      rgba(121, 159, 12, 0.9) 0%, 
      rgba(172, 187, 120, 0.9) 100%
    )`,
          position: 'relative',
          overflow: 'hidden',
          minHeight: 200,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '70%',
            height: '70%',
            background: `url(${rupee}) no-repeat center`,
            backgroundSize: 'contain',
            opacity: 0.3,
            zIndex: 0,
            animation: 'pulse 3s infinite ease-in-out',
            filter: 'brightness(1.5) contrast(1.1)'
          },
          '@keyframes pulse': {
            '0%': {
              opacity: 0.1,
              transform: 'translate(-50%, -50%) scale(0.95)'
            },
            '50%': {
              opacity: 0.3,
              transform: 'translate(-50%, -50%) scale(1.05)'
            },
            '100%': {
              opacity: 0.1,
              transform: 'translate(-50%, -50%) scale(0.95)'
            }
          }
        }}
      >
        <Box
          sx={{
            position: 'relative',
            zIndex: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            padding: 2,
            borderRadius: 2
          }}
        >
          {/* <CurrencyRupeeIcon
            sx={{
              fontSize: 48,
              color: 'black',
            }}
          /> */}
          <Typography
            variant="h2"
            sx={{
              color: 'white',
              fontWeight: 'bold',
              textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
              '@keyframes pulse': {
                '0%': {
                  transform: 'scale(1)'
                },
                '50%': {
                  transform: 'scale(1.05)'
                },
                '100%': {
                  transform: 'scale(1)'
                }
              }
            }}
          >
            {amount.toFixed(2)}
          </Typography>

        </Box>
      </Paper>

      <Button
        variant="contained"
        fullWidth
        onClick={handlePayClick}
        disabled={isLoading}
        sx={{
          height: "50px",
          backgroundColor: "#799F0C",
          fontSize: "18px",
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
          `PAY`
        )}
      </Button>
    </>
  );
};

export default CashPayment;