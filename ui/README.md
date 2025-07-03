# LiteLLM UI - Frontend & Documentation

This directory contains both the **Dashboard UI** (Next.js) and **Documentation** (Docusaurus) served together via nginx in a Docker container.

## 📁 Project Structure

```
ui/
├── litellm-dashboard/     # Next.js dashboard application
├── docs/                  # Docusaurus documentation
├── Dockerfile            # Builds both apps and serves with nginx
├── nginx.conf            # Nginx configuration for routing
└── README.md             # This file
```

## 🚀 Quick Start

### Prerequisites
- Docker installed
- LiteLLM backend running on port 4000

### 1. Start Backend
```bash
# In project root - start the LiteLLM backend
litellm --config config.yaml
# Backend will run on http://localhost:4000
```

### 2. Build and Run Frontend Container
```bash
cd ui/

# Build the Docker image
docker build -t litellm-ui:latest .

# Run the container
docker run -d --name litellm-ui -p 80:80 litellm-ui:latest
```

### 3. Access Applications
- **Documentation**: http://localhost/docs
- **Dashboard**: http://localhost/dashboard  
- **Health Check**: http://localhost/health
- **Root**: http://localhost/ (redirects to docs)

## 🛠️ Development Workflow

### Option 1: Development Servers (Fastest Iteration)
```bash
# Terminal 1: Start backend
litellm --config config.yaml

# Terminal 2: Start docs dev server
cd ui/docs
npm install
npm run dev  # Runs on http://localhost:3000

# Terminal 3: Start dashboard dev server  
cd ui/litellm-dashboard
npm install
npm run dev  # Runs on http://localhost:3001
```

### Option 2: Docker Testing (Production-like)
```bash
# Use the Docker setup above for testing the production build
```

## 🏗️ Architecture

### Docker Multi-Stage Build
- **Stage 1** (`docs-builder`): Builds Docusaurus documentation independently
- **Stage 2** (`dashboard-builder`): Builds Next.js dashboard independently  
- **Stage 3** (`production`): Combines both outputs and serves with nginx

### Frontend Container (`localhost`)
- **Nginx** serves static files
- **Docs** built from Docusaurus → `/docs` route
- **Dashboard** built from Next.js → `/dashboard` route
- **Static files only** - no backend logic

### Backend Service (`localhost:4000`)  
- **LiteLLM API server** 
- Handles authentication, model calls, data storage
- Dashboard connects to this via API calls

### URL Structure
```
localhost/              → Redirects to /docs
localhost/docs          → Documentation (Docusaurus)
localhost/dashboard     → Dashboard UI (Next.js)
localhost/health        → Health check endpoint
```

## 🔧 Configuration

### Environment Variables (Build Time)
- `API_URL`: Backend API endpoint (default: `http://localhost:4000`), need to change in prod
- `UI_BASE_PATH`: Dashboard base path (default: `/dashboard`)

### Custom Builds
```bash
# Development build
docker build --build-arg API_URL=http://localhost:4000 -t litellm-ui:dev .

# Production build (example)
docker build --build-arg API_URL=https://api.yourdomain.com -t litellm-ui:prod .
```

## 🧪 Testing

### Health Checks
```bash
# Frontend health
curl http://localhost/health
# Expected: "healthy"

# Backend health (requires authentication)
curl http://localhost:4000/health  
# Expected: Auth error (proves backend is running)
```

### Route Testing
```bash
# Test redirects and routes
curl -I http://localhost/           # Should redirect to /docs
curl -I http://localhost/docs       # Should redirect to /docs/
curl -I http://localhost/docs/      # Should return 200 OK
curl -I http://localhost/dashboard  # Should redirect to /dashboard/
curl -I http://localhost/dashboard/ # Should return 200 OK
```

### Browser Testing
1. Visit http://localhost/docs - Documentation should load
2. Visit http://localhost/dashboard - Dashboard should load and connect to backend

## 🧹 Storage Management

### Clean Up After Testing
```bash
# Stop and remove container
docker stop litellm-ui && docker rm litellm-ui

# Remove image
docker rmi litellm-ui:latest

# Clean build cache
docker builder prune -f
```

### Monitor Storage Usage
```bash
# Check current Docker storage
docker system df

# Detailed breakdown
docker system df -v
```

### Nuclear Cleanup (if needed)
```bash
# Remove all unused Docker resources
docker system prune -a -f
```

## 🔄 Iteration Workflow

For efficient testing without storage bloat:

```bash
# 1. Clean up previous test
docker stop litellm-ui && docker rm litellm-ui
docker rmi litellm-ui:latest

# 2. Make your changes to code

# 3. Rebuild and test
docker build -t litellm-ui:latest .
docker run -d --name litellm-ui -p 80:80 litellm-ui:latest

# 4. Test your changes
curl http://localhost/health

# 5. Repeat from step 1
```

### Build Optimization

The multi-stage Dockerfile provides efficient caching:
- **Docs only changes**: Only `docs-builder` stage rebuilds
- **Dashboard only changes**: Only `dashboard-builder` stage rebuilds
- **Both unchanged**: Both stages use Docker cache (fast builds)

```bash
# Example: Change docs and rebuild (dashboard uses cache)
echo "# Update" >> docs/README.md
docker build -t litellm-ui:latest .  # Only docs-builder rebuilds

# Example: Change dashboard and rebuild (docs uses cache)  
git checkout docs/README.md
echo "// Update" >> litellm-dashboard/src/components/constants.tsx
docker build -t litellm-ui:latest .  # Only dashboard-builder rebuilds
```

## 🐛 Troubleshooting

### Dashboard Shows Onboarding/Login Issues
- Ensure backend is running on port 4000
- Check if `API_URL` is correctly set in Docker build
- Verify authentication setup in backend config

### Build Fails
- Ensure both `docs/` and `litellm-dashboard/` have `package.json`
- Check if dependencies install correctly
- Try building each app separately first
- **Multi-stage builds**: If one stage fails, check specific stage logs

### Routes Not Working
- Check nginx.conf for routing issues
- Verify both apps build successfully
- Check browser dev tools for 404s or redirects

### Storage Issues
- Use `docker system df` to monitor usage
- Clean up regularly with `docker builder prune -f`
- Use the iteration workflow above to prevent accumulation

## 📝 Production Deployment

For production deployment, you'll need to:

1. **Set proper API_URL**: Point to your production backend
2. **Configure CORS**: Ensure backend allows frontend domain
3. **HTTPS Setup**: Use proper SSL certificates
4. **Environment-specific builds**: Use build args for different environments

Example production build:
```bash
docker build --build-arg API_URL=https://api.yourdomain.com -t litellm-ui:prod .
```

## 🤝 Contributing

When making changes:
1. Test with development servers first (`npm run dev`)
2. Test with Docker build for production behavior
3. Verify both `/docs` and `/dashboard` routes work
4. Check storage cleanup after testing