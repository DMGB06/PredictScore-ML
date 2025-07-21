"""
PredictScore-ML Backend - API Principal Optimizada
=================================================

API FastAPI optimizada para predicción de rendimiento académico
usando únicamente modelo SVR aplicando principios SOLID, KISS y DRY.

Características:
- Solo modelo SVR (el mejor según análisis)
- Predicción vectorizada para lotes grandes
- Manejo robusto de errores
- Logging optimizado
- Principios de Clean Code

Autor: Equipo Grupo 4
Fecha: 2025
"""

from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import logging
import time
import json
import pandas as pd
import numpy as np
import io
from typing import Dict, List, Any, Optional
from pathlib import Path
import asyncio
from concurrent.futures import ThreadPoolExecutor

# Configurar logging optimizado
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Configuración única y simple
class Config:
    """Configuración centralizada (SOLID - Single Responsibility)"""
    APP_NAME = "PredictScore-ML API"
    APP_VERSION = "3.0.0"
    HOST = "127.0.0.1"
    PORT = 8001
    DEBUG = True
    MAX_WORKERS = 4  # Para procesamiento paralelo
    BATCH_SIZE = 500  # Tamaño de lote para optimización
    
    ALLOWED_ORIGINS = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://predictcore-ml.vercel.app"
    ]
    
    # Features exactas del modelo SVR (17 variables ya procesadas)
    SVR_FEATURES = [
        'Hours_Studied', 'Attendance', 'Parental_Involvement', 'Access_to_Resources',
        'Extracurricular_Activities', 'Previous_Scores', 'Motivation_Level', 'Tutoring_Sessions',
        'Family_Income', 'Teacher_Quality', 'Peer_Influence', 'Learning_Disabilities',
        'Parental_Education_Level', 'Distance_from_Home', 'Study_Efficiency', 'High_Support',
        'Family_Education_Support'
    ]

config = Config()

