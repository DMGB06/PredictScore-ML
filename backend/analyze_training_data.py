#!/usr/bin/env python3
"""
Diagnóstico rápido de los datos de entrenamiento
"""

import pandas as pd
import numpy as np

def analyze_training_data():
    print('📊 ANÁLISIS DE DATOS DE ENTRENAMIENTO')
    print('=' * 45)
    
    # Cargar datos
    try:
        df_train = pd.read_csv('ml/data/processed/train_student_performance.csv')
        df_test = pd.read_csv('ml/data/processed/test_student_performance.csv')
        df = pd.concat([df_train, df_test], ignore_index=True)
        
        print(f'Total registros: {len(df)}')
        print(f'Exam_Score estadísticas:')
        print(f'  Mínimo: {df["Exam_Score"].min()}')
        print(f'  Máximo: {df["Exam_Score"].max()}')
        print(f'  Promedio: {df["Exam_Score"].mean():.1f}')
        print(f'  Mediana: {df["Exam_Score"].median()}')
        
        print(f'\n📈 DISTRIBUCIÓN POR RANGOS:')
        ranges = [
            (95, 100, 'AD'),
            (85, 94, 'A'),
            (75, 84, 'B'), 
            (65, 74, 'C'),
            (60, 64, 'D'),
            (0, 59, 'F')
        ]
        
        for min_val, max_val, grade in ranges:
            count = len(df[(df['Exam_Score'] >= min_val) & (df['Exam_Score'] <= max_val)])
            pct = (count / len(df)) * 100
            print(f'  {grade} ({min_val:2d}-{max_val:2d}): {count:4d} ({pct:5.1f}%)')
        
        print(f'\n🔥 ESTUDIANTES CON CALIFICACIONES ALTAS:')
        high_scores = df[df['Exam_Score'] >= 85]
        print(f'  A o mejor (85+): {len(high_scores)} ({100*len(high_scores)/len(df):.1f}%)')
        
        if len(high_scores) > 0:
            print(f'\n📝 CARACTERÍSTICAS DE ESTUDIANTES CON A+ (muestra):')
            cols = ['Hours_Studied', 'Attendance', 'Previous_Scores', 'Exam_Score']
            sample = high_scores.head(5)[cols]
            print(sample.to_string(index=False))
        else:
            print('\n❌ NO HAY ESTUDIANTES CON CALIFICACIONES A EN LOS DATOS!')
            print('   Esto explica por qué el modelo no puede predecir A o AD')
            
    except Exception as e:
        print(f'Error: {e}')

if __name__ == "__main__":
    analyze_training_data()
