import React, { useMemo, useState } from "react";
import { CSVPredictionResponse } from "@/types/student";

interface CSVBatchResultsProps {
  results: CSVPredictionResponse;
  onReset: () => void;
}

const CSVBatchResults: React.FC<CSVBatchResultsProps> = ({
  results,
  onReset,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterGrade, setFilterGrade] = useState("");
  const [sortBy, setSortBy] = useState("id");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [recordsPerPage, setRecordsPerPage] = useState(50);

  const {
    dataset_info,
    results: predictions,
    statistics,
    performance,
  } = results;

  // Función para obtener color según la calificación
  const getGradeColor = (grade: string) => {
    switch (grade) {
      case "AD":
        return "bg-purple-100 text-purple-800 border-purple-300";
      case "A":
        return "bg-green-100 text-green-800 border-green-300";
      case "B":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "C":
        return "bg-orange-100 text-orange-800 border-orange-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  // Función para obtener el color de fondo según el puntaje
  const getScoreBackgroundColor = (score: number) => {
    if (score >= 90) return "bg-purple-50";
    if (score >= 75) return "bg-green-50";
    if (score >= 60) return "bg-blue-50";
    return "bg-orange-50";
  };

  // Estadísticas adicionales calculadas
  const additionalStats = useMemo(() => {
    const scores = predictions.map((p) => p.prediction_100);
    const sortedScores = [...scores].sort((a, b) => a - b);

    return {
      median: sortedScores[Math.floor(sortedScores.length / 2)],
      q1: sortedScores[Math.floor(sortedScores.length * 0.25)],
      q3: sortedScores[Math.floor(sortedScores.length * 0.75)],
      range: statistics.max_score_100 - statistics.min_score_100,
    };
  }, [predictions, statistics]);

  // Filtrar y ordenar datos
  const filteredAndSortedData = useMemo(() => {
    const filtered = predictions.filter((item) => {
      const matchesSearch =
        item.estudiante_id.toString().includes(searchTerm) ||
        item.prediction_100.toString().includes(searchTerm);
      const matchesGrade =
        filterGrade === "" || item.letter_grade === filterGrade;
      return matchesSearch && matchesGrade;
    });

    return filtered.sort((a, b) => {
      let aValue: string | number, bValue: string | number;

      switch (sortBy) {
        case "id":
          aValue = a.estudiante_id;
          bValue = b.estudiante_id;
          break;
        case "score100":
          aValue = a.prediction_100;
          bValue = b.prediction_100;
          break;
        case "score20":
          aValue = a.prediction_20;
          bValue = b.prediction_20;
          break;
        case "grade":
          aValue = a.letter_grade;
          bValue = b.letter_grade;
          break;
        default:
          aValue = a.estudiante_id;
          bValue = b.estudiante_id;
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }, [predictions, searchTerm, filterGrade, sortBy, sortOrder]);

  // Paginación
  const totalPages = Math.ceil(filteredAndSortedData.length / recordsPerPage);
  const paginatedData = filteredAndSortedData.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  // Función para exportar datos
  const exportToCsv = () => {
    const csvContent = [
      ["ID", "Puntuación (0-100)", "Puntuación (0-20)", "Calificación"],
      ...filteredAndSortedData.map((item) => [
        item.estudiante_id,
        item.prediction_100,
        item.prediction_20,
        item.letter_grade,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `resultados_prediccion_${dataset_info.filename}_${
      new Date().toISOString().split("T")[0]
    }.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Resultados de Predicción Académica
              </h1>
              <p className="text-gray-600">
                Análisis completo de {dataset_info.filename} -{" "}
                {dataset_info.total_students} estudiantes procesados
              </p>
            </div>
            <div className="mt-4 sm:mt-0 flex space-x-3">
              <button
                onClick={exportToCsv}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Exportar CSV
              </button>
              <button
                onClick={onReset}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Nueva Predicción
              </button>
            </div>
          </div>
        </div>

        {/* Estadísticas Principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Estudiantes
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {dataset_info.total_students.toLocaleString()}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-100 rounded-md flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 00-2-2z"
                      />
                    </svg>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Promedio (0-100)
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {statistics.average_score_100.toFixed(1)}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-purple-100 rounded-md flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-purple-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Promedio (0-20)
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {statistics.average_score_20.toFixed(1)}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-gray-100 rounded-md flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Tiempo Procesamiento
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {performance.processing_time_seconds.toFixed(2)}s
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Distribución de Calificaciones */}
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Distribución de Calificaciones
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(statistics.distribution).map(([grade, count]) => {
              const percentage =
                statistics.percentages[
                  grade as keyof typeof statistics.percentages
                ];
              return (
                <div key={grade} className="text-center">
                  <div
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getGradeColor(
                      grade
                    )}`}
                  >
                    {grade}
                  </div>
                  <div className="mt-2">
                    <div className="text-2xl font-bold text-gray-900">
                      {count}
                    </div>
                    <div className="text-sm text-gray-500">
                      {percentage.toFixed(1)}%
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Estadísticas Detalladas */}
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Análisis Estadístico
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <div className="text-sm font-medium text-gray-500">Mínimo</div>
              <div className="text-lg font-bold text-gray-900">
                {statistics.min_score_100.toFixed(1)}
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm font-medium text-gray-500">Q1</div>
              <div className="text-lg font-bold text-gray-900">
                {additionalStats.q1.toFixed(1)}
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm font-medium text-gray-500">Mediana</div>
              <div className="text-lg font-bold text-gray-900">
                {additionalStats.median.toFixed(1)}
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm font-medium text-gray-500">Q3</div>
              <div className="text-lg font-bold text-gray-900">
                {additionalStats.q3.toFixed(1)}
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm font-medium text-gray-500">Máximo</div>
              <div className="text-lg font-bold text-gray-900">
                {statistics.max_score_100.toFixed(1)}
              </div>
            </div>
          </div>
        </div>

        {/* Controles de Filtros y Búsqueda */}
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label
                htmlFor="search"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Buscar
              </label>
              <input
                type="text"
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="ID o puntuación..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label
                htmlFor="filter-grade"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Filtrar por Calificación
              </label>
              <select
                id="filter-grade"
                value={filterGrade}
                onChange={(e) => setFilterGrade(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Todas las calificaciones</option>
                <option value="AD">AD (Excelente)</option>
                <option value="A">A (Bueno)</option>
                <option value="B">B (Satisfactorio)</option>
                <option value="C">C (En proceso)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Resultados por página
              </label>
              <select
                value={recordsPerPage}
                onChange={(e) => {
                  setRecordsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
                <option value={200}>200</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mostrando
              </label>
              <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-sm text-gray-600">
                {(currentPage - 1) * recordsPerPage + 1} -{" "}
                {Math.min(
                  currentPage * recordsPerPage,
                  filteredAndSortedData.length
                )}{" "}
                de {filteredAndSortedData.length}
              </div>
            </div>
          </div>
        </div>

        {/* Tabla de Resultados - TODAS LAS PREDICCIONES */}
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Resultados Completos - Todas las Predicciones (
              {filteredAndSortedData.length} registros)
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Escalas de conversión: 0-100 → 0-20 (×0.2) → AD/A/B/C
              (90+/75+/60+/&lt;60)
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort("id")}
                  >
                    <div className="flex items-center">
                      ID Estudiante
                      {sortBy === "id" && (
                        <svg
                          className={`w-4 h-4 ml-1 ${
                            sortOrder === "asc"
                              ? "transform rotate-0"
                              : "transform rotate-180"
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 15l7-7 7 7"
                          />
                        </svg>
                      )}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort("score100")}
                  >
                    <div className="flex items-center">
                      Puntuación (0-100)
                      {sortBy === "score100" && (
                        <svg
                          className={`w-4 h-4 ml-1 ${
                            sortOrder === "asc"
                              ? "transform rotate-0"
                              : "transform rotate-180"
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 15l7-7 7 7"
                          />
                        </svg>
                      )}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort("score20")}
                  >
                    <div className="flex items-center">
                      Puntuación (0-20)
                      {sortBy === "score20" && (
                        <svg
                          className={`w-4 h-4 ml-1 ${
                            sortOrder === "asc"
                              ? "transform rotate-0"
                              : "transform rotate-180"
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 15l7-7 7 7"
                          />
                        </svg>
                      )}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort("grade")}
                  >
                    <div className="flex items-center">
                      Calificación
                      {sortBy === "grade" && (
                        <svg
                          className={`w-4 h-4 ml-1 ${
                            sortOrder === "asc"
                              ? "transform rotate-0"
                              : "transform rotate-180"
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 15l7-7 7 7"
                          />
                        </svg>
                      )}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Progreso Visual
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedData.map((result) => (
                  <tr
                    key={result.estudiante_id}
                    className={`hover:bg-gray-50 transition-colors ${getScoreBackgroundColor(
                      result.prediction_100
                    )}`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{result.estudiante_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-lg font-bold text-gray-900">
                        {result.prediction_100.toFixed(1)}
                      </div>
                      <div className="text-xs text-gray-500">
                        Escala base (0-100)
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-lg font-bold text-blue-700">
                        {result.prediction_20.toFixed(1)}
                      </div>
                      <div className="text-xs text-gray-500">
                        Escala vigesimal (0-20)
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-3 py-1 text-sm font-bold rounded-full border-2 ${getGradeColor(
                          result.letter_grade
                        )}`}
                      >
                        {result.letter_grade}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div
                            className={`h-2 rounded-full ${
                              result.prediction_100 >= 90
                                ? "bg-purple-500"
                                : result.prediction_100 >= 75
                                ? "bg-green-500"
                                : result.prediction_100 >= 60
                                ? "bg-blue-500"
                                : "bg-orange-500"
                            }`}
                            style={{
                              width: `${Math.min(result.prediction_100, 100)}%`,
                            }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-600 w-10">
                          {result.prediction_100.toFixed(0)}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Anterior
                </button>
                <button
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Siguiente
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Mostrando{" "}
                    <span className="font-medium">
                      {(currentPage - 1) * recordsPerPage + 1}
                    </span>{" "}
                    a{" "}
                    <span className="font-medium">
                      {Math.min(
                        currentPage * recordsPerPage,
                        filteredAndSortedData.length
                      )}
                    </span>{" "}
                    de{" "}
                    <span className="font-medium">
                      {filteredAndSortedData.length}
                    </span>{" "}
                    resultados
                  </p>
                </div>
                <div>
                  <nav
                    className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                    aria-label="Pagination"
                  >
                    <button
                      onClick={() =>
                        setCurrentPage(Math.max(1, currentPage - 1))
                      }
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="sr-only">Anterior</span>
                      <svg
                        className="h-5 w-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>

                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                      let pageNumber;
                      if (totalPages <= 5) {
                        pageNumber = i + 1;
                      } else if (currentPage <= 3) {
                        pageNumber = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNumber = totalPages - 4 + i;
                      } else {
                        pageNumber = currentPage - 2 + i;
                      }

                      return (
                        <button
                          key={pageNumber}
                          onClick={() => setCurrentPage(pageNumber)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            currentPage === pageNumber
                              ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                              : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                          }`}
                        >
                          {pageNumber}
                        </button>
                      );
                    })}

                    <button
                      onClick={() =>
                        setCurrentPage(Math.min(totalPages, currentPage + 1))
                      }
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="sr-only">Siguiente</span>
                      <svg
                        className="h-5 w-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Información Técnica */}
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Información Técnica
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900">Modelo</div>
                <div className="text-sm text-gray-500">
                  {performance.model_used}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-md flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900">
                  Rendimiento
                </div>
                <div className="text-sm text-gray-500">
                  {performance.students_per_second.toFixed(1)} estudiantes/s
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-100 rounded-md flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900">
                  Timestamp
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(performance.timestamp * 1000).toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CSVBatchResults;
