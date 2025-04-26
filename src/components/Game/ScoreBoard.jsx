"use client";

import React from "react";

const ScoreBoard = ({ players, currentPlayerId, userId }) => {
  if (!players) return null;

  return (
    <div className="flex justify-center items-center gap-8 p-4 border rounded-md mb-6 bg-white shadow">
      {Object.values(players).map((player) => (
        <div
          key={player.id}
          className={`flex flex-col items-center ${
            player.id === currentPlayerId ? "text-green-600 font-bold" : ""
          }`}
        >
          <p className="text-lg">{player.id === userId ? "თქვენი ქულა" : "მოწინააღმდეგის ქულა"}</p>
          <p className="text-2xl">{player.score}</p>
        </div>
      ))}
    </div>
  );
};

export default ScoreBoard;
