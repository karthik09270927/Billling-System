import { useState } from "react";
import { Box, Card, CardContent, Typography, TextField, MenuItem, Button, LinearProgress } from "@mui/material";
import { ArrowForward, ArrowBack, LocalOffer as OfferIcon, DateRange as DateIcon, TypeSpecimen as TypeIcon } from "@mui/icons-material";

const offerTypes = ["Discount", "Buy 1 Get 1", "Free Shipping", "Cashback"];

const SpecialOffer = () => {
    const [offerName, setOfferName] = useState("");
    const [discount, setDiscount] = useState<number>(0);
    const [validTill, setValidTill] = useState<string>("");
    const [offerType, setOfferType] = useState(offerTypes[0]);
    const [step, setStep] = useState(0);

    const steps = [
        { label: "Offer Details", icon: <OfferIcon /> },
        { label: "Discount Info", icon: <OfferIcon /> },
        { label: "Validity", icon: <DateIcon /> },
        { label: "Offer Type", icon: <TypeIcon /> }
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

                {/* Offer Details Card */}
                {step === 0 && (
                    <Card sx={{ boxShadow: 3, borderRadius: 2, padding: 3 }}>
                        <CardContent>
                            <Typography variant="h6" sx={{ fontWeight: "bold", color: "#7ec326" }}>Step 1: Offer Details</Typography>
                            <TextField
                                label="Offer Name"
                                fullWidth
                                value={offerName}
                                onChange={(e) => setOfferName(e.target.value)}
                                sx={{ mt: 3 }}
                            />
                            <Button
                                variant="contained"
                                onClick={() => handleStepChange(1)}
                                sx={{
                                    mt: 3, backgroundColor: "#7ec326", color: "#fff", borderRadius: "20px", width: "100%",
                                    "&:disabled": { backgroundColor: "#e8f5e9" }
                                }}
                                disabled={!offerName}
                            >
                                Next Step <ArrowForward sx={{ ml: 1 }} />
                            </Button>
                        </CardContent>
                    </Card>
                )}

                {/* Discount Info Card */}
                {step === 1 && (
                    <Card sx={{ boxShadow: 3, borderRadius: 2, padding: 3 }}>
                        <CardContent>
                            <Typography variant="h6" sx={{ fontWeight: "bold", color: "#7ec326" }}>Step 2: Discount Info</Typography>
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
                                    disabled={discount === 0}
                                >
                                    Next Step <ArrowForward sx={{ ml: 1 }} />
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                )}

                {/* Valid Till Date Card */}
                {step === 2 && (
                    <Card sx={{ boxShadow: 3, borderRadius: 2, padding: 3 }}>
                        <CardContent>
                            <Typography variant="h6" sx={{ fontWeight: "bold", color: "#7ec326" }}>Step 3: Valid Till Date</Typography>
                            <TextField
                                type="date"
                                label="Offer Valid Till"
                                fullWidth
                                value={validTill}
                                onChange={(e) => setValidTill(e.target.value)}
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
                                    disabled={!validTill}
                                >
                                    Next Step <ArrowForward sx={{ ml: 1 }} />
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                )}

                {/* Offer Type Card */}
                {step === 3 && (
                    <Card sx={{ boxShadow: 3, borderRadius: 2, padding: 3 }}>
                        <CardContent>
                            <Typography variant="h6" sx={{ fontWeight: "bold", color: "#7ec326" }}>Step 4: Offer Type</Typography>
                            <TextField
                                select
                                label="Offer Type"
                                fullWidth
                                value={offerType}
                                onChange={(e) => setOfferType(e.target.value)}
                                sx={{ mt: 3 }}
                            >
                                {offerTypes.map((type) => (
                                    <MenuItem key={type} value={type} sx={{ color: "#444f68" }}>
                                        {type}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
                                <Button variant="outlined" onClick={() => handleStepChange(2)} sx={{
                                    color: "#7ec326", borderColor: "#7ec326", borderRadius: "20px", width: "48%"
                                }}><ArrowBack sx={{ mr: 1 }} /> Back</Button>
                                <Button
                                    variant="contained"
                                    onClick={() => alert('Special Offer Submitted!')}
                                    sx={{
                                        backgroundColor: "#7ec326", color: "#fff", borderRadius: "20px", width: "48%"
                                    }}
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

export default SpecialOffer;
