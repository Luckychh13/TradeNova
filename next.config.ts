import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
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
  allowedDevOrigins: ['192.168.29.45'],
};

export default nextConfig;
