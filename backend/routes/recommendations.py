"""
Rutas de Recomendaciones con IA
==============================

Endpoints para generar recomendaciones académicas personalizadas
utilizando servicios de IA.

Principios aplicados:
- RESTful API design
- Async/await para alta concurrencia
- Manejo robusto de errores
- Documentación automática con FastAPI
- Validación con Pydantic

Autor: Equipo Grupo 4 - Tech Lead: Napanga Ruiz Jhonatan Jesus
Fecha: 2025
"""

import logging
from typing import Dict, Any
from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import JSONResponse
from ..models.schemas import StudentInput, RecommendationResponse
from ..services.openai_service import openai_service
from ..services.ml_service import ml_service

# Configurar logging
logger = logging.getLogger(__name__)

# Router para recomendaciones
router = APIRouter(
    prefix="/api/v1/recommendations",
    tags=["recommendations"],
    responses={
        404: {"description": "Not found"},
        500: {"description": "Internal server error"}
    }
)

@router.post(
    "/generate",
    response_model=RecommendationResponse,
    summary="Generar Recomendaciones Académicas",
    description="""
    Genera recomendaciones académicas personalizadas utilizando IA.
    
    El endpoint:
    1. Realiza una predicción del rendimiento académico
    2. Genera recomendaciones personalizadas usando OpenAI GPT
    3. Proporciona consejos específicos basados en el perfil del estudiante
    
    **Características:**
    - Recomendaciones específicas para el sistema educativo peruano
    - Análisis de factores de riesgo y fortalezas
    - Sugerencias prácticas y accionables
    - Fallback automático si la IA no está disponible
    """,
    response_description="Recomendaciones académicas personalizadas"
)
async def generate_recommendations(student_data: StudentInput) -> RecommendationResponse:
    """
    Genera recomendaciones académicas basadas en predicción ML + IA.
    
    Args:
        student_data: Datos del estudiante para análisis (incluye prediction y analysis)
        
    Returns:
        RecommendationResponse: Recomendaciones personalizadas
        
    Raises:
        HTTPException: Si hay errores en el procesamiento
    """
    try:
        logger.info("Iniciando generación de recomendaciones")
        
        # 1. Usar datos de predicción ya calculados (principio KISS - no recalcular)
        prediction_score = student_data.prediction  # Usar predicción existente
        student_dict = student_data.student_data
        analysis_data = student_data.analysis
        
        # Convertir predicción en escala 20 a otras escalas si es necesario
        prediction_100 = prediction_score * 5  # De escala 20 a 100
        grade_letter = (
            "AD" if prediction_score >= 18 else
            "A" if prediction_score >= 14 else
            "B" if prediction_score >= 10 else "C"
        )
        
        logger.info(f"Usando predicción existente: {prediction_score}/20 = {grade_letter}")
        
        # 2. Generar recomendaciones con IA
        ai_recommendations = openai_service.generate_recommendations(
            prediction_score=prediction_score,
            student_data=student_dict,
            prediction_confidence=analysis_data.get("confidence", "High")
        )
        
        # 3. Construir respuesta completa usando datos correctos
        response_data = {
            "success": True,
            "prediction": {
                "exam_score": prediction_score,  # En escala 20
                "grade_letter": grade_letter,     # Basado en la predicción correcta
                "grade_20": prediction_score,     # Misma que exam_score
                "grade_100": round(prediction_100, 2),  # Conversión a escala 100
                "confidence": analysis_data.get("confidence", "High")
            },
            "recommendations": {
                "suggestions": ai_recommendations["recommendations"],
                "urgency_level": ai_recommendations["level"],
                "source": ai_recommendations["source"],
                "ai_confidence": ai_recommendations.get("confidence"),
                "tokens_used": ai_recommendations.get("tokens_used")
            },
            "analysis": {
                "risk_factors": _analyze_risk_factors(student_dict, prediction_score),
                "strengths": _analyze_strengths(student_dict, prediction_score),
                "improvement_areas": _identify_improvement_areas(student_dict, prediction_score)
            }
        }
        
        logger.info(f"Recomendaciones generadas exitosamente. Score: {prediction_score}")
        return RecommendationResponse(**response_data)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error generando recomendaciones: {e}")
        raise HTTPException(
            status_code=500,
            detail="Error interno del servidor al generar recomendaciones"
        )

