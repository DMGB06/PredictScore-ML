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
  const getPerformanceCategory = (score: number) => {
    if (score >= PERFORMANCE_CATEGORIES.excellent.min)
      return PERFORMANCE_CATEGORIES.excellent;
    if (score >= PERFORMANCE_CATEGORIES.good.min)
      return PERFORMANCE_CATEGORIES.good;
    if (score >= PERFORMANCE_CATEGORIES.average.min)
      return PERFORMANCE_CATEGORIES.average;
    return PERFORMANCE_CATEGORIES.poor;
  };

  const category = getPerformanceCategory(score);

  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-2 text-sm",
    lg: "px-4 py-3 text-base",
  };

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-lg border-2 ${category.bgColor} ${category.borderColor} ${sizeClasses[size]}`}
    >
      <span className={`text-lg ${category.color}`}>{category.indicator}</span>
      <div className="flex flex-col">
        <div className={`font-semibold ${category.color}`}>
          {score.toFixed(1)} - {category.label}
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
