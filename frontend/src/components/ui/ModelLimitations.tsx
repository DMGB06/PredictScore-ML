import React from "react";

const ModelLimitations: React.FC = () => {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
      <div className="flex items-start gap-3">
        <span className="text-amber-600 text-lg">⚠️</span>
        <div>
          <h4 className="text-amber-800 font-semibold mb-2">
            Nota sobre el Modelo Actual
          </h4>
          <div className="text-amber-700 text-sm space-y-1">
            <p>
              • <strong>Modelo en optimización:</strong> Actualmente el modelo
              tiende a predecir valores conservadores
            </p>
            <p>
              • <strong>Dificultad para AD:</strong> El modelo rara vez predice
              calificaciones AD (18-20) debido a su entrenamiento
            </p>
            <p>
              • <strong>Uso recomendado:</strong> Utilizar como referencia
              orientativa, no como predicción definitiva
            </p>
            <p>
              • <strong>Próximas mejoras:</strong> Se está reentrenando con más
              datos para mayor precisión
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelLimitations;
