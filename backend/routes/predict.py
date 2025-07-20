"""
Rutas de Predicción Individual
=============================

Endpoint para recibir los datos del estudiante y devolver la predicción usando el modelo SVR avanzado.

Autor: Equipo Grupo 4
Fecha: 2025
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Dict, Any
import numpy as np
import joblib
import os

# Rutas de los modelos entrenados
MODELO_PATH = os.path.join(os.path.dirname(__file__), '../../../Machine-Learning/modelos/mejor_modelo_avanzado_svr.pkl')
SCALER_PATH = os.path.join(os.path.dirname(__file__), '../../../Machine-Learning/modelos/scaler_avanzado.pkl')
METADATOS_PATH = os.path.join(os.path.dirname(__file__), '../../../Machine-Learning/modelos/metadatos_mejor_modelo_avanzado.pkl')

CAMPOS = [
    "Hours_Studied", "Attendance", "Parental_Involvement", "Access_to_Resources", "Extracurricular_Activities",
    "Previous_Scores", "Motivation_Level", "Tutoring_Sessions", "Family_Income", "Teacher_Quality",
    "Peer_Influence", "Learning_Disabilities", "Parental_Education_Level", "Distance_from_Home"
]

class StudentData(BaseModel):
    """
    Esquema de entrada para los datos del estudiante.
    """
    Hours_Studied: float = Field(..., ge=0, le=50)
    Attendance: float = Field(..., ge=0, le=100)
    Parental_Involvement: int = Field(..., ge=0, le=2)
    Access_to_Resources: int = Field(..., ge=0, le=2)
    Extracurricular_Activities: int = Field(..., ge=0, le=2)
    Previous_Scores: float = Field(..., ge=0, le=100)
    Motivation_Level: int = Field(..., ge=0, le=2)
    Tutoring_Sessions: float = Field(..., ge=0, le=10)
    Family_Income: int = Field(..., ge=0, le=2)
    Teacher_Quality: int = Field(..., ge=0, le=2)
    Peer_Influence: int = Field(..., ge=0, le=2)
    Learning_Disabilities: int = Field(..., ge=0, le=2)
    Parental_Education_Level: int = Field(..., ge=0, le=2)
    Distance_from_Home: int = Field(..., ge=0, le=2)

class PredictionResponse(BaseModel):
    """
    Esquema de respuesta para la predicción.
    """
    predicted_score: float
    confidence: float
    letter_grade: str
    model_info: Dict[str, Any]

router = APIRouter()

# Carga de modelo y scaler global
modelo = None
scaler = None
metadatos = None

def cargar_modelo():
    """
    Carga el modelo SVR y el scaler desde disco.
    """
    global modelo, scaler, metadatos
    if modelo is None:
        modelo = joblib.load(MODELO_PATH)
    if scaler is None:
        scaler = joblib.load(SCALER_PATH)
    if metadatos is None:
        metadatos = joblib.load(METADATOS_PATH)

@router.on_event("startup")
def startup_event():
    """
    Evento de inicio para cargar el modelo y scaler en memoria.
    """
    cargar_modelo()

@router.post("/predict", response_model=PredictionResponse)
def predict(data: StudentData):
    """
    Endpoint para predecir el rendimiento académico de un estudiante.
    Recibe los 14 campos, aplica el preprocesamiento y devuelve la predicción y metadatos del modelo.
    """
    # Convertir datos a array ordenado
    X = np.array([[getattr(data, campo) for campo in CAMPOS]])
    # Aplicar escalado
    X_scaled = scaler.transform(X)
    # Realizar predicción
    score = float(modelo.predict(X_scaled)[0])
    # Calcular confianza (simulada, usar metadatos reales si se desea)
    confidence = float(metadatos.get('cv_r2_mean', 0.85))
    # Calcular letra
    if score >= 18:
        letter = "A"
    elif score >= 14:
        letter = "B"
    elif score >= 10:
        letter = "C"
    elif score >= 6:
        letter = "D"
    else:
        letter = "F"
    # Construir respuesta
    return PredictionResponse(
        predicted_score=score,
        confidence=confidence,
        letter_grade=letter,
        model_info={
            "model_name": metadatos.get("modelo", "SVR avanzado"),
            "r2_score": metadatos.get("r2_test", 0.69),
            "cv_r2_mean": metadatos.get("cv_r2_mean", 0.69),
            "cv_r2_std": metadatos.get("cv_r2_std", 0.05),
            "fecha_entrenamiento": metadatos.get("fecha_entrenamiento", "")
        }
    )
