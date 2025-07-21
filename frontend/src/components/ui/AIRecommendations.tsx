import React, { useState } from "react";

interface Prediction {
  exam_score: number;
  grade_letter: string;
  grade_20: number;
  grade_100: number;
  confidence?: number;
}

interface AIRecommendations {
  suggestions: string[];
  urgency_level: "success" | "warning" | "error";
  source: string;
  ai_confidence?: number;
  tokens_used?: number;
}

interface StudentAnalysis {
  risk_factors: string[];
  strengths: string[];
  improvement_areas: string[];
}

interface AIRecommendationsData {
  success: boolean;
  prediction: Prediction;
  recommendations: AIRecommendations;
  analysis: StudentAnalysis;
}

export type { AIRecommendationsData };

interface AIRecommendationsProps {
  data: AIRecommendationsData;
  isLoading?: boolean;
  onClose?: () => void;
}

const urgencyConfig = {
  success: {
    bg: "bg-green-50 dark:bg-green-950",
    border: "border-green-200 dark:border-green-800",
    badge: "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100",
  },
  warning: {
    bg: "bg-amber-50 dark:bg-amber-950",
    border: "border-amber-200 dark:border-amber-800",
    badge: "bg-amber-100 text-amber-800 dark:bg-amber-800 dark:text-amber-100",
  },
  error: {
    bg: "bg-red-50 dark:bg-red-950",
    border: "border-red-200 dark:border-red-800",
    badge: "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100",
  },
};

const AIRecommendationsComponent: React.FC<AIRecommendationsProps> = ({
  data,
  isLoading = false,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<"recommendations" | "analysis">(
    "recommendations"
  );

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
          <div className="text-lg font-semibold text-gray-900 dark:text-white">
            Generando recomendaciones con IA...
          </div>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!data.success) {
    return (
      <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-xl p-6">
        <div className="flex items-center space-x-3">
          <div className="w-5 h-5 text-red-600">⚠️</div>
          <div className="text-red-800 dark:text-red-200">
            Error generando recomendaciones. Intenta nuevamente.
          </div>
        </div>
      </div>
    );
  }

  const { recommendations, analysis } = data;
  const urgencyStyle = urgencyConfig[recommendations.urgency_level];

  return (
    <div
      className={`relative rounded-xl shadow-lg border p-6 ${urgencyStyle.bg} ${urgencyStyle.border}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${urgencyStyle.badge}`}>🤖</div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              🤖 Recomendaciones Personalizadas
            </h3>
            <div className="flex items-center space-x-2 mt-1">
              {recommendations.source === "openai" && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100">
                  Powered by AI
                </span>
              )}
            </div>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Cerrar recomendaciones"
          >
            ✕
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-6 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab("recommendations")}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === "recommendations"
              ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm"
              : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          }`}
        >
          Recomendaciones
        </button>
        <button
          onClick={() => setActiveTab("analysis")}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === "analysis"
              ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm"
              : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          }`}
        >
          Análisis
        </button>
      </div>

      {/* Content */}
      <div>
        {activeTab === "recommendations" && (
          <div className="space-y-4">
            <div className="space-y-3">
              {recommendations.suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600"
                >
                  <div className="mt-0.5 text-blue-600">🎯</div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                    {suggestion}
                  </p>
                </div>
              ))}
            </div>

            {/* Metadata */}
            {(recommendations.ai_confidence || recommendations.tokens_used) && (
              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  {recommendations.ai_confidence && (
                    <span>
                      Confianza IA:{" "}
                      {(recommendations.ai_confidence * 100).toFixed(0)}%
                    </span>
                  )}
                  {recommendations.tokens_used && (
                    <span>Tokens: {recommendations.tokens_used}</span>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "analysis" && (
          <div className="space-y-6">
            {/* Fortalezas */}
            {analysis.strengths.length > 0 && (
              <div>
                <h4 className="flex items-center space-x-2 text-lg font-semibold text-green-800 dark:text-green-200 mb-3">
                  <span>⭐</span>
                  <span>Fortalezas</span>
                </h4>
                <div className="space-y-2">
                  {analysis.strengths.map((strength, index) => (
                    <div
                      key={index}
                      className="flex items-start space-x-2 text-sm text-gray-700 dark:text-gray-300"
                    >
                      <span className="text-green-500 mt-1">✓</span>
                      <span>{strength}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Áreas de mejora */}
            {analysis.improvement_areas.length > 0 && (
              <div>
                <h4 className="flex items-center space-x-2 text-lg font-semibold text-blue-800 dark:text-blue-200 mb-3">
                  <span>🎯</span>
                  <span>Áreas de Mejora</span>
                </h4>
                <div className="space-y-2">
                  {analysis.improvement_areas.map((area, index) => (
                    <div
                      key={index}
                      className="flex items-start space-x-2 text-sm text-gray-700 dark:text-gray-300"
                    >
                      <span className="text-blue-500 mt-1">→</span>
                      <span>{area}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Factores de riesgo */}
            {analysis.risk_factors.length > 0 && (
              <div>
                <h4 className="flex items-center space-x-2 text-lg font-semibold text-red-800 dark:text-red-200 mb-3">
                  <span>⚠️</span>
                  <span>Factores de Riesgo</span>
                </h4>
                <div className="space-y-2">
                  {analysis.risk_factors.map((risk, index) => (
                    <div
                      key={index}
                      className="flex items-start space-x-2 text-sm text-gray-700 dark:text-gray-300"
                    >
                      <span className="text-red-500 mt-1">⚠</span>
                      <span>{risk}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AIRecommendationsComponent;
