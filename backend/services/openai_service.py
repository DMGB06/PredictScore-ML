"""
Servicio de Recomendaciones con IA (OpenAI)
==========================================

Servicio para generar recomendaciones académicas personalizadas
utilizando la API de OpenAI GPT.

Principios aplicados:
- Single Responsibility: Solo maneja interacciones con OpenAI
- Open/Closed: Extensible para otros proveedores de IA
- Dependency Inversion: Inyección de dependencias
- DRY: Reutilización de prompts y configuraciones
- KISS: Interfaz simple y clara

Autor: Equipo Grupo 4 - Tech Lead: Napanga Ruiz Jhonatan Jesus
Fecha: 2025
"""

import os
import logging
from typing import Dict, Optional, List
from openai import OpenAI
from ..core.config import settings

# Configurar logging
logger = logging.getLogger(__name__)

class OpenAIService:
    """
    Servicio para generar recomendaciones académicas usando OpenAI GPT.
    
    Implementa el patrón Strategy para diferentes tipos de recomendaciones
    y manejo robusto de errores.
    """
    
    def __init__(self):
        """Inicializa el cliente de OpenAI."""
        self.client = None
        self._initialize_client()
        
        # Configuración de prompts (aplicando DRY)
        self.base_prompt = """
        Eres un consejero académico experto especializado en el sistema educativo peruano.
        Tu rol es proporcionar recomendaciones específicas, prácticas y motivadoras 
        para mejorar el rendimiento académico de estudiantes.
        
        IMPORTANTE:
        - Usa el sistema de calificación peruano (0-20)
        - Sé específico y práctico
        - Mantén un tono motivador pero realista
        - Proporciona entre 3-5 recomendaciones concretas
        - Máximo 150 palabras
        """
    
    def _initialize_client(self) -> None:
        """
        Inicializa el cliente de OpenAI de manera segura.
        
        Raises:
            ValueError: Si la API key no está configurada
        """
        try:
            api_key = settings.OPENAI_API_KEY
            if not api_key or api_key == "your-openai-api-key-here":
                logger.warning("OpenAI API key no configurada. Servicio de IA deshabilitado.")
                return
                
            self.client = OpenAI(api_key=api_key)
            logger.info("Cliente OpenAI inicializado correctamente")
            
        except Exception as e:
            logger.error(f"Error inicializando cliente OpenAI: {e}")
            self.client = None
    
    def is_available(self) -> bool:
        """
        Verifica si el servicio de OpenAI está disponible.
        
        Returns:
            bool: True si el servicio está disponible
        """
        return self.client is not None
    
    def generate_recommendations(
        self,
        prediction_score: float,
        student_data: Dict,
        prediction_confidence: Optional[float] = None
    ) -> Dict:
        """
        Genera recomendaciones académicas personalizadas.
        
        Args:
            prediction_score: Puntuación predicha (0-20)
            student_data: Datos del estudiante
            prediction_confidence: Confianza del modelo (opcional)
            
        Returns:
            Dict con recomendaciones o mensaje de error
        """
        if not self.is_available():
            return {
                "recommendations": [
                    "Servicio de recomendaciones temporalmente no disponible.",
                    "Consulta con tu tutor académico para orientación personalizada."
                ],
                "level": "info",
                "source": "fallback"
            }
        
        try:
            # Construir contexto del estudiante (aplicando KISS)
            context = self._build_student_context(prediction_score, student_data)
            
            # Generar prompt específico
            prompt = self._build_prompt(context, prediction_score)
            
            # Llamada a OpenAI
            response = self.client.chat.completions.create(
                model=settings.OPENAI_MODEL,
                messages=[
                    {"role": "system", "content": self.base_prompt},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=settings.OPENAI_MAX_TOKENS,
                temperature=settings.OPENAI_TEMPERATURE
            )
            
            # Procesar respuesta
            recommendations_text = response.choices[0].message.content.strip()
            recommendations = self._parse_recommendations(recommendations_text)
            
            # Determinar nivel de urgencia
            level = self._determine_urgency_level(prediction_score)
            
            logger.info(f"Recomendaciones generadas para score: {prediction_score}")
            
            return {
                "recommendations": recommendations,
                "level": level,
                "source": "openai",
                "confidence": prediction_confidence,
                "tokens_used": response.usage.total_tokens if response.usage else None
            }
            
        except Exception as e:
            logger.error(f"Error generando recomendaciones: {e}")
            return self._get_fallback_recommendations(prediction_score)
    
    def _build_student_context(self, score: float, data: Dict) -> str:
        """
        Construye el contexto del estudiante para el prompt.
        
        Args:
            score: Puntuación predicha
            data: Datos del estudiante
            
        Returns:
            str: Contexto formateado
        """
        # Extraer datos relevantes (aplicando principio DRY)
        hours_studied = data.get('hours_studied', 0)
        previous_scores = data.get('previous_scores', 0)
        extracurricular = data.get('extracurricular_activities', 0)
        sleep_hours = data.get('sleep_hours', 8)
        tutoring = data.get('tutoring_sessions', 0)
        
        context = f"""
        Estudiante con predicción de {score:.1f}/20 puntos.
        
        Perfil académico:
        - Horas de estudio semanales: {hours_studied}
        - Promedio anterior: {previous_scores:.1f}/20
        - Actividades extracurriculares: {extracurricular}
        - Horas de sueño: {sleep_hours}
        - Sesiones de tutoría: {tutoring}
        """
        
        return context.strip()
    
    def _build_prompt(self, context: str, score: float) -> str:
        """
        Construye el prompt específico según la puntuación.
        
        Args:
            context: Contexto del estudiante
            score: Puntuación predicha
            
        Returns:
            str: Prompt optimizado
        """
        if score >= 18:  # AD (Logro destacado)
            focus = "mantener la excelencia y explorar desafíos adicionales"
        elif score >= 14:  # A (Logro esperado)
            focus = "consolidar fortalezas y aspirar a la excelencia"
        elif score >= 11:  # B (En proceso)
            focus = "mejorar estrategias de estudio y aumentar dedicación"
        else:  # C (En inicio)
            focus = "implementar cambios fundamentales urgentes"
        
        prompt = f"""
        {context}
        
        Como consejero académico, necesitas recomendar estrategias específicas para {focus}.
        
        Proporciona recomendaciones concretas y accionables que el estudiante pueda implementar 
        inmediatamente para mejorar su rendimiento académico.
        
        Formato: Lista numerada con recomendaciones específicas.
        """
        
        return prompt.strip()
    
    def _parse_recommendations(self, text: str) -> List[str]:
        """
        Parsea el texto de recomendaciones en una lista.
        
        Args:
            text: Texto de respuesta de OpenAI
            
        Returns:
            List[str]: Lista de recomendaciones
        """
        # Dividir por líneas y limpiar
        lines = [line.strip() for line in text.split('\n') if line.strip()]
        
        # Filtrar líneas que parecen recomendaciones
        recommendations = []
        for line in lines:
            # Remover numeración y bullets
            clean_line = line
            for prefix in ['1.', '2.', '3.', '4.', '5.', '-', '•', '*']:
                if clean_line.startswith(prefix):
                    clean_line = clean_line[len(prefix):].strip()
                    break
            
            if len(clean_line) > 10:  # Filtrar líneas muy cortas
                recommendations.append(clean_line)
        
        # Asegurar máximo 5 recomendaciones
        return recommendations[:5] if recommendations else ["Continúa con tu plan de estudios actual."]
    
    def _determine_urgency_level(self, score: float) -> str:
        """
        Determina el nivel de urgencia basado en la puntuación.
        
        Args:
            score: Puntuación predicha
            
        Returns:
            str: Nivel de urgencia ('success', 'warning', 'error')
        """
        if score >= 14:
            return "success"
        elif score >= 11:
            return "warning"
        else:
            return "error"
    
    def _get_fallback_recommendations(self, score: float) -> Dict:
        """
        Proporciona recomendaciones de respaldo cuando OpenAI no está disponible.
        
        Args:
            score: Puntuación predicha
            
        Returns:
            Dict: Recomendaciones de respaldo
        """
        if score >= 18:
            recommendations = [
                "Mantén tu excelente rendimiento con estudios regulares",
                "Considera liderar grupos de estudio para ayudar a otros",
                "Explora temas avanzados relacionados con tus materias"
            ]
        elif score >= 14:
            recommendations = [
                "Incrementa ligeramente tus horas de estudio",
                "Revisa y refuerza conceptos fundamentales",
                "Considera sesiones de tutoría para temas específicos"
            ]
        elif score >= 11:
            recommendations = [
                "Aumenta significativamente tu tiempo de estudio",
                "Implementa técnicas de estudio más efectivas",
                "Busca apoyo académico adicional",
                "Establece un horario de estudio estructurado"
            ]
        else:
            recommendations = [
                "Incrementa urgentemente tus horas de estudio",
                "Busca tutoría académica especializada",
                "Revisa completamente tus métodos de estudio",
                "Considera apoyo psicopedagógico",
                "Establece metas de estudio diarias específicas"
            ]
        
        return {
            "recommendations": recommendations,
            "level": self._determine_urgency_level(score),
            "source": "fallback"
        }

# Instancia global del servicio (Singleton pattern)
openai_service = OpenAIService()
