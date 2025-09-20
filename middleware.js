// middleware.js
import { NextResponse } from "next/server";
import { jwtVerify } from "jose"; // lightweight JWT verifier

// Secret must match your Laravel JWT secret
const JWT_SECRET = new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET);

// Paths accessible by specific roles
const roleRoutes = {
  parent: ["/parent"],
  provider: ["/provider"],
  admin: ["/admin"],
};

// Utility to verify JWT
async function verifyJWT(token) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload; // decoded token payload
  } catch (e) {
    return null;
  }
}

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  // public paths that don’t need auth
  if (
    pathname.startsWith("/auth") || // login/register/forgot-password pages
    pathname.startsWith("/_next") || // next.js internals
    pathname.startsWith("/api") || // your API routes
    pathname === "/" // homepage
  ) {
    return NextResponse.next();
  }

  // Get JWT from cookies
  const token = req.cookies.get("token")?.value;

  if (!token) {
    // redirect to login if not authenticated
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  // Verify and decode
  const user = await verifyJWT(token);
  if (!user) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  // Check role access
  const role = user.role; // must exist in your token payload
  const allowedPaths = roleRoutes[role] || [];

  const isAllowed = allowedPaths.some((prefix) => pathname.startsWith(prefix));

  if (!isAllowed) {
    // redirect to their correct dashboard
    return NextResponse.redirect(new URL(`/${role}`, req.url));
  }

  // All good
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)", // protect everything except public assets
  ],
};
