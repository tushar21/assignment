/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    RAZORPAY_KEY: process.env.DATABASE_URL,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "http://localhost:3000",
        pathname: "**",
      },
    ],
  },
};

export default nextConfig;
