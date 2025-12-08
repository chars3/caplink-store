import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://caplink-store-311725783602.us-central1.run.app',
  },
};

export default nextConfig;
