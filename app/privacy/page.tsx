"use client";

import { useState } from "react";

export default function PrivacyDemoPage() {
  const [shown, setShown] = useState<{ name: string } | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    try {
      const res = await fetch("/api/privacy", { cache: "no-store" });
      const data = await res.json();

      // Only show "safe" field in UI (intentionally)
      setShown({ name: data.name });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white p-6 flex items-center justify-center">
      <div className="w-full max-w-xl rounded-2xl bg-white/5 border border-white/10 p-6 space-y-4">
        <h1 className="text-2xl font-bold">Privacy by Design Demo</h1>

        <p className="text-white/90 text-lg leading-relaxed font-semibold">
  This page intentionally demonstrates a common mistake: hiding fields in the UI does{" "}
  <span className="text-rose-300 font-bold">not</span> protect data if the API still returns it.
</p>


        <button
          onClick={handleClick}
          disabled={loading}
          className="w-full rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 text-slate-950 font-bold py-3"
        >
          {loading ? "Loading..." : "Click me"}
        </button>

        {shown && (
          <pre className="rounded-xl bg-slate-900/60 border border-white/10 p-4 text-sm overflow-auto">
{JSON.stringify(shown, null, 2)}
          </pre>
        )}

        <div className="text-xs text-white/70 border-t border-white/10 pt-4">
          <div className="font-semibold text-white/80">Try this:</div>
          <ul className="mt-4 space-y-3 text-lg font-semibold">
  <li>👉 Click the button.</li>
  <li>👉 Open <span className="font-bold">DevTools → Network</span>.</li>
  <li>
    👉 Click the request to{" "}
    <span className="font-mono bg-black/40 px-2 py-1 rounded text-emerald-300">
      /api/privacy
    </span>
    .
  </li>
  <li>
    👉 Look at the <span className="font-bold">Response</span> tab (you’ll see extra fields).
  </li>
</ul>

        </div>
      </div>
    </main>
  );
}
