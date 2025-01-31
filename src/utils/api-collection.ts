import axios from "axios";
import { API_ENDPOINTS } from "./endpoint";
import { Toasts } from "../centralizedComponents/forms/Toast";


const API = axios.create({
  baseURL: "https://primustt-backend-dev.coherent.in",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

const refreshToken = async (): Promise<string | null> => {
  try {
    const tokenData = localStorage.getItem("refreshToken");
    const userId = JSON.parse(atob(tokenData?.split(".")[1] || "")).id;
    if (!tokenData || !userId)
      throw new Error("Invalid refreshToken or userId");

    const response = await API.post("/auth/refreshToken", {
      refreshToken: tokenData,
      userId,
    });

    const { accessToken, refreshToken } = (response.data as any).data || {};

    // Save new tokens
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    return accessToken;
  } catch (error) {
    console.error("Failed to refresh token:", error);
    return null;
  }
};

// Request Interceptor
API.interceptors.request.use(
  (config: any) => {
    const token = localStorage.getItem("accessToken");
    if (
      token &&
      !["/auth/authenticate", "/auth/refreshToken"].some((url) =>
        config.url?.includes(url)
      )
    ) {
      config.headers["Authorization"] = `Bearer ${token}`;
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
    setTimeout(() => { }, 1000);
    return response;
  },
  async (error: any) => {
    const originalRequest = error.config;
    console.log(error.response);

    if (error.response?.status === 403) {
      const newToken = await refreshToken();
      if (newToken && originalRequest) {
        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
        return API(originalRequest);
      } else {
        localStorage.clear();
        window.location.href = "/auth/authenticate";
        window.location.reload();
      }
    }
    Toasts((error.response?.data as any).message || "Something went wrong");
    return Promise.reject(error);
  }
);

export const loginUser = async (
  employeeCode: string,
  password: string
): Promise<any> => {
  try {
    const response = await API.post(API_ENDPOINTS.LOGIN, {
      employeeCode,
      password,
    });
    console.log("API Response:", response);
    const { accessToken, refreshToken } = (response.data as any).data || {};
    if (accessToken && refreshToken) {
      localStorage.setItem("accessToken", accessToken);
      console.log("Access Token:", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      console.log("Refresh Token:", refreshToken);
    } else {
      throw new Error("Tokens are missing from the response");
    }

    return response.data;
  } catch (error: any) {
    console.error("Login Error:", error);
    throw error.response?.data?.message || "Something went wrong";
  }
};

export const fetchCategories = async (): Promise<any> => {
  try {
    const response = await API.get("/billing/productCategoryListDropDown");
    return (response.data as any).data;
  } catch (error: any) {
    console.error("Error fetching categories:", error);
    throw (
      (error.response?.data as { message: string })?.message ||
      "Something went wrong"
    );
  }
};

export const fetchSubCategories = async (categoryId: number) => {
  const response = await API.get<{ data: any }>(
    `/billing/productSubCategoryListDropDown?id=${categoryId}`
  );
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

export const saveBill = async (billData: {
  userName: string;
  userEmail: string;
  userPhone: string;
  paymentMode: string;
  products: Array<{ productId: number; quantity: number }>;
}) => {
  try {
    const response = await API.post("/billingProduct/saveBill", billData);
    return response.data;
  } catch (error) {
    console.error("Error saving bill:", error);
    throw error;
  }
};

export const getUserDetails = async (phoneNumber: string): Promise<any> => {
  try {
    const response = await API.get<{ data: any }>(`/billingProduct/getUserDetails?userPhone=${phoneNumber}`);
    return response.data?.data;
  } catch (error) {
    console.error('Error fetching user details:', error);
    return null;
  }
};

export const getProductInfoById = async (id: number) => {
  try {
    const response = await API.get<{ data: any }>(`/billing/productsInfo?id=${id}`);
    return response.data?.data;
  } catch (error) {
    console.error('Error fetching product info:', error);
    throw error;
  }
};

interface CardDetails {
  cardType: string;
  cardNumber: string;
  cardValidity: string;
  cvvNumber: string;
  email: string;
}

interface OtpVerification {
  enteredOtp: string;
  email: string;
}

export const saveCardDetails = async (cardData: CardDetails): Promise<any> => {
  try {
    const response = await API.post('/card/saveCard', cardData);
    return response.data;
  } catch (error: any) {
    console.error('Error saving card:', error);
    throw error.response?.data?.message || 'Failed to save card details';
  }
};

export const verifyCardOtp = async (otpData: OtpVerification): Promise<any> => {
  try {
    const response = await API.get('/card/verifyOtpAndPlaceOrder', {
      params: otpData
    });
    return response.data;
  } catch (error: any) {
    console.error('Error verifying OTP:', error);
    throw error.response?.data?.message || 'Failed to verify OTP';
  }
};


export const forgotPassword = async (userEmail: string): Promise<any> => {
  try {
    const response = await API.post(API_ENDPOINTS.FORGOT_PASSWORD, {
      userEmail,
    });
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error(`Request failed with status code ${response.status}`);
    }
  } catch (error: any) {
    console.error("Error sending OTP:", error.response?.data || error);
    throw error.response?.data?.message || "Something went wrong";
  }
};

export const updatePassword = async (
  mail: string,
  password: string
): Promise<any> => {
  try {
    const response = await API.post(API_ENDPOINTS.UPDATE_PASSWORD, {
      mail,
      password,
    });
    return response.data;
  } catch (error: any) {
    console.error("Error updating password:", error.response?.data || error);
    throw error.response?.data?.message || "Failed to update password";
  }
};

export const verifyOTP = async (
  userEmail: string,
  otp: string
): Promise<any> => {
  try {
    const response = await API.post(API_ENDPOINTS.VERIFY_OTP, {
      userEmail,
      otp,
    });
    return response.data;
  } catch (error: any) {
    console.error("Error verifying OTP:", error.response?.data || error);
    throw error.response?.data || { message: "An unknown error occurred" };
  }
};

const base64ToFile = (base64String: string, fileName: string): File => {
  const byteString = atob(base64String.split(",")[1]);
  const mimeString = base64String.split(",")[0].split(":")[1].split(";")[0];
  const byteArray = new Uint8Array(byteString.length);

  for (let i = 0; i < byteString.length; i++) {
    byteArray[i] = byteString.charCodeAt(i);
  }

  return new File([byteArray], fileName, { type: mimeString });
};

export const postProductCategory = async (
  taskProject: { id: any; categoryName: string; subCategory: { id: number[] | null; subCategoryName: string }[] },
  base64Image: string
): Promise<any> => {
  try {
    const imageFile = base64ToFile(base64Image, "uploaded_image.jpg");
    const formattedTaskProject = {
      ...taskProject,
      subCategory: taskProject.subCategory.map(sub => ({
        ...sub,
        id: Array.isArray(sub.id) ? (sub.id[0] !== null ? sub.id[0] : undefined) : (sub.id !== null ? sub.id : undefined),
      }))
    };
    const formData = new FormData();
    formData.append("taskProject", JSON.stringify(formattedTaskProject));
    formData.append("image", imageFile);
    const response = await API.post(`/billing/productSubCategory`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error: any) {
    console.error(
      "Error posting product category:",
      error.response?.data || error
    );
    throw error.response?.data?.message || "Failed to post product category";
  }
};



export const fetchUpdateProductCategory = async (selectedCategoryId: number) => {
  const response = await API.get<{ data: any }>(`/billing/productSubCategory?id=${selectedCategoryId}`);
  if (response.status !== 200) throw new Error("Failed to fetch subcategories");
  return response.data;
};

// User History

export const fetchUserList = async () => {
  const response = await API.get(`/billingProduct/userHistory`);
  return response.data;
};

export const getAdminProductList = async () => {
  const response = await API.get(`/billing/adminProductsList`);
  return response.data;
};

export const saveProduct = async (productList: Array<{
  id: number;
  productName: string;
  image: string;
  billingProductCategory: number;
  billingProductSubCategory: number;
  price: number;
}>) => {
  try {
    const response = await API.post("/billing/productSave", { productList });
    return response.data;
  } catch (error) {
    console.error("Error saving product:", error);
    throw error;
  }
};

export const getProductDetails = async (id: number) => {
  try {
    const response = await API.get<{ data: any }>(`/billing/adminProductInfoId?id=${id}`);
    return response.data?.data;
  } catch (error) {
    console.error('Error fetching product info:', error);
    throw error;
  }
};

export const deleteProductCategory = async (id: number) => {
  try {
    const response = await API.delete<{ data: any }>(`/billing/productSubCategory?id=${id}`);
    return response.data?.data;
  } catch (error) {
    console.error('Error fetching product info:', error);
    throw error;
  }
};


export const getAdminEachProductDetail = async (id: number) => {
  try {
    const response = await API.get<{ data: any }>(`/billing/adminProductInfoId?id=${id}`);
    return response.data?.data;
  } catch (error) {
    console.error('Error fetching product info:', error);
    throw error;
  }
};


