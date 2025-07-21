#!/usr/bin/env python3
"""
Verificar qué características está enviando vs qué espera el modelo
"""

import requests
import json

def debug_features():
    print('🔍 DEBUG: CARACTERÍSTICAS ENVIADAS VS ESPERADAS')
    print('=' * 55)
    
    # Datos que estamos enviando
    test_data = {
        'study_hours': 50.0,
        'attendance': 100.0,
        'previous_scores': 100.0,
        'parental_involvement': 'High',
        'access_to_resources': 'High',
        'extracurricular_activities': 'Yes',
        'motivation_level': 'High',
        'tutoring_sessions': 5.0,
        'family_income': 'High',
        'teacher_quality': 'Good',
        'peer_influence': 'Positive',
        'learning_disabilities': 'No',
        'parental_education_level': 'Master',
        'distance_from_home': 'Near'
    }
    
    print('📤 CARACTERÍSTICAS QUE ENVIAMOS:')
    for key, value in test_data.items():
        print(f'   {key}: {value}')
    
    # Leer metadatos del modelo
    with open('ml/models/metadata.json', 'r') as f:
        metadata = json.load(f)
    
    expected_features = metadata['models']['svr']['features']
    
    print('\n📥 CARACTERÍSTICAS QUE ESPERA EL MODELO:')
    for feature in expected_features:
        print(f'   {feature}')
    
    print('\n🔍 ANÁLISIS DE DISCREPANCIAS:')
    sent_features = set(test_data.keys())
    expected_features_set = set(expected_features)
    
    missing = expected_features_set - sent_features
    extra = sent_features - expected_features_set
    
    if missing:
        print(f'❌ CARACTERÍSTICAS FALTANTES: {missing}')
    if extra:
        print(f'⚠️  CARACTERÍSTICAS EXTRA: {extra}')
    
    if not missing and not extra:
        print('✅ Todas las características coinciden')
    
    # Probar la predicción
    print(f'\n🧪 PROBANDO PREDICCIÓN:')
    try:
        response = requests.post('http://127.0.0.1:8001/api/v1/predictions/predict', 
                               json=test_data, timeout=5)
        if response.status_code == 200:
            result = response.json()
            print(f'   ✅ Predicción exitosa: {result["prediction_100"]:.2f} ({result["letter_grade"]})')
        else:
            print(f'   ❌ Error {response.status_code}: {response.text}')
    except Exception as e:
        print(f'   ❌ Error: {e}')

if __name__ == "__main__":
    debug_features()
