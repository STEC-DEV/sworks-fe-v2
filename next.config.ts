import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  reactStrictMode: false,
  images: {
    remotePatterns: [
      // 프로덕션 도메인 (HTTPS)
      {
        protocol: "https",
        hostname: "s-agent.co.kr",
        pathname: "/Images/**",
      },
      // 개발 환경용 (필요시 유지)
      {
        protocol: "http",
        hostname: "123.2.156.148",
        port: "5249",
        pathname: "/Images/**",
      },
      {
        protocol: "http",
        hostname: "123.2.156.148",
        port: "5245",
        pathname: "/Images/**",
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true, // 빌드 시 ESLint 무시
  },
  typescript: {
    ignoreBuildErrors: true, // TypeScript 에러도 무시하려면
  },
};

export default nextConfig;
