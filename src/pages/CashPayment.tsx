import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';

interface CashPaymentProps {
  amount: number;
}

const CashPayment: React.FC<CashPaymentProps> = ({ amount }) => {
  return (
    <Paper
      elevation={3}
      sx={{
        p: 4,
        borderRadius: 4,
        background: 'linear-gradient(135deg, #799F0C 0%, #ACBB78 100%)',
        position: 'relative',
        overflow: 'hidden',
        minHeight: 200,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '300px',
          height: '300px',
          background: 'url(/currency-watermark.png) no-repeat center',
          backgroundSize: 'contain',
          opacity: 0.1,
          zIndex: 0
        }
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          zIndex: 1
        }}
      >
        <CurrencyRupeeIcon 
          sx={{ 
            fontSize: 48, 
            color: 'white',
            animation: 'pulse 2s infinite'
          }} 
        />
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
  );
};

export default CashPayment;