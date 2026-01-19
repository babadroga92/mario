import { kv } from "@vercel/kv";

const KEY = "dpq:scores";
const mem: { items: any[] } = (globalThis as any).__dpq_mem ?? ((globalThis as any).__dpq_mem = { items: [] });

export async function POST() {
  try {
    await kv.set(KEY, []);
  } catch {
    mem.items = [];
  }
  return Response.json({ ok: true });
}
