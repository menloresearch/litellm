# Multi-stage build for LiteLLM UI (Dashboard + Docs)
FROM node:18-alpine AS builder

# Install dependencies and build docs
WORKDIR /app/docs
COPY docs/package*.json ./
RUN npm ci --only=production
COPY docs/ ./
ENV DOCUSAURUS_BASE_URL=/docs/
RUN npm run build

# Install dependencies and build dashboard
WORKDIR /app/dashboard
COPY litellm-dashboard/package*.json ./
RUN npm ci --only=production
COPY litellm-dashboard/ ./
ENV UI_BASE_PATH=/dashboard
ARG API_URL=http://localhost:4000
ENV API_URL=$API_URL
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