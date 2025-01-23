import React, { useState } from "react";
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  CardMedia,
  InputAdornment,
  TextField,
  Button,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useCategory } from "../Hooks/useContext";


const items = [
  { id: 1, name: "Croissant", price: 4.0, image: "/src/assets/croissant.png", category: "Electronics", subcategory: "Laptops" },
  { id: 2, name: "Black Forest", price: 5.0, image: "/src/assets/blackforest.png", category: "Electronics", subcategory: "Laptops" },
  { id: 3, name: "Butter Croissant", price: 4.0, image: "/src/assets/buttercroissant.png", category: "Electronics", subcategory: "Laptops" },

  { id: 4, name: "TV", price: 2.45, image: "/src/assets/puffs.png", category: "Electronics", subcategory: "Home Appliances" },
  { id: 5, name: "Fridge", price: 3.75, image: "/src/assets/biscuits.png", category: "Electronics", subcategory: "Home Appliances" },
  { id: 6, name: "Sound Bar", price: 4.5, image: "/src/assets/biscuts.jpg", category: "Electronics", subcategory: "Home Appliances" },

  { id: 7, name: "Cereal Cream Donut", price: 2.45, image: "/src/assets/cerealcream.png", category: "Fashion", subcategory: "Accessories" },
  { id: 8, name: "Chocolate Donut", price: 3.5, image: "/src/assets/chocolatedonut.png", category: "Fashion", subcategory: "Accessories" },
  { id: 9, name: "Glazed Donut", price: 3.0, image: "/src/assets/glazeddonut.png", category: "Fashion", subcategory: "Accessories" },

  { id: 10, name: "Egg Tart", price: 3.25, image: "/src/assets/eggtart.png", category: "Fashion", subcategory: "Clothing" },
  { id: 11, name: "Spinchoco Roll", price: 4.0, image: "/src/assets/spinchoco.png", category: "Fashion", subcategory: "Clothing" },
  { id: 12, name: "Zaguma Pan", price: 4.5, image: "/src/assets/zaguma.png", category: "Fashion", subcategory: "Clothing" },
];


const groupItemsBySubcategory = (items: any) => {
  return items.reduce((acc: any, item: any) => {
    if (!acc[item.subcategory]) {
      acc[item.subcategory] = [];
    }
    acc[item.subcategory].push(item);
    return acc;
  }, {});
};

const StaffDashboard: React.FC = () => {
  const { selectedCategory } = useCategory();
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);

  
  const filteredItems =
    selectedCategory === "All Menu"
      ? items
      : items.filter((item) => item.category === selectedCategory);

  
  const groupedItems = groupItemsBySubcategory(filteredItems);

  
  const filteredBySubcategory = selectedSubcategory
    ? filteredItems.filter((item) => item.subcategory === selectedSubcategory)
    : filteredItems;

  
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



  return (
    <Box sx={{ display: "flex", height: "100vh", flexDirection: "row", bgcolor: "#f9f9f9" }}>
      {/* Left Section */}
      <Box sx={{ flex: 1, p: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "flex-start", mb: 2, ml: 4 }}>
          {/* Render Subcategory buttons */}  
          {Object.keys(groupedItems).map((subcategory) => (
            <Button
              key={subcategory}
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
              {subcategory}
            </Button>

          ))}
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
            backgroundColor: "#fbfbe5",
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

        {/* Display filtered items based on selected subcategory */}
        <Grid container spacing={3} mt={3}>
          {filteredBySubcategory.map((item: any) => (
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
          ))}
        </Grid>
      </Box>

     
    </Box>
  );
};

export default StaffDashboard;
