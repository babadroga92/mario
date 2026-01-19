"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const [username, setUsername] = useState("");
  const router = useRouter();

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-900 to-purple-700 p-6">
      <div className="w-full max-w-xl rounded-2xl bg-slate-900/60 border border-white/10 p-8 shadow-2xl">
        <div className="text-center mb-6">
          <div className="text-5xl font-black tracking-widest text-white drop-shadow">
            DATA PRIVACY
          </div>

          <div className="text-3xl font-extrabold tracking-widest text-emerald-400 mt-1">
            QUEST
          </div>

          {/* Pixel-style badges */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs font-bold tracking-wider">
            <span className="px-3 py-1 rounded-lg bg-slate-950/70 border border-white/10 text-rose-300">
              ❤️ 3 HEARTS
            </span>
            <span className="px-3 py-1 rounded-lg bg-slate-950/70 border border-white/10 text-cyan-300">
              ❓ 5 QUIZ ROOMS
            </span>
            <span className="px-3 py-1 rounded-lg bg-slate-950/70 border border-white/10 text-emerald-300">
              🌸 FINAL FLOWER QUEST
            </span>
          </div>

          <p className="text-slate-200/85 mt-4 leading-relaxed">
            Dash through <span className="text-white font-semibold">6 rooms</span>, defeat{" "}
            <span className="text-white font-semibold">data thieves</span>, and pass{" "}
            <span className="text-white font-semibold">GDPR Quiz Checkpoints</span> to protect the
            kingdom’s privacy.
          </p>
        </div>

        <div className="rounded-xl bg-slate-950/35 border border-white/10 p-4 text-slate-100/90 text-sm leading-relaxed">
          <div className="font-bold text-white mb-2">How it works</div>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              You start with <span className="text-white font-semibold">3 hearts</span>. If hearts
              hit <span className="text-white font-semibold">0</span>, the game ends.
            </li>
            <li>
              Rooms <span className="text-white font-semibold">1–5</span>: reach the door to trigger
              a <span className="text-white font-semibold">Quiz Checkpoint</span>.
            </li>
            <li>
  Answering wrong shows the correct answer and deducts{" "}
  <span className="text-white font-semibold">100 points</span> — you still move on.
</li>
<li>
  ⚠️ <span className="text-amber-300 font-semibold">Pay attention to the questions!</span>{" "}
  Quiz answers are worth more than defeating data thieves.
</li>

            <li>
              Final room: find the <span className="text-white font-semibold">🌸 flower</span> and
              bring it to the <span className="text-white font-semibold">Queen 👑</span> to win.
            </li>
            <li>
              Tip:{" "}
              <span className="text-emerald-300 font-semibold">
                More data thieves you kill, more points!
              </span>
            </li>
          </ul>
        </div>

        <div className="mt-6">
          <label className="block text-white font-semibold mb-2">Enter Your Username</label>
          <input
            className="w-full rounded-xl bg-slate-950/60 border border-white/10 p-3 text-white outline-none focus:ring-2 focus:ring-emerald-400"
            placeholder="Your hero name..."
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <button
          className="mt-4 w-full rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3"
          onClick={() => {
            const name = username.trim() || "Anonymous";
            router.push(`/game?u=${encodeURIComponent(name)}`);
          }}
        >
          ▶ START QUEST
        </button>

        <div className="mt-6 text-sm text-slate-200/85">
          <div className="font-semibold mb-2 text-white">Controls:</div>
          <div>← → or A/D — Move</div>
          <div>↑ or SPACE — Jump</div>
          <div>X or ENTER — Shoot</div>
          <div className="mt-2 text-slate-200/75">
            Bonus: Jumping on a thief from above can defeat them (Mario-style).
          </div>
        </div>
      </div>
    </main>
  );
}
