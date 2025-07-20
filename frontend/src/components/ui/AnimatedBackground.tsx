import React from "react";

interface AnimatedBackgroundProps {
  children: React.ReactNode;
}

const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({
  children,
}) => (
  <section className="relative min-h-screen flex items-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-dark-bg dark:via-dark-surface dark:to-dark-card overflow-hidden">
    {/* Elementos flotantes animados */}
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="absolute top-1/4 left-10 w-32 h-32 bg-gradient-to-br from-blue-300/30 to-indigo-500/30 dark:from-dark-accent/40 dark:to-indigo-500/40 rounded-full animate-pulse blur-xl" />
      <div className="absolute bottom-1/4 right-20 w-40 h-40 bg-gradient-to-br from-purple-300/20 to-blue-500/20 dark:from-purple-400/30 dark:to-blue-400/30 rounded-full animate-pulse delay-1000 blur-xl" />
      <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-gradient-to-br from-blue-400/40 to-blue-600/40 dark:from-dark-accent/50 dark:to-indigo-400/50 rounded-full animate-pulse delay-500 blur-lg" />
    </div>

    <div className="container mx-auto px-4 relative z-10">{children}</div>
  </section>
);

export default AnimatedBackground;
