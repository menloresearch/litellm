/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    basePath: process.env.UI_BASE_PATH || '/ui',

    env: {
        API_URL: process.env.API_URL,
    },
};

nextConfig.experimental = {
    missingSuspenseWithCSRBailout: false
}

export default nextConfig;
