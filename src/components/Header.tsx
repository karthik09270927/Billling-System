import React, { useRef } from "react";
import {
    Box,
    Grid,
    Typography,
    Button,
    IconButton,
    TextField,
    InputAdornment,
    Card,
    CardContent,
    CardMedia,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import QrCodeIcon from "@mui/icons-material/QrCode";

const Header: React.FC = () => {

    const scrollContainerRef = useRef<HTMLDivElement>(null);


    const scrollHorizontally = (direction: "left" | "right") => {
        if (scrollContainerRef.current) {
            const scrollAmount = direction === "left" ? -200 : 200;
            scrollContainerRef.current.scrollBy({
                left: scrollAmount,
                behavior: "smooth",
            });
        }
    };

    const categories = [
        { name: "All Menu", image: "/src/assets/croissant.png", items: 20 },
        { name: "Breads", image: "/src/assets/puffs.png", items: 20 },
        { name: "Cakes", image: "/src/assets/croissant.png", items: 20 },
        { name: "Donuts", image: "/src/assets/croissant.png", items: 20 },
        { name: "Pastries", image: "/src/assets/croissant.png", items: 20 },
        { name: "Sandwich", image: "/src/assets/croissant.png", items: 20 },
        { name: "Mani", image: "/src/assets/croissant.png", items: 20 },
        { name: "Sakthi", image: "/src/assets/croissant.png", items: 20 },
        { name: "Karthi", image: "/src/assets/croissant.png", items: 20 },
    ];
    return (
        <Box
            sx={{
                backgroundColor: "#fff",
                borderBottom: "1px solid #ddd",
                padding: "10px",
                boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                marginBottom: "10px"
            }}
        >
            {/* Top Section */}
            <Box
                sx={{
                    backgroundColor: "#fff",
                    borderBottom: "1px solid #ddd",
                    padding: "8px 16px",
                    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                }}
            >
                <Grid container alignItems="center" spacing={2}>
                    {/* Menu Icon */}
                    <Grid item>
                        <IconButton>
                            <MenuIcon sx={{ fontSize: 28, color: "#333" }} />
                        </IconButton>
                    </Grid>

                    {/* Date and Time */}
                    <Grid item>
                        <Typography variant="body2" sx={{ fontWeight: "bold", color: "#666" }}>
                            Wed. 29 May 2024
                        </Typography>
                    </Grid>
                    
                    

                    {/* Search Bar */}
                    <Grid item xs={6}>
                        <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
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
                                    height: "32px", 
                                    backgroundColor: "#fbfbe5",
                                    borderRadius: "8px",
                                    "& .MuiOutlinedInput-root": {
                                        "& fieldset": {
                                            border: "none",
                                        },
                                        "& .MuiInputBase-input": {
                                            padding: "6px 12px",
                                        },
                                    },
                                }}
                            />
                        </Box>
                    </Grid>

                    {/* QR Code and Logout Icons */}
                    <Grid item xs>
                        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
                            <IconButton>
                                <QrCodeIcon sx={{ fontSize: 28, color: "#333" }} />
                            </IconButton>
                            <IconButton>
                                <PowerSettingsNewIcon sx={{ fontSize: 28, color: "#f00" }} />
                            </IconButton>
                        </Box>
                    </Grid>
                </Grid>
            </Box>

            {/* Category Tabs */}
            <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
                {/* Left Arrow Icon */}
                <IconButton onClick={() => scrollHorizontally("left")} sx={{ color: "#333" }}>
                    <ArrowBackIosIcon />
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
                            sx={{
                                minWidth: "100px",
                                maxWidth: "120px",
                                Height: '150px',
                                borderRadius: "12px",
                                boxShadow: index === 0 ? "0 2px 5px rgba(0, 123, 255, 0.2)" : "none",
                                backgroundColor: index === 0 ? "#EAF4FF" : "#F9F9F9",
                            }}
                        >
                            {/* Image */}
                            <CardMedia
                                component="img"
                                height="70"
                                width="30"
                                image={category.image}
                                alt={category.name}
                                sx={{ borderRadius: "12px 12px 0 0" }}
                            />
                            {/* Content */}
                            <CardContent sx={{ textAlign: "center", "&:last-child": { paddingBottom: 0, paddingTop: 0 }, }}>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        fontWeight: "bold",
                                        color: index === 0 ? "#007BFF" : "#333",
                                    }}
                                >
                                    {category.name}
                                </Typography>
                                <Typography
                                    variant="caption"
                                    sx={{ color: "#999", fontSize: "12px" }}
                                >
                                    {category.items} Items
                                </Typography>
                            </CardContent>
                        </Card>
                    ))}
                </Box>

                {/* Right Arrow Icon */}
                <IconButton onClick={() => scrollHorizontally("right")} sx={{ color: "#333" }}>
                    <ArrowForwardIosIcon />
                </IconButton>
            </Box>

            {/* Search Bar */}

        </Box>
    );
};

export default Header;
