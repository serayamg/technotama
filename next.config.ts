import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  serverExternalPackages: ["better-sqlite3"],
  allowedDevOrigins: ['192.168.1.15', '192.168.1.15:3000', 'localhost:3000'],
};

export default nextConfig;
