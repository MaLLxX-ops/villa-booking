import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const authError = requestUrl.searchParams.get("error");
  const errorDescription = requestUrl.searchParams.get("error_description");
  const next = requestUrl.searchParams.get("next") || "/account";

  // If provider sent an explicit error
  if (authError) {
    console.error("❌ [OAuth Callback] Provider error:", authError, errorDescription);
    const errorType =
      authError === "identity_already_exists" ||
      errorDescription?.toLowerCase().includes("already") ||
      errorDescription?.toLowerCase().includes("linking")
        ? "identity_conflict"
        : "oauth_failed";

    return NextResponse.redirect(
      new URL(`/?auth=login&error=${errorType}`, requestUrl.origin)
    );
  }

  const supabaseUrl =
    process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey =
    process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (code && supabaseUrl && supabaseAnonKey) {
    try {
      console.log("➡️ [OAuth Callback] Processing code exchange. Next destination:", next);
      const cookieStore = await cookies();
      const redirectTarget = new URL(
        next.startsWith("/") ? next : `/${next}`,
        requestUrl.origin
      );
      const response = NextResponse.redirect(redirectTarget);

      const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, {
                ...options,
                path: "/",
                sameSite: "lax",
                secure: process.env.NODE_ENV === "production",
              });
              response.cookies.set(name, value, {
                ...options,
                path: "/",
                sameSite: "lax",
                secure: process.env.NODE_ENV === "production",
              });
            });
          },
        },
      });

      const { data, error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) {
        console.log(
          "✅ [OAuth Callback] Session exchanged successfully for:",
          data.user?.email || data.user?.id
        );
        return response;
      }

      console.error("❌ [OAuth Callback] exchangeCodeForSession failed:", {
        message: error.message,
        status: error.status,
        name: error.name,
        code: (error as { code?: string }).code,
      });

      const errorType =
        error.message?.toLowerCase().includes("already") ||
        error.message?.toLowerCase().includes("linking")
          ? "identity_conflict"
          : "oauth_failed";

      return NextResponse.redirect(
        new URL(`/?auth=login&error=${errorType}`, requestUrl.origin)
      );
    } catch (err) {
      console.error("❌ [OAuth Callback] Exception:", err);
    }
  }

  return NextResponse.redirect(
    new URL("/?auth=login&error=oauth_failed", requestUrl.origin)
  );
}