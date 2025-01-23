import * as React from 'react';
import Toolbar from '@mui/material/Toolbar';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { Outlet } from 'react-router-dom';
import AdminHeader from './AdminHeader';
const AdminLayout = () => {
    return (
        <>
            <React.Fragment>
                <CssBaseline />
                <Box sx={{ bgcolor: '#C8E0EC' }}>
                    <AdminHeader />
                </Box>
                <Toolbar id="back-to-top-anchor" />
                <Container maxWidth={false} disableGutters sx={{ padding: "0px" }}>
                    <Box sx={{ mt: 0 }}>
                        <Outlet />
                    </Box>
                </Container>
            </React.Fragment>
        </>
    );
}
export default AdminLayout;
