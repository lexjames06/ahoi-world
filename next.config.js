/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { webpack, isServer }) => {
    const envs = {};

    Object.keys(process.env).forEach((key) => {
      if (key.startsWith("NEXT_PUBLIC_")) {
        envs[key] = process.env[key];
      }
    });

    if (!isServer) {
      config.plugins.push(new webpack.DefinePlugin({
        'process.env': JSON.stringify(envs),
      }));
    }

    return config;
  },
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
