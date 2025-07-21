import React from "react";
import { FORM_OPTIONS } from "@/constants";
import { StudentFormData } from "@/types/student";

interface StudentFormProps {
  formData: StudentFormData;
  onChange: (field: keyof StudentFormData, value: string | number) => void;
  onSubmit: () => void;
  loading: boolean;
}

const StudentForm: React.FC<StudentFormProps> = ({
  formData,
  onChange,
  onSubmit,
  loading,
}) => {
  const renderNumericInput = (
    field: keyof StudentFormData,
    label: string,
    min: number,
    max: number,
    step: number = 1
  ) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="flex items-center space-x-3">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={formData[field] as number}
          onChange={(e) => onChange(field, parseFloat(e.target.value))}
          className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <input
          type="number"
          min={min}
          max={max}
          step={step}
          value={formData[field] as number}
          onChange={(e) => onChange(field, parseFloat(e.target.value) || 0)}
          className="w-20 px-2 py-1 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
    </div>
  );

  const renderSelectInput = (
    field: keyof StudentFormData,
    label: string,
    options: readonly string[]
  ) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <select
        value={formData[field] as string}
        onChange={(e) => onChange(field, e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <span>📝</span>
        Información del Estudiante
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Campos numéricos */}
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-700 border-b pb-2 flex items-center gap-2">
            <span>📚</span>
            Datos Académicos
          </h4>
          {renderNumericInput("study_hours", "Horas de Estudio", 1, 30, 0.5)}
          {renderNumericInput("attendance", "Asistencia (%)", 0, 100, 1)}
          {renderNumericInput(
            "previous_scores",
            "Calificaciones Previas",
            0,
            100,
            1
          )}
          {renderNumericInput("sleep_hours", "Horas de Sueño", 4, 12, 0.5)}
          {renderNumericInput(
            "tutoring_sessions",
            "Sesiones de Tutoría",
            0,
            10,
            1
          )}
          {renderNumericInput(
            "physical_activity",
            "Actividad Física (hrs/semana)",
            0,
            20,
            1
          )}
        </div>

        {/* Campos categóricos 1 */}
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-700 border-b pb-2 flex items-center gap-2">
            <span>🏠</span>
            Entorno Familiar
          </h4>
          {renderSelectInput(
            "parental_involvement",
            "Participación de Padres",
            FORM_OPTIONS.parental_involvement
          )}
          {renderSelectInput(
            "family_income",
            "Ingresos Familiares",
            FORM_OPTIONS.family_income
          )}
          {renderSelectInput(
            "parental_education_level",
            "Educación de Padres",
            FORM_OPTIONS.parental_education_level
          )}
          {renderSelectInput(
            "distance_from_home",
            "Distancia de Casa",
            FORM_OPTIONS.distance_from_home
          )}
          {renderSelectInput("gender", "Género", FORM_OPTIONS.gender)}
        </div>

        {/* Campos categóricos 2 */}
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-700 border-b pb-2 flex items-center gap-2">
            <span>🏫</span>
            Entorno Escolar
          </h4>
          {renderSelectInput(
            "access_to_resources",
            "Acceso a Recursos",
            FORM_OPTIONS.access_to_resources
          )}
          {renderSelectInput(
            "teacher_quality",
            "Calidad del Docente",
            FORM_OPTIONS.teacher_quality
          )}
          {renderSelectInput(
            "school_type",
            "Tipo de Escuela",
            FORM_OPTIONS.school_type
          )}
          {renderSelectInput(
            "peer_influence",
            "Influencia de Pares",
            FORM_OPTIONS.peer_influence
          )}
          {renderSelectInput(
            "motivation_level",
            "Nivel de Motivación",
            FORM_OPTIONS.motivation_level
          )}
          {renderSelectInput(
            "extracurricular_activities",
            "Actividades Extracurriculares",
            FORM_OPTIONS.extracurricular_activities
          )}
          {renderSelectInput(
            "internet_access",
            "Acceso a Internet",
            FORM_OPTIONS.internet_access
          )}
          {renderSelectInput(
            "learning_disabilities",
            "Dificultades de Aprendizaje",
            FORM_OPTIONS.learning_disabilities
          )}
        </div>
      </div>

      <div className="mt-8 flex justify-center">
        <button
          onClick={onSubmit}
          disabled={loading}
          className={`px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              🔍 Analizando datos...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <span>🧠</span>
              Predecir Rendimiento Académico
            </span>
          )}
        </button>
      </div>
    </div>
  );
};

export default StudentForm;
