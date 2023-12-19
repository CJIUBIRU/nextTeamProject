/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
    images: {
        remotePatterns: [
          {
            protocol: "https",
            hostname: "drive.google.com",
            port: "",
            pathname: "/**",
          },
        ],
      },
}

module.exports = nextConfig
