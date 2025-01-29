import React, { useEffect, useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Card, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, Button, Box, Paper, Typography, FormControl, Grid, IconButton, InputLabel, MenuItem, Modal, Select, TextField, } from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { Toasts } from "../centralizedComponents/forms/Toast";
import { fetchCategories, fetchSubCategories, getAdminProductList, getProductDetails } from "../utils/api-collection";
import DeleteIcon from '@mui/icons-material/Delete';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import { useCategory } from "../Hooks/useContext";

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


const EditTable: React.FC = () => {
    const [rows, setRows] = useState<ProductData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [selectedInvoiceUrl, setSelectedInvoiceUrl] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [categories, setCategories] = useState<any[]>([]);
    const [subCategory, setSubCategory] = useState<any[]>([]);
    const { productId } = useCategory();

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
        { field: "mrpPrice", headerName: "MRP Price", flex: 1, headerAlign: "center", align: "center" },
        { field: "sellingPrice", headerName: "Selling Price", flex: 1, headerAlign: "center", align: "center" },
        {
            field: "editproduct",
            headerName: "Edit Product",
            flex: 1,
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
                    onClick={() => setIsModalOpen(true)}
                >
                    Edit
                </Button>
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

    const loadProductList = async () => {
        try {
            setLoading(true);
            const data = await getProductDetails(productId)
            console.log("productsWithId", data);

            setRows([data]);
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
                            onClick={handleAddNewItem}
                            sx={{ backgroundColor: "#f5f58e", color: "#000", borderRadius: "12px" }}
                        // onClick={handleOpenAddProductModal}
                        >
                            Add Product
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
