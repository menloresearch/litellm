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
# You will need to set FRONTEND_URL=http://localhost/dashboard as well
docker compose up db -d
LITELLM_MODE=DEV litellm --config config.yaml
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

## 🧪 Testing

### Route Testing
```bash
# Test redirects and routes
curl -I http://localhost/           # Should redirect to /docs
curl -I http://localhost/docs       # Should redirect to /docs/
curl -I http://localhost/docs/      # Should return 200 OK
curl -I http://localhost/dashboard  # Should redirect to /dashboard/
curl -I http://localhost/dashboard/ # Should return 200 OK
```
