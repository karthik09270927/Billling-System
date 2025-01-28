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
  Pagination,
  OutlinedInput,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useCategory } from "../Hooks/useContext";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import { useForm, useFieldArray, Controller } from "react-hook-form";
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import { Toasts } from '../centralizedComponents/forms/Toast';
import { fetchCategories, fetchProductList, fetchSubCategories } from "../utils/api-collection";
import nodata from '../assets/no-data.png';
import CentralizeDatePicker from "../centralizedComponents/forms/DatePicker";
import { useNavigate } from "react-router-dom";


const groupItemsBySubcategory = (items: any) => {
  return items.reduce((acc: any, item: any) => {
    if (!acc[item.subcategory]) {
      acc[item.subcategory] = [];
    }
    acc[item.subcategory].push(item);
    return acc;
  }, {});
};

const AdminDashboard: React.FC = () => {
  const { selectedCategoryId, subCategories } = useCategory();
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState<any | null>(null);
  const [deleteSubCategory, setdeleteSubCategory] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProductsLoading, setIsProductsLoading] = useState<boolean>(false);
  const [pageNo, setPageNo] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [filteredBySubcategory, setFilteredBySubcategory] = useState<any[]>([]);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [subCategory, setSubCategory] = useState<any[]>([]);

  const navigate=useNavigate();

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
      setIsProductsLoading(false); // Stop the product loader
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

  const handleDeleteSubCategoryList = () => {
    setdeleteSubCategory((prev) => !prev);
    console.log(deleteSubCategory);
  };


  const handleDeleteSubCategory = () => {

  };

  const handleCategoryChange = (value: any) => {
    console.log("Category changed to:", value);
    getSubCategories(value);
  };


  const handleSubCategoryChange = (value: any) => {

  };

  const handleEditClick = (value: any) => {
    navigate(`/admin-dashboard/edit-product/${value}`);
  
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
          price: "",
          quantity: "",
          Weight: "",
          manufactureDate: "",
          expiryDate: "",

        },
      ],
    },
  });


  const { fields, append, remove } = useFieldArray({
    control,
    name: "products",
  });

  const onSubmit = (data: any) => {
    console.log(data);
    reset();
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (selectedSubcategory !== null) {
      fetchProducts();
    }
  }, [selectedSubcategory, pageNo, pageSize]);


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
                backgroundColor: selectedSubcategory === subcategory ? "#74D52B" : "#f0f0f0",
                color: selectedSubcategory === subcategory ? "white" : "#333",
                fontSize: "12px",
                fontWeight: 600,
                transition: "all 0.3s ease",
                boxShadow: selectedSubcategory === subcategory ? "0 4px 12px rgba(116, 213, 43, 0.2)" : "0 4px 8px rgba(0, 0, 0, 0.1)",
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
              {deleteSubCategory && (<CloseIcon sx={{ fontSize: "18px", ml: 1, color: "red" }} onClick={handleDeleteSubCategory} />)}
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

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "end",
              cursor: "pointer",
              ml: 2,
            }}
            onClick={handleDeleteSubCategoryList}
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
              <DeleteIcon sx={{ fontSize: "18px", }} />
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
                  backgroundColor: "#ffffff",
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
                    <AddIcon sx={{ fontSize: "60px", color: "#74d52b" }} />
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
                              backgroundColor: "#ffffff",
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
                                backgroundColor: "#74d52b",
                                color: "white",
                                borderRadius: "12px",
                                marginTop: "auto",
                              }}
                            onClick={()=>handleEditClick(item.id)}

                            >
                              Edit
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


                  pb: 3,
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

                {/* Quantity */}
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Quantity"
                  type="number"
                  {...register(`products.${index}.quantity`, { required: "Required" })}
                />




              </Box>
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  alignItems: "flex-start",

                }}
              >
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
                  // name="manufactureDate"
                  control={control}
                  defaultValue=""
                  format="DD-MM-YYYY"
                  size="small"
                  {...register(`products.${index}.manufactureDate`, { required: "Required" })}
                />

                <CentralizeDatePicker
                  label="Expiry Date"
                  // name="expiryDate"
                  control={control}
                  defaultValue=""
                  format="DD-MM-YYYY"
                  size="small"
                  {...register(`products.${index}.expiryDate`, { required: "Required" })}
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
                  const quantity = getValues(`products.${lastIndex}.quantity`);
                  const Weight = getValues(`products.${lastIndex}.Weight`);
                  const manufactureDate = getValues(`products.${lastIndex}.manufactureDate`);
                  const expiryDate = getValues(`products.${lastIndex}.expiryDate`);

                  if (!productName || !price || !quantity || !Weight || !manufactureDate || !expiryDate) {
                    Toasts({ message: 'Please fill in all fields', type: 'error' })
                    return;
                  }
                }

                append({
                  productName: "",
                  productImage: "",
                  price: "",
                  quantity: "",
                  Weight: "",
                  manufactureDate: "",
                  expiryDate: "",
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
