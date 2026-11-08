const EMPTY = {
  seq: 0,
  ack_seq: 0,
  desired_mode: null,
  mode: null,
  memo: "",
  bitmap: [],
  online: false,
  last_seen: null,
  clock_synced: false,
  weather_ok: false,
  uptime: 0
};

export async function readState(env) {
  if (!env.PAPER_ROBOT_STATE) return {...EMPTY};
  const value = await env.PAPER_ROBOT_STATE.get("state", "json");
  return value && typeof value === "object" ? {...EMPTY, ...value} : {...EMPTY};
}

export async function writeState(env, state) {
  if (!env.PAPER_ROBOT_STATE) {
    throw new Error("Missing PAPER_ROBOT_STATE KV binding");
  }
  await env.PAPER_ROBOT_STATE.put("state", JSON.stringify(state));
}

export function authorized(request, env) {
  const expected = env.CONTROL_TOKEN;
  const actual = request.headers.get("Authorization") || "";
  return typeof expected === "string" && expected.length >= 32 &&
    actual === "Bearer " + expected;
}

export function json(data, status = 200, request = null) {
  const headers = {"Content-Type": "application/json; charset=utf-8"};
  const origin = request && request.headers.get("Origin");
  if (origin) {
    headers["Access-Control-Allow-Origin"] = origin;
    headers["Vary"] = "Origin";
  }
  return new Response(JSON.stringify(data), {status, headers});
}

export function preflight(request) {
  if (request.method !== "OPTIONS") return null;
  const origin = request.headers.get("Origin") || "";
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Headers": "Authorization, Content-Type",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Vary": "Origin"
    }
  });
}

export {EMPTY};
