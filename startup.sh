#!/bin/bash

# Knowledge Graph System - Startup Script
# This script sets up and runs the Knowledge Graph application

echo "================================================"
echo "   Knowledge Graph System - Startup Script"
echo "================================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm."
    exit 1
fi

echo "✅ npm version: $(npm --version)"

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo ""
    echo "📦 Installing dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install dependencies"
        exit 1
    fi
    echo "✅ Dependencies installed successfully"
else
    echo "✅ Dependencies already installed"
fi

# Check for .env.local
if [ ! -f ".env.local" ]; then
    echo ""
    echo "⚠️  No .env.local file found"
    echo "Creating .env.local from .env.example..."
    cp .env.example .env.local
    echo ""
    echo "📝 Please edit .env.local and add your Gemini API key:"
    echo "   NEXT_PUBLIC_GEMINI_API_KEY=your_key_here"
    echo ""
    echo "Get your API key from: https://makersuite.google.com/app/apikey"
    echo ""
    read -p "Press Enter once you've added your API key..."
fi

# Build the application
echo ""
echo "🔨 Building the application..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi
echo "✅ Build completed successfully"

# Start the application
echo ""
echo "🚀 Starting Knowledge Graph System..."
echo ""
echo "================================================"
echo "   Application will be available at:"
echo "   http://localhost:3000"
echo "================================================"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

npm run start