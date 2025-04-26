"use client";

export const apiPost = async (url, body) => {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return await response.json();
  } catch (err) {
    console.error("API POST შეცდომა:", err);
    throw err;
  }
};

export const apiGet = async (url) => {
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    return await response.json();
  } catch (err) {
    console.error("API GET შეცდომა:", err);
    throw err;
  }
};
