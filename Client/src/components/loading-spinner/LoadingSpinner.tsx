"use client";

import React from "react";

const LoadingSpinner = ({
  size = "w-10 h-10",
  color = "border-[#1B2A49]", // Deep navy spinner
  fullScreen = false,
  background = "bg-[#F4F7FA]", // Main background
}) => {
  return (
    <div
      className={`${
        fullScreen
          ? `flex items-center justify-center h-screen ${background}`
          : "flex items-center justify-center"
      }`}
    >
      <div
        className={`${size} border-4 ${color} border-t-transparent rounded-full animate-spin shadow-md`}
      ></div>
    </div>
  );
};

export default LoadingSpinner;
