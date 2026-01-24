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

      // Intentionally only showing the "safe" field
      setShown({ name: data.name });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white p-6 flex items-center justify-center">
      <div className="w-full max-w-xl rounded-2xl bg-white/5 border border-white/10 p-6 space-y-6">
        <h1 className="text-2xl font-bold">Privacy by Design Demo</h1>

        <p className="text-white/90 text-lg leading-relaxed font-semibold">
          This page intentionally demonstrates a common mistake: hiding fields in
          the UI does{" "}
          <span className="text-rose-300 font-bold">not</span> protect data if the
          API still returns it.
        </p>

        <button
          onClick={handleClick}
          disabled={loading}
          className="w-full rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 text-slate-950 font-bold py-3 transition"
        >
          {loading ? "Loading..." : "Click me"}
        </button>

        {shown && (
          <pre className="rounded-xl bg-slate-900/60 border border-white/10 p-4 text-sm overflow-auto">
            {JSON.stringify(shown, null, 2)}
          </pre>
        )}

        <div className="border-t border-white/10 pt-6">
          <div className="font-semibold text-white/80 text-base">
            How to see the problem 👇
          </div>

          <ol className="mt-4 space-y-3 text-lg font-semibold list-decimal list-inside">
            <li>
              👉{" "}
              <span className="text-emerald-300">
                Click the button once
              </span>{" "}
              to see what the UI displays (only the{" "}
              <code className="font-mono">name</code> field).
            </li>

            <li>
              👉 Right-click anywhere →{" "}
              <span className="font-bold">Inspect</span> → open{" "}
              <span className="font-bold">DevTools → Network</span>.
            </li>

            <li>
              👉{" "}
              <span className="text-emerald-300">
                Click the button again
              </span>{" "}
              — this time the request will appear in Network.
            </li>

            <li>
              👉 Click the request to{" "}
              <span className="font-mono bg-black/40 px-2 py-1 rounded text-emerald-300">
                /api/privacy
              </span>
              .
            </li>

            <li>
              👉 Open the <span className="font-bold">Response</span> tab — you’ll
              see extra fields the UI is hiding.
            </li>
          </ol>

          <p className="mt-4 text-white/60 text-sm">
  ⚠️ This example shows why APIs should return only the data required for the
  intended user experience.
</p>

        </div>
      </div>
    </main>
  );
}
