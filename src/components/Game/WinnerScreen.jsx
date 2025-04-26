"use client";

import React from "react";

const WinnerScreen = ({ players }) => {
  if (!players) return null;

  const playerEntries = Object.values(players);
  if (playerEntries.length < 2) return null;

  const [player1, player2] = playerEntries;

  let winnerText = "";
  if (player1.score > player2.score) {
    winnerText = "მოთამაშე 1 გაიმარჯვა!";
  } else if (player2.score > player1.score) {
    winnerText = "მოთამაშე 2 გაიმარჯვა!";
  } else {
    winnerText = "ფრე!";
  }

  return (
    <div className="flex flex-col items-center justify-center mt-10 p-6 bg-green-100 border border-green-300 rounded-lg shadow-md">
      <h2 className="text-3xl font-bold mb-4 text-green-700">თამაში დასრულებულია</h2>
      <p className="text-2xl font-semibold text-gray-800">{winnerText}</p>
    </div>
  );
};

export default WinnerScreen;
