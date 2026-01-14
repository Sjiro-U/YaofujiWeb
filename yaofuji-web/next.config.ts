import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // GitHub Pagesのサブパスに対応
  basePath: '/YaofujiWeb',
  assetPrefix: '/YaofujiWeb',
};

export default nextConfig;
