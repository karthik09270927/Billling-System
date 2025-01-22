import { Button, Grid, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom';

export const AdminLayout = () => {

    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem('userRole'); // Clear role from localStorage
        navigate('/'); // Redirect to login page
      };

    return (
        <Grid container>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <Typography variant="h4" component="h1" sx={{ textAlign: 'center', mt: 2 }}>
                    Admin Dashboard
                </Typography>
                <Typography variant="h6" component="h2" sx={{ textAlign: 'center', mt: 2 }}>
                    <Button onClick={handleLogout}>Logout</Button>
                </Typography>
            </Grid>
        </Grid>
    )
}