"""
FastAPI Main Application
========================

Main entry point for the Student Performance Prediction API

Author: Equipo Grupo 4
Date: 2025
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import uvicorn

# Import routes (will be created)
# from routes import predictions, csv_upload, dashboard, external_apis

app = FastAPI(
    title="Student Performance Prediction API",
    description="API for predicting student performance and academic analytics",
    version="1.0.0",
    contact={
        "name": "Equipo Grupo 4",
        "email": "grupo4@universidad.edu"
    }
)

# CORS middleware for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Next.js default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check endpoint
@app.get("/")
async def root():
    return {"message": "Student Performance Prediction API", "status": "running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "student-predictor-api"}

# Include routers (to be uncommented as routes are created)
# app.include_router(predictions.router, prefix="/api/predictions", tags=["predictions"])
# app.include_router(csv_upload.router, prefix="/api/csv", tags=["csv"])
# app.include_router(dashboard.router, prefix="/api/dashboard", tags=["dashboard"])
# app.include_router(external_apis.router, prefix="/api/external", tags=["external"])

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
