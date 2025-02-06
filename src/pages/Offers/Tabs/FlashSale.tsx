import { useEffect, useState } from "react";
import { Box, Card, CardContent, Typography, MenuItem, TextField, Button, LinearProgress, FormControl, InputLabel, Select } from "@mui/material";
import { ArrowForward, ArrowBack, Category as CategoryIcon, LocalOffer as OfferIcon, CalendarToday as CalendarIcon } from "@mui/icons-material";
import { fetchCategories, fetchSubCategories, saveFlashOffer } from "../../../utils/api-collection";
import { Controller, useForm } from "react-hook-form";

const categoryOptions = {
    electronics: ["Mobiles", "Laptops", "Accessories"],
    fashion: ["Clothing", "Footwear", "Jewelry"],
    home: ["Furniture", "Decor", "Appliances"]
} as const;


const FlashSale = () => {
    const [offerName, setOfferName] = useState("");
    const [discount, setDiscount] = useState<number>(0);
    const [duration, setDuration] = useState<number>(0);
    const [step, setStep] = useState(0);
    const [categories, setCategories] = useState<any[]>([]);
    const [subCategory, setSubCategory] = useState<any[]>([]);
    const [selectedProductCategoryId, setselectedProductCategoryId] = useState<number>(0);
    const [selectedSubCategoryId, setselectedSubCategoryId] = useState<number>(0);

    const { control, handleSubmit, watch, setValue, register, reset, getValues } = useForm({
        defaultValues: {
            category: "",
            subCategory: "",
            offerName: "",
            discount: 0,
            duration: 0
        },
    });

    const steps = [
        { label: "Category", icon: <CategoryIcon /> },
        { label: "Subcategory", icon: <OfferIcon /> },
        { label: "Offer Details", icon: <OfferIcon /> },
        { label: "Duration", icon: <CalendarIcon /> }
    ];

    const handleStepChange = (newStep: number) => {
        setStep(newStep);
    };

    const getCategories = async () => {
        try {
            const data = await fetchCategories();
            setCategories(data);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    const getSubCategories = async (id: any) => {
        try {
            const subdata = await fetchSubCategories(id);
            setSubCategory(subdata.data);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };


    const handleCategoryChange = (value: any) => {
        console.log("Category changed to:", value);
        getSubCategories(value);
        setselectedProductCategoryId(value);
    };

    const handleSubCategoryChange = (value: any) => {
        setselectedSubCategoryId(value);
    };


    const onSubmit = async (data: any) => {
        console.log("Submit data", data);
        
        try {
            const productList = {
                subCategoryId: selectedSubCategoryId || 0,
                discountPercentage: data.discount || 0,
                offerName: data.offerName || "",
                offerType: "Flash Sale",
            };
            console.log("Product List:", productList);

            const response = await saveFlashOffer(productList);
            console.log("Product saved successfully:", response);
            setStep(0);
        } catch (error) {
            console.error("Error in submitting product:", error);
        } finally {
            reset();
            setStep(0);
        }
    };


    useEffect(() => {
        getCategories();
    }, []);

    return (
        <Box sx={{ display: "flex", height: "100vh" }}>
            {/* Side Navigation */}
            <Box sx={{
                width: 250, backgroundColor: "#e8f5e9", padding: 3, borderRight: "1px solid #ddd", display: "flex", flexDirection: "column"
            }}>
                <Typography variant="h5" sx={{ fontWeight: "bold", marginBottom: 3 }}>Steps</Typography>
                {steps.map((stepItem, index) => (
                    <Button
                        key={index}
                        variant="text"
                        onClick={() => handleStepChange(index)}
                        sx={{
                            textTransform: "none", justifyContent: "flex-start", color: step === index ? "#7ec326" : "#555",
                            fontWeight: step === index ? "bold" : "normal", display: "flex", alignItems: "center", gap: 1,
                            padding: "10px 0"
                        }}
                    >
                        {stepItem.icon} {stepItem.label}
                    </Button>
                ))}
            </Box>

            {/* Main Content Area */}
            <Box sx={{ flex: 1, padding: 4 }}>
                {/* Progress Bar */}
                <LinearProgress
                    variant="determinate"
                    value={(step + 1) * 25}
                    sx={{
                        marginBottom: 3,
                        height: 6,
                        borderRadius: 2,
                        backgroundColor: "#e0e0e0",
                        "& .MuiLinearProgress-bar": {
                            backgroundColor: "#7ec326",
                        },
                    }}
                />

                {/* Category Selection Card */}
                {step === 0 && (
                    <Card sx={{ boxShadow: 3, borderRadius: 2, padding: 3 }}>
                        <CardContent>
                            <Typography variant="h6" sx={{ fontWeight: "bold", color: "#7ec326" }}>Step 1: Select Category</Typography>
                            <FormControl fullWidth sx={{ mt: 3 }}>
                                <InputLabel id="category-label">Category</InputLabel>
                                <Controller
                                    name="category"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            labelId="category-label"
                                            label="Category"
                                            defaultValue=""

                                            onChange={(event) => {
                                                field.onChange(event);
                                                handleCategoryChange(event.target.value);
                                            }}
                                        >
                                            {categories.map((category, index) => (
                                                <MenuItem key={index} value={category.id}>
                                                    {category.categoryName}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    )}
                                />
                            </FormControl>
                            <Button
                                variant="contained"
                                onClick={() => handleStepChange(1)}
                                sx={{
                                    mt: 3, backgroundColor: "#7ec326", color: "#fff", borderRadius: "20px", width: "100%",
                                    "&:disabled": { backgroundColor: "#e8f5e9" }
                                }}
                                disabled={!categories}
                            >
                                Next Step <ArrowForward sx={{ ml: 1 }} />
                            </Button>
                        </CardContent>
                    </Card>
                )}

                {/* Subcategory Selection Card */}
                {step === 1 && categories && (
                    <Card sx={{ boxShadow: 3, borderRadius: 2, padding: 3 }}>
                        <CardContent>
                            <Typography variant="h6" sx={{ fontWeight: "bold", color: "#7ec326" }}>Step 2: Select Subcategory</Typography>
                            <FormControl fullWidth sx={{ mt: 3 }}>
                                <InputLabel id="subcategory-label">Sub Category</InputLabel>
                                <Controller
                                    name="subCategory"
                                    control={control}
                                    render={({ field }) => (
                                        <Select

                                            {...field}
                                            labelId="subcategory-label"
                                            label="Sub Category"
                                            defaultValue=""
                                            onChange={(event) => {
                                                field.onChange(event);
                                                handleSubCategoryChange(event.target.value);
                                            }}
                                        >
                                            {subCategory.map((subCategories, index) => (
                                                <MenuItem key={index} value={subCategories.id}>
                                                    {subCategories.subCategoryName}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    )}
                                />
                            </FormControl>
                            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
                                <Button variant="outlined" onClick={() => handleStepChange(0)} sx={{
                                    color: "#7ec326", borderColor: "#7ec326", borderRadius: "20px", width: "48%"
                                }}><ArrowBack sx={{ mr: 1 }} /> Back</Button>
                                <Button
                                    variant="contained"
                                    onClick={() => handleStepChange(2)}
                                    sx={{
                                        backgroundColor: "#7ec326", color: "#fff", borderRadius: "20px", width: "48%",
                                        "&:disabled": { backgroundColor: "#e8f5e9" }
                                    }}
                                    disabled={!subCategory}
                                >
                                    Next Step <ArrowForward sx={{ ml: 1 }} />
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                )}

                {/* Offer Details Card */}
                {step === 2 && (
                    <Card sx={{ boxShadow: 3, borderRadius: 2, padding: 3 }}>
                        <CardContent>
                            <Typography variant="h6" sx={{ fontWeight: "bold", color: "#7ec326" }}>Step 3: Offer Details</Typography>
                            <TextField
                                label="Offer Name"
                                fullWidth
                                {...register("offerName")}
                                sx={{ mt: 3 }}
                            />
                            <Typography variant="body2" sx={{ color: "#555", mt: 1 }}>Enter the discount percentage</Typography>
                            <TextField
                                type="number"
                                label="Discount Percentage"
                                fullWidth
                                {...register("discount", {
                                    setValueAs: (value) => Math.min(100, Number(value) || 0),
                                })}
                                sx={{ mt: 3 }}
                            />
                            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
                                <Button variant="outlined" onClick={() => handleStepChange(1)} sx={{
                                    color: "#7ec326", borderColor: "#7ec326", borderRadius: "20px", width: "48%"
                                }}><ArrowBack sx={{ mr: 1 }} /> Back</Button>
                                <Button
                                    variant="contained"
                                    onClick={() => handleStepChange(3)}
                                    sx={{
                                        backgroundColor: "#7ec326", color: "#fff", borderRadius: "20px", width: "48%",
                                        "&:disabled": { backgroundColor: "#e8f5e9" }
                                    }}
                                    disabled={!offerName || discount === 0}
                                >
                                    Next Step <ArrowForward sx={{ ml: 1 }} />
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                )}

                {/* Offer Duration Card */}
                {step === 3 && (
                    <Card sx={{ boxShadow: 3, borderRadius: 2, padding: 3 }}>
                        <CardContent>
                            <Typography variant="h6" sx={{ fontWeight: "bold", color: "#7ec326" }}>Step 4: Offer Duration</Typography>
                            <TextField
                                type="number"
                                label="Duration (Days)"
                                fullWidth
                                {...register("duration")}
                                sx={{ mt: 3 }}
                            />
                            
                            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
                                <Button variant="outlined" onClick={() => handleStepChange(2)} sx={{
                                    color: "#7ec326", borderColor: "#7ec326", borderRadius: "20px", width: "48%"
                                }}><ArrowBack sx={{ mr: 1 }} /> Back</Button>
                                <Button
                                    variant="contained"
                                    onClick={handleSubmit(onSubmit)}
                                    sx={{
                                        backgroundColor: "#7ec326", color: "#fff", borderRadius: "20px", width: "48%"
                                    }}
                                    disabled={duration === 0}
                                >
                                    Submit Offer
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                )}
            </Box>
        </Box>
    );
};

export default FlashSale;


