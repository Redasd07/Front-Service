import React, { useState, useEffect } from "react";
import { Input, Button, Typography, Card } from "@material-tailwind/react";
import { useLocation, useNavigate } from "react-router-dom";
import { resetPassword } from "@/services/api"; // API call for reset password
import CustomModal from "@/components/CustomModal";
import { FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

export function ResetPassword() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalData, setModalData] = useState({ isOpen: false, type: "error", message: "" });
  const navigate = useNavigate();
  const location = useLocation();

  // Extract verificationToken from state or fallback to localStorage
  const verificationToken = location.state?.verificationToken || localStorage.getItem("verificationToken");

  useEffect(() => {
    console.log("ResetPassword - Location State:", location.state);
    console.log("ResetPassword - Verification Token:", verificationToken);

    if (!verificationToken) {
      console.error("ResetPassword - Verification Token is missing!");
      setModalData({
        isOpen: true,
        type: "error",
        message: "Invalid or missing verification token. Please retry the process.",
      });
      navigate("/auth/forgot-password"); // Redirect to Forgot Password
    }
  }, [location.state, verificationToken, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setModalData({ isOpen: false });

    console.log("ResetPassword - Form Submitted");
    console.log("ResetPassword - New Password:", newPassword);
    console.log("ResetPassword - Confirm Password:", confirmPassword);

    // Validation checks
    if (!newPassword || !confirmPassword) {
      console.error("ResetPassword - Empty Fields Detected");
      setModalData({
        isOpen: true,
        type: "error",
        message: "Please fill out all fields.",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      console.error("ResetPassword - Passwords Do Not Match");
      setModalData({
        isOpen: true,
        type: "error",
        message: "Passwords do not match.",
      });
      return;
    }

    // Regex for password complexity validation
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      console.error("ResetPassword - Password Does Not Meet Complexity Requirements");
      setModalData({
        isOpen: true,
        type: "error",
        message: "Password must be at least 8 characters long and include an uppercase letter, a number, and a special character.",
      });
      return;
    }

    try {
      setLoading(true);
      console.log("ResetPassword - Submitting Reset Password Request");
      console.log("ResetPassword - API Call:", {
        verificationToken,
        newPassword,
        confirmPassword,
      });

      // Call the reset password API
      const response = await resetPassword(verificationToken, newPassword, confirmPassword);

      console.log("ResetPassword - API Response:", response);

      setModalData({
        isOpen: true,
        type: "success",
        message: "Your password has been reset successfully!",
      });

      // Redirect after success
      setTimeout(() => {
        console.log("ResetPassword - Redirecting to Sign-In Page");
        navigate("/auth/sign-in");
      }, 2000);
    } catch (error) {
      console.error("ResetPassword - API Error:", error.response?.data || error.message);

      setModalData({
        isOpen: true,
        type: "error",
        message: error.response?.data?.message || "Failed to reset password. Please try again.",
      });
    } finally {
      setLoading(false);
      console.log("ResetPassword - API Call Completed");
    }
  };

  return (
    <section
      className="h-screen w-screen bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: "url('/img/BG.png')" }}
    >
      <CustomModal
        isOpen={modalData.isOpen}
        type={modalData.type}
        message={modalData.message}
        onClose={() => setModalData({ isOpen: false })}
      />
      <Card className="p-10 w-full max-w-md rounded-lg shadow-lg">
        <div className="flex flex-col items-center mb-6">
          <FaLock className="text-6xl text-blue-500 mb-4 animate-pulse" />
          <Typography variant="h4" className="text-center font-bold text-gray-900">
            Reset Password
          </Typography>
          <Typography className="text-center text-gray-500">
            Enter your new password below.
          </Typography>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="relative mb-6">
            <FaLock className="absolute top-4 left-4 text-gray-500" />
            <Input
              type={showPassword ? "text" : "password"}
              size="lg"
              placeholder="New Password"
              className="pl-12 w-full rounded-lg border border-gray-300 focus:border-blue-500"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-4 right-4 text-gray-500"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          <div className="relative mb-6">
            <FaLock className="absolute top-4 left-4 text-gray-500" />
            <Input
              type={showConfirmPassword ? "text" : "password"}
              size="lg"
              placeholder="Confirm Password"
              className="pl-12 w-full rounded-lg border border-gray-300 focus:border-blue-500"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute top-4 right-4 text-gray-500"
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          <Button
            type="submit"
            className={`bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-full w-full ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </Button>
        </form>
      </Card>
    </section>
  );
}

export default ResetPassword;
