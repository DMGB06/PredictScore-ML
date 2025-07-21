"""
Rutas para Recomendaciones con OpenAI
===================================

Endpoints para generar recomendaciones personalizadas
basadas en predicciones de rendimiento académico.

Autor: Equipo Grupo 4
Fecha: 2025
"""

import logging
from datetime import datetime
from fastapi import APIRouter, HTTPException, Depends
from typing import Dict, Any, List

from models.schemas import RecommendationRequest, RecommendationResponse, ActionPlanItem
from services.openai_service import recommendation_service

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1/recommendations", tags=["Recomendaciones"])

@router.post("/generate", response_model=RecommendationResponse)
async def generate_recommendations(request: RecommendationRequest):
    """
    Genera recomendaciones personalizadas basadas en predicciones de estudiantes.
    
    Este endpoint utiliza IA (OpenAI GPT) para analizar el rendimiento predicho
    de un grupo de estudiantes y generar recomendaciones específicas y accionables.
    
    Args:
        request: Datos de las predicciones y configuración del análisis
        
    Returns:
        RecommendationResponse: Recomendaciones detalladas con plan de acción
        
    Raises:
        HTTPException: Si hay errores en el procesamiento
    """
    try:
        logger.info(f"🤖 Generando recomendaciones para {len(request.predictions)} estudiantes")
        
        # Validar que hay predicciones
        if not request.predictions:
            raise HTTPException(
                status_code=400,
                detail="No se proporcionaron predicciones para analizar"
            )
        
        # Generar recomendaciones usando el servicio de OpenAI
        recommendations_result = recommendation_service.generate_general_recommendations(
            request.predictions
        )
        
        # Extraer estadísticas
        stats = recommendations_result.get("stats", {})
        
        # Crear breakdown de rendimiento
        performance_breakdown = {
            "alto_rendimiento": stats.get("high_performance", 0),
            "rendimiento_medio": stats.get("medium_performance", 0),
            "bajo_rendimiento": stats.get("low_performance", 0)
        }
        
        # Convertir action plan a objetos Pydantic
        action_plan_items = []
        for item in recommendations_result.get("action_plan", []):
            action_plan_items.append(ActionPlanItem(
                phase=item.get("phase", ""),
                action=item.get("action", ""),
                target=item.get("target", ""),
                responsible=item.get("responsible", "")
            ))
        
        # Crear respuesta
        response = RecommendationResponse(
            status=recommendations_result.get("status", "success"),
            total_students=stats.get("total_students", 0),
            average_score=round(stats.get("average_score", 0), 2),
            performance_breakdown=performance_breakdown,
            general_recommendations=recommendations_result.get("general_recommendations", ""),
            priority_areas=recommendations_result.get("priority_areas", []),
            action_plan=action_plan_items,
            generated_at=datetime.now(),
            session_id=request.session_id,
            note=recommendations_result.get("note")
        )
        
        logger.info(f"✅ Recomendaciones generadas exitosamente para sesión {request.session_id}")
        return response
        
    except Exception as e:
        logger.error(f"❌ Error generando recomendaciones: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Error interno generando recomendaciones: {str(e)}"
        )

@router.get("/status")
async def get_recommendation_service_status():
    """
    Verifica el estado del servicio de recomendaciones.
    
    Returns:
        Dict: Estado del servicio y configuración
    """
    try:
        has_openai = recommendation_service.client is not None
        api_key_configured = bool(recommendation_service.api_key)
        
        return {
            "status": "active",
            "openai_available": has_openai,
            "api_key_configured": api_key_configured,
            "fallback_mode": not has_openai,
            "service_type": "OpenAI GPT-3.5" if has_openai else "Local Fallback",
            "message": "Servicio de recomendaciones operativo" if has_openai else "Servicio en modo local - Configure OPENAI_API_KEY para IA"
        }
        
    except Exception as e:
        logger.error(f"❌ Error verificando estado del servicio: {e}")
        return {
            "status": "error",
            "openai_available": False,
            "api_key_configured": False,
            "fallback_mode": True,
            "service_type": "Error",
            "message": f"Error en el servicio: {str(e)}"
        }

@router.post("/test")
async def test_recommendations():
    """
    Endpoint de prueba para las recomendaciones con datos de ejemplo.
    
    Returns:
        RecommendationResponse: Recomendaciones basadas en datos de prueba
    """
    try:
        # Datos de prueba
        test_predictions = [
            {
                "predicted_score": 45.5,
                "study_hours": 2,
                "sleep_hours": 5,
                "attendance": 70,
                "student_id": "test_001"
            },
            {
                "predicted_score": 78.2,
                "study_hours": 6,
                "sleep_hours": 8,
                "attendance": 95,
                "student_id": "test_002"
            },
            {
                "predicted_score": 65.8,
                "study_hours": 4,
                "sleep_hours": 7,
                "attendance": 85,
                "student_id": "test_003"
            }
        ]
        
        test_request = RecommendationRequest(
            predictions=test_predictions,
            session_id="test_session",
            analysis_type="general"
        )
        
        return await generate_recommendations(test_request)
        
    except Exception as e:
        logger.error(f"❌ Error en prueba de recomendaciones: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Error en prueba: {str(e)}"
        )
