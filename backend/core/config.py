"""
Configuración Central del Backend
===============================

Configuración centralizada aplicando principios SOLID
y mejores prácticas de seguridad y escalabilidad.

Autor: Equipo Grupo 4
Fecha: 2025
"""

import os
from typing import List
from pathlib import Path

class Settings:
    """
    Configuración centralizada de la aplicación.
    
    Implementa configuración robusta y escalable para producción.
    """
    
    # Configuración básica
    APP_NAME: str = "PredictScore-ML API"
    APP_VERSION: str = "2.0.0"
    DEBUG: bool = False
    
    # Configuración del servidor
    HOST: str = "127.0.0.1"
    PORT: int = 8000
    
    # Rutas del proyecto
    PROJECT_ROOT = Path(__file__).parent.parent.parent
    ML_MODELS_PATH = PROJECT_ROOT / "backend" / "ml" / "models"
    ML_DATA_PATH = PROJECT_ROOT / "backend" / "ml" / "data"
    
    # Configuración CORS
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://predictcore-ml.vercel.app"
    ]
    
    # Configuración ML
    DEFAULT_MODEL: str = "svr"
    FALLBACK_MODEL: str = "ridge"
    MAX_BATCH_SIZE: int = 1000
    
    # Features requeridas
    REQUIRED_FEATURES = [
        "study_hours", "attendance", "parental_involvement",
        "access_to_resources", "extracurricular_activities",
        "sleep_hours", "previous_scores", "motivation_level",
        "internet_access", "tutoring_sessions", "family_income",
        "teacher_quality", "school_type", "peer_influence",
        "physical_activity", "learning_disabilities",
        "parental_education_level", "distance_from_home", "gender"
    ]
    
    # Rutas actualizadas de modelos
    RIDGE_MODEL_PATH = ML_MODELS_PATH / "ridge_alpha_10.pkl"
    RIDGE_SCALER_PATH = ML_MODELS_PATH / "scaler.pkl"
    SVR_MODEL_PATH = ML_MODELS_PATH / "mejor_modelo_avanzado_svr.pkl"
    SVR_SCALER_PATH = ML_MODELS_PATH / "scaler_avanzado.pkl"
    
    # API settings actualizadas
    API_HOST = HOST
    API_PORT = PORT
    API_RELOAD = DEBUG
    
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
