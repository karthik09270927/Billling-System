import { Grid, Box, Card } from "@mui/material";
import AdminHeader from "../components/AdminHeader";
import AdminDashboard from "./AdminDashBoard";

const ProductManagement = () => {

  return (
    <Box sx={{ height: "100vh", overflow: { md: "hidden" }, }}>
      <Grid container spacing={1} sx={{ height: "100%", padding: 0, backgroundColor: "#fff" }}>
        <Grid item xs={12} md={8} sx={{ height: "100vh" }}>
          <Card elevation={1} sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
            <Box
              sx={{
                height: { md: "190px", sm: "50px" },
                backgroundColor:  "#F0F0F0",
                padding: "8px",
                borderBottom: "1px solid #ccc",
                flexShrink: 0,
              }}
            >
              < AdminHeader/>
            </Box>
            <Box
              sx={{
                flex: 1,
                overflowY: "auto",
                padding: 1,
                scrollbarWidth: "thin",
              }}
            >
             < AdminDashboard/>
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12} md={4} sx={{ height: "100vh" }}>
          <Card elevation={1} sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
            <Box
              sx={{
                height: { md: "50px", sm: "20px" },
                backgroundColor: "#F0F0F0",
                padding: "8px",
                borderBottom: "1px solid #ccc",
                flexShrink: 0,
              }}
            >
              Header Content (Fixed)
            </Box>
            <Box
              sx={{
                flex: 1,
                overflowY: "auto",
                padding: 1,
                scrollbarWidth: "thin",
              }}
            >
              Right Side Content
              {Array.from({ length: 50 }, (_, index) => (
                <p key={index}>Content {index + 1}</p>
              ))}
            </Box>
            <Box
              sx={{
                height: { md: "140px", sm: "50px" },
                backgroundColor: "#F0F0F0",
                padding: "8px",
                borderBottom: "1px solid #ccc",
                flexShrink: 0,
                bottom: 0
              }}
            >
              bottom Content (Fixed)
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
export default ProductManagement;