# Crear aplicación FastAPI
app = FastAPI(
    title=config.APP_NAME,
    description="API optimizada para predicción académica usando SVR",
    version=config.APP_VERSION,
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=config.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

# Importar dependencias ML
import joblib

class OptimizedSVRPredictor:
    """Predictor optimizado usando únicamente SVR (SOLID - Single Responsibility)"""
    
    def __init__(self):
        self.model = None
        self.scaler = None
        self.is_loaded = False
        self.executor = ThreadPoolExecutor(max_workers=config.MAX_WORKERS)
        
        # Mapeo para conversión de datos API
        self.api_to_features_mapping = {
            'study_hours': 'Hours_Studied',
            'attendance': 'Attendance', 
            'parental_involvement': 'Parental_Involvement',
            'access_to_resources': 'Access_to_Resources',
            'extracurricular_activities': 'Extracurricular_Activities',
            'previous_scores': 'Previous_Scores',
            'motivation_level': 'Motivation_Level',
            'tutoring_sessions': 'Tutoring_Sessions',
            'family_income': 'Family_Income',
            'teacher_quality': 'Teacher_Quality',
            'peer_influence': 'Peer_Influence',
            'learning_disabilities': 'Learning_Disabilities',
            'parental_education_level': 'Parental_Education_Level',
            'distance_from_home': 'Distance_from_Home',
            'study_efficiency': 'Study_Efficiency',
            'high_support': 'High_Support',
            'family_education_support': 'Family_Education_Support'
        }
    
    def load_model(self) -> bool:
        """Carga el modelo SVR optimizado"""
        try:
            # Rutas a los archivos del modelo
            model_path = Path("ml/models/mejor_modelo_avanzado_svr.pkl")
            scaler_path = Path("ml/models/scaler_avanzado.pkl")
            
            if not model_path.exists():
                logger.error(f"❌ Modelo no encontrado en: {model_path}")
                return False
                
            if not scaler_path.exists():
                logger.error(f"❌ Scaler no encontrado en: {scaler_path}")
                return False
            
            # Cargar modelo y scaler
            self.model = joblib.load(model_path)
            self.scaler = joblib.load(scaler_path)
            
            self.is_loaded = True
            logger.info("✅ Modelo SVR y scaler cargados correctamente")
            return True
            
        except Exception as e:
            logger.error(f"❌ Error cargando modelo SVR: {e}")
            return False
    
    def _prepare_features_batch(self, students_data: List[Dict[str, Any]]) -> np.ndarray:
        """Prepara features para predicción en lote (DRY + Optimización)"""
        try:
            features_batch = []
            
            for student_data in students_data:
                features = []
                
                # Convertir cada característica según el orden requerido
                for feature_name in config.SVR_FEATURES:
                    # Buscar el valor en los datos del estudiante
                    api_key = None
                    for api_name, model_name in self.api_to_features_mapping.items():
                        if model_name == feature_name:
                            api_key = api_name
                            break
                    
                    if api_key and api_key in student_data:
                        value = student_data[api_key]
                    elif feature_name in student_data:  # Para datos CSV directos
                        value = student_data[feature_name]
                    else:
                        # Valores por defecto optimizados
                        defaults = {
                            'Hours_Studied': 10.0, 'Attendance': 85.0, 'Previous_Scores': 75.0,
                            'Tutoring_Sessions': 1.0, 'Study_Efficiency': 0.25, 'High_Support': 0.0,
                            'Family_Education_Support': 0.0
                        }
                        value = defaults.get(feature_name, 1.0)
                    
                    # Convertir a float
                    try:
                        if isinstance(value, str):
                            # Conversiones categóricas básicas
                            categorical_map = {
                                'Low': 0, 'Medium': 1, 'High': 2,
                                'No': 0, 'Yes': 1,
                                'Poor': 0, 'Average': 1, 'Good': 2, 'Excellent': 3,
                                'Negative': 0, 'Neutral': 1, 'Positive': 2,
                                'Near': 0, 'Moderate': 1, 'Far': 2
                            }
                            value = categorical_map.get(value, 1)
                        
                        features.append(float(value))
                    except:
                        features.append(1.0)  # Fallback
                
                # Verificar que tenemos 17 features
                if len(features) != 17:
                    logger.warning(f"⚠️ Feature count mismatch: {len(features)}/17")
                    # Completar o truncar a 17
                    features = (features + [1.0] * 17)[:17]
                
                features_batch.append(features)
            
            return np.array(features_batch)
            
        except Exception as e:
            logger.error(f"❌ Error preparando features: {e}")
            # Retornar datos por defecto
            return np.ones((len(students_data), 17))
    
    async def predict_batch_async(self, students_data: List[Dict[str, Any]]) -> List[float]:
        """Predicción asíncrona en lote optimizada"""
        if not self.is_loaded:
            logger.warning("⚠️ Modelo no cargado, usando predicción básica")
            return [self._predict_basic(data) for data in students_data]
        
        try:
            # Dividir en lotes para optimización de memoria
            batch_size = config.BATCH_SIZE
            all_predictions = []
            
            for i in range(0, len(students_data), batch_size):
                batch = students_data[i:i + batch_size]
                
                # Ejecutar en hilo separado para no bloquear
                loop = asyncio.get_event_loop()
                predictions = await loop.run_in_executor(
                    self.executor, 
                    self._predict_batch_sync, 
                    batch
                )
                all_predictions.extend(predictions)
                
                # Log de progreso para lotes grandes
                if len(students_data) > 100:
                    progress = min(i + batch_size, len(students_data))
                    logger.info(f"📊 Progreso: {progress}/{len(students_data)} estudiantes")
            
            return all_predictions
            
        except Exception as e:
            logger.error(f"❌ Error en predicción por lotes: {e}")
            return [self._predict_basic(data) for data in students_data]
    
    def _predict_batch_sync(self, students_data: List[Dict[str, Any]]) -> List[float]:
        """Predicción síncrona para un lote"""
        try:
            # Preparar features
            X = self._prepare_features_batch(students_data)
            
            # Escalar
            X_scaled = self.scaler.transform(X)
            
            # Predecir en lote (vectorizado - mucho más rápido)
            predictions = self.model.predict(X_scaled)
            
            # Asegurar rango 0-100
            predictions = np.clip(predictions, 0, 100)
            
            return predictions.tolist()
            
        except Exception as e:
            logger.error(f"❌ Error en predicción síncrona: {e}")
            return [self._predict_basic(data) for data in students_data]
    
    def _predict_basic(self, student_data: Dict[str, Any]) -> float:
        """Predicción básica de fallback (KISS)"""
        try:
            # Factores clave con pesos basados en importancia del modelo SVR
            weights = {
                'previous_scores': 0.25,
                'study_hours': 0.20,
                'attendance': 0.20,
                'motivation_level': 0.10,
                'parental_involvement': 0.08,
                'access_to_resources': 0.07,
                'tutoring_sessions': 0.05,
                'teacher_quality': 0.05
            }
            
            score = 0
            total_weight = 0
            
            for feature, weight in weights.items():
                if feature in student_data:
                    value = student_data[feature]
                    
                    # Normalizar a 0-100
                    if feature == 'previous_scores' or feature == 'attendance':
                        normalized = min(float(value), 100)
                    elif feature == 'study_hours':
                        normalized = min(float(value) * 8, 100)  # 12.5h = 100
                    elif feature == 'tutoring_sessions':
                        normalized = min(float(value) * 20, 100)  # 5 = 100
                    else:
                        # Para categóricas convertir a numérico
                        if isinstance(value, str):
                            mapping = {'Low': 25, 'Medium': 50, 'High': 75, 'Poor': 25, 'Good': 75}
                            normalized = mapping.get(value, 50)
                        else:
                            normalized = min(float(value) * 25, 100)
                    
                    score += normalized * weight
                    total_weight += weight
            
            return max(20, min(95, score / total_weight if total_weight > 0 else 60))
            
        except Exception as e:
            logger.error(f"❌ Error en predicción básica: {e}")
            return 65.0  # Valor por defecto conservador

# Instancia global del predictor
predictor = OptimizedSVRPredictor()

@app.on_event("startup")
async def startup():
    """Inicialización optimizada de la aplicación"""
    logger.info("🚀 Iniciando PredictScore-ML API Optimizada...")
    
    # Cargar modelo SVR
    if predictor.load_model():
        logger.info("✅ Sistema listo - Modelo SVR cargado")
    else:
        logger.warning("⚠️ Sistema en modo degradado - Predicción básica disponible")
    
    logger.info(f"📍 API disponible en: http://{config.HOST}:{config.PORT}")
    logger.info(f"📚 Documentación: http://{config.HOST}:{config.PORT}/docs")

@app.on_event("shutdown")
async def shutdown():
    """Limpieza al cerrar"""
    logger.info("🔄 Cerrando PredictScore-ML API...")
    predictor.executor.shutdown(wait=True)

# === ENDPOINTS OPTIMIZADOS ===

@app.get("/")
async def root():
    """Endpoint raíz con información del sistema"""
    return {
        "app": config.APP_NAME,
        "version": config.APP_VERSION,
        "model": "SVR (Support Vector Regression)",
        "status": "✅ Operacional" if predictor.is_loaded else "⚠️ Modo Degradado",
        "docs": "/docs",
        "health": "/health"
    }

@app.get("/health")
async def health_check():
    """Verificación de salud del sistema"""
    return {
        "status": "healthy",
        "model_loaded": predictor.is_loaded,
        "timestamp": time.time(),
        "features_count": len(config.SVR_FEATURES)
    }

@app.get("/api/v1/predictions/csv-format")
async def get_csv_format():
    """Documentación del formato CSV requerido"""
    return {
        "description": "Formato requerido para CSV de predicción por lotes",
        "required_columns": config.SVR_FEATURES,
        "total_columns": len(config.SVR_FEATURES),
        "notes": [
            "NO incluir columna 'Exam_Score' (es la variable a predecir)",
            "Primera fila debe contener nombres de columnas",
            "Datos deben estar ya procesados (numéricos)",
            "Usar comas como separador"
        ],
        "example_first_row": "Hours_Studied,Attendance,Parental_Involvement,Access_to_Resources,..."
    }

# Esquemas de datos
from pydantic import BaseModel

class StudentData(BaseModel):
    study_hours: float = 10.0
    attendance: float = 85.0
    previous_scores: float = 75.0
    parental_involvement: str = "Medium"
    access_to_resources: str = "Medium"
    extracurricular_activities: str = "No"
    motivation_level: str = "Medium"
    tutoring_sessions: float = 1.0
    family_income: str = "Medium"
    teacher_quality: str = "Medium"
    peer_influence: str = "Neutral"
    learning_disabilities: str = "No"
    parental_education_level: str = "Bachelor"
    distance_from_home: str = "Near"

@app.post("/api/v1/predictions/predict")
async def predict_single(student: StudentData):
    """Predicción individual optimizada"""
    try:
        start_time = time.time()
        
        # Convertir a diccionario
        student_data = student.dict()
        
        # Calcular features derivadas
        study_eff = student_data['study_hours'] / max(student_data['attendance'], 1) * 0.01
        student_data['study_efficiency'] = study_eff
        student_data['high_support'] = 1.0 if student_data['tutoring_sessions'] > 2 else 0.0
        student_data['family_education_support'] = 1.0 if student_data['parental_education_level'] in ['Bachelor', 'Master', 'PhD'] else 0.0
        
        # Predecir
        predictions = await predictor.predict_batch_async([student_data])
        prediction = predictions[0]
        
        processing_time = time.time() - start_time
        
        # Convertir a diferentes escalas
        prediction_20 = prediction * 0.2
        letter_grade = (
            "AD" if prediction >= 90 else
            "A" if prediction >= 75 else
            "B" if prediction >= 60 else "C"
        )
        
        return {
            "prediction_100": round(prediction, 2),
            "prediction_20": round(prediction_20, 2),
            "letter_grade": letter_grade,
            "confidence": "High" if predictor.is_loaded else "Medium",
            "model_used": "SVR",
            "processing_time": round(processing_time, 3),
            "timestamp": time.time()
        }
        
    except Exception as e:
        logger.error(f"❌ Error en predicción individual: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/v1/predictions/predict-csv")
async def predict_csv(file: UploadFile = File(...)):
    """Predicción masiva desde CSV optimizada"""
    try:
        start_time = time.time()
        
        # Validar archivo
        if not file.filename.lower().endswith('.csv'):
            raise HTTPException(status_code=400, detail="Archivo debe ser CSV")
        
        # Leer CSV
        content = await file.read()
        df = pd.read_csv(io.StringIO(content.decode('utf-8')))
        
        logger.info(f"📊 Procesando CSV: {len(df)} estudiantes")
        
        # Verificar columnas requeridas
        if 'Exam_Score' in df.columns:
            logger.info("📝 Eliminando columna Exam_Score para predicción")
            df = df.drop('Exam_Score', axis=1)
        
        missing_cols = [col for col in config.SVR_FEATURES if col not in df.columns]
        if missing_cols:
            logger.error(f"❌ Columnas faltantes: {missing_cols}")
            raise HTTPException(
                status_code=400, 
                detail=f"CSV debe contener: {config.SVR_FEATURES}"
            )
        
        # Convertir DataFrame a lista de diccionarios
        students_data = df.to_dict('records')
        
        # Predicción en lote optimizada
        predictions = await predictor.predict_batch_async(students_data)
        
        processing_time = time.time() - start_time
        
        # Generar resultados
        results = []
        for i, prediction in enumerate(predictions):
            prediction_20 = prediction * 0.2
            letter_grade = (
                "AD" if prediction >= 90 else
                "A" if prediction >= 75 else
                "B" if prediction >= 60 else "C"
            )
            
            results.append({
                "estudiante_id": i + 1,
                "prediction_100": round(prediction, 2),
                "prediction_20": round(prediction_20, 2),
                "letter_grade": letter_grade,
                "original_data": students_data[i]
            })
        
        # Estadísticas
        predictions_array = np.array(predictions)
        letter_counts = {"AD": 0, "A": 0, "B": 0, "C": 0}
        for result in results:
            letter_counts[result["letter_grade"]] += 1
        
        total = len(results)
        percentages = {k: (v/total)*100 for k, v in letter_counts.items()}
        
        response = {
            "total_students": total,
            "results": results,
            "statistics": {
                "average_score_100": round(predictions_array.mean(), 2),
                "average_score_20": round(predictions_array.mean() * 0.2, 2),
                "distribution": letter_counts,
                "percentages": {k: round(v, 1) for k, v in percentages.items()},
                "max_score_100": round(predictions_array.max(), 2),
                "min_score_100": round(predictions_array.min(), 2),
                "std_score_100": round(predictions_array.std(), 2)
            },
            "model_used": "SVR",
            "processing_time": round(processing_time, 3),
            "timestamp": time.time()
        }
        
        logger.info(f"✅ CSV procesado: {total} estudiantes en {processing_time:.2f}s")
        return response
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Error procesando CSV: {e}")
        raise HTTPException(status_code=500, detail=f"Error procesando archivo: {str(e)}")

if __name__ == "__main__":
    print("🚀 Iniciando PredictScore-ML API Optimizada...")
    print(f"📍 URL: http://{config.HOST}:{config.PORT}")
    print(f"📚 Docs: http://{config.HOST}:{config.PORT}/docs")
    print(f"🤖 Modelo: SVR (Support Vector Regression)")
    
    try:
        uvicorn.run(
            "main:app",
            host=config.HOST,
            port=config.PORT,
            reload=config.DEBUG,
            log_level="info"
        )
    except Exception as e:
        logger.error(f"❌ Error iniciando servidor: {e}")
