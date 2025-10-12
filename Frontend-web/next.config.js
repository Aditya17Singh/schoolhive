/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    // ✅ This allows build to continue even if there are lint errors
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
