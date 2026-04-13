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
        // Return an HTML page that redirects to the deep link via JavaScript
        // Chrome Custom Tab blocks server-side 302 redirects to custom schemes
        // but allows client-side JavaScript navigation
        const deepLink =
          `in.kharchasaathi.app://auth/callback` +
          `?access_token=${encodeURIComponent(data.session.access_token)}` +
          `&refresh_token=${encodeURIComponent(data.session.refresh_token)}`;

        const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Signing in...</title></head>
<body>
<p>Signing you in, please wait...</p>
<script>window.location.href = ${JSON.stringify(deepLink)};</script>
</body>
</html>`;

        return new NextResponse(html, {
          headers: { "Content-Type": "text/html" },
        });
      }
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth`);
}
