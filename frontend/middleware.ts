import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getAuthToken } from "./lib/auth";

// Define protected routes
const protectedRoutes = ["/dashboard"];

// Define public routes
const publicRoutes = ["/login", "/signup", "/"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = getAuthToken();

  // Check if the current route is protected
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));

  // Redirect to login if accessing protected route without token
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Redirect to dashboard if accessing public routes with valid token
  if (isPublicRoute && token && pathname !== "/") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
