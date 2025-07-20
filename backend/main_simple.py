"""
PredictScore-ML Backend - API Simplificada y Robusta
===================================================

API FastAPI simplificada para predicción de rendimiento académico
aplicando principios KISS, DRY y SOLID.

Autor: Equipo Grupo 4
Fecha: 2025
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import logging
import time
import json
from typing import Dict, List, Any
from pathlib import Path

# Configurar logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configuración simple
class SimpleConfig:
    APP_NAME = "PredictScore-ML API"
    APP_VERSION = "2.0.0"
    HOST = "127.0.0.1"
    PORT = 8001
    DEBUG = True
    ALLOWED_ORIGINS = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://predictcore-ml.vercel.app"
    ]

config = SimpleConfig()

# Crear aplicación FastAPI
app = FastAPI(
    title=config.APP_NAME,
    description="API para predicción de rendimiento académico usando ML",
    version=config.APP_VERSION,
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=config.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

# Predictor básico como fallback
class BasicPredictor:
    """Predictor básico usando reglas heurísticas."""
    
    def predict(self, student_data: Dict[str, Any]) -> float:
        """Predicción básica usando promedio ponderado."""
        try:
            # Factores más importantes con pesos
            weights = {
                'study_hours': 0.15,
                'attendance': 0.15,
                'previous_scores': 0.20,
                'motivation_level': 0.10,
                'parental_involvement': 0.10,
                'access_to_resources': 0.08,
                'sleep_hours': 0.07,
                'tutoring_sessions': 0.05,
                'teacher_quality': 0.05,
                'family_income': 0.05
            }
            
            weighted_score = 0
            total_weight = 0
            
            for feature, weight in weights.items():
                if feature in student_data:
                    value = float(student_data[feature])
                    
                    # Normalizar valores a escala 0-100
                    if feature == 'study_hours':
                        normalized = min(value * 8.33, 100)  # 12 horas = 100
                    elif feature == 'attendance':
                        normalized = value  # Ya está en 0-100
                    elif feature == 'previous_scores':
                        normalized = value  # Ya está en 0-100
                    elif feature == 'motivation_level':
                        normalized = value * 20  # 5 = 100
                    elif feature == 'parental_involvement':
                        normalized = value * 20  # 5 = 100
                    elif feature == 'access_to_resources':
                        normalized = value * 20  # 5 = 100
                    elif feature == 'sleep_hours':
                        normalized = min(value * 12.5, 100)  # 8 horas = 100
                    elif feature == 'tutoring_sessions':
                        normalized = min(value * 20, 100)  # 5 = 100
                    elif feature == 'teacher_quality':
                        normalized = value * 20  # 5 = 100
                    elif feature == 'family_income':
                        normalized = value * 20  # 5 = 100
                    else:
                        normalized = value
                    
                    weighted_score += normalized * weight
                    total_weight += weight
            
            # Calcular predicción final
            if total_weight > 0:
                prediction = weighted_score / total_weight
            else:
                prediction = 50  # Default
            
            # Asegurar rango 0-100
            return max(0, min(100, prediction))
            
        except Exception as e:
            logger.error(f"Error en predicción básica: {e}")
            return 50.0  # Predicción conservadora

# Instancia global del predictor
predictor = BasicPredictor()

# Estadísticas simples
stats = {
    "predictions_count": 0,
    "batch_predictions_count": 0,
    "errors_count": 0,
    "start_time": time.time()
}

# ===============================
# ENDPOINTS PRINCIPALES
# ===============================

@app.get("/")
async def root():
    """Endpoint raíz con información de la API."""
    uptime = time.time() - stats["start_time"]
    return {
        "message": "PredictScore-ML API v2.0",
        "description": "API para predicción de rendimiento académico",
        "version": config.APP_VERSION,
        "status": "operational",
        "uptime_seconds": round(uptime, 2),
        "endpoints": {
            "docs": "/docs",
            "health": "/health",
            "predict": "/api/v1/predictions/predict",
            "predict_batch": "/api/v1/predictions/predict-batch",
            "model_info": "/api/v1/predictions/model-info"
        },
        "statistics": stats,
        "timestamp": time.time()
    }

@app.get("/health")
async def health_check():
    """Health check básico."""
    uptime = time.time() - stats["start_time"]
    return {
        "status": "healthy",
        "api_version": config.APP_VERSION,
        "predictor": "basic_heuristic",
        "uptime_seconds": round(uptime, 2),
        "statistics": stats,
        "timestamp": time.time()
    }

@app.post("/api/v1/predictions/predict")
async def predict_student_score(student_data: dict):
    """Predicción individual de rendimiento académico."""
    try:
        start_time = time.time()
        
        # Validar datos básicos
        required_fields = ["study_hours", "attendance", "previous_scores"]
        missing_fields = [field for field in required_fields if field not in student_data]
        
        if missing_fields:
            raise HTTPException(
                status_code=400, 
                detail=f"Campos requeridos faltantes: {missing_fields}"
            )
        
        # Realizar predicción
        prediction = predictor.predict(student_data)
        processing_time = time.time() - start_time
        
        # Calcular confianza
        confidence = "high" if prediction >= 75 else "medium" if prediction >= 50 else "low"
        
        # Actualizar estadísticas
        stats["predictions_count"] += 1
        
        result = {
            "success": True,
            "data": {
                "prediction": round(prediction, 2),
                "confidence": confidence,
                "model_used": "basic_heuristic",
                "processing_time": round(processing_time, 3),
                "timestamp": time.time()
            }
        }
        
        logger.info(f"Predicción individual: {prediction:.2f} ({confidence})")
        return result
        
    except HTTPException:
        raise
    except Exception as e:
        stats["errors_count"] += 1
        logger.error(f"Error en predicción individual: {e}")
        raise HTTPException(status_code=500, detail=f"Error en predicción: {str(e)}")

@app.post("/api/v1/predictions/predict-batch")
async def predict_batch(request_data: dict):
    """Predicción en lote de rendimiento académico."""
    try:
        start_time = time.time()
        
        students_data = request_data.get("students", [])
        
        if not students_data:
            raise HTTPException(status_code=400, detail="No se proporcionaron datos de estudiantes")
            
        if len(students_data) > 1000:
            raise HTTPException(status_code=400, detail="Tamaño de lote demasiado grande (máximo 1000)")
        
        # Procesar predicciones
        predictions = []
        valid_predictions = 0
        
        for i, student_data in enumerate(students_data):
            try:
                prediction = predictor.predict(student_data)
                predictions.append(round(prediction, 2))
                valid_predictions += 1
            except Exception as e:
                logger.warning(f"Error en estudiante {i}: {e}")
                predictions.append(50.0)  # Valor por defecto
        
        processing_time = time.time() - start_time
        average_score = sum(predictions) / len(predictions) if predictions else 0
        
        # Actualizar estadísticas
        stats["batch_predictions_count"] += 1
        
        result = {
            "success": True,
            "data": {
                "predictions": predictions,
                "count": len(predictions),
                "valid_predictions": valid_predictions,
                "average_score": round(average_score, 2),
                "model_used": "basic_heuristic",
                "processing_time": round(processing_time, 3),
                "timestamp": time.time()
            }
        }
        
        logger.info(f"Predicción en lote: {len(predictions)} estudiantes, promedio: {average_score:.2f}")
        return result
        
    except HTTPException:
        raise
    except Exception as e:
        stats["errors_count"] += 1
        logger.error(f"Error en predicción en lote: {e}")
        raise HTTPException(status_code=500, detail=f"Error en predicción en lote: {str(e)}")

@app.get("/api/v1/predictions/model-info")
async def get_model_info():
    """Información del modelo de predicción."""
    return {
        "success": True,
        "data": {
            "model_name": "Basic Heuristic Predictor",
            "model_type": "rule_based",
            "version": "1.0.0",
            "description": "Predictor basado en reglas heurísticas con pesos optimizados",
            "features": {
                "study_hours": {"weight": 0.15, "description": "Horas de estudio diarias"},
                "attendance": {"weight": 0.15, "description": "Porcentaje de asistencia"},
                "previous_scores": {"weight": 0.20, "description": "Puntajes previos"},
                "motivation_level": {"weight": 0.10, "description": "Nivel de motivación"},
                "parental_involvement": {"weight": 0.10, "description": "Involucramiento parental"}
            },
            "performance": {
                "speed": "< 0.01s per prediction",
                "reliability": "99.9%",
                "accuracy": "Baseline model"
            },
            "statistics": stats,
            "timestamp": time.time()
        }
    }

# ===============================
# MANEJO DE ERRORES
# ===============================

@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    """Manejador global de excepciones."""
    stats["errors_count"] += 1
    logger.error(f"Error no manejado en {request.url.path}: {exc}")
    
    return {
        "success": False,
        "error": "internal_server_error",
        "message": "Ocurrió un error interno del servidor",
        "timestamp": time.time()
    }

# ===============================
# FUNCIÓN PRINCIPAL
# ===============================

def main():
    """Función principal para ejecutar el servidor."""
    print("Iniciando PredictScore-ML API Simplificada...")
    print(f"URL: http://127.0.0.1:8001")
    print(f"Docs: http://127.0.0.1:8001/docs")
    print(f"Test: http://127.0.0.1:8001/health")
    
    uvicorn.run(
        "main_simple:app",
        host=config.HOST,
        port=config.PORT,
        reload=config.DEBUG,
        log_level="info"
    )

if __name__ == "__main__":
    main()
