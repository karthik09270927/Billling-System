import React, { useEffect, useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Box, Paper, Typography } from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { fetchUserList } from "../utils/api-collection";
import { gridStyles } from "../styles/centralizedStyles";

interface UserData {
  orderId: number;
  userName: string;
  purchasedDate: string;
  totalAmount: string;
  phone: string;
  role: string;
  invoiceUrl: string;
}

interface UserHistoryResponse {
  data: UserData[];
}

const UserHistoryPage: React.FC = () => {
  const [rows, setRows] = useState<UserData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [_selectedInvoiceUrl, setSelectedInvoiceUrl] = useState<string | null>(null);

  // Define columns for the DataGrid
  const columns: GridColDef[] = [
    { field: "orderId", headerName: "Order ID", flex: 0.5, headerAlign: "center", align: "center" },
    { field: "userName", headerName: "User Name", flex: 1, headerAlign: "center", align: "center" },
    { field: "purchasedDate", headerName: "Purchased Date", flex: 1.5, headerAlign: "center", align: "center" },
    { field: "paymentMode", headerName: "Payment Mode", flex: 1, headerAlign: "center", align: "center" },
    { field: "totalAmount", headerName: "Total Amount", flex: 1, headerAlign: "center", align: "center" },
    {
      field: "invoice",
      headerName: "Invoice",
      flex: 0.8,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <button
          onClick={() => handleViewDetails(params.row.invoiceUrl)}
          style={{
            background: "transparent",
            border: "none",
            padding: 0,
            cursor: "pointer",
          }}
        >
          <VisibilityOutlinedIcon sx={{ color: "green", transition: "color 0.2s" }} />
        </button>
      ),
    },
  ];

  // Load user list data
  const loadUserList = async () => {
    try {
      setLoading(true);
      const { data } = await fetchUserList() as UserHistoryResponse;
      const usersWithId = data.map((user) => ({ ...user, id: user.orderId }));
      setRows(usersWithId);
    } catch (error) {
      console.error("Error fetching user data:", error instanceof Error ? error.message : "Unexpected error");
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle invoice view
  const handleViewDetails = (invoiceUrl: string) => {
    setSelectedInvoiceUrl(invoiceUrl);
    setOpenModal(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedInvoiceUrl(null);
  };

  // Fetch data on mount
  useEffect(() => {
    loadUserList();
  }, []);


  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
      <Paper elevation={6} sx={{ width: "100%", maxWidth: "1450px", borderRadius: "12px", overflow: "hidden" }}>
        {/* Header Section */}
        <Box sx={{ background: "linear-gradient(to right,rgb(253, 230, 114),rgb(253, 184, 115))", color: "#fff", p: 3 }}>
          <Typography variant="h4" fontWeight="bold">User History</Typography>
          <Typography variant="subtitle1">Detailed overview of user bills & activity</Typography>
        </Box>

        {/* Data Table */}
        <Box sx={{ p: 2 }}>
          <DataGrid
            rows={rows}
            columns={columns}
            loading={loading}
            getRowId={(row) => row.orderId}
            rowHeight={50}
            sx={gridStyles}
          />
        </Box>
      </Paper>

      {/* Invoice Dialog */}
      <Dialog open={openModal} onClose={handleCloseModal} maxWidth="lg" fullWidth>
        <DialogTitle>Invoice Details</DialogTitle>
        <DialogContent>
          {/* Content for Invoice (you can add content here as per your needs) */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserHistoryPage;
