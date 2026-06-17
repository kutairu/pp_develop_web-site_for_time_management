/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Эта строчка превращает Next.js в статику
  images: {
    unoptimized: true, // Обязательно для GitHub Pages
  }
};

module.exports = nextConfig;
