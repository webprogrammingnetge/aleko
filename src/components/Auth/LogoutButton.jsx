"use client";

import React from "react";
import { useAuth } from "../../hooks/useAuth";
import { useRouter } from "next/navigation";
import { apiGet } from "../../services/api";

const LogoutButton = () => {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await apiGet("/api/auth/logout.php");
    logout();
    router.push("/login");
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md font-semibold"
    >
      გამოსვლა
    </button>
  );
};

export default LogoutButton;
