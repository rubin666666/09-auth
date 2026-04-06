import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { parse } from "cookie";
import { checkSession } from "@/lib/api/serverApi";

const privateRoutes = ["/profile", "/notes"];
const authRoutes = ["/sign-in", "/sign-up"];

function applyAuthCookies(response: NextResponse, setCookieHeader?: string | string[]) {
  if (!setCookieHeader) {
    return;
  }

  const cookiesToApply = Array.isArray(setCookieHeader)
    ? setCookieHeader
    : [setCookieHeader];

  for (const cookieStr of cookiesToApply) {
    const parsed = parse(cookieStr);
    const options = {
      expires: parsed.Expires ? new Date(parsed.Expires) : undefined,
      path: parsed.Path,
      maxAge: Number(parsed["Max-Age"]),
    };

    if (parsed.accessToken) {
      response.cookies.set("accessToken", parsed.accessToken, options);
    }

    if (parsed.refreshToken) {
      response.cookies.set("refreshToken", parsed.refreshToken, options);
    }
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  let hasAccessToken = Boolean(request.cookies.get("accessToken")?.value);
  const hasRefreshToken = Boolean(request.cookies.get("refreshToken")?.value);
  let refreshedSetCookie: string | string[] | undefined;

  if (!hasAccessToken && hasRefreshToken) {
    try {
      const sessionResponse = await checkSession(request.cookies.toString());
      refreshedSetCookie = sessionResponse.headers["set-cookie"];
      hasAccessToken = sessionResponse.data.success;
    } catch {
      hasAccessToken = false;
    }
  }

  const isAuthenticated = hasAccessToken;

  const isPrivateRoute = privateRoutes.some((route) =>
    pathname.startsWith(route),
  );
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  if (!isAuthenticated && isPrivateRoute) {
    const response = NextResponse.redirect(new URL("/sign-in", request.url));
    applyAuthCookies(response, refreshedSetCookie);
    return response;
  }

  if (isAuthenticated && isAuthRoute) {
    const response = NextResponse.redirect(new URL("/profile", request.url));
    applyAuthCookies(response, refreshedSetCookie);
    return response;
  }

  const response = NextResponse.next();
  applyAuthCookies(response, refreshedSetCookie);
  return response;
}

export const config = {
  matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
};
