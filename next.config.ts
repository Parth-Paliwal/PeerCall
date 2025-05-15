import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['img.clerk.com'], // Add the domain hosting your images
  },
};

module.exports = nextConfig;