@router.get(
    "/health",
    summary="Estado del Servicio de Recomendaciones",
    description="Verifica el estado de los servicios de IA y ML"
)
async def health_check() -> Dict[str, Any]:
    """
    Verifica el estado de los servicios de recomendaciones.
    
    Returns:
        Dict: Estado de los servicios
    """
    try:
        return {
            "status": "healthy",
            "services": {
                "ml_service": "available",
                "openai_service": "available" if openai_service.is_available() else "unavailable",
                "fallback": "available"
            },
            "timestamp": "2025-01-21T12:00:00Z"
        }
    except Exception as e:
        logger.error(f"Error en health check: {e}")
        raise HTTPException(status_code=500, detail="Error checking service health")

# Funciones auxiliares para análisis (aplicando DRY)

def _analyze_risk_factors(student_data: Dict, prediction_score: float) -> list:
    """
    Identifica factores de riesgo académico.
    
    Args:
        student_data: Datos del estudiante
        prediction_score: Puntuación predicha
        
    Returns:
        list: Lista de factores de riesgo
    """
    risk_factors = []
    
    # Factores basados en datos del estudiante
    if student_data.get('hours_studied', 0) < 10:
        risk_factors.append("Horas de estudio insuficientes (menos de 10 por semana)")
    
    if student_data.get('sleep_hours', 8) < 6:
        risk_factors.append("Horas de sueño insuficientes (menos de 6 horas)")
    
    if student_data.get('previous_scores', 15) < 11:
        risk_factors.append("Historial académico previo bajo")
    
    if student_data.get('tutoring_sessions', 0) == 0 and prediction_score < 14:
        risk_factors.append("Falta de apoyo académico adicional")
    
    if student_data.get('extracurricular_activities', 0) > 3:
        risk_factors.append("Posible sobrecarga de actividades extracurriculares")
    
    return risk_factors[:5]  # Máximo 5 factores

def _analyze_strengths(student_data: Dict, prediction_score: float) -> list:
    """
    Identifica fortalezas del estudiante.
    
    Args:
        student_data: Datos del estudiante
        prediction_score: Puntuación predicha
        
    Returns:
        list: Lista de fortalezas
    """
    strengths = []
    
    if student_data.get('hours_studied', 0) >= 15:
        strengths.append("Excelente dedicación al estudio")
    
    if student_data.get('previous_scores', 0) >= 16:
        strengths.append("Historial académico destacado")
    
    if student_data.get('tutoring_sessions', 0) > 2:
        strengths.append("Búsqueda proactiva de apoyo académico")
    
    if student_data.get('sleep_hours', 8) >= 7:
        strengths.append("Buenos hábitos de descanso")
    
    if prediction_score >= 14:
        strengths.append("Predicción favorable de rendimiento")
    
    return strengths[:5]  # Máximo 5 fortalezas

def _identify_improvement_areas(student_data: Dict, prediction_score: float) -> list:
    """
    Identifica áreas específicas de mejora.
    
    Args:
        student_data: Datos del estudiante
        prediction_score: Puntuación predicha
        
    Returns:
        list: Lista de áreas de mejora
    """
    improvement_areas = []
    
    if student_data.get('hours_studied', 0) < 15:
        improvement_areas.append("Incrementar tiempo dedicado al estudio")
    
    if student_data.get('tutoring_sessions', 0) < 2 and prediction_score < 16:
        improvement_areas.append("Considerar sesiones de tutoría adicionales")
    
    if student_data.get('sleep_hours', 8) < 7:
        improvement_areas.append("Mejorar hábitos de sueño y descanso")
    
    if student_data.get('extracurricular_activities', 0) == 0:
        improvement_areas.append("Incorporar actividades extracurriculares balanceadas")
    
    if prediction_score < 14:
        improvement_areas.append("Reforzar estrategias de estudio y preparación")
    
    return improvement_areas[:5]  # Máximo 5 áreas
