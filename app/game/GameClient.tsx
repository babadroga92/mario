"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

type ScoreRow = { username: string; score: number; timeMs: number; won: boolean; createdAt: number };

export default function GameClient() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Keep stable refs so cleanup always works (even with async init)
  const gameRef = useRef<any>(null);
  const eventsRef = useRef<any>(null);
  const handlerRef = useRef<any>(null);

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
    if (!containerRef.current) return;

    let cancelled = false;

    // IMPORTANT: prevent duplicate canvases
    if (gameRef.current) {
      try {
        gameRef.current.destroy(true);
      } catch {}
      gameRef.current = null;
    }

    // IMPORTANT: clear any leftover <canvas> nodes
    containerRef.current.innerHTML = "";

    (async () => {
      const mod = await import("@/src/game/createGame");
      const ev = await import("@/src/game/events");

      if (cancelled || !containerRef.current) return;

      const createGame = mod.createGame;
      const events = ev.gameEvents;

      eventsRef.current = events;

      const game = createGame(containerRef.current, username);
      gameRef.current = game;

      const handler = async (p: { username: string; score: number; timeMs: number; won: boolean }) => {
        setFinal({ score: p.score });

        await fetch("/api/scores", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(p),
        });

        await loadTop5();
      };

      handlerRef.current = handler;
      events.on("SCORE_SUBMIT", handler);
    })();

    return () => {
      cancelled = true;

      // unsubscribe safely
      if (eventsRef.current && handlerRef.current) {
        try {
          eventsRef.current.off("SCORE_SUBMIT", handlerRef.current);
        } catch {}
      }

      // destroy game safely
      if (gameRef.current) {
        try {
          gameRef.current.destroy(true);
        } catch {}
        gameRef.current = null;
      }

      // clear DOM (removes any leftover canvases)
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, [username]);

  return (
    <main
      style={{
        minHeight: "100vh",
        fontFamily:
          'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        color: "white",
        padding: 24,
        background: "#070915",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Animated background (same vibe as Welcome) */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(900px 520px at 20% 10%, rgba(168,85,247,0.22), transparent 60%), radial-gradient(700px 520px at 80% 20%, rgba(96,165,250,0.18), transparent 55%), linear-gradient(180deg, #12072a, #070915)",
          animation: "floatBg 18s ease-in-out infinite alternate",
        }}
      />
      <style>{`
        @keyframes floatBg {
          from { transform: translateY(0px); }
          to { transform: translateY(-36px); }
        }
      `}</style>

      <div style={{ position: "relative", maxWidth: 1180, margin: "0 auto" }}>
        {/* Top pill */}
        <div style={{ marginBottom: 14 }}>
          <div
            style={{
              display: "inline-block",
              padding: "6px 12px",
              borderRadius: 999,
              border: "1px solid rgba(255,255,255,0.12)",
              background: "rgba(255,255,255,0.04)",
              fontSize: 12,
              color: "rgba(255,255,255,0.75)",
            }}
          >
            Privacy Week 2026
          </div>
        </div>

        <div style={{ display: "grid", gap: 16 }}>
          {/* Game shell */}
          <section
            style={{
              borderRadius: 18,
              border: "1px solid rgba(255,255,255,0.12)",
              background: "rgba(9,12,28,0.88)",
              padding: 16,
              boxShadow: "0 30px 60px rgba(0,0,0,0.45)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Neon inner frame (like game UI) */}
            <div
              aria-hidden
              style={{
                position: "absolute",
                inset: 14,
                borderRadius: 16,
                border: "1px solid rgba(168,85,247,0.55)",
                boxShadow:
                  "0 0 0 1px rgba(0,0,0,0.55) inset, 0 0 30px rgba(168,85,247,0.18)",
                pointerEvents: "none",
              }}
            />

            {/* Header row */}
            <div
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
                marginBottom: 10,
              }}
            >
              <div style={{ fontSize: 14, color: "rgba(255,255,255,0.8)" }}>
                Player:{" "}
                <span style={{ color: "white", fontWeight: 800 }}>{username}</span>
              </div>

              {/* Tiny HUD chips (visual only) */}
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "8px 10px",
                    borderRadius: 14,
                    border: "1px solid rgba(255,255,255,0.12)",
                    background: "rgba(255,255,255,0.04)",
                    fontSize: 12,
                    fontWeight: 900,
                    letterSpacing: 0.6,
                    color: "rgba(255,255,255,0.9)",
                  }}
                >
                  ❤️ HUD
                </span>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "8px 10px",
                    borderRadius: 14,
                    border: "1px solid rgba(255,255,255,0.12)",
                    background: "rgba(255,255,255,0.04)",
                    fontSize: 12,
                    fontWeight: 900,
                    letterSpacing: 0.6,
                    color: "rgba(255,255,255,0.9)",
                  }}
                >
                  ⏱️ TIME
                </span>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "8px 10px",
                    borderRadius: 14,
                    border: "1px solid rgba(255,255,255,0.12)",
                    background: "rgba(255,255,255,0.04)",
                    fontSize: 12,
                    fontWeight: 900,
                    letterSpacing: 0.6,
                    color: "rgba(255,255,255,0.9)",
                  }}
                >
                  ✨ SCORE
                </span>
              </div>
            </div>

            {/* Canvas container */}
            <div
              style={{
                position: "relative",
                borderRadius: 16,
                border: "1px solid rgba(255,255,255,0.10)",
                background: "rgba(0,0,0,0.18)",
                padding: 10,
                boxShadow: "0 18px 44px rgba(0,0,0,0.30)",
              }}
            >
              <div ref={containerRef} />
            </div>
          </section>

          {/* Results / leaderboard */}
          {final && (
            <section
              style={{
                borderRadius: 18,
                border: "1px solid rgba(255,255,255,0.12)",
                background: "rgba(9,12,28,0.88)",
                padding: 18,
                boxShadow: "0 30px 60px rgba(0,0,0,0.45)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  gap: 12,
                  marginBottom: 10,
                }}
              >
                <div>
                  <div style={{ fontSize: 20, fontWeight: 900 }}>Leaderboard (Top 5)</div>
                  <div style={{ marginTop: 6, color: "rgba(34,197,94,0.95)", fontWeight: 800 }}>
                    Your score: {final.score}
                  </div>
                </div>

                <div
                  style={{
                    padding: "10px 12px",
                    borderRadius: 14,
                    border: "1px solid rgba(255,255,255,0.12)",
                    background: "rgba(255,255,255,0.04)",
                    textAlign: "right",
                    minWidth: 140,
                  }}
                >
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.65)" }}>Player</div>
                  <div style={{ fontSize: 14, fontWeight: 900 }}>{username}</div>
                </div>
              </div>

              <ol style={{ marginTop: 12, display: "grid", gap: 10, paddingLeft: 0, listStyle: "none" }}>
                {top5.map((s, i) => (
                  <li
                    key={s.createdAt + "-" + i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 12,
                      padding: "12px 14px",
                      borderRadius: 16,
                      border: "1px solid rgba(255,255,255,0.12)",
                      background: "rgba(255,255,255,0.04)",
                      boxShadow: "0 12px 28px rgba(0,0,0,0.25)",
                    }}
                  >
                    <div style={{ color: "white", fontWeight: 800 }}>
                      #{i + 1} <span style={{ fontWeight: 900 }}>{s.username}</span>{" "}
                      {s.won ? "🌸" : ""}
                    </div>
                    <div style={{ color: "rgba(34,197,94,0.95)", fontWeight: 900, fontSize: 16 }}>
                      {s.score}
                    </div>
                  </li>
                ))}
                {top5.length === 0 && (
                  <div style={{ color: "rgba(255,255,255,0.7)", marginTop: 6 }}>
                    No scores yet.
                  </div>
                )}
              </ol>
            </section>
          )}
        </div>
      </div>
    </main>
  );
}
