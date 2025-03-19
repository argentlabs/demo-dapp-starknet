import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  images: {
    domains: ["starknet.id"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "starknet.id",
        pathname: "/api/identicons/**",
      },
    ],
    formats: ["image/webp", "image/avif"],
  },
}

export default nextConfig
