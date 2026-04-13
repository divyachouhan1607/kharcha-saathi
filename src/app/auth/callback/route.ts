import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";
  const fromApp = searchParams.get("from") === "app";

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data?.session) {
      if (fromApp) {
        // Redirect to deep link so the Capacitor WebView can set the session
        const params = new URLSearchParams({
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
        });
        return NextResponse.redirect(
          `in.kharchasaathi.app://auth/callback?${params.toString()}`
        );
      }
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth`);
}
