#!/bin/bash

echo "🚀 Starting build process..."

# Install Node.js dependencies
echo "📦 Installing Node.js dependencies..."
npm install

# Install Python dependencies
echo "🐍 Installing Python dependencies..."
pip install -r requirements.txt

# Create model directory in the EXACT path your code expects
echo "📁 Setting up model directory..."
mkdir -p /opt/render/project/src/model_api_env

# Copy model files to the correct location
echo "📋 Copying model files..."
cp -r src/scripts/* /opt/render/project/src/model_api_env/

# Set permissions
echo "🔐 Setting permissions..."
chmod +x /opt/render/project/src/model_api_env/predict.py

echo "✅ Build completed successfully!"
echo "📍 Model directory: /opt/render/project/src/model_api_env"
echo "🐍 Python path: $(which python3)"
