#!/usr/bin/env python3
"""
Script de validación del sistema PredictScore-ML corregido
Verifica que las predicciones sean precisas después de corregir el scaler
"""

import requests
import pandas as pd
import numpy as np
import json

def main():
    print('🎯 VALIDACIÓN FINAL DEL SISTEMA CORREGIDO')
    print('=' * 60)
    
    # Cargar datos de prueba
    try:
        df_test = pd.read_csv('../DOCUMENTACION/test_without_exam_score.csv')
        df_real = pd.read_csv('../DOCUMENTACION/test_con_exam_score.csv')
        print(f'✅ Datasets cargados: {len(df_test)} estudiantes')
    except Exception as e:
        print(f'❌ Error cargando datos: {e}')
        return
    
    # Verificar conectividad
    try:
        response = requests.get('http://127.0.0.1:8001/health', timeout=5)
        health = response.json()
        print(f'✅ Backend conectado: {health["status"]}')
        print(f'   Modelo cargado: {health["model_loaded"]}')
    except Exception as e:
        print(f'❌ Backend no disponible: {e}')
        return
    
    print('\n📊 PRUEBA DE PREDICCIONES INDIVIDUALES')
    print('-' * 50)
    
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
    
    # Probar diferentes estudiantes
    test_indices = [0, 5, 10, 15, 20, 25, 30]
    predictions = []
    real_scores = []
    differences = []
    
    print('ID | Predicción | Real | Diferencia | Nota')
    print('-' * 45)
    
    for idx in test_indices:
        if idx >= len(df_test):
            continue
            
        row = df_test.iloc[idx]
        real_score = df_real.iloc[idx]['Exam_Score']
        
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
                diff = abs(pred - real_score)
                
                predictions.append(pred)
                real_scores.append(real_score)
                differences.append(diff)
                
                print(f'{idx:2d} | {pred:8.1f} | {real_score:4.0f} | {diff:8.1f} | {letter}')
            else:
                print(f'{idx:2d} | ERROR {response.status_code}')
        except Exception as e:
            print(f'{idx:2d} | ERROR: {e}')
    
    # Análisis de resultados
    if predictions:
        pred_array = np.array(predictions)
        real_array = np.array(real_scores)
        diff_array = np.array(differences)
        
        print('\n📈 ANÁLISIS DE RESULTADOS')
        print('-' * 30)
        print(f'Predicciones probadas: {len(predictions)}')
        print(f'Diferencia promedio: {diff_array.mean():.2f} puntos')
        print(f'Diferencia máxima: {diff_array.max():.2f} puntos')
        print(f'Diferencia mínima: {diff_array.min():.2f} puntos')
        print(f'Desviación estándar: {diff_array.std():.2f} puntos')
        
        # Precisión
        exact_matches = np.sum(diff_array <= 1.0)
        good_matches = np.sum(diff_array <= 2.0)
        acceptable_matches = np.sum(diff_array <= 3.0)
        
        print(f'\n🎯 PRECISIÓN DEL MODELO')
        print('-' * 25)
        print(f'Exactas (±1.0): {exact_matches}/{len(predictions)} ({100*exact_matches/len(predictions):.1f}%)')
        print(f'Buenas (±2.0): {good_matches}/{len(predictions)} ({100*good_matches/len(predictions):.1f}%)')
        print(f'Aceptables (±3.0): {acceptable_matches}/{len(predictions)} ({100*acceptable_matches/len(predictions):.1f}%)')
        
        # Variación de predicciones
        print(f'\n📊 VARIACIÓN DE PREDICCIONES')
        print('-' * 30)
        print(f'Rango predicciones: {pred_array.min():.1f} - {pred_array.max():.1f}')
        print(f'Rango real: {real_array.min():.1f} - {real_array.max():.1f}')
        print(f'Variación predicciones: {pred_array.std():.2f}')
        print(f'Variación real: {real_array.std():.2f}')
        
        # Validación del problema original
        unique_predictions = len(np.unique(np.round(pred_array, 1)))
        print(f'\nPredicciones únicas: {unique_predictions} (era 1 antes del fix)')
        
        # Conclusión
        avg_error_percentage = (diff_array.mean() / real_array.mean()) * 100
        
        print('\n🏆 CONCLUSIÓN')
        print('-' * 15)
        if unique_predictions > 5 and diff_array.mean() < 3.0:
            print('✅ SISTEMA FUNCIONANDO CORRECTAMENTE')
            print('   ✓ Predicciones varían apropiadamente')
            print('   ✓ Precisión dentro del rango aceptable')
            print('   ✓ Problema del scaler corregido')
        else:
            print('⚠️ SISTEMA REQUIERE ATENCIÓN')
            print('   - Verificar configuración del modelo')
            print('   - Revisar preprocesamiento de datos')
        
        print(f'\nError promedio: {avg_error_percentage:.2f}% (objetivo: <5%)')
        
    else:
        print('❌ No se pudieron obtener predicciones')

if __name__ == "__main__":
    main()
