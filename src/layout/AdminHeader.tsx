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
import logo from '../assets/bgremove (2).png';

const navItems = [
  //   { name: "Dashboard", path: "/layout/dashboard" },
  { name: "Product Management", path: "/admin-dashboard/productmanagement" },
  { name: "User History", path: "/admin-dashboard/userhistory" },
  { name: "Products List", path: "/admin-dashboard/productList" },
  { name: "Offers Page", path: "/admin-dashboard/offerspage" },
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
           <img src={logo} alt="logo" style={{ width: "40px", height: "40px" }} /><Typography color="#7cc323" fontSize={23} fontWeight={800}> FRESH HYPERMARKET</Typography>
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
