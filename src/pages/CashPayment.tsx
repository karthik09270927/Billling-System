import React, { useState } from 'react';
import { Box, Typography, Paper, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import rupee from '../assets/rupee.png';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import InvoiceDialog from '../centralizedComponents/forms/InvoiceDialog';

interface CashPaymentProps {
  amount: number;
  onSubmit: () => Promise<void>;
  userName?: string;
  userEmail?: string;
  userPhone?: string;
  paymentMode?: string;
  products?: Array<{
    productName: string;
    quantity: number;
    sellingPrice: number;
  }>;
}

const CashPayment: React.FC<CashPaymentProps> = ({
  amount,
  onSubmit,
  userName = "",
  userEmail = "",
  userPhone = "",
  paymentMode = "",
  products = []
}) => {

  const [isLoading, setIsLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);


  const handlePayClick = async () => {
    setIsLoading(true);
    try {
      await onSubmit();
      setShowPreview(false);
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

      <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
        <Button
          variant="outlined"
          fullWidth
          onClick={() => setShowPreview(true)}
          startIcon={<ReceiptLongIcon className="w-5 h-5" />}
          sx={{
            height: "50px",
            borderColor: "#799F0C",
            color: "#799F0C",
            fontSize: "16px",
            fontWeight: "bold",
            borderRadius: "8px",
            '&:hover': {
              borderColor: "#5fb321",
              backgroundColor: "rgba(95, 179, 33, 0.1)"
            }
          }}
        >
          Preview Invoice
        </Button>
      </Box>


      {/* Preview PDF */}
      <Dialog
        open={showPreview}
        onClose={() => setShowPreview(false)}
      >
        <DialogTitle>Invoice Preview</DialogTitle>
        <DialogContent>
          {pdfUrl ? (
            <iframe
              src={pdfUrl}
              style={{ width: '100%', height: '500px' }}
              frameBorder="0"
            />
          ) : (
            <CircularProgress />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowPreview(false)} color="primary">Close</Button>
        </DialogActions>
      </Dialog>

      <InvoiceDialog
        open={showPreview}
        onClose={() => setShowPreview(false)}
        userName={userName}
        userEmail={userEmail}
        userPhone={userPhone}
        paymentMode={paymentMode}
        amount={amount}
        products={products}
        onSubmit={handlePayClick}
      />

    </>
  );
};

export default CashPayment;