import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'www.toolboxed.online',
          },
        ],
        destination: 'https://toolboxed.online/:path*',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
