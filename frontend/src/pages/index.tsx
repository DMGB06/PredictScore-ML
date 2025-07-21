import type { NextPage } from "next";
import Head from "next/head";
import Layout from "@/components/layout/Layout";
import React, { useCallback } from "react";
import { useRouter } from "next/router";

// Componentes UI
import FeatureCard from "@/components/ui/FeatureCard";
import TeamMember from "@/components/ui/TeamMember";
import AnimatedBackground from "@/components/ui/AnimatedBackground";
import DashboardPreview from "@/components/ui/DashboardPreview";

// Constantes
import {
  APP_CONFIG,
  PROJECT_METRICS,
  TEAM_MEMBERS,
  FEATURES,
  ROUTES,
} from "@/constants";

const Home: NextPage = () => {
  const router = useRouter();

  const handleRedirect = useCallback(() => {
    router.push(ROUTES.predictor);
  }, [router]);

  return (
    <>
      <Head>
        <title>{APP_CONFIG.title}</title>
        <meta name="description" content={APP_CONFIG.description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="author" content={APP_CONFIG.group} />
        <meta
          name="keywords"
          content="machine learning, predicción académica, educación, SVR, universidad"
        />
        <link rel="icon" href="/favicon.ico" />
        <link rel="canonical" href={ROUTES.home} />
      </Head>

      <Layout>
        {/* Hero Section */}
        <AnimatedBackground>
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Contenido principal */}
              <div className="text-left space-y-8 animate-fade-in">
                <div className="inline-flex items-center px-4 py-2 bg-blue-100/50 dark:bg-dark-card/60 backdrop-blur-sm rounded-full border border-blue-200/50 dark:border-dark-border/50">
                  <span className="text-blue-600 dark:text-dark-accent text-sm font-medium">
                    Proyecto Académico {APP_CONFIG.group}
                  </span>
                </div>

                <h1 className="text-5xl md:text-6xl font-black leading-tight">
                  <span className="gradient-text bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 dark:from-dark-accent dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
                    Sistema
                  </span>
                  <br />
                  <span className="text-gray-900 dark:text-dark-text">
                    Predictivo
                  </span>
                  <br />
                  <span className="text-transparent bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text">
                    Académico
                  </span>
                </h1>

                <p className="text-xl text-gray-700 dark:text-dark-text/90 leading-relaxed max-w-lg">
                  Implementación de Machine Learning para la detección temprana
                  de riesgo académico en educación secundaria.
                </p>

                <div className="bg-blue-50 dark:bg-dark-surface border border-blue-200 dark:border-blue-700 rounded-lg p-4">
                  <p className="text-sm text-blue-800 dark:text-blue-400 mb-2">
                    <strong>{APP_CONFIG.university}</strong>
                  </p>
                  <p className="text-xs text-blue-600 dark:text-blue-300">
                    {APP_CONFIG.faculty}
                    <br />
                    {APP_CONFIG.course}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={handleRedirect}
                    className="group relative bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 dark:from-dark-accent dark:to-indigo-600 dark:hover:from-indigo-500 dark:hover:to-purple-600 text-white px-8 py-4 rounded-2xl transition-all duration-300 font-semibold shadow-xl hover:shadow-2xl hover:shadow-blue-500/25 dark:hover:shadow-dark-accent/40 transform hover:-translate-y-1 overflow-hidden"
                    aria-label="Ir al sistema predictivo"
                  >
                    <span className="relative z-10 flex items-center">
                      🚀 Iniciar Predicción Académica
                      <svg
                        className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                  </button>
                </div>

                {/* Stats del Proyecto */}
                <div className="flex space-x-8 pt-8">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-800 dark:text-dark-text">
                      {PROJECT_METRICS.apiTests}
                    </div>
                    <div className="text-sm text-blue-600 dark:text-dark-text/70">
                      Tests API
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-800 dark:text-dark-text">
                      {PROJECT_METRICS.modelType}
                    </div>
                    <div className="text-sm text-blue-600 dark:text-dark-text/70">
                      Modelo ML
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-800 dark:text-dark-text">
                      {PROJECT_METRICS.r2Score}
                    </div>
                    <div className="text-sm text-blue-600 dark:text-dark-text/70">
                      R² Score
                    </div>
                  </div>
                </div>
              </div>

              {/* Visualización del Dashboard */}
              <DashboardPreview />
            </div>
          </div>
        </AnimatedBackground>

        {/* Features Section */}
        <section className="py-24 bg-white dark:bg-dark-surface transition-colors duration-500">
          <div className="container mx-auto px-4">
            <div className="text-center mb-20 animate-fade-in">
              <div className="inline-flex items-center px-4 py-2 bg-blue-100/50 dark:bg-dark-card/60 backdrop-blur-sm rounded-full border border-blue-200/50 dark:border-dark-border/50 mb-6">
                <span className="text-blue-600 dark:text-dark-accent text-sm font-medium">
                  Características del Sistema
                </span>
              </div>
              <h2 className="text-5xl font-bold text-gray-900 dark:text-dark-text mb-6">
                Tecnología
                <span className="gradient-text bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent">
                  {" "}
                  Avanzada
                </span>
              </h2>
              <p className="text-xl text-gray-600 dark:text-dark-text/80 max-w-3xl mx-auto">
                Aplicación de Machine Learning supervisado para la predicción
                del rendimiento académico estudiantil
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {FEATURES.map((feature, index) => (
                <FeatureCard
                  key={`feature-${index}`}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                  color={feature.color}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-24 bg-gray-50 dark:bg-dark-hover">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-dark-text mb-4">
                Equipo de Desarrollo
              </h2>
              <p className="text-lg text-gray-600 dark:text-dark-text/80">
                {APP_CONFIG.group} - Estudiantes de Ingeniería de Sistemas
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {TEAM_MEMBERS.map((member, index) => (
                <TeamMember key={`member-${index}`} name={member} />
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 dark:from-dark-bg dark:via-dark-surface dark:to-dark-card text-white relative overflow-hidden">
          {/* Efectos de fondo */}
          <div className="absolute inset-0" aria-hidden="true">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600/20 via-purple-600/10 to-indigo-600/20 dark:from-dark-accent/30 dark:via-purple-400/20 dark:to-blue-400/20" />
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/20 dark:bg-dark-accent/30 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/20 dark:bg-purple-400/30 rounded-full blur-3xl animate-pulse delay-1000" />
          </div>

          <div className="container mx-auto px-4 text-center relative z-10">
            <h2 className="text-5xl font-bold mb-8">
              Sistema Listo para
              <span className="block text-transparent bg-gradient-to-r from-blue-300 to-indigo-300 dark:from-dark-accent dark:to-indigo-300 bg-clip-text">
                Educación Secundaria
              </span>
            </h2>
            <p className="text-xl text-blue-200 dark:text-dark-text/90 mb-12 max-w-2xl mx-auto">
              Implementación completa de Machine Learning para la detección
              temprana de riesgo académico, listo para ser utilizado en
              instituciones educativas.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleRedirect}
                className="group bg-white text-blue-900 hover:bg-blue-50 dark:bg-dark-text dark:text-dark-bg dark:hover:bg-gray-100 px-12 py-5 rounded-2xl transition-all duration-300 font-bold shadow-2xl hover:shadow-3xl text-xl transform hover:-translate-y-2 hover:scale-105"
                aria-label="Comenzar a usar el predictor"
              >
                <span className="flex items-center">
                  Comenzar Predicción
                  <svg
                    className="ml-3 w-6 h-6 group-hover:translate-x-2 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </span>
              </button>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default Home;
