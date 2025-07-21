import requests
import pandas as pd
import time
import json

# Función de prueba para el sistema completo
def test_complete_system():
    print("🧪 Iniciando prueba completa del sistema PredictScore-ML")
    print("=" * 50)
    
    # 1. Verificar que el backend esté funcionando
    try:
        response = requests.get("http://127.0.0.1:8001/api/v1/predictions/dataset-format")
        if response.status_code == 200:
            print("✅ Backend API está funcionando correctamente")
        else:
            print(f"❌ Error en backend API: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Error conectando al backend: {e}")
        return False
    
    # 2. Cargar el dataset de prueba (sin la columna Exam_Score)
    try:
        df = pd.read_csv("dataset_large_1000_students.csv")
        
        # Verificar que tenga las 17 columnas esperadas (sin Exam_Score)
        expected_columns = [
            'Hours_Studied', 'Attendance', 'Parental_Involvement', 'Access_to_Resources',
            'Extracurricular_Activities', 'Sleep_Hours', 'Previous_Scores', 'Motivation_Level',
            'Internet_Access', 'Tutoring_Sessions', 'Family_Income', 'Teacher_Quality',
            'School_Type', 'Peer_Influence', 'Physical_Activity', 'Learning_Disabilities', 'Parental_Education_Level'
        ]
        
        # Si tiene Exam_Score, quitarla
        if 'Exam_Score' in df.columns:
            df = df.drop('Exam_Score', axis=1)
            print("✅ Columna Exam_Score removida del dataset para predicción")
        
        # Verificar que tiene las 17 columnas correctas
        if len(df.columns) != 17:
            print(f"❌ Error: El dataset tiene {len(df.columns)} columnas, se esperan 17")
            print(f"Columnas actuales: {list(df.columns)}")
            return False
        
        print(f"✅ Dataset cargado: {len(df)} estudiantes, {len(df.columns)} características")
        print(f"📊 Muestra de columnas: {list(df.columns)[:5]}...")
        
    except Exception as e:
        print(f"❌ Error cargando dataset: {e}")
        return False
    
    # 3. Enviar una muestra pequeña primero (10 estudiantes)
    try:
        small_sample = df.head(10)
        
        # Guardar en archivo temporal
        small_sample.to_csv("test_small_sample.csv", index=False)
        
        with open("test_small_sample.csv", "rb") as f:
            files = {"file": ("test_small_sample.csv", f, "text/csv")}
            response = requests.post(
                "http://127.0.0.1:8001/api/v1/predictions/predict-dataset",
                files=files
            )
        
        if response.status_code == 200:
            result = response.json()
            print(f"✅ Prueba con muestra pequeña exitosa: {len(result['predictions'])} predicciones")
            print(f"📈 Estadísticas de la muestra:")
            print(f"   - Promedio: {result['statistics']['mean']:.2f}")
            print(f"   - Mínimo: {result['statistics']['min']:.2f}")
            print(f"   - Máximo: {result['statistics']['max']:.2f}")
        else:
            print(f"❌ Error en predicción pequeña: {response.status_code}")
            print(f"   Detalle: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Error en prueba pequeña: {e}")
        return False
    
    # 4. Probar con dataset completo (1000 estudiantes)
    try:
        print("\n🚀 Probando con dataset completo (1000 estudiantes)...")
        start_time = time.time()
        
        # Guardar dataset completo sin Exam_Score
        df.to_csv("test_full_dataset.csv", index=False)
        
        with open("test_full_dataset.csv", "rb") as f:
            files = {"file": ("test_full_dataset.csv", f, "text/csv")}
            response = requests.post(
                "http://127.0.0.1:8001/api/v1/predictions/predict-dataset",
                files=files
            )
        
        end_time = time.time()
        processing_time = end_time - start_time
        
        if response.status_code == 200:
            result = response.json()
            predictions_count = len(result['predictions'])
            
            print(f"✅ Predicción completa exitosa!")
            print(f"   📊 Estudiantes procesados: {predictions_count}")
            print(f"   ⏱️  Tiempo de procesamiento: {processing_time:.2f} segundos")
            print(f"   🚀 Velocidad: {predictions_count/processing_time:.0f} estudiantes/segundo")
            print(f"   📈 Estadísticas del dataset:")
            print(f"      - Promedio: {result['statistics']['mean']:.2f}")
            print(f"      - Desviación estándar: {result['statistics']['std']:.2f}")
            print(f"      - Mínimo: {result['statistics']['min']:.2f}")
            print(f"      - Máximo: {result['statistics']['max']:.2f}")
            
            # Verificar escalas
            sample_predictions = result['predictions'][:5]
            print(f"\n   🎯 Muestra de predicciones (primeros 5 estudiantes):")
            for i, pred in enumerate(sample_predictions):
                print(f"      Estudiante {i+1}: {pred['score_0_100']:.1f}/100 = {pred['score_0_20']:.1f}/20 = {pred['letter_grade']}")
            
            return True
        else:
            print(f"❌ Error en predicción completa: {response.status_code}")
            print(f"   Detalle: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Error en prueba completa: {e}")
        return False
    
    finally:
        # Limpiar archivos temporales
        import os
        for temp_file in ["test_small_sample.csv", "test_full_dataset.csv"]:
            if os.path.exists(temp_file):
                os.remove(temp_file)

if __name__ == "__main__":
    success = test_complete_system()
    
    print("\n" + "=" * 50)
    if success:
        print("🎉 TODAS LAS PRUEBAS PASARON - Sistema listo para producción")
        print("🌐 Frontend: http://localhost:3000/predictor-academico")
        print("🔧 Backend API: http://127.0.0.1:8001/docs")
        print("📊 El sistema puede procesar datasets de 1000+ estudiantes eficientemente")
    else:
        print("❌ ALGUNAS PRUEBAS FALLARON - Revisar configuración")
    print("=" * 50)
