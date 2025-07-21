#!/usr/bin/env python3
"""
Generador de dataset optimizado para calificaciones A y AD
VERSIÓN CORREGIDA - Usa exactamente las mismas columnas que test_without_exam_score.csv
"""

import pandas as pd
import numpy as np
import csv

def calculate_derived_features(hours_studied, attendance, parental_involvement, parental_education_level):
    """
    Calcula las características derivadas exactamente como en el dataset original
    """
    # Study_Efficiency = Hours_Studied / Attendance (normalizado)
    study_efficiency = hours_studied / max(attendance, 1) if attendance > 0 else 0
    
    # High_Support = 1 si Parental_Involvement == 2 (High), 0 otherwise
    high_support = 1 if parental_involvement == 2 else 0
    
    # Family_Education_Support = 1 si Parental_Education_Level == 2 (Master), 0 otherwise  
    family_education_support = 1 if parental_education_level == 2 else 0
    
    return study_efficiency, high_support, family_education_support

def generate_high_performance_students(num_students=50):
    """
    Genera estudiantes optimizados para calificaciones A y AD
    Mantiene el formato exacto del dataset original
    """
    print('🎯 Generando dataset optimizado para calificaciones A y AD...')
    print('📋 Formato: test_without_exam_score.csv compatible')
    
    students = []
    
    # Configuraciones optimizadas para altas calificaciones
    for i in range(num_students):
        if i < 15:  # 30% estudiantes excepcionales (AD esperado)
            hours_studied = np.random.randint(35, 45)  # Muchas horas
            attendance = np.random.randint(95, 100)    # Asistencia excelente
            parental_involvement = 2                   # High
            access_to_resources = 2                    # High
            extracurricular_activities = 1             # Yes
            previous_scores = np.random.randint(90, 98) # Historial excelente
            motivation_level = 2                       # High
            tutoring_sessions = np.random.randint(3, 5) # Muchas tutorías
            family_income = 2                          # High
            teacher_quality = 2                        # Good
            peer_influence = 2                         # Positive
            learning_disabilities = 0                  # No
            parental_education_level = 2               # Master
            distance_from_home = 0                     # Near
            
        elif i < 35:  # 40% estudiantes muy buenos (A esperado)
            hours_studied = np.random.randint(28, 38)
            attendance = np.random.randint(88, 96)
            parental_involvement = np.random.choice([1, 2], p=[0.2, 0.8])  # Mostly High
            access_to_resources = np.random.choice([1, 2], p=[0.3, 0.7])   # Mostly High
            extracurricular_activities = 1
            previous_scores = np.random.randint(85, 93)
            motivation_level = 2                       # High
            tutoring_sessions = np.random.randint(2, 4)
            family_income = np.random.choice([1, 2], p=[0.4, 0.6])
            teacher_quality = 2                        # Good
            peer_influence = np.random.choice([1, 2], p=[0.3, 0.7])
            learning_disabilities = 0                  # No
            parental_education_level = np.random.choice([1, 2], p=[0.4, 0.6])
            distance_from_home = np.random.choice([0, 1], p=[0.7, 0.3])
            
        else:  # 30% estudiantes buenos (A bajo esperado)
            hours_studied = np.random.randint(24, 32)
            attendance = np.random.randint(82, 92)
            parental_involvement = np.random.choice([1, 2], p=[0.4, 0.6])
            access_to_resources = np.random.choice([1, 2], p=[0.5, 0.5])
            extracurricular_activities = np.random.choice([0, 1], p=[0.2, 0.8])
            previous_scores = np.random.randint(80, 88)
            motivation_level = np.random.choice([1, 2], p=[0.3, 0.7])
            tutoring_sessions = np.random.randint(1, 3)
            family_income = np.random.choice([1, 2], p=[0.6, 0.4])
            teacher_quality = np.random.choice([1, 2], p=[0.3, 0.7])
            peer_influence = np.random.choice([1, 2], p=[0.4, 0.6])
            learning_disabilities = 0
            parental_education_level = np.random.choice([0, 1, 2], p=[0.2, 0.5, 0.3])
            distance_from_home = np.random.choice([0, 1, 2], p=[0.5, 0.4, 0.1])
        
        # Calcular características derivadas
        study_efficiency, high_support, family_education_support = calculate_derived_features(
            hours_studied, attendance, parental_involvement, parental_education_level
        )
        
        # Crear registro del estudiante
        student = {
            'Hours_Studied': hours_studied,
            'Attendance': attendance,
            'Parental_Involvement': parental_involvement,
            'Access_to_Resources': access_to_resources,
            'Extracurricular_Activities': extracurricular_activities,
            'Previous_Scores': previous_scores,
            'Motivation_Level': motivation_level,
            'Tutoring_Sessions': tutoring_sessions,
            'Family_Income': family_income,
            'Teacher_Quality': teacher_quality,
            'Peer_Influence': peer_influence,
            'Learning_Disabilities': learning_disabilities,
            'Parental_Education_Level': parental_education_level,
            'Distance_from_Home': distance_from_home,
            'Study_Efficiency': study_efficiency,
            'High_Support': high_support,
            'Family_Education_Support': family_education_support
        }
        
        students.append(student)
    
    return students

