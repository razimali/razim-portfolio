import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    // Keep Turbopack rooted at the project (avoids scanning the home directory
    // when the repo lives under OneDrive/Documents with spaces in the path).
    root: process.cwd(),
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
