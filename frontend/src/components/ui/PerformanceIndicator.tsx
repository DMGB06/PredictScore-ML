import React from "react";
import { PERFORMANCE_CATEGORIES } from "@/constants";

interface PerformanceIndicatorProps {
  score: number;
  showDescription?: boolean;
  size?: "sm" | "md" | "lg";
}

const PerformanceIndicator: React.FC<PerformanceIndicatorProps> = ({
  score,
  showDescription = false,
  size = "md",
}) => {
  // El score ya viene en escala 20, no necesita conversión
  const score20 = score;

  const getPerformanceCategory = (score20: number) => {
    if (score20 >= PERFORMANCE_CATEGORIES.excellent.min)
      return PERFORMANCE_CATEGORIES.excellent;
    if (score20 >= PERFORMANCE_CATEGORIES.good.min)
      return PERFORMANCE_CATEGORIES.good;
    if (score20 >= PERFORMANCE_CATEGORIES.average.min)
      return PERFORMANCE_CATEGORIES.average;
    return PERFORMANCE_CATEGORIES.poor;
  };

  const category = getPerformanceCategory(score20);

  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-2 text-sm",
    lg: "px-4 py-3 text-base",
  };

  return (
    <div
      className={`inline-flex items-center gap-3 rounded-lg border-2 ${category.bgColor} ${category.borderColor} ${sizeClasses[size]}`}
    >
      <span className="text-2xl">{category.indicator}</span>
      <div className="flex flex-col">
        <div className={`font-bold ${category.color} text-lg`}>
          {score20.toFixed(1)}/20 - {category.label}
        </div>
        <div className={`text-xs ${category.color} opacity-70`}>
          Escala 100: {(score20 * 5).toFixed(1)}
        </div>
        {showDescription && (
          <div className={`text-xs ${category.color} opacity-80 mt-1`}>
            {category.description}
          </div>
        )}
      </div>
    </div>
  );
};

export default PerformanceIndicator;
