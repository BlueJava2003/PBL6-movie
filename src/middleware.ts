import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const isPaymentRoute = (pathname: string) => {
  return pathname.startsWith('/payment');
};

const isTicketRoute = (pathname: string) => {
  return pathname.startsWith('/ticket');
};

const isHistory = (pathname: string) => {
  return pathname.startsWith('/history');
};

const isAuthRoute = (pathname: string) => {
  return pathname.startsWith('/auth');
};

export async function middleware(req: NextRequest) {
  const cookieStore = cookies();
  const accessToken = cookieStore.get('accessToken');
  const { pathname } = req.nextUrl;

  if (
    (isPaymentRoute(pathname) || isTicketRoute(pathname) || isHistory(pathname)) &&
    !accessToken
  ) {
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }

  if (isAuthRoute(pathname) && accessToken) {
    return NextResponse.redirect(new URL('/', req.url)); // Giữ nguyên trang hiện tại
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/payment', '/ticket', '/history', '/auth/:path*'],
};
