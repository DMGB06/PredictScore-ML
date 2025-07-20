#!/usr/bin/env python3
"""
Script de pruebas finales para PredictScore-ML
Valida el funcionamiento completo del sistema
"""

import requests
import time
from colorama import init, Fore, Style

# Inicializar colorama
init()

class SystemTester:
    def __init__(self):
        self.api_base_url = "http://127.0.0.1:8001"
        self.frontend_url = "http://localhost:3001"
        
    def print_header(self):
        print(f"{Fore.CYAN}{'='*60}")
        print(f"VALIDACIÓN FINAL - PREDICTSCORE-ML")
        print(f"{'='*60}{Style.RESET_ALL}")
        
    def test_backend_health(self):
        """Test de salud del backend"""
        try:
            response = requests.get(f"{self.api_base_url}/health", timeout=5)
            if response.status_code == 200:
                print(f"{Fore.GREEN}✓ Backend API funcionando correctamente{Style.RESET_ALL}")
                return True
            else:
                print(f"{Fore.RED}✗ Backend API error: {response.status_code}{Style.RESET_ALL}")
                return False
        except Exception as e:
            print(f"{Fore.RED}✗ Backend API no disponible: {str(e)}{Style.RESET_ALL}")
            return False
    
    def test_prediction_endpoint(self):
        """Test del endpoint de predicción"""
        try:
            test_data = {
                "study_hours": 8.0,
                "attendance": 90.0,
                "previous_scores": 85.0,
                "parental_involvement": "High",
                "access_to_resources": "High",
                "extracurricular_activities": "Yes",
                "sleep_hours": 7.5,
                "motivation_level": "High",
                "internet_access": "Yes",
                "tutoring_sessions": 2.0,
                "family_income": "Medium",
                "teacher_quality": "High",
                "school_type": "Public",
                "peer_influence": "Positive",
                "physical_activity": 4.0,
                "learning_disabilities": "No",
                "parental_education_level": "Bachelor",
                "distance_from_home": "Near",
                "gender": "Female"
            }
            
            response = requests.post(
                f"{self.api_base_url}/api/v1/predictions/predict",
                json=test_data,
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if "success" in data and data["success"]:
                    prediction = data["data"]["prediction"]
                    print(f"{Fore.GREEN}✓ Predicción individual: {prediction:.1f} puntos{Style.RESET_ALL}")
                    return True
            
            print(f"{Fore.RED}✗ Error en predicción: {response.status_code}{Style.RESET_ALL}")
            return False
            
        except Exception as e:
            print(f"{Fore.RED}✗ Error en predicción: {str(e)}{Style.RESET_ALL}")
            return False
    
    def test_batch_prediction(self):
        """Test de predicción por lotes"""
        try:
            batch_data = {
                "students": [
                    {
                        "study_hours": 6.0,
                        "attendance": 80.0,
                        "previous_scores": 70.0,
                        "parental_involvement": "Medium",
                        "access_to_resources": "Medium",
                        "extracurricular_activities": "No",
                        "sleep_hours": 7.0,
                        "motivation_level": "Medium",
                        "internet_access": "Yes",
                        "tutoring_sessions": 1.0,
                        "family_income": "Low",
                        "teacher_quality": "Medium",
                        "school_type": "Public",
                        "peer_influence": "Neutral",
                        "physical_activity": 3.0,
                        "learning_disabilities": "No",
                        "parental_education_level": "High School",
                        "distance_from_home": "Near",
                        "gender": "Male"
                    }
                ]
            }
            
            response = requests.post(
                f"{self.api_base_url}/api/v1/predictions/predict-batch",
                json=batch_data,
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if "success" in data and data["success"]:
                    count = data["data"]["count"]
                    print(f"{Fore.GREEN}✓ Predicción por lotes: {count} estudiante(s) procesado(s){Style.RESET_ALL}")
                    return True
            
            print(f"{Fore.RED}✗ Error en predicción por lotes: {response.status_code}{Style.RESET_ALL}")
            return False
            
        except Exception as e:
            print(f"{Fore.RED}✗ Error en predicción por lotes: {str(e)}{Style.RESET_ALL}")
            return False
    
    def test_frontend_accessibility(self):
        """Test de accesibilidad del frontend"""
        try:
            response = requests.get(self.frontend_url, timeout=5)
            if response.status_code == 200:
                print(f"{Fore.GREEN}✓ Frontend accesible en {self.frontend_url}{Style.RESET_ALL}")
                return True
            else:
                print(f"{Fore.RED}✗ Frontend error: {response.status_code}{Style.RESET_ALL}")
                return False
        except Exception as e:
            print(f"{Fore.RED}✗ Frontend no accesible: {str(e)}{Style.RESET_ALL}")
            return False
    
    def run_complete_test(self):
        """Ejecutar todas las pruebas"""
        self.print_header()
        
        tests = [
            ("Backend Health", self.test_backend_health),
            ("Predicción Individual", self.test_prediction_endpoint),
            ("Predicción por Lotes", self.test_batch_prediction),
            ("Frontend Accesible", self.test_frontend_accessibility),
        ]
        
        results = []
        for test_name, test_func in tests:
            print(f"\n{Fore.YELLOW}Ejecutando: {test_name}...{Style.RESET_ALL}")
            result = test_func()
            results.append(result)
        
        # Resumen
        print(f"\n{Fore.CYAN}{'='*60}")
        print("RESUMEN DE VALIDACIÓN")
        print(f"{'='*60}{Style.RESET_ALL}")
        
        passed = sum(results)
        total = len(results)
        
        print(f"Tests ejecutados: {total}")
        print(f"Tests exitosos: {passed}")
        print(f"Tests fallidos: {total - passed}")
        print(f"Tasa de éxito: {(passed/total)*100:.1f}%")
        
        if passed == total:
            print(f"\n{Fore.GREEN}✓ SISTEMA COMPLETAMENTE FUNCIONAL{Style.RESET_ALL}")
            print(f"{Fore.GREEN}El proyecto está listo para producción{Style.RESET_ALL}")
        else:
            print(f"\n{Fore.RED}✗ SISTEMA CON PROBLEMAS{Style.RESET_ALL}")
            print(f"{Fore.RED}Revisar componentes fallidos{Style.RESET_ALL}")
        
        print(f"\n{Fore.CYAN}URLs del Sistema:{Style.RESET_ALL}")
        print(f"Frontend: {self.frontend_url}")
        print(f"Backend API: {self.api_base_url}")
        print(f"Documentación: {self.api_base_url}/docs")

if __name__ == "__main__":
    tester = SystemTester()
    tester.run_complete_test()
