import {authorized, json, preflight, readState, writeState} from "../_state.js";

export async function onRequest(context) {
  const cors = preflight(context.request);
  if (cors) return cors;
  if (!authorized(context.request, context.env)) return json({error: "unauthorized"}, 401, context.request);
  if (context.request.method !== "POST") return json({error: "method_not_allowed"}, 405, context.request);
  const report = await context.request.json().catch(() => null);
  if (!report || typeof report.mode !== "string") return json({error: "invalid_report"}, 400, context.request);
  const state = await readState(context.env);
  const now = Math.floor(Date.now() / 1000);
  state.last_seen = now;
  state.online = true;
  state.mode = report.display_mode === "eyes" ? "eyes" : state.mode;
  state.uptime = Number.isFinite(report.uptime) && report.uptime >= 0 ? report.uptime : state.uptime;
  if (Number.isSafeInteger(report.ack_seq) && report.ack_seq > state.ack_seq) {
    state.ack_seq = Math.min(report.ack_seq, state.seq);
    if (state.ack_seq >= state.seq) state.desired_mode = state.mode;
  }
  await writeState(context.env, state);
  return json(state, 200, context.request);
}
