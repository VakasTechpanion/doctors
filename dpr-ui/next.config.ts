import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Use `output: 'standalone'` in Linux CI/Docker (Windows dev symlinks may fail).
  transpilePackages: [],
};

export default nextConfig;
