import { Grid, Box, Card } from "@mui/material";
import StaffDashBoard from "../pages/StaffDashBoard";
import Header from "../components/Header";
import BillPanel from "../pages/BillPanel";
const StaffLayout = () => {
  return (
    <Box sx={{ height: "100vh", overflow: { md: "hidden" } }}>
      <Grid container spacing={0} sx={{ height: "100%", padding: 0, backgroundColor: "#fff" }}>
        <Grid item xs={12} md={9} sx={{ height: "100vh" }}>
          <Card elevation={1} sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
            <Box
              sx={{
                flexShrink: 0, 
                position: "sticky", 
                top: 0, 
                zIndex: 1, 
                backgroundColor: "#fff", 
              }}
            >
              <Header />
            </Box>
            <Box
              sx={{
                flex: 1,
                overflowY: "auto", 
                padding: 1,
                scrollbarWidth: "thin",
              }}
            >
              <StaffDashBoard />
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12} md={3} sx={{ height: "100%" }}>
          <BillPanel />
        </Grid>
      </Grid>
    </Box>

  );
};
export default StaffLayout;