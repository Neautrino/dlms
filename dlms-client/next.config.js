/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'olive-hidden-lungfish-156.mypinata.cloud',
      'gateway.pinata.cloud',
      'ipfs.io',
      'cloudflare-ipfs.com',
      'dweb.link'
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  }  ,
  eslint: {
    ignoreDuringBuilds: true,
  },  
}

module.exports = nextConfig 