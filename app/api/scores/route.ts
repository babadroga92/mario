import { kv } from "@vercel/kv";

type ScoreRow = { username: string; score: number; timeMs: number; won: boolean; createdAt: number };

const KEY = "dpq:scores";

// Local fallback for dev if KV isn’t configured
const mem: { items: ScoreRow[] } = (globalThis as any).__dpq_mem ?? ((globalThis as any).__dpq_mem = { items: [] });

async function readAll(): Promise<ScoreRow[]> {
  try {
    const items = (await kv.get<ScoreRow[]>(KEY)) ?? [];
    return items;
  } catch {
    return mem.items;
  }
}

async function writeAll(items: ScoreRow[]) {
  try {
    await kv.set(KEY, items);
  } catch {
    mem.items = items;
  }
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const top = Number(url.searchParams.get("top") || "5");

  const items = await readAll();
  const sorted = [...items].sort((a, b) => b.score - a.score).slice(0, top);

  return Response.json({ items: sorted });
}

export async function POST(req: Request) {
  const body = (await req.json()) as { username: string; score: number; timeMs: number; won: boolean };
  const row: ScoreRow = { ...body, createdAt: Date.now() };

  const items = await readAll();
  items.push(row);

  // keep list from growing forever
  const trimmed = items.sort((a, b) => b.score - a.score).slice(0, 500);
  await writeAll(trimmed);

  return Response.json({ ok: true });
}
