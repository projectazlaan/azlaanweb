/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "unpkg.com" },
    ],
  },
  turbopack: {
    rules: {},
  },
  serverExternalPackages: ['better-sqlite3'],
  optimizeFonts: false,
};

export default nextConfig;
