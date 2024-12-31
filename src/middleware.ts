import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";

const isPaymentRoute = (pathname: string) => pathname.startsWith("/payment");
const isTicketRoute = (pathname: string) => pathname.startsWith("/ticket");
const isHistory = (pathname: string) => pathname.startsWith("/history");
const isAuthRoute = (pathname: string) => pathname.startsWith("/auth");
const isAdminRoute = (pathname: string) => pathname.startsWith("/ad");

interface DecodedToken {
  role?: string;
  email?: string;
  // Add other properties from your JWT token here
}

export async function middleware(req: NextRequest) {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("accessToken");
  const { pathname } = req.nextUrl;

  if ((isPaymentRoute(pathname) || isTicketRoute(pathname) || isHistory(pathname)) && !accessToken) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  if (isAuthRoute(pathname) && accessToken) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (isAdminRoute(pathname)) {
    if (!accessToken) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    try {
      const decodedToken = jwtDecode(accessToken.value) as DecodedToken;

      if (
        decodedToken.email === "tphuongnam98@gmail.com" ||
        decodedToken.email === "trungnghia@gmail.com" ||
        decodedToken.email === "minhtriet@gmail.com"
      ) {
        return NextResponse.redirect(new URL("/error/unauthorized", req.url));
      }

      if (decodedToken.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/error/unauthorized", req.url));
      }
    } catch (error) {
      console.error("Error decoding JWT:", error);
      return NextResponse.redirect(new URL("/error/unauthorized", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/payment", "/ticket", "/history", "/auth/:path*", "/ad/:path*"],
};
