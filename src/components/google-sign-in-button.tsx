"use client";

import { createClient } from "@/lib/supabase/client";

function isCapacitor(): boolean {
  return typeof window !== "undefined" && "Capacitor" in window;
}

export function GoogleSignInButton({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const handleSignIn = async () => {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
        skipBrowserRedirect: true,
      },
    });

    if (!data?.url || error) return;

    if (isCapacitor()) {
      // Use Chrome Custom Tabs via Capacitor Browser plugin
      // Google blocks OAuth in embedded WebViews (disallowed_useragent)
      const { Browser } = await import("@capacitor/browser");
      await Browser.open({ url: data.url, windowName: "_self" });
    } else {
      window.location.href = data.url;
    }
  };

  return (
    <button type="button" onClick={handleSignIn} className={className}>
      {children}
    </button>
  );
}
