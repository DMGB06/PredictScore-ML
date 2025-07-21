import React, { useState, useRef } from "react";
import { StudentFormData } from "@/types/student";

interface CSVTestProps {
  onDataLoaded: (data: StudentFormData[]) => void;
}

const CSVTest: React.FC<CSVTestProps> = ({ onDataLoaded }) => {
  const [loading, setLoading] = useState(false);
  const [sampleData, setSampleData] = useState<StudentFormData[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const parseCSVLine = (line: string): string[] => {
    const result = [];
    let current = "";
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];

      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === "," && !inQuotes) {
        result.push(current.trim());
        current = "";
      } else {
        current += char;
      }
    }

    result.push(current.trim());
    return result;
  };

  const mapCSVToFormData = (row: string[]): StudentFormData => {
    return {
      study_hours: parseFloat(row[0]) || 0,
      attendance: parseFloat(row[1]) || 0,
      parental_involvement: row[2] || "Medium",
      access_to_resources: row[3] || "Medium",
      extracurricular_activities: row[4] || "No",
      sleep_hours: parseFloat(row[5]) || 7,
      previous_scores: parseFloat(row[6]) || 0,
      motivation_level: row[7] || "Medium",
      internet_access: row[8] || "Yes",
      tutoring_sessions: parseFloat(row[9]) || 0,
      family_income: row[10] || "Medium",
      teacher_quality: row[11] || "Medium",
      school_type: row[12] || "Public",
      peer_influence: row[13] || "Neutral",
      physical_activity: parseFloat(row[14]) || 0,
      learning_disabilities: row[15] || "No",
      parental_education_level: row[16] || "High School",
      distance_from_home: row[17] || "Near",
      gender: row[18] || "Male",
    };
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      const text = await file.text();
      const lines = text.split("\n").filter((line) => line.trim());

      // Skip header line
      const dataLines = lines.slice(1, 11); // Take first 10 records for testing

      const parsedData = dataLines
        .map((line) => {
          const row = parseCSVLine(line);
          return mapCSVToFormData(row);
        })
        .filter((data) => data.study_hours > 0); // Filter out invalid records

      setSampleData(parsedData);
      onDataLoaded(parsedData);
    } catch (error) {
      console.error("Error parsing CSV:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadSampleData = () => {
    // Datos de muestra basados en el dataset original
    const samples: StudentFormData[] = [
      {
        study_hours: 23,
        attendance: 84,
        parental_involvement: "Low",
        access_to_resources: "High",
        extracurricular_activities: "No",
        sleep_hours: 7,
        previous_scores: 73,
        motivation_level: "Low",
        internet_access: "Yes",
        tutoring_sessions: 0,
        family_income: "Low",
        teacher_quality: "Medium",
        school_type: "Public",
        peer_influence: "Positive",
        physical_activity: 3,
        learning_disabilities: "No",
        parental_education_level: "High School",
        distance_from_home: "Near",
        gender: "Male",
      },
      {
        study_hours: 19,
        attendance: 64,
        parental_involvement: "Low",
        access_to_resources: "Medium",
        extracurricular_activities: "No",
        sleep_hours: 8,
        previous_scores: 59,
        motivation_level: "Low",
        internet_access: "Yes",
        tutoring_sessions: 2,
        family_income: "Medium",
        teacher_quality: "Medium",
        school_type: "Public",
        peer_influence: "Negative",
        physical_activity: 4,
        learning_disabilities: "No",
        parental_education_level: "College",
        distance_from_home: "Moderate",
        gender: "Female",
      },
      {
        study_hours: 24,
        attendance: 98,
        parental_involvement: "Medium",
        access_to_resources: "Medium",
        extracurricular_activities: "Yes",
        sleep_hours: 7,
        previous_scores: 91,
        motivation_level: "Medium",
        internet_access: "Yes",
        tutoring_sessions: 2,
        family_income: "Medium",
        teacher_quality: "Medium",
        school_type: "Public",
        peer_influence: "Neutral",
        physical_activity: 4,
        learning_disabilities: "No",
        parental_education_level: "Postgraduate",
        distance_from_home: "Near",
        gender: "Male",
      },
    ];

    setSampleData(samples);
    onDataLoaded(samples);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">
        Probar con Datos Reales
      </h3>
      <p className="text-gray-600 mb-6">
        Carga datos del dataset original o usa muestras predefinidas para probar
        el sistema.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={loading}
          className="flex-1 px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
        >
          Cargar CSV
        </button>

        <button
          onClick={loadSampleData}
          className="flex-1 px-4 py-3 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
        >
          Datos de Muestra
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        onChange={handleFileUpload}
        className="hidden"
      />

      {loading && (
        <div className="flex items-center justify-center py-4">
          <div className="flex items-center gap-2 text-blue-600">
            <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            Procesando archivo...
          </div>
        </div>
      )}

      {sampleData.length > 0 && (
        <div className="border-t pt-4">
          <h4 className="font-semibold text-gray-700 mb-3">
            Datos Cargados ({sampleData.length} estudiantes)
          </h4>
          <div className="max-h-32 overflow-y-auto space-y-2">
            {sampleData.map((student, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-2 bg-gray-50 rounded text-sm"
              >
                <span className="font-medium">#{index + 1}</span>
                <span>{student.study_hours}h estudio</span>
                <span>{student.attendance}% asistencia</span>
                <span>{student.previous_scores} puntos prev.</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CSVTest;
