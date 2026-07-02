import { getStore } from "@netlify/blobs";

const storeName = "sue-birthday-card";
const key = "wishes.json";
const wishLimit = 200;

const defaultHeaders = {
  "content-type": "application/json; charset=utf-8",
  "cache-control": "no-store",
};

const clampText = (value) =>
  String(value || "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 64);

const clampName = (value) =>
  String(value || "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 18);

const sanitizeWish = (wish, index) => ({
  id: String(wish.id || `wish-${Date.now()}-${index}`),
  name: clampName(wish.name),
  avatar: typeof wish.avatar === "string" ? wish.avatar : "",
  text: clampText(wish.text),
  x: Number.isFinite(Number(wish.x)) ? Number(wish.x) : 0,
  y: Number.isFinite(Number(wish.y)) ? Number(wish.y) : 0,
  z: Number.isFinite(Number(wish.z)) ? Number(wish.z) : 0,
  seed: Number.isFinite(Number(wish.seed)) ? Number(wish.seed) : 1,
  createdAt: String(wish.createdAt || new Date().toISOString()),
});

const createStore = () => getStore(storeName);

const readWishes = async (store) => {
  const stored = await store.get(key, { type: "json" });
  if (!Array.isArray(stored)) return [];
  return stored
    .map(sanitizeWish)
    .filter((wish) => wish.text && !String(wish.id).startsWith("seed-"))
    .slice(-wishLimit);
};

export default async (request) => {
  try {
    const store = createStore();

    if (request.method === "GET") {
      const wishes = await readWishes(store);
      return new Response(JSON.stringify({ wishes }), {
        status: 200,
        headers: defaultHeaders,
      });
    }

    if (request.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { ...defaultHeaders, allow: "GET, POST" },
      });
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return new Response(JSON.stringify({ error: "Invalid JSON" }), {
        status: 400,
        headers: defaultHeaders,
      });
    }

    const wish = sanitizeWish(body, 0);
    if (!wish.text) {
      return new Response(JSON.stringify({ error: "Wish text is required" }), {
        status: 400,
        headers: defaultHeaders,
      });
    }

    const wishes = await readWishes(store);
    const nextWishes = [...wishes, wish].slice(-wishLimit);
    await store.setJSON(key, nextWishes);

    return new Response(JSON.stringify({ ok: true, wish, wishes: nextWishes }), {
      status: 200,
      headers: defaultHeaders,
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: "Internal Server Error",
        message: error instanceof Error ? error.message : String(error),
      }),
      {
        status: 500,
        headers: defaultHeaders,
      },
    );
  }
};
