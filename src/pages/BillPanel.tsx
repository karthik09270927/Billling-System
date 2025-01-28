import React, { useEffect, useRef, useState } from "react";
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
  IconButton,
  Stack,
} from "@mui/material";
import { useSelectedItems } from "../Hooks/productContext";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { Toasts } from "../centralizedComponents/forms/Toast";
import { getProductInfoById, getUserDetails, saveBill } from "../utils/api-collection";
import QrCode2Icon from '@mui/icons-material/QrCode2';
import CloseIcon from '@mui/icons-material/Close';
import { Html5QrcodeScanner } from "html5-qrcode";
import successSound from '../assets/sounds/success.mp3';
import errorSound from '../assets/sounds/error.mp3';





interface RightPanelProps {
  customerName?: string;
  orderNumber?: string;
}

const RightPanel: React.FC<RightPanelProps> = ({ customerName, orderNumber }) => {
  const { selectedItems, setSelectedItems } = useSelectedItems();
  const [isLoadingUser, setIsLoadingUser] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false); // Loading state for API
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [phoneNumber, setPhoneNumber] = useState(""); // Customer phone number
  const [name, setName] = useState(customerName || ""); // Customer name
  const [email, setEmail] = useState(""); // Customer address
  const [isQrScannerOpen, setIsQrScannerOpen] = useState(false);
  const scannerRef = useRef<any>(null);
  const successAudioRef = useRef(new Audio(successSound));
  const errorAudioRef = useRef(new Audio(errorSound));
  const [isScanning, setIsScanning] = useState(false);
  const [paymentMode, setPaymentMode] = useState<'Cash' | 'Card' | 'Online'>('Cash');
  const [scannedBarcodes, setScannedBarcodes] = useState<Set<number>>(new Set());
  const [errors, setErrors] = useState({
    name: '',
    phoneNumber: '',
    email: '',
    paymentMode: '',
    products: ''
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
      paymentMode: '',
      products: ''
    });
  };

  const isFormValid = () => {
    const isNameValid = name.length >= 3;
    const isPhoneValid = /^\d{10}$/.test(phoneNumber);
    const isEmailValid = /^[a-zA-Z0-9._-]+$/.test(email);
    const isPaymentSelected = !!paymentMode;
    const hasMinimumProducts = selectedItems.length > 0;

    return isNameValid && isPhoneValid && isEmailValid && isPaymentSelected && hasMinimumProducts;
  };

  const validateFields = () => {
    const newErrors = {
      name: '',
      phoneNumber: '',
      email: '',
      paymentMode: '',
      products: ''
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

    if (selectedItems.length === 0) {
      newErrors.products = 'Add at least one product';
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== '');
  };


  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._-]+@gmail\.com$/;
    return emailRegex.test(email);
  };

  const calculateTotal = () => {
    return selectedItems?.reduce((acc, item) => acc + item.id * item.quantity, 0).toFixed(2);
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
        userEmail: email + '@coherent.in',
        userPhone: phoneNumber,
        paymentMode: paymentMode,
        products: selectedItems.map(item => ({
          productId: item.productId,
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

  const handlePhoneNumberChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPhoneNumber(value);

    // Only fetch when 10 digits entered
    if (value.length === 10) {
      setIsLoadingUser(true);
      try {
        const userData = await getUserDetails(value);
        if (userData?.userName && userData?.userEmail) {
          setName(userData.userName);
          setEmail(userData.userEmail.split('@')[0]); // Remove @coherent.in
        }
      } catch (error) {
        setName('');
        setEmail('');
        console.error('Error:', error);
      } finally {
        setIsLoadingUser(false);
      }
    } else if (value.length < 10) {
      setName('');
      setEmail('');
    }
  };

  const initializeScanner = () => {
    scannerRef.current = new Html5QrcodeScanner("qr-reader", {
      fps: 10,
      qrbox: 350,
    }, false);

    scannerRef.current.render(onScanSuccess, onScanError);
  };

  const onScanSuccess = async (decodedText: string) => {
    try {
      const productId = parseInt(decodedText);

      if (scannedBarcodes.has(productId)) {
        errorAudioRef.current.play();
        Toasts({
          message: 'This product is already in your order',
          type: 'error'
        });
        return; // Keep scanner open
      }
      const productInfo = await getProductInfoById(productId);

      if (productInfo) {
        successAudioRef.current.play();
        const newItem = {
          id: productInfo.id,
          productId: productInfo.productId,
          productName: productInfo.productName,
          sellingPrice: productInfo.sellingPrice,
          image: productInfo.productImage,
          mrpPrice: productInfo.mrpPrice,
          quantity: 1,
          weightage: productInfo.weightage,
          mfgDate: productInfo.mfgDate,
          expDate: productInfo.expDate
        };

        setSelectedItems(prev => {
          const existingItem = prev.find(item => item.id === newItem.id);
          if (existingItem) {
            errorAudioRef.current.play();
            return prev
          } else {
            return [...prev, newItem];
          }
        });

      }
    } catch (error) {
      errorAudioRef.current.play();
      console.error('Error processing scanned code:', error);
      Toasts({ message: 'Error processing scanned code', type: 'error' });
    }
  };

  const onScanError = (error: any) => {
    errorAudioRef.current.play();
    console.warn(error);
  };

  const stopScanner = () => {
    if (scannerRef.current) {
      scannerRef.current.clear();
    }
  };

  useEffect(() => {
    return () => {
      stopScanner();
    };
  }, []);

  // Update QR Icon click handler
  const handleQrIconClick = () => {
    setIsQrScannerOpen(true);
    setTimeout(() => {
      initializeScanner();
    }, 100);
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
          <IconButton
            size="medium"
            onClick={handleQrIconClick}
            sx={{
              '&:hover': {
                backgroundColor: '#74D52B)'
              }
            }}
          >
            <QrCode2Icon sx={{
              '&:hover': {
                color: '#74D52B)'
              }
            }} />
          </IconButton>
        </Box>

        <Dialog
          open={isQrScannerOpen}
          onClose={() => {
            stopScanner();
            setIsQrScannerOpen(false);
          }}
          maxWidth="sm"
          fullWidth
        >
          <DialogContent>
            <IconButton
              sx={{ position: 'absolute', right: 8, top: 8 }}
              onClick={() => {
                stopScanner();
                setIsQrScannerOpen(false);
              }}
            >
              <CloseIcon />
            </IconButton>
            <div id="qr-reader" style={{ width: '100%' }} />
          </DialogContent>
        </Dialog>

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
                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  justifyContent="flex-end" // Add this
                  sx={{
                    width: '100%',  // Add this
                    marginLeft: 'auto' // Add this if needed
                  }}
                >
                  <IconButton
                    size="small"
                    onClick={() => {
                      setSelectedItems(prevItems =>
                        prevItems.map(item =>
                          item.id === item.id
                            ? { ...item, quantity: item.quantity - 1 }
                            : item
                        ).filter(item => item.quantity > 0) // Remove items with 0 quantity
                      )
                    }}
                  >
                    <RemoveIcon sx={{ color: 'red' }} />
                  </IconButton>
                  <TextField
                    size="small"
                    type="number"
                    value={item.quantity}
                    onChange={(e) => {
                      const newValue = parseInt(e.target.value) || '';
                      const validQuantity = Math.min(Math.max(Number(newValue), 0), 999);

                      setSelectedItems((prevItems) =>
                        prevItems.map((i) =>
                          i.id === item.id
                            ? { ...i, quantity: validQuantity }
                            : i
                        )

                      );
                    }}
                    InputProps={{
                      inputProps: {
                        min: 1,
                        max: 999,
                        style: {
                          textAlign: 'center',
                          MozAppearance: 'textfield',
                        }
                      },
                      sx: {
                        '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
                          '-webkit-appearance': 'none',
                          margin: 0,
                          borderRadius: '4px',
                          backgroundColor: '#f5f5f5',
                          '&:hover': {
                            backgroundColor: '#eeeeee'
                          }
                        }
                      },
                    }}
                    sx={{
                      width: '70px',
                      '& input': {
                        padding: '6px',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        color: '#333'
                      },
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: '#ddd',
                        },
                        '&:hover fieldset': {
                          borderColor: '#999',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#666',
                        }
                      }
                    }}
                  />

                  <IconButton
                    size="small"
                    onClick={() => {
                      setSelectedItems((prevItems) =>
                        prevItems.map((i) =>
                          i.id === item.id
                            ? { ...i, quantity: i.quantity + 1 }
                            : i
                        )
                      );
                    }}
                  >
                    <AddIcon sx={{ color: '#74D52B' }} />
                  </IconButton>
                </Stack>

                {/* Row 3: Product Price */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    marginTop: 1,
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                    ₹ {(item.id * item.quantity).toFixed(2)}
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
            backgroundColor: '#fff',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            padding: 3,
            marginTop: 2
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography color="text.secondary">Subtotal:</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography align="right">
                ₹{selectedItems.reduce((sum, item) => sum + (item.id * item.quantity), 0).toFixed(2)}
              </Typography>
            </Grid>

            {/* <Grid item xs={6}>
              <Typography color="text.secondary">GST (18%):</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography align="right">
                ₹{(selectedItems.reduce((sum, item) => sum + (item.id * item.quantity), 0) * 0.18).toFixed(2)}
              </Typography>
            </Grid> */}

            <Grid item xs={6}>
              <Typography variant="h6" fontWeight="bold">Total:</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="h6" align="right" fontWeight="bold">
                ₹{(selectedItems.reduce((sum, item) => sum + (item.id * item.quantity), 0)).toFixed(2)}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ mt: 2, borderTop: '1px solid #e0e0e0', pt: 2 }}>
                <Button
                  variant="contained"
                  fullWidth
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
                  onClick={() => setIsModalOpen(true)}
                >
                  Confirm
                </Button>
              </Box>
            </Grid>
          </Grid>
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
            height: '90vh',
            display: 'flex',
            flexDirection: 'column'
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
        </DialogTitle>
        <DialogContent
          sx={{
            flex: 1,
            overflowY: 'auto',
            padding: '20px',
            '&::-webkit-scrollbar': {
              width: '8px'
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: '#bdbdbd',
              borderRadius: '4px'
            }
          }}
        >
          <Box sx={{ marginBottom: 2 }}>
            <Typography variant="h6">Billing Details</Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2, mt: 1 }}>
              <TextField
                label="Phone Number"
                value={phoneNumber}
                onChange={handlePhoneNumberChange}
                error={!!errors.phoneNumber}
                helperText={errors.phoneNumber}
                required
                fullWidth
                InputProps={{
                  endAdornment: isLoadingUser && (
                    <InputAdornment position="end">
                      <CircularProgress size={20} />
                    </InputAdornment>
                  )
                }}
                inputProps={{
                  maxLength: 10,
                  inputMode: 'numeric',
                  pattern: '[0-9]*'
                }}
              />

              <TextField
                label="Customer Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                error={!!errors.name}
                helperText={errors.name}
                required
                fullWidth
                disabled={isLoadingUser}
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
              fullWidth
              disabled={isLoadingUser}
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
                      @coherent.in
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
          <Box sx={{ height: '400px', display: 'flex', flexDirection: 'column' }}>
            {/* Fixed Header */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "60px 2fr 1fr 1fr",
                gap: 2,
                p: 2,
                borderBottom: '1px solid #e0e0e0',
                backgroundColor: '#f5f5f5',
                position: 'sticky',
                top: 0,
                zIndex: 1,
              }}
            >
              <Typography variant="subtitle2">Image</Typography>
              <Typography variant="subtitle2">Product</Typography>
              <Typography variant="subtitle2" sx={{ textAlign: 'center' }}>Qty</Typography>
              <Typography variant="subtitle2" sx={{ textAlign: 'right' }}>Price</Typography>
            </Box>

            {/* Scrollable Content */}
            <Box sx={{
              overflowY: 'auto',
              flex: 1,
              '&::-webkit-scrollbar': {
                width: '8px',
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: '#bdbdbd',
                borderRadius: '4px',
              }
            }}>
              {selectedItems.map((item) => (
                <Box
                  key={item.id}
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "60px 2fr 1fr 1fr",
                    alignItems: "center",
                    gap: 2,
                    p: 2,
                    borderBottom: '1px solid #f0f0f0',
                    '&:hover': {
                      backgroundColor: '#fafafa'
                    }
                  }}
                >
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
                  <Typography variant="body2" sx={{ fontWeight: "bold", color: '#333' }}>
                    {item.productName}
                  </Typography>
                  <Typography sx={{ color: '#666', textAlign: 'center' }}>
                    × {item.quantity}
                  </Typography>
                  <Typography sx={{ fontWeight: "600", textAlign: 'right', color: '#333' }}>
                    ₹ {(item.id * item.quantity).toFixed(2)}
                  </Typography>
                </Box>
              ))}
            </Box>

          </Box>
        </DialogContent>
        <Box sx={{
          borderTop: '1px solid #e0e0e0',
          padding: '16px 24px',
          display: 'grid',
          gridTemplateColumns: '2fr auto',
          alignItems: 'center',
          gap: 2
        }}>
          <Typography variant="h6" fontWeight="bold">

          </Typography>
          <Typography fontWeight="bold" sx={{ fontSize: 18 }} >
            Total Amount : ₹ {calculateTotal()}
          </Typography>
        </Box>
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
