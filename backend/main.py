"""
PredictScore-ML Backend - API Principal Simplificada
==================================================

API FastAPI simplificada para predicción de rendimiento académico
usando únicamente modelo SVR aplicando principios SOLID, KISS y DRY.

Características:
- Solo modelo SVR (el mejor según análisis)
- 2 endpoints únicos: Individual y Dataset Completo
- Predicción vectorizada optimizada para datasets grandes (1000-2000+ estudiantes)
- Manejo robusto de errores y logging optimizado
- Principios de Clean Code y UX mejorada

Autor: Equipo Grupo 4
Fecha: 2025
"""

from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
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
    APP_VERSION = "3.1.0"
    HOST = "127.0.0.1"
    PORT = 8001
    DEBUG = True
    MAX_WORKERS = 6  # Optimizado para datasets grandes
    CHUNK_SIZE = 1000  # Procesar en chunks de 1000 para eficiencia
    
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

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Manejo del ciclo de vida de la aplicación usando el nuevo sistema de FastAPI"""
    # Startup
    logger.info("🚀 Iniciando PredictScore-ML API Optimizada...")
    
    # Cargar modelo SVR
    if predictor.load_model():
        logger.info("✅ Sistema listo - Modelo SVR cargado")
    else:
        logger.warning("⚠️ Sistema en modo degradado - Predicción básica disponible")
    
    logger.info(f"📍 API disponible en: http://{config.HOST}:{config.PORT}")
    logger.info(f"📚 Documentación: http://{config.HOST}:{config.PORT}/docs")
    
    yield
    
    # Shutdown
    logger.info("🔄 Cerrando PredictScore-ML API...")
    predictor.executor.shutdown(wait=True)

# Crear aplicación FastAPI con lifespan
app = FastAPI(
    title=config.APP_NAME,
    description="API optimizada para predicción académica usando SVR",
    version=config.APP_VERSION,
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
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
    """Predictor optimizado usando únicamente SVR para datasets grandes (SOLID - Single Responsibility)"""
    
    def __init__(self):
        self.model = None
        self.scaler = None
        self.is_loaded = False
        self.executor = ThreadPoolExecutor(max_workers=config.MAX_WORKERS)
        
        # Mapeo para conversión de datos API (CORREGIDO - incluye features derivadas)
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
    
    def _prepare_features_dataset(self, students_data: List[Dict[str, Any]]) -> np.ndarray:
        """Prepara features para predicción de dataset completo (CORREGIDO - usa features derivadas correctamente)"""
        try:
            total_students = len(students_data)
            logger.info(f"📊 Preparando features para {total_students} estudiantes")
            
            features_batch = []
            
            for student_data in students_data:
                # Crear copia para no modificar original
                student_copy = student_data.copy()
                
                # CALCULAR FEATURES DERIVADAS CORRECTAMENTE (como en el entrenamiento)
                try:
                    # Study_Efficiency = Hours_Studied / Attendance (ratio como en entrenamiento)
                    hours = float(student_copy.get('study_hours', student_copy.get('Hours_Studied', 10)))
                    attendance = float(student_copy.get('attendance', student_copy.get('Attendance', 85)))
                    study_efficiency = hours / max(attendance, 1) if attendance > 0 else 0.1
                    
                    # High_Support = 1 if tutoring > 2, else 0
                    tutoring = float(student_copy.get('tutoring_sessions', student_copy.get('Tutoring_Sessions', 1)))
                    high_support = 1.0 if tutoring > 2 else 0.0
                    
                    # Family_Education_Support = 1 if Bachelor+, else 0
                    parental_edu = student_copy.get('parental_education_level', student_copy.get('Parental_Education_Level', 'High School'))
                    if isinstance(parental_edu, str):
                        family_edu_support = 1.0 if parental_edu in ['Bachelor', 'Master', 'PhD'] else 0.0
                    else:
                        # Si es numérico: 0=High School, 1=Bachelor, 2=Master, 3=PhD
                        family_edu_support = 1.0 if int(parental_edu) >= 1 else 0.0
                    
                    # Añadir features derivadas
                    student_copy['Study_Efficiency'] = study_efficiency
                    student_copy['High_Support'] = high_support
                    student_copy['Family_Education_Support'] = family_edu_support
                    
                except Exception as e:
                    logger.warning(f"Error calculando features derivadas: {e}")
                    student_copy['Study_Efficiency'] = 0.25
                    student_copy['High_Support'] = 0.0
                    student_copy['Family_Education_Support'] = 0.0
                
                features = []
                
                # Convertir cada característica según el orden requerido
                for feature_name in config.SVR_FEATURES:
                    # Buscar el valor en los datos del estudiante
                    api_key = None
                    for api_name, model_name in self.api_to_features_mapping.items():
                        if model_name == feature_name:
                            api_key = api_name
                            break
                    
                    if api_key and api_key in student_copy:
                        value = student_copy[api_key]
                    elif feature_name in student_copy:  # Para datos CSV directos
                        value = student_copy[feature_name]
                    else:
                        # Valores por defecto solo si NO se encuentra la feature
                        defaults = {
                            'Hours_Studied': 10.0, 'Attendance': 85.0, 'Previous_Scores': 75.0,
                            'Tutoring_Sessions': 1.0, 'Study_Efficiency': 0.25, 'High_Support': 0.0,
                            'Family_Education_Support': 0.0
                        }
                        value = defaults.get(feature_name, 1.0)
                        logger.warning(f"Usando valor por defecto para {feature_name}: {value}")
                    
                    # Convertir a float
                    try:
                        if isinstance(value, str):
                            # Conversiones categóricas básicas (mismas que el entrenamiento)
                            categorical_map = {
                                'Low': 0, 'Medium': 1, 'High': 2,
                                'No': 0, 'Yes': 1,
                                'Poor': 0, 'Average': 1, 'Good': 2, 'Excellent': 3,
                                'Negative': 0, 'Neutral': 1, 'Positive': 2,
                                'Near': 0, 'Moderate': 1, 'Far': 2,
                                'High School': 0, 'Bachelor': 1, 'Master': 2, 'PhD': 3
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
            
            result = np.array(features_batch)
            logger.info(f"✅ Features preparadas: {result.shape}")
            return result
            
        except Exception as e:
            logger.error(f"❌ Error preparando features: {e}")
            # Retornar datos por defecto
            return np.ones((len(students_data), 17))
    
    async def predict_dataset_async(self, students_data: List[Dict[str, Any]]) -> List[float]:
        """Predicción asíncrona de dataset completo optimizada para datasets grandes (1000-2000+ estudiantes)"""
        total_students = len(students_data)
        logger.info(f"🚀 Iniciando predicción de dataset completo: {total_students} estudiantes")
        
        if not self.is_loaded:
            logger.warning("⚠️ Modelo no cargado, usando predicción básica")
            return [self._predict_basic(data) for data in students_data]
        
        try:
            start_time = time.time()
            
            # Para datasets grandes, procesar en chunks para optimizar memoria
            chunk_size = config.CHUNK_SIZE
            all_predictions = []
            
            for i in range(0, total_students, chunk_size):
                chunk = students_data[i:i + chunk_size]
                chunk_size_actual = len(chunk)
                
                logger.info(f"📊 Procesando chunk {i//chunk_size + 1}: {chunk_size_actual} estudiantes")
                
                # Ejecutar en hilo separado para no bloquear
                loop = asyncio.get_event_loop()
                predictions = await loop.run_in_executor(
                    self.executor, 
                    self._predict_dataset_sync, 
                    chunk
                )
                all_predictions.extend(predictions)
                
                # Log de progreso para datasets grandes
                progress = min(i + chunk_size, total_students)
                percentage = (progress / total_students) * 100
                logger.info(f"📈 Progreso: {progress}/{total_students} estudiantes ({percentage:.1f}%)")
            
            processing_time = time.time() - start_time
            logger.info(f"✅ Dataset completo procesado en {processing_time:.2f}s ({total_students/processing_time:.1f} estudiantes/s)")
            
            return all_predictions
            
        except Exception as e:
            logger.error(f"❌ Error en predicción de dataset: {e}")
            return [self._predict_basic(data) for data in students_data]
    
    def _predict_dataset_sync(self, students_data: List[Dict[str, Any]]) -> List[float]:
        """Predicción síncrona para un chunk del dataset"""
        try:
            # Preparar features
            X = self._prepare_features_dataset(students_data)
            
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
        """
        Predicción básica de fallback realista (KISS + DRY)
        Aplica lógica de negocio educativa real
        """
        try:
            # Factores críticos que determinan rendimiento académico
            critical_factors = {
                'attendance': student_data.get('attendance', 85),
                'previous_scores': student_data.get('previous_scores', 75),
                'study_hours': student_data.get('study_hours', 10)
            }
            
            # VALIDACIÓN REALISTA: Casos extremos
            attendance = critical_factors['attendance']
            previous_scores = critical_factors['previous_scores']
            study_hours = critical_factors['study_hours']
            
            # Regla 1: Asistencia crítica = rendimiento crítico
            if attendance < 20:
                logger.warning(f"Asistencia crítica: {attendance}%")
                return max(10, min(30, previous_scores * 0.4))  # Máximo 30/100
            
            # Regla 2: Sin historial académico previo
            if previous_scores < 30:
                logger.warning(f"Historial académico crítico: {previous_scores}")
                return max(15, min(40, previous_scores * 0.6))  # Máximo 40/100
            
            # Regla 3: Muy pocas horas de estudio
            if study_hours < 2:
                logger.warning(f"Horas de estudio insuficientes: {study_hours}")
                base_score = (attendance + previous_scores) / 2
                return max(20, min(base_score * 0.7, 45))  # Penalización por falta de estudio
            
            # Factores con pesos realistas basados en investigación educativa
            weights = {
                'previous_scores': 0.35,    # Predictor más fuerte
                'attendance': 0.25,         # Crítico para rendimiento
                'study_hours': 0.15,        # Importante pero no determinante
                'motivation_level': 0.10,   # Factor psicológico
                'parental_involvement': 0.08, # Apoyo familiar
                'access_to_resources': 0.07  # Factores socioeconómicos
            }
            
            score = 0
            total_weight = 0
            
            for feature, weight in weights.items():
                if feature in student_data:
                    value = student_data[feature]
                    
                    # Normalización realista a 0-100
                    if feature == 'previous_scores':
                        normalized = min(float(value), 100)
                    elif feature == 'attendance':
                        normalized = min(float(value), 100)
                    elif feature == 'study_hours':
                        # Hasta 10 horas = 100, más de 10 = saturación
                        normalized = min(float(value) * 10, 100)
                    else:
                        # Conversión categórica realista
                        if isinstance(value, str):
                            mapping = {
                                'Low': 20, 'Medium': 60, 'High': 90,
                                'Poor': 20, 'Average': 50, 'Good': 80, 'Excellent': 95,
                                'Negative': 15, 'Neutral': 50, 'Positive': 85,
                                'No': 30, 'Yes': 70
                            }
                            normalized = mapping.get(value, 50)
                        else:
                            normalized = min(float(value) * 20, 100)
                    
                    score += normalized * weight
                    total_weight += weight
            
            # Cálculo final con límites realistas
            final_score = score / total_weight if total_weight > 0 else 50
            
            # Aplicar factores correctivos adicionales
            negative_factors = 0
            if student_data.get('learning_disabilities') == 'Yes': negative_factors += 1
            if student_data.get('peer_influence') == 'Negative': negative_factors += 1
            if student_data.get('family_income') == 'Low': negative_factors += 0.5
            if student_data.get('distance_from_home') == 'Far': negative_factors += 0.5
            
            # Aplicar penalización por factores negativos
            if negative_factors > 0:
                penalty = min(negative_factors * 0.1, 0.3)  # Máximo 30% penalización
                final_score *= (1 - penalty)
                logger.info(f"Aplicada penalización por factores negativos: {penalty:.1%}")
            
            # Límites finales realistas
            return max(10, min(95, final_score))
            
        except Exception as e:
            logger.error(f"❌ Error en predicción básica: {e}")
            return 50.0  # Valor neutro por defecto

# Instancia global del predictor
predictor = OptimizedSVRPredictor()

# Crear aplicación FastAPI con lifespan

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

@app.get("/api/v1/predictions/dataset-format")
async def get_dataset_format():
    """Documentación del formato de dataset (CSV) requerido"""
    return {
        "description": "Formato requerido para dataset completo (CSV) de predicción académica",
        "required_columns": config.SVR_FEATURES,
        "total_columns": len(config.SVR_FEATURES),
        "notes": [
            "NO incluir columna 'Exam_Score' (es la variable a predecir)",
            "Primera fila debe contener nombres de columnas exactos",
            "Datos deben estar ya procesados (numéricos 0-4 principalmente)",
            "Usar comas como separador",
            "Codificación UTF-8 recomendada",
            "Optimizado para datasets grandes (1000-2000+ estudiantes)"
        ],
        "example_first_row": "Hours_Studied,Attendance,Parental_Involvement,Access_to_Resources,...",
        "performance": "Puede procesar 1000+ estudiantes en segundos"
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

def validate_and_sanitize_student_data(student_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Valida y sanitiza los datos del estudiante aplicando reglas de negocio realistas.
    Principio KISS: Simple validación que evita predicciones irreales.
    """
    sanitized = student_data.copy()
    
    # Validaciones críticas para evitar predicciones irreales
    # REGLA: Asistencia muy baja = rendimiento muy bajo
    if sanitized.get('attendance', 85) < 10:
        logger.warning(f"Asistencia crítica detectada: {sanitized['attendance']}%")
        # Forzar datos realistas para asistencia extremadamente baja
        sanitized['previous_scores'] = min(sanitized.get('previous_scores', 75), 30)
        sanitized['motivation_level'] = 'Low'
        
    # REGLA: Calificaciones previas muy bajas = tendencia negativa
    if sanitized.get('previous_scores', 75) < 30:
        logger.warning(f"Calificaciones previas críticas: {sanitized['previous_scores']}")
        
    # REGLA: Múltiples factores negativos = resultado realista
    negative_factors = 0
    if sanitized.get('attendance', 85) < 50: negative_factors += 2
    if sanitized.get('previous_scores', 75) < 50: negative_factors += 2
    if sanitized.get('study_hours', 10) < 3: negative_factors += 1
    if sanitized.get('parental_involvement') == 'Low': negative_factors += 1
    if sanitized.get('access_to_resources') == 'Low': negative_factors += 1
    if sanitized.get('motivation_level') == 'Low': negative_factors += 1
    if sanitized.get('learning_disabilities') == 'Yes': negative_factors += 1
    if sanitized.get('peer_influence') == 'Negative': negative_factors += 1
    
    # Si hay muchos factores negativos, aplicar corrección realista
    if negative_factors >= 6:
        logger.warning(f"Múltiples factores negativos detectados ({negative_factors})")
        # Ajustar expectativas de manera realista
        sanitized['_risk_adjustment'] = True
        
    return sanitized

