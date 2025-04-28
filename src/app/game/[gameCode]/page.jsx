"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "../../../hooks/useAuth";
import { apiGet, apiPost } from "../../../services/api";
import Ball from "../../../components/Game/Ball";
const GameRoomPage = () => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const { gameCode } = useParams();
  const [gameData, setGameData] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (gameData && gameData.parsedState.status === "playing") {
      const allBallsSelected = gameData.parsedState.balls.every((ball) => ball.selectedBy !== null);

      if (allBallsSelected) {
        handleFinishGame();
      }
    }
  }, [gameData]);
  console.log(user)
  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    fetchGame();

    const interval = setInterval(() => {
      fetchGame();
    }, 3000); // ყოველ 3 წამში ვითხოვთ თამაშის მდგომარეობას

    return () => clearInterval(interval);
  }, [user, gameCode]);
  const handleSelectBall = async (number) => {
    try {
      const data = await apiPost("/api/game/update.php", {
        gameCode,
        ballNumber: number,
      });

      if (data.success) {
        fetchGame(); // ახლიდან წამოიღე განახლებული თამაში
      }
    } catch (error) {
      console.error("ბურთის არჩევის შეცდომა:", error);
    }
  };
  const fetchGame = async () => {
    try {
      const data = await apiGet(`/api/game/get.php?gameCode=${gameCode}`);
      if (data.success) {
        setGameData({
          ...data.game,
          parsedState: JSON.parse(data.game.state),
        });
        console.log(data)
      } else {
        if (data.message === "აუცილებელია შესვლა") {
          logout();
          router.push("/login");
        }
      }
    } catch (error) {
      console.error("თამაშის წაკითხვის შეცდომა:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleReady = async () => {
    try {
      const data = await apiPost("/api/game/ready.php", {
        gameCode,
      });
      if (data.success) {
        fetchGame();
      }
    } catch (error) {
      console.error("მზადყოფნის შეცდომა:", error);
    }
  };
  const handleFinishGame = async () => {
    const player1Score = gameData.parsedState.players[gameData.player1_id]?.score || 0;
    const player2Score = gameData.parsedState.players[gameData.player2_id]?.score || 0;

    let winnerId = null;
    if (player1Score > player2Score) {
      winnerId = gameData.player1_id;
    } else if (player2Score > player1Score) {
      winnerId = gameData.player2_id;
    } else {
      winnerId = "draw"; // ფრე
    }

    try {
      await apiPost("/api/game/finish.php", {
        gameCode,
        winnerId,
      });
      fetchGame(); // განვაახლოთ მონაცემები დასრულების შემდეგ
    } catch (error) {
      console.error("თამაშის დასრულების შეცდომა:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-xl font-bold">
        იტვირთება...
      </div>
    );
  }

  if (!gameData) {
    return (
      <div className="flex items-center justify-center min-h-screen text-xl font-bold text-red-600">
        თამაში ვერ მოიძებნა.
      </div>
    );
  }

  const isWaiting = !gameData.player2_id;
  const bothReady = gameData.parsedState?.ready?.[gameData.player1_id]
    && gameData.parsedState?.ready?.[gameData.player2_id];
  const isMyTurn = gameData.parsedState?.currentPlayerId === user.userId;
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 gap-8">
      <h1 className="text-2xl font-bold mb-4">{isMyTurn } - თამაშის კოდი: {gameCode} {bothReady}</h1>

      {!gameData.player2_id ? (
        <div className="text-xl font-semibold text-gray-600">
          🎯 ველოდებით პარტნიორს თამაშის დასაწყებად...
        </div>
      ) : gameData.parsedState.status === "waiting" ? (
        <>
          <h2 className="text-xl font-semibold text-gray-700">
            🎯 დაელოდეთ პარტნიორს ან დაადასტურეთ მზადყოფნა
          </h2>
          {!gameData.parsedState.ready?.[user.userId] && (
            <button
              onClick={handleReady}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-md mt-4"
            >
              მზად ვარ
            </button>
          )}
        </>
      ) : gameData.parsedState.status === "finished" ? (
        <div className="flex flex-col items-center justify-center min-h-screen p-8 gap-8">
          <h1 className="text-3xl font-bold mb-4">თამაში დასრულდა!</h1>
      
          {gameData.parsedState.winner_id === "draw" ? (
            <h2 className="text-2xl font-semibold text-gray-700">🤝 თამაში დასრულდა ფრედ</h2>
          ) : gameData.parsedState.winner_id === user.userId ? (
            <h2 className="text-2xl font-semibold text-green-600">🎉 თქვენ მოიგეთ!</h2>
          ) : (
            <h2 className="text-2xl font-semibold text-red-600">😢 თქვენ დამარცხდით.</h2>
          )}
      
          <button
            onClick={() => router.push("/create-game")}
            className="mt-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-md"
          >
            დაბრუნება მთავარ გვერდზე
          </button>
        </div>
      ) : gameData.parsedState.status === "playing" ? (
        <>
          <h2 className="text-xl font-bold">
            {gameData.parsedState.currentPlayerId}-*{user.userId}*--
            {gameData.parsedState.currentPlayerId === user.userId ? "თქვენი სვლა!" : "მოწინააღმდეგის სვლა..."}
          </h2>

          <div className="grid grid-cols-5 gap-4 mt-8">
            {gameData.parsedState.balls.map((ball, index) => (
              <Ball
                key={index}
                number={ball.number}
                selectedBy={ball.selectedBy}
                onSelect={() => handleSelectBall(ball.number)}
                disabled={!isMyTurn || ball.selectedBy !== null}
              />
            ))}
          </div>

          <div className="flex flex-col mt-8 gap-2">
            <div className="text-lg">
              თქვენი ქულა: {gameData.parsedState.players[user.userId]?.score || 0}
            </div>
            <div className="text-lg">
              მოწინააღმდეგის ქულა: {Object.entries(gameData.parsedState.players)
                .filter(([id]) => Number(id) !== user.userId)
                .map(([_, p]) => p.score)[0] || 0}
            </div>
          </div>
        </>
      ) : (
        <div>იტვირთება...</div>
      )}
    </div>
  );

};

export default GameRoomPage;
