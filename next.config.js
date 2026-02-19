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
  // Native modülleri webpack bundle'ına ALMA, runtime'da node_modules'dan yükle
  // better-sqlite3 .node binary'si bundle'lanamaz
  experimental: {
    serverComponentsExternalPackages: [
      'better-sqlite3',
      '@prisma/client',
      '@prisma/adapter-better-sqlite3',
      '@prisma/driver-adapter-utils',
      'bcryptjs',
      'jsonwebtoken',
      'nodemailer',
      'geoip-lite',
      'ua-parser-js',
      'sharp',
    ],
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
