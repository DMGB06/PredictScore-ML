import { useState } from "react";
import Head from "next/head";
import Layout from "@/components/layout/Layout";
import {
  StudentFormData,
  PredictionResult,
  BatchPredictionResult,
  CSVPredictionResponse,
} from "@/types/student";
import { API_ROUTES } from "@/constants";
import StudentForm from "@/components/ui/StudentForm";
import PredictionResults from "@/components/ui/PredictionResults";
import CSVTest from "@/components/ui/CSVTest";
import BatchResults from "@/components/ui/BatchResults";
import CSVBatchResults from "@/components/ui/CSVBatchResults";
import axios from "axios";

const PredictorAcademico = () => {
  const [formData, setFormData] = useState<StudentFormData>({
    study_hours: 8,
    attendance: 90,
    previous_scores: 85,
    parental_involvement: "Medium",
    access_to_resources: "High",
    extracurricular_activities: "Yes",
    sleep_hours: 7,
    motivation_level: "High",
    internet_access: "Yes",
    tutoring_sessions: 2,
    family_income: "Medium",
    teacher_quality: "High",
    school_type: "Public",
    peer_influence: "Positive",
    physical_activity: 4,
    learning_disabilities: "No",
    parental_education_level: "Bachelor",
    distance_from_home: "Near",
    gender: "Female",
  });

  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [batchResults, setBatchResults] =
    useState<BatchPredictionResult | null>(null);
  const [csvResults, setCSVResults] = useState<CSVPredictionResponse | null>(
    null
  );
  const [batchStudents, setBatchStudents] = useState<StudentFormData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"individual" | "batch" | "csv">(
    "individual"
  );

  const handleInputChange = (
    field: keyof StudentFormData,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePredict = async () => {
    setLoading(true);
    try {
      const response = await axios.post(API_ROUTES.predict, formData);
      if (response.data.success) {
        setPrediction(response.data);
      }
    } catch (error) {
      console.error("Error en predicción:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBatchPredict = async (students: StudentFormData[]) => {
    setLoading(true);
    setBatchStudents(students);
    setError(null);
    try {
      const response = await axios.post(API_ROUTES.predictBatch, { students });
      if (response.data.success) {
        setBatchResults(response.data);
      }
    } catch (error) {
      console.error("Error en predicción por lotes:", error);
      setError("Error al procesar predicción por lotes");
    } finally {
      setLoading(false);
    }
  };

  const handleCSVPredictionComplete = (results: CSVPredictionResponse) => {
    setCSVResults(results);
    setError(null);
  };

  const handleCSVError = (errorMessage: string) => {
    setError(errorMessage);
    setCSVResults(null);
  };

  const resetResults = () => {
    setPrediction(null);
    setBatchResults(null);
    setCSVResults(null);
    setBatchStudents([]);
    setError(null);
  };

  const tabs = [
    {
      id: "individual" as const,
      label: "👤 Predicción Individual",
      icon: "🎯",
    },
    { id: "batch" as const, label: "👥 Análisis por Lotes", icon: "📊" },
    { id: "csv" as const, label: "📁 Datos Reales", icon: "🧪" },
  ];

  return (
    <Layout>
      <Head>
        <title>Predictor Académico - PredictScore ML</title>
        <meta
          name="description"
          content="Sistema de predicción de rendimiento académico usando Machine Learning"
        />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        {/* Header */}
        <div className="bg-white shadow-lg border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                🎓 Predictor de Rendimiento Académico
              </h1>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Sistema inteligente de Machine Learning para la predicción
                temprana del rendimiento estudiantil. Utiliza algoritmos
                avanzados para identificar estudiantes en riesgo y proporcionar
                recomendaciones personalizadas.
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Navegación por Tabs */}
          <div className="mb-8">
            <div className="flex flex-wrap justify-center gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    resetResults();
                  }}
                  className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
                    activeTab === tab.id
                      ? "bg-blue-500 text-white shadow-lg transform scale-105"
                      : "bg-white text-gray-700 hover:bg-gray-50 shadow-md hover:shadow-lg"
                  }`}
                >
                  <span className="text-lg">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Contenido según Tab Activo */}
          {activeTab === "individual" && (
            <div className="space-y-6">
              <StudentForm
                formData={formData}
                onChange={handleInputChange}
                onSubmit={handlePredict}
                loading={loading}
              />

              {prediction && (
                <PredictionResults result={prediction} onReset={resetResults} />
              )}
            </div>
          )}

          {activeTab === "batch" && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  👥 Análisis por Lotes - Datos de Muestra
                </h3>
                <p className="text-gray-600 mb-6">
                  Analiza múltiples estudiantes simultáneamente usando datos
                  predefinidos del dataset original.
                </p>

                <button
                  onClick={() => {
                    const sampleStudents: StudentFormData[] = [
                      {
                        study_hours: 23,
                        attendance: 84,
                        previous_scores: 73,
                        parental_involvement: "Low",
                        access_to_resources: "High",
                        extracurricular_activities: "No",
                        sleep_hours: 7,
                        motivation_level: "Low",
                        internet_access: "Yes",
                        tutoring_sessions: 0,
                        family_income: "Low",
                        teacher_quality: "Medium",
                        school_type: "Public",
                        peer_influence: "Positive",
                        physical_activity: 3,
                        learning_disabilities: "No",
                        parental_education_level: "High School",
                        distance_from_home: "Near",
                        gender: "Male",
                      },
                      {
                        study_hours: 19,
                        attendance: 64,
                        previous_scores: 59,
                        parental_involvement: "Low",
                        access_to_resources: "Medium",
                        extracurricular_activities: "No",
                        sleep_hours: 8,
                        motivation_level: "Low",
                        internet_access: "Yes",
                        tutoring_sessions: 2,
                        family_income: "Medium",
                        teacher_quality: "Medium",
                        school_type: "Public",
                        peer_influence: "Negative",
                        physical_activity: 4,
                        learning_disabilities: "No",
                        parental_education_level: "College",
                        distance_from_home: "Moderate",
                        gender: "Female",
                      },
                      {
                        study_hours: 24,
                        attendance: 98,
                        previous_scores: 91,
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
                        peer_influence: "Neutral",
                        physical_activity: 4,
                        learning_disabilities: "No",
                        parental_education_level: "Postgraduate",
                        distance_from_home: "Near",
                        gender: "Male",
                      },
                    ];
                    handleBatchPredict(sampleStudents);
                  }}
                  disabled={loading}
                  className={`px-8 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold rounded-lg shadow-lg hover:from-green-600 hover:to-blue-600 transform hover:scale-105 transition-all duration-200 ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Analizando...
                    </span>
                  ) : (
                    "📊 Analizar Muestra (3 estudiantes)"
                  )}
                </button>
              </div>

              {batchResults && (
                <BatchResults
                  results={batchResults}
                  students={batchStudents}
                  onReset={resetResults}
                />
              )}
            </div>
          )}

          {activeTab === "csv" && (
            <div className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <span className="text-red-600">❌</span>
                    <h4 className="font-semibold text-red-700">Error</h4>
                  </div>
                  <p className="text-red-600 mt-1">{error}</p>
                </div>
              )}

              <CSVTest
                onPredictionComplete={handleCSVPredictionComplete}
                onError={handleCSVError}
              />

              {csvResults && (
                <CSVBatchResults results={csvResults} onReset={resetResults} />
              )}
            </div>
          )}

          {/* Footer Info */}
          <div className="mt-12 text-center">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-3">
                🤖 Acerca del Modelo
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="font-semibold text-blue-700">Algoritmo</div>
                  <div className="text-blue-600">Support Vector Regression</div>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <div className="font-semibold text-green-700">Precisión</div>
                  <div className="text-green-600">R² Score: 75.61%</div>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg">
                  <div className="font-semibold text-purple-700">Variables</div>
                  <div className="text-purple-600">19 factores académicos</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PredictorAcademico;
