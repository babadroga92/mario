import { kv } from "@vercel/kv";

export const runtime = "edge";

const KEY = "scores";

type ScoreRow = {
  username: string;
  score: number;
  timeMs: number;
  won: boolean;
  createdAt: number;
};

export async function GET() {
  const items = ((await kv.lrange(KEY, 0, -1)) || []) as ScoreRow[];

  items.sort((a, b) => {
    if ((b.score ?? 0) !== (a.score ?? 0)) return (b.score ?? 0) - (a.score ?? 0); // highest first
    if ((a.timeMs ?? 0) !== (b.timeMs ?? 0)) return (a.timeMs ?? 0) - (b.timeMs ?? 0); // faster first
    return (b.createdAt ?? 0) - (a.createdAt ?? 0); // newest first
  });

  return Response.json({ items }, { headers: { "Cache-Control": "no-store" } });
}
