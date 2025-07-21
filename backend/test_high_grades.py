#!/usr/bin/env python3
"""
Script para probar que el dataset optimizado genere solo calificaciones A y AD
"""

import requests
import pandas as pd
import numpy as np
import json
from collections import Counter

def test_high_grades_dataset():
    print('🎯 PRUEBA DE DATASET OPTIMIZADO PARA CALIFICACIONES ALTAS')
    print('=' * 65)
    
    # Cargar el dataset generado
    try:
        df = pd.read_csv('test_high_grades_only_corrected.csv')
        print(f'✅ Dataset cargado: {len(df)} estudiantes optimizados')
    except Exception as e:
        print(f'❌ Error cargando dataset: {e}')
        return
    
    # Verificar conectividad del backend
    try:
        response = requests.get('http://127.0.0.1:8001/health', timeout=5)
        health = response.json()
        print(f'✅ Backend conectado: {health["status"]}')
        print(f'   Modelo cargado: {health["model_loaded"]}')
    except Exception as e:
        print(f'❌ Backend no disponible: {e}')
        return
    
    print('\n📊 REALIZANDO PREDICCIONES PARA TODOS LOS ESTUDIANTES')
    print('-' * 55)
    
    # Mapeos para conversión
    parental_inv_map = {0: 'Low', 1: 'Medium', 2: 'High'}
    access_map = {0: 'Low', 1: 'Medium', 2: 'High'}
    extrac_map = {0: 'No', 1: 'Yes'}
    motiv_map = {0: 'Low', 1: 'Medium', 2: 'High'}
    income_map = {0: 'Low', 1: 'Medium', 2: 'High'}
    teacher_map = {0: 'Poor', 1: 'Average', 2: 'Good'}
    peer_map = {0: 'Negative', 1: 'Neutral', 2: 'Positive'}
    learn_dis_map = {0: 'No', 1: 'Yes'}
    parent_edu_map = {0: 'High School', 1: 'Bachelor', 2: 'Master'}
    distance_map = {0: 'Near', 1: 'Moderate', 2: 'Far'}
    
    predictions = []
    letter_grades = []
    failed_predictions = 0
    
    print('ID       | Horas | Asist | Prev | Predicción | Nota | Estado')
    print('-' * 60)
    
    for idx, row in df.iterrows():
        
        # Convertir a formato API usando las columnas del CSV directamente
        test_data = {
            'study_hours': float(row['Hours_Studied']),
            'attendance': float(row['Attendance']),
            'previous_scores': float(row['Previous_Scores']),
            'parental_involvement': parental_inv_map[int(row['Parental_Involvement'])],
            'access_to_resources': access_map[int(row['Access_to_Resources'])],
            'extracurricular_activities': extrac_map[int(row['Extracurricular_Activities'])],
            'motivation_level': motiv_map[int(row['Motivation_Level'])],
            'tutoring_sessions': float(row['Tutoring_Sessions']),
            'family_income': income_map[int(row['Family_Income'])],
            'teacher_quality': teacher_map[int(row['Teacher_Quality'])],
            'peer_influence': peer_map[int(row['Peer_Influence'])],
            'learning_disabilities': learn_dis_map[int(row['Learning_Disabilities'])],
            'parental_education_level': parent_edu_map[int(row['Parental_Education_Level'])],
            'distance_from_home': distance_map[int(row['Distance_from_Home'])]
        }
        
        try:
            response = requests.post('http://127.0.0.1:8001/api/v1/predictions/predict', 
                                   json=test_data, timeout=5)
            if response.status_code == 200:
                result = response.json()
                pred = result['prediction_100']
                letter = result['letter_grade']
                
                predictions.append(pred)
                letter_grades.append(letter)
                
                # Determinar estado basado en la calificación
                if letter in ['A', 'AD']:
                    status = '✅ OBJETIVO'
                elif letter == 'B':
                    status = '⚠️  B'
                else:
                    status = '❌ BAJO'
                
                print(f'{idx+1:2d}/50 | {row["Hours_Studied"]:5.0f} | {row["Attendance"]:5.0f} | {row["Previous_Scores"]:4.0f} | {pred:8.1f} | {letter:2s}  | {status}')
            else:
                print(f'{idx+1:2d}/50 | {row["Hours_Studied"]:5.0f} | {row["Attendance"]:5.0f} | {row["Previous_Scores"]:4.0f} | ERROR {response.status_code}')
                failed_predictions += 1
        except Exception as e:
            print(f'{idx+1:2d}/50 | {row["Hours_Studied"]:5.0f} | {row["Attendance"]:5.0f} | {row["Previous_Scores"]:4.0f} | ERROR: {str(e)[:20]}')
            failed_predictions += 1
    
    # Análisis de resultados
    if predictions:
        pred_array = np.array(predictions)
        grade_counts = Counter(letter_grades)
        
        print('\n📈 ANÁLISIS DE RESULTADOS')
        print('=' * 35)
        
        print(f'Predicciones exitosas: {len(predictions)}/{len(df)}')
        if failed_predictions > 0:
            print(f'Predicciones fallidas: {failed_predictions}')
        
        print(f'\n📊 DISTRIBUCIÓN DE CALIFICACIONES')
        print('-' * 35)
        for grade in ['AD', 'A', 'B', 'C', 'D', 'F']:
            count = grade_counts.get(grade, 0)
            percentage = (count / len(predictions)) * 100 if predictions else 0
            stars = '★' * min(int(percentage / 5), 20)  # Visual representation
            print(f'{grade:2s}: {count:2d} estudiantes ({percentage:5.1f}%) {stars}')
        
        print(f'\n🎯 OBJETIVO: SOLO CALIFICACIONES A Y AD')
        print('-' * 40)
        a_and_ad_count = grade_counts.get('A', 0) + grade_counts.get('AD', 0)
        success_rate = (a_and_ad_count / len(predictions)) * 100 if predictions else 0
        
        if success_rate >= 90:
            print(f'✅ ÉXITO EXCELENTE: {success_rate:.1f}% A/AD')
            print('   🏆 Dataset optimizado funcionando perfectamente')
        elif success_rate >= 80:
            print(f'✅ ÉXITO BUENO: {success_rate:.1f}% A/AD')
            print('   👍 Dataset bien optimizado')
        elif success_rate >= 70:
            print(f'⚠️  ÉXITO PARCIAL: {success_rate:.1f}% A/AD')
            print('   📝 Dataset necesita más optimización')
        else:
            print(f'❌ OBJETIVO NO ALCANZADO: {success_rate:.1f}% A/AD')
            print('   🔧 Dataset requiere reconfiguración')
        
        print(f'\n📋 ESTADÍSTICAS NUMÉRICAS')
        print('-' * 30)
        print(f'Puntuación promedio: {pred_array.mean():.1f}')
        print(f'Puntuación mínima: {pred_array.min():.1f}')
        print(f'Puntuación máxima: {pred_array.max():.1f}')
        print(f'Desviación estándar: {pred_array.std():.1f}')
        print(f'Rango de puntuaciones: {pred_array.max() - pred_array.min():.1f}')
        
        # Verificar variación (importante después del fix)
        unique_scores = len(np.unique(np.round(pred_array, 1)))
        print(f'\n🔄 VARIACIÓN DE PREDICCIONES')
        print('-' * 30)
        print(f'Puntuaciones únicas: {unique_scores}')
        if unique_scores > 40:
            print('✅ Excelente variación en las predicciones')
        elif unique_scores > 30:
            print('✅ Buena variación en las predicciones')
        elif unique_scores > 20:
            print('⚠️  Variación moderada en las predicciones')
        else:
            print('❌ Poca variación - posible problema con el modelo')
        
        return {
            'total_predictions': len(predictions),
            'a_and_ad_count': a_and_ad_count,
            'success_rate': success_rate,
            'grade_distribution': dict(grade_counts),
            'avg_score': pred_array.mean(),
            'unique_scores': unique_scores
        }
    
    else:
        print('❌ No se pudieron obtener predicciones')
        return None

if __name__ == "__main__":
    result = test_high_grades_dataset()
    
    if result:
        print('\n🏁 RESUMEN FINAL')
        print('=' * 20)
        if result['success_rate'] >= 80:
            print('🎉 El dataset está optimizado correctamente para generar calificaciones altas!')
        else:
            print('🔧 El dataset necesita más ajustes para maximizar calificaciones A/AD')
