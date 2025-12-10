"use client";

import { useState, useRef } from "react";

export default function Home() {
  // Oyun durumları: 'idle' (boşta), 'waiting' (kırmızı/bekle), 'ready' (yeşil/tıkla), 'finished' (sonuç)
  const [gameState, setGameState] = useState<"idle" | "waiting" | "ready" | "finished">("idle");
  const [message, setMessage] = useState("Refleks Testi: Başlamak için tıkla");
  const [result, setResult] = useState<number | null>(null);
  
  // Zamanlayıcı referansları
  const startTimeRef = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleClick = () => {
    if (gameState === "idle" || gameState === "finished") {
      startGame();
    } else if (gameState === "waiting") {
      // Erken tıkladı
      endGame(false);
    } else if (gameState === "ready") {
      // Doğru zamanda tıkladı
      endGame(true);
    }
  };

  const startGame = () => {
    setGameState("waiting");
    setMessage("Yeşil olunca TIKLA! (Bekle...)");
    setResult(null);

    // 2 ile 5 saniye arası rastgele bir süre bekle
    const randomTime = Math.floor(Math.random() * 3000) + 2000;

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      setGameState("ready");
      setMessage("ŞİMDİ TIKLA!");
      startTimeRef.current = Date.now();
    }, randomTime);
  };

  const endGame = (success: boolean) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    if (success) {
      const endTime = Date.now();
      const reactionTime = endTime - startTimeRef.current;
      setResult(reactionTime);
      setMessage(`Süper! Refleksin: ${reactionTime} ms`);
    } else {
      setMessage("Çok erken tıkladın! Tekrar dene.");
      setResult(null);
    }
    setGameState("finished");
  };

  // Arka plan rengini duruma göre belirle
  const getBackgroundColor = () => {
    switch (gameState) {
      case "waiting": return "bg-red-600";
      case "ready": return "bg-green-500";
      case "finished": return "bg-blue-600"; // Sonuç ekranı mavi
      default: return "bg-gray-900";
    }
  };

  return (
    <main 
      onClick={handleClick}
      className={`flex min-h-screen flex-col items-center justify-center p-4 cursor-pointer transition-colors duration-200 ${getBackgroundColor()} text-white select-none`}
    >
      <h1 className="text-4xl font-bold mb-4 text-center">⚡ Refleks Testi</h1>
      
      <div className="text-2xl font-semibold text-center p-6 bg-black/20 rounded-xl backdrop-blur-sm">
        {message}
      </div>

      {gameState === "idle" && (
        <p className="mt-8 text-gray-300 animate-pulse">Başlamak için ekrana dokun</p>
      )}

      {gameState === "finished" && result !== null && (
         <div className="mt-8">
            <button onClick={(e) => { e.stopPropagation(); startGame(); }} className="bg-white text-blue-600 px-6 py-2 rounded-full font-bold hover:bg-gray-100 transition">
              Tekrar Dene
            </button>
         </div>
      )}
    </main>
  );
}
