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
  const [paymentMode, setPaymentMode] = useState<string>("");

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._-]+@gmail\.com$/;
    return emailRegex.test(email);
  };

  const calculateTotal = () => {
    return selectedItems?.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2);
  };

  const handlePlaceOrder = async () => {
    setIsPlacingOrder(true); // Show loading indicator

    try {
      const response = await fetch("https://api.example.com/place-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerName: name,
          phoneNumber,
          orderNumber,
          items: selectedItems,
          totalPrice: calculateTotal(),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Order placed successfully:", data);

        setSelectedItems([]); // Clear selected items
        setIsOrderPlaced(true); // Mark order as placed
        setIsModalOpen(false); // Close the modal
      } else {
        console.error("Failed to place the order:", response.statusText);
      }
    } catch (error) {
      console.error("Error placing the order:", error);
    } finally {
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
                      width: 60,
                      height: 60,
                      objectFit: "contain",
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
            backgroundColor: "#fbfbe5",
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
        onClose={() => setIsModalOpen(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: 10,
            overflow: 'hidden',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
          }
        }}
      >        <DialogTitle
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
            <TextField
              label="Customer Name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Phone Number"
              type="number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Mail Id"
              type="email"
              value={email}
              onChange={(e) => {
                const value = e.target.value;
                // Remove @gmail.com if user types it manually
                const baseEmail = value.replace(/@gmail\.com$/, '');
                setEmail(baseEmail);
              }}
              error={email.length > 0 && !isValidEmail(email + '@gmail.com')}
              helperText={
                email.length > 0 && !isValidEmail(email + '@gmail.com')
                  ? 'Please enter a valid email'
                  : ''
              }
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
          <Box sx={{ marginBottom: 2 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2, marginTop: 1 }}>
              <Button
                variant={paymentMode === "Cash" ? "contained" : "outlined"}
                onClick={() => setPaymentMode("Cash")}
                fullWidth
                sx={{
                  bgcolor: paymentMode === "Cash" ? "#74D52B" : "transparent",
                  color: paymentMode === "Cash" ? "white" : "#74D52B",
                  borderColor: "#74D52B",
                  '&:hover': {
                    bgcolor: paymentMode === "Cash" ? "#65BA25" : "#74D52B10",
                  }
                }}
              >
                Cash
              </Button>
              <Button
                variant={paymentMode === "Card" ? "contained" : "outlined"}
                onClick={() => setPaymentMode("Card")}
                fullWidth
                sx={{
                  bgcolor: paymentMode === "Card" ? "#74D52B" : "transparent",
                  color: paymentMode === "Card" ? "white" : "#74D52B",
                  borderColor: "#74D52B",
                  '&:hover': {
                    bgcolor: paymentMode === "Card" ? "#65BA25" : "#74D52B10",
                  }
                }}
              >
                Card
              </Button>
              <Button
                variant={paymentMode === "Online" ? "contained" : "outlined"}
                onClick={() => setPaymentMode("Online")}
                fullWidth
                sx={{
                  bgcolor: paymentMode === "Online" ? "#74D52B" : "transparent",
                  color: paymentMode === "Online" ? "white" : "#74D52B",
                  borderColor: "#74D52B",
                  '&:hover': {
                    bgcolor: paymentMode === "Online" ? "#65BA25" : "#74D52B10",
                  }
                }}
              >
                UPI
              </Button>
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
          <Button onClick={() => setIsModalOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handlePlaceOrder}
            color="primary"
            variant="contained"
            disabled={isPlacingOrder}
            sx={{
              bgcolor: "#74D52B",
              '&:hover': {
                bgcolor: "#65BA25",
              },
            }}
          >
            {isPlacingOrder ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Place Order"}
          </Button>
        </DialogActions>
      </Dialog>


    </Grid>
  );
};

export default RightPanel;
