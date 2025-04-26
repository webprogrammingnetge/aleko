"use client";

import React from "react";

const ReadyButton = ({ isReady, onReadyClick, disabled }) => {
  return (
    <div className="flex justify-center mt-6">
      <button
        onClick={onReadyClick}
        disabled={isReady || disabled}
        className={`py-3 px-6 rounded-md font-semibold text-white transition-all ${
          isReady
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-purple-600 hover:bg-purple-700"
        }`}
      >
        {isReady ? "მოლოდინში..." : "მზად ვარ"}
      </button>
    </div>
  );
};

export default ReadyButton;
