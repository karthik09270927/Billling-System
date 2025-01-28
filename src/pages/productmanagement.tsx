import { Grid, Box, Card } from "@mui/material";
import AdminHeader from "../components/AdminHeader";
import AdminDashboard from "./AdminDashBoard";

const ProductManagement = () => {

  return (
    <Box sx={{ height: "100vh", overflow: { md: "hidden" }, }}>
      <Grid container spacing={1} sx={{ height: "100%", padding: 0, backgroundColor: "#fff" }}>
        <Grid item xs={12} md={12} sx={{ height: "100vh" }}>
          <Card elevation={1} sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
            <Box
              sx={{
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
      </Grid>
    </Box>
  );
};
export default ProductManagement;
