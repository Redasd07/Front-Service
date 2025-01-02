import React from "react";
import { Input, Button, Typography, Card } from "@material-tailwind/react";
import { Link } from "react-router-dom";
import { FaEnvelope } from "react-icons/fa";

export function ForgotPassword() {
  return (
    <section className="h-screen flex items-center justify-center bg-gray-50">
      <Card className="p-10 w-full max-w-md rounded-lg shadow-lg">
        <Typography variant="h4" className="text-center font-bold text-gray-900 mb-6">
          Forgot Password
        </Typography>
        <Typography className="text-center text-gray-500 mb-6">
          Enter your email to reset your password.
        </Typography>
        <form>
          <div className="relative mb-6">
            <FaEnvelope className="absolute top-4 left-4 text-gray-500" />
            <Input
              type="email"
              size="lg"
              placeholder="Email"
              className="pl-12 w-full rounded-lg border border-gray-300 focus:border-darkblue"
            />
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

export default ForgotPassword;
