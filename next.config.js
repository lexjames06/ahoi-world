/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/posts',
        permanent: true,
      },
    ];
  },
  sassOptions: {
    logger: {
      warn: function (message) {
          console.warn(message)
      },
      debug: function (message) {
          console.log(message)
      }
    }
  },
  images: {
    domains: ['firebasestorage.googleapis.com', 'localhost'],
  },
}

module.exports = nextConfig
