"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "../../../hooks/useAuth";
import { useGame } from "../../../hooks/useGame";
import { apiGet, apiPost } from "../../../services/api";

import Ball from "../../../components/Game/Ball";
import ScoreBoard from "../../../components/Game/ScoreBoard";
import ReadyButton from "../../../components/Game/ReadyButton";
import WinnerScreen from "../../../components/Game/WinnerScreen";

const GameRoomPage = () => {
  const { gameCode } = useParams();
  const { user } = useAuth();
  const { gameState, updateGameState } = useGame();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pollingInterval, setPollingInterval] = useState(null);

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    fetchGame();

    const interval = setInterval(() => {
      fetchGame();
    }, 3000);

    setPollingInterval(interval);

    return () => clearInterval(interval);
  }, [user, gameCode, router]);

  useEffect(() => {
    if (gameState?.status === "finished" && pollingInterval) {
      clearInterval(pollingInterval);
      console.log("პოლინგი გაჩერებულია — თამაში დასრულდა.");
    }
  }, [gameState, pollingInterval]);

  const fetchGame = async () => {
    try {
      const data = await apiGet(`/api/game/get.php?gameCode=${gameCode}`);
      if (data.success) {
        updateGameState(JSON.parse(data.game.state));
      } else {
        setError(data.message || "თამაში ვერ მოიძებნა.");
      }
    } catch (err) {
      setError("სერვერთან კავშირის პრობლემა.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectBall = async (number) => {
    if (!gameState || gameState.status !== "playing") return;

    try {
      const data = await apiPost("/api/game/update.php", {
        gameCode,
        playerId: user.userId,
        ballNumber: number,
      });

      if (data.success) {
        updateGameState(data.newState);
      } else {
        alert(data.message || "სვლის შეცდომა");
      }
    } catch (err) {
      alert("სერვერთან კავშირის პრობლემა.");
    }
  };

  const handleReady = async () => {
    try {
      const data = await apiPost("/api/game/ready.php", {
        gameCode,
        playerId: user.userId,
      });

      if (data.success) {
        updateGameState(data.newState);
      } else {
        alert(data.message || "მზადყოფნის შეცდომა");
      }
    } catch (err) {
      alert("სერვერთან კავშირის პრობლემა.");
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">იტვირთება...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-600">{error}</div>;
  }

  if (!gameState) {
    return <div className="flex justify-center items-center h-screen">მონაცემები ვერ ჩაიტვირთა</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center p-6 gap-6">
      <h1 className="text-2xl font-bold">თამაშის ოთახი: {gameCode}</h1>

      <ScoreBoard
        players={gameState.players}
        currentPlayerId={gameState.currentPlayerId}
        userId={user.userId}
      />

      {gameState.status === "waiting" && (
        <ReadyButton
          isReady={gameState.players[user.userId]?.ready}
          onReadyClick={handleReady}
        />
      )}

      {gameState.status === "playing" && (
        <div className="flex flex-wrap gap-4 justify-center">
          {gameState.balls.map((ball) => (
            <Ball
              key={ball.number}
              number={ball.number}
              selectedBy={ball.selectedBy}
              disabled={gameState.currentPlayerId !== user.userId || ball.selectedBy !== null}
              isActive={gameState.currentPlayerId === user.userId}
              onSelect={() => handleSelectBall(ball.number)}
            />
          ))}
        </div>
      )}

      {gameState.status === "finished" && (
        <WinnerScreen players={gameState.players} />
      )}
    </div>
  );
};

export default GameRoomPage;
