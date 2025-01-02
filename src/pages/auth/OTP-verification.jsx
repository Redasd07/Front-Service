import React, { useState } from "react";
import { Button, Typography, Card } from "@material-tailwind/react";
import { useLocation, useNavigate } from "react-router-dom";
import { verifyOtp, resendOtp } from "@/services/api";
import CustomModal from "@/components/CustomModal";
import { FaEnvelope } from "react-icons/fa";

export function OTPVerification() {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [modalData, setModalData] = useState({ isOpen: false, type: "", message: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Determine the context (email verification or 2FA)
  const context = location.state?.context || "verify-email"; // Default to verify email
  const email = location.state?.email;

  const handleChange = (index, value) => {
    if (/^\d?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Automatically move to the next input
      if (value && index < otp.length - 1) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && otp[index] === "") {
      const previousInput = document.getElementById(`otp-${index - 1}`);
      if (previousInput) previousInput.focus();
    }
  };

  const handleVerify = async () => {
    try {
      setLoading(true);
      setModalData({ isOpen: false });
      const otpCode = otp.join(""); // Combine OTP digits into a string

      if (context === "verify-email") {
        await verifyOtp(email, otpCode, "verify-email");
        setModalData({
          isOpen: true,
          type: "success",
          message: "Your email has been successfully verified!",
        });
        setTimeout(() => navigate("/auth/sign-in"), 2000);
      } else {
        const response = await verifyOtp(email, otpCode, "2fa");
        const { role } = response.data.user; // Extract the user's role from the response

        setModalData({
          isOpen: true,
          type: "success",
          message: "OTP verified successfully! Redirecting...",
        });

        setTimeout(() => {
          if (role.toLowerCase() === "client") {
            navigate("/client/scan-me");
          } else {
            navigate("/dashboard/home");
          }
        }, 2000);
      }
    } catch (err) {
      setModalData({
        isOpen: true,
        type: "error",
        message: err.response?.data || "Invalid OTP. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      setLoading(true);
      setModalData({ isOpen: false });
      await resendOtp(email, context);
      setModalData({
        isOpen: true,
        type: "success",
        message: "A new OTP has been sent to your email.",
      });
    } catch (err) {
      setModalData({
        isOpen: true,
        type: "error",
        message: err.response?.data || "Failed to resend OTP. Please try again.",
      });
    } finally {
      setLoading(false);
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
          <FaEnvelope className="text-6xl text-red-500 mb-4 animate-pulse" />
          <Typography variant="h4" className="text-center font-bold text-gray-900 mb-2">
            {context === "verify-email"
              ? "Verify Your Email Address"
              : "Enter Your OTP Code"}
          </Typography>
          <Typography className="text-center text-gray-500 mb-6">
            {context === "verify-email"
              ? "Enter the 4-digit code sent to your email to verify your account."
              : "Enter the 4-digit code sent to your email to complete 2FA."}
          </Typography>
        </div>
        <form className="flex justify-center gap-4 mb-6">
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              type="text"
              value={digit}
              maxLength={1}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="text-center text-lg font-bold w-12 h-12 border border-red-500 rounded-lg focus:ring-2 focus:ring-red-500 transition-transform transform hover:scale-105"
            />
          ))}
        </form>
        <Button
          onClick={handleVerify}
          className={`bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-full w-full mb-2 ${
            otp.includes("") || loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={otp.includes("") || loading}
        >
          {loading ? "Verifying..." : "Verify"}
        </Button>
        <Typography className="text-center font-bold text-gray-500 ml-1">
          You didn't receive any code?{" "}
          <button
            type="button"
            onClick={handleResend}
            className="text-blue-600 font-bold"
            disabled={loading}
          >
            {loading ? "Sending..." : "Resend Code"}
          </button>
        </Typography>
      </Card>
    </section>
  );
}

export default OTPVerification;
