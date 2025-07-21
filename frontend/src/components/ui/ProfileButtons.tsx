import React from "react";
import { STUDENT_PROFILES } from "@/constants";
import { StudentFormData } from "@/types/student";

interface ProfileButtonsProps {
  onLoadProfile: (profileData: StudentFormData) => void;
  disabled?: boolean;
}

const ProfileButtons: React.FC<ProfileButtonsProps> = ({
  onLoadProfile,
  disabled = false,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">
        🎯 Perfiles de Ejemplo
      </h3>
      <p className="text-sm text-gray-600 text-center mb-6">
        Selecciona un perfil para cargar datos de ejemplo y facilitar el
        análisis.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(STUDENT_PROFILES).map(([key, profile]) => (
          <button
            key={key}
            onClick={() => onLoadProfile(profile.data)}
            disabled={disabled}
            className={`group relative overflow-hidden rounded-lg p-4 text-white font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${
              disabled
                ? "opacity-50 cursor-not-allowed"
                : "hover:shadow-xl active:scale-95"
            } bg-gradient-to-br ${profile.color}`}
          >
            {/* Icono y contenido */}
            <div className="relative z-10">
              <div className="text-2xl mb-2 text-center">{profile.icon}</div>
              <div className="text-sm font-bold text-center mb-1">
                {profile.name}
              </div>
              <div className="text-xs opacity-90 text-center leading-tight">
                {profile.description}
              </div>
            </div>

            {/* Efecto hover */}
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>

            {/* Línea decorativa */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-white opacity-30"></div>
          </button>
        ))}
      </div>

      <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-xs text-blue-800 text-center">
          <span className="font-semibold">💡 Tip:</span> Los perfiles están
          basados en datos académicos estándar. Puedes modificar cualquier campo
          después de cargar un perfil.
        </p>
      </div>
    </div>
  );
};

export default ProfileButtons;
