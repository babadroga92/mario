import { Suspense } from "react";
import GameClient from "./GameClient";

export default function GamePage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-gradient-to-b from-purple-900 to-purple-700 p-6 flex items-center justify-center">
          <div className="rounded-2xl bg-slate-900/40 border border-white/10 p-6 text-slate-200">
            Loading game…
          </div>
        </main>
      }
    >
      <GameClient />
    </Suspense>
  );
}
