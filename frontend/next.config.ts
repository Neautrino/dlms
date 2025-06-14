import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [
      'olive-hidden-lungfish-156.mypinata.cloud',
      'gateway.pinata.cloud',
      'ipfs.io',
      'cloudflare-ipfs.com',
      'dweb.link'
    ],
  },
};

export default nextConfig;
