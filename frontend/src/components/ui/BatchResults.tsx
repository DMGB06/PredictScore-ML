import React, { useMemo } from "react";
import { BatchPredictionResult, StudentFormData } from "@/types/student";
import PerformanceIndicator from "./PerformanceIndicator";
import { PERFORMANCE_CATEGORIES } from "@/constants";

interface BatchResultsProps {
  results: BatchPredictionResult;
  students: StudentFormData[];
  onReset: () => void;
}

const BatchResults: React.FC<BatchResultsProps> = ({
  results,
  students,
  onReset,
}) => {
  const { predictions, count, average_score, model_used, processing_time } =
    results.data;

  const statistics = useMemo(() => {
    const categories = {
      excellent: 0,
      good: 0,
      average: 0,
      poor: 0,
    };

    predictions.forEach((score) => {
      if (score >= PERFORMANCE_CATEGORIES.excellent.min) categories.excellent++;
      else if (score >= PERFORMANCE_CATEGORIES.good.min) categories.good++;
      else if (score >= PERFORMANCE_CATEGORIES.average.min)
        categories.average++;
      else categories.poor++;
    });

    return {
      categories,
      min: Math.min(...predictions),
      max: Math.max(...predictions),
      median: predictions.sort((a, b) => a - b)[
        Math.floor(predictions.length / 2)
      ],
    };
  }, [predictions]);

  const getProgressPercentage = (value: number, total: number) =>
    (value / total) * 100;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-800">
          Resultados de Predicción por Lotes
        </h3>
        <button
          onClick={onReset}
          className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200"
        >
          Nuevo Análisis
        </button>
      </div>

      {/* Resumen General */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{count}</div>
          <div className="text-sm text-blue-700">Estudiantes</div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-600">
            {average_score.toFixed(1)}
          </div>
          <div className="text-sm text-green-700">Promedio</div>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-orange-600">
            {statistics.max.toFixed(1)}
          </div>
          <div className="text-sm text-orange-700">Máximo</div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-red-600">
            {statistics.min.toFixed(1)}
          </div>
          <div className="text-sm text-red-700">Mínimo</div>
        </div>
      </div>

      {/* Distribución de Rendimiento */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">
          Distribución de Rendimiento
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(PERFORMANCE_CATEGORIES).map(([key, category]) => {
            const categoryKey = key as keyof typeof statistics.categories;
            const count = statistics.categories[categoryKey];
            const percentage = getProgressPercentage(count, predictions.length);

            return (
              <div
                key={key}
                className={`${category.bgColor} ${category.borderColor} border-2 rounded-lg p-4`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-lg ${category.color}`}>
                    {category.indicator}
                  </span>
                  <span className={`font-semibold ${category.color}`}>
                    {category.label}
                  </span>
                </div>
                <div className="text-2xl font-bold mb-1">{count}</div>
                <div className="text-sm opacity-75">
                  {percentage.toFixed(1)}%
                </div>
                <div className="mt-2 bg-white bg-opacity-50 rounded-full h-2">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${category.color
                      .replace("text-", "bg-")
                      .replace("-700", "-400")}`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Lista Detallada de Resultados */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">
          Resultados Individuales
        </h4>
        <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-lg">
          <div className="grid grid-cols-1 gap-2 p-4">
            {predictions.map((score, index) => {
              const student = students[index];
              return (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  <div className="flex items-center gap-4">
                    <span className="font-medium text-gray-600">
                      #{index + 1}
                    </span>
                    <div className="text-sm">
                      <div className="font-medium">Estudiante {index + 1}</div>
                      <div className="text-gray-500">
                        {student.study_hours}h • {student.attendance}% •{" "}
                        {student.previous_scores}pts
                      </div>
                    </div>
                  </div>
                  <PerformanceIndicator score={score} size="sm" />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Información Técnica */}
      <div className="border-t pt-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-gray-500 mb-1">Modelo Utilizado</div>
            <div className="font-semibold">{model_used}</div>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-gray-500 mb-1">Tiempo de Procesamiento</div>
            <div className="font-semibold">
              {(processing_time * 1000).toFixed(1)}ms
            </div>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-gray-500 mb-1">Mediana</div>
            <div className="font-semibold">
              {statistics.median.toFixed(1)} puntos
            </div>
          </div>
        </div>
      </div>

      {/* Recomendaciones Generales */}
      <div className="border-t pt-6 mt-4">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">
          Recomendaciones Generales
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {statistics.categories.poor > 0 && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="font-semibold text-red-700 mb-2">
                Atención Inmediata Requerida
              </div>
              <div className="text-red-600 text-sm">
                {statistics.categories.poor} estudiante(s) en riesgo crítico
                necesitan intervención inmediata.
              </div>
            </div>
          )}

          {statistics.categories.average > 0 && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="font-semibold text-yellow-700 mb-2">
                Seguimiento Necesario
              </div>
              <div className="text-yellow-600 text-sm">
                {statistics.categories.average} estudiante(s) requieren
                seguimiento y apoyo adicional.
              </div>
            </div>
          )}

          {statistics.categories.excellent > 0 && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="font-semibold text-green-700 mb-2">
                Rendimiento Sobresaliente
              </div>
              <div className="text-green-600 text-sm">
                {statistics.categories.excellent} estudiante(s) con excelente
                rendimiento pueden servir como tutores.
              </div>
            </div>
          )}

          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="font-semibold text-blue-700 mb-2">
              Análisis Global
            </div>
            <div className="text-blue-600 text-sm">
              Promedio general: {average_score.toFixed(1)} puntos.
              {average_score >= 75
                ? " Grupo con buen rendimiento general."
                : average_score >= 65
                ? " Grupo requiere apoyo moderado."
                : " Grupo necesita intervención significativa."}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BatchResults;
