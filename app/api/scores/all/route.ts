import { kv } from "@vercel/kv";

export const runtime = "edge";

const KEY = "scores";

export async function GET() {
  const items = (await kv.lrange(KEY, 0, -1)) || [];
  return Response.json({ items });
}
