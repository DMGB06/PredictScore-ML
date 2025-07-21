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
    icon: "SVR",
    title: "Modelo SVR",
    description:
      "Support Vector Regression optimizado con kernel RBF para capturar patrones no lineales en el rendimiento estudiantil.",
    color: "from-blue-500 to-blue-600",
  },
  {
    icon: "API",
    title: "Pipeline Automatizado",
    description:
      "Flujo completo de preprocesamiento, entrenamiento y validación siguiendo mejores prácticas de ML.",
    color: "from-purple-500 to-indigo-600",
  },
  {
    icon: "ML",
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
  predictBatch: `${APP_CONFIG.apiUrl}/api/v1/predictions/predict-dataset`,
  recommendations: `${APP_CONFIG.apiUrl}/api/v1/recommendations/generate`,
  health: `${APP_CONFIG.apiUrl}/health`,
} as const;

// Categorías de rendimiento académico (Escala 20 puntos)
export const PERFORMANCE_CATEGORIES = {
  excellent: {
    label: "AD - Excelente",
    color: "text-emerald-700",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-300",
    indicator: "🏆",
    min: 18,
    max: 20,
    description:
      "Rendimiento sobresaliente. Estudiante excepcional de alto nivel académico.",
  },
  good: {
    label: "A - Muy Bueno",
    color: "text-blue-700",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-300",
    indicator: "⭐",
    min: 14,
    max: 17,
    description: "Muy buen rendimiento académico. Supera las expectativas.",
  },
  average: {
    label: "B - Bueno",
    color: "text-amber-700",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-300",
    indicator: "📘",
    min: 10,
    max: 13,
    description: "Buen rendimiento. Cumple con los estándares esperados.",
  },
  poor: {
    label: "C - Regular",
    color: "text-red-700",
    bgColor: "bg-red-50",
    borderColor: "border-red-300",
    indicator: "⚠️",
    min: 0,
    max: 10,
    description: "Rendimiento regular. Requiere atención y apoyo adicional.",
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

// Perfiles predefinidos para facilitar el análisis
export const STUDENT_PROFILES = {
  excellent_ad: {
    name: "Perfil 1",
    description: "Estudiante con alto rendimiento académico",
    icon: "🏆",
    color: "from-emerald-500 to-emerald-600",
    data: {
      study_hours: 15,
      attendance: 100,
      previous_scores: 98,
      parental_involvement: "High",
      access_to_resources: "High",
      extracurricular_activities: "Yes",
      sleep_hours: 8,
      motivation_level: "High",
      internet_access: "Yes",
      tutoring_sessions: 5,
      family_income: "High",
      teacher_quality: "High",
      school_type: "Private",
      peer_influence: "Positive",
      physical_activity: 8,
      learning_disabilities: "No",
      parental_education_level: "PhD",
      distance_from_home: "Near",
      gender: "Female",
    },
  },
  good_a: {
    name: "Perfil 2",
    description: "Estudiante con buen rendimiento académico",
    icon: "⭐",
    color: "from-blue-500 to-blue-600",
    data: {
      study_hours: 10,
      attendance: 95,
      previous_scores: 88,
      parental_involvement: "High",
      access_to_resources: "High",
      extracurricular_activities: "Yes",
      sleep_hours: 8,
      motivation_level: "High",
      internet_access: "Yes",
      tutoring_sessions: 3,
      family_income: "High",
      teacher_quality: "High",
      school_type: "Private",
      peer_influence: "Positive",
      physical_activity: 6,
      learning_disabilities: "No",
      parental_education_level: "Master",
      distance_from_home: "Near",
      gender: "Male",
    },
  },
  average_b: {
    name: "Perfil 3",
    description: "Estudiante con rendimiento estándar",
    icon: "📘",
    color: "from-amber-500 to-amber-600",
    data: {
      study_hours: 6,
      attendance: 85,
      previous_scores: 75,
      parental_involvement: "Medium",
      access_to_resources: "Medium",
      extracurricular_activities: "Yes",
      sleep_hours: 7,
      motivation_level: "Medium",
      internet_access: "Yes",
      tutoring_sessions: 2,
      family_income: "Medium",
      teacher_quality: "Medium",
      school_type: "Public",
      peer_influence: "Positive",
      physical_activity: 4,
      learning_disabilities: "No",
      parental_education_level: "Bachelor",
      distance_from_home: "Near",
      gender: "Female",
    },
  },
  regular_c: {
    name: "Perfil 4",
    description: "Estudiante que requiere apoyo adicional",
    icon: "⚠️",
    color: "from-red-500 to-red-600",
    data: {
      study_hours: 3,
      attendance: 70,
      previous_scores: 60,
      parental_involvement: "Low",
      access_to_resources: "Low",
      extracurricular_activities: "No",
      sleep_hours: 6,
      motivation_level: "Low",
      internet_access: "No",
      tutoring_sessions: 0,
      family_income: "Low",
      teacher_quality: "Low",
      school_type: "Public",
      peer_influence: "Negative",
      physical_activity: 2,
      learning_disabilities: "Yes",
      parental_education_level: "High School",
      distance_from_home: "Far",
      gender: "Male",
    },
  },
} as const;
