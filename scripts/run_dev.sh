#!/bin/bash

# Development runner script
echo "🚀 Starting Student Predictor in Development Mode..."

# Function to run backend
run_backend() {
    echo "🐍 Starting FastAPI Backend..."
    cd backend
    python main.py &
    BACKEND_PID=$!
    echo "Backend PID: $BACKEND_PID"
    cd ..
}

# Function to run frontend
run_frontend() {
    echo "⚛️  Starting Next.js Frontend..."
    cd frontend
    npm run dev &
    FRONTEND_PID=$!
    echo "Frontend PID: $FRONTEND_PID"
    cd ..
}

# Start both services
run_backend
sleep 3
run_frontend

echo ""
echo "✅ Both services started!"
echo "🌐 Frontend: http://localhost:3000"
echo "🔗 Backend API: http://localhost:8000"
echo "📖 API Docs: http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for Ctrl+C
trap 'kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; echo "🛑 Services stopped"; exit' INT
wait
