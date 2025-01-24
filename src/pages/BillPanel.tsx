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
} from "@mui/material";
import { useSelectedItems } from "../Hooks/productContext";

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
  const [paymentMode, setPaymentMode] = useState<string>("");


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
            backgroundColor: "#F0F0F0",
            padding: "8px",
            borderBottom: "1px solid #ccc",
            flexShrink: 0,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="body1" sx={{ fontWeight: "bold" }}>
            {customerName}
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: "bold", color: "#666" }}>
            Order #{orderNumber}
          </Typography>
        </Box>

        {/* Content Section */}
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
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 2,
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                  {item.name} x{item.quantity}
                </Typography>
                <Typography variant="body2" sx={{ color: "#777" }}>
                  ${(item.price * item.quantity).toFixed(2)}
                </Typography>
              </Box>
            ))
          ) : (
            <Typography variant="body2" sx={{ color: "#999", textAlign: "center" }}>
              No items selected.
            </Typography>
          )}
        </Box>

        {/* Footer Section */}
        <Box
          sx={{
            height: "80px",
            backgroundColor: "#F0F0F0",
            padding: 2,
            borderTop: "1px solid #ccc",
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{
              height: "50px",
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

      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Confirm Order</DialogTitle>
        <DialogContent>
          <Box sx={{ marginBottom: 2 }}>
            <Typography variant="h6">Billing Details</Typography>
            <TextField
              label="Customer Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Phone Number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              fullWidth
              margin="normal"
            />
          </Box>

          {/* Payment Mode Buttons */}
          <Box sx={{ marginBottom: 2 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2, marginTop: 1 }}>
              <Button
                variant={paymentMode === "Cash" ? "contained" : "outlined"}
                onClick={() => setPaymentMode("Cash")}
                fullWidth
              >
                Cash
              </Button>
              <Button
                variant={paymentMode === "Card" ? "contained" : "outlined"}
                onClick={() => setPaymentMode("Card")}
                fullWidth
              >
                Card
              </Button>
              <Button
                variant={paymentMode === "Online" ? "contained" : "outlined"}
                onClick={() => setPaymentMode("Online")}
                fullWidth
              >
                Online
              </Button>
            </Box>
          </Box>

          {/* Products List */}
          <Typography variant="h6">Products</Typography>
          {selectedItems.map((item) => (
            <Box key={item.id} sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
              <Typography>{item.name} x{item.quantity}</Typography>
              <Typography>${(item.price * item.quantity).toFixed(2)}</Typography>
            </Box>
          ))}
          <Box sx={{ mt: 2, textAlign: "right" }}>
            <Typography variant="h6">Total: ${calculateTotal()}</Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsModalOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handlePlaceOrder}
            color="primary"
            variant="contained"
            disabled={isPlacingOrder}
          >
            {isPlacingOrder ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Place Order"}
          </Button>
        </DialogActions>
      </Dialog>


    </Grid>
  );
};

export default RightPanel;
