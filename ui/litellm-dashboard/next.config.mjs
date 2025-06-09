/** @type {import('next').NextConfig} */
const nextConfig = {
    // Remove output: 'export' for development
    // output: 'export',
    
    // Only use basePath in production, not development
    ...(process.env.NODE_ENV === 'production' && {
        basePath: process.env.UI_BASE_PATH || '/ui',
    }),
};

nextConfig.experimental = {
    missingSuspenseWithCSRBailout: false
}

export default nextConfig;
