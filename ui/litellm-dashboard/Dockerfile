# Stage 1: build UI
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
ARG API_URL
ENV API_URL=$API_URL
ARG COOKIE_DOMAIN
ENV COOKIE_DOMAIN=$COOKIE_DOMAIN
RUN npm run build

# Stage 2: Use Nginx for serving
FROM nginx:alpine AS production

# Copy Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy static files from previous stage
COPY --from=builder /app/out /usr/share/nginx/html

EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]
