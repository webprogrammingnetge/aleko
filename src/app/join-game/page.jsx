"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { apiPost } from "../../services/api";
import { useRouter } from "next/navigation";

const JoinGamePage = () => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [gameCode, setGameCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  const handleJoinGame = async (e) => {
    e.preventDefault();

    if (!gameCode.trim()) {
      setError("თამაშის კოდის შეყვანა აუცილებელია!");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data = await apiPost("/api/game/join.php", { gameCode: gameCode.trim().toUpperCase() });

      if (data.success) {
        router.push(`/game/${gameCode.trim().toUpperCase()}`);
      } else {
        if (data.message === "აუცილებელია ავტორიზაცია") {
          logout();
          router.push("/login");
        } else {
          setError(data.message || "თამაშში შესვლა ვერ მოხერხდა.");
        }
      }
    } catch (err) {
      setError("სერვერთან კავშირის პრობლემა.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <h1 className="text-3xl font-bold mb-6">შედი თამაშში</h1>
      <form onSubmit={handleJoinGame} className="w-full max-w-sm flex flex-col gap-4">
        <input
          type="text"
          placeholder="თამაშის კოდი"
          className="border p-3 rounded-md uppercase"
          value={gameCode}
          onChange={(e) => setGameCode(e.target.value)}
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-md"
        >
          {loading ? "იტვირთება..." : "შედი თამაშში"}
        </button>
      </form>
      {error && <p className="mt-4 text-red-600">{error}</p>}
    </div>
  );
};

export default JoinGamePage;
