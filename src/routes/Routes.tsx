import { BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import { LoginPage } from '../auth/AdminLogin';
import ForgotPassword from '../auth/ForgotPassword';
import UpdatePassword from '../auth/UpdatePassword';
import StaffLayout from '../layout/StaffLayout';
import AdminLayout from '../layout/AdminLayout';
import ProductManagement from '../pages/productmanagement';
import UserHistory from '../pages/userhistory';


const AppRoutes = () => {


  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        {/* <Route path="/Register" element={<Register />} /> */}
        <Route path="/ForgotPassword" element={<ForgotPassword />} />
        <Route path="/UpdatePassword" element={<UpdatePassword />} />
        <Route path="/staff-dashboard" element={<StaffLayout />} />

        {/* <Route path="/Layout" element={<ProtectedRoute element={<Layout />} />} />
        <Route path="/dashboard" element={<ProtectedRoute element={<WeatherApp />} />} />
        <Route path="/favourites" element={<ProtectedRoute element={<FavouritePage />} />} /> */}

        <Route path="/admin-dashboard"  element={<AdminLayout />}  >
        <Route index element={<Navigate to="productmanagement" />} />
        <Route path="productmanagement"  element={<ProductManagement />}  />
        <Route path="userhistory"  element={<UserHistory />}  />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRoutes;






