import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Limite padrão é 1mb; documentos (PDF/foto) escaneados passam disso fácil.
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
};

export default nextConfig;
