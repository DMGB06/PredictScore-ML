import React from "react";

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
  color: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
  color,
}) => (
  <div className="group relative bg-white/80 dark:bg-dark-card/80 backdrop-blur-xl rounded-3xl border border-blue-100/50 dark:border-dark-border/30 shadow-xl hover:shadow-2xl dark:hover:shadow-dark-accent/20 transition-all duration-500 p-8 overflow-hidden transform hover:-translate-y-2">
    <div
      className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
    />
    <div className="relative z-10">
      <div className="text-4xl mb-4" role="img" aria-label={`${title} icon`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 dark:text-dark-text mb-4">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-dark-text/80 leading-relaxed">
        {description}
      </p>
    </div>
  </div>
);

export default FeatureCard;
