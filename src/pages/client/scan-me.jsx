import React from "react";
import { Typography, Button } from "@material-tailwind/react";

function ScanMe() {
  return (
    <section className="h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="max-w-3xl text-center">
        <Typography variant="h2" className="font-bold text-gray-900 mb-6">
          Welcome to ScanMe!
        </Typography>
        <Typography className="text-gray-600 text-lg mb-8">
          Scan your data securely and effortlessly using our platform. Simply upload your ID or document, and we will process it for you.
        </Typography>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-lg">
          Start Scanning
        </Button>
      </div>
    </section>
  );
}

export default ScanMe;
