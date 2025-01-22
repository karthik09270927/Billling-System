import React, { useState } from "react";
import { Box, Typography, Card, Button, Grid } from "@mui/material";

interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface RightPanelProps {
  customerName: string;
  orderNumber: string;
  selectedItems: OrderItem[];
  onPlaceOrder: () => void;
}

const RightPanel: React.FC<RightPanelProps> = ({
  customerName,
  orderNumber,
  selectedItems,
  onPlaceOrder,
}) => {
  const calculateTotal = () => {
    return selectedItems.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2);
  };

  return (
    <Grid item xs={12} md={4} sx={{ height: "100vh" }}>
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
          {selectedItems.length > 0 ? (
            selectedItems.map((item) => (
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
          <Box sx={{ marginTop: 2 }}>
            <Typography variant="h6" sx={{ textAlign: "right", fontWeight: "bold" }}>
              Total: ${calculateTotal()}
            </Typography>
          </Box>
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
            onClick={onPlaceOrder}
          >
            Place Order
          </Button>
        </Box>
      </Card>
    </Grid>
  );
};

export default RightPanel;
