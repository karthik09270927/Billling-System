import { Grid, Box, Card } from "@mui/material";
import StaffDashBoard from "../pages/StaffDashBoard";
import Header from "../components/Header";

const Layout = () => {
  return (
    <Box sx={{ height: "100vh", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      {/* Header Section */}
      <Box sx={{ flexShrink: 0 }}>
        <Header />
      </Box>

      {/* Main Content Section */}
      <Box sx={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* Left Content (Staff Dashboard) */}
        <Box sx={{ flex: 1, overflowY: "auto", padding: 2 }}>
          <StaffDashBoard />
        </Box>

        {/* Right Side Content */}
        <Box
          sx={{
            width: { md: "25%", xs: "100%" },
            maxWidth: "400px",
            borderLeft: "1px solid #ddd",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden", // Prevent overflow
          }}
        >
          <Card elevation={1} sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
            {/* Right Top Header */}
            <Box
              sx={{
                height: "50px",
                backgroundColor: "#F0F0F0",
                padding: "8px",
                borderBottom: "1px solid #ccc",
                flexShrink: 0, // Ensure the header stays fixed
              }}
            >
              Header Content (Fixed)
            </Box>

            {/* Scrollable Right Content */}
            <Box
              sx={{
                flex: 1, // Take up remaining space
                overflowY: "auto", // Make this scrollable
                padding: 2,
                backgroundColor: "#fff",
              }}
            >
              Right Side Content
              {Array.from({ length: 50 }, (_, index) => (
                <p key={index}>Content {index + 1}</p>
              ))}
            </Box>

            {/* Right Bottom Fixed Section */}
            <Box
              sx={{
                height: "140px",
                backgroundColor: "#F0F0F0",
                padding: "8px",
                borderTop: "1px solid #ccc",
                flexShrink: 0, // Ensure the footer stays fixed
              }}
            >
              Bottom Content (Fixed)
            </Box>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
