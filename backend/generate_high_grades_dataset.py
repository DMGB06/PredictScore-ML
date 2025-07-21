#!/usr/bin/env python3
"""
Generador de dataset optimizado para calificaciones A y AD
Crea estudiantes con características que favorecen altas puntuaciones
"""

import pandas as pd
import numpy as np
from itertools import product

def generate_high_performance_students(num_students=50):
    """
    Genera estudiantes con características optimizadas para altas calificaciones
    Basado en el análisis del modelo SVR para maximizar predicciones A (85-94) y AD (95-100)
    """
    print('🎯 Generando dataset optimizado para calificaciones A y AD...')
    
    students = []
    
    # Configuraciones que favorecen altas calificaciones
    high_performance_configs = [
        # Configuración 1: Estudiante excepcional
        {
            'Hours_Studied': np.random.uniform(8, 10),  # Muchas horas de estudio
            'Attendance': np.random.uniform(95, 100),   # Asistencia perfecta
            'Previous_Scores': np.random.uniform(85, 95), # Historial excelente
            'Parental_Involvement': 2,  # High
            'Access_to_Resources': 2,   # High
            'Extracurricular_Activities': 1,  # Yes
            'Motivation_Level': 2,      # High
            'Tutoring_Sessions': np.random.uniform(3, 4),  # Muchas tutorías
            'Family_Income': 2,         # High
            'Teacher_Quality': 2,       # Good
            'Peer_Influence': 2,        # Positive
            'Learning_Disabilities': 0, # No
            'Parental_Education_Level': 2,  # Master
            'Distance_from_Home': 0     # Near
        },
        
        # Configuración 2: Estudiante muy dedicado
        {
            'Hours_Studied': np.random.uniform(7, 9),
            'Attendance': np.random.uniform(90, 98),
            'Previous_Scores': np.random.uniform(80, 90),
            'Parental_Involvement': 2,  # High
            'Access_to_Resources': 2,   # High
            'Extracurricular_Activities': 1,  # Yes
            'Motivation_Level': 2,      # High
            'Tutoring_Sessions': np.random.uniform(2, 4),
            'Family_Income': 1,         # Medium-High
            'Teacher_Quality': 2,       # Good
            'Peer_Influence': 2,        # Positive
            'Learning_Disabilities': 0, # No
            'Parental_Education_Level': 1,  # Bachelor
            'Distance_from_Home': 0     # Near
        },
        
        # Configuración 3: Estudiante con recursos excelentes
        {
            'Hours_Studied': np.random.uniform(6, 8),
            'Attendance': np.random.uniform(88, 95),
            'Previous_Scores': np.random.uniform(82, 92),
            'Parental_Involvement': 2,  # High
            'Access_to_Resources': 2,   # High
            'Extracurricular_Activities': 1,  # Yes
            'Motivation_Level': 2,      # High
            'Tutoring_Sessions': np.random.uniform(3, 4),
            'Family_Income': 2,         # High
            'Teacher_Quality': 2,       # Good
            'Peer_Influence': 1,        # Neutral-Positive
            'Learning_Disabilities': 0, # No
            'Parental_Education_Level': 2,  # Master
            'Distance_from_Home': 1     # Moderate
        },
        
        # Configuración 4: Estudiante motivado con buen entorno
        {
            'Hours_Studied': np.random.uniform(7.5, 9.5),
            'Attendance': np.random.uniform(92, 99),
            'Previous_Scores': np.random.uniform(83, 93),
            'Parental_Involvement': 2,  # High
            'Access_to_Resources': 1,   # Medium-High
            'Extracurricular_Activities': 1,  # Yes
            'Motivation_Level': 2,      # High
            'Tutoring_Sessions': np.random.uniform(2, 3),
            'Family_Income': 2,         # High
            'Teacher_Quality': 2,       # Good
            'Peer_Influence': 2,        # Positive
            'Learning_Disabilities': 0, # No
            'Parental_Education_Level': 1,  # Bachelor
            'Distance_from_Home': 0     # Near
        }
    ]
    
    # Generar estudiantes usando las configuraciones
    config_weights = [0.3, 0.25, 0.25, 0.2]  # Probabilidades para cada configuración
    
    for i in range(num_students):
        # Seleccionar configuración aleatoriamente
        config_idx = np.random.choice(len(high_performance_configs), p=config_weights)
        base_config = high_performance_configs[config_idx].copy()
        
        # Agregar pequeñas variaciones para realismo
        student = {}
        for key, value in base_config.items():
            if isinstance(value, (int, float)) and key not in ['Parental_Involvement', 'Access_to_Resources', 
                                                              'Extracurricular_Activities', 'Motivation_Level',
                                                              'Family_Income', 'Teacher_Quality', 'Peer_Influence',
                                                              'Learning_Disabilities', 'Parental_Education_Level',
                                                              'Distance_from_Home']:
                # Agregar variación a variables continuas
                if key == 'Hours_Studied':
                    student[key] = np.clip(value + np.random.normal(0, 0.3), 5, 10)
                elif key == 'Attendance':
                    student[key] = np.clip(value + np.random.normal(0, 2), 85, 100)
                elif key == 'Previous_Scores':
                    student[key] = np.clip(value + np.random.normal(0, 3), 75, 95)
                elif key == 'Tutoring_Sessions':
                    student[key] = np.clip(value + np.random.normal(0, 0.5), 1, 4)
                else:
                    student[key] = value
            else:
                student[key] = value
        
        # Agregar ID del estudiante
        student['Student_ID'] = f'HS_{i+1:03d}'
        
        students.append(student)
    
    # Crear DataFrame
    df = pd.DataFrame(students)
    
    # Reordenar columnas para que coincida con el formato esperado
    column_order = [
        'Student_ID', 'Hours_Studied', 'Attendance', 'Previous_Scores',
        'Parental_Involvement', 'Access_to_Resources', 'Extracurricular_Activities',
        'Motivation_Level', 'Tutoring_Sessions', 'Family_Income', 'Teacher_Quality',
        'Peer_Influence', 'Learning_Disabilities', 'Parental_Education_Level',
        'Distance_from_Home'
    ]
    
    df = df[column_order]
    
    return df

