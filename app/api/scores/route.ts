import { kv } from "@vercel/kv";

export const runtime = "edge";

type ScoreRow = {
  username: string;
  score: number;
  timeMs: number;
  won: boolean;
  createdAt: number;
};

const KEY = "scores";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const top = Number(searchParams.get("top") || "5");

  const items = (await kv.lrange<ScoreRow>(KEY, 0, -1)) || [];

  const sorted = items.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    if (a.timeMs !== b.timeMs) return a.timeMs - b.timeMs;
    return b.createdAt - a.createdAt;
  });

  return Response.json({ items: sorted.slice(0, top) });
}

export async function POST(req: Request) {
  const body = await req.json();

  const row: ScoreRow = {
    username: body.username || "Anonymous",
    score: Number(body.score) || 0,
    timeMs: Number(body.timeMs) || 0,
    won: Boolean(body.won),
    createdAt: Date.now(),
  };

  await kv.lpush(KEY, row);
  await kv.ltrim(KEY, 0, 499); // keep last 500

  return Response.json({ ok: true });
}
