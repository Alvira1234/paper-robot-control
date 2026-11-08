import {authorized, json, preflight, readState} from "../_state.js";

export async function onRequest(context) {
  const cors = preflight(context.request);
  if (cors) return cors;
  if (!authorized(context.request, context.env)) return json({error: "unauthorized"}, 401, context.request);
  return json(await readState(context.env), 200, context.request);
}
