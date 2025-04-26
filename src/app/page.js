"use client";

import React from "react";
import { useAuth } from "../hooks/useAuth";
import { useRouter } from "next/navigation";

const HomePage = () => {
  const { user } = useAuth();
  const router = useRouter();

  const handleGoLogin = () => {
    router.push("/login");
  };

  const handleGoRegister = () => {
    router.push("/register");
  };

  const handleCreateGame = () => {
    router.push("/create-game");
  };

  const handleJoinGame = () => {
    router.push("/join-game");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-6 p-6">
      <h1 className="text-3xl font-bold">⚡ ბურთების თამაში ⚡</h1>

      {!user ? (
        <div className="flex flex-col gap-4">
          <button
            onClick={handleGoLogin}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-md"
          >
            შესვლა
          </button>
          <button
            onClick={handleGoRegister}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-md"
          >
            რეგისტრაცია
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <button
            onClick={handleCreateGame}
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-md"
          >
            ახალი თამაშის შექმნა
          </button>
          <button
            onClick={handleJoinGame}
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-6 rounded-md"
          >
            თამაშში შესვლა
          </button>
        </div>
      )}
    </div>
  );
};

export default HomePage;
