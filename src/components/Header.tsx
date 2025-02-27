import { useRef, useState, useEffect } from "react";
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
    Tooltip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
import { useCategory } from "../Hooks/useContext";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { fetchCategories, fetchSubCategories } from "../utils/api-collection";
import Logout from "../centralizedComponents/forms/Logout";

const Header = () => {
    const [isHeaderOpen, setIsHeaderOpen] = useState(true);
    const [categories, setCategories] = useState<any[]>([]);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const { selectedCategory, setSelectedCategory, setSubCategories, setSelectedCategoryId, setIsSubCategoriesLoading } = useCategory();
    const navigate = useNavigate();
    const [time, setTime] = useState(new Date().toLocaleString("en-US", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        timeZone: "UTC"
    }));


    useEffect(() => {
        const interval = setInterval(() => {
            setTime(new Date().toLocaleString("en-US", {
                weekday: "short",
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "numeric",
                minute: "numeric",
                second: "numeric",
                timeZone: "UTC"
            }));
        }, 1000);

        return () => clearInterval(interval);
    }, []);


    // Fetch categories from the API on component mount
    useEffect(() => {
        const getCategories = async () => {
            try {
                const data = await fetchCategories();
                setCategories(data);
            } catch (error: any) {
                console.error("Error fetching categories:", error);
                if (error.response && error.response.data) {
                    throw error.response.data.message;
                } else {
                    throw "Something went wrong";
                }
            }
        };

        getCategories();
    }, []);

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

    const handleLogout = () => {
        localStorage.removeItem('userRole');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        navigate('/');
    };
    const handleCategoryClick = async (categoryId: number, categoryName: string) => {
        try {
            setSelectedCategory(categoryName); // Set selected category name
            setSelectedCategoryId(categoryId); // Set selected category ID

            setSubCategories([]);
            // Set subcategory loading state to true before API call
            setIsSubCategoriesLoading(true);

            const response = await fetchSubCategories(categoryId); // Call SubCategoryList API
            setSubCategories(response.data); // Update subcategories in context

            // Set subcategory loading state to false after the API call
            setIsSubCategoriesLoading(false);
        } catch (error) {
            console.error("Error fetching subcategories:", error);
            setIsSubCategoriesLoading(false); // Ensure loading state is false on error
        }
    };


    return (
        <Box sx={{ borderBottom: '2px solid #e0e0e0' }}>
            {/* Floating Menu Icon */}
            {!isHeaderOpen && (
                <IconButton
                    onClick={toggleHeader}
                    sx={{
                        position: "fixed",
                        top: 10,
                        left: '43rem',
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
                    transition: "height 0.6s ease, padding 0.4s ease",
                }}
            >
                {isHeaderOpen && (
                    <Grid container alignItems="center" spacing={2}>
                        {/* Close Icon */}
                        <Grid item>
                            <IconButton onClick={toggleHeader}
                                sx={{
                                    position: "fixed",
                                    top: 18,
                                    left: 16,
                                    backgroundColor: "#fff",
                                    boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
                                    zIndex: 1000,
                                }}>
                                <ExpandLessIcon sx={{ fontSize: 20, color: "#333" }} />
                            </IconButton>
                        </Grid>

                        {/* Date and Time */}
                        <Grid item>
                            <Typography variant="body1" sx={{ fontWeight: "bold", color: "#666", ml: 4 }}>
                                {time}
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
                                        width: '200px',
                                        '& .MuiOutlinedInput-root': {
                                            backgroundColor: '#fcf8cd',
                                            borderRadius: '8px',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                            '& fieldset': {
                                                border: 'none'
                                            },
                                            '&:hover fieldset': {
                                                border: 'none'
                                            },
                                            '&.Mui-focused fieldset': {
                                                border: 'none'
                                            }
                                        }
                                    }}
                                />
                                {/* <Tooltip title="Logout" placement="top" arrow>
                                    <IconButton onClick={handleLogout}>
                                        <Logout />
                                    </IconButton>
                                </Tooltip> */}

                                <IconButton onClick={handleLogout}>
                                    <Logout />
                                </IconButton>

                            </Box>
                        </Grid>
                    </Grid>
                )}

                {/* Category Tabs */}
                {isHeaderOpen && (
                    <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
                        {/* Left Arrow Icon */}
                        <IconButton onClick={() => scrollHorizontally("left")} sx={{ color: "#74d52b" }}>
                            <ArrowBackIosIcon sx={{ fontSize: "24px" }} />
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
                                    onClick={() => handleCategoryClick(category.id, category.categoryName)} sx={{
                                        minWidth: "130px",
                                        maxWidth: "150px",
                                        height: "160px",
                                        borderRadius: "12px",
                                        boxShadow:
                                            selectedCategory === category.categoryName
                                                ? "0 2px 5px #74d52b"
                                                : "0 2px 5px rgba(0, 0, 0, 0.1)",
                                        backgroundColor: selectedCategory === category.categoryName ? "rgb(238, 255, 226)" : "#fffcf2",
                                        cursor: "pointer",
                                        transition: "box-shadow 0.3s",
                                    }}
                                >
                                    <CardMedia
                                        component="img"
                                        height="100"
                                        image={`data:image/jpeg;base64,${category.image}`} // Decode and use base64 image
                                        alt={category.categoryName}
                                        sx={{ borderRadius: "12px 12px 0 0" }}
                                    />
                                    <CardContent sx={{ textAlign: "center", padding: "8px 0" }}>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                fontWeight: "bolder",
                                                color: selectedCategory === category.categoryName ? "#74d52b" : "#333",
                                            }}
                                        >
                                            {category.categoryName}
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: "#333", fontSize: "12px" }}>
                                            {category.count} Category
                                        </Typography>
                                    </CardContent>
                                </Card>
                            ))}
                        </Box>


                        {/* Right Arrow Icon */}
                        <IconButton onClick={() => scrollHorizontally("right")} sx={{ color: "#74d52b" }}>
                            <ArrowForwardIosIcon sx={{ fontSize: "24px" }} />
                        </IconButton>
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default Header;

