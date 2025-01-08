import axios from "axios";

// Create Axios instance
const api = axios.create({
  baseURL: "http://localhost:8080/api", // Replace with your backend URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to inject token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response interceptor to handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      //alert("Session expired. Please log in again.");
      //localStorage.removeItem("authToken");
      //localStorage.removeItem("role");
      //window.location.href = "/auth/sign-in";
    }
    return Promise.reject(error);
  }
);


export const login = async (email, password) => {
  try {
    const response = await api.post("/auth/login", { email, password });
    return response;
  } catch (error) {
    console.error("API Error:", error);

    if (error.response) {
      console.log("Error Response:", error.response);
      throw error.response; // Renvoie l'objet entier pour plus de contexte
    } else if (error.request) {
      console.log("Network Error:", error.request);
      throw { error: "Network error. Please check your connection." };
    } else {
      console.log("Unexpected Error:", error.message);
      throw { error: "An unexpected error occurred. Please try again later." };
    }
  }
};


export const register = async (userData) => {
  const response = await api.post("/auth/register", userData);
  return response.data;
};

export const verifyEmail = async (verificationToken, otpCode) => {
  const response = await api.post("/auth/verify-email", { verificationToken, otpCode });
  return response.data;
};

export const verifyOtp = async (verificationToken, otpCode) => {
  const response = await api.post("/auth/verify-otp", { verificationToken, otpCode });
  return response.data;
};

export const resendOtp = async (verificationToken, context) => {
  try {
      const response = await api.post("/auth/resend-otp", { verificationToken, context });
      console.log("Resend OTP - API Response:", response.data);
      return response.data;
  } catch (error) {
      console.error("Resend OTP - API Error:", error.response?.data || error);
      throw error;
  }
};


export const forgotPassword = async (email) => {
  const response = await api.post("/auth/forgot-password", { email });
  return response.data;
};

export const verifyResetOtp = async (verificationToken, otpCode) => {
  const response = await api.post("/auth/verify-reset-otp", { verificationToken, otpCode });
  return response.data;
};

export const resetPassword = async (verificationToken, newPassword, confirmNewPassword) => {
  const response = await api.post("/auth/reset-password", {
    verificationToken,
    newPassword,
    confirmNewPassword,
  });
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get("/auth/me");
  return response.data;
};

export default api;
