"use client";

import React, { useState } from "react";

const Ball = ({ number, selectedBy, onSelect, disabled, isActive }) => {
  const [clicked, setClicked] = useState(false);

  const handleClick = () => {
    if (!disabled && !clicked) {
      setClicked(true);
      onSelect();
      setTimeout(() => setClicked(false), 300);
    }
  };

  const isSelected = selectedBy !== null;

  return (
    <button
      onClick={handleClick}
      disabled={isSelected || disabled}
      className={`w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold
        transition-transform duration-300 ease-in-out
        ${clicked ? "scale-110 rotate-6" : ""}
        ${isSelected ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"}
        text-white
        ${isActive && !isSelected ? "animate-pulse border-4 border-yellow-400" : ""}
      `}
    >
      {isSelected ? number : "?"}
    </button>
  );
};

export default Ball;
