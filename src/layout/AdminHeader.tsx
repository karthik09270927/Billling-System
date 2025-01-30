import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useLocation, useNavigate } from "react-router-dom";
import LoginIcon from "@mui/icons-material/Login";
import { useState } from "react";
import { mainAppBarStyle, appBarTypographyStyle } from "../style/header.Style";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";

const navItems = [
  //   { name: "Dashboard", path: "/layout/dashboard" },
  { name: "Product Management", path: "/admin-dashboard/productmanagement" },
  { name: "User History", path: "/admin-dashboard/userhistory" },
  { name: "Products List", path: "/admin-dashboard/productList" },
];


export default function AdminHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const [refreshToken, setRefreshToken] = useState<string | null>(
    localStorage.getItem("refreshToken")
  );

  const handleLogout = () => {
    localStorage.clear();
    setRefreshToken(null);
    navigate("/");
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar component="nav" sx={mainAppBarStyle}>
        <Toolbar>
          <Typography
            variant="h5"
            component="div"
            sx={{
              ...appBarTypographyStyle,
              // display: "flex",
              alignItems: "center",
              gap: 0,
              flexGrow: 1,
              display: { xs: "none", sm: "block", md: "flex" }
            }}
          >
            <ShoppingCartIcon sx={{ fontSize: "40px" }} />FRESH HYPERMARKET
          </Typography>

          <Box sx={{ flexGrow: 2, display: "block" }}>
            {navItems.map((item) => (
              <Button
                key={item.name}
                sx={{
                  fontWeight: isActive(item.path) ? 800 : "inherit",
                  textTransform: "none",
                  color: "inherit",
                }}
                onClick={() => navigate(item.path)}
              >
                {item.name}
              </Button>
            ))}
          </Box>
          <Box sx={{ flexGrow: 0 }}>
            {/* <IconButton>
              <QrCodeScannerIcon sx={{ fontSize: 28, color: "#333" }} />
            </IconButton> */}
            {refreshToken ? (
              <IconButton onClick={handleLogout} sx={{ color: "inherit" }}>
                <LoginIcon />
              </IconButton>
            ) : null}
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
