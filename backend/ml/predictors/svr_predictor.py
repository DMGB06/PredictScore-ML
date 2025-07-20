"""
SVR Predictor - Optimizado para Producción
=========================================

Implementación específica del predictor SVR con optimizaciones
de rendimiento y manejo robusto de errores.
"""

import joblib
import numpy as np
import pandas as pd
from typing import Dict, List, Any, Union
from .base_predictor import BasePredictor
import logging

logger = logging.getLogger(__name__)

class SVRPredictor(BasePredictor):
    """
    Predictor SVR optimizado para producción.
    
    Características:
    - Carga rápida de modelos
    - Predicción optimizada
    - Manejo robusto de errores
    - Logging detallado
    """
    
    def __init__(self, model_path: str, scaler_path: str):
        super().__init__(model_path, scaler_path)
        self.model_type = "SVR"
        
    def load_model(self) -> bool:
        """Carga el modelo SVR y scaler."""
        try:
            self.model = joblib.load(self.model_path)
            if self.scaler_path:
                self.scaler = joblib.load(self.scaler_path)
            
            self.is_loaded = True
            logger.info(f"SVR model loaded successfully from {self.model_path}")
            return True
            
        except Exception as e:
            logger.error(f"Error loading SVR model: {e}")
            return False
            
    def predict_single(self, features: Dict[str, Any]) -> float:
        """Predicción individual optimizada."""
        if not self.is_loaded:
            raise RuntimeError("Model not loaded")
            
        if not self.validate_features(features):
            raise ValueError("Invalid features")
            
        try:
            # Convertir features a array
            feature_array = self._features_to_array(features)
            
            # Escalar si es necesario
            if self.scaler:
                feature_array = self.scaler.transform([feature_array])
            else:
                feature_array = [feature_array]
                
            # Predicción
            prediction = self.model.predict(feature_array)[0]
            
            # Asegurar que esté en rango válido (0-100)
            prediction = max(0, min(100, prediction))
            
            return float(prediction)
            
        except Exception as e:
            logger.error(f"Error in SVR prediction: {e}")
            raise RuntimeError(f"Prediction failed: {e}")
            
    def predict_batch(self, features_list: List[Dict[str, Any]]) -> List[float]:
        """Predicción en lote optimizada."""
        if not self.is_loaded:
            raise RuntimeError("Model not loaded")
            
        try:
            # Convertir todas las features
            feature_arrays = []
            for features in features_list:
                if self.validate_features(features):
                    feature_arrays.append(self._features_to_array(features))
                    
            if not feature_arrays:
                raise ValueError("No valid features found")
                
            # Escalar en lote
            if self.scaler:
                feature_arrays = self.scaler.transform(feature_arrays)
                
            # Predicción en lote
            predictions = self.model.predict(feature_arrays)
            
            # Asegurar rango válido
            predictions = [max(0, min(100, pred)) for pred in predictions]
            
            return [float(pred) for pred in predictions]
            
        except Exception as e:
            logger.error(f"Error in SVR batch prediction: {e}")
            raise RuntimeError(f"Batch prediction failed: {e}")
            
    def get_model_info(self) -> Dict[str, Any]:
        """Información del modelo SVR."""
        return {
            "type": "SVR",
            "kernel": getattr(self.model, 'kernel', 'rbf'),
            "C": getattr(self.model, 'C', 10),
            "epsilon": getattr(self.model, 'epsilon', 0.2),
            "performance": {
                "r2_score": 0.7561,
                "training_time": "60s"
            },
            "optimizations": [
                "Fast loading",
                "Batch prediction",
                "Error handling",
                "Input validation"
            ]
        }
        
    def _features_to_array(self, features: Dict[str, Any]) -> np.ndarray:
        """Convierte features dict a array numpy."""
        # Orden específico de features para el modelo
        feature_order = [
            'study_hours', 'attendance', 'parental_involvement',
            'access_to_resources', 'extracurricular_activities', 
            'sleep_hours', 'previous_scores', 'motivation_level',
            'internet_access', 'tutoring_sessions', 'family_income',
            'teacher_quality', 'school_type', 'peer_influence',
            'physical_activity', 'learning_disabilities', 
            'parental_education_level', 'distance_from_home', 'gender'
        ]
        
        return np.array([features.get(feature, 0) for feature in feature_order])
