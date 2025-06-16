/** @type {import('next').NextConfig} */
const UI_BASE_PATH = process.env.UI_BASE_PATH || ''

const nextConfig = {
    // output: 'export',
    basePath: UI_BASE_PATH,

    env: {
        API_URL: process.env.API_URL ?? '',
        UI_BASE_PATH: UI_BASE_PATH,
        COOKIE_DOMAIN: process.env.COOKIE_DOMAIN,  // may be undefined
    },
};

nextConfig.experimental = {
    missingSuspenseWithCSRBailout: false
}

export default nextConfig;
