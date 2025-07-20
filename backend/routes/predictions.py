"""
Routes de Predicciones ML
========================

Endpoints FastAPI para predicciones de rendimiento estudiantil
con optimización de rendimiento y manejo de errores robusto.

Autor: Equipo Grupo 4
Fecha: 2025
"""

from fastapi import APIRouter, HTTPException, Depends, UploadFile, File
from fastapi.responses import JSONResponse
import pandas as pd
import io
from typing import Dict, Any, List
import logging

# Importar schemas y servicios
from ..models.schemas import StudentDataInput, PredictionResponse, BatchPredictionResponse
from ..services.ml_service import obtener_ml_service, MLService

# Configurar logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()

@router.post("/single", response_model=Dict[str, Any])
async def predecir_estudiante_individual(
    datos_estudiante: StudentDataInput,
    ml_service: MLService = Depends(obtener_ml_service)
) -> Dict[str, Any]:
    """
    Predice el rendimiento de un estudiante individual
    
    Args:
        datos_estudiante: Datos del estudiante según schema
        ml_service: Servicio ML inyectado
        
    Returns:
        Dict con predicción y análisis
    """
    try:
        # Convertir Pydantic model a dict
        datos_dict = datos_estudiante.dict()
        
        # Realizar predicción
        resultado = ml_service.predecir_estudiante(datos_dict)
        
        if not resultado['success']:
            raise HTTPException(
                status_code=500, 
                detail=f"Error en predicción: {resultado['error']}"
            )
        
        logger.info(f"Predicción individual exitosa: {resultado['prediccion']}")
        
        return {
            "success": True,
            "data": {
                "prediccion": resultado['prediccion'],
                "analisis": resultado['analisis'],
                "modelo_usado": resultado['modelo_usado'],
                "confianza": resultado['confianza']
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error en predicción individual: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error interno: {str(e)}")

@router.post("/batch", response_model=Dict[str, Any])
async def predecir_csv_estudiantes(
    archivo: UploadFile = File(...),
    ml_service: MLService = Depends(obtener_ml_service)
) -> Dict[str, Any]:
    """
    Predice el rendimiento para múltiples estudiantes desde CSV
    
    Args:
        archivo: Archivo CSV con datos de estudiantes
        ml_service: Servicio ML inyectado
        
    Returns:
        Dict con predicciones masivas y análisis
    """
    try:
        # Validar tipo de archivo
        if not archivo.filename.endswith('.csv'):
            raise HTTPException(
                status_code=400, 
                detail="Solo se permiten archivos CSV"
            )
        
        # Leer CSV
        contenido = await archivo.read()
        df = pd.read_csv(io.StringIO(contenido.decode('utf-8')))
        
        # Validar que no esté vacío
        if df.empty:
            raise HTTPException(
                status_code=400, 
                detail="El archivo CSV está vacío"
            )
        
        # Validar columnas requeridas (al menos algunas básicas)
        columnas_basicas = ['Hours_Studied', 'Attendance', 'Previous_Scores']
        columnas_faltantes = [col for col in columnas_basicas if col not in df.columns]
        
        if columnas_faltantes:
            raise HTTPException(
                status_code=400,
                detail=f"Columnas faltantes en CSV: {columnas_faltantes}"
            )
        
        # Realizar predicciones masivas
        resultado = ml_service.predecir_csv(df)
        
        if not resultado['success']:
            raise HTTPException(
                status_code=500,
                detail=f"Error en predicción masiva: {resultado['error']}"
            )
        
        logger.info(f"Predicción masiva exitosa: {resultado['estadisticas']['total_estudiantes']} estudiantes")
        
        return {
            "success": True,
            "data": {
                "estadisticas": resultado['estadisticas'],
                "distribucion": resultado['distribucion'],
                "modelo_usado": resultado['modelo_usado'],
                "datos_procesados": resultado['datos_procesados'][:100]  # Limitar a 100 para respuesta
            },
            "meta": {
                "total_procesados": resultado['estadisticas']['total_estudiantes'],
                "datos_en_respuesta": min(100, resultado['estadisticas']['total_estudiantes'])
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error en predicción masiva: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error procesando CSV: {str(e)}")

@router.get("/modelo/info")
async def obtener_info_modelo(
    ml_service: MLService = Depends(obtener_ml_service)
) -> Dict[str, Any]:
    """
    Obtiene información del modelo ML activo
    
    Args:
        ml_service: Servicio ML inyectado
        
    Returns:
        Dict con información del modelo
    """
    try:
        info = ml_service.obtener_info_modelo()
        
        return {
            "success": True,
            "data": info
        }
        
    except Exception as e:
        logger.error(f"Error obteniendo info del modelo: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error interno: {str(e)}")

@router.get("/health")
async def health_check() -> Dict[str, Any]:
    """
    Health check para el servicio de predicciones
    
    Returns:
        Dict con estado del servicio
    """
    return {
        "status": "healthy",
        "service": "predicciones-ml",
        "version": "1.0.0"
    }
