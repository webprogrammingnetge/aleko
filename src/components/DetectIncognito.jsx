"use client";

import React, { useEffect, useState } from "react";
import { isIncognito } from "../utils/incognito";

const DetectIncognito = () => {
  const [incognito, setIncognito] = useState(false);

  useEffect(() => {
    const checkIncognito = async () => {
      const result = await isIncognito();
      console.log("Incognito detected:", result); // ✅ დაამატე ტესტისთვის
      setIncognito(result);
    };
    checkIncognito();
  }, []);

  if (!incognito) return null;

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-black px-6 py-3 rounded-md shadow-lg z-50">
      ⚠️ თქვენ იყენებთ Incognito რეჟიმს. სესია შეიძლება არ იმუშაოს სწორად.
    </div>
  );
};

export default DetectIncognito;
