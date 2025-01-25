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
  Badge,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useCategory } from "../Hooks/useContext";
import { useSelectedItems } from "../Hooks/productContext";

const StaffDashboard: React.FC = () => {
  const { subCategories } = useCategory();
  const { selectedItems, setSelectedItems } = useSelectedItems();
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);




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

  // const handleLeftArrowClick = () => {
  //   const container = document.querySelector(".scrollable-container");
  //   if (container) container.scrollBy({ left: -100, behavior: "smooth" });
  // };

  // const handleRightArrowClick = () => {
  //   const container = document.querySelector(".scrollable-container");
  //   if (container) container.scrollBy({ left: 100, behavior: "smooth" });
  // };



  return (

    <Box
      sx={{
        display: "flex",
        height: "100vh",
      }}
    >
      {/* Left Section (4) */}
      <Box
        sx={{
          flex: 2,
          display: "flex",
          flexDirection: "column",
          p: 2,
          borderRight: "3px solid #e0e0e0",
          overflowY: "auto",
          height: "calc(100vh - 100px)",
          "&::-webkit-scrollbar": {
            width: "6px",
            height: "6px",
          },
          "&::-webkit-scrollbar-track": {
            background: "transparent",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "#74D52B",
            borderRadius: "3px",
          },
          scrollbarWidth: "thin",
          scrollbarColor: "#74D52B transparent",

        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mb: 2,
            scrollbarWidth: "thin",
          }}
        >


          {/* Subcategory Card */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              overflowY: "auto",

            }}
          >
            {subCategories.map((subcategory: any) => (
              <Card
                key={subcategory.id}
                onClick={() => setSelectedSubcategory(subcategory)}
                sx={{
                  minWidth: "150px",
                  maxWidth: "220px",
                  minHeight: "80px",
                  maxHeight: "120px",
                  margin: "10px",
                  borderRadius: "16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: 0,
                  position: "relative",
                  boxShadow:
                    selectedSubcategory === subcategory
                      ? "0 4px 12px rgba(116, 213, 43, 0.2)"
                      : "0 4px 8px rgba(0, 0, 0, 0.1)",
                  backgroundColor: selectedSubcategory === subcategory ? "#74D52B" : "#f0f0f0",
                  color: selectedSubcategory === subcategory ? "white" : "#333",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    backgroundColor: "#74D52B",
                    color: "white",
                    transform: "translateY(-3px)",
                    boxShadow: "0 8px 16px rgba(116, 213, 43, 0.2)",
                  },
                  cursor: "pointer",
                }}
              >
                {/* Badge */}
                <Badge
                  showZero
                  badgeContent={subcategory.count}
                  color="primary"
                  sx={{
                    position: "absolute",
                    top: "16px",
                    right: "18px",
                    "& .MuiBadge-badge": {
                      backgroundColor:
                        selectedSubcategory === subcategory ? "#f9f9f9" : "#74D52B",
                      color: selectedSubcategory === subcategory ? "#74D52B" : "#ffffff",
                      fontSize: "12px",
                      minWidth: "22px",
                      height: "22px",
                      boxShadow: "0 2px 6px rgba(0, 0, 0, 0.2)",
                    },
                  }}
                />

                {/* Subcategory Name */}
                <Typography
                  variant="body1"
                  sx={{
                    textAlign: "center",
                    fontWeight: "600",
                    fontSize: "14px",
                    ml: 1,
                    flexGrow: 1,
                  }}
                >
                  {subcategory.subCategoryName}
                </Typography>
              </Card>
            ))}
          </Box>

        </Box>
      </Box>

      {/* Right Section (8) */}
      <Box
        sx={{
          flex: 10,
          display: "flex",
          flexDirection: "column",
          p: 2,
          position: "relative",
          overflowY: "auto",
          height: "calc(100vh - 100px)",
          "&::-webkit-scrollbar": {
            width: "6px",
            height: "6px",
          },
          "&::-webkit-scrollbar-track": {
            background: "transparent",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "#74D52B",
            borderRadius: "3px",
          },
          scrollbarWidth: "thin",
          scrollbarColor: "#74D52B transparent",

        }}
      >
        <Box sx={{ display: "flex", justifyContent: "flex-start", gap: 1 }}>
          {/* Search Input */}
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
              height: "40px",
              backgroundColor: "#fbfbe5",
              borderRadius: "20px",
              mt: 1,
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
        </Box>



        {/* Filtered Items Grid */}
        <Grid container spacing={3}>
          {/* {filteredBySubcategory.map((item: any) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
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
    </Box>

  );
};

export default StaffDashboard;
