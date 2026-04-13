"use client";

import { useEffect } from "react";
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
  useEffect(() => {
    if (!isCapacitor()) return;

    let cleanup: (() => void) | undefined;

    import("@capacitor/app").then(({ App }) => {
      // Listen for the deep link callback after OAuth
      const listener = App.addListener("appUrlOpen", async ({ url }) => {
        if (!url.includes("auth/callback")) return;

        // Close the Chrome Custom Tab
        const { Browser } = await import("@capacitor/browser");
        await Browser.close();

        // Extract the auth code from the URL
        const urlObj = new URL(url);
        const code = urlObj.searchParams.get("code");

        if (code) {
          // Exchange the code in the WebView context so cookies are set here
          const supabase = createClient();
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (!error) {
            window.location.href = "/dashboard";
          }
        }
      });

      cleanup = () => {
        listener.then((l) => l.remove());
      };
    });

    return () => {
      cleanup?.();
    };
  }, []);

  const handleSignIn = async () => {
    const supabase = createClient();

    const redirectUrl = isCapacitor()
      ? "in.kharchasaathi.app://auth/callback"
      : `${window.location.origin}/auth/callback?next=/dashboard`;

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: redirectUrl,
        skipBrowserRedirect: true,
      },
    });

    if (!data?.url || error) return;

    if (isCapacitor()) {
      const { Browser } = await import("@capacitor/browser");
      await Browser.open({ url: data.url });
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
