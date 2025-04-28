"use client";
import { useAuth } from "../hooks/useAuth"; // აქ ვერ გამოვიყენებთ პირდაპირ, სხვა გზა უნდა მოვძებნოთ
// ან apiGet/apiPost გამოვიდეს კომპონენტიდან სადაც გვაქვს access
const BASE_URL = process.env.NEXT_PUBLIC_DEFURL || "http://localhost:3000"; 
console.log(BASE_URL,process.env.NEXT_PUBLIC_DEFURL)
export const apiPost = async (endpoint, body) => {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      credentials: "include", // სესიისთვის საჭიროა
    });
    return await response.json();
  } catch (err) {
    console.error("API POST შეცდომა:", err);
    throw err;
  }
};

export const apiGet = async (endpoint, body) => {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // სესიისთვის საჭიროა
    });
    return await response.json();
  } catch (err) {
    console.error("API GET შეცდომა:", err);
    throw err;
  }
};
