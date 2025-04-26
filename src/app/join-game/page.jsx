"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "../../../context/AuthContext";

const GameRoomPage = () => {
  const { gameCode } = useParams();
  const { user } = useAuth();
  const router = useRouter();

  const [gameData, setGameData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    const fetchGame = async () => {
      try {
        const response = await fetch(`/api/game/get.php?gameCode=${gameCode}`);
        const data = await response.json();

        if (data.success) {
          setGameData(data.game);
        } else {
          setError(data.message || "თამაში ვერ მოიძებნა.");
        }
      } catch (err) {
        setError("სერვერთან კავშირის პრობლემა.");
      } finally {
        setLoading(false);
      }
    };

    fetchGame();
  }, [user, gameCode, router]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">იტვირთება...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-600">{error}</div>;
  }

  return (
    <div className="p-6 flex flex-col gap-4">
      <h1 className="text-2xl font-bold text-center">თამაშის ოთახი: {gameCode}</h1>

      {/* აქ დავამატებთ თამაშის მართვას */}
      <div className="flex justify-center">
        <p>მოთამაშე 1: {gameData.player1_id || "..."}</p>
        <span className="mx-4">|</span>
        <p>მოთამაშე 2: {gameData.player2_id || "..."}</p>
      </div>

      {/* თამაშის ინფორმაცია, ბურთების სია, ქულები და მოქმედებები დაემატება აქ */}
    </div>
  );
};

export default GameRoomPage;
