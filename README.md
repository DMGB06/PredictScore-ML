# Student Performance Prediction Web Application

Una aplicación web completa para predecir el rendimiento estudiantil usando Machine Learning.

## 🎯 Características

- **Predicción Individual**: Formulario para predecir rendimiento de un estudiante
- **Análisis CSV**: Subir archivos CSV para análisis masivo de estudiantes
- **Analytics Académicos**: Dashboard con análisis agregado de datos estudiantiles
- **APIs Externas**: Integración con Plotly Chart Studio y HuggingFace
- **Dashboard Personal**: Historial de predicciones del usuario

## 🏗️ Arquitectura

```
student-predictor/
├── frontend/          # Next.js + TypeScript
├── backend/           # FastAPI + Python
└── scripts/           # Scripts de desarrollo
```

## 🚀 Desarrollo Rápido

### Prerequisitos
- Python 3.8+
- Node.js 18+
- npm

### Setup Automático
```bash
chmod +x scripts/setup.sh
./scripts/setup.sh
```

### Ejecutar en Desarrollo
```bash
chmod +x scripts/run_dev.sh
./scripts/run_dev.sh
```

### Setup Manual

#### Backend
```bash
cd backend
pip install -r requirements.txt
cp .env.example .env
# Editar .env con tus API keys
python main.py
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

## 🌐 URLs

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

## 🔑 APIs Externas Requeridas

Para obtener el punto académico, necesitas configurar:

1. **Plotly Chart Studio API**:
   - Crear cuenta en plot.ly
   - Generar API key
   - Agregar a `.env`: `PLOTLY_API_KEY` y `PLOTLY_USERNAME`

2. **HuggingFace API**:
   - Crear cuenta en huggingface.co
   - Generar token de acceso
   - Agregar a `.env`: `HUGGINGFACE_API_KEY`

## 📊 Funcionalidades

### 1. Predicción Individual
- Formulario con 14 campos del estudiante
- Predicción en tiempo real usando modelo Ridge
- Recomendaciones basadas en el score

### 2. Análisis CSV
- Subida de archivos CSV con datos de múltiples estudiantes
- Procesamiento y predicción masiva
- Dashboard con análisis académico agregado
- Descarga de resultados procesados

### 3. Dashboard Personal
- Historial de predicciones del usuario
- Estadísticas personales
- Gestión de sesiones automática

## 🤖 Modelos ML

- **Modelo Principal**: Ridge Regression (R² = 0.6926)
- **Modelo Alternativo**: SVR (Support Vector Regression)
- **Preprocesamiento**: StandardScaler para normalización

## 👥 Equipo

Desarrollado por **Equipo Grupo 4** - Universidad 2025
# PredictScore-ML
