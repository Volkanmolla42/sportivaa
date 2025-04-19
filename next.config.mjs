/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  // TypeScript configuration
  typescript: {
    // Allows builds to complete even with TypeScript errors
    // This is useful during development but consider removing for production
    ignoreBuildErrors: true,
  },

  // ESLint configuration
  eslint: {
    // Allows builds to complete even with ESLint errors
    // This is useful during development but consider removing for production
    ignoreDuringBuilds: true,
  },

  // Optimization settings
  // Uncomment if you need to optimize memory usage during builds
  // experimental: {
  //   // Enable if you want to use dynamicIO features like cacheTag and cacheLife
  //   // dynamicIO: true,
  // },

  // Add any other configuration options here
};

export default nextConfig;
