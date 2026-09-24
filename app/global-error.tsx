"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/Button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.error(error);
    }
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          background: "#050507",
          color: "#f1f5f9",
          fontFamily: "system-ui, sans-serif",
          padding: "2rem",
          textAlign: "center",
        }}
      >
        <div>
          <p
            style={{
              color: "#38bdf8",
              letterSpacing: "0.3em",
              fontSize: "0.75rem",
              marginBottom: "1rem",
            }}
          >
            SYSTEM ERROR
          </p>
          <h1 style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>
            Something went wrong.
          </h1>
          <p style={{ color: "#a1aab8", marginBottom: "2rem" }}>
            An unexpected error occurred while rendering this page.
          </p>
          <Button onClick={() => reset()}>TRY AGAIN</Button>
        </div>
      </body>
    </html>
  );
}
