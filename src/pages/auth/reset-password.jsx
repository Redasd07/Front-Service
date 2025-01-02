import React, { useState } from "react";
import { Input, Button, Typography, Card } from "@material-tailwind/react";
import { Link } from "react-router-dom";
import { FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

export function ResetPassword() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <section className="h-screen flex items-center justify-center bg-gray-50">
      <Card className="p-10 w-full max-w-md rounded-lg shadow-lg">
        <Typography variant="h4" className="text-center font-bold text-gray-900 mb-6">
          Reset Password
        </Typography>
        <Typography className="text-center text-gray-500 mb-6">
          Enter your new password below.
        </Typography>
        <form>
          <div className="relative mb-6">
            <FaLock className="absolute top-4 left-4 text-gray-500" />
            <Input
              type={showPassword ? "text" : "password"}
              size="lg"
              placeholder="New Password"
              className="pl-12 w-full rounded-lg border border-gray-300 focus:border-darkblue"
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
              className="pl-12 w-full rounded-lg border border-gray-300 focus:border-darkblue"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute top-4 right-4 text-gray-500"
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          <Button className="bg-black hover:bg-blue-900 text-white font-bold py-3 px-6 rounded-full w-full">
            Reset Password
          </Button>
        </form>
        <Typography
          variant="paragraph"
          className="text-center text-gray-500 font-medium mt-6"
        >
          Remember your password?{" "}
          <Link to="/auth/sign-in" className="text-blue-900 font-bold">
            Sign In
          </Link>
        </Typography>
      </Card>
    </section>
  );
}

export default ResetPassword;
