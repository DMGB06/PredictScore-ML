import React, { useState } from "react";
import { AIRecommendations } from "@/types/student";

interface AIRecommendationsProps {
  recommendations: AIRecommendations;
}

const AIRecommendationsComponent: React.FC<AIRecommendationsProps> = ({
  recommendations,
}) => {
  const [activeTab, setActiveTab] = useState<"general" | "priorities" | "action">("general");

  if (!recommendations || recommendations.status === "error") {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center space-x-2">
          <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-semibold text-red-700">Recomendaciones no disponibles</h3>
        </div>
        <p className="text-red-600 mt-2">
          {recommendations?.note || "Las recomendaciones con IA no están disponibles en este momento."}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-t-lg">
        <div className="flex items-center space-x-3">
          <div className="bg-white bg-opacity-20 rounded-lg p-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold">Recomendaciones Inteligentes</h2>
            <p className="text-blue-100 mt-1">
              {recommendations.ai_powered ? "Generadas con IA (OpenAI GPT)" : "Análisis local basado en datos"}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex space-x-0">
          {[
            { id: "general", label: "Recomendaciones Generales", icon: "📋" },
            { id: "priorities", label: "Áreas Prioritarias", icon: "🎯" },
            { id: "action", label: "Plan de Acción", icon: "📅" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex-1 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-blue-500 text-blue-600 bg-blue-50"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === "general" && (
          <div className="space-y-4">
            <div className="prose prose-sm max-w-none">
              <div className="whitespace-pre-line text-gray-700 leading-relaxed">
                {recommendations.general_recommendations}
              </div>
            </div>
            
            {recommendations.note && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
                <div className="flex items-start space-x-2">
                  <svg className="w-5 h-5 text-yellow-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm text-yellow-700">{recommendations.note}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "priorities" && (
          <div className="space-y-3">
            {recommendations.priority_areas.length > 0 ? (
              recommendations.priority_areas.map((area, index) => (
                <div key={index} className="flex items-start space-x-3 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <div className="flex-shrink-0">
                    <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">{index + 1}</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-orange-800 font-medium">{area}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <svg className="w-12 h-12 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-gray-500">¡Excelente! No se identificaron áreas críticas prioritarias.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "action" && (
          <div className="space-y-4">
            {recommendations.action_plan.length > 0 ? (
              recommendations.action_plan.map((item, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">{index + 1}</span>
                      </div>
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center space-x-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {item.phase}
                        </span>
                      </div>
                      <h4 className="font-semibold text-gray-900">{item.action}</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Target:</span> {item.target}
                        </div>
                        <div>
                          <span className="font-medium">Responsable:</span> {item.responsible}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <p className="text-gray-500">No hay plan de acción específico generado.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-gray-50 px-6 py-4 rounded-b-lg">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${recommendations.ai_powered ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
            <span>
              {recommendations.ai_powered ? "IA Activada" : "Modo Local"}
            </span>
          </div>
          <div>
            Status: <span className="font-medium">{recommendations.status}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIRecommendationsComponent;
