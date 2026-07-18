import { api } from "@/lib/api";

const SESSION_KEY = "engemix_sid";
// Dedupe window for identical events (StrictMode double-invoke, fast re-renders, etc.)
const DEDUPE_MS = 2500;
const recent = new Map(); // key: `${type}|${page}` → timestamp

function getSessionId() {
  let s = sessionStorage.getItem(SESSION_KEY);
  if (!s) {
    s =
      Math.random().toString(36).slice(2) +
      Date.now().toString(36) +
      Math.random().toString(36).slice(2);
    sessionStorage.setItem(SESSION_KEY, s);
  }
  return s;
}

export function track(type, meta = {}) {
  const page = window.location.pathname;
  const key = `${type}|${page}`;
  const now = Date.now();
  const last = recent.get(key) || 0;
  if (now - last < DEDUPE_MS) return; // skip duplicate
  recent.set(key, now);
  api
    .post("/track/event", {
      type,
      page,
      session_id: getSessionId(),
      meta,
    })
    .catch(() => {});
}

export function trackPageview() {
  track("pageview");
}

// Heartbeat every 45s while tab visible → mantém sessão "online"
let heartbeatTimer = null;
export function startHeartbeat() {
  if (heartbeatTimer) return;
  const beat = () => {
    if (document.visibilityState === "visible") track("heartbeat");
  };
  beat();
  heartbeatTimer = setInterval(beat, 45000);
}
