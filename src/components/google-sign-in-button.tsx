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
      const listener = App.addListener("appUrlOpen", async ({ url }) => {
        if (!url.includes("auth/callback")) return;

        // Close the Chrome Custom Tab
        const { Browser } = await import("@capacitor/browser");
        await Browser.close();

        // Extract tokens from the deep link URL
        const urlObj = new URL(url);
        const accessToken = urlObj.searchParams.get("access_token");
        const refreshToken = urlObj.searchParams.get("refresh_token");

        if (accessToken && refreshToken) {
          // Set the session in the WebView's Supabase client
          const supabase = createClient();
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

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

    if (isCapacitor()) {
      // Use Chrome Custom Tabs with deep link callback
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?from=app`,
          skipBrowserRedirect: true,
        },
      });

      if (data?.url && !error) {
        const { Browser } = await import("@capacitor/browser");
        await Browser.open({ url: data.url });
      }
    } else {
      // Web: use standard OAuth redirect
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
        },
      });

      if (data?.url && !error) {
        window.location.href = data.url;
      }
    }
  };

  return (
    <button type="button" onClick={handleSignIn} className={className}>
      {children}
    </button>
  );
}
