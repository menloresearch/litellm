#!/bin/bash

# Check if nvm is not installed
if ! command -v nvm &> /dev/null; then
  # Install nvm
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash

  # Source nvm script in the current session
  export NVM_DIR="$HOME/.nvm"
  [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
fi

# Use nvm to set the required Node.js version
if ! nvm use v18.17.0; then
  echo "Error: Failed to switch to Node.js v18.17.0. Deployment aborted."
  exit 1
fi

# print contents of ui_colors.json
echo "Contents of ui_colors.json:"
cat ui_colors.json

if ! npm install; then
  echo "npm install failed"
  exit 1
fi

# build UI
if ! npm run build; then
  echo "Build failed. Deployment aborted."
  exit 1
fi

echo "Build successful. Copying files..."

# echo current dir
echo
pwd

# Specify the destination directory
destination_dir="../../litellm/proxy/_experimental/out"

# Remove existing files in the destination directory
rm -rf "$destination_dir"/*

# Copy the contents of the output directory to the specified destination
cp -r ./out/* "$destination_dir"

echo "Deployment completed."
