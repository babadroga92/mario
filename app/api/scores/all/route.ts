import { kv } from "@vercel/kv";

type ScoreRow = { username: string; score: number; timeMs: number; won: boolean; createdAt: number };
const KEY = "dpq:scores";
const mem: { items: ScoreRow[] } = (globalThis as any).__dpq_mem ?? ((globalThis as any).__dpq_mem = { items: [] });

export async function GET() {
  try {
    const items = (await kv.get<ScoreRow[]>(KEY)) ?? [];
    return Response.json({ items: items.sort((a, b) => b.score - a.score) });
  } catch {
    return Response.json({ items: mem.items.sort((a, b) => b.score - a.score) });
  }
}
