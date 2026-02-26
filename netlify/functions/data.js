import { getStore } from "@netlify/blobs";

const STORE = "decision-tracker";
const KEY   = "app-data";

export default async (req) => {
  const store = getStore(STORE);

  if (req.method === "GET") {
    try {
      const data = await store.get(KEY, { type: "json" });
      return new Response(JSON.stringify(data ?? null), {
        headers: { "Content-Type": "application/json" },
      });
    } catch {
      return new Response(JSON.stringify(null), {
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  if (req.method === "POST") {
    try {
      const body = await req.json();
      await store.setJSON(KEY, body);
      return new Response(JSON.stringify({ ok: true }), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  return new Response("Method not allowed", { status: 405 });
};

export const config = { path: "/api/data" };
