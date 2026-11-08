import {authorized, json, preflight, readState, writeState} from "./_state.js";

const MODES = new Set(["eyes", "weather", "memo"]);

export async function onRequest(context) {
  const cors = preflight(context.request);
  if (cors) return cors;
  if (!authorized(context.request, context.env)) return json({error: "unauthorized"}, 401, context.request);
  if (context.request.method !== "POST") return json({error: "method_not_allowed"}, 405, context.request);
  const body = await context.request.json().catch(() => null);
  if (!body || !MODES.has(body.mode)) return json({error: "invalid_mode"}, 400, context.request);
  const state = await readState(context.env);
  state.seq += 1;
  state.desired_mode = body.mode;
  await writeState(context.env, state);
  state.online = state.last_seen !== null && Date.now() / 1000 - state.last_seen < 30;
  return json(state, 200, context.request);
}
