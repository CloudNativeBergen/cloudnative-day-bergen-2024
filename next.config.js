/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // disabled due to https://github.com/vercel/next.js/issues/35822
  publicRuntimeConfig: {
    cocLink: 'https://github.com/cncf/foundation/blob/main/code-of-conduct.md#community-code-of-conduct',
    dates: {
      cfpStart: '2024-05-20',
      cfpEnd: '2024-08-01',
      cfpNotify: '2024-08-20',
      program: '2024-09-01',
      conference: '2024-10-23',
    }
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      }
    ],
  },
}

module.exports = nextConfig
