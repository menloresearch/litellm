# Multi-stage build for LiteLLM UI (Dashboard + Docs)
FROM node:18-alpine AS builder

# Install dependencies and build docs
WORKDIR /app/docs
COPY docs/package*.json ./
RUN npm ci --only=production
COPY docs/ ./
RUN npm run build

# Install dependencies and build dashboard
WORKDIR /app/dashboard
COPY litellm-dashboard/package*.json ./
RUN npm ci --only=production
COPY litellm-dashboard/ ./
RUN npm run build

# Production stage with nginx
FROM nginx:alpine

# Copy built static files
COPY --from=builder /app/docs/build /usr/share/nginx/html/docs
COPY --from=builder /app/dashboard/out /usr/share/nginx/html/dashboard

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]