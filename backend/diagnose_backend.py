#!/usr/bin/env python3
"""
Diagnóstico completo del backend - verificar carga de modelo y procesamiento
"""

import requests
import json
import time

def test_backend_internals():
    print('🔍 DIAGNÓSTICO COMPLETO DEL BACKEND')
    print('=' * 50)
    
    # Verificar conectividad
    try:
        response = requests.get('http://127.0.0.1:8001/health', timeout=3)
        health = response.json()
        print(f'✅ Backend conectado: {health["status"]}')
        print(f'   Modelo cargado: {health["model_loaded"]}')
    except Exception as e:
        print(f'❌ Backend no disponible: {e}')
        return
    
    print('\n🧪 PRUEBA CON DATOS EXTREMOS INDIVIDUALES')
    print('-' * 45)
    
    # Caso extremo 1: Estudiante perfecto
    perfect_student = {
        'study_hours': 50.0,  # Máximo extremo
        'attendance': 100.0,  # Perfecto
        'previous_scores': 100.0,  # Perfecto
        'parental_involvement': 'High',
        'access_to_resources': 'High',
        'extracurricular_activities': 'Yes',
        'motivation_level': 'High',
        'tutoring_sessions': 5.0,  # Máximo
        'family_income': 'High',
        'teacher_quality': 'Good',
        'peer_influence': 'Positive',
        'learning_disabilities': 'No',
        'parental_education_level': 'Master',
        'distance_from_home': 'Near'
    }
    
    print('📊 Estudiante PERFECTO:')
    print(f'   Horas: {perfect_student["study_hours"]}')
    print(f'   Asistencia: {perfect_student["attendance"]}%')
    print(f'   Puntajes previos: {perfect_student["previous_scores"]}')
    
    try:
        response = requests.post('http://127.0.0.1:8001/api/v1/predictions/predict', 
                               json=perfect_student, timeout=5)
        if response.status_code == 200:
            result = response.json()
            print(f'   Predicción: {result["prediction_100"]:.2f}')
            print(f'   Grado: {result["letter_grade"]}')
            
            if result["prediction_100"] < 85:
                print('❌ PROBLEMA: Estudiante perfecto debería tener >90 puntos!')
            else:
                print('✅ Resultado esperado para estudiante perfecto')
        else:
            print(f'❌ Error en predicción: {response.status_code}')
    except Exception as e:
        print(f'❌ Error: {e}')
    
    print('\n🧪 PRUEBA CON DATOS MÍNIMOS')
    print('-' * 30)
    
    # Caso extremo 2: Estudiante mínimo
    minimal_student = {
        'study_hours': 1.0,  # Mínimo
        'attendance': 50.0,  # Bajo
        'previous_scores': 40.0,  # Muy bajo
        'parental_involvement': 'Low',
        'access_to_resources': 'Low',
        'extracurricular_activities': 'No',
        'motivation_level': 'Low',
        'tutoring_sessions': 0.0,  # Mínimo
        'family_income': 'Low',
        'teacher_quality': 'Poor',
        'peer_influence': 'Negative',
        'learning_disabilities': 'Yes',
        'parental_education_level': 'High School',
        'distance_from_home': 'Far'
    }
    
    print('📊 Estudiante MÍNIMO:')
    print(f'   Horas: {minimal_student["study_hours"]}')
    print(f'   Asistencia: {minimal_student["attendance"]}%')
    print(f'   Puntajes previos: {minimal_student["previous_scores"]}')
    
    try:
        response = requests.post('http://127.0.0.1:8001/api/v1/predictions/predict', 
                               json=minimal_student, timeout=5)
        if response.status_code == 200:
            result = response.json()
            print(f'   Predicción: {result["prediction_100"]:.2f}')
            print(f'   Grado: {result["letter_grade"]}')
            
            # Comparar con el estudiante perfecto
            perfect_response = requests.post('http://127.0.0.1:8001/api/v1/predictions/predict', 
                                           json=perfect_student, timeout=5)
            if perfect_response.status_code == 200:
                perfect_result = perfect_response.json()
                diff = perfect_result["prediction_100"] - result["prediction_100"]
                print(f'\n📈 DIFERENCIA ENTRE EXTREMOS: {diff:.2f} puntos')
                
                if diff < 5:
                    print('❌ PROBLEMA CRÍTICO: Diferencia muy pequeña entre extremos!')
                    print('   El modelo no está diferenciando correctamente')
                elif diff < 15:
                    print('⚠️  PROBLEMA: Diferencia menor a la esperada')
                else:
                    print('✅ Diferencia razonable entre extremos')
            
        else:
            print(f'❌ Error en predicción mínimo: {response.status_code}')
    except Exception as e:
        print(f'❌ Error: {e}')
    
    print('\n🔬 ANÁLISIS DE VARIABILIDAD')
    print('-' * 35)
    
    # Probar varios valores intermedios
    test_hours = [10, 20, 30, 40, 50]
    predictions = []
    
    for hours in test_hours:
        test_student = {
            'study_hours': float(hours),
            'attendance': 85.0,
            'previous_scores': 80.0,
            'parental_involvement': 'Medium',
            'access_to_resources': 'Medium',
            'extracurricular_activities': 'Yes',
            'motivation_level': 'Medium',
            'tutoring_sessions': 2.0,
            'family_income': 'Medium',
            'teacher_quality': 'Average',
            'peer_influence': 'Neutral',
            'learning_disabilities': 'No',
            'parental_education_level': 'Bachelor',
            'distance_from_home': 'Moderate'
        }
        
        try:
            response = requests.post('http://127.0.0.1:8001/api/v1/predictions/predict', 
                                   json=test_student, timeout=5)
            if response.status_code == 200:
                result = response.json()
                predictions.append(result["prediction_100"])
                print(f'   {hours:2d} horas → {result["prediction_100"]:.2f} ({result["letter_grade"]})')
            else:
                print(f'   {hours:2d} horas → ERROR {response.status_code}')
        except Exception as e:
            print(f'   {hours:2d} horas → ERROR: {e}')
    
    if len(predictions) >= 3:
        range_pred = max(predictions) - min(predictions)
        print(f'\n📊 Rango de predicciones: {range_pred:.2f}')
        if range_pred < 1:
            print('❌ PROBLEMA CRÍTICO: Prácticamente sin variación!')
        elif range_pred < 5:
            print('⚠️  PROBLEMA: Poca variación en predicciones')
        else:
            print('✅ Variación razonable detectada')
    
    print('\n💡 CONCLUSIONES:')
    print('-' * 15)
    if len(predictions) >= 3:
        if max(predictions) - min(predictions) < 1:
            print('🚨 El modelo está devolviendo prácticamente el mismo valor')
            print('   - Posible scaler corrupto persistente')
            print('   - Problema en la carga del modelo')
            print('   - Problema en el preprocesamiento de características')
        else:
            print('✅ El modelo está funcionando con variación normal')

if __name__ == "__main__":
    test_backend_internals()
