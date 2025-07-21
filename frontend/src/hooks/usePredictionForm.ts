import { useState } from "react";

export interface StudentData {
  Hours_Studied: string;
  Attendance: string;
  Parental_Involvement: string;
  Access_to_Resources: string;
  Extracurricular_Activities: string;
  Previous_Scores: string;
  Motivation_Level: string;
  Tutoring_Sessions: string;
  Family_Income: string;
  Teacher_Quality: string;
  Peer_Influence: string;
  Learning_Disabilities: string;
  Parental_Education_Level: string;
  Distance_from_Home: string;
}

export interface PredictionResponse {
  predicted_score: number;
  confidence: number;
  letter_grade: string;
  model_info: {
    model_name: string;
    r2_score: number;
  };
}

const getLetterGrade = (score: number): string => {
  if (score >= 18) return "A";
  if (score >= 14) return "B";
  if (score >= 10) return "C";
  if (score >= 6) return "D";
  return "F";
};

const initialFormData: StudentData = {
  Hours_Studied: "",
  Attendance: "",
  Parental_Involvement: "",
  Access_to_Resources: "",
  Extracurricular_Activities: "",
  Previous_Scores: "",
  Motivation_Level: "",
  Tutoring_Sessions: "",
  Family_Income: "",
  Teacher_Quality: "",
  Peer_Influence: "",
  Learning_Disabilities: "",
  Parental_Education_Level: "",
  Distance_from_Home: "",
};

export const usePredictionForm = () => {
  const [formData, setFormData] = useState<StudentData>(initialFormData);
  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showGuide, setShowGuide] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const newData = {
        ...prev,
        [name]: value,
      };
      return newData;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Convertir campos numéricos antes de enviar
      const dataToSend = {
        ...formData,
        Hours_Studied: Number(formData.Hours_Studied) || 0,
        Attendance: Number(formData.Attendance) || 0,
        Previous_Scores: Number(formData.Previous_Scores) || 0,
        Tutoring_Sessions: Number(formData.Tutoring_Sessions) || 0,
      };

      // Enviar datos al servidor
      // TODO: Usar dataToSend cuando se conecte con el backend real
      void dataToSend; // Evitar warning de variable no utilizada

      // Simulación de respuesta por ahora
      setTimeout(() => {
        const scoreValue = 8 + Math.random() * 12; // Rango 8-20
        const mockPrediction: PredictionResponse = {
          predicted_score: scoreValue,
          confidence: 0.85 + Math.random() * 0.1,
          letter_grade: getLetterGrade(scoreValue),
          model_info: {
            model_name: "SVR Advanced Model",
            r2_score: 0.6926,
          },
        };
        setPrediction(mockPrediction);
        setLoading(false);
      }, 2000);
    } catch {
      setError("Error al realizar la predicción. Intenta nuevamente.");
      setLoading(false);
    }
  };

  const toggleGuide = () => setShowGuide(!showGuide);

  return {
    formData,
    prediction,
    loading,
    error,
    showGuide,
    handleInputChange,
    handleSubmit,
    toggleGuide,
  };
};
