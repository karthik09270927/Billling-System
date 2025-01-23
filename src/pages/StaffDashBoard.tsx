import React from "react";
import { Box, Grid, Typography, Card, CardContent, CardMedia, InputAdornment, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";


const items = [
  { id: 1, name: "Croissant", price: 4.0, image: "/src/assets/croissant.png" },
  { id: 2, name: "Puffs", price: 2.45, image: "/src/assets/puffs.png" },
  { id: 3, name: "Buns", price: 3.75, image: "/src/assets/buns.png" },
  { id: 4, name: "Sourdough", price: 4.5, image: "/src/assets/sourdough.png" },
  { id: 5, name: "Egg Tart", price: 3.25, image: "/src/assets/eggtart.png" },
  { id: 6, name: "Pan Bread", price: 4.5, image: "/src/assets/panbread.png" },
  { id: 7, name: "Spinchoco Roll", price: 4.0, image: "/src/assets/spinchoco.png" },
  { id: 8, name: "Black Forest", price: 5.0, image: "/src/assets/blackforest.png" },
  { id: 9, name: "Floss Bread", price: 4.5, image: "/src/assets/flossbread.png" },
  { id: 10, name: "Zaguma Pan", price: 4.5, image: "/src/assets/zaguma.png" },
  { id: 11, name: "Cereal Cream Donut", price: 2.45, image: "/src/assets/cerealcream.png" },
  { id: 12, name: "Butter Croissant", price: 4.0, image: "/src/assets/buttercroissant.png" },
];

const StaffDashboard: React.FC = () => {
  return (
    <Box sx={{ display: "flex", height: "auto", flexDirection: "column", bgcolor: "#ffffff"}}>
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
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
            backgroundColor: "#fbfbe5",
            borderRadius: "20px",
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                border: "none",
              },
              "& .MuiInputBase-input": {
              },
            },
          }}
        />
      </Box>

      <Grid container spacing={3} p={1}>
        {items.map((item) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
            <Card
              sx={{
                backgroundColor: "#ffffff",
                boxShadow: "2px 2px 4px 4px rgba(0, 0, 0, 0.1)",
                borderRadius: "12px",
                padding: 1,
                transition: "transform 0.3s, box-shadow 0.3s",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: "4px 4px 6px 6px rgba(0, 0, 0, 0.1)",
                },
              }}
            >
              <Box
                sx={{
                  backgroundColor: "#f9f9f9",
                  borderRadius: "10px",
                  overflow: "hidden",
                  mb: 2,
                  height: "150px",
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
  );
};

export default StaffDashboard;
