import { useState } from "react";
import Head from "next/head";
import Layout from "@/components/layout/Layout";
import {
  StudentFormData,
  PredictionResult,
  CSVPredictionResponse,
} from "@/types/student";
import { API_ROUTES } from "@/constants";
import StudentForm from "@/components/ui/StudentForm";
import PredictionResults from "@/components/ui/PredictionResults";
import CSVBatchResults from "@/components/ui/CSVBatchResults";
import ProfileButtons from "@/components/ui/ProfileButtons";
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
  const [csvResults, setCSVResults] = useState<CSVPredictionResponse | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"individual" | "csv">(
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

  const handleLoadProfile = (profileData: StudentFormData) => {
    setFormData(profileData);
    setPrediction(null); // Limpiar predicción anterior
    setError(null);
  };

  const handlePredict = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(API_ROUTES.predict, formData);
      if (response.data) {
        setPrediction(response.data);
      }
    } catch (error) {
      console.error("Error en predicción:", error);
      setError("Error al procesar la predicción");
    } finally {
      setLoading(false);
    }
  };

  const handleCSVUpload = async (file: File) => {
    setLoading(true);
    setError(null);

    try {
      console.log("🔍 Subiendo archivo CSV:", file.name, "Tamaño:", file.size);

      // Validar archivo
      if (!file.name.endsWith(".csv")) {
        throw new Error("Solo se permiten archivos CSV");
      }

      if (file.size === 0) {
        throw new Error("El archivo está vacío");
      }

      if (file.size > 5 * 1024 * 1024) {
        // 5MB límite
        throw new Error("El archivo es demasiado grande (máximo 5MB)");
      }

      const formData = new FormData();
      formData.append("file", file);

      console.log("📤 Enviando archivo al backend...");
      console.log("🔗 URL destino:", API_ROUTES.predictBatch);
      console.log("📋 FormData keys:", Array.from(formData.keys()));

      const response = await axios.post(API_ROUTES.predictBatch, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 120000, // 2 minutos timeout para archivos grandes
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            console.log(`📤 Upload progress: ${percentCompleted}%`);
          }
        },
      });

      console.log("✅ Respuesta del backend:", response.data);

      if (response.data) {
        setCSVResults(response.data);
        console.log("🎉 Resultados CSV guardados exitosamente");
      }
    } catch (error: unknown) {
      console.error("❌ Error al procesar CSV:", error);
      let errorMessage = "Error al procesar el archivo CSV";

      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (axios.isAxiosError(error)) {
        if (error.response?.data?.detail) {
          errorMessage = error.response.data.detail;
        } else if (error.code === "ECONNABORTED") {
          errorMessage =
            "Timeout: El archivo es muy grande o el servidor no responde";
        } else if (error.response?.status === 422) {
          errorMessage =
            "Formato de archivo inválido. Verifica las columnas del CSV";
        } else if (error.response?.status === 500) {
          errorMessage =
            "Error interno del servidor. Verifica el formato del CSV";
        }
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const resetResults = () => {
    setPrediction(null);
    setCSVResults(null);
    setError(null);
  };

  const tabs = [
    {
      id: "individual" as const,
      label: "👤 Predicción Individual",
      icon: "🎯",
      description: "Analiza el rendimiento de un estudiante específico",
    },
    {
      id: "csv" as const,
      label: "Análisis Masivo",
      icon: "",
      description: "Procesa múltiples estudiantes desde archivo CSV",
    },
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
              {/* Botones de Autocompletado de Perfiles */}
              <ProfileButtons
                onLoadProfile={handleLoadProfile}
                disabled={loading}
              />{" "}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-3xl">🎯</span>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">
                      Predicción Individual
                    </h3>
                    <p className="text-gray-600">
                      Analiza el rendimiento académico de un estudiante
                      específico
                    </p>
                  </div>
                </div>

                <StudentForm
                  formData={formData}
                  onChange={handleInputChange}
                  onSubmit={handlePredict}
                  loading={loading}
                />
              </div>
              {prediction && (
                <PredictionResults result={prediction} onReset={resetResults} />
              )}
            </div>
          )}

          {activeTab === "csv" && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-3xl">📊</span>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">
                      Análisis Masivo - Archivo CSV
                    </h3>
                    <p className="text-gray-600">
                      Procesa múltiples estudiantes cargando un archivo CSV con
                      datos académicos
                    </p>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center gap-2">
                      <span className="text-red-600">❌</span>
                      <h4 className="font-semibold text-red-700">Error</h4>
                    </div>
                    <p className="text-red-600 mt-1">{error}</p>
                  </div>
                )}

                {/* Componente para subir CSV mejorado */}
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
                    loading
                      ? "border-blue-300 bg-blue-50"
                      : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
                  }`}
                >
                  {loading ? (
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                      <h4 className="text-lg font-semibold text-blue-700 mb-2">
                        Procesando Archivo CSV...
                      </h4>
                      <p className="text-blue-600 mb-2">
                        Analizando datos y generando predicciones con ML
                      </p>
                      <div className="text-sm text-blue-500 bg-blue-50 px-4 py-2 rounded-lg">
                        ⏱️ Archivos grandes pueden tardar hasta 2 minutos
                        <br />
                        🤖 El modelo SVR está procesando cada estudiante
                        <br />
                        📊 Se están generando estadísticas completas
                      </div>
                    </div>
                  ) : (
                    <>
                      <span className="text-4xl mb-4 block">📄</span>
                      <h4 className="text-lg font-semibold text-gray-700 mb-2">
                        Cargar Archivo CSV
                      </h4>
                      <p className="text-gray-500 mb-4">
                        Arrastra tu archivo CSV aquí o haz clic para seleccionar
                      </p>
                      <input
                        type="file"
                        accept=".csv"
                        className="hidden"
                        id="csv-upload"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            console.log("📁 Archivo seleccionado:", file.name);
                            handleCSVUpload(file);
                            // Reset input para poder subir el mismo archivo otra vez
                            e.target.value = "";
                          }
                        }}
                        disabled={loading}
                      />
                      <label
                        htmlFor="csv-upload"
                        className={`inline-block px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 cursor-pointer transition-colors ${
                          loading ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      >
                        {loading ? "Procesando..." : "Seleccionar Archivo"}
                      </label>
                      <p className="text-xs text-gray-400 mt-2">
                        Formato: CSV con columnas del modelo • Máximo 5MB
                      </p>
                      <div className="mt-4 text-xs text-gray-500">
                        <p>
                          <strong>Columnas requeridas:</strong>
                        </p>
                        <p>Hours_Studied, Attendance, Previous_Scores, etc.</p>
                      </div>

                      {/* Botón de prueba temporal */}
                      <div className="mt-6 pt-4 border-t border-gray-200">
                        <div className="flex gap-2 flex-wrap justify-center">
                          <button
                            onClick={async () => {
                              try {
                                // Primero probar conectividad básica
                                console.log(
                                  "🔍 Probando conectividad con backend..."
                                );
                                const healthResponse = await fetch(
                                  "http://127.0.0.1:8001/health"
                                );
                                console.log(
                                  "✅ Health check:",
                                  await healthResponse.text()
                                );

                                // Probar endpoint de predicción individual
                                console.log(
                                  "🔍 Probando endpoint individual..."
                                );
                                const testResponse = await axios.post(
                                  API_ROUTES.predict,
                                  {
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
                                  }
                                );
                                console.log(
                                  "✅ Individual prediction:",
                                  testResponse.data
                                );

                                alert(
                                  "Backend está funcionando correctamente!"
                                );
                              } catch (error) {
                                console.error(
                                  "❌ Error de conectividad:",
                                  error
                                );
                                setError(`Error de conectividad: ${error}`);
                              }
                            }}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                            disabled={loading}
                          >
                            🔍 Test Conectividad
                          </button>

                          <button
                            onClick={async () => {
                              try {
                                // Simular carga de archivo CSV de prueba
                                const response = await fetch(
                                  "/test_without_exam_score.csv"
                                );
                                const csvContent = await response.text();
                                const blob = new Blob([csvContent], {
                                  type: "text/csv",
                                });
                                const file = new File(
                                  [blob],
                                  "test_without_exam_score.csv",
                                  { type: "text/csv" }
                                );
                                handleCSVUpload(file);
                              } catch (error) {
                                console.error(
                                  "Error cargando archivo de prueba:",
                                  error
                                );
                                setError("Error al cargar archivo de prueba");
                              }
                            }}
                            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
                            disabled={loading}
                          >
                            🧪 Probar CSV
                          </button>

                          <button
                            onClick={async () => {
                              try {
                                console.log(
                                  "🔍 Probando endpoint CSV directamente..."
                                );
                                console.log("URL:", API_ROUTES.predictBatch);

                                // Crear un archivo CSV muy pequeño para prueba
                                const csvData = `Hours_Studied,Attendance,Parental_Involvement,Access_to_Resources,Extracurricular_Activities,Previous_Scores,Motivation_Level,Tutoring_Sessions,Family_Income,Teacher_Quality,Peer_Influence,Learning_Disabilities,Parental_Education_Level,Distance_from_Home,Study_Efficiency,High_Support,Family_Education_Support
20,71,2,1,0,87,0,1,2,2,0,0,1,2,0.227,0,0`;

                                const blob = new Blob([csvData], {
                                  type: "text/csv",
                                });
                                const file = new File([blob], "test_mini.csv", {
                                  type: "text/csv",
                                });

                                const formData = new FormData();
                                formData.append("file", file);

                                const response = await axios.post(
                                  API_ROUTES.predictBatch,
                                  formData,
                                  {
                                    headers: {
                                      "Content-Type": "multipart/form-data",
                                    },
                                    timeout: 10000,
                                  }
                                );

                                console.log(
                                  "✅ Respuesta CSV directa:",
                                  response.data
                                );
                                alert("CSV endpoint funciona!");
                              } catch (error) {
                                console.error(
                                  "❌ Error en CSV directo:",
                                  error
                                );
                                if (axios.isAxiosError(error)) {
                                  console.log(
                                    "Status:",
                                    error.response?.status
                                  );
                                  console.log("Data:", error.response?.data);
                                }
                                setError(`Error CSV directo: ${error}`);
                              }
                            }}
                            className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors text-sm"
                            disabled={loading}
                          >
                            🔬 Test CSV Directo
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {csvResults && (
                <CSVBatchResults results={csvResults} onReset={resetResults} />
              )}
            </div>
          )}

          {/* Footer Info Mejorado */}
          <div className="mt-12">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow-lg p-6 border border-blue-100">
              <div className="text-center mb-6">
                <h4 className="text-xl font-bold text-gray-800 mb-2">
                  🤖 Información del Modelo ML
                </h4>
                <p className="text-gray-600">
                  Sistema predictivo de rendimiento académico desarrollado con
                  técnicas avanzadas de Machine Learning
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-sm border border-blue-100">
                  <div className="text-center">
                    <span className="text-2xl mb-2 block">🧠</span>
                    <div className="font-bold text-blue-700">Algoritmo</div>
                    <div className="text-sm text-blue-600">
                      Support Vector Regression
                    </div>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-green-100">
                  <div className="text-center">
                    <span className="text-2xl mb-2 block">🎯</span>
                    <div className="font-bold text-green-700">Precisión</div>
                    <div className="text-sm text-green-600">
                      R² Score: 75.61%
                    </div>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-purple-100">
                  <div className="text-center">
                    <span className="text-2xl mb-2 block">📊</span>
                    <div className="font-bold text-purple-700">Variables</div>
                    <div className="text-sm text-purple-600">
                      17 factores académicos
                    </div>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-amber-100">
                  <div className="text-center">
                    <span className="text-2xl mb-2 block">📏</span>
                    <div className="font-bold text-amber-700">Escala</div>
                    <div className="text-sm text-amber-600">0-20 puntos</div>
                  </div>
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
