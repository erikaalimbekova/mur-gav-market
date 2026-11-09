import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Сайт работает с живыми данными и сессией — Cache Components выключен
  cacheComponents: false,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
