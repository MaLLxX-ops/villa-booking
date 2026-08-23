import { createServerClient } from "@supabase/ssr";
import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "./i18n/routing";

const handleI18n = createMiddleware(routing);

export default async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Allow auth callback routes directly
  if (pathname.startsWith("/auth/")) {
    return NextResponse.next();
  }

  // Fallback: If an OAuth code lands on any general route (e.g. /, /en, /id), forward to /auth/callback
  if (request.nextUrl.searchParams.has("code")) {
    const code = request.nextUrl.searchParams.get("code")!;
    const next = request.nextUrl.searchParams.get("next") || "/account";
    const callbackUrl = new URL(
      `/auth/callback?code=${encodeURIComponent(code)}&next=${encodeURIComponent(next)}`,
      request.url
    );
    return NextResponse.redirect(callbackUrl);
  }

  // Handle public i18n routes (all non-admin routes)
  if (!pathname.startsWith("/admin")) {
    return handleI18n(request);
  }

  // Allow unauthenticated access to admin login page
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  // All other /admin routes (/admin, /admin/dashboard, /admin/villas, etc.) MUST be protected
  const supabaseUrl =
    process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey =
    process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  const response = NextResponse.next();
  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (cookiesToSet) => {
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user?.id) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  // Query admin status
  const { data: admin } = await supabase
    .from("admin_users")
    .select("id")
    .eq("id", authData.user.id)
    .eq("role", "admin")
    .maybeSingle();

  if (!admin) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/",
    "/(id|en|fr|zh|ja|ko)/:path*",
    "/admin",
    "/admin/:path*",
    "/((?!api|_next|_vercel|.*\\..*).*)",
  ],
};
