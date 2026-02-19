/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  experimental: {
    outputFileTracingIncludes: {
      '/': [
        './generated/**/*',
        './node_modules/bcryptjs/**/*',
        './node_modules/jsonwebtoken/**/*',
        './node_modules/nodemailer/**/*',
        './node_modules/geoip-lite/**/*',
        './node_modules/ua-parser-js/**/*',
        './node_modules/qrcode.react/**/*',
        './node_modules/framer-motion/**/*',
        './node_modules/recharts/**/*',
        './node_modules/@dnd-kit/**/*',
        './node_modules/react-icons/**/*',
        './node_modules/@prisma/**/*',
        './node_modules/better-sqlite3/**/*',
      ],
    },
  },
}

module.exports = nextConfig
