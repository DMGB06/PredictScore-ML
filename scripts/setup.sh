#!/bin/bash

# Development setup script for Student Predictor
echo "🚀 Setting up Student Predictor Development Environment..."

# Navigate to project root
cd "$(dirname "$0")/.."

echo "📦 Installing Backend Dependencies..."
cd backend
pip install -r requirements.txt

echo "📦 Installing Frontend Dependencies..."
cd ../frontend
npm install

echo "🔧 Setting up environment files..."
cd ../backend
if [ ! -f .env ]; then
    cp .env.example .env
    echo "⚠️  Please update .env file with your API keys"
fi

echo "✅ Setup complete!"
echo ""
echo "To start development:"
echo "Backend:  cd backend && python main.py"
echo "Frontend: cd frontend && npm run dev"
