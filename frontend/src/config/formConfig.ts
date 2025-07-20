export interface FieldConfig {
  name: string;
  label: string;
  type: 'number' | 'select';
  placeholder?: string;
  min?: string;
  max?: string;
  step?: string;
  options?: { value: string; label: string }[];
}

export const formFields: FieldConfig[] = [
  // Campos numéricos (4)
  {
    name: 'Hours_Studied',
    label: 'Horas de Estudio (por semana)',
    type: 'number',
    placeholder: 'Ej: 15',
    min: '0',
    max: '50',
    step: '0.1'
  },
  {
    name: 'Attendance',
    label: 'Asistencia (%)',
    type: 'number',
    placeholder: 'Ej: 85',
    min: '0',
    max: '100'
  },
  {
    name: 'Previous_Scores',
    label: 'Puntuaciones Previas (0-100)',
    type: 'number',
    placeholder: 'Ej: 75',
    min: '0',
    max: '100'
  },
  {
    name: 'Tutoring_Sessions',
    label: 'Sesiones de Tutoría (por mes)',
    type: 'number',
    placeholder: 'Ej: 2',
    min: '0',
    max: '10'
  },

  // Campos categóricos (10)
  {
    name: 'Parental_Involvement',
    label: 'Involucramiento Parental',
    type: 'select',
    options: [
      { value: '0', label: 'Bajo' },
      { value: '1', label: 'Medio' },
      { value: '2', label: 'Alto' }
    ]
  },
  {
    name: 'Access_to_Resources',
    label: 'Acceso a Recursos',
    type: 'select',
    options: [
      { value: '0', label: 'Bajo' },
      { value: '1', label: 'Medio' },
      { value: '2', label: 'Alto' }
    ]
  },
  {
    name: 'Extracurricular_Activities',
    label: 'Actividades Extracurriculares',
    type: 'select',
    options: [
      { value: '0', label: 'No' },
      { value: '1', label: 'Sí' }
    ]
  },
  {
    name: 'Motivation_Level',
    label: 'Nivel de Motivación',
    type: 'select',
    options: [
      { value: '0', label: 'Bajo' },
      { value: '1', label: 'Medio' },
      { value: '2', label: 'Alto' }
    ]
  },
  {
    name: 'Family_Income',
    label: 'Ingresos Familiares',
    type: 'select',
    options: [
      { value: '0', label: 'Bajo' },
      { value: '1', label: 'Medio' },
      { value: '2', label: 'Alto' }
    ]
  },
  {
    name: 'Teacher_Quality',
    label: 'Calidad del Profesor',
    type: 'select',
    options: [
      { value: '0', label: 'Bajo' },
      { value: '1', label: 'Medio' },
      { value: '2', label: 'Alto' }
    ]
  },
  {
    name: 'Peer_Influence',
    label: 'Influencia de Compañeros',
    type: 'select',
    options: [
      { value: '0', label: 'Negativa' },
      { value: '1', label: 'Neutral' },
      { value: '2', label: 'Positiva' }
    ]
  },
  {
    name: 'Learning_Disabilities',
    label: 'Dificultades de Aprendizaje',
    type: 'select',
    options: [
      { value: '0', label: 'No' },
      { value: '1', label: 'Sí' }
    ]
  },
  {
    name: 'Parental_Education_Level',
    label: 'Nivel Educativo Parental',
    type: 'select',
    options: [
      { value: '0', label: 'Educación Secundaria' },
      { value: '1', label: 'Universidad' },
      { value: '2', label: 'Postgrado' }
    ]
  },
  {
    name: 'Distance_from_Home',
    label: 'Distancia desde Casa',
    type: 'select',
    options: [
      { value: '0', label: 'Cerca' },
      { value: '1', label: 'Moderada' },
      { value: '2', label: 'Lejos' }
    ]
  }
];
