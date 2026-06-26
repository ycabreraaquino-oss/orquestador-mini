import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const RUTAS_PROTEGIDAS = ["/conectar", "/dashboard"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const protegida = RUTAS_PROTEGIDAS.some((r) => pathname.startsWith(r));
  if (!protegida) return NextResponse.next();

  const token =
    request.cookies.get("sb-access-token")?.value ||
    request.cookies.get(`sb-${process.env.NEXT_PUBLIC_SUPABASE_URL?.split("//")[1]?.split(".")[0]}-auth-token`)?.value;

  if (!token) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/conectar/:path*", "/dashboard/:path*"],
};
