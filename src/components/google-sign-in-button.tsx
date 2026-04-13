"use client";

import { useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";

function isCapacitor(): boolean {
  return typeof window !== "undefined" && "Capacitor" in window;
}

function getCapacitorPlugin(name: string) {
  // Access native plugin directly through the Capacitor bridge
  // This works even when JS is loaded from a remote URL
  const cap = (window as unknown as Record<string, unknown>).Capacitor as
    | { Plugins?: Record<string, Record<string, (...args: unknown[]) => Promise<unknown>>> }
    | undefined;
  return cap?.Plugins?.[name];
}

export function GoogleSignInButton({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const deepLinkSetup = useRef(false);

  useEffect(() => {
    if (!isCapacitor() || deepLinkSetup.current) return;
    deepLinkSetup.current = true;

    // Set up deep link listener as fallback for Chrome Custom Tabs flow
    import("@capacitor/app").then(({ App }) => {
      App.addListener("appUrlOpen", async ({ url }) => {
        if (!url.includes("auth/callback")) return;

        const { Browser } = await import("@capacitor/browser");
        await Browser.close();

        const urlObj = new URL(url);
        const accessToken = urlObj.searchParams.get("access_token");
        const refreshToken = urlObj.searchParams.get("refresh_token");

        if (accessToken && refreshToken) {
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
    });
  }, []);

  const handleSignIn = async () => {
    const supabase = createClient();

    if (isCapacitor()) {
      // Try native Google Sign-In first (no browser opens)
      const plugin = getCapacitorPlugin("SocialLogin");

      if (plugin) {
        try {
          await plugin.initialize({
            google: {
              webClientId:
                "70670976387-jegs52h23874eue79q0r0a5oe75t56qt.apps.googleusercontent.com",
            },
          });

          const result = (await plugin.login({
            provider: "google",
            options: { scopes: ["email", "profile"] },
          })) as {
            result?: {
              responseType?: string;
              idToken?: string;
            };
          };

          if (result?.result?.idToken) {
            const { error, data } = await supabase.auth.signInWithIdToken({
              provider: "google",
              token: result.result.idToken,
            });

            if (!error && data?.session) {
              await new Promise((r) => setTimeout(r, 200));
              window.location.href = "/dashboard";
              return;
            }
          }
        } catch {
          // Native sign-in failed, fall through to Chrome Custom Tabs
        }
      }

      // Fallback: Chrome Custom Tabs with deep link callback
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
      // Web: standard OAuth redirect
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
