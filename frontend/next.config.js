/** @type {import('next').NextConfig} */

module.exports = {
  async rewrites() {
      return [
        {
          source: '/api/:path*',
          destination: 'https://api.example.com/:path*',
        },
      ]
    },
};

const nextConfig = {
  experimental: {
    forceSwcTransforms: true,
  },
};

module.exports = nextConfig;
