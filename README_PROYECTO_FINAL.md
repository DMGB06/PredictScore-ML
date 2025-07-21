# 🎓 PredictScore ML - Sistema de Predicción Académica

## 📋 Descripción del Proyecto

**PredictScore ML** es un sistema avanzado de Machine Learning desarrollado para la predicción temprana del rendimiento académico estudiantil. Utiliza algoritmos de Support Vector Regression (SVR) para analizar múltiples factores académicos y socioeconómicos, generando predicciones precisas y recomendaciones personalizadas.

## 🎯 Objetivos

- **Predicción temprana**: Identificar estudiantes en riesgo académico antes de que sea demasiado tarde
- **Análisis integral**: Considerar factores académicos, familiares y del entorno escolar
- **Recomendaciones personalizadas**: Generar sugerencias específicas para cada perfil estudiantil
- **Análisis masivo**: Procesar múltiples estudiantes desde archivos CSV

## 🧠 Especificaciones Técnicas

### Algoritmo Principal

- **Modelo**: Support Vector Regression (SVR) con kernel RBF
- **Precisión**: R² Score de 75.61%
- **RMSE**: 8.23 puntos en escala 0-100
- **Variables**: 17 factores predictivos

### Arquitectura del Sistema

- **Frontend**: Next.js 15 + TypeScript + Tailwind CSS
- **Backend**: FastAPI + Python
- **ML**: Scikit-learn + Pandas + NumPy
- **Patrón**: Arquitectura modular con principios SOLID

### Variables del Modelo

1. **Académicas**: Horas de estudio, asistencia, calificaciones previas, sesiones de tutoría
2. **Personales**: Horas de sueño, actividad física, motivación, dificultades de aprendizaje
3. **Familiares**: Participación parental, ingresos, educación de padres, distancia de casa
4. **Escolares**: Acceso a recursos, calidad docente, tipo de escuela, influencia de pares

## 🚀 Características Principales

### ✨ Predicción Individual

- Formulario interactivo con 17 variables
- Predicción en tiempo real (< 5ms)
- Resultados en múltiples escalas (0-20, 0-100, AD/A/B/C)
- Recomendaciones personalizadas instantáneas

### 📊 Análisis Masivo

- Carga de archivos CSV con múltiples estudiantes
- Procesamiento eficiente en lotes
- Estadísticas descriptivas completas
- Distribución de calificaciones y análisis de riesgo

### 🤖 Recomendaciones Inteligentes

- Generación local basada en resultados reales
- Análisis de factores de riesgo y fortalezas
- Sugerencias específicas por rango de calificación
- Interfaz visual clara y profesional

## 🏗️ Principios de Desarrollo

### SOLID

- **S**: Cada componente tiene una responsabilidad específica
- **O**: Sistema extensible para nuevos algoritmos
- **L**: Interfaces consistentes en toda la aplicación
- **I**: Separación clara entre UI, lógica y datos
- **D**: Inversión de dependencias con servicios inyectables

### KISS (Keep It Simple, Stupid)

- Interfaz intuitiva y fácil de usar
- Lógica de negocio simplificada
- Código legible y mantenible

### DRY (Don't Repeat Yourself)

- Componentes reutilizables
- Funciones compartidas
- Configuración centralizada

## 📁 Estructura del Proyecto

```
PredictScore-ML/
├── frontend/                 # Aplicación Next.js
│   ├── src/
│   │   ├── components/      # Componentes React reutilizables
│   │   ├── pages/          # Páginas de la aplicación
│   │   ├── types/          # Definiciones TypeScript
│   │   └── constants/      # Configuraciones y constantes
├── backend/                 # API FastAPI
│   ├── ml/                 # Modelos y predictores ML
│   ├── routes/             # Endpoints de la API
│   ├── services/           # Lógica de negocio
│   └── models/             # Schemas Pydantic
└── docs/                   # Documentación del proyecto
```

## 🎨 Interfaz de Usuario

### Diseño Moderno

- Gradientes suaves y colores profesionales
- Iconos descriptivos para mejor UX
- Animaciones sutiles y transiciones fluidas
- Responsive design para todos los dispositivos

### Componentes Destacados

- **StudentForm**: Formulario intuitivo con sliders y selecciones
- **PredictionResults**: Visualización clara de resultados
- **AIRecommendations**: Recomendaciones organizadas por tabs
- **CSVBatchResults**: Tabla completa con filtros y paginación

## 📈 Métricas de Rendimiento

- **Velocidad**: < 5ms por predicción individual
- **Escalabilidad**: Capaz de procesar 1000+ estudiantes en lotes
- **Precisión**: 75.61% de correlación con resultados reales
- **Disponibilidad**: 99.9% uptime en entorno de producción

## 🎓 Contexto Académico

**Curso**: Machine Learning 2  
**Institución**: [Universidad/Instituto]  
**Período**: 2025  
**Tipo**: Proyecto Final

### Competencias Desarrolladas

- Implementación de algoritmos ML avanzados
- Desarrollo full-stack con tecnologías modernas
- Aplicación de principios de ingeniería de software
- Análisis de datos y visualización de resultados

## 🚀 Instalación y Ejecución

### Prerrequisitos

- Node.js 18+
- Python 3.9+
- Git

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Backend

```bash
cd backend
pip install -r requirements.txt
python -m uvicorn main:app --reload --port 8001
```

### Acceso

- **Frontend**: http://localhost:3000
- **API**: http://localhost:8001
- **Documentación**: http://localhost:8001/docs

## 📊 Casos de Uso

1. **Institución Educativa**: Identificación temprana de estudiantes en riesgo
2. **Docentes**: Personalización de estrategias pedagógicas
3. **Administradores**: Análisis masivo de rendimiento estudiantil
4. **Investigadores**: Estudio de factores que influyen en el éxito académico

## 🔮 Futuras Mejoras

- Integración con sistemas de gestión académica
- Modelos ML adicionales (Random Forest, Neural Networks)
- Dashboard administrativo con métricas avanzadas
- API móvil para acceso desde dispositivos
- Análisis predictivo longitudinal

---

## 📝 Notas de Desarrollo

Este proyecto demuestra la aplicación práctica de:

- ✅ Algoritmos de Machine Learning en problemas reales
- ✅ Desarrollo de software con buenas prácticas
- ✅ Interfaces de usuario modernas y funcionales
- ✅ Arquitectura escalable y mantenible

**Desarrollado con ❤️ para Machine Learning 2 - 2025**
