import {authorized, json, preflight, readState} from "./_state.js";

export async function onRequest(context) {
  const cors = preflight(context.request);
  if (cors) return cors;
  if (!authorized(context.request, context.env)) return json({error: "unauthorized"}, 401, context.request);
  const state = await readState(context.env);
  state.online = state.last_seen !== null && Date.now() / 1000 - state.last_seen < 30;
  return json(state, 200, context.request);
}
