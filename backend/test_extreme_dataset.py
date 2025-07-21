#!/usr/bin/env python3
"""
Script para probar el dataset EXTREMO que debería generar SOLO calificaciones A y AD
"""

import requests
import pandas as pd
import numpy as np
import json
from collections import Counter
import time

def test_extreme_dataset():
    print('🎯 PRUEBA DE DATASET EXTREMO PARA CALIFICACIONES AD/A')
    print('=' * 65)
    
    # Cargar el dataset extremo
    try:
        df = pd.read_csv('test_EXTREME_grades.csv')
        print(f'✅ Dataset EXTREMO cargado: {len(df)} estudiantes')
        print(f'   Rango horas: {df["Hours_Studied"].min()}-{df["Hours_Studied"].max()}')
        print(f'   Rango asistencia: {df["Attendance"].min()}-{df["Attendance"].max()}%')
        print(f'   Rango puntajes previos: {df["Previous_Scores"].min()}-{df["Previous_Scores"].max()}')
    except Exception as e:
        print(f'❌ Error cargando dataset: {e}')
        return
    
    # Verificar conectividad del backend
    print('\n🔌 Verificando backend...')
    for attempt in range(5):
        try:
            response = requests.get('http://127.0.0.1:8001/health', timeout=3)
            health = response.json()
            print(f'✅ Backend conectado: {health["status"]}')
            print(f'   Modelo cargado: {health["model_loaded"]}')
            break
        except Exception as e:
            if attempt < 4:
                print(f'⏳ Intento {attempt + 1}/5 - Esperando backend...')
                time.sleep(2)
            else:
                print(f'❌ Backend no disponible después de 5 intentos: {e}')
                return
    
    print('\n📊 REALIZANDO PREDICCIONES PARA TODOS LOS ESTUDIANTES EXTREMOS')
    print('-' * 65)
    
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
    
    print('ID   | Horas | Asist | Prev | Predicción | Nota | Estado')
    print('-' * 60)
    
    for idx, row in df.iterrows():
        
        # Convertir a formato API
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
                if letter == 'AD':
                    status = '🏆 AD!'
                elif letter == 'A':
                    status = '✅ A'
                elif letter == 'B':
                    status = '⚠️  B'
                else:
                    status = '❌ BAJO'
                
                print(f'{idx+1:3d}/50 | {row["Hours_Studied"]:5.0f} | {row["Attendance"]:5.0f} | {row["Previous_Scores"]:4.0f} | {pred:8.1f} | {letter:2s}  | {status}')
            else:
                print(f'{idx+1:3d}/50 | {row["Hours_Studied"]:5.0f} | {row["Attendance"]:5.0f} | {row["Previous_Scores"]:4.0f} | ERROR {response.status_code}')
                failed_predictions += 1
        except Exception as e:
            print(f'{idx+1:3d}/50 | {row["Hours_Studied"]:5.0f} | {row["Attendance"]:5.0f} | {row["Previous_Scores"]:4.0f} | ERROR: {str(e)[:20]}')
            failed_predictions += 1
    
    # Análisis de resultados
    if predictions:
        pred_array = np.array(predictions)
        grade_counts = Counter(letter_grades)
        
        print('\n📈 ANÁLISIS DE RESULTADOS DEL DATASET EXTREMO')
        print('=' * 50)
        
        print(f'Predicciones exitosas: {len(predictions)}/{len(df)}')
        if failed_predictions > 0:
            print(f'Predicciones fallidas: {failed_predictions}')
        
        print(f'\n📊 DISTRIBUCIÓN DE CALIFICACIONES (OBJETIVO: SOLO AD/A)')
        print('-' * 55)
        for grade in ['AD', 'A', 'B', 'C', 'D', 'F']:
            count = grade_counts.get(grade, 0)
            percentage = (count / len(predictions)) * 100 if predictions else 0
            stars = '★' * min(int(percentage / 2), 50)  # Visual representation
            
            if grade in ['AD', 'A']:
                status_emoji = '🎯' if count > 0 else '  '
            elif grade == 'B':
                status_emoji = '⚠️ '
            else:
                status_emoji = '❌'
                
            print(f'{status_emoji} {grade:2s}: {count:2d} estudiantes ({percentage:5.1f}%) {stars}')
        
        print(f'\n🎯 EVALUACIÓN DEL OBJETIVO: SOLO CALIFICACIONES AD Y A')
        print('-' * 55)
        ad_count = grade_counts.get('AD', 0)
        a_count = grade_counts.get('A', 0)
        total_high_grades = ad_count + a_count
        success_rate = (total_high_grades / len(predictions)) * 100 if predictions else 0
        
        print(f'Calificaciones AD: {ad_count} ({(ad_count/len(predictions)*100):.1f}%)')
        print(f'Calificaciones A:  {a_count} ({(a_count/len(predictions)*100):.1f}%)')
        print(f'Total AD/A: {total_high_grades}/{len(predictions)} ({success_rate:.1f}%)')
        
        if success_rate >= 95:
            print(f'🏆 ÉXITO PERFECTO: {success_rate:.1f}% AD/A')
            print('   ✨ Dataset extremo funcionando perfectamente!')
        elif success_rate >= 90:
            print(f'🥇 ÉXITO EXCELENTE: {success_rate:.1f}% AD/A')
            print('   👍 Dataset extremo muy efectivo')
        elif success_rate >= 80:
            print(f'🥈 ÉXITO BUENO: {success_rate:.1f}% AD/A')
            print('   📝 Dataset extremo funcionando bien')
        elif success_rate >= 70:
            print(f'🥉 ÉXITO PARCIAL: {success_rate:.1f}% AD/A')
            print('   🔧 Dataset extremo necesita más optimización')
        else:
            print(f'❌ OBJETIVO NO ALCANZADO: {success_rate:.1f}% AD/A')
            print('   🔥 Posible problema con el modelo o dataset')
        
        # Analizar por qué algunas predicciones no son AD/A
        b_grades = grade_counts.get('B', 0)
        if b_grades > 0:
            print(f'\n⚠️  ANÁLISIS DE CALIFICACIONES B ({b_grades} casos):')
            b_indices = [i for i, grade in enumerate(letter_grades) if grade == 'B']
            if b_indices:
                b_scores = [predictions[i] for i in b_indices[:3]]  # Primeros 3 casos
                print(f'   Puntuaciones B: {[f"{score:.1f}" for score in b_scores]}')
                print('   Rango B esperado: 75-84 puntos')
        
        print(f'\n📋 ESTADÍSTICAS NUMÉRICAS')
        print('-' * 30)
        print(f'Puntuación promedio: {pred_array.mean():.1f}')
        print(f'Puntuación mínima: {pred_array.min():.1f}')
        print(f'Puntuación máxima: {pred_array.max():.1f}')
        print(f'Desviación estándar: {pred_array.std():.1f}')
        print(f'Rango de puntuaciones: {pred_array.max() - pred_array.min():.1f}')
        
        # Verificar variación
        unique_scores = len(np.unique(np.round(pred_array, 1)))
        print(f'\n🔄 VARIACIÓN DE PREDICCIONES')
        print('-' * 30)
        print(f'Puntuaciones únicas: {unique_scores}')
        if unique_scores > 40:
            print('✅ Excelente variación - modelo funcionando correctamente')
        elif unique_scores > 30:
            print('✅ Buena variación en las predicciones')
        elif unique_scores > 20:
            print('⚠️  Variación moderada en las predicciones')
        else:
            print('❌ Poca variación - posible problema con el modelo')
        
        return {
            'total_predictions': len(predictions),
            'ad_count': ad_count,
            'a_count': a_count,
            'total_high_grades': total_high_grades,
            'success_rate': success_rate,
            'grade_distribution': dict(grade_counts),
            'avg_score': pred_array.mean(),
            'unique_scores': unique_scores,
            'min_score': pred_array.min(),
            'max_score': pred_array.max()
        }
    
    else:
        print('❌ No se pudieron obtener predicciones')
        return None

if __name__ == "__main__":
    result = test_extreme_dataset()
    
    if result:
        print('\n🏁 RESUMEN FINAL DEL DATASET EXTREMO')
        print('=' * 40)
        if result['success_rate'] >= 90:
            print('🎉 ¡El dataset extremo está funcionando perfectamente!')
            print(f'🏆 {result["ad_count"]} estudiantes con AD')
            print(f'⭐ {result["a_count"]} estudiantes con A')
        elif result['success_rate'] >= 80:
            print('👍 El dataset extremo está funcionando bien')
            print('📝 Algunas predicciones todavía en rango B')
        else:
            print('🔧 El dataset extremo necesita más optimización')
            print('❓ Verificar si el modelo está funcionando correctamente')
        
        print(f'\n📊 Puntuación promedio: {result["avg_score"]:.1f}')
        print(f'📈 Rango: {result["min_score"]:.1f} - {result["max_score"]:.1f}')
