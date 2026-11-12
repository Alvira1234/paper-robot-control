import {json, preflight} from "./_state.js";

// Diagnostic only: reports whether configuration is visible to Functions.
// It never returns the token itself, just lengths and whitespace flags.
export async function onRequest(context) {
  const cors = preflight(context.request);
  if (cors) return cors;
  const expected = context.env.CONTROL_TOKEN;
  const actual = context.request.headers.get("Authorization") || "";
  const sent = actual.startsWith("Bearer ") ? actual.slice(7) : "";
  return json({
    token_configured: typeof expected === "string" && expected.length > 0,
    token_length: typeof expected === "string" ? expected.length : 0,
    token_needs_trim: typeof expected === "string" && expected !== expected.trim(),
    kv_bound: Boolean(context.env.PAPER_ROBOT_STATE),
    auth_present: actual.length > 0,
    auth_length: sent.length,
    auth_matches: typeof expected === "string" && sent.trim() === expected.trim() && expected.length > 0
  }, 200, context.request);
}
