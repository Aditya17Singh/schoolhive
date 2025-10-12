/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // 🚫 Don't block builds due to ESLint errors
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
