/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Эта строка говорит Next.js, что сайт лежит в подпапке
  basePath: '/pp_develop_web-site_for_time_management',
};

module.exports = nextConfig; // (или export default nextConfig;)