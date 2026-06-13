import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root so a stray ~/package-lock.json doesn't get inferred
  // as the root (silences the multi-lockfile warning on every build).
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
