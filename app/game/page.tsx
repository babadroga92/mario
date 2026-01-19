"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { gameEvents } from "@/src/game/events";

type ScoreRow = {
  username: string;
  score: number;
  timeMs: number;
  won: boolean;
  createdAt: number;
};

type SubmitPayload = { username: string; score: number; timeMs: number; won: boolean };

export default function GamePage() {
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
    loadTop5();
  }, []);

  useEffect(() => {
    if (!ref.current) return;

    let game: any | null = null;
    let mounted = true;

    const handler = async (p: SubmitPayload) => {
      setFinal({ score: p.score });

      await fetch("/api/scores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(p),
      });

      await loadTop5();
    };

    gameEvents.on("SCORE_SUBMIT", handler);

    (async () => {
      // Dynamic import so Phaser is only loaded client-side
      const mod = await import("@/src/game/createGame");
      if (!mounted) return;

      game = mod.createGame(ref.current!, username);
    })();

    return () => {
      mounted = false;
      gameEvents.off("SCORE_SUBMIT", handler);
      if (game) game.destroy(true);
    };
  }, [username]);

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
