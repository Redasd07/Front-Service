import React, { useState } from "react";
import { Button, Typography, Card } from "@material-tailwind/react";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { forgotPassword } from "@/services/api"; // Backend API function for forgot password
import CustomModal from "@/components/CustomModal";
import { useNavigate, Link } from "react-router-dom";

export function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalData, setModalData] = useState({ isOpen: false, type: "error", message: "" });

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate email format
    if (!/\S+@\S+\.\S+/.test(email)) {
      console.log("Invalid email format:", email);
      setModalData({
        isOpen: true,
        type: "error",
        message: "Invalid email format. Please enter a valid email.",
      });
      return;
    }

    try {
      console.log("Submitting Forgot Password request for email:", email);
      setLoading(true);
      setModalData({ isOpen: false });

      // Call backend forgot password API
      const response = await forgotPassword(email);

      console.log("Forgot Password API response:", response);

      const { status, verificationToken, error } = response;

      // Handle email not verified
      if (status === 403 && error === "Email is not verified") {
        console.log("Email not verified. Redirecting to verify-email context.");
        setModalData({
          isOpen: true,
          type: "info",
          message: "Your email is not verified. An OTP has been sent to your email for verification.",
        });

        setTimeout(() => {
          navigate("/auth/OTP-verification", {
            state: { email, verificationToken, context: "verify-email" },
          });
        }, 2000);
        return;
      }

      // Handle 2FA not activated
      if (status === 202 && error === "2FA not activated") {
        console.log("2FA not activated. Redirecting to 2fa activation context.");
        setModalData({
          isOpen: true,
          type: "info",
          message: "2FA is required. An OTP has been sent to your email. Please verify to activate 2FA.",
        });

        setTimeout(() => {
          navigate("/auth/OTP-verification", {
            state: { email, verificationToken, context: "2fa" },
          });
        }, 2000);
        return;
      }

      // Handle normal forgot password flow
      console.log("Normal forgot password flow. Redirecting to reset-password context.");
      setModalData({
        isOpen: true,
        type: "success",
        message: "An OTP has been sent to reset your password. Please check your email.",
      });

      setTimeout(() => {
        navigate("/auth/OTP-verification", {
          state: { email, verificationToken, context: "reset-password" },
        });
      }, 2000);
    } catch (err) {
      console.error("Forgot Password Error:", err);

      if (err.response) {
        const { status, data } = err.response;
        console.log("Forgot Password API Error Response:", { status, data });

        // Handle specific error scenarios
        if (status === 404) {
          setModalData({
            isOpen: true,
            type: "error",
            message: "Email not found. Please try again.",
          });
        } else {
          setModalData({
            isOpen: true,
            type: "error",
            message: data?.message || "Something went wrong. Please try again.",
          });
        }
      } else {
        console.error("Network error:", err.message);
        setModalData({
          isOpen: true,
          type: "error",
          message: "Network error. Please check your connection.",
        });
      }
    } finally {
      setLoading(false);
      console.log("Forgot Password request completed.");
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
        <div className="flex flex-col items-center">
          <FaLock className="text-6xl text-blue-500 mb-4" />
          <Typography variant="h4" className="text-center font-bold text-gray-900 mb-6">
            Forgot Password
          </Typography>
          <Typography className="text-center text-gray-500 mb-6">
            Enter your email to reset your password.
          </Typography>
        </div>
        <form onSubmit={handleSubmit} noValidate>
          <div className="relative mb-6">
            <FaEnvelope className="absolute top-4 left-4 text-gray-500" />
            <input
              type="email"
              value={email}
              placeholder="Email"
              onChange={handleInputChange}
              className="pl-12 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-0 text-sm py-3"
            />
          </div>
          <Button
            type="submit"
            className={`bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-full w-full flex items-center justify-center ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading && (
              <svg
                className="animate-spin h-5 w-5 mr-2 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                ></path>
              </svg>
            )}
            {loading ? "Sending..." : "Reset Password"}
          </Button>
        </form>
        <Typography className="text-center text-gray-500 mt-6">
          Remember your password?{" "}
          <Link to="/auth/sign-in" className="text-blue-500 font-bold">
            Sign In
          </Link>
        </Typography>
      </Card>
    </section>
  );
}

export default ForgotPassword;
