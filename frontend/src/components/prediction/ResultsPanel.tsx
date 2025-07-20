import React from 'react';

interface PredictionResponse {
  predicted_score: number;
  confidence: number;
  letter_grade: string;
  model_info: {
    model_name: string;
    r2_score: number;
  };
}

interface ResultsPanelProps {
  prediction: PredictionResponse | null;
  loading: boolean;
  error: string | null;
}

const getGradeColor = (score: number): string => {
  if (score >= 18) return "text-green-600 dark:text-green-400";
  if (score >= 14) return "text-blue-600 dark:text-blue-400";
  if (score >= 10) return "text-yellow-600 dark:text-yellow-400";
  if (score >= 6) return "text-orange-600 dark:text-orange-400";
  return "text-red-600 dark:text-red-400";
};

const getProgressBarColor = (score: number): string => {
  if (score >= 18) return "bg-gradient-to-r from-green-500 to-green-600";
  if (score >= 14) return "bg-gradient-to-r from-blue-500 to-blue-600";
  if (score >= 10) return "bg-gradient-to-r from-yellow-500 to-yellow-600";
  if (score >= 6) return "bg-gradient-to-r from-orange-500 to-orange-600";
  return "bg-gradient-to-r from-red-500 to-red-600";
};

const getScoreLabel = (score: number): string => {
  if (score >= 18) return "🎉 Excelente";
  if (score >= 14) return "👍 Bueno";
  if (score >= 10) return "✅ Regular";
  if (score >= 6) return "⚠️ Necesita Mejora";
  return "❌ Insuficiente";
};

const ResultsPanel: React.FC<ResultsPanelProps> = ({ prediction, loading, error }) => {
  return (
    <div className="card bg-white/90 dark:bg-dark-card/90 rounded-2xl shadow-xl p-8 sticky top-8">
      <h3 className="text-xl font-bold text-azure-800 dark:text-dark-text mb-6">
        Resultado de la Predicción
      </h3>

      {!prediction && !loading && (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-azure-100 to-azure-200 dark:from-dark-hover dark:to-dark-card rounded-full flex items-center justify-center">
            <span className="text-4xl">📊</span>
          </div>
          <p className="text-azure-600 dark:text-dark-text/70">
            Completa el formulario para obtener la predicción
          </p>
        </div>
      )}

      {loading && (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-azure-500 to-azure-600 dark:from-dark-accent dark:to-indigo-600 rounded-full flex items-center justify-center animate-pulse">
            <svg className="animate-spin h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <p className="text-azure-600 dark:text-dark-text/70">Procesando con IA...</p>
        </div>
      )}

      {prediction && (
        <div className="space-y-6">
          {/* Score Predicho */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="text-5xl font-bold text-transparent bg-gradient-to-r from-azure-600 to-azure-800 dark:from-dark-accent dark:to-indigo-400 bg-clip-text">
                {prediction.predicted_score.toFixed(1)}
              </div>
              <div className={`text-4xl font-bold px-4 py-2 rounded-xl border-2 ${getGradeColor(prediction.predicted_score)} bg-white/50 dark:bg-dark-hover/50`}>
                {prediction.letter_grade}
              </div>
            </div>
            <p className="text-azure-600 dark:text-dark-text/70 font-medium mb-2">
              Puntuación Predicha (0-20)
            </p>
            <div className="text-xs text-azure-500 dark:text-dark-text/60">
              {getScoreLabel(prediction.predicted_score)}
            </div>
          </div>

          {/* Barra de progreso visual */}
          <div className="bg-azure-50 dark:bg-dark-hover rounded-xl p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-azure-700 dark:text-dark-text">Progreso (0-20)</span>
              <span className="text-sm font-bold text-azure-800 dark:text-dark-text">
                {prediction.predicted_score.toFixed(1)}/20
              </span>
            </div>
            <div className="w-full bg-azure-200 dark:bg-dark-card rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all duration-1000 ${getProgressBarColor(prediction.predicted_score)}`}
                style={{ width: `${(prediction.predicted_score / 20) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Confianza */}
          <div className="bg-azure-50 dark:bg-dark-hover rounded-xl p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-azure-700 dark:text-dark-text">Confianza del Modelo</span>
              <span className="text-sm font-bold text-azure-800 dark:text-dark-text">
                {(prediction.confidence * 100).toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-azure-200 dark:bg-dark-card rounded-full h-2">
              <div
                className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${prediction.confidence * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Información del Modelo */}
          <div className="border-t border-azure-200 dark:border-dark-border pt-4">
            <h4 className="text-sm font-semibold text-azure-700 dark:text-dark-text mb-3">Información del Modelo</h4>
            <div className="space-y-2 text-sm">
              {[
                { label: "Modelo", value: prediction.model_info.model_name },
                { label: "R² Score", value: prediction.model_info.r2_score },
                { label: "Variables", value: "17 características" }
              ].map((item, idx) => (
                <div key={idx} className="flex justify-between">
                  <span className="text-azure-600 dark:text-dark-text/70">{item.label}:</span>
                  <span className="text-azure-800 dark:text-dark-text font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
            <span className="text-4xl">❌</span>
          </div>
          <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
        </div>
      )}
    </div>
  );
};

export default ResultsPanel;
