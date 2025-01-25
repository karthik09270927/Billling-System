import axios from 'axios';
import { API_ENDPOINTS } from './endpoint';
import { Toasts } from '../centralizedComponents/forms/Toast';


const API = axios.create({
  baseURL: 'https://primustt-backend-dev.coherent.in',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

const refreshToken = async (): Promise<string | null> => {
  try {
    const tokenData = localStorage.getItem('refreshToken');
    const userId = JSON.parse(atob(tokenData?.split('.')[1] || '')).id;
    if (!tokenData || !userId) throw new Error('Invalid refreshToken or userId');

    const response = await API.post('/auth/refreshToken', {
      refreshToken: tokenData,
      userId,
    });

    const { accessToken, refreshToken } = (response.data as any).data || {};

    // Save new tokens
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);

    return accessToken;
  } catch (error) {
    console.error('Failed to refresh token:', error);
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
    Toasts((error.response?.data as any).message || 'Something went wrong');
    return Promise.reject(error);
  }
);




export const loginUser = async (employeeCode: string, password: string): Promise<any> => {
  try {
    const response = await API.post(API_ENDPOINTS.LOGIN, { employeeCode, password });
    console.log('API Response:', response);
    const { accessToken, refreshToken } = (response.data as any).data || {};
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
    const response = await API.get('/billing/productCategoryListDropDown');
    return (response.data as any).data;
  } catch (error: any) {
    console.error('Error fetching categories:', error);
    throw (error.response?.data as { message: string })?.message || 'Something went wrong';
  }
};


export const fetchSubCategories = async (categoryId: number) => {
  const response = await API.get<{ data: any }>(`/billing/productSubCategoryListDropDown?id=${categoryId}`);
  if (response.status !== 200) throw new Error("Failed to fetch subcategories");
  return response.data;
};

export const fetchProductList = async (
  productCategoryId: number,
  subProductCategoryId: number,
  pageNo: number,
  pageSize: number
) => {
  try {
    const response = await API.get(
      `/billing/productsList?pageNo=${pageNo}&pageSize=${pageSize}&productCategoryId=${productCategoryId}&subProductCategoryId=${subProductCategoryId}`
    );
    const data = response.data as { data: any; totalCount: number };
    return {
      products: data.data,
      totalCount: data.totalCount, 
    };
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};



export const forgotPassword = async (userEmail: string): Promise<any> => {
  try {
    const response = await API.post(API_ENDPOINTS.FORGOT_PASSWORD, { userEmail });
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error(`Request failed with status code ${response.status}`);
    }
  } catch (error: any) {
    console.error('Error sending OTP:', error.response?.data || error);
    throw error.response?.data?.message || 'Something went wrong';
  }
};

export const updatePassword = async (mail: string, password: string): Promise<any> => {
  try {
    const response = await API.post(API_ENDPOINTS.UPDATE_PASSWORD, { mail, password });
    return response.data;
  } catch (error: any) {
    console.error('Error updating password:', error.response?.data || error);
    throw error.response?.data?.message || 'Failed to update password';
  }
};

export const verifyOTP = async (userEmail: string, otp: string): Promise<any> => {
  try {
    const response = await API.post(API_ENDPOINTS.VERIFY_OTP, { userEmail, otp });
    return response.data;
  } catch (error: any) {
    console.error("Error verifying OTP:", error.response?.data || error);
    throw error.response?.data || { message: "An unknown error occurred" };
  }
};