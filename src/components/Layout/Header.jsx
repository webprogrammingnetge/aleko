"use client";

import React from "react";
import { useAuth } from "../../hooks/useAuth";
import { useRouter } from "next/navigation";
import { apiGet } from "../../services/api";

const Header = () => {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await apiGet("/api/auth/lgout.php");
      logout();
      router.push("/login");
    } catch (error) {
      console.error("გასვლის შეცდომა:", error);
    }
  };

  if (!user) return null;

  return (
    <header className="flex items-center justify-between bg-gray-800 text-white py-4 px-8 shadow-md">
      <div className="text-xl font-bold">
        👤 {user.username}
      </div>
      <button
        onClick={handleLogout}
        className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md transition"
      >
        გასვლა
      </button>
    </header>
  );
};

export default Header;
