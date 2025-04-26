"use client";

import { createContext, useContext, useState } from "react";

export const GameContext = createContext(); // აქ უნდა იყოს export

export const GameProvider = ({ children }) => {
  const [gameState, setGameState] = useState(null);

  const updateGameState = (newState) => {
    setGameState(newState);
  };

  return (
    <GameContext.Provider value={{ gameState, updateGameState }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGameContext = () => useContext(GameContext);

