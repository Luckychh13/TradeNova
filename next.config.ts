import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ['192.168.29.45'],
  turbopack: {
    root: process.cwd(),
  },
  images:{
    remotePatterns: [
      {
        protocol:"https",
        hostname:"assets.coingecko.com"
      },{
        protocol:"https",
        hostname:"coin-images.coingecko.com"
      }
    ]
  },
};

export default nextConfig;
