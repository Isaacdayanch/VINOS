import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Por default Next solo deja subir 1MB por foto en los formularios —
      // muy poco para una foto tomada directo del celular. Se sube a 10MB.
      bodySizeLimit: "10mb",
    },
  },
  images: {
    // Local images next/image may optimize. The cream bottle photos come from a
    // route with a query string (?src=…), which Next only optimizes when listed here.
    localPatterns: [
      { pathname: "/catalogo/**" },
      { pathname: "/catalogo-publico/foto-crema" },
      { pathname: "/uploads/**" },
    ],
    // Resized copies are kept for 31 days, across deployments.
    minimumCacheTTL: 2678400,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
