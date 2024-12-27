import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Get token from Authorization header or cookies
  const authHeader = request.headers.get("authorization");
  const token =
    authHeader?.replace("Bearer ", "") || request.cookies.get("token")?.value;

  const isAuthPage = request.nextUrl.pathname === "/";
  const isSignupPage = request.nextUrl.pathname === "/signup";
  const isPublicRoute = isAuthPage || isSignupPage;

  const isProtectedRoute =
    !isPublicRoute &&
    !request.nextUrl.pathname.startsWith("/_next") &&
    !request.nextUrl.pathname.startsWith("/api");

  // If trying to access auth page while logged in, redirect to dashboard
  if (isAuthPage && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // If trying to access protected pages without token, redirect to login
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // For all other cases, continue with the request
  const response = NextResponse.next();

  // If we have a token, add it to the headers for API requests
  if (token) {
    response.headers.set("Authorization", `Bearer ${token}`);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
