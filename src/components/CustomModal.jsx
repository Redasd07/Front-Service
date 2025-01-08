import React, { useState } from "react";
import PropTypes from "prop-types";

const CustomModal = ({ isOpen = false, type = "error", message = "", onClose }) => {
  if (!isOpen) return null;

  const modalStyles = {
    success: {
      bg: "bg-green-500",
      icon: (
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path>
        </svg>
      ),
    },
    error: {
      bg: "bg-red-500",
      icon: (
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      ),
    },
    info: {
      bg: "bg-blue-500",
      icon: (
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m2-4h.01"></path>
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
        </svg>
      ),
    },
  };

  // Ensure a fallback for invalid or missing type
  const { bg, icon } = modalStyles[type] || modalStyles["error"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 animate-fadeIn">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
        <div className={`rounded-full w-12 h-12 flex items-center justify-center mx-auto ${bg}`}>
          {icon}
        </div>
        <div className="mt-4 text-center">
          <h2 className="text-lg font-semibold text-gray-800">
            {type === "success" ? "Success" : type === "info" ? "Information" : "Error"}
          </h2>
          <p className="text-gray-600 mt-2">{message || "An unknown error occurred."}</p>
        </div>
        <div className="mt-6 flex justify-center">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

CustomModal.propTypes = {
  isOpen: PropTypes.bool,
  type: PropTypes.oneOf(["success", "error", "info"]),
  message: PropTypes.string,
  onClose: PropTypes.func.isRequired,
};

CustomModal.defaultProps = {
  type: "error", // Default to "error" if type is not provided
};

export default CustomModal;
