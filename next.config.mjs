/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Simplifica a hospedagem no Cloudflare Pages e permite fotos externas.
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "**.supabase.co" },
    ],
  },
};

export default nextConfig;
