import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  CardMedia,
  InputAdornment,
  TextField,
  Badge,
  Pagination,
  Skeleton,
  CircularProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useCategory } from "../Hooks/useContext";
import { useSelectedItems } from "../Hooks/productContext";
import { fetchProductList } from "../utils/api-collection";

const StaffDashboard: React.FC = () => {
  const { subCategories, selectedCategoryId } = useCategory();
  const { selectedItems, setSelectedItems } = useSelectedItems();
  const [selectedSubcategory, setSelectedSubcategory] = useState<any | null>(null);
  const [filteredBySubcategory, setFilteredBySubcategory] = useState<any[]>([]);
  const [pageNo, setPageNo] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [isSubCategoriesLoading, setIsSubCategoriesLoading] = useState<boolean>(true);
  const [isProductsLoading, setIsProductsLoading] = useState<boolean>(false);
  

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

  // Handle subcategory selection
  const handleSubcategorySelect = (subcategory: any) => {
    setSelectedSubcategory(subcategory.id);
    setPageNo(1); // Reset to the first page when subcategory changes
    setIsProductsLoading(true);
  };

  // Handle page change
  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPageNo(value);
  };

  // Handle item click to add to the selected items
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

  useEffect(() => {
    setTimeout(() => {
      setIsSubCategoriesLoading(false);
    }, 1000);
  }, []);


  useEffect(() => {
    if (selectedSubcategory !== null) {
      fetchProducts();
    }
  }, [selectedSubcategory, pageNo, pageSize]);


  return (
    <Grid sx={{ display: "flex" }} container>
      {/* Left Section: Subcategory Cards */}
      <Grid item xs={12} sm={12} md={2} lg={2}
        sx={{
          display: "flex",
          flexDirection: "column",
          borderRight: "3px solid #e0e0e0",
          overflowY: "auto",
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
        {isSubCategoriesLoading ? (
          <Skeleton
            variant="rectangular"
            width="100%"
            height="80px"
            sx={{ mb: 2, borderRadius: "16px" }}
          />
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", overflowY: "auto" }}>
            {subCategories.map((subcategory: any) => (
              <Card
                key={subcategory.id}
                onClick={() => handleSubcategorySelect(subcategory)}
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
                  backgroundColor:
                    selectedSubcategory === subcategory ? "#74D52B" : "#f0f0f0",
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
        )}
      </Grid>

      {/* Right Section: Filtered Items Grid */}
      <Grid item xs={12} sm={12} md={10} lg={10}
        sx={{
          
          display: "flex",
          flexDirection: "column",
          p: 2,
          position: "relative",
          overflowY: "auto",
        }}
      >
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
        {/* Displaying Products in Grid */}
        {isProductsLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Grid container spacing={3} mt={1}>
              {filteredBySubcategory.map((item: any) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
                  <Card
                    sx={{
                      backgroundColor: "#ffffff",
                      boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                      borderRadius: "12px",
                      padding: 1,
                      width: "200px",
                      height: "300px",
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
                        image={`data:image/jpeg;base64,${item.image}`}
                        alt={item.productName}
                      />
                    </Box>
                    <CardContent sx={{ textAlign: "start", "&:last-child": { paddingBottom: 0 } }}>
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
                      <Typography
                        variant="body2"
                        sx={{
                          fontSize: "16px",
                          color: "#777",
                        }}
                      >
                        ${item.mrpPrice ? item.mrpPrice.toFixed(2) : "N/A"}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                mt: 2,
                mb: 2,
                '& .MuiPagination-ul': {
                  gap: '8px',
                }
              }}
            >
              <Pagination
                count={Math.ceil(totalItems / pageSize)}
                page={pageNo}
                onChange={handlePageChange}
                color="primary"
                size="large"
                showFirstButton
                showLastButton
                sx={{
                  '& .MuiPaginationItem-root': {
                    borderRadius: '8px',
                    color: '#333',
                    minWidth: '36px',
                    height: '36px',
                    '&:hover': {
                      backgroundColor: '#74D52B20',
                    },
                    '&.Mui-selected': {
                      backgroundColor: '#74D52B',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: '#65BA25',
                      }
                    }
                  },
                  '& .MuiPaginationItem-firstLast': {
                    fontSize: '1.2rem',
                  }
                }}
              />
            </Box>
          </>
        )}

      </Grid>
    </Grid>
  );
};

export default StaffDashboard;
