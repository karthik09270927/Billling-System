import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Box, Typography, Button, Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Paper } from '@mui/material';
import invoicelogo from '../../assets/bgrem.png';

interface InvoiceDialogProps {
    open: boolean;
    onSubmit: () => Promise<void>;
    onClose: () => void;
    userName: string;
    userEmail: string;
    userPhone: string;
    paymentMode: string;
    amount: number;
    products: Array<{
        productName: string;
        quantity: number;
        sellingPrice: number;
    }>;
}

const InvoiceDialog: React.FC<InvoiceDialogProps> = ({
    open,
    onClose,
    userName,
    userEmail,
    userPhone,
    paymentMode,
    amount,
    products
}) => {



    const [isLoading, setIsLoading] = useState(false);
    const [showPreview, setShowPreview] = useState(false);

    if(isLoading) {
        console.log(isLoading);
    }

    if(showPreview) {
        console.log(showPreview);
    }

    if(setIsLoading) {
        console.log(setIsLoading);
    }

    if(setShowPreview) {
        console.log(setShowPreview);
    }


    // const handlePayClick = async () => {
    //     setIsLoading(true);
    //     try {
    //         await onSubmit();
    //         setShowPreview(false);
    //     } catch (error) {
    //         console.error('Payment failed:', error);
    //     } finally {
    //         setIsLoading(false);
    //     }
    // };

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: '2-digit',
        }).format(date);
    };
    

    return (
        <Dialog open={open} onClose={(_, reason) => {
            if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
                return;
            }
            onClose();
        }}
            maxWidth="md"
            fullWidth >
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#b3c663' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <img src={invoicelogo} alt="Logo" style={{ width: 150, height: 150 }} />
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2 }}>
                    <Typography variant="h5" fontWeight="bold">FRESH HYPERMARKET</Typography>
                    <Typography variant="body2">info@hypermarket.com</Typography>
                    <Typography variant="body2">2nd,Ragam Towers,</Typography>
                    <Typography variant="body2">159,Sathy RD,SaravanamPatti, Coimbatore - 641 035</Typography>
                </Box>
            </DialogTitle>

            <DialogContent>
                <Box sx={{ mb: 5, display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography gutterBottom fontWeight="bold" sx={{ fontSize: 20 }}>
                            BILL TO:
                        </Typography>
                        <Box sx={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 2 }}>
                            <Typography color="text.secondary">Name:</Typography>
                            <Typography>{userName}</Typography>
                            <Typography color="text.secondary">Email:</Typography>
                            <Typography>{userEmail + '@coherent.in'}</Typography>
                            <Typography color="text.secondary">Phone:</Typography>
                            <Typography>{userPhone}</Typography>
                        </Box>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography gutterBottom fontWeight="bold" sx={{ fontSize: 20 }}>
                            Invoice Details :
                        </Typography>
                        <Box sx={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 2 }}>
                            <Typography color="text.secondary">Invoice No:</Typography>
                            <Typography>{/* invoice number */}</Typography>
                            <Typography color="text.secondary">Invoice Date:</Typography>
                            <Typography>{formatDate(new Date())}</Typography>
                            <Typography color="text.secondary">Payment Mode:</Typography>
                            <Typography>{paymentMode}</Typography>
                        </Box>
                    </Box>
                </Box>

                <TableContainer component={Paper} sx={{ mt: 2, background: '#fff' }}>
                    <Table size="medium" sx={{ border: '1px solid #000' }}>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: '#b3c663', border: '1px solid #000' }}>
                                <TableCell align="center" sx={{ fontWeight: 'bold', border: '1px solid #000' }}>S.No</TableCell>
                                <TableCell align="center" sx={{ fontWeight: 'bold', border: '1px solid #000' }}>Product</TableCell>
                                <TableCell align="center" sx={{ fontWeight: 'bold', border: '1px solid #000' }}>Price</TableCell>
                                <TableCell align="center" sx={{ fontWeight: 'bold', border: '1px solid #000' }}>Qty</TableCell>
                                <TableCell align="center" sx={{ fontWeight: 'bold', border: '1px solid #000' }}>Total</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {products.map((product, index) => (
                                <TableRow key={index} sx={{ border: '1px solid #000' }}>
                                    <TableCell align="center" sx={{ border: '1px solid #000' }}>{index + 1}</TableCell>
                                    <TableCell align="left" sx={{ border: '1px solid #000' }}>{product.productName}</TableCell>
                                    <TableCell align="center" sx={{ border: '1px solid #000' }}>₹ {product.sellingPrice.toFixed(2)}</TableCell>
                                    <TableCell align="center" sx={{ border: '1px solid #000' }}>{product.quantity}</TableCell>
                                    <TableCell align="center" sx={{ border: '1px solid #000' }}>
                                        ₹ {(product.quantity * product.sellingPrice).toFixed(2)}
                                    </TableCell>
                                </TableRow>
                            ))}
                            <TableRow sx={{ border: '1px solid #000' }}>
                                <TableCell colSpan={2} sx={{ border: '1px solid #000' }}></TableCell>
                                <TableCell align="center" sx={{ border: '1px solid #000', fontWeight: 'bold' }}>Total Quantity:</TableCell>
                                <TableCell align="center" sx={{ border: '1px solid #000', fontWeight: 'bold' }}>
                                    {products.reduce((acc, product) => acc + product.quantity, 0)}
                                </TableCell>
                                <TableCell sx={{ border: '1px solid #000' }}></TableCell>
                            </TableRow>
                            <TableRow sx={{ border: '1px solid #000' }}>
                                <TableCell colSpan={3} sx={{ border: '1px solid #000' }}></TableCell>
                                <TableCell align="center" sx={{ border: '1px solid #000', fontWeight: 'bold' }}>Subtotal:</TableCell>
                                <TableCell align="center" sx={{ border: '1px solid #000', fontWeight: 'bold' }}>
                                    ₹ {products.reduce((acc, product) => acc + product.quantity * product.sellingPrice, 0).toFixed(2)}
                                </TableCell>
                            </TableRow>
                            <TableRow sx={{ border: '1px solid #000' }}>
                                <TableCell colSpan={3} sx={{ border: '1px solid #000' }}></TableCell>
                                <TableCell align="center" sx={{ border: '1px solid #000', fontWeight: 'bold' }}>Total Amount:</TableCell>
                                <TableCell align="center" sx={{ border: '1px solid #000', fontWeight: 'bold' }}>
                                    ₹ {amount.toFixed(2)}
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>

                <Box sx={{ mt: 4, p: 2, background: '#b3c663' }}>
                    <Typography variant="body2" color="text.primary">
                        <strong>TERMS AND CONDITIONS:</strong>
                        <ul>
                            <li>Items sold are non-refundable without a bill.</li>
                            <li>Payment due within 15 days.</li>
                        </ul>
                    </Typography>
                    <Typography variant="body1" color="text.primary" sx={{ mt: 1, display: 'flex', justifyContent: 'center' }}>
                        Thank you for shopping at Fresh Hyper Market!
                    </Typography>
                    <Typography color="text.primary" sx={{ mt: 1, display: 'flex', justifyContent: 'center', fontSize: 12 }}>
                        Fresh Hyper Market © 2025 | All rights reserved.
                    </Typography>
                </Box>
            </DialogContent>

            <DialogActions sx={{ p: 3 }}>
                <Button onClick={onClose} variant="outlined" sx={{ borderColor: '#799F0C', color: '#799F0C', '&:hover': { borderColor: '#5fb321', backgroundColor: 'rgba(95, 179, 33, 0.1)' } }}>
                    Close
                </Button>
                {/* <Button
                    onClick={handlePayClick}
                    variant="contained"
                    disabled={isLoading}
                    sx={{
                        backgroundColor: '#799F0C',
                        '&:hover': {
                            backgroundColor: '#5fb321'
                        }
                    }}
                >
                    {isLoading ? <CircularProgress size={24} /> : 'Confirm Payment'}
                </Button> */}
            </DialogActions>
        </Dialog>
    );
};

export default InvoiceDialog;
