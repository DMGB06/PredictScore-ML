import { useState } from "react";
import Head from "next/head";
import Layout from "@/components/layout/Layout";
import {
  StudentFormData,
  PredictionResult,
  CSVPredictionResponse,
  CSVPredictionRow,
} from "@/types/student";
import { API_ROUTES } from "@/constants";
import StudentForm from "@/components/ui/StudentForm";
import PredictionResults from "@/components/ui/PredictionResults";
import CSVBatchResults from "@/components/ui/CSVBatchResults";
import ProfileButtons from "@/components/ui/ProfileButtons";
import AIRecommendationsComponent from "@/components/ui/AIRecommendations";
import type { AIRecommendationsData } from "@/components/ui/AIRecommendations";
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
  const [recommendations, setRecommendations] =
    useState<AIRecommendationsData | null>(null);
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
    setRecommendations(null); // Limpiar recomendaciones anteriores
    try {
      const response = await axios.post(API_ROUTES.predict, formData);
      if (response.data) {
        setPrediction(response.data);
        // Generar recomendaciones localmente basadas en los resultados finales
        generateLocalRecommendations(response.data);
      }
    } catch (error) {
      console.error("Error en predicción:", error);
      setError(
        "❌ Error al procesar la predicción. Verifica los datos ingresados."
      );
    } finally {
      setLoading(false);
    }
  };

  // Función para generar recomendaciones locales basadas en los resultados finales (principio KISS)
  const generateLocalRecommendations = (predictionData: PredictionResult) => {
    try {
      const score20 = predictionData.prediction_20;
      const score100 = predictionData.prediction_100;
      const letterGrade = predictionData.letter_grade;

      // Generar recomendaciones basadas en el rango de calificación

      // Generar sugerencias basadas en el rango de calificación
      const suggestions = [];
      let urgencyLevel: "success" | "warning" | "error" = "success";

      if (score20 >= 18) {
        // AD - Excelente (18-20)
        suggestions.push(
          "¡Excelente rendimiento! Mantén tu dedicación y constancia"
        );
        suggestions.push(
          "Considera ser mentor de otros estudiantes para reforzar tu aprendizaje"
        );
        suggestions.push(
          "Explora temas avanzados o proyectos de investigación en tus áreas de interés"
        );
        urgencyLevel = "success";
      } else if (score20 >= 14) {
        // A - Muy Bueno (14-17)
        suggestions.push(
          "Muy buen rendimiento académico. Estás en el camino correcto"
        );
        suggestions.push(
          "Para alcanzar la excelencia, incrementa tus horas de estudio en 2-3 horas semanales"
        );
        suggestions.push(
          "Participa más activamente en discusiones de clase y actividades extracurriculares"
        );
        urgencyLevel = "success";
      } else if (score20 >= 10) {
        // B - Bueno (10-13)
        suggestions.push(
          "Buen rendimiento. Con algunas mejoras puedes alcanzar un nivel superior"
        );
        suggestions.push(
          "Incrementa gradualmente tus horas de estudio y organiza mejor tu tiempo"
        );
        suggestions.push(
          "Considera buscar apoyo académico en las materias más desafiantes"
        );
        urgencyLevel = "warning";
      } else {
        // C - En Proceso (<10)
        suggestions.push(
          "Es importante mejorar el rendimiento académico con urgencia"
        );
        suggestions.push(
          "Busca apoyo académico inmediato: tutorías, grupos de estudio, o asesoría docente"
        );
        suggestions.push(
          "Revisa y mejora tus hábitos de estudio, horarios y técnicas de aprendizaje"
        );
        urgencyLevel = "error";
      }

      // Recomendaciones adicionales basadas en datos del estudiante
      if (formData.study_hours < 10) {
        suggestions.push(
          "Incrementa tus horas de estudio semanales a al menos 10-12 horas"
        );
      }
      if (formData.attendance < 85) {
        suggestions.push(
          "Mejora tu asistencia a clases para no perderte contenido importante"
        );
      }
      if (formData.tutoring_sessions === 0 && score20 < 14) {
        suggestions.push(
          "Considera sesiones de tutoría para obtener apoyo personalizado"
        );
      }

      // Crear objeto de recomendaciones
      const recommendationsData = {
        success: true,
        prediction: {
          exam_score: score20,
          grade_letter: letterGrade,
          grade_20: score20,
          grade_100: score100,
          confidence: 0.85, // Convertir a número para compatibilidad
        },
        recommendations: {
          suggestions,
          urgency_level: urgencyLevel,
          source: "Análisis Local Inteligente",
          ai_confidence: 0.95, // Alta confianza en recomendaciones basadas en datos reales
        },
        analysis: {
          risk_factors: _analyzeRiskFactors(formData, score20),
          strengths: _analyzeStrengths(formData),
          improvement_areas: _analyzeImprovementAreas(formData, score20),
        },
      };

      setRecommendations(recommendationsData);
      // Recomendaciones generadas exitosamente
    } catch {
      // Error al generar recomendaciones
    }
  };

  // Funciones de análisis local (principio DRY)
  const _analyzeRiskFactors = (studentData: StudentFormData, score: number) => {
    const factors = [];
    if (studentData.study_hours < 8)
      factors.push("Horas de estudio insuficientes");
    if (studentData.attendance < 80) factors.push("Asistencia baja a clases");
    if (studentData.previous_scores < 70)
      factors.push("Historial académico previo bajo");
    if (studentData.tutoring_sessions === 0 && score < 12)
      factors.push("Falta de apoyo académico adicional");
    return factors.length > 0
      ? factors
      : ["No se identificaron factores de riesgo significativos"];
  };

  const _analyzeStrengths = (studentData: StudentFormData) => {
    const strengths = [];
    if (studentData.study_hours >= 12)
      strengths.push("Excelente dedicación al estudio");
    if (studentData.attendance >= 95)
      strengths.push("Asistencia sobresaliente");
    if (studentData.previous_scores >= 85)
      strengths.push("Historial académico sólido");
    if (studentData.tutoring_sessions > 0)
      strengths.push("Búsqueda proactiva de apoyo académico");
    if (studentData.motivation_level === "High")
      strengths.push("Alta motivación para aprender");
    return strengths.length > 0
      ? strengths
      : ["Mantiene un rendimiento estable"];
  };

  const _analyzeImprovementAreas = (
    studentData: StudentFormData,
    score: number
  ) => {
    const areas = [];
    if (studentData.study_hours < 10)
      areas.push("Incrementar tiempo de estudio semanal");
    if (studentData.attendance < 90)
      areas.push("Mejorar consistencia en asistencia");
    if (score < 14) areas.push("Reforzar técnicas de estudio y comprensión");
    if (studentData.physical_activity < 3)
      areas.push(
        "Incluir más actividad física para mejor rendimiento cognitivo"
      );
    return areas.length > 0
      ? areas
      : ["Mantener el nivel actual de rendimiento"];
  };

  // Función simple para generar recomendaciones generales en análisis masivo (principio KISS)
  const generateBatchRecommendations = (csvData: CSVPredictionResponse) => {
    const predictions = csvData.results || [];
    if (predictions.length === 0) return;

    // Análisis estadístico simple
    const scores = predictions.map((p: CSVPredictionRow) => p.prediction_20);
    const avgScore =
      scores.reduce((a: number, b: number) => a + b, 0) / scores.length;
    const lowPerformers = predictions.filter(
      (p: CSVPredictionRow) => p.prediction_20 < 11
    ).length;
    const highPerformers = predictions.filter(
      (p: CSVPredictionRow) => p.prediction_20 >= 17
    ).length;
    const percentageLow = (lowPerformers / predictions.length) * 100;
    const percentageHigh = (highPerformers / predictions.length) * 100;

    // Generar recomendaciones simples basadas en estadísticas
    const suggestions = [];

    if (percentageLow > 30) {
      suggestions.push(
        "Se recomienda implementar programas de apoyo académico adicional"
      );
      suggestions.push(
        "Considerar tutorías grupales o sesiones de reforzamiento"
      );
    }

    if (avgScore < 14) {
      suggestions.push(
        "El promedio general está por debajo del esperado. Revisar metodología de enseñanza"
      );
    }

    if (percentageHigh < 10) {
      suggestions.push(
        "Implementar actividades de enriquecimiento para estudiantes destacados"
      );
    }

    suggestions.push(`Promedio de predicciones: ${avgScore.toFixed(1)}/20`);
    suggestions.push(
      `${lowPerformers} estudiantes en riesgo (${percentageLow.toFixed(1)}%)`
    );
    suggestions.push(
      `${highPerformers} estudiantes destacados (${percentageHigh.toFixed(1)}%)`
    );

    // Crear objeto de recomendaciones simple
    const batchRecommendations = {
      success: true,
      prediction: {
        exam_score: avgScore * 5, // Convertir a escala 100
        grade_letter:
          avgScore >= 17
            ? "A"
            : avgScore >= 14
            ? "B"
            : avgScore >= 11
            ? "C"
            : "D",
        grade_20: avgScore,
        grade_100: avgScore * 5,
      },
      recommendations: {
        suggestions,
        urgency_level: (percentageLow > 30
          ? "error"
          : percentageLow > 15
          ? "warning"
          : "success") as "error" | "warning" | "success",
        source: "Análisis Estadístico Automático",
        ai_confidence: 85,
      },
      analysis: {
        risk_factors:
          percentageLow > 30
            ? ["Alto porcentaje de estudiantes en riesgo"]
            : [],
        strengths:
          percentageHigh > 20
            ? ["Buen porcentaje de estudiantes destacados"]
            : ["Distribución normal de calificaciones"],
        improvement_areas: avgScore < 14 ? ["Promedio general bajo"] : [],
      },
    };

    setRecommendations(batchRecommendations);
  };

  const handleCSVUpload = async (file: File) => {
    setLoading(true);
    setError(null);

    try {
      // Procesar archivo CSV

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

      // Enviar archivo al backend
      // Enviar archivo al servidor
      // Validar datos del formulario

      const response = await axios.post(API_ROUTES.predictBatch, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 120000, // 2 minutos timeout para archivos grandes
        onUploadProgress: () => {
          // Mostrar progreso de carga
        },
      });

      // Procesar respuesta del servidor

      if (response.data) {
        setCSVResults(response.data);
        // Resultados CSV guardados exitosamente

        // Generar recomendaciones simples para análisis masivo (KISS principle)
        generateBatchRecommendations(response.data);
      }
    } catch (error: unknown) {
      // Error al procesar CSV
      let errorMessage = "Error al procesar el archivo CSV";

      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (axios.isAxiosError(error)) {
        if (error.response?.data?.detail) {
          errorMessage = error.response.data.detail;
        } else if (error.code === "ECONNABORTED") {
          errorMessage =
            "⏱️ Tiempo de espera agotado: El archivo es muy grande o el servidor no responde";
        } else if (error.response?.status === 422) {
          errorMessage =
            "📋 Formato de archivo inválido: Verifica las columnas del archivo CSV";
        } else if (error.response?.status === 500) {
          errorMessage =
            "🔧 Error interno del servidor: Verifica el formato y contenido del CSV";
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
    setRecommendations(null);
    setError(null);
  };

  const tabs = [
    {
      id: "individual" as const,
      label: "🎯 Predicción Individual",
      icon: "👤",
      description:
        "Analiza el rendimiento académico de un estudiante específico",
    },
    {
      id: "csv" as const,
      label: "📊 Análisis Masivo",
      icon: "📈",
      description: "Procesa múltiples estudiantes desde archivo CSV",
    },
  ];

  return (
    <Layout>
      <Head>
        <title>PredictScore ML - Sistema de Predicción Académica</title>
        <meta
          name="description"
          content="Sistema avanzado de Machine Learning para predicción de rendimiento académico estudiantil. Utiliza algoritmos SVR para análisis predictivo y generación de recomendaciones personalizadas."
        />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        {/* Header */}
        <div className="bg-white shadow-lg border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-3">
                🎓 PredictScore ML - Sistema de Predicción Académica
              </h1>
              <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
                Sistema avanzado de Machine Learning para predicción temprana
                del rendimiento estudiantil. Utiliza algoritmos SVR (Support
                Vector Regression) para identificar estudiantes en riesgo y
                generar recomendaciones personalizadas basadas en múltiples
                factores académicos y socioeconómicos.
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
              {/* Componente de Recomendaciones IA - Generación local instantánea */}
              {recommendations && (
                <AIRecommendationsComponent
                  data={recommendations}
                  isLoading={false}
                />
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
                    </>
                  )}
                </div>
              </div>

              {csvResults && (
                <CSVBatchResults results={csvResults} onReset={resetResults} />
              )}

              {/* Componente de Recomendaciones IA para análisis masivo - Generación automática */}
              {csvResults && recommendations && (
                <AIRecommendationsComponent
                  data={recommendations}
                  isLoading={false}
                />
              )}
            </div>
          )}

          {/* Footer Técnico Profesional */}
          <div className="mt-12">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow-lg p-8 border border-blue-100">
              <div className="text-center mb-8">
                <h4 className="text-2xl font-bold text-gray-800 mb-3">
                  Especificaciones Técnicas del Modelo
                </h4>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Sistema de predicción académica basado en Machine Learning,
                  desarrollado con arquitectura moderna y algoritmos de
                  regresión avanzados.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-blue-100 text-center">
                  <span className="text-3xl mb-3 block">🧠</span>
                  <div className="font-bold text-blue-700 text-lg">
                    Algoritmo
                  </div>
                  <div className="text-sm text-blue-600 mt-2">
                    Support Vector Regression (SVR)
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Kernel RBF optimizado
                  </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-green-100 text-center">
                  <span className="text-3xl mb-3 block">🎯</span>
                  <div className="font-bold text-green-700 text-lg">
                    Precisión
                  </div>
                  <div className="text-sm text-green-600 mt-2">
                    R² Score: 75.61%
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    RMSE: 8.23 puntos
                  </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-purple-100 text-center">
                  <span className="text-3xl mb-3 block">📊</span>
                  <div className="font-bold text-purple-700 text-lg">
                    Dataset
                  </div>
                  <div className="text-sm text-purple-600 mt-2">
                    17 variables predictivas
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Factores académicos y socioeconómicos
                  </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-amber-100 text-center">
                  <span className="text-3xl mb-3 block">⚡</span>
                  <div className="font-bold text-amber-700 text-lg">
                    Rendimiento
                  </div>
                  <div className="text-sm text-amber-600 mt-2">
                    &lt; 5ms por predicción
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Escalable para análisis masivo
                  </div>
                </div>
              </div>

              {/* Información adicional del proyecto */}
              <div className="mt-8 p-6 bg-white rounded-lg border border-gray-200">
                <div className="text-center">
                  <h5 className="text-lg font-semibold text-gray-800 mb-2">
                    🎓 Proyecto Final - Machine Learning
                  </h5>
                  <p className="text-sm text-gray-600">
                    Sistema desarrollado aplicando principios SOLID, KISS y DRY
                    • Arquitectura modular con FastAPI + Next.js •
                    Implementación de mejores prácticas de desarrollo
                  </p>
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
