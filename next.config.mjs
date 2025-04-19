/** @type {import('next').NextConfig} */
const nextConfig = {
  // TypeScript ve ESLint hatalarını daha hoşgörülü hale getir
  typescript: {
    // TS hatalarında build'i durdurmaz, sadece uyarı verir
    ignoreBuildErrors: true,
  },
  eslint: {
    // ESLint hatalarında build'i durdurmaz, sadece uyarı verir
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
