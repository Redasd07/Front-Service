import React, { useState, useEffect } from "react";
import { Input, Button, Typography, Card } from "@material-tailwind/react";
import { Link, useNavigate } from "react-router-dom";
import { FaEnvelope, FaUser, FaLock, FaPhone, FaEye, FaEyeSlash, FaSpinner } from "react-icons/fa";
import CustomModal from "@/components/CustomModal";
import { register } from "@/services/api";

export function SignUp() {
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [modalData, setModalData] = useState({ isOpen: false, type: "error", message: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const images = ["/img/1.jpg", "/img/2.jpg", "/img/3.jpg"];
  const [currentImage, setCurrentImage] = useState(0);

  // Image slider
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [images.length]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validatePassword = (password) => {
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { nom, prenom, email, phone, password, confirmPassword } = formData;

    // Validate required fields
    if (!nom || !prenom || !email || !phone || !password || !confirmPassword) {
      return setModalData({
        isOpen: true,
        type: "error",
        message: "All fields are required. Please fill them in correctly.",
      });
    }

    // Email validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|ma)$/;
    if (!emailRegex.test(email)) {
      return setModalData({
        isOpen: true,
        type: "error",
        message: "Invalid email address. Use a valid email (e.g., example@gmail.com).",
      });
    }

    // Phone number validation
    const phoneRegex = /^(06|05|07)\d{8}$/;
    if (!phoneRegex.test(phone)) {
      return setModalData({
        isOpen: true,
        type: "error",
        message: "Phone number must start with 06, 05, or 07 and contain 10 digits.",
      });
    }

    // Password validation
    if (!validatePassword(password)) {
      return setModalData({
        isOpen: true,
        type: "error",
        message: "Password must have at least 8 characters, 1 uppercase letter, 1 number, and 1 special character.",
      });
    }

    // Confirm password validation
    if (password !== confirmPassword) {
      return setModalData({
        isOpen: true,
        type: "error",
        message: "Passwords do not match. Please verify them.",
      });
    }

    try {
      setLoading(true);

      // API call to register the user
      const response = await register({
        firstName: prenom,
        lastName: nom,
        email,
        phone,
        password,
        confirmPassword,
      });

      setModalData({
        isOpen: true,
        type: "success",
        message: response.message || "Registration successful! Please check your email to verify your account.",
      });

      // Redirect to OTP verification after 2 seconds
      setTimeout(() => {
        navigate("/auth/OTP-verification", {
          state: {
            email: formData.email,
            verificationToken: response.verificationToken,
            context: "verify-email",
          },
        });
      }, 2000);
    } catch (err) {
      const errorMsg = err.response?.data?.error || "An error occurred. Please try again.";
      setModalData({
        isOpen: true,
        type: "error",
        message: errorMsg,
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
      <Card className="w-full max-w-6xl flex flex-row bg-white rounded-2xl shadow-lg overflow-hidden border border-darkblue">
        <div className="w-1/2 bg-black text-white flex flex-col justify-between p-10 rounded-l-2xl">
          <Typography className="text-2xl font-bold mb-6 text-center">
            Scan your data securely and seamlessly with ScanMe
          </Typography>
          <img
            src={images[currentImage]}
            alt="Slideshow"
            className="w-full h-full object-cover rounded-xl"
          />
        </div>
        <div className="w-1/2 bg-white p-10 rounded-r-2xl">
          <div className="flex justify-center mb-6">
            <img src="/img/Logo.png" alt="App Logo" className="w-24 h-auto" />
          </div>
          <Typography variant="h3" className="font-bold text-gray-900 mb-4 text-center">
            Join the Platform
          </Typography>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-8" noValidate>
            <div className="relative">
              <FaUser className="absolute top-4 left-4 text-gray-500" />
              <Input
                size="lg"
                placeholder="First Name"
                name="prenom"
                value={formData.prenom}
                onChange={handleChange}
                className="pl-12"
              />
            </div>
            <div className="relative">
              <FaUser className="absolute top-4 left-4 text-gray-500" />
              <Input
                size="lg"
                placeholder="Last Name"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                className="pl-12"
              />
            </div>
            <div className="relative">
              <FaEnvelope className="absolute top-4 left-4 text-gray-500" />
              <Input
                size="lg"
                placeholder="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="pl-12"
              />
            </div>
            <div className="relative">
              <FaPhone className="absolute top-4 left-4 text-gray-500" />
              <Input
                size="lg"
                placeholder="Phone Number"
                type="tel"
                name="phone"
                maxLength={10}
                value={formData.phone}
                onChange={handleChange}
                className="pl-12"
              />
            </div>
            <div className="relative">
              <FaLock className="absolute top-4 left-4 text-gray-500" />
              <Input
                type={showPassword ? "text" : "password"}
                size="lg"
                placeholder="Password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="pl-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-4 right-4 text-gray-500"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <div className="relative">
              <FaLock className="absolute top-4 left-4 text-gray-500" />
              <Input
                type={showConfirmPassword ? "text" : "password"}
                size="lg"
                placeholder="Confirm Password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="pl-12"
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
              disabled={loading}
              className="col-span-2 mt-6 bg-black hover:bg-blue-900 text-white font-bold py-3 px-6 rounded-full w-full"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <FaSpinner className="animate-spin" /> Registering...
                </div>
              ) : (
                "Register Now"
              )}
            </Button>
          </form>
          <Typography
            variant="paragraph"
            className="text-center text-gray-500 font-medium mt-4"
          >
            Already have an account?{" "}
            <Link to="/auth/sign-in" className="text-blue-900 font-bold">
              Sign In
            </Link>
          </Typography>
        </div>
      </Card>
    </section>
  );
}

export default SignUp;
