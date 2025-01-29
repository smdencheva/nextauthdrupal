import type { NextConfig } from "next";

const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 's.gravatar.com',
                port: '',
                pathname: '/avatar/**',
                // The search parameter is optional and can be omitted unless specific query parameters are needed
            },
        ],
        // Optionally, set domains if using legacy Next.js versions
        // domains: ['s.gravatar.com'],
    },
};

export default nextConfig;
