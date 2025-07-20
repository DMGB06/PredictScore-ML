import React from 'react';

interface VariableGuideProps {
  showGuide: boolean;
  onToggle: () => void;
}

const VariableGuide: React.FC<VariableGuideProps> = ({ showGuide, onToggle }) => {
  return (
    <>
      {/* Botón para mostrar guía */}
      <button
        onClick={onToggle}
        className="inline-flex items-center px-4 py-2 bg-azure-600 dark:bg-dark-accent hover:bg-azure-700 dark:hover:bg-indigo-500 text-white rounded-lg transition-all duration-300 font-medium shadow-lg hover:shadow-xl"
      >
        <svg
          className={`w-5 h-5 mr-2 transition-transform duration-300 ${
            showGuide ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
        {showGuide ? "Ocultar" : "Ver"} Guía de Variables
      </button>

      {/* Guía de Variables (Desplegable) */}
      {showGuide && (
        <div className="mb-8 card bg-gradient-to-br from-azure-50 to-azure-100 dark:from-dark-card dark:to-dark-surface rounded-2xl shadow-xl p-8 border border-azure-200/50 dark:border-dark-border/50">
          <h2 className="text-2xl font-bold text-azure-800 dark:text-dark-text mb-6 flex items-center">
            📚 Guía de Variables del Modelo (14 variables base + 3 calculadas automáticamente)
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-azure-700 dark:text-dark-text border-b border-azure-200 dark:border-dark-border pb-2">
                Variables Numéricas (4)
              </h3>
              {[
                { name: "Hours_Studied", desc: "Horas de estudio por semana (0-50)" },
                { name: "Attendance", desc: "Porcentaje de asistencia (0-100)" },
                { name: "Previous_Scores", desc: "Puntuaciones previas (0-100)" },
                { name: "Tutoring_Sessions", desc: "Sesiones de tutoría por mes (0-10)" }
              ].map((item) => (
                <div key={item.name} className="bg-white dark:bg-dark-hover rounded-lg p-3">
                  <strong className="text-azure-700 dark:text-dark-text">{item.name}:</strong>
                  <span className="text-azure-600 dark:text-dark-text/80 ml-2">{item.desc}</span>
                </div>
              ))}

              <h3 className="text-lg font-semibold text-green-700 dark:text-green-300 border-b border-green-200 dark:border-green-700 pb-2 mt-6">
                Variables Calculadas Automáticamente ✨
              </h3>
              {[
                { name: "Study_Efficiency", desc: "Hours_Studied / (Previous_Scores + 1)" },
                { name: "High_Support", desc: "Basado en Tutoring_Sessions y Access_to_Resources" },
                { name: "Family_Education_Support", desc: "Basado en Parental_Education_Level y Parental_Involvement" }
              ].map((item) => (
                <div key={item.name} className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 border border-green-200 dark:border-green-700">
                  <strong className="text-green-700 dark:text-green-300">{item.name}:</strong>
                  <span className="text-green-600 dark:text-green-400 ml-2">{item.desc}</span>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-azure-700 dark:text-dark-text border-b border-azure-200 dark:border-dark-border pb-2">
                Variables Categóricas (10)
              </h3>
              {[
                { label: "Niveles (0=Bajo, 1=Medio, 2=Alto)", vars: "Parental_Involvement, Motivation_Level, Family_Income" },
                { label: "Acceso (0=Bajo, 1=Medio, 2=Alto)", vars: "Access_to_Resources, Teacher_Quality" },
                { label: "Binarias (0=No, 1=Sí)", vars: "Extracurricular_Activities, Learning_Disabilities" },
                { label: "Peer_Influence", vars: "0=Negativa, 1=Neutral, 2=Positiva" },
                { label: "Parental_Education_Level", vars: "0=Secundaria, 1=Universidad, 2=Postgrado" },
                { label: "Distance_from_Home", vars: "0=Cerca, 1=Moderada, 2=Lejos" }
              ].map((item, idx) => (
                <div key={idx} className="bg-white dark:bg-dark-hover rounded-lg p-3">
                  <strong className="text-azure-700 dark:text-dark-text">{item.label}:</strong>
                  <span className="text-azure-600 dark:text-dark-text/80 ml-2">{item.vars}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-700/50">
            <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">📊 Sistema de Calificaciones</h4>
            <div className="grid grid-cols-5 gap-2 text-sm">
              {[
                { grade: "A", range: "18-20", color: "green" },
                { grade: "B", range: "14-17", color: "blue" },
                { grade: "C", range: "10-13", color: "yellow" },
                { grade: "D", range: "6-9", color: "orange" },
                { grade: "F", range: "0-5", color: "red" }
              ].map((item) => (
                <div key={item.grade} className={`text-center p-2 bg-${item.color}-100 dark:bg-${item.color}-900/30 rounded`}>
                  <div className={`font-bold text-${item.color}-700 dark:text-${item.color}-300`}>{item.grade}</div>
                  <div className={`text-${item.color}-600 dark:text-${item.color}-400`}>{item.range}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default VariableGuide;
