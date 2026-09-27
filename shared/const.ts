export const COOKIE_NAME = "app_session_id";
export const ONE_YEAR_MS = 1000 * 60 * 60 * 24 * 365;
export const AXIOS_TIMEOUT_MS = 30_000;
export const UNAUTHED_ERR_MSG = 'Please login (10001)';
export const NOT_ADMIN_ERR_MSG = 'You do not have required permission (10002)';

// One-time nonce cookie that binds an OAuth login to the browser that started
// it. The `__Host-` prefix forces the cookie host-only (Secure, Path=/, no
// Domain), so a sibling *.manus.space site cannot plant a matching value in a
// victim's browser.
export const OAUTH_STATE_COOKIE = "__Host-oauth_state";

// `state` carries the callback redirect URI (used at token exchange) plus the
// CSRF nonce. Defined here so the client encoder and server decoder never drift.
export type OAuthState = { redirectUri: string; nonce?: string };

export const encodeOAuthState = (state: OAuthState): string =>
  btoa(JSON.stringify(state));

export const decodeOAuthState = (state: string): OAuthState => {
  let decoded: string;
  try {
    decoded = atob(state);
  } catch {
    return { redirectUri: "" };
  }
  try {
    const parsed = JSON.parse(decoded);
    if (parsed && typeof parsed.redirectUri === "string") return parsed;
  } catch {
    // Legacy links: `state` was a bare base64(redirectUri) with no nonce.
  }
  return { redirectUri: decoded };
};

export const WORKSHOP_SESSIONS = [
  {
    id: "decouvrir",
    title: "Découvrir",
    dateLabel: "Mer. 16 sept. · 18h30",
    shortDate: "16 sept. 2026",
    startAt: Date.UTC(2026, 8, 16, 16, 30),
    duration: "2 h",
    level: "débutants",
    capacity: 8,
    color: "sun",
  },
  {
    id: "fabriquer",
    title: "Fabriquer",
    dateLabel: "Mer. 23 sept. · 18h30",
    shortDate: "23 sept. 2026",
    startAt: Date.UTC(2026, 8, 23, 16, 30),
    duration: "3 h",
    level: "pratique",
    capacity: 6,
    color: "peach",
  },
  {
    id: "transmettre",
    title: "Transmettre",
    dateLabel: "Mer. 30 sept. · 18h30",
    shortDate: "30 sept. 2026",
    startAt: Date.UTC(2026, 8, 30, 16, 30),
    duration: "2 h",
    level: "ouvert à tous",
    capacity: 10,
    color: "mint",
  },
] as const;

export type WorkshopSession = (typeof WORKSHOP_SESSIONS)[number];
