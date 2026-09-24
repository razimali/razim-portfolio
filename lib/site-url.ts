const LOCAL_FALLBACK = "http://localhost:3000";

function parseHttpUrl(value: string | undefined | null): string | null {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed) return null;

  try {
    const url = new URL(trimmed);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    return url.toString().replace(/\/$/, "");
  } catch {
    return null;
  }
}

/**
 * Absolute site origin for metadataBase, OG URLs, sitemap, and robots.
 * Never returns an empty/invalid string (guards `new URL()` during build).
 *
 * Order:
 * 1. NEXT_PUBLIC_SITE_URL (if set and valid)
 * 2. Vercel production/preview host (https)
 * 3. localhost (local development)
 */
export function getSiteUrl(): string {
  const explicit = parseHttpUrl(process.env.NEXT_PUBLIC_SITE_URL);
  if (explicit) return explicit;

  const vercelHost = (
    process.env.VERCEL_PROJECT_PRODUCTION_URL ??
    process.env.VERCEL_URL ??
    ""
  )
    .trim()
    .replace(/^https?:\/\//i, "");

  if (vercelHost) {
    const vercelUrl = parseHttpUrl(`https://${vercelHost}`);
    if (vercelUrl) return vercelUrl;
  }

  return LOCAL_FALLBACK;
}
