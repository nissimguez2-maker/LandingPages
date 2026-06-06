/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Marketing copy is apostrophe/quote heavy; we rely on TypeScript (not ESLint)
  // to gate the Netlify build so legitimate copy never blocks a deploy.
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;
