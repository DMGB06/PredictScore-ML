import React from "react";
import { PredictionResult } from "@/types/student";
import PerformanceIndicator from "./PerformanceIndicator";

interface PredictionResultsProps {
  result: PredictionResult;
  onReset: () => void;
}

const PredictionResults: React.FC<PredictionResultsProps> = ({
  result,
  onReset,
}) => {
  const { prediction, confidence, model_used, processing_time } = result.data;

  const getConfidenceColor = (confidence: string) => {
    switch (confidence.toLowerCase()) {
      case "high":
        return "text-green-600 bg-green-50 border-green-200";
      case "medium":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "low":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getRecommendations = (score: number, confidence: string) => {
    const recommendations = [];

    if (score >= 85) {
      recommendations.push("Mantener el excelente rendimiento actual");
      recommendations.push("Considerar programas de enriquecimiento académico");
      recommendations.push("Puede servir como tutor para otros estudiantes");
    } else if (score >= 75) {
      recommendations.push("Seguir mejorando con estrategias de estudio");
      recommendations.push("Mantener la motivación y disciplina");
      recommendations.push("Buscar recursos adicionales en áreas específicas");
    } else if (score >= 65) {
      recommendations.push("Requiere atención y seguimiento cercano");
      recommendations.push("Considerar sesiones de tutoría adicionales");
      recommendations.push("Revisar hábitos de estudio y planificación");
    } else {
      recommendations.push("Intervención inmediata necesaria");
      recommendations.push("Involucrar a la familia en el proceso");
      recommendations.push(
        "Evaluar factores externos que puedan afectar el rendimiento"
      );
      recommendations.push("Implementar plan de apoyo personalizado");
    }

    if (confidence === "low") {
      recommendations.push(
        "Se recomienda recolectar más datos para mayor precisión"
      );
    }

    return recommendations;
  };

  const recommendations = getRecommendations(prediction, confidence);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-800">
          Resultado de la Predicción
        </h3>
        <button
          onClick={onReset}
          className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200"
        >
          Nueva Predicción
        </button>
      </div>

      {/* Resultado Principal */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="text-center">
          <h4 className="text-lg font-semibold text-gray-700 mb-3">
            Puntuación Predicha
          </h4>
          <PerformanceIndicator
            score={prediction}
            showDescription={true}
            size="lg"
          />
        </div>

        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              Nivel de Confianza
            </h4>
            <div
              className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border-2 ${getConfidenceColor(
                confidence
              )}`}
            >
              <span className="text-sm font-semibold capitalize">
                {confidence}
              </span>
              <span className="text-xs">
                {confidence === "high"
                  ? "(85-100%)"
                  : confidence === "medium"
                  ? "(60-84%)"
                  : "(< 60%)"}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-gray-500">Modelo</div>
              <div className="font-semibold">{model_used}</div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-gray-500">Tiempo</div>
              <div className="font-semibold">
                {(processing_time * 1000).toFixed(1)}ms
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recomendaciones */}
      <div className="border-t pt-6">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">
          Recomendaciones Personalizadas
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {recommendations.map((recommendation, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors duration-200"
            >
              <div className="text-blue-700 text-sm">{recommendation}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Gráfico de Progreso Visual */}
      <div className="border-t pt-6 mt-6">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">
          Escala de Rendimiento
        </h4>
        <div className="relative">
          <div className="flex h-8 rounded-lg overflow-hidden border">
            <div className="flex-1 bg-red-200 flex items-center justify-center text-xs font-medium text-red-800">
              0-64 Deficiente
            </div>
            <div className="flex-1 bg-yellow-200 flex items-center justify-center text-xs font-medium text-yellow-800">
              65-74 Regular
            </div>
            <div className="flex-1 bg-blue-200 flex items-center justify-center text-xs font-medium text-blue-800">
              75-84 Bueno
            </div>
            <div className="flex-1 bg-green-200 flex items-center justify-center text-xs font-medium text-green-800">
              85-100 Excelente
            </div>
          </div>

          {/* Indicador de posición */}
          <div
            className="absolute top-0 bottom-0 w-2 bg-gray-800 rounded transform -translate-x-1"
            style={{ left: `${prediction}%` }}
          >
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded">
              {prediction.toFixed(1)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PredictionResults;
