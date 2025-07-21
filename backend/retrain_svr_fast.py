#!/usr/bin/env python3
"""
Reentrenamiento rápido del modelo SVR
Usa los datos procesados para mantener compatibilidad con los CSVs de prueba
KISS + DRY: Simple, rápido y efectivo
"""

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.svm import SVR
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import r2_score, mean_absolute_error, mean_squared_error
import joblib
import json
import os
from datetime import datetime

def load_and_prepare_data():
    """
    Carga y prepara los datos para entrenamiento
    """
    print('📊 Cargando datos de entrenamiento...')
    
    # Usar datos ya procesados (DRY principle)
    train_file = 'ml/data/processed/train_student_performance.csv'
    test_file = 'ml/data/processed/test_student_performance.csv'
    
    if os.path.exists(train_file) and os.path.exists(test_file):
        print('✅ Usando datos procesados existentes')
        df_train = pd.read_csv(train_file)
        df_test = pd.read_csv(test_file)
        df = pd.concat([df_train, df_test], ignore_index=True)
    else:
        print('⚠️  Datos procesados no encontrados, usando datos raw')
        df = pd.read_csv('ml/data/raw/StudentPerformanceFactors.csv')
        df = preprocess_raw_data(df)
    
    print(f'   Total de registros: {len(df)}')
    print(f'   Características: {df.shape[1] - 1}')  # -1 por Exam_Score
    
    return df

def preprocess_raw_data(df):
    """
    Procesa datos raw si es necesario (fallback)
    """
    print('🔄 Procesando datos raw...')
    
    # Mapear variables categóricas a numéricas (como en el dataset procesado)
    parental_map = {'Low': 0, 'Medium': 1, 'High': 2}
    access_map = {'Low': 0, 'Medium': 1, 'High': 2}
    binary_map = {'No': 0, 'Yes': 1}
    motivation_map = {'Low': 0, 'Medium': 1, 'High': 2}
    income_map = {'Low': 0, 'Medium': 1, 'High': 2}
    teacher_map = {'Poor': 0, 'Average': 1, 'Good': 2}
    school_map = {'Public': 0, 'Private': 1}
    peer_map = {'Negative': 0, 'Neutral': 1, 'Positive': 2}
    parent_edu_map = {'High School': 0, 'College': 1, 'Postgraduate': 2}
    distance_map = {'Near': 0, 'Moderate': 1, 'Far': 2}
    gender_map = {'Male': 0, 'Female': 1}
    
    # Aplicar mapeos
    df['Parental_Involvement'] = df['Parental_Involvement'].map(parental_map)
    df['Access_to_Resources'] = df['Access_to_Resources'].map(access_map)
    df['Extracurricular_Activities'] = df['Extracurricular_Activities'].map(binary_map)
    df['Motivation_Level'] = df['Motivation_Level'].map(motivation_map)
    df['Internet_Access'] = df['Internet_Access'].map(binary_map)
    df['Family_Income'] = df['Family_Income'].map(income_map)
    df['Teacher_Quality'] = df['Teacher_Quality'].map(teacher_map)
    df['School_Type'] = df['School_Type'].map(school_map)
    df['Peer_Influence'] = df['Peer_Influence'].map(peer_map)
    df['Learning_Disabilities'] = df['Learning_Disabilities'].map(binary_map)
    df['Parental_Education_Level'] = df['Parental_Education_Level'].map(parent_edu_map)
    df['Distance_from_Home'] = df['Distance_from_Home'].map(distance_map)
    df['Gender'] = df['Gender'].map(gender_map)
    
    # Mantener solo las características que tenemos en los CSVs de prueba
    keep_columns = [
        'Hours_Studied', 'Attendance', 'Parental_Involvement', 'Access_to_Resources',
        'Extracurricular_Activities', 'Previous_Scores', 'Motivation_Level', 
        'Tutoring_Sessions', 'Family_Income', 'Teacher_Quality', 'Peer_Influence',
        'Learning_Disabilities', 'Parental_Education_Level', 'Distance_from_Home',
        'Exam_Score'
    ]
    
    df = df[keep_columns]
    
    # Agregar características calculadas
    df['Study_Efficiency'] = df['Hours_Studied'] / df['Attendance']
    df['High_Support'] = (df['Parental_Involvement'] == 2).astype(int)
    df['Family_Education_Support'] = (df['Parental_Education_Level'] == 2).astype(int)
    
    return df

