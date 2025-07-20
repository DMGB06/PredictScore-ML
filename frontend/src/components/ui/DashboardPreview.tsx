import React from "react";

interface DashboardPreviewProps {
  className?: string;
}

const DashboardPreview: React.FC<DashboardPreviewProps> = ({
  className = "",
}) => (
  <div className={`relative animate-slide-up ${className}`}>
    <div className="neo-container bg-gradient-to-br from-white/90 to-blue-50/90 dark:from-dark-card/90 dark:to-dark-surface/90 backdrop-blur-xl rounded-3xl border border-blue-200/30 dark:border-dark-border/30 shadow-xl hover:shadow-2xl dark:hover:shadow-dark-accent/20 transition-all duration-500 p-8">
      {/* Simulación de dashboard */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-blue-800 dark:text-dark-text">
            Análisis en Tiempo Real
          </h3>
          <div
            className="w-3 h-3 bg-green-500 dark:bg-green-400 rounded-full animate-pulse shadow-lg dark:shadow-green-400/50"
            aria-label="Estado: Activo"
          />
        </div>

        {/* Gráfico simulado */}
        <div className="h-32 bg-gradient-to-r from-blue-100 to-blue-200 dark:from-dark-hover dark:to-dark-card rounded-xl relative overflow-hidden border dark:border-dark-border/30">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-indigo-500/20 dark:from-dark-accent/30 dark:via-purple-400/20 dark:to-blue-400/20 animate-pulse" />
          <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
            <div className="w-8 h-16 bg-blue-500 dark:bg-dark-accent rounded-t opacity-80 shadow-lg" />
            <div className="w-8 h-20 bg-purple-500 dark:bg-purple-400 rounded-t opacity-90 shadow-lg" />
            <div className="w-8 h-12 bg-indigo-500 dark:bg-blue-400 rounded-t opacity-70 shadow-lg" />
            <div className="w-8 h-24 bg-blue-600 dark:bg-indigo-400 rounded-t opacity-95 shadow-lg" />
          </div>
        </div>

        {/* Métricas */}
        <div className="grid grid-cols-2 gap-4">
          <div className="card bg-white/80 dark:bg-dark-card/80 rounded-2xl shadow-xl p-4 border border-blue-100/50 dark:border-dark-border/30 backdrop-blur-md transition-all duration-300">
            <div className="text-2xl font-bold text-blue-700 dark:text-dark-text">
              77.5
            </div>
            <div className="text-sm text-blue-600 dark:text-dark-text/70">
              Score Predicho
            </div>
          </div>
          <div className="card bg-white/80 dark:bg-dark-card/80 rounded-2xl shadow-xl p-4 border border-blue-100/50 dark:border-dark-border/30 backdrop-blur-md transition-all duration-300">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              Alto
            </div>
            <div className="text-sm text-blue-600 dark:text-dark-text/70">
              Confianza
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default DashboardPreview;
