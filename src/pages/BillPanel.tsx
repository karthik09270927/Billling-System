import React, { useCallback, useEffect, useRef, useState } from "react";
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
  Tooltip,
  Badge,
  Divider,
  debounce,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  StepConnector,
  styled,
  stepConnectorClasses,
} from "@mui/material";
import { useSelectedItems } from "../Hooks/productContext";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { getProductInfoById, getUserDetails, saveBill } from "../utils/api-collection";
import QrCode2Icon from '@mui/icons-material/QrCode2';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import { Html5QrcodeScanner } from "html5-qrcode";
import successSound from '../assets/sounds/success.mp3';
import errorSound from '../assets/sounds/error.mp3';
import { showErrorToast, showSuccessToast } from "../utils/toast";
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import logo from '../assets/bgremove (2).png';
import NoItemSelect from '../assets/No Item Select.jpg';
import noItem from '../assets/no-data.png';
import PersonIcon from '@mui/icons-material/Person';
import PaymentIcon from '@mui/icons-material/Payment';
import CreditCard from "./CreditCard";
import UPIPayment from "./UPIPayment";
import CashPayment from "./CashPayment";

interface RightPanelProps {
  customerName?: string;
}

const RightPanel: React.FC<RightPanelProps> = ({ customerName }) => {
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
  const [paymentMode, setPaymentMode] = useState<'Cash' | 'Card' | 'UPI'>('Cash');
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [scannedBarcodes, setScannedBarcodes] = useState<Set<number>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [isShowingError, setIsShowingError] = useState(false);
  const [activeStep, setActiveStep] = useState(0);


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
    setActiveStep(0);
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

  const resetCart = () => {
    setSelectedItems([]);
    scannedBarcodes.clear();
    setIsModalOpen(false);
    setIsFullScreen(false);
    setActiveStep(0);
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
    // if (!email) {
    //   newErrors.email = 'Email is required';
    // } else if (!/^[a-zA-Z0-9._-]+$/.test(email)) {
    //   newErrors.email = 'Invalid email format';
    // }

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
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



  const calculateTotal = () => {
    return selectedItems?.reduce((acc, item) => acc + item.mrpPrice * item.quantity, 0).toFixed(2);
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
        userEmail: email,
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
      showSuccessToast('Order placed successfully');
      resetCart();
      setIsFullScreen(false);
      setIsModalOpen(false);
      setSelectedItems([]);
      resetForm();
    } catch (error: any) {
      console.error('Order placement failed:', error);
      showErrorToast('Failed to place order');
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
          // setEmail(userData.userEmail.split('@')[0]); // Remove @coherent.in
          setEmail(userData.userEmail);
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

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setName(value);
    if (value.trim().length >= 3) {
      setErrors(prev => ({ ...prev, name: '' }));
    }
  };

  // const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const value = e.target.value;
  //   const baseEmail = value.replace(/@coherent\.in$/, '');
  //   setEmail(baseEmail);
  //   if (baseEmail.trim()) {
  //     setErrors(prev => ({ ...prev, email: '' }));
  //   }
  // };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Set the email directly without modifying it
    setEmail(value);

    // Check if the email is not empty
    if (value) {
      setErrors(prev => ({ ...prev, email: '' }));
    }
  };


  // Add debounced error handler
  const handleDuplicateError = useCallback(
    debounce((productName: string) => {
      if (!isShowingError) {
        setIsShowingError(true);
        errorAudioRef.current.play();
        showErrorToast(`${productName} is already in cart`);

        // Reset after 2 seconds
        setTimeout(() => {
          setIsShowingError(false);
        }, 2000);
      }
    }, 500),
    [isShowingError]
  );

  const handleOpenModal = () => {
    setActiveStep(0);
    setIsModalOpen(true);
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
        showErrorToast('This product is already in your order');
        return;
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
            // errorAudioRef.current.play();
            // showErrorToast(`${productInfo.productName} is already in cart`);
            handleDuplicateError(productInfo.productName);
            return prev
          } else {
            showSuccessToast(`${productInfo.productName} 'added successfully'`);
            return [...prev, newItem];
          }
        });

      }
    } catch (error) {
      errorAudioRef.current.play();
      console.error('Error processing scanned code:', error);
      showErrorToast('Error processing scanned code');
    }
  };

  const onScanError = (error: any) => {
    errorAudioRef.current.play();
    console.warn(error);
  };

  const stopScanner = () => {
    try {
      if (scannerRef.current) {
        // Stop the scanner and release camera
        scannerRef.current.stop().then(() => {
          scannerRef.current.clear();
          // Release camera stream
          const videoElement = document.querySelector('video');
          if (videoElement && videoElement.srcObject) {
            const tracks = (videoElement.srcObject as MediaStream).getTracks();
            tracks.forEach(track => track.stop());
            videoElement.srcObject = null;
          }
        });
      }
    } catch (error) {
      console.error('Error stopping scanner:', error);
    }
  };

  const filteredItems = (selectedItems ?? []).filter(item =>
    item.productName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    return () => {
      stopScanner();
    };
  }, []);

  const CustomConnector = styled(StepConnector)(({ theme }) => ({
    [`&.${stepConnectorClasses.alternativeLabel}`]: {
      top: 22,
    },
    [`&.${stepConnectorClasses.active}`]: {
      [`& .${stepConnectorClasses.line}`]: {
        backgroundImage: 'linear-gradient(95deg, #74D52B 0%, #65BA25 100%)',
      },
    },
    [`&.${stepConnectorClasses.completed}`]: {
      [`& .${stepConnectorClasses.line}`]: {
        backgroundImage: 'linear-gradient(95deg, #74D52B 0%, #65BA25 100%)',
      },
    },
    [`& .${stepConnectorClasses.line}`]: {
      height: 3,
      border: 0,
      backgroundColor: '#eaeaf0',
      borderRadius: 1,
      transition: 'all 0.5s ease',
    },
  }));

  // Update QR Icon click handler
  const handleQrIconClick = () => {
    setIsQrScannerOpen(true);
    setTimeout(() => {
      initializeScanner();
    }, 100);
  };

  const PaymentContent = () => {
    switch (paymentMode) {
      case 'Cash':
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <CashPayment
              amount={parseFloat(calculateTotal())}
              onSubmit={handleConfirmOrder}
            />
          </Box>
        );
      case 'Card':
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <CreditCard
              onSubmit={handleConfirmOrder}
              amount={parseFloat(calculateTotal())}
              email={email}
              onClose={() => {
                setIsModalOpen(false);
                setIsFullScreen(false);
                resetForm();
              }}
            />
          </Box>
        );
      case 'UPI':
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <UPIPayment
              amount={parseFloat(calculateTotal())}
              onSubmit={handleConfirmOrder}
              email={email}
            />
          </Box>
        );
      default:
        return null;
    }
  };


  const steps = [
    {
      label: 'Customer Information',
      icon: <PersonIcon />,
      content: (
        <Box>
          <Box sx={{ marginBottom: 2 }}>
            <Typography variant="h6">Billing Details</Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2, mt: 1 }}>
              <TextField
                label="Phone Number"
                value={phoneNumber}
                onChange={handlePhoneNumberChange}
                error={!!errors.phoneNumber}
                helperText={errors.phoneNumber}
                fullWidth
                InputProps={{
                  endAdornment: isLoadingUser && (
                    <InputAdornment position="end">
                      <CircularProgress size={20} sx={{ color: '#65BA25' }} />
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
                onChange={handleNameChange}
                error={!!errors.name}
                helperText={errors.name}
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
              onChange={handleEmailChange}
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
                    ₹ {(item.mrpPrice * item.quantity).toFixed(2)}
                  </Typography>
                </Box>
              ))}
            </Box>

          </Box>
        </Box>
      )
    },
    {
      label: 'Payment Options',
      icon: <PaymentIcon />,
      content: (
        <Box>
          <Box sx={{
            marginBottom: 2,
            ...(errors.paymentMode && {
              '& .MuiButton-root': {
                borderColor: '#d32f2f'
              }
            })
          }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
              {['Cash', 'Card', 'UPI'].map((mode) => (
                <Button
                  key={mode}
                  variant={paymentMode === mode ? "contained" : "outlined"}
                  onClick={() => {
                    setPaymentMode(mode as 'Cash' | 'Card' | 'UPI');
                    setErrors({ ...errors, paymentMode: '' });
                  }}
                  fullWidth
                  sx={{
                    bgcolor: paymentMode === mode ? "#74D52B" : "transparent",
                    color: paymentMode === mode ? "white" : "#74D52B",
                    borderColor: errors.paymentMode ? "#d32f2f" : "#74D52B",
                    '&:hover': {
                      bgcolor: paymentMode === mode ? "#65BA25" : "#74D52B10",
                    }
                  }}
                >
                  {mode}
                </Button>
              ))}
            </Box>

            {/* Payment Component Container */}
            <Box sx={{
              mt: 3,
              display: 'flex',
              justifyContent: 'center',
              minHeight: '200px'
            }}>
              <PaymentContent />
            </Box>

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
      )
    }
  ]

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
          <Box sx={{
            display: 'flex',
            flex: 1,
          }}>
            <CardMedia
              component="img"
              src={logo}
              alt="Logo"
              sx={{
                width: 30,
                height: 30,
                objectFit: 'contain',
              }}
            />
            <Typography sx={{ fontWeight: "bold", color: '#74D52B', fontSize: 20 }}>
              FRESH HYPERMARKET
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton
              size="medium"
              onClick={() => setIsFullScreen(true)}
              sx={{
                '&:hover': {
                  backgroundColor: '#fefae0'
                }
              }}
            >
              <Tooltip title="Expand View" placement="top" arrow>
                <FullscreenIcon />
              </Tooltip>
            </IconButton>
            <IconButton
              size="medium"
              onClick={handleQrIconClick}
              sx={{
                '&:hover': {
                  backgroundColor: '#fefae0'
                }
              }}
            >
              <Tooltip title="Scan the barcode" placement="top" arrow>
                <QrCode2Icon />
              </Tooltip>
            </IconButton>
          </Box>
        </Box>

        <Dialog
          open={isQrScannerOpen}
          onClose={() => {
            stopScanner();
            setIsQrScannerOpen(false);
          }}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 10,
              minHeight: '400px'
            }
          }}
        >
          <DialogTitle sx={{
            bgcolor: '#fbfbe5',
            color: 'black',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <Typography variant="h6" fontWeight="bold">
              Scan Product Barcode
            </Typography>
            <IconButton
              onClick={() => {
                stopScanner();
                setIsQrScannerOpen(false);
              }}
              sx={{
                color: 'black',
                '&:hover': {
                  bgcolor: '#e0e0e0'
                }
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>



          <DialogContent sx={{
            p: 3,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            mt: 1
          }}>
            <Box
              sx={{
                border: '2px dashed #74D52B',
                borderRadius: 8,
                p: 2,
                bgcolor: '#f5f5f5',
                position: 'relative',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                transition: 'all 0.3s ease'
              }}
            >
              <div id="qr-reader" style={{ width: '100%', borderRadius: 10 }} />
            </Box>

            <Typography
              variant="body2"
              color="text.secondary"
              align="center"
              sx={{
                bgcolor: '#e8f5e9',
                p: 2,
                borderRadius: 2,
                border: '1px solid #74D52B'
              }}
            >
              Position the barcode within the frame to scan
            </Typography>
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
                  padding: 2,
                  borderBottom: '2px solid #e0e0e0',

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
                  <Badge
                    badgeContent={`${item.weightage}`}
                    color="primary"
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'right'
                    }}
                    sx={{
                      '& .MuiBadge-badge': {
                        backgroundColor: '#74D52B',
                        color: 'white',
                        fontSize: '12px',
                        padding: '0 6px',
                        minWidth: '45px',
                        height: '20px',
                        borderRadius: '10px'
                      }
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
                  </Badge>
                  <Typography variant="body2" sx={{ fontWeight: "bold", mt: 1 }}>
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
                        prevItems.map(product => {
                          if (product.id === item.id) {
                            // If quantity is 1, this product will be filtered out
                            return { ...product, quantity: product.quantity - 1 };
                          }
                          return product;
                        }).filter(product => product.quantity > 0) // Remove products with 0 quantity
                      );
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
                    ₹ {(item.mrpPrice * item.quantity).toFixed(2)}
                  </Typography>
                </Box>
              </Box>
            ))
          ) : (
            <Box
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "50vh",
                gap: 2
              }}
            >
              <img
                src={noItem}
                alt="No products found"
                style={{
                  width: "250px",
                  height: "250px",
                  objectFit: "contain"
                }}
              />
              <Typography
                variant="h6"
                sx={{
                  color: "#666",
                  textAlign: "center"
                }}
              >
                No Items Added
              </Typography>
            </Box>
          )}
        </Box>


        <Box
          sx={{
            backgroundColor: '#fbfbe5',
            // borderTop: '3px solid #e0e0e0',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            padding: 3,
            marginTop: 2
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={6} md={6}>
              <Typography color="text.secondary">Subtotal:</Typography>
            </Grid>
            <Grid item xs={6} md={6}>
              <Typography align="right">
                ₹{selectedItems.reduce((sum, item) => sum + (item.mrpPrice * item.quantity), 0).toFixed(2)}
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
                ₹{(selectedItems.reduce((sum, item) => sum + (item.mrpPrice * item.quantity), 0)).toFixed(2)}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ mt: 2, borderTop: '2px solid #e0e0e0', pt: 2 }}>
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
                  onClick={handleOpenModal}
                >
                  Confirm
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>

      </Card>

      <Dialog
        fullScreen
        open={isFullScreen}
        onClose={() => setIsFullScreen(false)}
        maxWidth="lg"
        PaperProps={{
          sx: {
            width: '80%',
            maxHeight: '90vh',
            m: 'auto',
            borderRadius: 2,
            position: 'relative'
          }
        }}
      >

        <Box
          sx={{
            height: "60px",
            backgroundColor: "#fbfbe5",
            padding: "8px 16px",
            flexShrink: 0,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* Logo and Title Section */}
          <Box sx={{
            display: 'flex',
            alignItems: 'left',
            gap: 1,
            flex: 1,
            justifyContent: 'left'
          }}>
            <CardMedia
              component="img"
              src={logo}
              alt="Logo"
              sx={{
                width: 50,
                height: 50,
                objectFit: 'contain'
              }}
            />
            <Typography variant="h5" sx={{ fontWeight: "bold", color: '#74D52B', mt: 1 }}>
              FRESH HYPERMARKET
            </Typography>
          </Box>

          {/* Icons Section */}
          <Box sx={{
            display: 'flex',
            gap: 1,
            ml: 'auto'
          }}>

            <TextField
              size="small"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#74D52B' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                width: '200px',
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  '& fieldset': {
                    border: 'none'
                  },
                  '&:hover fieldset': {
                    border: 'none'
                  },
                  '&.Mui-focused fieldset': {
                    border: 'none'
                  }
                }
              }}
            />

            <IconButton
              size="medium"
              onClick={() => setIsFullScreen(false)}
              sx={{
                '&:hover': {
                  backgroundColor: '#fefae0'
                }
              }}
            >
              <Tooltip title="Close Expand" placement="top" arrow>
                <CloseIcon />
              </Tooltip>
            </IconButton>
            <IconButton
              size="medium"
              onClick={handleQrIconClick}
              sx={{
                '&:hover': {
                  backgroundColor: '#fefae0'
                }
              }}
            >
              <Tooltip title="Scan the barcode" placement="top" arrow>
                <QrCode2Icon />
              </Tooltip>
            </IconButton>
          </Box>
        </Box>


        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            padding: 2,
            scrollbarWidth: "thin",
            background: '#ffffff',
            borderBottom: '3px solid #fbfbe5'
          }}
        >
          <Grid container spacing={2}>
            {(selectedItems ?? []).length > 0 ? (
              // (selectedItems ?? []).map((item) => (
              (filteredItems ?? []).map((item) => (
                <Grid item xs={12} md={6} key={item.id}>
                  <Box
                    key={item.id}
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      marginBottom: 2,
                      padding: 2,
                      borderRadius: 8,
                      backgroundColor: '#f5f5f5',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',

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
                      <Badge
                        badgeContent={`${item.weightage}`}
                        color="primary"
                        anchorOrigin={{
                          vertical: 'top',
                          horizontal: 'right'
                        }}
                        sx={{
                          '& .MuiBadge-badge': {
                            backgroundColor: '#74D52B',
                            color: 'white',
                            fontSize: '12px',
                            padding: '0 6px',
                            minWidth: '45px',
                            height: '20px',
                            borderRadius: '10px'
                          }
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
                      </Badge>
                      <Typography variant="body2" sx={{ fontWeight: "bold", mt: 1 }}>
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
                            prevItems.map(product => {
                              if (product.id === item.id) {
                                // If quantity is 1, this product will be filtered out
                                return { ...product, quantity: product.quantity - 1 };
                              }
                              return product;
                            }).filter(product => product.quantity > 0) // Remove products with 0 quantity
                          );
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
                        ₹ {(item.mrpPrice * item.quantity).toFixed(2)}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              ))
            ) : (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                  minHeight: '350px',
                  width: '100%'
                }}
              >
                <img
                  src={NoItemSelect}
                  alt="No Product Added"
                  style={{
                    width: "250px",
                    height: "250px",
                    objectFit: "contain"
                  }}
                />
                <Typography
                  variant="h6"
                  sx={{
                    color: "#666",
                    textAlign: "center"
                  }}
                >
                  No Product's Added
                </Typography>
              </Box>
            )}
          </Grid>

        </Box>


        <Box
          sx={{
            backgroundColor: '#fbfbe5',
            // borderTop: '3px solid #e0e0e0',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            padding: 3,
            marginTop: 2,
            display: 'flex',
            justifyContent: 'center'
          }}
        >
          <Grid container spacing={2} sx={{

          }}>
            <Grid item xs={6} md={6}>
              <Typography color="text.secondary">Subtotal:</Typography>
            </Grid>
            <Grid item xs={6} md={6}>
              <Typography align="right">
                ₹{selectedItems.reduce((sum, item) => sum + (item.mrpPrice * item.quantity), 0).toFixed(2)}
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

            <Grid item xs={6} md={6}>
              <Typography variant="h6" fontWeight="bold">Total:</Typography>
            </Grid>
            <Grid item xs={6} md={6}>
              <Typography variant="h6" align="right" fontWeight="bold">
                ₹{(selectedItems.reduce((sum, item) => sum + (item.mrpPrice * item.quantity), 0)).toFixed(2)}
              </Typography>
            </Grid>

            <Grid item xs={12} md={12}>
              <Box sx={{
                mt: 2,
                borderTop: '2px solid #e0e0e0',
                pt: 2,
                display: 'flex',
                justifyContent: 'center'
              }}>
                <Button
                  variant="contained"
                  sx={{
                    height: "50px",
                    width: "50%",
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
      </Dialog>

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
        maxWidth="md"
        PaperProps={{
          sx: {
            borderRadius: 10,
            overflow: 'hidden',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
            height: '100vh',
            weight: '100%',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#ffffff'
          }
        }}
      >
        <DialogTitle
          sx={{
            textAlign: 'center',
            color: '#333',
            fontWeight: 800,
            '& .MuiTypography-root': {
              fontSize: '2rem'
            }
          }}
        >
          Confirm Order
        </DialogTitle>
        <DialogContent
          sx={{
            flex: 1,
            overflowY: 'auto',
            '&::-webkit-scrollbar': {
              width: '8px'
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: '#bdbdbd',
              borderRadius: '4px'
            }
          }}
        >


          <Box>
            {/* Horizontal Stepper with Icons and Labels */}
            <Box sx={{
              position: 'sticky',
              top: 0,
              // background: 'linear-gradient(135deg, #799F0C 0%, #ACBB78 100%)',
              backgroundColor: '#fbfbe5',
              zIndex: 10,
              pt: 3,
              pb: 2,
              px: 3,
              borderRadius: 16
            }}>
              <Stepper
                activeStep={activeStep}
                alternativeLabel
                connector={<CustomConnector />}
              >
                {steps.map((step, index) => (
                  <Step key={step.label}>
                    <StepLabel
                      StepIconComponent={() => (
                        <Box sx={{
                          width: 45,
                          height: 45,
                          borderRadius: '50%',
                          bgcolor: activeStep >= index ? '#74D52B' : '#e0e0e0',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                        }}>
                          {step.icon}
                        </Box>
                      )}
                      sx={{
                        '& .MuiStepLabel-label': {
                          color: activeStep >= index ? '#74D52B' : '#000000',
                          fontWeight: activeStep === index ? 600 : 400,
                          transition: 'all 0.3s ease'
                        }
                      }}
                    >
                      {step.label}
                    </StepLabel>
                  </Step>
                ))}
              </Stepper>
            </Box>

            {/* Step Content */}
            <Box sx={{
              flex: 1,
              p: 5,
              overflowY: 'hidden',
              '&::-webkit-scrollbar': {
                width: '8px'
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: '#bdbdbd',
                borderRadius: '4px'
              }
            }}>
              {steps[activeStep].content}
            </Box>

            {/* Navigation Buttons */}
            <Box sx={{
              bottom: 0,
              p: 2,
              borderTop: '3px solid #eee',
              display: 'flex',
              justifyContent: 'space-between'
            }}>
              {activeStep > 0 && (
                <Button
                  onClick={() => setActiveStep(prev => prev - 1)}
                  variant="outlined"
                  sx={{
                    borderColor: "#74D52B",
                    color: "#74D52B",
                    '&:hover': {
                      borderColor: "#65BA25",
                      bgcolor: "rgba(116, 213, 43, 0.1)"
                    }
                  }}
                >
                  Back
                </Button>
              )}
              {activeStep === 0 && (
                <Button
                  variant="contained"
                  onClick={() => {
                    if (validateFields()) {
                      setActiveStep(prev => prev + 1);
                    } else {
                      showErrorToast('Fill all required fields');
                    }
                  }}
                  sx={{
                    bgcolor: "#74D52B",
                    '&:hover': { bgcolor: "#65BA25" }
                  }}
                >
                  Next
                </Button>
              )}
            </Box>
          </Box>
        </DialogContent>

        <Box sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#fefae0',
          padding: '10px 16px',
          mt: 1
        }}>
          <Typography
            fontWeight="bold"
            sx={{
              fontSize: 22,
              textAlign: 'center',
            }}
          >
            Total Amount : ₹ {calculateTotal()}
          </Typography>
        </Box>
        <DialogActions
          sx={{
            display: 'flex',
            justifyContent: 'center',
            gap: 2,
            backgroundColor: '#fefae0'
          }}
        >
          <Button onClick={() => {
            setIsModalOpen(false);
            setActiveStep(0);
            resetForm();
          }}
            color="secondary">
            <CloseIcon sx={{ fontSize: 30 }} />
          </Button>
          {/* <Button
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
          </Button> */}
        </DialogActions>
      </Dialog>


    </Grid >
  );
};

export default RightPanel;
