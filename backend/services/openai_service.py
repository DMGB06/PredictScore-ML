"""
Servicio de Recomendaciones con OpenAI
====================================

Generador de recomendaciones personalizadas usando GPT-4
para estudiantes basado en sus predicciones de rendimiento.

Autor: Equipo Grupo 4
Fecha: 2025
"""

import os
import logging
from typing import Dict, List, Optional, Any
from openai import OpenAI
from core.config import settings

logger = logging.getLogger(__name__)

class OpenAIRecommendationService:
    """
    Servicio para generar recomendaciones personalizadas usando OpenAI GPT.
    """
    
    def __init__(self):
        """Inicializa el cliente de OpenAI."""
        self.client = None
        self.api_key = settings.OPENAI_API_KEY
        
        if self.api_key:
            try:
                self.client = OpenAI(api_key=self.api_key)
                logger.info("✅ Cliente OpenAI inicializado correctamente")
            except Exception as e:
                logger.error(f"❌ Error inicializando cliente OpenAI: {e}")
                self.client = None
        else:
            logger.warning("⚠️ OPENAI_API_KEY no configurada")
    
    def _analyze_predictions_stats(self, predictions: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Analiza estadísticas de las predicciones."""
        if not predictions:
            return {}
        
        scores = [pred.get("predicted_score", 0) for pred in predictions]
        
        stats = {
            "total_students": len(predictions),
            "average_score": sum(scores) / len(scores),
            "min_score": min(scores),
            "max_score": max(scores),
            "low_performance": len([s for s in scores if s < 60]),
            "medium_performance": len([s for s in scores if 60 <= s < 80]),
            "high_performance": len([s for s in scores if s >= 80])
        }
        
        # Análisis de factores comunes en estudiantes con bajo rendimiento
        low_performers = [pred for pred in predictions if pred.get("predicted_score", 0) < 60]
        if low_performers:
            avg_study_hours = sum([s.get("study_hours", 0) for s in low_performers]) / len(low_performers)
            avg_sleep_hours = sum([s.get("sleep_hours", 0) for s in low_performers]) / len(low_performers)
            avg_attendance = sum([s.get("attendance", 0) for s in low_performers]) / len(low_performers)
            
            stats.update({
                "low_performers_avg_study_hours": avg_study_hours,
                "low_performers_avg_sleep_hours": avg_sleep_hours,
                "low_performers_avg_attendance": avg_attendance
            })
        
        return stats
    
    def generate_general_recommendations(self, predictions: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Genera recomendaciones generales para todo el grupo de estudiantes.
        """
        if not self.client:
            return self._get_fallback_recommendations(predictions)
        
        try:
            stats = self._analyze_predictions_stats(predictions)
            
            prompt = self._create_general_prompt(stats)
            
            response = self.client.chat.completions.create(
                model="gpt-4.1-nano",  # Modelo más económico: $0.10 input / $0.40 output vs $2.00/$8.00
                messages=[
                    {
                        "role": "system",
                        "content": "Experto en educación. Genera recomendaciones concisas para mejorar rendimiento académico."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                max_tokens=300,  # Reducido de 800 a 300 para ahorrar costos
                temperature=0.5   # Reducido para respuestas más precisas
            )
            
            recommendations_text = response.choices[0].message.content
            
            result = {
                "status": "success",
                "stats": stats,
                "general_recommendations": recommendations_text,
                "priority_areas": self._extract_priority_areas(stats),
                "action_plan": self._generate_action_plan(stats)
            }
            
            logger.info(f"✅ Recomendaciones generadas para {stats.get('total_students', 0)} estudiantes")
            return result
            
        except Exception as e:
            logger.error(f"❌ Error generando recomendaciones: {e}")
            return self._get_fallback_recommendations(predictions)
    
    def _create_general_prompt(self, stats: Dict[str, Any]) -> str:
        """Crea el prompt para GPT basado en las estadísticas."""
        prompt = f"""
        Datos de {stats.get('total_students', 0)} estudiantes:
        - Promedio: {stats.get('average_score', 0):.1f}
        - Bajo rendimiento (<60): {stats.get('low_performance', 0)}
        - Medio (60-80): {stats.get('medium_performance', 0)}
        - Alto (>80): {stats.get('high_performance', 0)}
        
        Estudiantes bajo rendimiento - promedios:
        - Estudio: {stats.get('low_performers_avg_study_hours', 0):.1f}h
        - Asistencia: {stats.get('low_performers_avg_attendance', 0):.1f}%

        Genera 3 recomendaciones concisas para mejorar el rendimiento general.
        """
        return prompt
    
    def _extract_priority_areas(self, stats: Dict[str, Any]) -> List[str]:
        """Extrae áreas prioritarias basadas en las estadísticas."""
        priority_areas = []
        
        if stats.get('low_performance', 0) > stats.get('total_students', 1) * 0.3:
            priority_areas.append("Intervención urgente para estudiantes con bajo rendimiento")
        
        if stats.get('low_performers_avg_study_hours', 0) < 3:
            priority_areas.append("Mejorar hábitos y técnicas de estudio")
        
        if stats.get('low_performers_avg_sleep_hours', 0) < 7:
            priority_areas.append("Optimizar patrones de sueño y descanso")
        
        if stats.get('low_performers_avg_attendance', 0) < 85:
            priority_areas.append("Mejorar asistencia y compromiso escolar")
        
        return priority_areas
    
    def _generate_action_plan(self, stats: Dict[str, Any]) -> List[Dict[str, str]]:
        """Genera un plan de acción específico."""
        action_plan = []
        
        # Plan basado en estadísticas
        if stats.get('low_performance', 0) > 0:
            action_plan.append({
                "phase": "Inmediato (1-2 semanas)",
                "action": "Identificar y reunirse con estudiantes de bajo rendimiento",
                "target": f"{stats.get('low_performance', 0)} estudiantes",
                "responsible": "Coordinadores académicos"
            })
        
        if stats.get('low_performers_avg_study_hours', 0) < 3:
            action_plan.append({
                "phase": "Corto plazo (1 mes)",
                "action": "Implementar talleres de técnicas de estudio",
                "target": "Estudiantes con <3 horas de estudio diario",
                "responsible": "Equipo pedagógico"
            })
        
        action_plan.append({
            "phase": "Mediano plazo (3 meses)",
            "action": "Programa de seguimiento personalizado",
            "target": "Todos los estudiantes",
            "responsible": "Tutores académicos"
        })
        
        return action_plan
    
    def _get_fallback_recommendations(self, predictions: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Genera recomendaciones básicas cuando OpenAI no está disponible."""
        stats = self._analyze_predictions_stats(predictions)
        
        fallback_recommendations = """
        RECOMENDACIONES GENERALES (Análisis Local):
        
        📚 ESTRATEGIAS DE ESTUDIO:
        • Establecer horarios de estudio consistentes
        • Utilizar técnicas de estudio activo (mapas mentales, resúmenes)
        • Crear un ambiente de estudio libre de distracciones
        
        ⏰ GESTIÓN DEL TIEMPO:
        • Planificar tareas con anticipación
        • Usar técnicas como Pomodoro para mantener la concentración
        • Balancear tiempo de estudio con descanso
        
        👥 APOYO SOCIAL:
        • Formar grupos de estudio
        • Buscar ayuda de profesores cuando sea necesario
        • Mantener comunicación regular con padres/tutores
        
        💤 BIENESTAR FÍSICO:
        • Mantener 7-8 horas de sueño diario
        • Realizar actividad física regular
        • Mantener una dieta balanceada
        """
        
        return {
            "status": "fallback",
            "stats": stats,
            "general_recommendations": fallback_recommendations,
            "priority_areas": self._extract_priority_areas(stats),
            "action_plan": self._generate_action_plan(stats),
            "note": "Recomendaciones generadas localmente. Configure OPENAI_API_KEY para recomendaciones personalizadas con IA."
        }

# Instancia global del servicio
recommendation_service = OpenAIRecommendationService()
