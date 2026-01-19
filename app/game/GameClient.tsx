"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";


type ScoreRow = { username: string; score: number; timeMs: number; won: boolean; createdAt: number };

export default function GameClient() {
  const ref = useRef<HTMLDivElement>(null);
  const sp = useSearchParams();
  const username = useMemo(() => sp.get("u") || "Anonymous", [sp]);

  const [top5, setTop5] = useState<ScoreRow[]>([]);
  const [final, setFinal] = useState<{ score: number } | null>(null);

  async function loadTop5() {
    const r = await fetch("/api/scores?top=5", { cache: "no-store" });
    const data = await r.json();
    setTop5(data.items || []);
  }

  useEffect(() => {
    if (!ref.current) return;
  
    let game: any;
    let events: any;
  
    (async () => {
      const mod = await import("@/src/game/createGame");
      const ev = await import("@/src/game/events");
  
      const createGame = mod.createGame;
      events = ev.gameEvents;
  
      game = createGame(ref.current!, username);
  
      const handler = async (p: { username: string; score: number; timeMs: number; won: boolean }) => {
        setFinal({ score: p.score });
        await fetch("/api/scores", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(p),
        });
        await loadTop5();
      };
  
      events.on("SCORE_SUBMIT", handler);
  
      // store handler for cleanup
      (game as any).__scoreHandler = handler;
    })();
  
    return () => {
      // cleanup safely
      if (events && game && (game as any).__scoreHandler) {
        events.off("SCORE_SUBMIT", (game as any).__scoreHandler);
      }
      if (game) game.destroy(true);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username]);
  

  useEffect(() => {
    loadTop5();
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-900 to-purple-700 p-6">
      <div className="max-w-5xl mx-auto grid gap-6">
        <div className="rounded-2xl bg-slate-900/40 border border-white/10 p-4 shadow-2xl">
          <div className="text-slate-200/80 mb-2">
            Player: <span className="text-white font-semibold">{username}</span>
          </div>
          <div ref={ref} />
        </div>

        <div className="rounded-2xl bg-slate-900/40 border border-white/10 p-6">
          <div className="text-white font-bold text-xl">Leaderboard (Top 5)</div>
          {final && <div className="text-emerald-300 mt-2">Your score: {final.score}</div>}

          <ol className="mt-4 space-y-2">
            {top5.map((s, i) => (
              <li
                key={s.createdAt + "-" + i}
                className="flex items-center justify-between bg-slate-950/40 border border-white/10 rounded-xl px-4 py-2"
              >
                <div className="text-white">
                  #{i + 1} <span className="font-semibold">{s.username}</span> {s.won ? "🌸" : ""}
                </div>
                <div className="text-emerald-300 font-bold">{s.score}</div>
              </li>
            ))}
            {top5.length === 0 && <div className="text-slate-200/70 mt-2">No scores yet.</div>}
          </ol>
        </div>
      </div>
    </main>
  );
}
