import type { NextConfig } from "next";
import { env } from "./src/shared/config/env/env.config";

const nextConfig: NextConfig = {
  devIndicators: false,
  allowedDevOrigins: ["192.168.1.145"],
  rewrites: async () => [
    {
      source: "/api/:path*",
      destination: `${env.apiOrigin}/:path*`,
    },
  ],
};

export default nextConfig;
