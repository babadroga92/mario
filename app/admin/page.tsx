"use client";

import { useEffect, useState } from "react";

type ScoreRow = { username: string; score: number; timeMs: number; won: boolean; createdAt: number };

export default function AdminPage() {
  const [items, setItems] = useState<ScoreRow[]>([]);

  async function load() {
    const r = await fetch("/api/scores/all", { cache: "no-store" });
    const data = await r.json();
    setItems(data.items || []);
  }

  async function reset() {
    await fetch("/api/scores/reset", { method: "POST" });
    await load();
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 p-6 text-white">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Admin — Full Scoreboard</h1>
          <button className="bg-red-500 hover:bg-red-400 text-slate-950 font-bold px-4 py-2 rounded-xl" onClick={reset}>
            Reset Scoreboard
          </button>
        </div>

        <div className="mt-6 space-y-2">
          {items.map((s, i) => (
            <div key={s.createdAt + "-" + i} className="bg-white/5 border border-white/10 rounded-xl p-3 flex justify-between">
              <div>
                <div className="font-semibold">{s.username} {s.won ? "🌸" : ""}</div>
                <div className="text-white/70 text-sm">time: {Math.floor(s.timeMs / 1000)}s</div>
              </div>
              <div className="text-emerald-300 font-bold text-lg">{s.score}</div>
            </div>
          ))}
          {items.length === 0 && <div className="text-white/70">No scores yet.</div>}
        </div>
      </div>
    </main>
  );
}
