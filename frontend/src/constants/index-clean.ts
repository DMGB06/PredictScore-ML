// Configuración de la aplicación
export const APP_CONFIG = {
  name: "PredictScore-ML",
  title: "Sistema Predictivo de Rendimiento Académico",
  description:
    "Sistema de ML para la detección temprana de riesgo académico en educación secundaria desarrollado por el Grupo 4",
  university: "Universidad Nacional de Cañete",
  faculty: "Facultad de Ingeniería • Escuela de Ingeniería de Sistemas",
  course:
    "Curso: Machine Learning • Docente: M.Sc. Magaly Roxana Arangüena Yllanes",
  group: "Grupo 4",
  apiUrl: "http://127.0.0.1:8001",
} as const;

// Métricas del proyecto
export const PROJECT_METRICS = {
  apiTests: "100%",
  modelType: "SVR",
  r2Score: "75.6%",
} as const;

// Miembros del equipo
export const TEAM_MEMBERS = [
  "Candela Vargas, Aitor Baruc",
  "Godoy Bautista, Denilson Miguel",
  "Molina Lazaro, Eduardo Jeampier",
  "Napanga Ruiz, Jhonatan Jesus",
  "Quispe Romani, Angela Isabel",
  "Quito Gamboa, Jhon Neper",
] as const;

// Características del sistema
export const FEATURES = [
  {
    title: "Modelo SVR",
    description:
      "Support Vector Regression optimizado con kernel RBF para capturar patrones no lineales en el rendimiento estudiantil.",
    color: "from-blue-500 to-blue-600",
  },
  {
    title: "Pipeline Automatizado",
    description:
      "Flujo completo de preprocesamiento, entrenamiento y validación siguiendo mejores prácticas de ML.",
    color: "from-purple-500 to-indigo-600",
  },
  {
    title: "Predicción Precisa",
    description:
      "R² Score de 75.61% con RMSE de 1.831, ideal para intervenciones tempranas en educación secundaria.",
    color: "from-indigo-500 to-purple-600",
  },
] as const;

// Rutas de la aplicación
export const ROUTES = {
  home: "/",
  predictor: "/predictor-academico",
  docs: "/docs",
  apiDocs: `${APP_CONFIG.apiUrl}/docs`,
} as const;

// Rutas de la API
export const API_ROUTES = {
  predict: `${APP_CONFIG.apiUrl}/api/v1/predictions/predict`,
  predictBatch: `${APP_CONFIG.apiUrl}/api/v1/predictions/predict-batch`,
  health: `${APP_CONFIG.apiUrl}/health`,
} as const;

// Categorías de rendimiento académico
export const PERFORMANCE_CATEGORIES = {
  excellent: {
    label: "Excelente",
    color: "text-green-700",
    bgColor: "bg-green-50",
    borderColor: "border-green-300",
    indicator: "●",
    min: 85,
    max: 100,
    description:
      "Rendimiento sobresaliente. Estudiante de alto nivel académico.",
  },
  good: {
    label: "Bueno",
    color: "text-blue-700",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-300",
    indicator: "●",
    min: 75,
    max: 84,
    description: "Buen rendimiento académico. Cumple con las expectativas.",
  },
  average: {
    label: "Regular",
    color: "text-yellow-700",
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-300",
    indicator: "●",
    min: 65,
    max: 74,
    description: "Rendimiento promedio. Requiere atención y seguimiento.",
  },
  poor: {
    label: "Deficiente",
    color: "text-red-700",
    bgColor: "bg-red-50",
    borderColor: "border-red-300",
    indicator: "●",
    min: 0,
    max: 64,
    description: "Bajo rendimiento. Necesita intervención inmediata.",
  },
} as const;

// Opciones para formularios
export const FORM_OPTIONS = {
  parental_involvement: ["Low", "Medium", "High"],
  access_to_resources: ["Low", "Medium", "High"],
  extracurricular_activities: ["Yes", "No"],
  motivation_level: ["Low", "Medium", "High"],
  internet_access: ["Yes", "No"],
  family_income: ["Low", "Medium", "High"],
  teacher_quality: ["Low", "Medium", "High"],
  school_type: ["Public", "Private"],
  peer_influence: ["Negative", "Neutral", "Positive"],
  learning_disabilities: ["Yes", "No"],
  parental_education_level: [
    "High School",
    "College",
    "Bachelor",
    "Master",
    "Postgraduate",
  ],
  distance_from_home: ["Near", "Moderate", "Far"],
  gender: ["Male", "Female"],
} as const;
