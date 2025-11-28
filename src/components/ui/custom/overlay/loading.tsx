import React from "react";

interface LoadingOverlayProps {
  isVisible?: boolean;
  message?: string;

  blur?: boolean;
}
const LoadingOverlay = ({
  isVisible = false,
  message = "Loading...",
  blur = true,
}: LoadingOverlayProps) => {
  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 bg-black opacity-25 flex flex-col items-center justify-center z-100 ${
        blur ? "backdrop-blur-sm" : ""
      }`}
    >
      <LoadingSpinner />
      {message && (
        <p className="text-white mt-4 text-base font-medium text-center px-4">
          {message}
        </p>
      )}
    </div>
  );
};

const LoadingSpinner = () => {
  return (
    <div
      className={`w-10 h-10 border-4 border-gray-200 border-blue-500 border-t-transparent rounded-full animate-spin`}
    />
  );
};

export default LoadingOverlay;
