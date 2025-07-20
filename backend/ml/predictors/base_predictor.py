"""
Predictor Base - Abstract Base Class
==================================

Implementación del patrón Strategy para predictores ML.
Siguiendo principios SOLID (especialmente Open/Closed y LSP).
"""

from abc import ABC, abstractmethod
from typing import Union, List, Dict, Any
import numpy as np
import pandas as pd

class BasePredictor(ABC):
    """
    Clase abstracta base para todos los predictores.
    
    Implementa el patrón Template Method y Strategy.
    """
    
    def __init__(self, model_path: str, scaler_path: str = None):
        self.model_path = model_path
        self.scaler_path = scaler_path
        self.model = None
        self.scaler = None
        self.is_loaded = False
        
    @abstractmethod
    def load_model(self) -> bool:
        """Carga el modelo específico."""
        pass
        
    @abstractmethod
    def predict_single(self, features: Dict[str, Any]) -> float:
        """Predicción para un solo estudiante."""
        pass
        
    @abstractmethod
    def predict_batch(self, features_list: List[Dict[str, Any]]) -> List[float]:
        """Predicción para múltiples estudiantes."""
        pass
        
    @abstractmethod
    def get_model_info(self) -> Dict[str, Any]:
        """Información del modelo."""
        pass
        
    def preprocess_features(self, features: Union[Dict, pd.DataFrame]) -> np.ndarray:
        """Preprocesamiento común de features."""
        # Implementación común de preprocesamiento
        pass
        
    def validate_features(self, features: Dict[str, Any]) -> bool:
        """Validación común de features."""
        required_features = [
            'study_hours', 'attendance', 'parental_involvement',
            'access_to_resources', 'extracurricular_activities',
            'sleep_hours', 'previous_scores', 'motivation_level'
        ]
        
        return all(feature in features for feature in required_features)
