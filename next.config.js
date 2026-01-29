/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      { source: "/", destination: "/", permanent: true },
      { source: "//:path*", destination: "/:path*", permanent: true },
    ];
  },
};

module.exports = nextConfig;
