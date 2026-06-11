import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "www.arnebia.ru",
        protocol: "https",
      },
    ],
  },
};

export default nextConfig;
