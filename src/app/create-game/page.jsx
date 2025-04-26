"use client";

import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";

const CreateGamePage = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [gameCode, setGameCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCreateGame = async () => {
    if (!user) {
      router.push("/login");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/game/create.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ playerId: user.userId }),
      });

      const data = await response.json();

      if (data.success) {
        setGameCode(data.gameCode);
      } else {
        setError(data.message || "თამაშის შექმნა ვერ მოხერხდა.");
      }
    } catch (err) {
      setError("სერვერთან კავშირის შეცდომა.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <h1 className="text-3xl font-bold mb-6">ახალი თამაშის შექმნა</h1>
      {!gameCode ? (
        <button
          onClick={handleCreateGame}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-md"
        >
          {loading ? "იტვირთება..." : "შექმენი თამაში"}
        </button>
      ) : (
        <div className="flex flex-col items-center gap-4">
          <p className="text-lg font-semibold">თამაშის კოდი:</p>
          <p className="text-2xl font-bold text-green-600">{gameCode}</p>
          <p className="text-sm text-gray-600">გაუზიარე მეორე მოთამაშეს!</p>
        </div>
      )}
      {error && <p className="mt-4 text-red-600">{error}</p>}
    </div>
  );
};

export default CreateGamePage;
