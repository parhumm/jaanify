import { NextRequest, NextResponse } from "next/server";

/**
 * Next.js Middleware — Auth Guard
 *
 * Protects /dashboard and /tasks/* routes.
 * Checks for the presence of a session cookie (access_token).
 * Redirects unauthenticated users to /login?redirect={originalPath}.
 */

const PUBLIC_PATHS = ["/", "/login", "/onboarding"];

const PUBLIC_PREFIXES = [
  "/api/",
  "/_next/",
  "/login/",       // login callback routes
  "/onboarding/",
];

const STATIC_EXTENSIONS = [
  ".ico",
  ".svg",
  ".png",
  ".jpg",
  ".jpeg",
  ".gif",
  ".webp",
  ".woff",
  ".woff2",
  ".ttf",
  ".css",
  ".js",
  ".map",
  ".json",
  ".webmanifest",
];

function isPublicPath(pathname: string): boolean {
  // Exact public paths
  if (PUBLIC_PATHS.includes(pathname)) return true;

  // Public prefixes
  if (PUBLIC_PREFIXES.some((prefix) => pathname.startsWith(prefix))) return true;

  // Static assets
  if (STATIC_EXTENSIONS.some((ext) => pathname.endsWith(ext))) return true;

  return false;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes through
  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  // Check for session cookie (matches backend ACCESS_COOKIE_NAME)
  const sessionCookie = request.cookies.get("jaanify_access");

  if (!sessionCookie?.value) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * The middleware function itself handles finer-grained filtering.
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
