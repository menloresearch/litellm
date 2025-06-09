# LiteLLM UI Development Setup Guide

## Issue Summary
The user was getting 404 errors on localhost:3000 because:

1. **Production Build Configuration**: The `next.config.mjs` had `output: 'export'` and `basePath: '/ui'` enabled for development
2. **Build Artifacts**: Static export files in the `out/` directory were interfering with the dev server
3. **Port Conflicts**: Multiple servers running on different ports
4. **Authentication Flow**: The app redirects to login when no token is present

## Root Cause Analysis

### 1. Next.js Configuration Issues
The `next.config.mjs` was configured for production export mode:
```javascript
// PROBLEMATIC CONFIG:
const nextConfig = {
    output: 'export',           // This creates static files, not a dev server
    basePath: '/ui',           // This makes the app expect URLs like /ui/
};
```

### 2. Authentication Redirect Logic
The app checks for authentication tokens and redirects unauthenticated users:
```javascript
// In src/app/page.tsx lines 147-160
const redirectToLogin = authLoading === false && token === null && invitation_id === null;

useEffect(() => {
  if (redirectToLogin) {
    window.location.href = (proxyBaseUrl || "") + "/fallback/login"
  }
}, [redirectToLogin])
```

## Solution

### Fixed Configuration
Updated `next.config.mjs` to only use production settings in production:
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
    // Remove output: 'export' for development
    // output: 'export',
    
    // Only use basePath in production, not development
    ...(process.env.NODE_ENV === 'production' && {
        basePath: process.env.UI_BASE_PATH || '/ui',
    }),
};
```

### Development Environment Setup

1. **Use the provided development script**:
   ```bash
   cd ui/litellm-dashboard
   ./start-dev.sh
   ```

2. **Or manually**:
   ```bash
   cd ui/litellm-dashboard
   
   # Set development environment
   export NODE_ENV=development
   
   # Clean up
   rm -rf out .next
   lsof -ti:3000 | xargs kill -9 2>/dev/null || true
   
   # Start development server
   npm run dev -- --port 3000
   ```

### Expected Behavior

1. **Without Authentication Cookie**: 
   - Page loads briefly showing loading screen
   - Automatically redirects to `http://localhost:4000/fallback/login`
   - This is CORRECT behavior

2. **With Authentication Cookie**:
   - Page loads and shows the full LiteLLM dashboard
   - Navigation works properly

### Development Workflow

1. **Start Backend (Uvicorn)**:
   ```bash
   # In your main project directory
   python -m uvicorn main:app --host 0.0.0.0 --port 4000
   ```

2. **Start Frontend (Next.js)**:
   ```bash
   cd ui/litellm-dashboard
   ./start-dev.sh
   ```

3. **Access the Application**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:4000
   - Login: http://localhost:4000/fallback/login

## Key Files Modified

1. **next.config.mjs**: Fixed development configuration
2. **.env.local**: Added development environment variables  
3. **start-dev.sh**: Created development startup script

## Architecture Notes

- **Frontend**: Next.js 14 with TypeScript (localhost:3000)
- **Backend**: FastAPI/Uvicorn (localhost:4000)
- **Authentication**: Cookie-based with JWT tokens
- **Hot Reload**: Enabled in development mode
- **Production**: Uses static export with `/ui` base path

## Troubleshooting

### Still Getting 404s?
1. Ensure `NODE_ENV=development` is set
2. Remove `out/` and `.next/` directories
3. Check that Next.js dev server started without errors
4. Verify no other process is using port 3000

### Redirect Loop?
1. Check that your backend is running on port 4000
2. Verify `/fallback/login` endpoint exists on your backend
3. Clear browser cookies for localhost

### Changes Not Reflecting?
1. Hot reload should work automatically
2. Hard refresh browser (Cmd+Shift+R / Ctrl+Shift+R)
3. Check browser console for JavaScript errors