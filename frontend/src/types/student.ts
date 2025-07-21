export interface StudentFormData {
  study_hours: number;
  attendance: number;
  previous_scores: number;
  parental_involvement: string;
  access_to_resources: string;
  extracurricular_activities: string;
  sleep_hours: number;
  motivation_level: string;
  internet_access: string;
  tutoring_sessions: number;
  family_income: string;
  teacher_quality: string;
  school_type: string;
  peer_influence: string;
  physical_activity: number;
  learning_disabilities: string;
  parental_education_level: string;
  distance_from_home: string;
  gender: string;
}

export interface PredictionResult {
  success: boolean;
  data: {
    prediction: number;
    confidence: string;
    model_used: string;
    processing_time: number;
    timestamp: number;
  };
}

// Interfaz para un resultado individual de predicción CSV
export interface CSVPredictionRow {
  estudiante_id: number;
  prediction_100: number;
  prediction_20: number;
  letter_grade: string;
  original_data: Record<string, any>;
}

// Interfaz para estadísticas de distribución
export interface PredictionStatistics {
  average_score_100: number;
  average_score_20: number;
  distribution: {
    AD: number;
    A: number;
    B: number;
    C: number;
  };
  percentages: {
    AD: number;
    A: number;
    B: number;
    C: number;
  };
  max_score_100: number;
  min_score_100: number;
  std_score_100: number;
}

// Interfaz para respuesta de predicción de dataset completo del backend
export interface CSVPredictionResponse {
  dataset_info: {
    filename: string;
    total_students: number;
    processed_successfully: number;
  };
  results: CSVPredictionRow[];
  statistics: PredictionStatistics;
  performance: {
    model_used: string;
    processing_time_seconds: number;
    students_per_second: number;
    timestamp: number;
  };
}

// Mantener la interfaz anterior para compatibilidad
export interface BatchPredictionResult {
  success: boolean;
  data: {
    predictions: number[];
    count: number;
    valid_predictions: number;
    average_score: number;
    model_used: string;
    processing_time: number;
    timestamp: number;
  };
}

export interface PerformanceCategory {
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
  icon: string;
  min: number;
  max: number;
  description: string;
}

export interface StudentRecord extends StudentFormData {
  id: number;
  exam_score?: number;
  predicted_score?: number;
}

// Tipos para opciones de formulario
export type ParentalInvolvement = "Low" | "Medium" | "High";
export type AccessToResources = "Low" | "Medium" | "High";
export type ExtracurricularActivities = "Yes" | "No";
export type MotivationLevel = "Low" | "Medium" | "High";
export type InternetAccess = "Yes" | "No";
export type FamilyIncome = "Low" | "Medium" | "High";
export type TeacherQuality = "Low" | "Medium" | "High";
export type SchoolType = "Public" | "Private";
export type PeerInfluence = "Negative" | "Neutral" | "Positive";
export type LearningDisabilities = "Yes" | "No";
export type ParentalEducationLevel =
  | "High School"
  | "College"
  | "Bachelor"
  | "Master"
  | "Postgraduate";
export type DistanceFromHome = "Near" | "Moderate" | "Far";
export type Gender = "Male" | "Female";

export interface APIResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
