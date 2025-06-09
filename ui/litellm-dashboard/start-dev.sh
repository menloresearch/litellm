#!/bin/bash

# LiteLLM UI Development Setup Script
# This script sets up the frontend for development with hot reload

echo "🚅 Setting up LiteLLM UI for development..."

# Set development environment
export NODE_ENV=development

# Kill any existing process on port 3000
echo "📋 Cleaning up existing processes..."
lsof -ti:3000 | xargs kill -9 2>/dev/null || true

# Remove any production build artifacts that might interfere
echo "🧹 Cleaning up build artifacts..."
rm -rf out .next

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

echo "🚀 Starting development server..."
echo "   - Frontend: http://localhost:3000"
echo "   - Backend proxy should be running on http://localhost:4000"
echo ""
echo "Press Ctrl+C to stop the server"

# Start the development server
npm run dev -- --port 3000