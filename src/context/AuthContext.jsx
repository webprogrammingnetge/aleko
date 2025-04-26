"use client";

import { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userId = Cookies.get("userId");
    const username = Cookies.get("username");

    if (userId && username) {
      setUser({ userId, username });
    }
  }, []);

  const login = (userId, username, remember) => {
    const options = remember ? { expires: 7 } : undefined;
    Cookies.set("userId", userId, options);
    Cookies.set("username", username, options);
    setUser({ userId, username });
  };

  const logout = () => {
    Cookies.remove("userId");
    Cookies.remove("username");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => useContext(AuthContext);