import React, { useEffect, useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Button, Box, Paper, Typography, Grid, Modal, TextField, } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { getAdminEachProductDetail, getProductDetails, saveProductDetails } from "../utils/api-collection";
import { useCategory } from "../Hooks/useContext";
import CentralizeDatePicker from "../centralizedComponents/forms/DatePicker";
import { gridStyles } from "../styles/centralizedStyles";
import { useNavigate } from "react-router-dom";
interface ProductData {
    id: number;
    productName: string;
    quantity: string;
    productId: number;
    weightage: string;
    costPrice: number;
    sellingPrice: number;
    mrpPrice: number;
}

const EditTable: React.FC = () => {
    const [rows, setRows] = useState<ProductData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const { productId,productName } = useCategory();
    const navigate = useNavigate();
    const modalTitle = isEdit ? "Edit Product" : "Add Product";

    console.log("productName:", productName);
    

    const { control, handleSubmit, reset } = useForm({
        defaultValues: {
            id: null,
            productId: null,
            productName: productName || "",
            quantity: "",
            weightage: "",
            manufacturedate: "",
            expirydate: "",
            sellingPrice: 0,
            mrpPrice: 0,
            costPrice: 0
        },
    });

    const handleEditProducts = async (params: any) => {
        try {
            const response = await getAdminEachProductDetail(params.row.productId);
            const product = response[0];
            
            reset({
                id: product.id || null,
                productId: product.productId || null,
                productName: product.productName || "",
                quantity: product.quantity || "",
                weightage: product.weightage || "",
                manufacturedate: product.mfgDate || "",
                expirydate: product.expDate || "",
                sellingPrice: product.sellingPrice || 0,
                mrpPrice: product.mrpPrice || 0,
                costPrice: product.costPrice || 0
            });
        } catch (error: unknown) {
            console.error("Error fetching product details:", error);
        }
        setIsModalOpen(true);
        setIsEdit(true);
    };

    const columns: GridColDef[] = [
        {
            field: "serialNumber",
            headerName: "S.No",
            flex: 0.5,
            headerAlign: "center",
            align: "center",
            renderCell: (params) => rows.findIndex(row => row.id === params.id) + 1,
        },
        { field: "id", headerName: "Product ID", flex: 0.5, headerAlign: "center", align: "center" },
        { field: "productName", headerName: "Product Name", flex: 1.5, headerAlign: "center", align: "center" },
        {
            field: "productImage",
            headerName: "Product Image",
            flex: 1,
            headerAlign: "center",
            align: "center",
            renderCell: (params) => (
                <img
                    src={`data:image/jpeg;base64,${params.value}`} // Assuming base64 image encoding

                    alt="Product"
                    style={{ width: 50, height: 50, objectFit: "cover", }}
                />
            ),
        },
        { field: "mfgDate", headerName: "Mfg Date", flex: 1, headerAlign: "center", align: "center" },
        { field: "expDate", headerName: "Expiry Date", flex: 1, headerAlign: "center", align: "center" },
        { field: "weightage", headerName: "Weight", flex: 1, headerAlign: "center", align: "center" },
        {
            field: "costPrice",
            headerName: "Cost Price",
            flex: 1,
            headerAlign: "center",
            align: "center",
            renderCell: (params) => `₹ ${params.value}`,
        },
        {
            field: "mrpPrice",
            headerName: "MRP Price",
            flex: 1,
            headerAlign: "center",
            align: "center",
            renderCell: (params) => `₹ ${params.value}`,
        },
        {
            field: "sellingPrice",
            headerName: "Selling Price",
            flex: 1,
            headerAlign: "center",
            align: "center",
            renderCell: (params) => `₹ ${params.value}`,
        },
        {
            field: "editproduct",
            headerName: "Edit Product",
            // flex: 1,
            headerAlign: "center",
            align: "center",
            renderCell: (params) => (
                <Button
                    variant="contained"
                    fullWidth
                    sx={{
                        backgroundImage: "linear-gradient(to right, rgb(253, 230, 114), rgb(253, 184, 115))",
                        color: "#000",
                        borderRadius: "12px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "0.3s",
                        "&:hover": {
                            backgroundImage: "linear-gradient(to right, rgb(253, 210, 80), rgb(253, 164, 95))",
                            transform: "scale(1.05)",
                        },
                    }}
                    onClick={() => handleEditProducts(params)}
                >
                    Edit
                </Button>
            ),
        }

    ];

    const handleAddNewItem = () => {
        setIsModalOpen(true);
    };

    const handleBack = () => {
        navigate("/admin-dashboard");
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setIsEdit(false);
        reset({
            id: null,
            productId: null,
            productName: productName || "",
            quantity: "",
            weightage: "",
            manufacturedate: "",
            expirydate: "",
            sellingPrice: 0,
            mrpPrice: 0,
            costPrice: 0
        });

    };


    const onSubmit = async (data: any) => {
        try {
            const productList = {
                id: data.id || null,
                productId: data.productId || productId,
                quantity: data.quantity || "",
                mrpPrice: data.mrpPrice || 0,
                costPrice: data.costPrice || 0,
                sellingPrice: data.sellingPrice || 0,
                weightage: data.weightage || "",
                mfgDate: data.manufacturedate || "", 
                expDate: data.expirydate || "",     
            };
    
            console.log("Product List:", productList);
    
            const response = await saveProductDetails(productList);
            console.log("Product saved successfully:", response);
        } catch (error) {
            console.error("Error in submitting product:", error);
        }
        console.log("Submit data", data);
        reset();  // Reset the form after submission
        setIsModalOpen(false);  // Close the modal after submission
    };

    const loadProductList = async () => {
        try {
            setLoading(true);
            const data = await getProductDetails(productId)
            console.log("productsWithId", data);

            setRows(data);
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

    console.log("datA", rows);


    useEffect(() => {
        loadProductList();
    }, []);

    return (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4, padding: "auto" }}>
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
                <Box display="flex" justifyContent="space-between" sx={{ background: "linear-gradient(to right,rgb(253, 230, 114),rgb(253, 184, 115))", color: "#fff", p: 3 }}>

                    <Box>
                        <Typography variant="h4" fontWeight="bold">Stock Details</Typography>
                        <Typography variant="subtitle1">Detailed overview of user activity</Typography>
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
                    <Button
                            variant="contained"
                            onClick={handleBack}
                            sx={{ backgroundColor: "#eb4034", borderRadius: "12px", marginRight: "10px" }}
                        // onClick={handleOpenAddProductModal}
                        >
                           Back
                        </Button>
                        <Button
                            variant="contained"
                            onClick={handleAddNewItem}
                            sx={{ backgroundColor: "#f5f58e", color: "#000", borderRadius: "12px" }}
                        // onClick={handleOpenAddProductModal}
                        >
                            Add Stock
                        </Button>
                    </Box>

                </Box>

                {/* Data Table */}
                <Box sx={{ p: 2 }}>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        loading={loading}
                        hideFooter
                        rowHeight={75}
                        sx={gridStyles}
                    />
                </Box>
            </Paper>


            <Modal
                open={isModalOpen}
                onClose={handleCloseModal}
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflowY: "scroll",
                }}
            >
                <Box
                    sx={{
                        backgroundColor: "#FBFBE5",
                        borderRadius: "12px",
                        boxShadow: 24,
                        p: 4,
                        width: { xs: "100%", sm: "80%", md: "60%" },
                    }}
                >
                    <Typography
                        variant="h5"
                        sx={{ textAlign: "center", mb: 3, fontWeight: "bold", color: "#333" }}
                    >
                        {modalTitle}
                    </Typography>

                    <Grid container spacing={2} sx={{ mb: 3 }}>
                        <Grid item xs={12} sm={3}>
                            <Controller
                                name="productName"
                                control={control}
                                render={({ field }) => (
                                    <TextField {...field} fullWidth variant="outlined" label="Product Name" />
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} sm={3}>
                            <CentralizeDatePicker
                                name="manufacturedate"
                                label="Manufacture Date"
                                control={control}
                                defaultValue=""
                                format="DD-MM-YYYY"
                                size="small"
                            />
                        </Grid>

                        <Grid item xs={12} sm={3}>
                            <CentralizeDatePicker
                                name="expirydate"
                                label="Expiry Date"
                                control={control}
                                defaultValue=""
                                format="DD-MM-YYYY"
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <Controller
                                name="quantity"
                                control={control}
                                render={({ field }) => (
                                    <TextField {...field} fullWidth variant="outlined" label="Quantity" type="number" />
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} sm={3}>
                            <Controller
                                name="weightage"
                                control={control}
                                render={({ field }) => (
                                    <TextField {...field} fullWidth variant="outlined" label="Weight" />
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} sm={3}>
                            <Controller
                                name="costPrice"
                                control={control}
                                render={({ field }) => (
                                    <TextField {...field} fullWidth variant="outlined" label="Cost Price" type="number" />
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} sm={3}>
                            <Controller
                                name="mrpPrice"
                                control={control}
                                render={({ field }) => (
                                    <TextField {...field} fullWidth variant="outlined" label="MRP Price" type="number" />
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} sm={3}>
                            <Controller
                                name="sellingPrice"
                                control={control}
                                render={({ field }) => (
                                    <TextField {...field} fullWidth variant="outlined" label="Selling Price" type="number" />
                                )}
                            />
                        </Grid>
                    </Grid>

                    <Box
                        sx={{
                            display: "flex",
                            gap: 3,
                            justifyContent: "center",
                        }}
                    >
                        <Button
                            variant="contained"
                            sx={{
                                borderRadius: "8px", py: 1, backgroundColor: "#d93030", width: "auto", transition: "0.3s",
                                "&:hover": {
                                    transform: "scale(1.05)",
                                },
                            }}
                            onClick={handleCloseModal}
                        >
                            Close
                        </Button>
                        {/* Submit Button */}
                        <Button
                            variant="contained"
                            sx={{
                                borderRadius: "8px", py: 1, backgroundColor: "#74D52B", transition: "0.3s",
                                "&:hover": {
                                    transform: "scale(1.05)",
                                },
                            }}
                            onClick={handleSubmit(onSubmit)}
                        >
                            {isEdit ? "Update" : "Add"}
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </Box>

    );
};

export default EditTable;
