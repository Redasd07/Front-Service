import React, { useState } from "react";
import { Button, Typography, Card } from "@material-tailwind/react";
import { useLocation, useNavigate } from "react-router-dom";
import { verifyEmail, verifyOtp, resendOtp } from "@/services/api";
import CustomModal from "@/components/CustomModal";
import { FaEnvelope, FaKey, FaLock } from "react-icons/fa";

export function OTPVerification() {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [modalData, setModalData] = useState({ isOpen: false, type: "error", message: "" });
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(300); // Expiration de l'OTP (5 minutes)
  const [resendCountdown, setResendCountdown] = useState(30); // Délai pour réactiver le bouton resend
  const navigate = useNavigate();
  const location = useLocation();

  // Extract email, context, and verificationToken from location state
  const email = location.state?.email || "";
  const context = location.state?.context || "verify-email";
  const verificationToken = location.state?.verificationToken || "";

  // Define context-specific data
  const contextData = {
    "verify-email": {
      title: "Verify Your Email Address",
      description: "Enter the 4-digit code sent to your email to verify your account.",
      icon: <FaEnvelope className="text-6xl text-blue-500 mb-4 animate-pulse" />,
      apiFunction: verifyEmail,
      onSuccessMessage: "Your email has been successfully verified!",
      onSuccessRedirect: "/auth/sign-in",
    },
    "2fa": {
      title: "Enter Your OTP Code",
      description: "Enter the 4-digit code sent to your email to complete 2FA.",
      icon: <FaKey className="text-6xl text-green-500 mb-4 animate-pulse" />,
      apiFunction: verifyOtp,
      onSuccessMessage: "2FA completed successfully! Redirecting...",
      onSuccessRedirect: (role) => (role === "client" ? "/client/client/scan-me" : "/dashboard/home"),
    },
    "verify-reset-otp": {
      title: "Verify Your Reset Code",
      description: "Enter the 4-digit code sent to your email to reset your password.",
      icon: <FaLock className="text-6xl text-red-500 mb-4 animate-pulse" />,
      apiFunction: verifyOtp,
      onSuccessMessage: "OTP verified successfully! Proceeding to reset password...",
      onSuccessRedirect: "/auth/reset-password",
    },
  };

  // Handle OTP input
  const handleChange = (index, value) => {
    if (/^\d?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < otp.length - 1) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  // Handle backspace navigation
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && otp[index] === "") {
      const previousInput = document.getElementById(`otp-${index - 1}`);
      if (previousInput) previousInput.focus();
    }
  };

  // Handle OTP verification
  const handleVerify = async () => {
    try {
      setLoading(true);
      setModalData({ isOpen: false });

      const otpCode = otp.join("");
      if (otpCode.length < 4) {
        throw new Error("Please fill in all OTP fields.");
      }

      const { apiFunction, onSuccessMessage, onSuccessRedirect } = contextData[context];

      // Call the appropriate API function
      await apiFunction(verificationToken, otpCode);

      setModalData({
        isOpen: true,
        type: "success",
        message: onSuccessMessage,
      });

      // Redirect based on context
      setTimeout(() => {
        if (typeof onSuccessRedirect === "function") {
          navigate(onSuccessRedirect(location.state?.role || "client"));
        } else {
          navigate(onSuccessRedirect);
        }
      }, 2000);
    } catch (err) {
      setModalData({
        isOpen: true,
        type: "error",
        message: err.response?.data?.error || "Invalid OTP. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    console.log("Resend OTP - Function Started");
  
    try {
      setLoading(true);
      setModalData({ isOpen: false });
  
      console.log("Resend OTP - Context Received:", context);
      console.log("Resend OTP - Verification Token Received:", verificationToken);
  
      // Mapping des contextes attendus par le backend
      const contextMapping = {
        "verify-email": "EMAIL_VERIFICATION",
        "reset-password": "RESET_PASSWORD",
        "2fa": "2FA",
      };
  
      // Récupérez le contexte formaté
      const formattedContext = contextMapping[context];
      console.log("Resend OTP - Mapped Context:", formattedContext);
  
      // Vérifiez si le contexte est valide
      if (!formattedContext) {
        console.error("Resend OTP - Invalid Context:", context);
        setModalData({
          isOpen: true,
          type: "error",
          message: `Invalid context: ${context}. Please try again.`,
        });
        return;
      }
  
      console.log("Resend OTP - Calling API with Context:", formattedContext);
  
      // Appel à l'API
      const response = await resendOtp(verificationToken, formattedContext);
  
      console.log("Resend OTP - API Response:", response);
  
      setModalData({
        isOpen: true,
        type: "success",
        message: "A new OTP has been sent to your email.",
      });
  
      console.log("Resend OTP - Success: New OTP sent.");
      setCountdown(300); // Réinitialisation du compteur à 5 minutes
      setResendCountdown(30); // Réinitialisation du délai pour cliquer à nouveau
    } catch (err) {
      console.error("Resend OTP - Error:", err);
  
      if (err.response) {
        console.error("Resend OTP - Error Response Data:", err.response.data);
        console.error("Resend OTP - Error Response Status:", err.response.status);
      } else if (err.request) {
        console.error("Resend OTP - No Response from Server:", err.request);
      } else {
        console.error("Resend OTP - Unexpected Error:", err.message);
      }
  
      setModalData({
        isOpen: true,
        type: "error",
        message: err.response?.data?.error || "Failed to resend OTP. Please try again.",
      });
    } finally {
      setLoading(false);
      console.log("Resend OTP - Function Ended");
    }
  };
  
  
  
  // Countdown timer
  React.useEffect(() => {
    if (countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [countdown]);

  // Resend button countdown timer
  React.useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setInterval(() => {
        setResendCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [resendCountdown]);

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
          {contextData[context]?.icon}
          <Typography variant="h4" className="text-center font-bold text-gray-900 mb-2">
            {contextData[context]?.title || "Verify Your OTP"}
          </Typography>
          <Typography className="text-center text-gray-500 mb-6">
            {contextData[context]?.description || "Enter the OTP code sent to your email."}
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
              className="text-center text-lg font-bold w-12 h-12 border border-blue-500 rounded-lg focus:ring-2 focus:ring-blue-500 transition-transform transform hover:scale-105"
            />
          ))}
        </form>
        <Button
          onClick={handleVerify}
          className={`bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-full w-full mb-2 ${
            otp.includes("") || loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={otp.includes("") || loading}
        >
          {loading ? "Verifying..." : "Verify"}
        </Button>
        <Typography className="text-center text-gray-500 mt-2">
          Code expires in:{" "}
          <span className="font-bold">
            {Math.floor(countdown / 60)}:{String(countdown % 60).padStart(2, "0")}
          </span>
        </Typography>
        <Typography className="text-center font-bold text-gray-500 mt-4">
          Didn't receive any code?{" "}
          <button
            type="button"
            onClick={handleResend}
            className="text-blue-600 font-bold"
            disabled={resendCountdown > 0 || loading}
          >
            {resendCountdown > 0 ? `Retry in ${resendCountdown}s` : "Resend Code"}
          </button>
        </Typography>
      </Card>
    </section>
  );
}

export default OTPVerification;
