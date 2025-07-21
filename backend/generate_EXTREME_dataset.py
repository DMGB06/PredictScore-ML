#!/usr/bin/env python3
"""
Generador de dataset EXTREMO para garantizar solo calificaciones AD y A
Todos los estudiantes tendrán características PERFECTAS o CASI PERFECTAS
"""

import pandas as pd
import numpy as np
import csv

def calculate_derived_features(hours_studied, attendance, parental_involvement, parental_education_level):
    """
    Calcula las características derivadas exactamente como en el dataset original
    """
    study_efficiency = hours_studied / max(attendance, 1) if attendance > 0 else 0
    high_support = 1 if parental_involvement == 2 else 0
    family_education_support = 1 if parental_education_level == 2 else 0
    
    return study_efficiency, high_support, family_education_support

def generate_extreme_high_performance_students(num_students=50):
    """
    Genera estudiantes con características EXTREMAS para garantizar AD y A
    """
    print('🎯 Generando dataset EXTREMO para calificaciones AD y A...')
    print('⚡ Características PERFECTAS para todos los estudiantes')
    
    students = []
    
    for i in range(num_students):
        if i < 25:  # 50% estudiantes PERFECTOS (AD garantizado)
            hours_studied = np.random.randint(40, 50)  # MÁXIMO estudio
            attendance = np.random.randint(98, 100)    # PERFECTA asistencia
            parental_involvement = 2                   # SIEMPRE High
            access_to_resources = 2                    # SIEMPRE High
            extracurricular_activities = 1             # SIEMPRE Yes
            previous_scores = np.random.randint(95, 100) # HISTORIAL PERFECTO
            motivation_level = 2                       # SIEMPRE High
            tutoring_sessions = 4                      # MÁXIMAS tutorías
            family_income = 2                          # SIEMPRE High
            teacher_quality = 2                        # SIEMPRE Good
            peer_influence = 2                         # SIEMPRE Positive
            learning_disabilities = 0                  # NUNCA disabilities
            parental_education_level = 2               # SIEMPRE Master
            distance_from_home = 0                     # SIEMPRE Near
            
        else:  # 50% estudiantes CASI PERFECTOS (A garantizado)
            hours_studied = np.random.randint(35, 45)  # MUY ALTO estudio
            attendance = np.random.randint(95, 99)     # MUY ALTA asistencia
            parental_involvement = 2                   # SIEMPRE High
            access_to_resources = 2                    # SIEMPRE High
            extracurricular_activities = 1             # SIEMPRE Yes
            previous_scores = np.random.randint(88, 96) # EXCELENTE historial
            motivation_level = 2                       # SIEMPRE High
            tutoring_sessions = np.random.randint(3, 4) # MUCHAS tutorías
            family_income = 2                          # SIEMPRE High
            teacher_quality = 2                        # SIEMPRE Good
            peer_influence = 2                         # SIEMPRE Positive
            learning_disabilities = 0                  # NUNCA disabilities
            parental_education_level = 2               # SIEMPRE Master
            distance_from_home = 0                     # SIEMPRE Near
        
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
    print('🎓 GENERADOR DE DATASET EXTREMO PARA GARANTIZAR AD/A')
    print('=' * 65)
    print('🔥 CONFIGURACIÓN EXTREMA:')
    print('   - Horas de estudio: 35-50 (vs normal 5-20)')
    print('   - Asistencia: 95-100% (vs normal 60-100%)')
    print('   - Puntajes previos: 88-100 (vs normal 50-100)')
    print('   - TODAS las características en nivel MÁXIMO')
    print('   - CERO discapacidades de aprendizaje')
    print('   - MÁXIMO apoyo familiar y recursos')
    
    # Generar estudiantes extremos
    students = generate_extreme_high_performance_students(50)
    
    # Guardar en formato CSV correcto
    output_file = 'test_EXTREME_grades.csv'
    save_dataset_csv_format(students, output_file)
    
    # Análisis del dataset generado
    df = pd.DataFrame(students)
    
    print('\n📊 ESTADÍSTICAS DEL DATASET EXTREMO')
    print('-' * 40)
    print(f'Total de estudiantes: {len(df)}')
    print(f'Horas de estudio promedio: {df["Hours_Studied"].mean():.1f} (EXTREMO)')
    print(f'Horas de estudio rango: {df["Hours_Studied"].min()}-{df["Hours_Studied"].max()} (MÁXIMO)')
    print(f'Asistencia promedio: {df["Attendance"].mean():.1f}% (PERFECTA)')
    print(f'Asistencia rango: {df["Attendance"].min()}-{df["Attendance"].max()}% (PERFECTA)')
    print(f'Puntajes previos promedio: {df["Previous_Scores"].mean():.1f} (EXCELENTE)')
    print(f'Puntajes previos rango: {df["Previous_Scores"].min()}-{df["Previous_Scores"].max()} (PERFECTO)')
    
    print('\n🎯 VERIFICACIÓN DE CARACTERÍSTICAS EXTREMAS')
    print('-' * 50)
    print(f'✅ Involucramiento parental ALTO (2): {(df["Parental_Involvement"] == 2).sum()}/50 (100%)')
    print(f'✅ Alto acceso a recursos (2): {(df["Access_to_Resources"] == 2).sum()}/50 (100%)')
    print(f'✅ Actividades extracurriculares (1): {(df["Extracurricular_Activities"] == 1).sum()}/50 (100%)')
    print(f'✅ Alta motivación (2): {(df["Motivation_Level"] == 2).sum()}/50 (100%)')
    print(f'✅ Calidad de profesor BUENA (2): {(df["Teacher_Quality"] == 2).sum()}/50 (100%)')
    print(f'✅ Influencia de pares POSITIVA (2): {(df["Peer_Influence"] == 2).sum()}/50 (100%)')
    print(f'✅ SIN discapacidades (0): {(df["Learning_Disabilities"] == 0).sum()}/50 (100%)')
    print(f'✅ Educación parental MÁSTER (2): {(df["Parental_Education_Level"] == 2).sum()}/50 (100%)')
    print(f'✅ Distancia CERCA (0): {(df["Distance_from_Home"] == 0).sum()}/50 (100%)')
    print(f'✅ Ingresos familiares ALTOS (2): {(df["Family_Income"] == 2).sum()}/50 (100%)')
    
    print(f'\n✅ Dataset EXTREMO guardado como: {output_file}')
    
    # Mostrar primeras filas para verificación
    print('\n📋 PRIMERAS 3 FILAS DEL DATASET EXTREMO:')
    print('-' * 60)
    with open(output_file, 'r') as f:
        lines = f.readlines()
        for i, line in enumerate(lines[:4]):
            print(f'Línea {i}: {line.strip()[:100]}...')
    
    print('\n🎯 EXPECTATIVA EXTREMA:')
    print('   🏆 50% estudiantes deberían obtener AD (95-100)')
    print('   🥇 50% estudiantes deberían obtener A alto (90-94)')
    print('   ❌ CERO estudiantes con B, C, D, o F')
    print('   ✅ 100% de estudiantes con A o AD garantizado')
    
    print(f'\n🚀 PRUEBA INMEDIATA:')
    print(f'   1. Inicia el backend: python -m uvicorn main:app --host 127.0.0.1 --port 8001')
    print(f'   2. Ejecuta: python test_extreme_grades.py')

if __name__ == "__main__":
    main()
