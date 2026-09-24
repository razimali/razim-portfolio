import type { Metadata } from "next";

import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <main
      id="main-content"
      className="flex min-h-[100svh] flex-col items-center justify-center px-6 text-center"
    >
      <p className="mb-4 font-mono text-xs tracking-[0.35em] text-accent uppercase">
        404 — Route not found
      </p>
      <h1 className="font-display text-4xl font-semibold text-ink sm:text-5xl">
        This node doesn’t exist.
      </h1>
      <p className="mt-4 max-w-md text-muted">
        The page you’re looking for isn’t part of this portfolio.
      </p>
      <div className="mt-8">
        <Button href="/">BACK TO HOME</Button>
      </div>
    </main>
  );
}
