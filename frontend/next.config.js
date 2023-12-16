/** @type {import('next').NextConfig} */

module.exports = {
  async rewrites() {
      return [
        {
          source: '/api/:path*',
          destination: 'https://sample-zeaqndbcnq-oa.a.run.app/:path*',
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
