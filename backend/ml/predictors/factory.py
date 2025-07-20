"""
Predictor Factory - Patrón Factory
=================================

Factory para crear predictores aplicando el patrón Factory
y Dependency Injection.
"""

from typing import Dict, Any, Optional
from .base_predictor import BasePredictor
from .svr_predictor import SVRPredictor
from .ridge_predictor import RidgePredictor
import json
import os
import logging

logger = logging.getLogger(__name__)

class PredictorFactory:
    """
    Factory para crear predictores siguiendo el patrón Factory.
    
    Beneficios:
    - Centraliza la creación de predictores
    - Maneja configuraciones automáticamente
    - Implementa fallbacks robustos
    - Facilita testing y mocking
    """
    
    def __init__(self, models_dir: str):
        self.models_dir = models_dir
        self.metadata = self._load_metadata()
        
    def create_predictor(self, model_type: str = None) -> BasePredictor:
        """
        Crea un predictor del tipo especificado.
        
        Args:
            model_type: Tipo de modelo ('svr', 'ridge', etc.)
            
        Returns:
            BasePredictor: Instancia del predictor
        """
        if model_type is None:
            model_type = self.metadata.get('default_model', 'svr')
            
        try:
            if model_type == 'svr':
                return self._create_svr_predictor()
            elif model_type == 'ridge':
                return self._create_ridge_predictor()
            else:
                logger.warning(f"Unknown model type: {model_type}. Using default.")
                return self._create_svr_predictor()
                
        except Exception as e:
            logger.error(f"Error creating {model_type} predictor: {e}")
            # Fallback al modelo más simple
            return self._create_ridge_predictor()
            
    def _create_svr_predictor(self) -> SVRPredictor:
        """Crea predictor SVR."""
        svr_config = self.metadata['models']['svr']
        model_path = os.path.join(self.models_dir, svr_config['file'])
        scaler_path = os.path.join(self.models_dir, svr_config['scaler'])
        
        predictor = SVRPredictor(model_path, scaler_path)
        
        if not predictor.load_model():
            raise RuntimeError("Failed to load SVR model")
            
        return predictor
        
    def _create_ridge_predictor(self) -> RidgePredictor:
        """Crea predictor Ridge."""
        ridge_config = self.metadata['models']['ridge']
        model_path = os.path.join(self.models_dir, ridge_config['file'])
        scaler_path = os.path.join(self.models_dir, ridge_config['scaler'])
        
        predictor = RidgePredictor(model_path, scaler_path)
        
        if not predictor.load_model():
            raise RuntimeError("Failed to load Ridge model")
            
        return predictor
        
    def _load_metadata(self) -> Dict[str, Any]:
        """Carga metadatos de modelos."""
        metadata_path = os.path.join(self.models_dir, 'metadata.json')
        
        try:
            with open(metadata_path, 'r') as f:
                return json.load(f)
        except Exception as e:
            logger.error(f"Error loading metadata: {e}")
            # Fallback metadata
            return {
                'default_model': 'ridge',
                'fallback_model': 'ridge',
                'models': {
                    'ridge': {
                        'file': 'ridge_alpha_10.pkl',
                        'scaler': 'scaler.pkl'
                    }
                }
            }