def train_svr_model(df):
    """
    Entrena el modelo SVR optimizado
    """
    print('\n🤖 Entrenando modelo SVR...')
    
    # Separar características y target
    feature_columns = [col for col in df.columns if col != 'Exam_Score']
    X = df[feature_columns]
    y = df['Exam_Score']
    
    print(f'   Características usadas: {len(feature_columns)}')
    print(f'   Características: {feature_columns}')
    
    # División entrenamiento/validación
    X_train, X_val, y_train, y_val = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=None
    )
    
    print(f'   Datos de entrenamiento: {len(X_train)}')
    print(f'   Datos de validación: {len(X_val)}')
    
    # Escalado de características
    print('\n📐 Creando scaler...')
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_val_scaled = scaler.transform(X_val)
    
    # Entrenar SVR con parámetros optimizados
    print('\n🔧 Entrenando SVR...')
    svr = SVR(
        kernel='rbf',
        C=100,           # Parámetro de regularización
        gamma='scale',   # Parámetro del kernel RBF
        epsilon=0.1      # Tolerancia
    )
    
    start_time = datetime.now()
    svr.fit(X_train_scaled, y_train)
    training_time = datetime.now() - start_time
    
    # Validación
    print('\n📈 Evaluando modelo...')
    y_train_pred = svr.predict(X_train_scaled)
    y_val_pred = svr.predict(X_val_scaled)
    
    # Métricas
    r2_train = r2_score(y_train, y_train_pred)
    r2_val = r2_score(y_val, y_val_pred)
    mae_val = mean_absolute_error(y_val, y_val_pred)
    rmse_val = np.sqrt(mean_squared_error(y_val, y_val_pred))
    
    print(f'   ✅ R² entrenamiento: {r2_train:.4f}')
    print(f'   ✅ R² validación: {r2_val:.4f}')
    print(f'   ✅ MAE validación: {mae_val:.2f}')
    print(f'   ✅ RMSE validación: {rmse_val:.2f}')
    print(f'   ⏱️  Tiempo entrenamiento: {training_time.total_seconds():.1f}s')
    
    return svr, scaler, {
        'r2_train': r2_train,
        'r2_val': r2_val,
        'mae_val': mae_val,
        'rmse_val': rmse_val,
        'training_time': f'{training_time.total_seconds():.1f}s',
        'features': feature_columns
    }

def save_model_and_metadata(svr, scaler, metrics, feature_columns):
    """
    Guarda el modelo, scaler y metadatos
    """
    print('\n💾 Guardando modelo y scaler...')
    
    # Crear directorio si no existe
    os.makedirs('ml/models', exist_ok=True)
    
    # Guardar modelo SVR
    model_file = 'ml/models/mejor_modelo_avanzado_svr.pkl'
    joblib.dump(svr, model_file)
    print(f'   ✅ Modelo guardado: {model_file}')
    
    # Guardar scaler
    scaler_file = 'ml/models/scaler_avanzado.pkl'
    joblib.dump(scaler, scaler_file)
    print(f'   ✅ Scaler guardado: {scaler_file}')
    
    # Actualizar metadatos
    metadata = {
        "models": {
            "svr": {
                "file": "mejor_modelo_avanzado_svr.pkl",
                "scaler": "scaler_avanzado.pkl",
                "type": "SVR",
                "performance": {
                    "r2_score": round(metrics['r2_val'], 4),
                    "mae": round(metrics['mae_val'], 2),
                    "rmse": round(metrics['rmse_val'], 2),
                    "training_time": metrics['training_time']
                },
                "features": feature_columns
            },
            "ridge": {
                "file": "ridge_alpha_10.pkl",
                "scaler": "scaler.pkl",
                "type": "Ridge",
                "performance": {
                    "r2_score": 0.7234,
                    "training_time": "5s"
                },
                "use_case": "fallback_model"
            }
        },
        "default_model": "svr",
        "fallback_model": "ridge",
        "last_updated": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }
    
    metadata_file = 'ml/models/metadata.json'
    with open(metadata_file, 'w', encoding='utf-8') as f:
        json.dump(metadata, f, indent=2)
    print(f'   ✅ Metadatos actualizados: {metadata_file}')

