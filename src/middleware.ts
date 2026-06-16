import { NextResponse, type NextRequest } from "next/server";

const ADMIN_PATH = "/admin";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next();

  // Security headers (supplement next.config)
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "SAMEORIGIN");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  // CSRF protection for API routes — validate origin on mutations
  if (
    request.method !== "GET" &&
    request.method !== "HEAD" &&
    pathname.startsWith("/api/")
  ) {
    const origin = request.headers.get("origin");
    const host = request.headers.get("host");
    if (origin && host) {
      const originHost = new URL(origin).host;
      if (originHost !== host) {
        return NextResponse.json(
          { success: false, error: { code: "CSRF", message: "Invalid origin" } },
          { status: 403 }
        );
      }
    }
  }

  // Admin route protection — redirect to login if no session cookie
  if (pathname.startsWith(ADMIN_PATH) && !pathname.startsWith(`${ADMIN_PATH}/login`)) {
    const sessionToken =
      request.cookies.get("authjs.session-token")?.value ??
      request.cookies.get("__Secure-authjs.session-token")?.value;

    if (!sessionToken) {
      return NextResponse.redirect(new URL(`${ADMIN_PATH}/login`, request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
