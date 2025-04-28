"use client";

import React, { useState } from "react";
import { apiPost } from "../../services/api";
import { useAuth } from "../../hooks/useAuth";
import { useRouter } from "next/navigation";

const LoginForm = () => {
  const { login } = useAuth();
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [remember, setRemember] = useState(false);
  const [ps, setPs] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username.trim() || !ps.trim()) {
      setMessage("⚠️ ყველა ველი სავალდებულოა.");
      return;
    }

    if (ps.length < 4) {
      setMessage("⚠️ პაროლი უნდა იყოს მინიმუმ 6 სიმბოლო.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const data = await apiPost("/api/auth/lg.php", { username, ps });
console.log(data)
      if (data.success) {
        // ვიწყებთ session-ის მართვას — შეგვიძლია უბრალოდ აღვნიშნოთ რომ შესულია
        login(data.userId,data.username,remember);
        router.push("/create-game"); // წარმატებით შესვლის შემდეგ თამაშის შექმნაზე გადაგდოს
      } else {
        setMessage(`❌ ${data.message}`);
      }
    } catch (error) {
      setMessage("❌ სერვერთან კავშირის პრობლემა.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6">
      <h2 className="text-2xl font-bold mb-6">შესვლა</h2>
      <form onSubmit={handleSubmit} className="w-full max-w-sm flex flex-col gap-4">
        <input
          type="text"
          placeholder="მომხმარებელი"
          className="border p-3 rounded-md"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="პაროლი"
          className="border p-3 rounded-md"
          value={ps}
          onChange={(e) => setPs(e.target.value)}
        />
        <input
          type="checkbox"
          className="border p-3 rounded-md"
          value='1'
          id="remember"
          onChange={(e) => setRemember(e.target.checked)}
          /><label htmlFor="remember">დამახსოვრება</label>
        <button
          type="submit"
          disabled={loading}
          className={`py-3 px-4 rounded-md text-white font-semibold transition ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {loading ? "იტვირთება..." : "შესვლა"}
        </button>
      </form>
      {message && <p className="mt-4 text-center text-sm">{message}</p>}
    </div>
  );
};

export default LoginForm;
