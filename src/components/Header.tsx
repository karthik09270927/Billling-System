import React, { useRef, useState } from "react";
import {
    Box,
    Grid,
    Typography,
    IconButton,
    TextField,
    InputAdornment,
    Card,
    CardContent,
    CardMedia,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
import { useCategory } from "../Hooks/useContext";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

const Header = () => {
    const [isHeaderOpen, setIsHeaderOpen] = useState(true);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const { selectedCategory, setSelectedCategory } = useCategory();

    const toggleHeader = () => {
        setIsHeaderOpen((prev) => !prev); 
    };

    const scrollHorizontally = (direction: "left" | "right") => {
        if (scrollContainerRef.current) {
            const scrollAmount = direction === "left" ? -200 : 200;
            scrollContainerRef.current.scrollBy({
                left: scrollAmount,
                behavior: "smooth",
            });
        }
    };

    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem('userRole');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        navigate('/'); 
      };

    const categories = [
        { name: "All Menu", image: "/src/assets/croissant.png", items: 20 },
        { name: "Electronics", image: "/src/assets/Electronics.png", items: 20 },
        { name: "Grocery", image: "/src/assets/Grocery.jpg", items: 20 },
        { name: "Mobiles", image: "/src/assets/Phones.jpg", items: 20 },
        { name: "Fashion", image: "/src/assets/croissant.png", items: 20 },
        { name: "Furniture", image: "/src/assets/croissant.png", items: 20 },
        { name: "Appliances", image: "/src/assets/croissant.png", items: 20 },
        { name: "Tea", image: "/src/assets/croissant.png", items: 20 },
        { name: "Ice Cream", image: "/src/assets/croissant.png", items: 20 },
        { name: "Fresh Juices", image: "/src/assets/croissant.png", items: 20 },
        { name: "Vegetables", image: "/src/assets/croissant.png", items: 20 },
    ];

    return (
        <Box>
            {/* Floating Menu Icon */} 
            {!isHeaderOpen && (
                <IconButton
                    onClick={toggleHeader}
                    sx={{
                        position: "fixed",
                        top: 24,
                        left: 16,
                        backgroundColor: "#fff",
                        boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
                        zIndex: 1000,
                    }}
                >
                    <ExpandMoreIcon sx={{ fontSize: 20, color: "#333" }} />
                </IconButton>
            )}
            {/* Header Section */}
            <Box
                sx={{
                    backgroundColor: "#fff",
                    borderBottom: "1px solid #ddd",
                    padding: isHeaderOpen ? "8px 16px" : "0 16px",
                    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                    height: isHeaderOpen ? "auto" : 0,
                    overflow: "hidden",
                    transition: "height 0.4s ease, padding 0.4s ease",
                }}
            >
                {isHeaderOpen && (
                    <Grid container alignItems="center" spacing={2}>
                        {/* Close Icon */}
                        <Grid item>
                            <IconButton onClick={toggleHeader}>
                                <ExpandLessIcon sx={{ fontSize: 28, color: "#333" }} />
                            </IconButton>
                        </Grid>

                        {/* Date and Time */}
                        <Grid item>
                            <Typography variant="body2" sx={{ fontWeight: "bold", color: "#666" }}>
                                {new Date().toLocaleString("en-US", {
                                    weekday: "short",
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                })}
                            </Typography>
                        </Grid>

                        {/* Search Bar, QR Code, and Logout Icons */}
                        <Grid item xs>
                            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
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
                                        backgroundColor: "#fbfbe5",
                                        borderRadius: "20px",
                                        "& .MuiOutlinedInput-root": {
                                            "& fieldset": {
                                                border: "none",
                                            },
                                        },
                                    }}
                                />
                                <IconButton>
                                    <QrCodeScannerIcon sx={{ fontSize: 28, color: "#333" }} />
                                </IconButton>
                                <IconButton>
                                    <LogoutIcon sx={{ fontSize: 28, color: "red" }} onClick={handleLogout} />
                                </IconButton>
                            </Box>
                        </Grid>
                    </Grid>
                )}

                {/* Category Tabs */}
                {isHeaderOpen && (
                    <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
                        {/* Left Arrow Icon */}
                        <IconButton onClick={() => scrollHorizontally("left")} sx={{ color: "#333" }}>
                            <ArrowBackIosIcon sx={{ fontSize: "20px" }} />
                        </IconButton>

                        {/* Scrollable Category Cards */}
                        <Box
                            ref={scrollContainerRef}
                            sx={{
                                display: "flex",
                                gap: 2,
                                overflowX: "auto",
                                whiteSpace: "nowrap",
                                p: 1,
                                scrollbarWidth: "none",
                                "&::-webkit-scrollbar": {
                                    display: "none",
                                },
                                flex: 1,
                            }}
                        >
                            {categories.map((category, index) => (
                                <Card
                                    key={index}
                                    onClick={() => setSelectedCategory(category.name)}
                                    sx={{
                                        minWidth: "100px",
                                        maxWidth: "120px",
                                        height: "150px",
                                        borderRadius: "12px",
                                        boxShadow:
                                            selectedCategory === category.name
                                                ? "0 2px 5px #74d52b"
                                                : "0 2px 5px rgba(0, 0, 0, 0.1)",
                                        backgroundColor: selectedCategory === category.name ? "rgb(238, 255, 226)" : "#F9F9F9",
                                        cursor: "pointer",
                                        transition: "box-shadow 0.3s",
                                    }}
                                >
                                    <CardMedia
                                        component="img"
                                        height="70"
                                        image={category.image}
                                        alt={category.name}
                                        sx={{ borderRadius: "12px 12px 0 0" }}
                                    />
                                    <CardContent sx={{ textAlign: "center", padding: "8px 0" }}>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                fontWeight: "bold",
                                                color: selectedCategory === category.name ? "#74d52b" : "#333",
                                            }}
                                        >
                                            {category.name}
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: "#999", fontSize: "12px" }}>
                                            {category.items} Items
                                        </Typography>
                                    </CardContent>
                                </Card>
                            ))}
                        </Box>


                        {/* Right Arrow Icon */}
                        <IconButton onClick={() => scrollHorizontally("right")} sx={{ color: "#333" }}>
                            <ArrowForwardIosIcon sx={{ fontSize: "20px" }} />
                        </IconButton>
                    </Box>
                )}
            </Box>

            
        </Box>
    );
};

export default Header;
