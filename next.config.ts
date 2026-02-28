import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "apod.nasa.gov",
      },
      {
        protocol: "https",
        hostname: "mars.nasa.gov",
      },
      {
        protocol: "https",
        hostname: "mars.jpl.nasa.gov",
      },
      {
        protocol: "https",
        hostname: "images-assets.nasa.gov",
      },
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
      },
      {
        protocol: "https",
        hostname: "www.youtube.com",
      },
      {
        protocol: "https",
        hostname: "img.youtube.com",
      },
      {
        protocol: "http",
        hostname: "img.youtube.com",
      },
      {
        protocol: "https",
        hostname: "science.nasa.gov",
      },
    ],
  },
};

export default nextConfig;
