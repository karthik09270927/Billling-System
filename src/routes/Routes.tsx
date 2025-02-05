import { BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import { LoginPage } from '../auth/AdminLogin';
import ForgotPassword from '../auth/ForgotPassword';
import UpdatePassword from '../auth/UpdatePassword';
import StaffLayout from '../layout/StaffLayout';
import AdminLayout from '../layout/AdminLayout';
import ProductManagement from '../pages/productmanagement';
import UserHistoryPage from '../pages/userhistory';
import ProductListPage from '../pages/productList';
import EditTable from '../pages/EditTable';
import OffersPage from '../pages/Offers/OffersPage';


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
        <Route path="userhistory"  element={<UserHistoryPage />}  />
        <Route path="productlist"  element={<ProductListPage />}  />
        <Route path="offerspage"  element={<OffersPage />}  />
        <Route path="edit-product/:id"  element={<EditTable />}  />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRoutes;






