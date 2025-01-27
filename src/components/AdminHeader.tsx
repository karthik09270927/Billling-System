import { useEffect, useRef, useState } from "react";
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
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Modal,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useCategory } from "../Hooks/useContext";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { useNavigate } from "react-router-dom";
import { fetchCategories, fetchSubCategories, postProductCategory } from "../utils/api-collection";
import EditIcon from '@mui/icons-material/Edit'
import {

    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
} from "@mui/material";
import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";


const AdminHeader = () => {
    const [isHeaderOpen, setIsHeaderOpen] = useState(true);
    const [editProduct, setEditProduct] = useState(false);
    const [categories, setCategories] = useState<any[]>([]);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { selectedCategory, setSelectedCategory, setSubCategories,setSelectedCategoryId } = useCategory();
    const navigate = useNavigate();
    const [uploadedImage, setUploadedImage] = useState<any | null>(null);
    const [itemName, setItemName] = useState("");
    const [subCategoryName, setSubCategoryName] = useState("");
    const [subCategory, setSubCategory] = useState<string[]>([]);
    const [step, setStep] = useState(1); // Step tracker
    const [editIndex, setEditIndex] = useState<number | null>(null);


    const getCategories = async () => {
        try {
            const data = await fetchCategories();
            setCategories(data); // Set the fetched categories
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

   

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

    const handleShowEdit = () => {
        setEditProduct((prev) => !prev);
        console.log(editProduct);

    };

    const handleAddItem = () => {


    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setUploadedImage(null);
        setItemName("");
        setSubCategoryName("");
        setSubCategory([]);
        setStep(1);

    };

    const handleEdit = () => {
        setIsModalOpen(true);
        console.log("edit");

    };


    const handleDelete = () => {
        console.log("delete");

    };

    const handleCategoryClick = async (categoryId: number, categoryName: string) => {
        try {
            setSelectedCategory(categoryName); 
            setSelectedCategoryId(categoryId);
            const response = await fetchSubCategories(categoryId); 
            setSubCategories(response.data); 
        } catch (error) {
            console.error("Error fetching subcategories:", error);
        }
    };



    const handleSave = () => {
        console.log("Item Name:", itemName);
        console.log("Uploaded Image:", uploadedImage);
        console.log("Category:", subCategoryName);
        setIsModalOpen(false);
        setUploadedImage(null);
        setItemName("");
        setSubCategoryName("");

    };


    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target) {
                    setUploadedImage(event.target.result as string);
                }
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const handleAddSubCategory = () => {
        if (subCategoryName.trim()) {
            if (editIndex !== null) {
                const updatedSubCategories = [...subCategory];
                updatedSubCategories[editIndex] = subCategoryName;
                setSubCategory(updatedSubCategories);
                setEditIndex(null); 
            } else {
                setSubCategory([...subCategory, subCategoryName]);
            }
            setSubCategoryName(''); 
        } else {
            alert("Subcategory name cannot be empty."); 
        }
    };
    
    


    const handleRemoveSubCategory = (index: number) => {
        setSubCategory(subCategory.filter((_, i) => i !== index));
    };

    const handleEditSubCategory = (index: number) => {
        setSubCategoryName(subCategory[index]);
        setEditIndex(index);
    };
    


    const handleSubmit = async () => {
        console.log("Category Name:", itemName);
        console.log("Uploaded Image:", uploadedImage);
        console.log("Sub Categories:", subCategory);
      
        try {
          const taskProject = {
            id: null,
            categoryName: itemName,
            subCategoryName: subCategory,
          };
      
          if (!uploadedImage) {
            throw new Error("Please upload an image before submitting.");
          }
      
          const response = await postProductCategory(taskProject, uploadedImage);
          console.log("Submission successful:", response);
          getCategories();
       
          setIsModalOpen(false);
          setUploadedImage(null);
          setItemName("");
          setSubCategoryName("");
          setSubCategory([]);
          setStep(1);

        } catch (error) {
          console.error("Error during submission:", error);
        }
      };
      
      

    const handleNext = () => {
        if (step === 1) {
            setStep(2);
        }
    };

    useEffect(() => {
        getCategories();
    }, []);




    return (
        <Box sx={{ pt: 0 }}>
            {/* Floating Menu Icon */}
            {!isHeaderOpen && (
                <IconButton
                    onClick={toggleHeader}
                    sx={{
                        position: "fixed",
                        top: 90,
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
                            <IconButton onClick={toggleHeader}
                                sx={{
                                    position: "fixed",
                                    top: 80,
                                    left: 16,
                                    backgroundColor: "#fff",
                                    boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
                                    zIndex: 1000,
                                }}
                            >
                                <ExpandLessIcon sx={{ fontSize: 20, color: "#333" }} />
                            </IconButton>
                        </Grid>

                        {/* Date and Time */}
                        <Grid item>
                            <Typography variant="body2" sx={{ fontWeight: "bold", color: "#666", ml: 4 }}>
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
                                <IconButton
                                    onClick={handleShowEdit}
                                    sx={{
                                        backgroundColor: "rgb(238, 255, 226)",
                                        borderRadius: "20px",
                                        "& .MuiOutlinedInput-root": {
                                            "& fieldset": {
                                                border: "none",
                                            },
                                        },
                                    }}>
                                    <EditIcon />
                                </IconButton>
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
                                        backgroundColor: "rgb(238, 255, 226)",
                                        borderRadius: "20px",
                                        "& .MuiOutlinedInput-root": {
                                            "& fieldset": {
                                                border: "none",
                                            },
                                        },
                                    }}
                                />

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
                                    onClick={() => handleCategoryClick(category.id, category.categoryName)}
                                    sx={{
                                        minWidth: "120px",
                                        maxWidth: "140px",
                                        height: "150px",
                                        borderRadius: "12px",
                                        boxShadow:
                                            selectedCategory === category.categoryName
                                                ? "0 2px 5px #74d52b"
                                                : "0 2px 5px rgba(0, 0, 0, 0.1)",
                                        backgroundColor: selectedCategory === category.categoryName ? "rgb(238, 255, 226)" : "#F9F9F9",
                                        cursor: "pointer",
                                        transition: "box-shadow 0.3s",
                                        position: "relative",
                                    }}
                                >


                                    {editProduct && (
                                        <IconButton
                                            onClick={handleEdit}
                                            sx={{
                                                position: "absolute",
                                                borderRadius: "0% 30% 0% 70%",
                                                right: "0px",
                                                backgroundColor: "#74d52b",
                                                zIndex: 1,
                                                '&:hover': {
                                                    backgroundColor: "rgb(169, 252, 91)",
                                                },
                                            }}
                                        >
                                            <EditIcon sx={{ fontSize: "18px", color: "#fff" }} />
                                        </IconButton>
                                    )
                                    }

                                    <CardMedia
                                        component="img"
                                        height="90"
                                        image={`data:image/jpeg;base64,${category.image}`}
                                        alt={category.categoryName}
                                        sx={{ borderRadius: "12px 12px 0 0" }}
                                    />
                                    <CardContent sx={{ textAlign: "center", padding: "8px 0" }}>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                fontWeight: "bold",
                                                color: selectedCategory === category.categoryName ? "#74d52b" : "#333",
                                            }}
                                        >
                                            {category.categoryName}
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: "#999", fontSize: "12px" }}>
                                            {category.count} Items
                                        </Typography>
                                    </CardContent>
                                </Card>
                            ))}

                            <Card
                                onClick={() => setIsModalOpen(true)}
                                sx={{
                                    minWidth: "120px",
                                    maxWidth: "140px",
                                    height: "150px",
                                    borderRadius: "12px",
                                    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                                    backgroundColor: "#F9F9F9",
                                    cursor: "pointer",
                                    transition: "box-shadow 0.3s",
                                }}
                            >
                                <Box
                                    sx={{
                                        height: "90px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        backgroundColor: "#F9F9F9",
                                        borderRadius: "12px 12px 0 0",
                                    }}
                                >
                                    <AddIcon sx={{ fontSize: "60px", color: "#74d52b" }} />
                                </Box>

                                <CardContent sx={{ textAlign: "center", padding: "8px 0" }}>
                                    <Typography variant="body2" sx={{ fontWeight: "bold", color: "#333" }}>
                                        Add Item
                                    </Typography>

                                </CardContent>
                            </Card>


                        </Box>
                        {/* Right Arrow Icon */}
                        <IconButton onClick={() => scrollHorizontally("right")} sx={{ color: "#333" }}>
                            <ArrowForwardIosIcon sx={{ fontSize: "20px" }} />
                        </IconButton>
                    </Box>
                )}
            </Box>
            <Modal
                open={isModalOpen}
                onClose={handleCloseModal}
                sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
            >
                <Box
                    sx={{
                        backgroundColor: "#FBFBE5",
                        borderRadius: "8px",
                        boxShadow: 24,
                        p: 4,
                        width: "400px",
                        textAlign: "center",
                    }}
                >
                    {step === 1 && (
                        <>
                            <Typography
                                variant="h6"
                                sx={{ textAlign: "center", mb: 3, fontWeight: "bold", color: "#333" }}
                            >
                                Add Category
                            </Typography>

                            {/* Image Upload */}
                         <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    flexDirection: "column",
                                    mb: 3,
                                }}
                            >
                                <input
                                    accept="image/*"
                                    type="file"
                                    id="upload-image"
                                    style={{ display: "none" }}
                                    onChange={handleImageUpload}
                                />
                                <label htmlFor="upload-image">
                                    <Box
                                        sx={{
                                            width: "150px",
                                            height: "150px",
                                            backgroundColor: "#F0F0F0",
                                            borderRadius: "8px",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            cursor: "pointer",
                                            border: "1px dashed #74d52b",
                                            overflow: "hidden",
                                        }}
                                    >
                                        {uploadedImage ? (
                                            <img
                                                src={uploadedImage}
                                                alt="Uploaded"
                                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                            />
                                        ) : (
                                            <AddIcon sx={{ fontSize: "50px", color: "#74d52b" }} />
                                        )}
                                    </Box>
                                </label>
                                {!uploadedImage && (
                                    <Typography variant="body2" sx={{ mt: 1, color: "#555" }}>
                                        Upload Category Image
                                    </Typography>
                                )}
                            </Box>   

                            {/* Item Name Input */}
                            <TextField
                                fullWidth
                                label="Category Name"
                                variant="outlined"
                                value={itemName}
                                onChange={(e) => setItemName(e.target.value)}
                                sx={{ mb: 3 }}
                            />

                            {/* Next Button */}
                            <Button
                                variant="contained"
                                color="success"
                                fullWidth
                                onClick={handleNext}
                                disabled={!itemName || !uploadedImage}
                            >
                                Next
                            </Button>
                        </>
                    )}

                    {step === 2 && (
                        <>
                            <Typography
                                variant="h6"
                                sx={{ textAlign: "center", mb: 3, fontWeight: "bold", color: "#333" }}
                            >
                                Add Subcategories
                            </Typography>

                            {/* Sub Category Input */}
                            <Box sx={{ display: "flex", mb: 2 }}>
                            <TextField
                                fullWidth
                                label="Sub Category Name"
                                variant="outlined"
                                value={subCategoryName}
                                onChange={(e) => setSubCategoryName(e.target.value)}
                                sx={{ mr: 2 }}
                            />

                            {/* Next Button */}
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleAddSubCategory}
                            >
                                {editIndex !== null ? 'Update' : 'Add'}
                            </Button>
                            </Box>

                            {/* Sub Category List */}
                            <List>
                                {subCategory.map((subCategory, index) => (
                                    <ListItem key={index} sx={{ borderBottom: "1px solid #ddd" }}>
                                        <ListItemText primary={subCategory} />
                                        <ListItemSecondaryAction>
                                        <IconButton
                                                edge="end"
                                                aria-label="delete"
                                                onClick={() => handleEditSubCategory(index)}
                                            >
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton
                                                edge="end"
                                                aria-label="delete"
                                                onClick={() => handleRemoveSubCategory(index)}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                ))}
                            </List>

                            {/* Submit Button */}
                            <Button
                                variant="contained"
                                color="success"
                                fullWidth
                                sx={{ mt: 3 }}
                                onClick={handleSubmit}
                                disabled={subCategory.length === 0}
                            >
                                Submit
                            </Button>
                        </>
                    )}
                </Box>
            </Modal>



        </Box>
    );
};

export default AdminHeader;
