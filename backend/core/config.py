"""
Configuration Settings
======================

Application configuration and environment variables

Author: Equipo Grupo 4
Date: 2025
"""

import os
from pathlib import Path

class Settings:
    """Application settings"""
    
    # Project paths
    PROJECT_ROOT = Path(__file__).parent.parent.parent
    ML_PROJECT_PATH = PROJECT_ROOT / "Machine-Learning"
    MODELS_PATH = ML_PROJECT_PATH / "modelos"
    DATA_PATH = ML_PROJECT_PATH / "datos"
    
    # API settings
    API_HOST = "0.0.0.0"
    API_PORT = 8000
    API_RELOAD = True
    
    # Database settings
    DATABASE_URL = "sqlite:///./student_predictor.db"
    
    # ML Model settings
    DEFAULT_MODEL = "ridge"
    RIDGE_MODEL_PATH = MODELS_PATH / "ridge_alpha_10.pkl"
    RIDGE_SCALER_PATH = MODELS_PATH / "scaler.pkl"
    SVR_MODEL_PATH = MODELS_PATH / "mejor_modelo_avanzado_svr.pkl"
    SVR_SCALER_PATH = MODELS_PATH / "scaler_avanzado.pkl"
    
    # External APIs
    PLOTLY_API_KEY = os.getenv("PLOTLY_API_KEY", "")
    PLOTLY_USERNAME = os.getenv("PLOTLY_USERNAME", "")
    HUGGINGFACE_API_KEY = os.getenv("HUGGINGFACE_API_KEY", "")
    
    # File upload settings
    MAX_FILE_SIZE_MB = 10
    ALLOWED_FILE_TYPES = [".csv"]
    UPLOAD_DIR = "uploads"
    
    # Session settings
    SESSION_TIMEOUT_HOURS = 24
    
    # Security
    SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-here")
    
    # CORS settings
    ALLOWED_ORIGINS = [
        "http://localhost:3000",  # Next.js development
        "http://127.0.0.1:3000",
    ]

# Global settings instance
settings = Settings()
