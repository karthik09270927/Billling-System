import React, { useState } from "react";
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

// const items = [
//   { id: 1, name: "Croissant", price: 4.0, image: "/src/assets/croissant.png", category: "Electronics", subcategory: "Laptops" },
//   { id: 2, name: "Black Forest", price: 5.0, image: "/src/assets/blackforest.png", category: "Electronics", subcategory: "Laptops" },
//   { id: 3, name: "Butter Croissant", price: 4.0, image: "/src/assets/buttercroissant.png", category: "Electronics", subcategory: "Laptops" },

//   { id: 4, name: "TV", price: 2.45, image: "/src/assets/puffs.png", category: "Electronics", subcategory: "Home Appliances" },
//   { id: 5, name: "Fridge", price: 3.75, image: "/src/assets/biscuits.png", category: "Electronics", subcategory: "Home Appliances" },
//   { id: 6, name: "Sound Bar", price: 4.5, image: "/src/assets/biscuts.jpg", category: "Electronics", subcategory: "Home Appliances" },

//   { id: 7, name: "Cereal Cream Donut", price: 2.45, image: "/src/assets/cerealcream.png", category: "Fashion", subcategory: "Accessories" },
//   { id: 8, name: "Chocolate Donut", price: 3.5, image: "/src/assets/chocolatedonut.png", category: "Fashion", subcategory: "Accessories" },
//   { id: 9, name: "Glazed Donut", price: 3.0, image: "/src/assets/glazeddonut.png", category: "Fashion", subcategory: "Accessories" },

//   { id: 10, name: "Egg Tart", price: 3.25, image: "/src/assets/eggtart.png", category: "Fashion", subcategory: "Clothing" },
//   { id: 11, name: "Spinchoco Roll", price: 4.0, image: "/src/assets/spinchoco.png", category: "Fashion", subcategory: "Clothing" },
//   { id: 12, name: "Zaguma Pan", price: 4.5, image: "/src/assets/zaguma.png", category: "Fashion", subcategory: "Clothing" },
// ];


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
  const { selectedCategory } = useCategory();
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const { subCategories } = useCategory();
  const [deleteSubCategory, setdeleteSubCategory] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // const filteredItems =
  //   selectedCategory === "All Menu"
  //     ? items
  //     : items.filter((item) => item.category === selectedCategory);


  // const groupedItems = groupItemsBySubcategory(filteredItems);


  // const filteredBySubcategory = selectedSubcategory
  //   ? filteredItems.filter((item) => item.subcategory === selectedSubcategory)
  //   : filteredItems;


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


  const handleCloseModal = () => {
    setIsModalOpen(false);
    reset();
  };


  const { control, handleSubmit, watch, setValue, register, reset, getValues  } = useForm({
    defaultValues: {
      category: "",
      subCategory: "",
      products: [
        {
          productName: "",
          productImage: "",
          price: "",
          quantity: "",
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
              onClick={() => setSelectedSubcategory(subcategory)}
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
              {subcategory.subCategoryName} ({subcategory.count})
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

        <Grid container spacing={3} mt={3}>
          <Grid item xs={12} sm={6} md={4} lg={2.4} >
            <Card
              sx={{
                backgroundColor: "#ffffff",
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                borderRadius: "12px",
                padding: 1,
                width: "200px",
                transition: "transform 0.3s, box-shadow 0.3s",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: "0 6px 15px rgba(0, 0, 0, 0.2)",
                },
              }}
              onClick={() => setIsModalOpen(true)}
            >
              <Box
                sx={{
                  backgroundColor: "#f9f9f9",
                  borderRadius: "10px",
                  overflow: "hidden",
                  mb: 2,
                  height: "120px",
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
                  Add New Item
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          {/* {filteredBySubcategory.map((item: any) => (
            <Grid item xs={12} sm={6} md={4} lg={2.4} key={item.id}>
              <Card
                sx={{
                  backgroundColor: "#ffffff",
                  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                  borderRadius: "12px",
                  padding: 1,
                  width: "200px",
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
                    mb: 2,
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
                    image={item.image}
                    alt={item.name}
                  />
                </Box>
                <CardContent
                  sx={{
                    textAlign: "start",
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
                    {item.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: "16px",
                      color: "#777",
                    }}
                  >
                    ${item.price.toFixed(2)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))} */}
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
            width: { xs: "90%", sm: "80%", md: "60%" },
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
                    <Select {...field} labelId="category-label" label="Category" defaultValue="" >
                      <MenuItem value="Electronics">Electronics</MenuItem>
                      <MenuItem value="Clothing">Clothing</MenuItem>
                      <MenuItem value="Groceries">Groceries</MenuItem>
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
                    <Select {...field} labelId="subcategory-label" label="Sub Category" defaultValue="">
                      <MenuItem value="Mobiles">Mobiles</MenuItem>
                      <MenuItem value="Shirts">Shirts</MenuItem>
                      <MenuItem value="Vegetables">Vegetables</MenuItem>
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
                display: "flex",
                gap: 2,
                alignItems: "flex-start",
                mb: 3,
                borderBottom: "1px solid #ddd",
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
          ))}

          {/* Add Product Button */}
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mb: 3, borderRadius: "8px", py: 1 }}
            onClick={() => {
              const lastIndex = fields.length - 1;
              if (lastIndex >= 0) {
                const productName = getValues(`products.${lastIndex}.productName`);
                const price = getValues(`products.${lastIndex}.price`);
                const quantity = getValues(`products.${lastIndex}.quantity`);
                if (!productName || !price || !quantity) {
                  Toasts({ message: 'Please fill in all fields', type: 'error' })
                  return;
                }
              }

              append({
                productName: "",
                productImage: "",
                price: "",
                quantity: "",
              });
            }}
          >
            Add Product
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
      </Modal>



    </Box>
  );
};

export default AdminDashboard;
