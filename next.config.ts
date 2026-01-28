import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'require-corp',
          },
        ],
      },
    ];

  },
  async redirects() {
    return [
      {
        source: '/image-converter',
        destination: '/image-pdf-compressor',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