def save_dataset_csv_format(students, filename):
    """
    Guarda el dataset en formato CSV exactamente como el original
    """
    # Orden exacto de columnas del dataset original
    column_order = [
        'Hours_Studied', 'Attendance', 'Parental_Involvement', 'Access_to_Resources',
        'Extracurricular_Activities', 'Previous_Scores', 'Motivation_Level', 
        'Tutoring_Sessions', 'Family_Income', 'Teacher_Quality', 'Peer_Influence',
        'Learning_Disabilities', 'Parental_Education_Level', 'Distance_from_Home',
        'Study_Efficiency', 'High_Support', 'Family_Education_Support'
    ]
    
    with open(filename, 'w', newline='', encoding='utf-8') as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=column_order, quoting=csv.QUOTE_ALL)
        writer.writeheader()
        writer.writerows(students)

def main():
    print('🎓 GENERADOR DE DATASET PARA CALIFICACIONES ALTAS (FORMATO CORREGIDO)')
    print('=' * 70)
    
    # Generar estudiantes optimizados
    students = generate_high_performance_students(50)
    
    # Guardar en formato CSV correcto
    output_file = 'test_high_grades_only_corrected.csv'
    save_dataset_csv_format(students, output_file)
    
    # Análisis del dataset generado
    df = pd.DataFrame(students)
    
    print('\n📊 ESTADÍSTICAS DEL DATASET GENERADO')
    print('-' * 40)
    print(f'Total de estudiantes: {len(df)}')
    print(f'Horas de estudio promedio: {df["Hours_Studied"].mean():.1f}')
    print(f'Horas de estudio rango: {df["Hours_Studied"].min()}-{df["Hours_Studied"].max()}')
    print(f'Asistencia promedio: {df["Attendance"].mean():.1f}%')
    print(f'Asistencia rango: {df["Attendance"].min()}-{df["Attendance"].max()}%')
    print(f'Puntajes previos promedio: {df["Previous_Scores"].mean():.1f}')
    print(f'Puntajes previos rango: {df["Previous_Scores"].min()}-{df["Previous_Scores"].max()}')
    
    print('\n🎯 DISTRIBUCIÓN DE CARACTERÍSTICAS CLAVE')
    print('-' * 45)
    print(f'Involucramiento parental alto (2): {(df["Parental_Involvement"] == 2).sum()}/50')
    print(f'Alto acceso a recursos (2): {(df["Access_to_Resources"] == 2).sum()}/50')
    print(f'Actividades extracurriculares (1): {(df["Extracurricular_Activities"] == 1).sum()}/50')
    print(f'Alta motivación (2): {(df["Motivation_Level"] == 2).sum()}/50')
    print(f'Calidad de profesor buena (2): {(df["Teacher_Quality"] == 2).sum()}/50')
    print(f'Influencia de pares positiva (2): {(df["Peer_Influence"] == 2).sum()}/50')
    print(f'Sin discapacidades de aprendizaje: {(df["Learning_Disabilities"] == 0).sum()}/50')
    print(f'Educación parental nivel máster (2): {(df["Parental_Education_Level"] == 2).sum()}/50')
    
    print(f'\n✅ Dataset guardado como: {output_file}')
    print(f'📝 Formato idéntico a: test_without_exam_score.csv')
    
    # Mostrar primeras filas para verificación
    print('\n📋 PRIMERAS 3 FILAS DEL DATASET:')
    print('-' * 50)
    with open(output_file, 'r') as f:
        lines = f.readlines()
        for i, line in enumerate(lines[:4]):  # Header + 3 filas
            print(f'Línea {i}: {line.strip()}')
    
    print('\n🎯 PREDICCIÓN ESPERADA:')
    print('   ✓ 30% estudiantes deberían obtener AD (95-100)')
    print('   ✓ 40% estudiantes deberían obtener A (85-94)')
    print('   ✓ 30% estudiantes deberían obtener A alto (88-94)')
    print('   ✓ Formato compatible con el backend actual')
    
    print(f'\n🚀 SIGUIENTE PASO:')
    print(f'   python test_high_grades.py (después de actualizar con el archivo correcto)')

if __name__ == "__main__":
    main()
