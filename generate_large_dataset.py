#!/usr/bin/env python3
"""
Generador de Dataset Grande para Pruebas
========================================

Genera un CSV con 500-1500 estudiantes para probar
la capacidad del sistema con datasets grandes.
"""

import pandas as pd
import numpy as np
import random

# Configuración
np.random.seed(42)
random.seed(42)

# Número de estudiantes a generar
NUM_STUDENTS = 1000

# Features requeridas por el modelo SVR
SVR_FEATURES = [
    'Hours_Studied', 'Attendance', 'Parental_Involvement', 'Access_to_Resources',
    'Extracurricular_Activities', 'Previous_Scores', 'Motivation_Level', 'Tutoring_Sessions',
    'Family_Income', 'Teacher_Quality', 'Peer_Influence', 'Learning_Disabilities',
    'Parental_Education_Level', 'Distance_from_Home', 'Study_Efficiency', 'High_Support',
    'Family_Education_Support'
]

def generate_realistic_student():
    """Genera datos realistas para un estudiante"""
    
    # Variables base con distribuciones realistas
    hours_studied = np.random.normal(10, 3)  # 10±3 horas
    hours_studied = max(2, min(20, hours_studied))  # Entre 2-20 horas
    
    attendance = np.random.normal(85, 10)  # 85±10%
    attendance = max(40, min(100, attendance))  # Entre 40-100%
    
    previous_scores = np.random.normal(75, 12)  # 75±12 puntos
    previous_scores = max(30, min(95, previous_scores))  # Entre 30-95
    
    # Variables categóricas con distribuciones realistas
    parental_involvement = np.random.choice([0, 1, 2, 3], p=[0.15, 0.35, 0.35, 0.15])
    access_to_resources = np.random.choice([0, 1, 2, 3], p=[0.20, 0.30, 0.30, 0.20])
    extracurricular = np.random.choice([0, 1], p=[0.65, 0.35])
    motivation_level = np.random.choice([0, 1, 2, 3], p=[0.10, 0.25, 0.45, 0.20])
    
    tutoring_sessions = np.random.poisson(1.5)  # Promedio 1.5 sesiones
    tutoring_sessions = min(8, tutoring_sessions)  # Max 8 sesiones
    
    family_income = np.random.choice([0, 1, 2, 3], p=[0.25, 0.35, 0.25, 0.15])
    teacher_quality = np.random.choice([0, 1, 2, 3], p=[0.10, 0.25, 0.45, 0.20])
    peer_influence = np.random.choice([0, 1, 2], p=[0.20, 0.60, 0.20])
    learning_disabilities = np.random.choice([0, 1], p=[0.85, 0.15])
    
    parental_education = np.random.choice([0, 1, 2, 3, 4], p=[0.20, 0.25, 0.25, 0.20, 0.10])
    distance_from_home = np.random.choice([0, 1, 2], p=[0.40, 0.40, 0.20])
    
    # Variables derivadas
    study_efficiency = hours_studied / max(attendance, 1) * 0.01
    study_efficiency = max(0.05, min(0.5, study_efficiency))
    
    high_support = 1 if tutoring_sessions > 2 else 0
    family_education_support = 1 if parental_education >= 2 else 0
    
    return {
        'Hours_Studied': round(hours_studied, 1),
        'Attendance': round(attendance, 1),
        'Parental_Involvement': parental_involvement,
        'Access_to_Resources': access_to_resources,
        'Extracurricular_Activities': extracurricular,
        'Previous_Scores': round(previous_scores, 1),
        'Motivation_Level': motivation_level,
        'Tutoring_Sessions': tutoring_sessions,
        'Family_Income': family_income,
        'Teacher_Quality': teacher_quality,
        'Peer_Influence': peer_influence,
        'Learning_Disabilities': learning_disabilities,
        'Parental_Education_Level': parental_education,
        'Distance_from_Home': distance_from_home,
        'Study_Efficiency': round(study_efficiency, 3),
        'High_Support': high_support,
        'Family_Education_Support': family_education_support
    }

# Generar dataset
print(f"🔄 Generando dataset con {NUM_STUDENTS} estudiantes...")

students_data = []
for i in range(NUM_STUDENTS):
    if i % 100 == 0:
        print(f"  📊 Progreso: {i}/{NUM_STUDENTS} estudiantes")
    
    student = generate_realistic_student()
    students_data.append(student)

# Crear DataFrame
df = pd.DataFrame(students_data)

# Verificar que tenemos todas las columnas requeridas
missing_cols = [col for col in SVR_FEATURES if col not in df.columns]
if missing_cols:
    print(f"❌ Error: Faltan columnas: {missing_cols}")
    exit(1)

# Asegurar orden correcto de columnas
df = df[SVR_FEATURES]

# Guardar CSV
output_file = f"dataset_large_{NUM_STUDENTS}_students.csv"
df.to_csv(output_file, index=False)

print(f"✅ Dataset generado exitosamente:")
print(f"   📄 Archivo: {output_file}")
print(f"   👥 Estudiantes: {len(df)}")
print(f"   📊 Columnas: {len(df.columns)}")
print(f"   📈 Tamaño: {df.memory_usage(deep=True).sum() / 1024:.1f} KB")

# Mostrar estadísticas básicas
print(f"\n📊 Estadísticas del Dataset:")
print(f"   • Horas de estudio: {df['Hours_Studied'].mean():.1f} ± {df['Hours_Studied'].std():.1f}")
print(f"   • Asistencia: {df['Attendance'].mean():.1f}% ± {df['Attendance'].std():.1f}")
print(f"   • Puntajes previos: {df['Previous_Scores'].mean():.1f} ± {df['Previous_Scores'].std():.1f}")
print(f"   • Con tutoría: {(df['Tutoring_Sessions'] > 0).sum()}/{len(df)} ({(df['Tutoring_Sessions'] > 0).mean()*100:.1f}%)")

print(f"\n🚀 Listo para probar con el sistema PredictScore-ML!")
print(f"   Usa este archivo en la interfaz web para probar la predicción de dataset completo.")
