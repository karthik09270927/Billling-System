import React, { useEffect, useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Card, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, Button, Box, Paper, Typography } from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";

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

const EditTable: React.FC = () => {
    const [rows, setRows] = useState<UserData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [selectedInvoiceUrl, setSelectedInvoiceUrl] = useState<string | null>(null);
    const [openAddProductModal, setOpenAddProductModal] = useState<boolean>(false); // New state for the "Add Product" modal

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
                    <VisibilityOutlinedIcon
                        sx={{
                            color: "green",
                            transition: "color 0.2s",
                        }}
                    />
                </button>
            ),
        }
    ];

    const loadUserList = async () => {
        try {
            setLoading(true);
            // Uncomment and modify as per your API call for loading data
            // const data = await fetchUserList() as UserHistoryResponse;
            // const usersWithId = data.data.map((user) => ({
            //     ...user,
            //     id: user.orderId,
            // }));
            // setRows(usersWithId);
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error("Error fetching user data:", error.message);
            } else {
                console.error("Unexpected error occurred");
            }
            setRows([]);
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetails = (invoiceUrl: string) => {
        setSelectedInvoiceUrl(invoiceUrl);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedInvoiceUrl(null);
    };

    // New handler for opening the "Add Product" modal
    const handleOpenAddProductModal = () => {
        setOpenAddProductModal(true);
    };

    const handleCloseAddProductModal = () => {
        setOpenAddProductModal(false);
    };

    useEffect(() => {
        loadUserList();
    }, []);

    return (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <Paper
                elevation={6}
                sx={{
                    width: "100%",
                    maxWidth: "1300px",
                    borderRadius: "12px",
                    overflow: "hidden",
                }}
            >
                {/* Header Section */}
                <Box sx={{ background: "linear-gradient(to right,rgb(253, 230, 114),rgb(253, 184, 115))", color: "#fff", p: 3 }}>
                    <Typography variant="h4" fontWeight="bold">Stock Details</Typography>
                    <Typography variant="subtitle1">Detailed overview of user activity</Typography>
                </Box>

                {/* Add Product Button */}
                <Box sx={{ display: "flex", justifyContent: "flex-end", p: 2 }}>
                    <Button
                        variant="contained"
                        sx={{ backgroundColor: "#f5f58e", color: "#000", borderRadius: "12px" }}
                        onClick={handleOpenAddProductModal} // Open Add Product modal
                    >
                        Add Product
                    </Button>
                </Box>

                {/* Data Table */}
                <Box sx={{ p: 2 }}>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        loading={loading}
                        getRowId={(row) => row.orderId}
                        autoHeight
                        sx={{
                            "& .MuiDataGrid-columnHeaders": {
                                backgroundColor: "rgb(240 245 255)",
                                color: "rgb(72 85 99)",
                                fontWeight: "bold",
                                letterSpacing: "0.5px",
                                borderBottom: "2px solid #e5e7eb",
                            },
                            "& .MuiDataGrid-cell": {
                                padding: "0.75rem",
                                border: "1px solid #e5e7eb",
                                fontSize: "14px",
                                transition: "background-color 0.3s",
                            },
                            "& .MuiDataGrid-footerContainer": {
                                backgroundColor: "rgb(240 245 255)",
                                borderTop: "1px solid #e5e7eb",
                            },
                        }}
                    />
                </Box>
            </Paper>

            {/* Invoice Dialog */}
            <Dialog open={openModal} onClose={handleCloseModal} maxWidth="lg" fullWidth>
                <DialogTitle>Invoice Details</DialogTitle>
                <DialogContent>
                    {/* Invoice Content */}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModal} color="primary">Close</Button>
                </DialogActions>
            </Dialog>

            {/* Add Product Dialog */}
            <Dialog open={openAddProductModal} onClose={handleCloseAddProductModal} maxWidth="lg" fullWidth>
                <DialogTitle>Add Product</DialogTitle>
                <DialogContent>
                    {/* Add Product Content */}
                    <Typography variant="body1">Here you can add the details for the new product.</Typography>
                    {/* Add product form goes here */}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseAddProductModal} color="primary">Close</Button>
                    <Button onClick={() => {}} color="primary">Save</Button> {/* Add Save functionality */}
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default EditTable;
