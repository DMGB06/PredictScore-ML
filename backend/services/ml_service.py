"""
Servicio ML Profesional - Arquitectura Robusta
==============================================

Servicio de predicción ML aplicando principios SOLID, DRY, KISS
con manejo robusto de errores, cache, y optimizaciones de rendimiento.

Autor: Equipo Grupo 4
Fecha: 2025
"""

import asyncio
import json
import logging
import time
from typing import Dict, List, Any, Optional, Union
from pathlib import Path
import joblib
import numpy as np
import pandas as pd

from core.config import Settings

logger = logging.getLogger(__name__)

class MLModelError(Exception):
    """Excepción personalizada para errores de modelos ML."""
    pass

class ValidationError(Exception):
    """Excepción personalizada para errores de validación."""
    pass

class MLService:
    """
    Servicio ML principal aplicando principios SOLID y DRY.
    
    Características:
    - Predicción individual y en lote
    - Cache automático
    - Fallback a modelos alternativos
    - Logging detallado
    - Validación robusta
    - Manejo de errores
    """
    
    def __init__(self):
        self.settings = Settings()
        self.svr_model = None
        self.svr_scaler = None
        self.ridge_model = None
        self.ridge_scaler = None
        self.current_model_type = "svr"
        self.cache = {}
        self.stats = {
            "predictions_count": 0,
            "batch_predictions_count": 0,
            "cache_hits": 0,
            "errors_count": 0,
            "model_switches": 0
        }
        
    async def initialize(self):
        """Inicializa el servicio ML."""
        logger.info("🔄 Inicializando ML Service...")
        
        try:
            # Cargar modelo SVR
            if self.settings.SVR_MODEL_PATH.exists():
                self.svr_model = joblib.load(self.settings.SVR_MODEL_PATH)
                if self.settings.SVR_SCALER_PATH.exists():
                    self.svr_scaler = joblib.load(self.settings.SVR_SCALER_PATH)
                logger.info("✅ Modelo SVR cargado")
            
            # Cargar modelo Ridge como fallback
            if self.settings.RIDGE_MODEL_PATH.exists():
                self.ridge_model = joblib.load(self.settings.RIDGE_MODEL_PATH)
                if self.settings.RIDGE_SCALER_PATH.exists():
                    self.ridge_scaler = joblib.load(self.settings.RIDGE_SCALER_PATH)
                logger.info("✅ Modelo Ridge cargado como fallback")
                
            # Determinar modelo principal
            if self.svr_model:
                self.current_model_type = "svr"
            elif self.ridge_model:
                self.current_model_type = "ridge"
            else:
                raise MLModelError("No se pudo cargar ningún modelo")
                
            logger.info(f"🚀 ML Service inicializado con modelo: {self.current_model_type}")
            
        except Exception as e:
            logger.error(f"❌ Error inicializando ML Service: {e}")
            raise
    
    async def predict_student_score(self, student_data: Dict[str, Any]) -> Dict[str, Any]:
        """Predice el puntaje de un estudiante."""
        start_time = time.time()
        
        try:
            # Validar datos
            self._validate_student_data(student_data)
            
            # Verificar cache
            cache_key = self._generate_cache_key(student_data)
            if cache_key in self.cache:
                self.stats["cache_hits"] += 1
                return self.cache[cache_key]
            
            # Realizar predicción
            prediction = await self._predict_with_fallback(student_data)
            
            # Preparar resultado
            result = {
                "prediction": round(float(prediction), 2),
                "model_used": self.current_model_type,
                "confidence": self._calculate_confidence(prediction),
                "processing_time": round(time.time() - start_time, 3),
                "timestamp": time.time()
            }
            
            # Guardar en cache
            self.cache[cache_key] = result
            self.stats["predictions_count"] += 1
            
            return result
            
        except Exception as e:
            self.stats["errors_count"] += 1
            logger.error(f"Error en predicción: {e}")
            raise MLModelError(f"Prediction failed: {str(e)}")
    
    async def predict_batch(self, students_data: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Predice puntajes en lote."""
        start_time = time.time()
        
        try:
            if len(students_data) > self.settings.MAX_BATCH_SIZE:
                raise ValidationError(f"Batch size exceeds limit: {len(students_data)}")
            
            predictions = []
            for student_data in students_data:
                self._validate_student_data(student_data)
                pred = await self._predict_with_fallback(student_data)
                predictions.append(round(float(pred), 2))
            
            result = {
                "predictions": predictions,
                "count": len(predictions),
                "model_used": self.current_model_type,
                "processing_time": round(time.time() - start_time, 3),
                "average_score": round(np.mean(predictions), 2) if predictions else 0,
                "timestamp": time.time()
            }
            
            self.stats["batch_predictions_count"] += 1
            return result
            
        except Exception as e:
            self.stats["errors_count"] += 1
            logger.error(f"Error en predicción en lote: {e}")
            raise MLModelError(f"Batch prediction failed: {str(e)}")
    
    def _validate_student_data(self, student_data: Dict[str, Any]):
        """Valida los datos del estudiante."""
        required_features = self.settings.REQUIRED_FEATURES
        
        missing_features = [f for f in required_features if f not in student_data]
        if missing_features:
            raise ValidationError(f"Missing features: {missing_features}")
    
    def _preprocess_features(self, student_data: Dict[str, Any], model_type: str) -> np.ndarray:
        """Preprocesa las features para el modelo."""
        feature_order = self.settings.REQUIRED_FEATURES
        feature_array = np.array([student_data.get(f, 0) for f in feature_order])
        
        # Aplicar scaler según el modelo
        if model_type == "svr" and self.svr_scaler:
            feature_array = self.svr_scaler.transform([feature_array])[0]
        elif model_type == "ridge" and self.ridge_scaler:
            feature_array = self.ridge_scaler.transform([feature_array])[0]
            
        return feature_array
    
    async def _predict_with_fallback(self, student_data: Dict[str, Any]) -> float:
        """Realiza predicción con fallback automático."""
        try:
            # Intentar con modelo principal
            if self.current_model_type == "svr" and self.svr_model:
                features = self._preprocess_features(student_data, "svr")
                prediction = self.svr_model.predict([features])[0]
            elif self.current_model_type == "ridge" and self.ridge_model:
                features = self._preprocess_features(student_data, "ridge")
                prediction = self.ridge_model.predict([features])[0]
            else:
                raise MLModelError("No model available")
            
            # Asegurar rango válido
            return max(0, min(100, prediction))
            
        except Exception as e:
            logger.warning(f"Error con modelo {self.current_model_type}: {e}")
            
            # Fallback a Ridge si estaba usando SVR
            if self.current_model_type == "svr" and self.ridge_model:
                self.stats["model_switches"] += 1
                features = self._preprocess_features(student_data, "ridge")
                prediction = self.ridge_model.predict([features])[0]
                return max(0, min(100, prediction))
            else:
                raise MLModelError("No fallback model available")
    
    def _generate_cache_key(self, student_data: Dict[str, Any]) -> str:
        """Genera clave de cache."""
        sorted_data = {k: student_data[k] for k in sorted(student_data.keys())}
        return str(hash(json.dumps(sorted_data, sort_keys=True)))
    
    def _calculate_confidence(self, prediction: float) -> str:
        """Calcula nivel de confianza."""
        if prediction >= 80:
            return "high"
        elif prediction >= 60:
            return "medium"
        else:
            return "low"
    
    async def get_model_info(self) -> Dict[str, Any]:
        """Obtiene información del modelo actual."""
        return {
            "current_model": self.current_model_type,
            "available_models": {
                "svr": self.svr_model is not None,
                "ridge": self.ridge_model is not None
            },
            "statistics": self.stats,
            "cache_size": len(self.cache)
        }
    
    async def health_check(self) -> Dict[str, Any]:
        """Verifica el estado de salud del servicio."""
        return {
            "status": "healthy" if (self.svr_model or self.ridge_model) else "unhealthy",
            "models_loaded": {
                "svr": self.svr_model is not None,
                "ridge": self.ridge_model is not None
            },
            "current_model": self.current_model_type,
            "statistics": self.stats,
            "timestamp": time.time()
        }
    
    async def cleanup(self):
        """Limpia recursos del servicio."""
        self.cache.clear()
        logger.info("ML Service limpiado correctamente")

# Instancia global del servicio
ml_service = MLService()

import pandas as pd
import numpy as np
from typing import Dict, Any, List, Optional
from pathlib import Path
import sys
import os

# Añadir path del proyecto ML
ML_PROJECT_PATH = Path(__file__).parent.parent.parent / "machine learning"
sys.path.append(str(ML_PROJECT_PATH))

# Importar el predictor universal
try:
    from src.predictor_universal import PredictorUniversal
except ImportError:
    # Fallback si hay problemas de importación
    print("⚠️  No se pudo importar predictor_universal, usando fallback")
    PredictorUniversal = None

class MLService:
    """
    Servicio principal de Machine Learning (SOLID - Single Responsibility)
    """
    
    def __init__(self, modelo_preferido: str = 'svr'):
        """
        Inicializa el servicio ML
        
        Args:
            modelo_preferido (str): Modelo preferido ('svr', 'ridge')
        """
        self.modelo_preferido = modelo_preferido
        self.predictor = None
        self.modelo_info = None
        self._inicializado = False
        
    def inicializar(self) -> Dict[str, Any]:
        """
        Inicializa el servicio ML con fallbacks automáticos
        
        Returns:
            Dict: Información del servicio inicializado
        """
        if self._inicializado:
            return self.modelo_info
            
        print(f"🚀 Inicializando MLService con modelo: {self.modelo_preferido}")
        
        # Intentar con modelo preferido
        try:
            self.predictor = PredictorUniversal(self.modelo_preferido)
            self.modelo_info = self.predictor.inicializar()
            self._inicializado = True
            
            print(f"✅ MLService listo con {self.modelo_preferido.upper()}")
            return self.modelo_info
            
        except Exception as e:
            print(f"❌ Error con {self.modelo_preferido}: {e}")
            
            # Fallback automático
            modelo_fallback = 'ridge' if self.modelo_preferido == 'svr' else 'svr'
            print(f"🔄 Intentando fallback con {modelo_fallback}...")
            
            try:
                self.predictor = PredictorUniversal(modelo_fallback)
                self.modelo_info = self.predictor.inicializar()
                self._inicializado = True
                
                print(f"✅ MLService listo con fallback {modelo_fallback.upper()}")
                return self.modelo_info
                
            except Exception as e2:
                print(f"❌ Fallback también falló: {e2}")
                raise Exception("No se pudo inicializar ningún modelo ML")
    
    def predecir_estudiante(self, datos_estudiante: Dict[str, Any]) -> Dict[str, Any]:
        """
        Predice el rendimiento de un estudiante individual
        
        Args:
            datos_estudiante (Dict): Datos del estudiante
            
        Returns:
            Dict: Predicción y metadatos
        """
        if not self._inicializado:
            self.inicializar()
            
        try:
            resultado = self.predictor.predecir_individual(datos_estudiante)
            
            # Añadir análisis de la predicción
            score = resultado['prediccion']
            analisis = self._analizar_score(score)
            
            return {
                'success': True,
                'prediccion': score,
                'analisis': analisis,
                'modelo_usado': resultado['modelo_usado'],
                'confianza': self._calcular_confianza(score)
            }
            
        except Exception as e:
            return {
                'success': False,
                'error': str(e),
                'prediccion': None
            }
    
    def predecir_csv(self, df_datos: pd.DataFrame) -> Dict[str, Any]:
        """
        Predice para múltiples estudiantes desde CSV
        
        Args:
            df_datos (pd.DataFrame): Datos de estudiantes
            
        Returns:
            Dict: Resultados del análisis masivo
        """
        if not self._inicializado:
            self.inicializar()
            
        try:
            df_resultado = self.predictor.predecir_masivo(df_datos)
            
            # Análisis estadístico
            predicciones = df_resultado['Prediccion_Exam_Score']
            estadisticas = {
                'total_estudiantes': len(df_resultado),
                'score_promedio': float(predicciones.mean()),
                'score_mediano': float(predicciones.median()),
                'score_min': float(predicciones.min()),
                'score_max': float(predicciones.max()),
                'desviacion_std': float(predicciones.std())
            }
            
            # Distribución por categorías
            distribucion = self._analizar_distribucion(predicciones)
            
            return {
                'success': True,
                'datos_procesados': df_resultado.to_dict('records'),
                'estadisticas': estadisticas,
                'distribucion': distribucion,
                'modelo_usado': self.modelo_info.get('tipo_modelo', 'unknown')
            }
            
        except Exception as e:
            return {
                'success': False,
                'error': str(e),
                'datos_procesados': None
            }
    
    def obtener_info_modelo(self) -> Dict[str, Any]:
        """
        Retorna información del modelo activo
        
        Returns:
            Dict: Información del modelo
        """
        if not self._inicializado:
            self.inicializar()
            
        return {
            'modelo_activo': self.modelo_info.get('tipo_modelo', 'unknown'),
            'metricas': self.modelo_info.get('metricas', {}),
            'parametros': self.modelo_info.get('parametros', {}),
            'inicializado': self._inicializado
        }
    
    def _analizar_score(self, score: float) -> Dict[str, Any]:
        """
        Analiza el score y proporciona interpretación
        
        Args:
            score (float): Score predicho
            
        Returns:
            Dict: Análisis del score
        """
        if score >= 85:
            categoria = "Excelente"
            recomendaciones = ["Mantener el excelente rendimiento", "Considerar desafíos adicionales"]
        elif score >= 75:
            categoria = "Bueno"
            recomendaciones = ["Buen rendimiento general", "Oportunidad de mejora con esfuerzo adicional"]
        elif score >= 65:
            categoria = "Regular"
            recomendaciones = ["Necesita mejorar hábitos de estudio", "Buscar apoyo adicional"]
        else:
            categoria = "Necesita Apoyo"
            recomendaciones = ["Intervención urgente necesaria", "Plan de apoyo personalizado"]
        
        return {
            'categoria': categoria,
            'recomendaciones': recomendaciones,
            'percentil': self._calcular_percentil(score)
        }
    
    def _calcular_confianza(self, score: float) -> float:
        """
        Calcula nivel de confianza de la predicción
        
        Args:
            score (float): Score predicho
            
        Returns:
            float: Nivel de confianza (0.0 - 1.0)
        """
        # Basado en las métricas del modelo
        if self.modelo_info and 'metricas' in self.modelo_info:
            r2_score = self.modelo_info['metricas'].get('r2_test', 0.7)
            return round(r2_score, 2)
        else:
            return 0.75  # Valor por defecto conservador
    
    def _calcular_percentil(self, score: float) -> int:
        """
        Calcula percentil aproximado basado en distribución normal
        
        Args:
            score (float): Score predicho
            
        Returns:
            int: Percentil aproximado
        """
        # Basado en distribución del dataset (media ~67, std ~4)
        media = 67
        std = 4
        z_score = (score - media) / std
        
        # Conversión aproximada a percentil
        if z_score <= -2: return 5
        elif z_score <= -1.5: return 10
        elif z_score <= -1: return 20
        elif z_score <= -0.5: return 30
        elif z_score <= 0: return 50
        elif z_score <= 0.5: return 70
        elif z_score <= 1: return 80
        elif z_score <= 1.5: return 90
        else: return 95
    
    def _analizar_distribucion(self, predicciones: pd.Series) -> Dict[str, Any]:
        """
        Analiza la distribución de predicciones
        
        Args:
            predicciones (pd.Series): Serie de predicciones
            
        Returns:
            Dict: Análisis de distribución
        """
        total = len(predicciones)
        
        excelente = len(predicciones[predicciones >= 85])
        bueno = len(predicciones[(predicciones >= 75) & (predicciones < 85)])
        regular = len(predicciones[(predicciones >= 65) & (predicciones < 75)])
        necesita_apoyo = len(predicciones[predicciones < 65])
        
        return {
            'excelente': {'cantidad': excelente, 'porcentaje': round(excelente/total*100, 1)},
            'bueno': {'cantidad': bueno, 'porcentaje': round(bueno/total*100, 1)},
            'regular': {'cantidad': regular, 'porcentaje': round(regular/total*100, 1)},
            'necesita_apoyo': {'cantidad': necesita_apoyo, 'porcentaje': round(necesita_apoyo/total*100, 1)}
        }

# Instancia global del servicio (Singleton pattern para FastAPI)
ml_service = MLService(modelo_preferido='svr')

def obtener_ml_service() -> MLService:
    """
    Obtiene la instancia del servicio ML (Dependency Injection para FastAPI)
    
    Returns:
        MLService: Instancia del servicio
    """
    return ml_service

def inicializar_ml_service() -> Dict[str, Any]:
    """
    Inicializa el servicio ML al startup de la aplicación
    
    Returns:
        Dict: Información de inicialización
    """
    return ml_service.inicializar()