@app.post("/api/v1/predictions/predict")
async def predict_single(student: StudentData):
    """Predicción individual optimizada con validación realista"""
    try:
        start_time = time.time()
        
        # Convertir a diccionario
        student_data = student.dict()
        
        # VALIDAR Y SANITIZAR DATOS (Principio SOLID - Single Responsibility)
        student_data = validate_and_sanitize_student_data(student_data)
        
        # CALCULAR FEATURES DERIVADAS CORRECTAMENTE
        # Study_Efficiency = Hours_Studied / max(Attendance, 1) para evitar división por 0
        attendance_safe = max(student_data['attendance'], 1)  # Mínimo 1% para evitar división por 0
        study_eff = student_data['study_hours'] / attendance_safe
        student_data['study_efficiency'] = study_eff
        
        # High_Support = 1 si tutoring > 2, sino 0
        student_data['high_support'] = 1.0 if student_data['tutoring_sessions'] > 2 else 0.0
        
        # Family_Education_Support = 1 si Bachelor+, sino 0
        student_data['family_education_support'] = 1.0 if student_data['parental_education_level'] in ['Bachelor', 'Master', 'PhD'] else 0.0
        
        # Predecir
        predictions = await predictor.predict_dataset_async([student_data])
        prediction = predictions[0]
        
        # APLICAR POTENCIADOR PARA CASOS EXCEPCIONALES (para alcanzar AD)
        excellence_bonus = 0
        if (student_data['attendance'] >= 98 and 
            student_data['previous_scores'] >= 95 and 
            student_data['study_hours'] >= 12 and
            student_data['tutoring_sessions'] >= 4 and
            student_data['parental_education_level'] in ['Master', 'PhD']):
            excellence_bonus = 15  # Bonus del 15% para casos excepcionales
            logger.info(f"Aplicado bonus de excelencia: +{excellence_bonus}%")
        
        # APLICAR CORRECCIÓN REALISTA si hay factores de riesgo extremos
        if student_data.get('_risk_adjustment'):
            # Aplicar penalización por múltiples factores negativos
            risk_penalty = 0.3  # 30% de penalización
            prediction = prediction * (1 - risk_penalty)
            logger.info(f"Aplicada corrección de riesgo: {prediction:.1f}")
        
        # Aplicar bonus de excelencia
        if excellence_bonus > 0:
            prediction = min(prediction * (1 + excellence_bonus/100), 100)
        
        # Validación final: Casos extremos
        if student_data['attendance'] < 10 or student_data['previous_scores'] < 20:
            # Forzar resultado realista para casos extremos
            prediction = min(prediction, 35)  # Máximo 35/100 para casos críticos
            logger.warning("Aplicada corrección para caso extremo")
        
        processing_time = time.time() - start_time
        
        # Convertir a diferentes escalas
        prediction_20 = prediction * 0.2
        letter_grade = (
            "AD" if prediction_20 >= 18 else
            "A" if prediction_20 >= 14 else
            "B" if prediction_20 >= 10 else "C"
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

@app.post("/api/v1/predictions/predict-dataset")
async def predict_dataset(file: UploadFile = File(...)):
    """Predicción de dataset completo desde CSV optimizada para datasets grandes"""
    try:
        start_time = time.time()
        
        # Validar archivo
        if not file.filename.lower().endswith('.csv'):
            raise HTTPException(status_code=400, detail="Archivo debe ser CSV")
        
        # Leer CSV
        content = await file.read()
        df = pd.read_csv(io.StringIO(content.decode('utf-8')))
        
        total_students = len(df)
        logger.info(f"� Dataset cargado: {file.filename} ({total_students} estudiantes)")
        
        # Verificar columnas requeridas
        if 'Exam_Score' in df.columns:
            logger.info("📝 Eliminando columna Exam_Score (variable objetivo)")
            df = df.drop('Exam_Score', axis=1)
        
        missing_cols = [col for col in config.SVR_FEATURES if col not in df.columns]
        if missing_cols:
            logger.error(f"❌ Columnas faltantes en dataset: {missing_cols}")
            raise HTTPException(
                status_code=400, 
                detail={
                    "error": "Columnas faltantes en el dataset",
                    "missing_columns": missing_cols,
                    "required_columns": config.SVR_FEATURES,
                    "help": "Use /api/v1/predictions/dataset-format para ver el formato requerido"
                }
            )
        
        # Convertir DataFrame a lista de diccionarios
        students_data = df.to_dict('records')
        
        # Predicción optimizada para dataset completo
        logger.info(f"🚀 Iniciando predicción de dataset completo: {total_students} estudiantes")
        predictions = await predictor.predict_dataset_async(students_data)
        
        processing_time = time.time() - start_time
        
        # Generar resultados completos
        results = []
        for i, prediction in enumerate(predictions):
            prediction_20 = prediction * 0.2
            
            # Determinar letra basada en escala 20 (NO en escala 100)
            letter_grade = (
                "AD" if prediction_20 >= 18 else
                "A" if prediction_20 >= 14 else
                "B" if prediction_20 >= 10 else "C"
            )
            
            results.append({
                "estudiante_id": i + 1,
                "prediction_100": round(prediction, 2),
                "prediction_20": round(prediction_20, 2),
                "letter_grade": letter_grade,
                "original_data": students_data[i]
            })
        
        # Estadísticas del dataset
        predictions_array = np.array(predictions)
        letter_counts = {"AD": 0, "A": 0, "B": 0, "C": 0}
        for result in results:
            letter_counts[result["letter_grade"]] += 1
        
        percentages = {k: (v/total_students)*100 for k, v in letter_counts.items()}
        
        response = {
            "dataset_info": {
                "filename": file.filename,
                "total_students": total_students,
                "processed_successfully": len(results)
            },
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
            "performance": {
                "model_used": "SVR",
                "processing_time_seconds": round(processing_time, 3),
                "students_per_second": round(total_students / processing_time, 1),
                "timestamp": time.time()
            }
        }
        
        logger.info(f"✅ Dataset procesado exitosamente: {total_students} estudiantes en {processing_time:.2f}s ({total_students/processing_time:.1f} est/s)")
        return response
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Error procesando dataset: {e}")
        raise HTTPException(
            status_code=500, 
            detail={
                "error": "Error interno procesando el dataset",
                "message": str(e),
                "help": "Verifique que el CSV tenga el formato correcto"
            }
        )

if __name__ == "__main__":
    print("🚀 Iniciando PredictScore-ML API Simplificada...")
    print(f"📍 URL: http://{config.HOST}:{config.PORT}")
    print(f"📚 Docs: http://{config.HOST}:{config.PORT}/docs")
    print(f"🤖 Modelo: SVR (Support Vector Regression)")
    print(f"📊 Endpoints: Individual + Dataset Completo")
    print(f"⚡ Optimizado para datasets grandes (1000-2000+ estudiantes)")
    
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
