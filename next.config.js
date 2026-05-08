/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "unpkg.com" },
      { protocol: "https", hostname: "azlaan.com.bd" },
    ],
  },
  turbopack: {
    rules: {},
  },
  serverExternalPackages: ['better-sqlite3'],
};

export default nextConfig;
