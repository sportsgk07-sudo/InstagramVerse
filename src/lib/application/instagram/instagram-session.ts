const DEFAULT_USER_AGENT =
  process.env.INSTAGRAM_USER_AGENT ??
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";

const DEFAULT_APP_ID = process.env.INSTAGRAM_APP_ID ?? "936619743392459";

export interface InstagramSession {
  csrfToken: string;
  cookieHeader: string;
  appId: string;
  userAgent: string;
}

let cachedSession: { session: InstagramSession; expiresAt: number } | null = null;

const SESSION_TTL_MS = 10 * 60 * 1000;

export function getInstagramUserAgent(): string {
  return DEFAULT_USER_AGENT;
}

export function getInstagramAppId(): string {
  return DEFAULT_APP_ID;
}

export async function getInstagramSession(forceRefresh = false): Promise<InstagramSession> {
  if (!forceRefresh && cachedSession && cachedSession.expiresAt > Date.now()) {
    return cachedSession.session;
  }

  const response = await fetch("https://www.instagram.com/", {
    headers: {
      "User-Agent": DEFAULT_USER_AGENT,
      Accept: "text/html,application/xhtml+xml",
      "Accept-Language": "en-US,en;q=0.9",
    },
    next: { revalidate: 0 },
  });

  if (!response.ok) {
    throw new Error(`Failed to initialize Instagram session (${response.status})`);
  }

  const setCookies = typeof response.headers.getSetCookie === "function"
    ? response.headers.getSetCookie()
    : [];

  const csrfToken =
    setCookies
      .find((cookie) => cookie.startsWith("csrftoken="))
      ?.split(";")[0]
      ?.replace("csrftoken=", "") ?? "";

  if (!csrfToken) {
    throw new Error("Failed to obtain Instagram CSRF token");
  }

  const cookieHeader = setCookies.map((cookie) => cookie.split(";")[0]).join("; ");

  const session: InstagramSession = {
    csrfToken,
    cookieHeader,
    appId: DEFAULT_APP_ID,
    userAgent: DEFAULT_USER_AGENT,
  };

  cachedSession = {
    session,
    expiresAt: Date.now() + SESSION_TTL_MS,
  };

  return session;
}

export function buildInstagramHeaders(
  session: InstagramSession,
  options?: { referer?: string; contentType?: string }
): HeadersInit {
  return {
    "User-Agent": session.userAgent,
    "X-IG-App-ID": session.appId,
    "X-CSRFToken": session.csrfToken,
    Cookie: session.cookieHeader,
    Referer: options?.referer ?? "https://www.instagram.com/",
    "Sec-Fetch-Dest": "empty",
    "Sec-Fetch-Mode": "cors",
    "Sec-Fetch-Site": "same-origin",
    ...(options?.contentType ? { "Content-Type": options.contentType } : {}),
  };
}

export function invalidateInstagramSession(): void {
  cachedSession = null;
}
