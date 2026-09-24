"use client";

import { Button } from "@/components/ui/Button";

export default function SegmentError({ reset }: { reset: () => void }) {
  return (
    <main
      id="main-content"
      className="flex min-h-[100svh] flex-col items-center justify-center px-6 text-center"
    >
      <p className="mb-4 font-mono text-xs tracking-[0.35em] text-accent uppercase">
        Runtime error
      </p>
      <h1 className="font-display text-4xl font-semibold text-ink">
        Something went wrong.
      </h1>
      <p className="mt-4 max-w-md text-muted">
        An unexpected error occurred while rendering this section.
      </p>
      <div className="mt-8">
        <Button onClick={() => reset()}>TRY AGAIN</Button>
      </div>
    </main>
  );
}
