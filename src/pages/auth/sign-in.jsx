import React, { useState } from "react";
import { Input, Button, Typography, Card } from "@material-tailwind/react";
import { Link, useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaGoogle, FaEye, FaEyeSlash } from "react-icons/fa";
import CustomModal from "@/components/CustomModal";
import axios from "axios";

export function SignIn() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [modalData, setModalData] = useState({ isOpen: false, type: "", message: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    if (!email || !password) {
      return setModalData({
        isOpen: true,
        type: "error",
        message: "Please fill out all fields.",
      });
    }

    try {
      setLoading(true);
      const response = await axios.post("http://localhost:8080/api/auth/login", formData);

      if (response?.status === 202) {
        setModalData({
          isOpen: true,
          type: "info",
          message: "An OTP has been sent to your email. Please verify to continue.",
        });
        setTimeout(() => {
          navigate("/auth/OTP-verification", { state: { email, context: "2fa" } });
        }, 2000);
        return;
      }

      const { token, user } = response.data;
      localStorage.setItem("authToken", token);
      localStorage.setItem("role", user.role);

      setModalData({
        isOpen: true,
        type: "success",
        message: `Welcome back, ${user.nom}!`,
      });

      setTimeout(() => {
        if (user.role.toLowerCase() === "client") {
          navigate("/client/scan-me");
        } else {
          navigate("/dashboard/home");
        }
      }, 2000);
    } catch (err) {
      const errorMessage = err.response?.data?.error;

      if (err.response?.status === 403 && errorMessage?.includes("Email is not verified")) {
        // Handle unverified email
        try {
          await axios.post("http://localhost:8080/api/auth/resend-otp", null, {
            params: { email, context: "verify-email" },
          });

          setModalData({
            isOpen: true,
            type: "info",
            message: "Your email is not verified. An OTP has been sent to your email.",
          });

          setTimeout(() => {
            navigate("/auth/OTP-verification", { state: { email, context: "verify-email" } });
          }, 3000);
        } catch (otpError) {
          setModalData({
            isOpen: true,
            type: "error",
            message: "Failed to send OTP. Please try again.",
          });
        }
      } else if (err.response?.status === 401) {
        // Handle invalid credentials
        setModalData({
          isOpen: true,
          type: "error",
          message: "Invalid email or password. Please try again.",
        });
      } else {
        // Handle other errors
        setModalData({
          isOpen: true,
          type: "error",
          message: "An unexpected error occurred. Please try again later.",
        });
      }
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
      <Card className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <div className="flex justify-center mb-6">
          <img src="/img/Logo.png" alt="App Logo" className="w-28 h-auto" />
        </div>

        <Typography variant="h4" className="font-bold text-gray-900 text-center mb-4">
          Welcome Back!
        </Typography>
        <Typography className="text-gray-500 text-center text-sm mb-8">
          Access your account to upload your ID
        </Typography>

        <form onSubmit={handleSignIn}>
          <div className="mb-6">
            <Typography variant="small" color="blue-gray" className="font-medium">
              Your Email
            </Typography>
            <div className="relative">
              <FaEnvelope className="absolute top-3 left-3 text-gray-500" />
              <Input
                size="lg"
                placeholder="name@mail.com"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="pl-10"
                disabled={loading}
              />
            </div>
          </div>

          <div className="mb-6">
            <Typography variant="small" color="blue-gray" className="font-medium">
              Password
            </Typography>
            <div className="relative">
              <FaLock className="absolute top-3 left-3 text-gray-500" />
              <Input
                type={showPassword ? "text" : "password"}
                size="lg"
                placeholder="********"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="pl-10"
                disabled={loading}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute top-3 right-3 text-gray-500"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div className="text-right mb-6">
            <Link
              to="/auth/forgot-password"
              className="text-blue-900 hover:underline font-bold text-sm"
            >
              Forgot Password?
            </Link>
          </div>

          <Button
            className={`mt-4 bg-gray-900 text-white ${loading ? "opacity-50" : ""}`}
            fullWidth
            type="submit"
            disabled={loading}
          >
            {loading ? "Signing In..." : "Sign In"}
          </Button>

          <div className="flex items-center my-6">
            <hr className="flex-grow border-gray-300" />
            <span className="mx-4 text-gray-500">Or</span>
            <hr className="flex-grow border-gray-300" />
          </div>

          <Button
            color="blue-gray"
            className="flex items-center justify-center gap-2"
            fullWidth
            disabled={loading}
          >
            <FaGoogle /> Sign In with Google
          </Button>

          <div className="text-center mt-6">
            <Typography className="text-blue-gray-500 font-medium">
              Don’t have an account?{" "}
              <Link to="/auth/sign-up" className="text-blue-900 hover:underline">
                Sign Up
              </Link>
            </Typography>
          </div>
        </form>
      </Card>
    </section>
  );
}

export default SignIn;
