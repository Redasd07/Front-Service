import axios from "axios";

// Create Axios instance
const api = axios.create({
  baseURL: "http://localhost:8080/api", // Replace with your backend URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Login API
export const login = async (email, password) => {
  try {
    const response = await api.post("/auth/login", { email, password });
    return response.data;
  } catch (error) {
    throw error.response?.data || "Error during login.";
  }
};

// Register API
export const register = async (userData) => {
  try {
    const response = await api.post("/auth/register", userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || "Error during registration.";
  }
};

// Verify Email API
export const verifyEmail = async (email, otpCode) => {
  try {
    const response = await api.post("/auth/verify-email", { email, otpCode });
    return response.data;
  } catch (error) {
    throw error.response?.data || "Error during email verification.";
  }
};

// Verify OTP for 2FA API
export const verifyOtp = async (email, otpCode) => {
  try {
    const response = await api.post("/auth/verify-otp", null, {
      params: { email, otpCode },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || "Error during OTP verification.";
  }
};

// Resend OTP API
export const resendOtp = async (email, context) => {
  try {
    const response = await api.post("/auth/resend-otp", null, {
      params: { email, context },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || "Error during OTP resend.";
  }
};

// Forgot Password API
export const forgotPassword = async (email) => {
  try {
    const response = await api.post("/auth/forgot-password", null, {
      params: { email },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || "Error during forgot password.";
  }
};

// Reset Password API
export const resetPassword = async (token, newPassword, confirmNewPassword) => {
  try {
    const response = await api.post(
      "/auth/reset-password",
      { newPassword, confirmNewPassword },
      {
        params: { token },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || "Error during reset password.";
  }
};

// Get Current User API
export const getCurrentUser = async () => {
  try {
    const response = await api.get("/auth/me");
    return response.data;
  } catch (error) {
    throw error.response?.data || "Error fetching current user.";
  }
};

export default api;
