/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'www.vaticannews.va',
      },
      {
        protocol: 'https',
        hostname: 'www.vatican.va',
      }
    ],
  },
}

module.exports = nextConfig 