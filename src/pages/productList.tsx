import React, { useEffect, useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Box, Paper, Typography, } from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { getAdminProductList } from "../utils/api-collection";

interface ProductData {
    id: number;
    productName: string;
    quantity: string;
    weightage: string;
    costPrice: number;
    sellingPrice: number;
    mrpPrice: number;
}

interface ProductListResponse {
    data: ProductData[];
}

const ProductListPage: React.FC = () => {
    const [rows, setRows] = useState<ProductData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [_selectedInvoiceUrl, setSelectedInvoiceUrl] = useState<string | null>(null);

    const columns: GridColDef[] = [
        { field: "id", headerName: "Product ID", flex: 0.5, headerAlign: "center", align: "center" },
        { field: "productName", headerName: "Product Name", flex: 1.5, headerAlign: "center", align: "center" },
        { field: "quantity", headerName: "Quantity", flex: 1, headerAlign: "center", align: "center" },
        { field: "weightage", headerName: "Weight", flex: 1, headerAlign: "center", align: "center" },
        { field: "costPrice", headerName: "Cost Price", flex: 1, headerAlign: "center", align: "center" },
        { field: "sellingPrice", headerName: "Selling Price", flex: 1, headerAlign: "center", align: "center" },
        { field: "mrpPrice", headerName: "MRP Price", flex: 1, headerAlign: "center", align: "center" },
        {
            field: "image",
            headerName: "Product Image",
            flex: 1,
            headerAlign: "center",
            align: "center",
            renderCell: (params) => (
                <img
                    src={`data:image/png;base64,${params.value}`} // Assuming base64 image encoding
                    alt="Product"
                    style={{ width: 50, height: 50, objectFit: "cover", borderRadius: 5 }}
                />
            ),
        },
    ];


    const loadProductList = async () => {
        try {
            setLoading(true);
            const data = await getAdminProductList() as ProductListResponse;

            const productsWithId = data.data.map((product, index) => ({
                ...product,
                id: product.id ?? index, // Fallback to index if id is undefined
            }));

            setRows(productsWithId);
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error("Error fetching product data:", error.message);
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

    useEffect(() => {
        loadProductList();
    }, []);

    return (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <Paper
                elevation={6}
                sx={{
                    width: "100%",
                    maxWidth: "1450px",
                    borderRadius: "12px",
                    overflow: "hidden",


                }}
            >
                {/* Header Section */}
                <Box sx={{ background: "linear-gradient(to right,rgb(253, 230, 114),rgb(253, 184, 115))", color: "#fff", p: 3 }}>
                    <Typography variant="h4" fontWeight="bold">Products List</Typography>
                    <Typography variant="subtitle1">Detailed overview of all Products</Typography>
                </Box>

                {/* Data Table */}
                <Box sx={{ p: 2 }}>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        loading={loading}
                        getRowId={(row) => row.id} 
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
                                background: "linear-gradient(to right,rgb(253, 230, 114),rgb(253, 184, 115))",
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
        </Box>

    );
};

export default ProductListPage;