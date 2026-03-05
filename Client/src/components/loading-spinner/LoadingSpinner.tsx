"use client";

import React from "react";

const LoadingSpinner = ({
  size = "w-10 h-10",
  color = "border-brand",
  fullScreen = false,
  background = "bg-bg-base",
}) => {
  return (
    <div
      className={`${fullScreen
          ? `flex items-center justify-center h-screen ${background}`
          : "flex items-center justify-center"
        }`}
    >
      <div
        className={`${size} border-4 ${color} border-t-transparent rounded-full animate-spin shadow-card`}
      />
    </div>
  );
};

export default LoadingSpinner;