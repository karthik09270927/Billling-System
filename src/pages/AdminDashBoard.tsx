import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  InputAdornment,
  TextField,
  Button,
  Modal,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  IconButton,
  Badge,
  CircularProgress,
  CardMedia,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useCategory } from "../Hooks/useContext";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { useForm, useFieldArray, Controller } from "react-hook-form";
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import { Toasts } from '../centralizedComponents/forms/Toast';
import { fetchCategories, fetchProductList, fetchSubCategories, saveProduct } from "../utils/api-collection";
import nodata from '../assets/no-data.png';
import { useNavigate } from "react-router-dom";

const AdminDashboard: React.FC = () => {
  const { selectedCategoryId, subCategories, setProductId } = useCategory();
  const [_selectedItems, setSelectedItems] = useState<any[]>([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProductsLoading, setIsProductsLoading] = useState<boolean>(false);
  const [pageNo, setPageNo] = useState<number>(1);
  const [pageSize, _setPageSize] = useState<number>(10);
  const [filteredBySubcategory, setFilteredBySubcategory] = useState<any[]>([]);
  const [_totalItems, setTotalItems] = useState<number>(0);
  const [searchTerm, _setSearchTerm] = useState<string>('');
  const [searchResults, _setSearchResults] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [subCategory, setSubCategory] = useState<any[]>([]);
  const [selectedProductCategoryId, setselectedProductCategoryId] = useState<number>(0);
  const [selectedSubCategoryId, setselectedSubCategoryId] = useState<number>(0);

  const navigate = useNavigate();

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

  const handleItemClick = (item: any) => {
    setSelectedItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.id === item.id);
      if (existingItem) {
        return prevItems.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      } else {
        return [...prevItems, { ...item, quantity: 1 }];
      }
    });
  };

  const fetchProducts = async () => {
    try {
      const { products, totalCount } = await fetchProductList(
        selectedCategoryId,
        selectedSubcategory,
        pageNo,
        pageSize
      );
      setFilteredBySubcategory(products);
      setTotalItems(totalCount);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setIsProductsLoading(false);
    }
  };

  const handleLeftArrowClick = () => {
    const container = document.querySelector(".scrollable-container");
    if (container) container.scrollBy({ left: -100, behavior: "smooth" });
  };

  const handleRightArrowClick = () => {
    const container = document.querySelector(".scrollable-container");
    if (container) container.scrollBy({ left: 100, behavior: "smooth" });
  };

  const handleCategoryChange = (value: any) => {
    console.log("Category changed to:", value);
    getSubCategories(value);
    setselectedProductCategoryId(value);
  };

  const handleSubCategoryChange = (value: any) => {
    setselectedSubCategoryId(value);
  };

  const handleEditClick = (value: any) => {
    navigate(`/admin-dashboard/edit-product/${value}`);
    setProductId(value);
  };

  const handleAddNewItem = () => {
    setIsModalOpen(true);
    getCategories();
  };


  const handleCloseModal = () => {
    setIsModalOpen(false);
    reset();
  };

  const handleSubcategorySelect = (subcategory: any) => {
    console.log("Selected Subcategory:", subcategory);

    setSelectedSubcategory(subcategory.id);
    setPageNo(1);
    setIsProductsLoading(true);
  };


  const { control, handleSubmit, watch, setValue, register, reset, getValues } = useForm({
    defaultValues: {
      category: "",
      subCategory: "",
      products: [
        {
          productName: "",
          productImage: "",
        },
      ],
    },
  });


  const { fields, append, remove } = useFieldArray({
    control,
    name: "products",
  });

  const onSubmit = async (data: any) => {
    try {
      const productList = data.products.map((product: any) => ({
        id: null,
        productName: product.productName,
        image: product.productImage,
        billingProductCategory: selectedProductCategoryId || 0,
        billingProductSubCategory: selectedSubCategoryId || 0,
      }));
      console.log("Product List:", productList);

      const response = await saveProduct(productList);
      console.log("Product saved successfully:", response);
      fetchProducts();
    } catch (error) {
      console.error("Error in submitting product:", error);
      fetchProducts();
    } finally {
      reset();
      setIsModalOpen(false);
      fetchProducts();
    }
  };

  useEffect(() => {
    if (selectedSubcategory !== null) {
      fetchProducts();
    }
  }, [selectedSubcategory, pageNo, pageSize, subCategories]);


  return (
    <Box sx={{ display: "flex", height: "100vh", flexDirection: "row", bgcolor: "#f9f9f9" }}>
      {/* Left Section */}
      <Box sx={{ flex: 1, p: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "center", mb: 2, ml: 4 }}>
          {/* Render Subcategory buttons */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              mr: 2,
            }}
            onClick={handleLeftArrowClick}
          >
            <Button
              sx={{
                minWidth: 0,
                width: 32,
                height: 32,
                borderRadius: "50%",
                alignItems: "center",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                backgroundColor: "#f0f0f0",
                "&:hover": {
                  backgroundColor: "#74D52B",
                  color: "white",
                },
              }}
            >
              <ArrowBackIosIcon sx={{ fontSize: "12px" }} />
            </Button>
          </Box>

          {subCategories.map((subcategory: any) => (
            <Button
              key={subcategory.id}
              onClick={() => handleSubcategorySelect(subcategory)}
              sx={{
                margin: "0 8px",
                padding: "6px 16px",
                borderRadius: "30px",
                backgroundColor: selectedSubcategory?.id === subcategory.id ? "#74D52B" : "#f0f0f0",
                color: selectedSubcategory?.id === subcategory.id ? "white" : "#333",
                fontSize: "12px",
                fontWeight: 600,
                transition: "all 0.3s ease",
                boxShadow: selectedSubcategory?.id === subcategory.id ? "0 4px 12px rgba(116, 213, 43, 0.2)" : "0 4px 8px rgba(0, 0, 0, 0.1)",
                "&:hover": {
                  backgroundColor: "#74D52B",
                  color: "white",
                  transform: "translateY(-3px)",
                  boxShadow: "0 8px 16px rgba(116, 213, 43, 0.2)",
                },
                "&:focus": {
                  outline: "none",
                },
              }}
            >
              {subcategory.subCategoryName}

              <Badge
                showZero
                badgeContent={subcategory.count}
                color="primary"
                sx={{
                  position: "absolute",
                  top: "0px",
                  right: "0px",
                  "& .MuiBadge-badge": {
                    backgroundColor:
                      selectedSubcategory === subcategory ? "#f9f9f9" : "#74D52B",
                    color: selectedSubcategory === subcategory ? "#74D52B" : "#ffffff",
                    fontSize: "12px",
                    minWidth: "22px",
                    height: "22px",
                    boxShadow: "0 2px 6px rgba(21, 255, 0, 0.7)",
                  },
                }}
              />

            </Button>

          ))}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              ml: 2,
            }}
            onClick={handleRightArrowClick}
          >
            <Button
              sx={{
                minWidth: 0,
                width: 32,
                height: 32,
                borderRadius: "50%",
                backgroundColor: "#f0f0f0",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                "&:hover": {
                  backgroundColor: "#74D52B",
                  color: "white",
                },
              }}
            >
              <ArrowForwardIosIcon sx={{ fontSize: "12px" }} />
            </Button>
          </Box>

        </Box>

        <TextField
          placeholder="Search something sweet on your mind..."
          variant="outlined"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "#999" }} />
              </InputAdornment>
            ),
          }}
          sx={{
            width: "100%",
            height: "30px",
            backgroundColor: "#FBFBE5",
            borderRadius: "8px",
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                border: "none",
              },
              "& .MuiInputBase-input": {
                padding: "8px 12px",
              },
            },
          }}
        />

        <Grid container spacing={3} mt={0}>
          <>
            {/* Add New Item Card */}
            <Grid item xs={12} sm={6} md={2} lg={2}>
              <Card
                sx={{
                  backgroundColor: "#FBFBE5",
                  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                  borderRadius: "12px",
                  padding: 1,
                  width: "200px",
                  height: "310px",
                  transition: "transform 0.3s, box-shadow 0.3s",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: "0 6px 15px rgba(0, 0, 0, 0.2)",
                  },
                }}
                onClick={handleAddNewItem}
              >
                <Box
                  sx={{
                    backgroundColor: "#f9f9f9",
                    borderRadius: "10px",
                    overflow: "hidden",
                    mb: 2,
                    height: "180px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Box
                    sx={{
                      height: "90px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#F9F9F9",
                      borderRadius: "12px 12px 0 0",
                    }}
                  >
                    <AddIcon sx={{ fontSize: "60px", color: "#FDBE73" }} />
                  </Box>
                </Box>
                <CardContent
                  sx={{
                    alignItems: "center",
                    textAlign: "center",
                    "&:last-child": { paddingBottom: 0, paddingTop: 0 },
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      fontSize: "14px",
                      fontWeight: "bold",
                      color: "#333",
                      mb: 0.5,

                    }}
                  >
                    Add Product
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {(searchTerm ? searchResults : filteredBySubcategory).length > 0 ? (
              <>


                {/* Product Cards */}
                {isProductsLoading ? (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      minHeight: "50vh",
                    }}
                  >
                    <CircularProgress />
                  </Box>
                ) : (
                  <>
                    {(searchTerm ? searchResults : filteredBySubcategory).map(
                      (item: any) => (
                        <Grid item xs={12} sm={6} md={4} lg={2} key={item.id}>
                          <Card
                            sx={{
                              backgroundColor: "#FBFBE5",
                              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                              borderRadius: "12px",
                              padding: 1,
                              width: "200px",
                              minHeight: "310px", // Minimum height maintain pannum
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "space-between", // Ensures button stays at bottom
                              transition: "transform 0.3s, box-shadow 0.3s",
                              "&:hover": {
                                transform: "translateY(-5px)",
                                boxShadow: "0 6px 15px rgba(0, 0, 0, 0.2)",
                              },
                            }}
                            onClick={() => handleItemClick(item)}
                          >
                            <Box
                              sx={{
                                backgroundColor: "#f9f9f9",
                                borderRadius: "10px",
                                overflow: "hidden",
                                mb: 1,
                                height: "120px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <CardMedia
                                component="img"
                                sx={{
                                  maxHeight: "100%",
                                  maxWidth: "100%",
                                  objectFit: "contain",
                                }}
                                image={`data:image/jpeg;base64,${item.image}`}
                                alt={item.productName}
                              />
                            </Box>

                            <CardContent
                              sx={{
                                textAlign: "start",
                                "&:last-child": { paddingBottom: 0 },
                              }}
                            >
                              <Typography
                                variant="h6"
                                sx={{
                                  fontSize: "14px",
                                  fontWeight: "bold",
                                  color: "#333",
                                  mb: 0.5,
                                }}
                              >
                                {item.productName}
                              </Typography>
                              {/* <Typography
                                variant="body2"
                                sx={{
                                  fontSize: "16px",
                                  color: "#777",
                                }}
                              >
                                ₹ {item.mrpPrice ? item.mrpPrice.toFixed(2) : "N/A"}
                              </Typography> */}
                            </CardContent>
                            <Button
                              variant="contained"
                              fullWidth
                              sx={{
                                backgroundImage: "linear-gradient(to right, rgb(253, 230, 114), rgb(253, 184, 115))",
                                color: "white",
                                borderRadius: "12px",
                                marginTop: "auto",
                                transition: "0.3s",
                                "&:hover": {
                                  backgroundImage: "linear-gradient(to right, rgb(253, 210, 80), rgb(253, 164, 95))",
                                  transform: "scale(1.05)",
                                },
                              }}
                              onClick={() => handleEditClick(item.productId)}
                            >
                              Details
                            </Button>


                          </Card>
                        </Grid>
                      )
                    )}
                  </>
                )}
              </>
            ) : (
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: "50vh",
                  gap: 2,
                }}
              >
                <img
                  src={nodata}
                  alt="No products found"
                  style={{
                    width: "250px",
                    height: "250px",
                    objectFit: "contain",
                  }}
                />
                <Typography
                  variant="h6"
                  sx={{
                    color: "#666",
                    textAlign: "center",
                  }}
                >
                  {searchTerm
                    ? "No products found matching your search"
                    : "No products available"}
                </Typography>
              </Box>
            )}
          </>
        </Grid>

      </Box>
      {/* Updated Modal Code */}
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
                        const reader = new FileReader();

                        reader.onload = (event) => {
                          if (event.target) {
                            const base64 = event.target.result;
                            if (typeof base64 === 'string') {
                              setValue(`products.${index}.productImage`, base64);
                            }
                          }
                        };
                        reader.readAsDataURL(file); 
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
              fullWidth
              sx={{ borderRadius: "8px", backgroundColor: "#bdba04" }}
              onClick={() => {
                const lastIndex = fields.length - 1;
                if (lastIndex >= 0) {
                  const productName = getValues(`products.${lastIndex}.productName`);

                  if (!productName) {
                    Toasts({ message: 'Please fill in all fields', type: 'error' })
                    return;
                  }
                }
                append({
                  productName: "",
                  productImage: "",
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

export default AdminDashboard;
