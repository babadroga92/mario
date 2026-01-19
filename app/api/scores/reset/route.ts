import { kv } from "@vercel/kv";

export const runtime = "edge";

const KEY = "scores";

export async function POST() {
  await kv.del(KEY);
  return Response.json({ ok: true });
}
