const path = require('path')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Environment variables
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://garbet-backend-production.up.railway.app/api',
  },
  
  // Security Headers
 async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self';",
              // 1. Allow API connections to your backend
              "connect-src 'self' https://garbet-backend-production.up.railway.app;",
              // 2. Allow scripts and 'eval'
              "script-src 'self' 'unsafe-eval' 'unsafe-inline';",
              // 3. Allow styles from Google Fonts
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;",
              // 4. Allow the actual font files
              "font-src 'self' https://fonts.gstatic.com;",
              // 5. Allow images
              "img-src 'self' blob: data:;",
              "object-src 'none';",
              "upgrade-insecure-requests;"
            ].join(' ')
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          }
        ],
      },
    ]
  },

  // Webpack configuration
  webpack: (config, { isServer }) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname),
    }
    
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      }
    }
    
    return config
  },
  
  images: {
    domains: ['lh3.googleusercontent.com'],
    formats: ['image/avif', 'image/webp'],
    unoptimized: true,
  },
  
  compress: true,
  poweredByHeader: false,
  
  experimental: {
    optimizeCss: false, 
  },
}

module.exports = nextConfig