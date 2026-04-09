"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #FDF6F2, #F5DDD0)",
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          margin: 0,
          padding: "20px",
        }}
      >
        <div style={{ textAlign: "center", maxWidth: 400 }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>😵‍💫</div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#333", marginBottom: 8 }}>
            Oops! Something went wrong
          </h1>
          <p style={{ fontSize: 15, color: "#888", marginBottom: 24, lineHeight: 1.5 }}>
            Don&apos;t worry, your data is safe. This is usually a temporary hiccup.
          </p>
          <button
            onClick={reset}
            style={{
              padding: "12px 28px",
              borderRadius: 12,
              border: "none",
              background: "#D4603A",
              color: "white",
              fontSize: 15,
              fontWeight: 700,
              cursor: "pointer",
              marginRight: 10,
            }}
          >
            Try Again
          </button>
          <a
            href="/expense-app.html"
            style={{
              padding: "12px 28px",
              borderRadius: 12,
              border: "2px solid #D4603A",
              background: "white",
              color: "#D4603A",
              fontSize: 15,
              fontWeight: 700,
              textDecoration: "none",
              display: "inline-block",
            }}
          >
            Open App Directly
          </a>
        </div>
      </body>
    </html>
  );
}
