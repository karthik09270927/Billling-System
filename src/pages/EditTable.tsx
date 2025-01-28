import React, { useEffect, useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Card, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, Button, Box, Paper, Typography, FormControl, Grid, IconButton, InputLabel, MenuItem, Modal, Select, TextField, } from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { Toasts } from "../centralizedComponents/forms/Toast";
import { fetchCategories, fetchSubCategories } from "../utils/api-collection";
import DeleteIcon from '@mui/icons-material/Delete';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';

interface UserData {
    orderId: number;
    userName: string;
    purchasedDate: string;
    totalAmount: string;
    phone: string;
    role: string;
    invoiceUrl: string;
}


const EditTable: React.FC = () => {
    const [rows, setRows] = useState<UserData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [selectedInvoiceUrl, setSelectedInvoiceUrl] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [categories, setCategories] = useState<any[]>([]);
    const [subCategory, setSubCategory] = useState<any[]>([]);

    const { control, handleSubmit, watch, setValue, register, reset, getValues } = useForm({
        defaultValues: {
            category: "",
            subCategory: "",
            products: [
                {
                    productName: "",
                    productImage: "",
                    price: "",
                },
            ],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "products",
    });

    const getCategories = async () => {
        try {
            const data = await fetchCategories();
            setCategories(data);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

      const getSubCategories = async (id: any) => {
        try {
          const subdata = await fetchSubCategories(id);
          setSubCategory(subdata.data);
        } catch (error) {
          console.error("Error fetching categories:", error);
        }
      };

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

    const handleAddNewItem = () => {
        setIsModalOpen(true);
        getCategories();
    };


    const handleCloseModal = () => {
        setIsModalOpen(false);
        reset();
    };

    const handleCategoryChange = (value: any) => {
        console.log("Category changed to:", value);
        getSubCategories(value);
    };

    const handleSubCategoryChange = (value: any) => {

    };

    const onSubmit = (data: any) => {
        console.log(data);
        reset();
        setIsModalOpen(false);
    };

    const loadUserList = async () => {
        try {
            setLoading(true);
            //   const data = await fetchUserList() as UserHistoryResponse;
            //   const usersWithId = data.data.map((user) => ({
            //     ...user,
            //     id: user.orderId,
            //   }));
            //   setRows(usersWithId);
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
                <Box sx={{ background: "linear-gradient(to right, #2563EB, #4338CA)", color: "#fff", p: 3 }}>
                    <Typography variant="h4" fontWeight="bold">Stock Details</Typography>
                    <Typography variant="subtitle1">Detailed overview of user activity</Typography>
                </Box>

                {/* Add Product Button */}
                <Box sx={{ display: "flex", justifyContent: "flex-end", p: 2 }}>
                    <Button
                        variant="contained"
                        onClick={handleAddNewItem}
                        sx={{ backgroundColor: "#f5f58e", color: "#000", borderRadius: "12px" }}
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
                        Add Products
                    </Typography>

                    {/* Category and Subcategory */}
                    <Grid container spacing={2} sx={{ mb: 3 }}>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel id="category-label">Category</InputLabel>
                                <Controller
                                    name="category"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            labelId="category-label"
                                            label="Category"
                                            defaultValue=""
                                            onChange={(event) => {
                                                field.onChange(event);
                                                handleCategoryChange(event.target.value);
                                            }}
                                        >
                                            {categories.map((category, index) => (
                                                <MenuItem key={index} value={category.id}>
                                                    {category.categoryName}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    )}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel id="subcategory-label">Sub Category</InputLabel>
                                <Controller
                                    name="subCategory"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            labelId="subcategory-label"
                                            label="Sub Category"
                                            defaultValue=""
                                            onChange={(event) => {
                                                field.onChange(event);
                                                handleSubCategoryChange(event.target.value);
                                            }}
                                        >
                                            {subCategory.map((subCategories, index) => (
                                                <MenuItem key={index} value={subCategories.id}>
                                                    {subCategories.subCategoryName}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    )}
                                />
                            </FormControl>
                        </Grid>
                    </Grid>

                    {/* Form Array for Products */}
                    {fields.map((field, index) => (
                        <Box
                            key={field.id}
                            sx={{
                                alignItems: "flex-start",
                                borderBottom: "1px solid #ddd",
                                mb: 3,
                                pb: 3,
                            }}
                        >
                            <Box

                                sx={{
                                    display: "flex",
                                    gap: 2,
                                    alignItems: "flex-start",
                                }}
                            >
                                {/* Product Name */}
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    label="Product Name"
                                    {...register(`products.${index}.productName`, { required: "Required" })}
                                />

                                {/* Upload Image */}
                                <Box
                                    sx={{
                                        display: "flex",
                                        flexShrink: 0,
                                    }}
                                >
                                    {/* Use unique ID by appending index */}
                                    <input
                                        accept="image/*"
                                        type="file"
                                        id={`upload-image-${index}`}
                                        style={{ display: "none" }}
                                        onChange={(e) => {
                                            if (e.target.files && e.target.files.length > 0) {
                                                const file = e.target.files[0];
                                                const imageUrl = URL.createObjectURL(file);
                                                setValue(`products.${index}.productImage`, imageUrl);
                                            }
                                        }}
                                    />
                                    <label htmlFor={`upload-image-${index}`}>
                                        <Box
                                            sx={{
                                                width: "56px",
                                                height: "56px",
                                                backgroundColor: "#F0F0F0",
                                                borderRadius: "8px",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                cursor: "pointer",
                                                border: "1px dashed #74d52b",
                                                overflow: "hidden",
                                            }}
                                        >
                                            {watch(`products.${index}.productImage`) ? (
                                                <img
                                                    src={watch(`products.${index}.productImage`)}
                                                    alt="Uploaded"
                                                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                                />
                                            ) : (
                                                <ImageOutlinedIcon sx={{ fontSize: "30px", color: "#74d52b" }} />
                                            )}
                                        </Box>
                                    </label>
                                </Box>

                                {/* Price */}
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    label="Price"
                                    type="number"
                                    {...register(`products.${index}.price`, { required: "Required" })}
                                />
                                {/* Remove Button */}
                                <IconButton
                                    color="error"
                                    edge="end"
                                    aria-label="delete"
                                    onClick={() => remove(index)}
                                    sx={{
                                        alignSelf: "center",
                                    }}
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </Box>
                            {/* <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  alignItems: "flex-start",

                }}
              >
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Quantity"
                  type="number"
                  {...register(`products.${index}.quantity`, { required: "Required" })}
                />
                <FormControl fullWidth variant="outlined">
                  <TextField
                    id="outlined-adornment-weight"
                    label="Weight"
                    InputProps={{
                      endAdornment: <InputAdornment position="end">kg</InputAdornment>,
                    }}
                    aria-describedby="outlined-weight-helper-text"
                    inputProps={{
                      'aria-label': 'weight',
                    }}
                    {...register(`products.${index}.Weight`, { required: "Required" })}
                  />
                </FormControl>

                <CentralizeDatePicker
                  label="Manufacture Date"
                  control={control}
                  defaultValue=""
                  format="DD-MM-YYYY"
                  size="small"
                  {...register(`products.${index}.manufactureDate`, { required: "Required" })}
                />

                <CentralizeDatePicker
                  label="Expiry Date"
                  control={control}
                  defaultValue=""
                  format="DD-MM-YYYY"
                  size="small"
                  {...register(`products.${index}.expiryDate`, { required: "Required" })}
                />
              </Box> */}
                        </Box>
                    ))}
                    <Box
                        sx={{
                            display: "flex",
                            gap: 3,
                        }}
                    >
                        {/* Add Product Button */}
                        <Button
                            variant="contained"
                            // color="primary"
                            fullWidth
                            sx={{ borderRadius: "8px", backgroundColor: "#bdba04" }}
                            onClick={() => {
                                const lastIndex = fields.length - 1;
                                if (lastIndex >= 0) {
                                    const productName = getValues(`products.${lastIndex}.productName`);
                                    const price = getValues(`products.${lastIndex}.price`);

                                    if (!productName || !price) {
                                        Toasts({ message: 'Please fill in all fields', type: 'error' })
                                        return;
                                    }
                                }
                                append({
                                    productName: "",
                                    productImage: "",
                                    price: "",
                                });
                            }}
                        >
                            Add Product
                        </Button>

                        <Button
                            variant="contained"
                            fullWidth
                            sx={{ borderRadius: "8px", py: 1, backgroundColor: "#d93030" }}
                            onClick={handleCloseModal}
                        >
                            Close
                        </Button>
                        {/* Submit Button */}
                        <Button
                            variant="contained"
                            fullWidth
                            sx={{ borderRadius: "8px", py: 1, backgroundColor: "#74D52B" }}
                            onClick={handleSubmit(onSubmit)}
                        >
                            Submit
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </Box>

    );
};

export default EditTable;