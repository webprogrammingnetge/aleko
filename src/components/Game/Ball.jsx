"use client";

import React from "react";

const Ball = ({ number, selectedBy, onSelect, disabled }) => {
  const isSelected = selectedBy !== null;

  return (
    <button
      onClick={onSelect}
      disabled={isSelected || disabled}
      className={`w-16 h-16 rounded-full flex items-center justify-center text-lg font-bold
        ${isSelected ? "bg-gray-400 text-white" : "bg-blue-600 hover:bg-blue-700 text-white"}
        transition-all duration-300 ease-in-out shadow-md hover:shadow-lg`}
    >
      {isSelected ? number : "?"}
    </button>
  );
};

export default Ball;