def add_edge_cases(df):
    """
    Agregar algunos casos extremos para validar el modelo
    """
    print('📝 Agregando casos extremos para validación...')
    
    # Caso extremo 1: Estudiante perfecto
    perfect_student = {
        'Student_ID': 'HS_PERFECT',
        'Hours_Studied': 10.0,
        'Attendance': 100.0,
        'Previous_Scores': 95.0,
        'Parental_Involvement': 2,
        'Access_to_Resources': 2,
        'Extracurricular_Activities': 1,
        'Motivation_Level': 2,
        'Tutoring_Sessions': 4.0,
        'Family_Income': 2,
        'Teacher_Quality': 2,
        'Peer_Influence': 2,
        'Learning_Disabilities': 0,
        'Parental_Education_Level': 2,
        'Distance_from_Home': 0
    }
    
    # Caso extremo 2: Estudiante excepcional pero con ligeras limitaciones
    excellent_student = {
        'Student_ID': 'HS_EXCELLENT',
        'Hours_Studied': 9.0,
        'Attendance': 98.0,
        'Previous_Scores': 90.0,
        'Parental_Involvement': 2,
        'Access_to_Resources': 2,
        'Extracurricular_Activities': 1,
        'Motivation_Level': 2,
        'Tutoring_Sessions': 3.0,
        'Family_Income': 1,  # Medium income
        'Teacher_Quality': 2,
        'Peer_Influence': 2,
        'Learning_Disabilities': 0,
        'Parental_Education_Level': 1,  # Bachelor
        'Distance_from_Home': 0
    }
    
    # Caso extremo 3: Muy bueno con algunos desafíos
    very_good_student = {
        'Student_ID': 'HS_VERYGOOD',
        'Hours_Studied': 8.0,
        'Attendance': 95.0,
        'Previous_Scores': 85.0,
        'Parental_Involvement': 1,  # Medium
        'Access_to_Resources': 2,
        'Extracurricular_Activities': 1,
        'Motivation_Level': 2,
        'Tutoring_Sessions': 2.5,
        'Family_Income': 2,
        'Teacher_Quality': 2,
        'Peer_Influence': 1,  # Neutral
        'Learning_Disabilities': 0,
        'Parental_Education_Level': 2,
        'Distance_from_Home': 1  # Moderate
    }
    
    # Agregar casos al DataFrame
    edge_cases = pd.DataFrame([perfect_student, excellent_student, very_good_student])
    df_extended = pd.concat([df, edge_cases], ignore_index=True)
    
    return df_extended

def main():
    print('🎓 GENERADOR DE DATASET PARA CALIFICACIONES ALTAS')
    print('=' * 60)
    
    # Generar dataset base
    df = generate_high_performance_students(47)  # 47 + 3 casos extremos = 50 total
    
    # Agregar casos extremos
    df = add_edge_cases(df)
    
    # Estadísticas del dataset generado
    print('\n📊 ESTADÍSTICAS DEL DATASET GENERADO')
    print('-' * 40)
    print(f'Total de estudiantes: {len(df)}')
    print(f'Horas de estudio promedio: {df["Hours_Studied"].mean():.1f}')
    print(f'Asistencia promedio: {df["Attendance"].mean():.1f}%')
    print(f'Puntajes previos promedio: {df["Previous_Scores"].mean():.1f}')
    print(f'Estudiantes con involucramiento parental alto: {(df["Parental_Involvement"] == 2).sum()}')
    print(f'Estudiantes con alto acceso a recursos: {(df["Access_to_Resources"] == 2).sum()}')
    print(f'Estudiantes con actividades extracurriculares: {(df["Extracurricular_Activities"] == 1).sum()}')
    print(f'Estudiantes con alta motivación: {(df["Motivation_Level"] == 2).sum()}')
    
    # Guardar dataset
    output_file = 'test_high_grades_only.csv'
    df.to_csv(output_file, index=False)
    print(f'\n✅ Dataset guardado como: {output_file}')
    
    # Mostrar primeras filas
    print('\n📋 PRIMERAS 5 FILAS DEL DATASET:')
    print(df.head().to_string(index=False))
    
    print('\n🎯 PREDICCIÓN ESPERADA:')
    print('   - La mayoría de estudiantes deberían obtener calificaciones A (85-94)')
    print('   - Varios estudiantes deberían obtener calificaciones AD (95-100)')
    print('   - Casos extremos deberían estar en el rango AD')
    print(f'\n   Ejecuta: python validate_fix.py con este dataset para verificar')

if __name__ == "__main__":
    main()