def test_model_quickly(svr, scaler):
    """
    Prueba rápida del modelo entrenado
    """
    print('\n🧪 Prueba rápida del modelo...')
    
    # Estudiante con características altas (debería dar A o AD)
    test_case_high = np.array([[
        40,   # Hours_Studied
        95,   # Attendance  
        2,    # Parental_Involvement (High)
        2,    # Access_to_Resources (High)
        1,    # Extracurricular_Activities (Yes)
        90,   # Previous_Scores
        2,    # Motivation_Level (High)
        3,    # Tutoring_Sessions
        2,    # Family_Income (High)
        2,    # Teacher_Quality (Good)
        2,    # Peer_Influence (Positive)
        0,    # Learning_Disabilities (No)
        2,    # Parental_Education_Level (Master)
        0,    # Distance_from_Home (Near)
        40/95,  # Study_Efficiency
        1,    # High_Support
        1     # Family_Education_Support
    ]])
    
    # Estudiante con características medias (debería dar B o C)
    test_case_medium = np.array([[
        20,   # Hours_Studied
        75,   # Attendance  
        1,    # Parental_Involvement (Medium)
        1,    # Access_to_Resources (Medium)
        0,    # Extracurricular_Activities (No)
        70,   # Previous_Scores
        1,    # Motivation_Level (Medium)
        1,    # Tutoring_Sessions
        1,    # Family_Income (Medium)
        1,    # Teacher_Quality (Average)
        1,    # Peer_Influence (Neutral)
        0,    # Learning_Disabilities (No)
        1,    # Parental_Education_Level (Bachelor)
        1,    # Distance_from_Home (Moderate)
        20/75,  # Study_Efficiency
        0,    # High_Support
        0     # Family_Education_Support
    ]])
    
    # Escalar y predecir
    test_high_scaled = scaler.transform(test_case_high)
    test_medium_scaled = scaler.transform(test_case_medium)
    
    pred_high = svr.predict(test_high_scaled)[0]
    pred_medium = svr.predict(test_medium_scaled)[0]
    
    def get_grade(score):
        if score >= 95: return 'AD'
        elif score >= 85: return 'A'
        elif score >= 75: return 'B'
        elif score >= 65: return 'C'
        elif score >= 60: return 'D'
        else: return 'F'
    
    print(f'   📚 Estudiante excelente: {pred_high:.1f} (Grado {get_grade(pred_high)})')
    print(f'   📖 Estudiante promedio: {pred_medium:.1f} (Grado {get_grade(pred_medium)})')
    
    # Verificar que hay diferencia significativa
    difference = abs(pred_high - pred_medium)
    print(f'   📊 Diferencia entre casos: {difference:.1f} puntos')
    
    if difference > 10:
        print('   ✅ Modelo discrimina bien entre diferentes tipos de estudiantes')
        return True
    else:
        print('   ⚠️  Modelo necesita ajuste - poca discriminación')
        return False

def main():
    print('🎯 REENTRENAMIENTO RÁPIDO SVR')
    print('=' * 50)
    print('📋 Estrategia: KISS + DRY')
    print('   • Usar datos procesados existentes')
    print('   • 14 características (compatible con CSVs)')
    print('   • SVR optimizado para alta performance')
    print()
    
    try:
        # Cargar datos
        df = load_and_prepare_data()
        
        # Entrenar modelo
        svr, scaler, metrics = train_svr_model(df)
        
        # Guardar modelo
        save_model_and_metadata(svr, scaler, metrics, metrics['features'])
        
        # Prueba rápida
        model_ok = test_model_quickly(svr, scaler)
        
        print('\n🏆 RESUMEN DEL REENTRENAMIENTO')
        print('=' * 40)
        print(f'✅ Modelo SVR entrenado exitosamente')
        print(f'📊 R² Score: {metrics["r2_val"]:.4f}')
        print(f'📉 MAE: {metrics["mae_val"]:.2f} puntos')
        print(f'⏱️  Tiempo: {metrics["training_time"]}')
        print(f'🎯 Características: {len(metrics["features"])}')
        
        if model_ok:
            print('\n🚀 SIGUIENTE PASO:')
            print('   1. Reinicia el backend')
            print('   2. Prueba el dataset extremo')
            print('   3. Deberías ver calificaciones A y AD')
        else:
            print('\n⚠️  RECOMENDACIÓN:')
            print('   Revisar hiperparámetros del SVR')
            
    except Exception as e:
        print(f'\n❌ Error durante el reentrenamiento: {e}')
        print(f'   Detalles: {str(e)}')

if __name__ == "__main__":
    main()
