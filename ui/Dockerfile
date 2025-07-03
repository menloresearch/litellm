# Stage 1: Build docs independently
FROM node:20-alpine AS docs-builder
WORKDIR /app
COPY docs/package*.json ./
RUN npm ci --only=production
COPY docs/ ./
RUN npm run build

# Stage 2: Build dashboard independently
FROM node:20-alpine AS dashboard-builder
WORKDIR /app
COPY litellm-dashboard/package*.json ./
RUN npm ci --only=production
COPY litellm-dashboard/ ./
ENV UI_BASE_PATH=/dashboard
ARG API_URL=http://localhost:4000
ENV API_URL=$API_URL
RUN npm run build

# Stage 3: Production with nginx
FROM nginx:alpine

# Copy built static files from separate builders
COPY --from=docs-builder /app/build /usr/share/nginx/html/docs
COPY --from=dashboard-builder /app/out /usr/share/nginx/html/dashboard

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]