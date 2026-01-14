/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.vietqr.io",
      },
    ],
  },
  // Suppress async API warnings in development (these are false positives from React DevTools)
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
  // Logging configuration
  logging: {
    fetches: {
      fullUrl: false,
    },
  },
  // Don't fail build on ESLint errors (warnings only)
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Don't fail build on TypeScript errors (warnings only)
  typescript: {
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
