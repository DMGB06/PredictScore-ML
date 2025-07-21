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
  const {
    prediction_100,
    prediction_20,
    letter_grade,
    confidence,
    model_used,
    processing_time,
  } = result;

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

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-800">
          📊 Resultados de Predicción Académica
        </h3>
        <button
          onClick={onReset}
          className="px-4 py-2 text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors duration-200 font-medium"
        >
          🔄 Nueva Predicción
        </button>
      </div>

      {/* Resultado Principal */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="text-center">
          <h4 className="text-lg font-semibold text-gray-700 mb-3">
            🎯 Predicción de Rendimiento
          </h4>
          <PerformanceIndicator
            score={prediction_20}
            showDescription={true}
            size="lg"
          />

          {/* Mostrar ambas escalas */}
          <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
              <div className="text-blue-600 font-medium">Escala 20</div>
              <div className="text-lg font-bold text-blue-800">
                {prediction_20.toFixed(1)}
              </div>
              <div className="text-xs text-blue-600">{letter_grade}</div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
              <div className="text-gray-600 font-medium">Escala 100</div>
              <div className="text-lg font-bold text-gray-800">
                {prediction_100.toFixed(1)}
              </div>
              <div className="text-xs text-gray-600">Referencia</div>
            </div>
          </div>
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
                {confidence === "High"
                  ? "(85-100%)"
                  : confidence === "Medium"
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

      {/* Gráfico de Progreso Visual */}
      <div className="border-t pt-6 mt-6">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">
          Escala de Rendimiento (Escala 20)
        </h4>
        <div className="relative">
          <div className="flex h-8 rounded-lg overflow-hidden border">
            <div className="flex-1 bg-red-200 flex items-center justify-center text-xs font-medium text-red-800">
              0-10 C
            </div>
            <div className="flex-1 bg-amber-200 flex items-center justify-center text-xs font-medium text-amber-800">
              10-13 B
            </div>
            <div className="flex-1 bg-blue-200 flex items-center justify-center text-xs font-medium text-blue-800">
              14-17 A
            </div>
            <div className="flex-1 bg-emerald-200 flex items-center justify-center text-xs font-medium text-emerald-800">
              18-20 AD
            </div>
          </div>

          {/* Indicador de posición */}
          <div
            className="absolute top-0 bottom-0 w-2 bg-gray-800 rounded transform -translate-x-1"
            style={{ left: `${(prediction_20 / 20) * 100}%` }}
          >
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded">
              {prediction_20.toFixed(1)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PredictionResults;
