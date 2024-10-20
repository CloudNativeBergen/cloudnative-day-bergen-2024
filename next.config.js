/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // disabled due to https://github.com/vercel/next.js/issues/35822
  publicRuntimeConfig: {
    event: {
      name: 'CloudNative Day Bergen 2024',
      location: 'Kvarteret, Bergen, Norway',
    },
    contact: {
      email: 'hans@cloudnativebergen.dev',
    },
    registrationLink:
      'https://app.checkin.no/event/73442/cloudnative-day-bergen-2024',
    cocLink:
      'https://github.com/cncf/foundation/blob/main/code-of-conduct.md#community-code-of-conduct',
    cfpOpen: false,
    dates: {
      cfpStart: '2024-05-20',
      cfpEnd: '2024-08-09',
      cfpNotify: '2024-08-20',
      program: '2024-09-01',
      conference: '2024-10-30',
    },
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
      },
      {
        protocol: 'https',
        hostname: 'media.licdn.com',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/agenda',
        destination: '/program',
        permanent: true,
      },
    ]
  }
}

module.exports = nextConfig
