"use client";

import { useState, useEffect } from "react";
import { apiGet, apiPost } from "../../services/api";
import { useRouter } from "next/navigation";
import { useAuth } from "../../hooks/useAuth";

const CreateGamePage = () => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [gameCode, setGameCode] = useState("");
  const [waitingGames, setWaitingGames] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchWaitingGames();
  
    const interval = setInterval(() => {
      fetchWaitingGames();
    }, 15000); // 15 წამი
  
    return () => clearInterval(interval);
  }, []);

  const fetchWaitingGames = async () => {
    try {
      const data = await apiGet("/api/game/list.php");
      if (data.success) {
        setWaitingGames(data.games);
      }
    } catch (error) {
      console.error("თამაშების სიის წაკითხვის შეცდომა:", error);
    }
  };

  const handleCreateGame = async () => {
    setLoading(true);
    try {
      const data = await apiPost("/api/game/create.php", {});
      if (data.success) {
        router.push(`/game/${data.gameCode}`); // ← ავტომატური გადაყვანა თამაშის გვერდზე
      } else {
        if (data.message === "აუცილებელია შესვლა") {
          logout();
          router.push("/login");
        }
      }
    } catch (error) {
      console.error("თამაშის შექმნის შეცდომა:", error);
    } finally {
      setLoading(false);
    }
  };
  

  const handleJoinGame = async (code) => {
    try {
      const data = await apiPost("/api/game/join.php", { gameCode: code });
      if (data.success) {
        router.push(`/game/${code}`);
      } else {
        console.error("შეუერთების შეცდომა:", data.message);
      }
    } catch (error) {
      console.error("შეუერთების შეცდომა:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 gap-6">
      <h1 className="text-3xl font-bold mb-4">ახალი თამაშის შექმნა</h1>

      <button
        onClick={handleCreateGame}
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-md"
      >
        {loading ? "იტვირთება..." : "შექმენი თამაში"}
      </button>

      {gameCode && (
        <div className="mt-6 flex flex-col items-center">
          <p className="text-lg font-semibold text-green-600">თამაშის კოდი: {gameCode}</p>
          <p className="text-gray-500 text-sm mt-2">დაელოდეთ მეორე მოთამაშეს ან გააზიარეთ კოდი.</p>
        </div>
      )}

      <h2 className="text-2xl font-bold mt-10">🎯 თამაშების სია</h2>

      <div className="flex flex-col gap-4 mt-4 w-full max-w-md">
        {waitingGames.length === 0 ? (
          <p>ამ დროისთვის თავისუფალი თამაშები არ არის.</p>
        ) : (
          waitingGames.map((game) => (
            <div
              key={game.game_code}
              className="flex items-center justify-between bg-gray-100 p-4 rounded-md shadow"
            >
              <span className="font-semibold">{game.game_code}</span>
              <button
                onClick={() => handleJoinGame(game.game_code)}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md"
              >
                შეუერთდი
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CreateGamePage;
