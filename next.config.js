/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
  env: {
    NEXT_PUBLIC_MODE: process.env.NEXT_PUBLIC_MODE,
  },
};

module.exports = nextConfig;
