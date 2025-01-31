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
    Modal,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useCategory } from "../Hooks/useContext";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { deleteProductCategory, fetchCategories, fetchSubCategories, fetchUpdateProductCategory, postProductCategory } from "../utils/api-collection";
import EditIcon from '@mui/icons-material/Edit'
import {
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
} from "@mui/material";
import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { addProductBoxStyle, AdminHeaderBoxStyle, AdminHeaderIconEditStyle, AdminHeaderIconStyle, AdminHeaderSubBoxStyle, BoxcardStyle, cardBoxStyle, deleteIconCardStyle, editIconCardStyle, madalCardStyle, modalBoxStyle, modalBoxStyle2, TextFieldStyle, uploadImageStyle } from "../styles/admin.style";


const AdminHeader = () => {
    const [isHeaderOpen, setIsHeaderOpen] = useState(true);
    const [editProduct, setEditProduct] = useState(false);
    const [deleteProduct, setDeleteProduct] = useState(false);
    const [categories, setCategories] = useState<any[]>([]);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { selectedCategory, setSelectedCategory, setSubCategories, setSelectedCategoryId } = useCategory();
    const [uploadedImage, setUploadedImage] = useState<any | null>(null);
    const [itemName, setItemName] = useState("");
    const [subCategoryName, setSubCategoryName] = useState("");
    const [subCategory, setSubCategory] = useState<string[]>([]);
    const [step, setStep] = useState(1);
    const [editIndex, setEditIndex] = useState<number | null>(null);
    const [productId, setProductId] = useState<number | null>(null);
    const [_selectSubCategoryId, setSelectSubCategoryId] = useState<number[]>([]);

    const getCategories = async () => {
        try {
            const data = await fetchCategories();
            setCategories(data);
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
        setDeleteProduct(false);
        setEditProduct((prev) => !prev);
        console.log(editProduct);

    };

    const handleShowDelete = () => {
        setEditProduct(false);
        setDeleteProduct((prev) => !prev);
        console.log(editProduct);

    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setUploadedImage(null);
        setItemName("");
        setSubCategoryName("");
        setSubCategory([]);
        setStep(1);
    };

    const getUpdateProductCategory = async (categoryId: number) => {
        try {
            const data = await fetchUpdateProductCategory(categoryId);
            console.log(data);

            setItemName(data.data.categoryName);
            setUploadedImage(`data:image/jpeg;base64,${data.data.image}`);
            const extractedSubCategories = data.data.subCategory.map((sub: any) => sub.subCategoryName);
            setSubCategory(extractedSubCategories);
            const extractedSubCategoriesId = data.data.subCategory.map((sub: any) => sub.id);
            setSelectSubCategoryId(extractedSubCategoriesId);
            console.log("hi", extractedSubCategoriesId);
            setProductId(categoryId)
        } catch (error) {
            console.error("Error fetching subcategories:", error);
        }
    };

    const handleEdit = (categoryId: number) => {
        getUpdateProductCategory(categoryId);
        setIsModalOpen(true);
    };

    const handleDelete = async (categoryId: number) => {
        await deleteProductCategory(categoryId);
        getCategories();
        setSubCategories([]);
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
        try {
            const taskProject = {
                id: editProduct ? productId : null,
                categoryName: itemName,
                subCategory: subCategory.map((name) => ({
                    id: editProduct ? null : null,
                    subCategoryName: name,
                })),
            };

            if (!uploadedImage) {
                throw new Error("Please upload an image before submitting.");
            }

            const response = await postProductCategory(taskProject, uploadedImage);
            console.log(response);
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

    
    const handleBack = () => {
        if (step === 2) {
            setStep(1);
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
            {!isHeaderOpen && (
                <IconButton
                    onClick={toggleHeader}
                    sx={AdminHeaderBoxStyle} >
                    <ExpandMoreIcon sx={{ fontSize: 20, color: "#333" }} />
                </IconButton>
            )}

            <Box
                sx={{ ...AdminHeaderSubBoxStyle, padding: isHeaderOpen ? "8px 16px" : "0 16px", height: isHeaderOpen ? "auto" : 0, }} >
                {isHeaderOpen && (
                    <Grid container alignItems="center" spacing={2}>
                        <Grid item>
                            <IconButton onClick={toggleHeader}
                                sx={AdminHeaderIconStyle}>
                                <ExpandLessIcon sx={{ fontSize: 20, color: "#333" }} />
                            </IconButton>
                        </Grid>

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

                        <Grid item xs>
                            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
                                <IconButton
                                    onClick={handleShowEdit}
                                    sx={AdminHeaderIconEditStyle}>
                                    <EditIcon />
                                </IconButton>
                                <IconButton
                                    onClick={handleShowDelete}
                                    sx={AdminHeaderIconEditStyle}>
                                    <DeleteIcon />
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
                                    sx={TextFieldStyle} />
                            </Box>
                        </Grid>
                    </Grid>
                )}

                {isHeaderOpen && (
                    <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
                        <IconButton onClick={() => scrollHorizontally("left")} sx={{ color: "#333" }}>
                            <ArrowBackIosIcon sx={{ fontSize: "20px" }} />
                        </IconButton>

                        <Box
                            ref={scrollContainerRef}
                            sx={cardBoxStyle}
                        >
                            {categories.map((category, index) => (
                                <Card
                                    key={index}
                                    onClick={() => handleCategoryClick(category.id, category.categoryName)}
                                    sx={{
                                        ...BoxcardStyle, boxShadow:
                                            selectedCategory === category.categoryName
                                                ? "0 2px 5px #FDBE73"
                                                : "0 2px 5px rgba(0, 0, 0, 0.1)",
                                        backgroundColor: selectedCategory === category.categoryName ? "#faeee1" : "#F9F9F9",

                                    }}
                                >
                                    {editProduct && (
                                        <IconButton
                                            onClick={() => handleEdit(category.id)}
                                            sx={editIconCardStyle}
                                        >
                                            <EditIcon sx={{ fontSize: "18px", color: "#fff" }} />
                                        </IconButton>
                                    )
                                    }
                                    {deleteProduct && (
                                        <IconButton
                                            onClick={() => handleDelete(category.id)}
                                            sx={deleteIconCardStyle}
                                        >
                                            <DeleteIcon sx={{ fontSize: "18px", color: "#fff" }} />
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
                                                color: selectedCategory === category.categoryName ? "rgb(255, 145, 0)" : "#333",
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
                                sx={madalCardStyle}
                            >
                                <Box
                                    sx={modalBoxStyle}
                                >
                                    <AddIcon sx={{ fontSize: "60px", color: "#FDBE73" }} />
                                </Box>

                                <CardContent sx={{ textAlign: "center", padding: "8px 0" }}>
                                    <Typography variant="body2" sx={{ fontWeight: "bold", color: "#333" }}>
                                        Add Item
                                    </Typography>

                                </CardContent>
                            </Card>
                        </Box>
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
                <Box sx={modalBoxStyle2} >
                    {step === 1 && (
                        <>
                            <Typography
                                variant="h6"
                                sx={{ textAlign: "center", mb: 3, fontWeight: "bold", color: "rgb(255, 145, 0)" }}
                            >
                                Add Category
                            </Typography>
                            <Box sx={addProductBoxStyle} >
                                <input
                                    accept="image/*"
                                    type="file"
                                    id="upload-image"
                                    style={{ display: "none" }}
                                    onChange={handleImageUpload}
                                />
                                <label htmlFor="upload-image">
                                    <Box
                                        sx={uploadImageStyle}
                                    >
                                        {uploadedImage ? (
                                            <img
                                                src={uploadedImage}
                                                alt="Uploaded"
                                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                            />
                                        ) : (
                                            <AddIcon sx={{ fontSize: "50px", color: "rgb(255, 145, 0)" }} />
                                        )}
                                    </Box>
                                </label>
                                {!uploadedImage && (
                                    <Typography variant="body2" sx={{ mt: 1, color: "#555" }}>
                                        Upload Category Image
                                    </Typography>
                                )}
                                {editProduct && (
                                    <Typography variant="body2" sx={{ mt: 1, color: "#555" }}>
                                        Update Category Image
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

                            <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
                                <Button
                                    variant="contained"
                                    color="error"
                                    fullWidth
                                    
                                    onClick={handleCloseModal}
                                >
                                    Close
                                </Button>

                                {/* Next Button */}
                                <Button
                                    variant="contained"
                                    color="success"
                                    fullWidth
                                    onClick={handleNext}
                                    disabled={!itemName || !uploadedImage}
                                    sx={{
                                        backgroundColor: "rgb(255, 145, 0)",
                                        "&:hover": {
                                            backgroundColor: "#FDBE73",
                                        }}}
                                >
                                    Next
                                </Button>
                            </Box>

                        </>
                    )}

                    {step === 2 && (
                        <>
                            <Typography
                                variant="h6"
                                sx={{ textAlign: "center", mb: 3, fontWeight: "bold", color: "rgb(255, 145, 0)" }}
                            >
                                Add Subcategories
                            </Typography>
                            <Box sx={{ display: "flex", mb: 2 }}>
                                <TextField
                                    fullWidth
                                    label="Sub Category Name"
                                    variant="outlined"
                                    value={subCategoryName}
                                    onChange={(e) => setSubCategoryName(e.target.value)}
                                    sx={{ mr: 2 }}
                                />
                                <Button
                                    variant="contained"
                                    onClick={handleAddSubCategory}
                                    sx={{ backgroundColor: "#FDBE73", "&:hover": { backgroundColor: "#FDBE73" } }}
                                >
                                    {editIndex !== null ? 'Update' : 'Add'}
                                </Button>
                            </Box>
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
                                                <EditIcon sx={{ color: "#38bc36" }} />
                                            </IconButton>
                                            <IconButton
                                                edge="end"
                                                aria-label="delete"
                                                onClick={() => handleRemoveSubCategory(index)}
                                            >
                                                <DeleteIcon sx={{ color: "red" }}/>
                                            </IconButton>
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                ))}
                            </List>
                            <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
                            <Button
                                    variant="contained"
                                    
                                    fullWidth
                                    sx={{ mt: 3 }}
                                    onClick={handleBack}
                                >
                                    Back
                                </Button>
                                <Button
                                    variant="contained"
                                    color="error"
                                    fullWidth
                                    sx={{ mt: 3 }}
                                    onClick={handleCloseModal}
                                >
                                    Close
                                </Button>
                                <Button
                                    variant="contained"
                                    fullWidth
                                    onClick={handleSubmit}
                                    disabled={subCategory.length === 0}
                                    sx={{
                                        mt: 3 ,
                                        backgroundColor: "rgb(255, 145, 0)",
                                        "&:hover": {
                                            backgroundColor: "#FDBE73",
                                        }}}
                                >
                                    Submit
                                </Button>
                            </Box>


                        </>
                    )}
                </Box>
            </Modal>
        </Box>
    );
};

export default AdminHeader;
