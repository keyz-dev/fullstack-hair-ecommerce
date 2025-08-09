#!/bin/bash

echo "🚀 Starting build process..."

# Install Node.js dependencies
echo "📦 Installing Node.js dependencies..."
npm install

# Install Python dependencies
echo "🐍 Installing Python dependencies..."
pip install -r requirements.txt

# Create model directory
echo "📁 Setting up model directory..."
mkdir -p model_api_env

# Copy model files
echo "📋 Copying model files..."
cp -r src/scripts/* model_api_env/

# Set permissions
echo "🔐 Setting permissions..."
chmod +x model_api_env/predict.py

echo "✅ Build completed successfully!"
echo "📍 Model directory: $(pwd)/model_api_env"
echo "🐍 Python path: $(which python3)"
