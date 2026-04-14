"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export default function SetSessionPage() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get("access_token");
    const refreshToken = params.get("refresh_token");

    if (accessToken && refreshToken) {
      const supabase = createClient();

      // Timeout fallback — if setSession takes too long, force redirect
      const timeout = setTimeout(() => {
        window.location.href = "/dashboard";
      }, 5000);

      supabase.auth
        .setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        })
        .then(({ error }) => {
          if (!error) {
            clearTimeout(timeout);
            window.location.href = "/dashboard";
          } else {
            // Session might be expired — try refreshing
            return supabase.auth.refreshSession({
              refresh_token: refreshToken,
            });
          }
        })
        .then((result) => {
          if (result && !result.error) {
            clearTimeout(timeout);
            window.location.href = "/dashboard";
          } else if (result) {
            // Both setSession and refreshSession failed — redirect anyway
            clearTimeout(timeout);
            window.location.href = "/dashboard";
          }
        })
        .catch(() => {
          clearTimeout(timeout);
          window.location.href = "/dashboard";
        });
    } else {
      window.location.href = "/login";
    }
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#FDF6F2] to-[#F5DDD0]">
      <p className="text-[#D4603A] font-semibold">Signing you in...</p>
    </div>
  );
}
