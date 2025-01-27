import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  Button,
  Grid,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Select,
  InputAdornment,
  CardMedia,
} from "@mui/material";
import { useSelectedItems } from "../Hooks/productContext";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { Toasts } from "../centralizedComponents/forms/Toast";
import { saveBill } from "../utils/api-collection";

interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface RightPanelProps {
  customerName?: string;
  orderNumber?: string;
}

const RightPanel: React.FC<RightPanelProps> = ({ customerName, orderNumber }) => {
  const { selectedItems, setSelectedItems } = useSelectedItems();
  const [isPlacingOrder, setIsPlacingOrder] = useState(false); // Loading state for API
  const [isOrderPlaced, setIsOrderPlaced] = useState(false); // Track if order is placed
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [phoneNumber, setPhoneNumber] = useState(""); // Customer phone number
  const [name, setName] = useState(customerName || ""); // Customer name
  const [email, setEmail] = useState(""); // Customer address
  const [paymentMode, setPaymentMode] = useState<'Cash' | 'Card' | 'Online'>('Cash');
  const [errors, setErrors] = useState({
    name: '',
    phoneNumber: '',
    email: '',
    paymentMode: ''
  });

  const resetForm = () => {
    setName('');
    setPhoneNumber('');
    setEmail('');
    setPaymentMode('Cash');
    setErrors({
      name: '',
      phoneNumber: '',
      email: '',
      paymentMode: ''
    });
  };

  const isFormValid = () => {
    const isNameValid = name.length >= 3;
    const isPhoneValid = /^\d{10}$/.test(phoneNumber);
    const isEmailValid = /^[a-zA-Z0-9._-]+$/.test(email);
    const isPaymentSelected = !!paymentMode;

    return isNameValid && isPhoneValid && isEmailValid && isPaymentSelected;
  };

  const validateFields = () => {
    const newErrors = {
      name: '',
      phoneNumber: '',
      email: '',
      paymentMode: ''
    };

    // Name validation
    if (!name.trim()) {
      newErrors.name = 'Name is required';
    } else if (name.length < 3) {
      newErrors.name = 'Name must be at least 3 characters';
    }

    // Phone validation
    if (!phoneNumber) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^\d{10}$/.test(phoneNumber)) {
      newErrors.phoneNumber = 'Enter valid 10-digit number';
    }

    // Email validation
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/^[a-zA-Z0-9._-]+$/.test(email)) {
      newErrors.email = 'Invalid email format';
    }

    // Payment mode validation
    if (!paymentMode) {
      newErrors.paymentMode = 'Select payment mode';
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== '');
  };


  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._-]+@gmail\.com$/;
    return emailRegex.test(email);
  };



  const calculateTotal = () => {
    return selectedItems?.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2);
  };


  const handleConfirmOrder = async () => {
    console.info('Starting order confirmation process...');

    if (!validateFields()) {
      console.warn('Validation failed:', errors);
      return;
    }

    setIsPlacingOrder(true);
    console.info('Processing order...');

    try {
      const billData = {
        userName: name,
        userEmail: email + '@gmail.com',
        userPhone: phoneNumber,
        paymentMode: paymentMode,
        products: selectedItems.map(item => ({
          productId: item.id,
          quantity: item.quantity
        }))
      };

      console.log('Sending bill data:', billData);
      const response = await saveBill(billData);
      console.log('Success', response)
      console.info('Order placed successfully!');
      Toasts({ message: 'Order placed successfully', type: 'success' });
      setIsModalOpen(false);
      setSelectedItems([]);
      resetForm();
    } catch (error: any) {
      console.error('Order placement failed:', error);
      Toasts({
        message: error.response?.data?.message || 'Failed to place order',
        type: 'error'
      });
    } finally {
      console.info('Order process completed');
      setIsPlacingOrder(false);
    }
  };

  return (
    <Grid item sx={{ height: "100vh" }}>
      <Card elevation={1} sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
        {/* Header Section */}
        <Box
          sx={{
            height: "50px",
            backgroundColor: "#fbfbe5",
            borderBottom: '3px solid #e0e0e0',
            padding: "8px",
            flexShrink: 0,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="body1" sx={{ fontWeight: "bold", color: '#74D52B' }}>
            "FRESH HYPERMARKET"
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: "bold", color: "#666" }}>
            Order #{orderNumber}
          </Typography>
        </Box>

        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            padding: 2,
            scrollbarWidth: "thin",
          }}
        >
          {(selectedItems ?? []).length > 0 ? (
            (selectedItems ?? []).map((item) => (
              <Box
                key={item.id}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  marginBottom: 2,
                  borderRadius: 2,
                  padding: 2,
                }}
              >
                {/* Row 1: Product Image and Name */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 2,
                  }}
                >
                  <CardMedia
                    component="img"
                    image={`data:image/jpeg;base64,${item.image}`}
                    alt={item.productName}
                    sx={{
                      width: 70,
                      height: 70,
                      objectFit: "cover",
                      borderRadius: "50%",
                      border: "2px solid #e0e0e0",
                      padding: "2px",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "scale(1.05)",
                        boxShadow: "0 0 10px rgba(116, 213, 43, 0.3)",
                      }
                    }}
                  />
                  <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                    {item.productName}
                  </Typography>
                </Box>

                {/* Row 2: Quantity Controls */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    marginTop: 1,
                    gap: 1,
                  }}
                >
                  <Button
                    size="small"
                    onClick={() =>
                      setSelectedItems((prevItems) =>
                        prevItems
                          .map((i) =>
                            i.id === item.id
                              ? { ...i, quantity: i.quantity - 1 }
                              : i
                          )
                          .filter((i) => i.quantity > 0) // Remove item if quantity becomes 0
                      )
                    }
                  >
                    <RemoveIcon sx={{ color: 'red' }} />
                  </Button>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: "bold", minWidth: 24, textAlign: "center" }}
                  >
                    {item.quantity}
                  </Typography>
                  <Button
                    size="small"
                    onClick={() =>
                      setSelectedItems((prevItems) =>
                        prevItems.map((i) =>
                          i.id === item.id
                            ? { ...i, quantity: i.quantity + 1 }
                            : i
                        )
                      )
                    }
                  >
                    <AddIcon sx={{ color: '#74D52B' }} />
                  </Button>
                </Box>

                {/* Row 3: Product Price */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    marginTop: 1,
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                    ₹ {(item.price * item.quantity).toFixed(2)}
                  </Typography>
                </Box>
              </Box>
            ))
          ) : (
            <Typography
              variant="body2"
              sx={{ color: "#999", textAlign: "center" }}
            >
              No items selected.
            </Typography>
          )}
        </Box>


        <Box
          sx={{
            height: "80px",
            padding: 2,
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Button
            variant="contained"

            fullWidth
            sx={{
              height: "50px",
              backgroundColor: "#74D52B",
              fontSize: "16px",
              fontWeight: "bold",
              borderRadius: "8px",
            }}
            onClick={() => setIsModalOpen(true)}
          >
            Confirm
          </Button>
        </Box>
      </Card>

      {/* Modal for Billing Details */}

      <Dialog
        open={isModalOpen}
        onClose={(_, reason) => {
          if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
            return;
          }
          setIsModalOpen(false);
          resetForm();
        }}
        disableEscapeKeyDown
        hideBackdrop={false}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: 10,
            overflow: 'hidden',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
          }
        }}
      >
        <DialogTitle
          sx={{
            textAlign: 'center',
            padding: '20px',
            color: '#333',
            fontWeight: 800,
            '& .MuiTypography-root': {
              fontSize: '1.8rem'
            }
          }}
        >
          Confirm Order
        </DialogTitle>        <DialogContent>
          <Box sx={{ marginBottom: 2 }}>
            <Typography variant="h6">Billing Details</Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2, mt: 1 }}>
              <TextField
                label="Customer Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                error={!!errors.name}
                helperText={errors.name}
                required
                fullWidth
                sx={{
                  '& .MuiFormHelperText-root': {
                    color: '#d32f2f'
                  }
                }}
              />

              <TextField
                label="Phone Number"
                type="number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                error={!!errors.phoneNumber}
                helperText={errors.phoneNumber}
                required
                fullWidth
                inputProps={{ maxLength: 10 }}
              />
            </Box>

            <TextField
              label="Mail Id"
              type="email"
              value={email}
              error={!!errors.email}
              helperText={errors.email}
              required
              onChange={(e) => {
                const value = e.target.value;
                // Remove @gmail.com if user types it manually
                const baseEmail = value.replace(/@gmail\.com$/, '');
                setEmail(baseEmail);
              }}
              // error={email.length > 0 && !isValidEmail(email + '@gmail.com')}
              // helperText={
              //   email.length > 0 && !isValidEmail(email + '@gmail.com')
              //     ? 'Please enter a valid email'
              //     : ''
              // }
              fullWidth
              margin="normal"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Typography
                      sx={{
                        color: '#666',
                        userSelect: 'none',
                        fontSize: '14px'
                      }}
                    >
                      @gmail.com
                    </Typography>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& input': {
                    paddingRight: '80px'
                  }
                }
              }}
            />
          </Box>

          {/* Payment Mode Buttons */}
          <Box sx={{
            marginBottom: 2, ...(errors.paymentMode && {
              '& .MuiButton-root': {
                borderColor: '#d32f2f'
              }
            })
          }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2, marginTop: 1 }}>
              {['Cash', 'Card', 'Online'].map((mode) => (
                <Button
                  key={mode}
                  variant={paymentMode === mode ? "contained" : "outlined"}
                  onClick={() => {
                    setPaymentMode(mode as 'Cash' | 'Card' | 'Online');
                    setErrors({ ...errors, paymentMode: '' });
                  }}
                  fullWidth
                  sx={{
                    bgcolor: paymentMode === mode ? "#74D52B" : "transparent",
                    color: paymentMode === mode ? "white" : "#74D52B",
                    borderColor: errors.paymentMode ? "#d32f2f" : "#74D52B",
                    '&:hover': {
                      bgcolor: paymentMode === mode ? "#65BA25" : "#74D52B10",
                    },
                    ...(mode === 'Cash' && {
                      bgcolor: paymentMode === 'Cash' ? "#74D52B" : "transparent",
                    })
                  }}
                >
                  {mode}
                </Button>
              ))}
              {errors.paymentMode && (
                <Typography
                  variant="caption"
                  sx={{ color: '#d32f2f', mt: 1 }}
                >
                  {errors.paymentMode}
                </Typography>
              )}
            </Box>
          </Box>

          {/* Products List */}
          <Typography variant="h6">Products</Typography>
          {selectedItems.map((item) => (
            <Box
              key={item.id}
              sx={{
                display: "grid",
                gridTemplateColumns: "60px 2fr 1fr 1fr",
                alignItems: "center",
                gap: 2,
                mb: 2,
                p: 1,
                borderRadius: '8px'
              }}
            >
              {/* Product Image */}
              <CardMedia
                component="img"
                image={`data:image/jpeg;base64,${item.image}`}
                alt={item.productName}
                sx={{
                  width: 50,
                  height: 50,
                  objectFit: "cover",
                  borderRadius: '4px'
                }}
              />

              {/* Product Name */}
              <Typography
                variant="body2"
                sx={{
                  fontWeight: "bold",
                  color: '#333'
                }}
              >
                {item.productName}
              </Typography>

              {/* Quantity */}
              <Typography
                sx={{
                  color: '#666',
                  textAlign: 'center'
                }}
              >
                × {item.quantity}
              </Typography>

              {/* Price */}
              <Typography
                sx={{
                  fontWeight: "600",
                  textAlign: 'right',
                  color: '#333'
                }}
              >
                ₹ {(item.price * item.quantity).toFixed(2)}
              </Typography>
            </Box>
          ))}
          <Box sx={{ mt: 2, textAlign: "right" }}>
            <Typography variant="h6">Total: ₹ {calculateTotal()}</Typography>
          </Box>
        </DialogContent>
        <DialogActions
          sx={{
            display: 'flex',
            justifyContent: 'center',
            gap: 2,
            padding: '20px',
          }}
        >
          <Button onClick={() => {
            setIsModalOpen(false);
            resetForm();
          }}
            color="secondary" >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmOrder}
            color="primary"
            variant="contained"
            disabled={!isFormValid() || isPlacingOrder}
            sx={{
              bgcolor: "#74D52B",
              '&:hover': {
                bgcolor: "#65BA25",
              },
            }}
          >
            {isPlacingOrder ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Confirm"}
          </Button>
        </DialogActions>
      </Dialog>


    </Grid>
  );
};

export default RightPanel;
