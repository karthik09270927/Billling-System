import React, { useState } from "react";
import { Box, Card, CardContent, Typography, Grid, MenuItem, TextField, Button, LinearProgress } from "@mui/material";
import { ArrowForward, ArrowBack, Category as CategoryIcon, LocalOffer as OfferIcon, CalendarToday as CalendarIcon } from "@mui/icons-material";

const categoryOptions = {
    electronics: ["Mobiles", "Laptops", "Accessories"],
    fashion: ["Clothing", "Footwear", "Jewelry"],
    home: ["Furniture", "Decor", "Appliances"]
} as const;

type CategoryType = keyof typeof categoryOptions;

const FlashSale = () => {
    const [category, setCategory] = useState<CategoryType | "">("");
    const [subCategory, setSubCategory] = useState("");
    const [offerName, setOfferName] = useState("");
    const [discount, setDiscount] = useState<number>(0);
    const [duration, setDuration] = useState<number>(0);
    const [step, setStep] = useState(0);

    const steps = [
        { label: "Category", icon: <CategoryIcon /> },
        { label: "Subcategory", icon: <OfferIcon /> },
        { label: "Offer Details", icon: <OfferIcon /> },
        { label: "Duration", icon: <CalendarIcon /> }
    ];

    const handleStepChange = (newStep: number) => {
        setStep(newStep);
    };

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
                            <TextField
                                select
                                label="Category"
                                fullWidth
                                value={category}
                                onChange={(e) => setCategory(e.target.value as CategoryType)}
                                sx={{ mt: 3 }}
                            >
                                {Object.keys(categoryOptions).map((cat) => (
                                    <MenuItem key={cat} value={cat} sx={{ color: "#444f68" }}>
                                        {cat.toUpperCase()}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <Button
                                variant="contained"
                                onClick={() => handleStepChange(1)}
                                sx={{
                                    mt: 3, backgroundColor: "#7ec326", color: "#fff", borderRadius: "20px", width: "100%",
                                    "&:disabled": { backgroundColor: "#e8f5e9" }
                                }}
                                disabled={!category}
                            >
                                Next Step <ArrowForward sx={{ ml: 1 }} />
                            </Button>
                        </CardContent>
                    </Card>
                )}

                {/* Subcategory Selection Card */}
                {step === 1 && category && (
                    <Card sx={{ boxShadow: 3, borderRadius: 2, padding: 3 }}>
                        <CardContent>
                            <Typography variant="h6" sx={{ fontWeight: "bold", color: "#7ec326" }}>Step 2: Select Subcategory</Typography>
                            <TextField
                                select
                                label="Subcategory"
                                fullWidth
                                value={subCategory}
                                onChange={(e) => setSubCategory(e.target.value)}
                                sx={{ mt: 3 }}
                            >
                                {categoryOptions[category].map((sub) => (
                                    <MenuItem key={sub} value={sub} sx={{ color: "#444f68" }}>
                                        {sub}
                                    </MenuItem>
                                ))}
                            </TextField>
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
                                value={offerName}
                                onChange={(e) => setOfferName(e.target.value)}
                                sx={{ mt: 3 }}
                            />
                            <Typography variant="body2" sx={{ color: "#555", mt: 1 }}>Enter the discount percentage</Typography>
                            <TextField
                                type="number"
                                label="Discount Percentage"
                                fullWidth
                                value={discount}
                                onChange={(e) => setDiscount(Number(e.target.value))}
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
                                value={duration}
                                onChange={(e) => setDuration(Number(e.target.value))}
                                sx={{ mt: 3 }}
                            />
                            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
                                <Button variant="outlined" onClick={() => handleStepChange(2)} sx={{
                                    color: "#7ec326", borderColor: "#7ec326", borderRadius: "20px", width: "48%"
                                }}><ArrowBack sx={{ mr: 1 }} /> Back</Button>
                                <Button
                                    variant="contained"
                                    onClick={() => alert('Offer Submitted!')}
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
