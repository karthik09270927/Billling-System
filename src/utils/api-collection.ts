import axios from 'axios';
import { API_ENDPOINTS } from './endpoint';
import {  showErrorToast } from './toast';
import { toast } from 'react-toastify';


const API = axios.create({
  baseURL: 'https://primustt-backend-dev.coherent.in',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

const refreshToken = async (): Promise<string | null> => {
  try {
    const tokenData = localStorage.getItem("refreshToken");
    console.log(tokenData);

    const response= await API.post('/auth/refreshToken', {
      refreshToken: tokenData,
    });
    console.log(response);

    const token = (response.data as { accessToken: string; refreshToken: string }).accessToken;
    const refreshToken = (response.data as { accessToken: string; refreshToken: string }).refreshToken;

    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.setItem("accessToken", token);
    localStorage.setItem("refreshToken", refreshToken);

    return token;
  } catch (error) {
    console.error("Failed to refresh token:", error);
    return null;
  }
};

// Request Interceptor
API.interceptors.request.use(
  (config: any) => {
    const token = localStorage.getItem('accessToken');
    if (
      token && 
      !["/auth/authenticate", "/auth/refreshToken"].some((url) => config.url?.includes(url))
    ) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
API.interceptors.response.use(
  (response: any) => {
    setTimeout(() => {
    }, 1000);
    return response;
  },
  async (error: any) => {
    const originalRequest = error.config;
    console.log(error.response);

    if (error.response?.status === 403) {
      const newToken = await refreshToken();
      if (newToken && originalRequest) {
        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
        return API(originalRequest); // Retry the original request with the new token
      } else {
        localStorage.clear();
        window.location.href = '/auth/authenticate';
        window.location.reload();
      }
    }
    showErrorToast((error.response?.data as any).message || 'Something went wrong');
    return Promise.reject(error);
  }
);




export const loginUser = async (employeeCode: string, password: string): Promise<any> => {
  try {
    const response = await API.post(API_ENDPOINTS.LOGIN, { employeeCode, password });
    console.log('API Response:', response);
    const { accessToken, refreshToken } = (response.data as { data: { accessToken: string; refreshToken: string } }).data || {};
    if (accessToken && refreshToken) {
      localStorage.setItem('accessToken', accessToken);
      console.log('Access Token:', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      console.log('Refresh Token:', refreshToken);
    } else {
      throw new Error('Tokens are missing from the response');
    }

    return response.data;
  } catch (error: any) {
    console.error('Login Error:', error);
    throw error.response?.data?.message || 'Something went wrong';
  }
};



export const fetchCategories = async (): Promise<any> => {
  try {
    const response = await API.get('/billing/productcategoryList'); 
    return (response.data as any).data;
  } catch (error: any) {
    console.error('Error fetching categories:', error);
    showErrorToast(error.response?.data?.message || 'Something went wrong');
    throw (error.response?.data as { message: string })?.message || 'Something went wrong';
  }
};


// export const registerUser = async (userName: string, age: string, userMail: string, password: string): Promise<any> => {
//   try {
//     const response = await API.post(API_ENDPOINTS.REGISTER, { userName, age, userMail, password });
//     return response.data;
//   } catch (error: any) {
//     throw error.response?.data?.message || 'Registration failed';
//   }
// };

// export const forgotPassword = async (userMail: string): Promise<any> => {
//   try {
//     const response = await API.post(API_ENDPOINTS.FORGOT_PASSWORD, { userMail });
//     return response.data;
//   } catch (error: any) {
//     console.error('Error sending OTP:', error.response?.data || error);
//     throw error.response?.data?.message || 'Something went wrong';
//   }
// };

// export const updatePassword = async (userMail: string, password: string): Promise<any> => {
//   try {
//     const response = await API.post(API_ENDPOINTS.UPDATE_PASSWORD, { userMail, password });
//     return response.data;
//   } catch (error: any) {
//     console.error('Error updating password:', error.response?.data || error);
//     throw error.response?.data?.message || 'Failed to update password';
//   }
// };

// export const verifyOTP = async (userMail: string, otp: string): Promise<any> => {
//   try {
//     const response = await API.post(API_ENDPOINTS.VERIFY_OTP, { userMail, otp });
//     return response.data;
//   } catch (error: any) {
//     console.error("Error verifying OTP:", error.response?.data || error);
//     throw error.response?.data || { message: "An unknown error occurred" };
//   }
// };


