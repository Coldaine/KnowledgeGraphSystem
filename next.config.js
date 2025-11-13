/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,

  // Enable experimental features
  experimental: {
    // App directory for Next.js 13+
    appDir: false,
  },

  // Environment variables available on client
  env: {
    NEXT_PUBLIC_APP_NAME: 'Knowledge Graph System',
    NEXT_PUBLIC_APP_VERSION: '0.1.0',
  },

  // Webpack configuration
  webpack: (config, { isServer }) => {
    // Handle markdown files
    config.module.rules.push({
      test: /\.md$/,
      use: 'raw-loader',
    });

    // Ignore node-specific modules on client
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        path: false,
        crypto: false,
      };
    }

    return config;
  },

  // Image optimization
  images: {
    domains: ['localhost', 'github.com'],
    formats: ['image/avif', 'image/webp'],
  },

  // Headers for CORS and security
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;