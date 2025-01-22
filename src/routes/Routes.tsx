import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import { LoginPage } from '../auth/AdminLogin';
import ForgotPassword from '../auth/ForgotPassword';
import UpdatePassword from '../auth/UpdatePassword';
import  { AdminLayout } from '../layout/AdminLayout';
import { StaffLayout } from '../layout/StaffLayout';
import Layout from '../layout/Layout';


const AppRoutes = () => {

//   const ProtectedRoute = ({ element }: { element: JSX.Element }) => {
//     const isAuth = !!localStorage.getItem('accessToken');
//     return isAuth ? element : <Navigate to="/" />;
//   };


  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        {/* <Route path="/Register" element={<Register />} /> */}
        <Route path="/ForgotPassword" element={<ForgotPassword />} />
        <Route path="/UpdatePassword" element={<UpdatePassword />} />
        <Route path="/layout" element={<Layout />} />
        <Route path="/admin-dashboard" element={<AdminLayout />} />
        <Route path="/staff-dashboard" element={<StaffLayout />} />

        {/* <Route path="/Layout" element={<ProtectedRoute element={<Layout />} />} />
        <Route path="/dashboard" element={<ProtectedRoute element={<WeatherApp />} />} />
        <Route path="/favourites" element={<ProtectedRoute element={<FavouritePage />} />} /> */}
      </Routes>
    </Router>
  );
};

export default AppRoutes;
