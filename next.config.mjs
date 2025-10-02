/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {},
  images: {
    remotePatterns: [],
  },
  typescript: {
    // Disable incremental compilation in production builds
    tsconfigPath: process.env.NODE_ENV === 'production' ? './tsconfig.production.json' : './tsconfig.json',
  },
};

export default nextConfig;
