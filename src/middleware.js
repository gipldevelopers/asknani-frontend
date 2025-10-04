import { NextResponse } from "next/server";

export function middleware(req) {
  const pathname = req.nextUrl.pathname;
  const tokenCookie = req.cookies.get("token")?.value;

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
      // ignore invalid token
    }
  }

  // 🔹 Handle root "/"
  if (pathname === "/") {
    if (role === "provider") {
      return NextResponse.redirect(new URL("/providers/dashboard", req.url));
    }
    if (role === "admin") {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    }
    return NextResponse.next();
  }

  // 🔹 Redirect /providers → /providers/dashboard for providers
  if (pathname === "/providers") {
    if (role === "provider") {
      return NextResponse.redirect(new URL("/providers/dashboard", req.url));
    }
  }

  // 🔹 Restrict /providers/* to providers only
  if (pathname.startsWith("/providers")) {
    if (!tokenCookie) return NextResponse.redirect(new URL("/login", req.url));

    if (role !== "provider") {
      return NextResponse.redirect(new URL("/", req.url));
    }
    return NextResponse.next();
  }

  // 🔹 Redirect /admin → /admin/dashboard for admins
  if (pathname === "/admin") {
    if (role === "admin") {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    }
  }

  // 🔹 Restrict /admin/* to admins only
  if (pathname.startsWith("/admin")) {
    if (!tokenCookie) return NextResponse.redirect(new URL("/login", req.url));

    if (role !== "admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }
    return NextResponse.next();
  }

  // 🔹 Allow public paths
  if (publicPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/providers/:path*", "/admin/:path*"],
};
