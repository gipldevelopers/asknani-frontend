import { NextResponse } from "next/server";

export function middleware(req) {
  const pathname = req.nextUrl.pathname;
  const tokenCookie = req.cookies.get("token")?.value;

  // Public paths accessible to everyone
  const publicPaths = ["/login", "/signup", "/forgot-password"];

  let role = null;

  if (tokenCookie) {
    try {
      const base64Url = tokenCookie.split(".")[1];
      const payload = JSON.parse(
        Buffer.from(base64Url, "base64").toString("utf8")
      );
      role = payload.role;
    } catch (err) {
      // Invalid token → ignore
    }
  }

  // Root "/" page exclusive for non-providers (parents)
  if (pathname === "/") {
    if (role === "provider") {
      return NextResponse.redirect(new URL("/providers/dashboard", req.url));
    }
    return NextResponse.next();
  }

  // Prevent parents from accessing /providers/*
  if (pathname.startsWith("/providers")) {
    if (!tokenCookie) return NextResponse.redirect(new URL("/login", req.url));

    if (role !== "provider") {
      return NextResponse.redirect(new URL("/", req.url));
    }
    return NextResponse.next();
  }

  // Public paths accessible to everyone
  if (publicPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Everything else allowed
  return NextResponse.next();
}

export const config = {
  matcher: ["/providers/:path*", "/"],
};
