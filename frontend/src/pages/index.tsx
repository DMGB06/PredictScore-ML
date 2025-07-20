import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import Layout from '@/components/layout/Layout'

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Student Predictor - AI Performance Analytics</title>
        <meta name="description" content="Plataforma avanzada de análisis predictivo para el rendimiento estudiantil usando Machine Learning e Inteligencia Artificial" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Layout>
        {/* Hero Section Futurista */}
        <section className="relative min-h-screen flex items-center bg-gradient-to-br from-azure-50 via-white to-azure-100 dark:from-dark-bg dark:via-dark-surface dark:to-dark-card overflow-hidden">
          {/* Elementos flotantes animados */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/4 left-10 w-32 h-32 bg-gradient-to-br from-azure-300/30 to-azure-500/30 dark:from-dark-accent/40 dark:to-indigo-500/40 rounded-full animate-float blur-xl"></div>
            <div className="absolute bottom-1/4 right-20 w-40 h-40 bg-gradient-to-br from-purple-300/20 to-blue-500/20 dark:from-purple-400/30 dark:to-blue-400/30 rounded-full animate-float delay-1000 blur-xl"></div>
            <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-gradient-to-br from-azure-400/40 to-azure-600/40 dark:from-dark-accent/50 dark:to-indigo-400/50 rounded-full animate-float delay-500 blur-lg"></div>
            
            {/* Efectos de luz adicionales para modo oscuro */}
            <div className="absolute top-10 right-10 w-20 h-20 bg-gradient-to-br from-indigo-400/20 to-purple-500/20 dark:from-indigo-300/40 dark:to-purple-400/40 rounded-full animate-pulse blur-2xl"></div>
            <div className="absolute bottom-10 left-20 w-16 h-16 bg-gradient-to-br from-blue-400/30 to-cyan-500/30 dark:from-blue-300/50 dark:to-cyan-400/50 rounded-full animate-pulse delay-700 blur-xl"></div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                
                {/* Contenido principal */}
                <div className="text-left space-y-8 animate-fade-in">
                  <div className="inline-flex items-center px-4 py-2 bg-azure-100/50 dark:bg-dark-card/60 backdrop-blur-sm rounded-full border border-azure-200/50 dark:border-dark-border/50">
                    <span className="text-azure-600 dark:text-dark-accent text-sm font-medium">IA de Nueva Generación</span>
                  </div>
                  
                  <h1 className="text-6xl md:text-7xl font-black leading-tight">
                    <span className="gradient-text bg-gradient-to-r from-azure-600 via-azure-700 to-azure-800 dark:from-dark-accent dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
                      Revolución
                    </span>
                    <br />
                    <span className="text-azure-900 dark:text-dark-text">Académica</span>
                    <br />
                    <span className="text-transparent bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text">con IA</span>
                  </h1>
                  
                  <p className="text-xl text-azure-700 dark:text-dark-text/90 leading-relaxed max-w-lg">
                    Transformamos la educación con inteligencia artificial avanzada. 
                    Predice, analiza y optimiza el rendimiento estudiantil como nunca antes.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link href="/predict">
                      <button className="group relative bg-gradient-to-r from-azure-600 to-azure-700 hover:from-azure-700 hover:to-azure-800 dark:from-dark-accent dark:to-indigo-600 dark:hover:from-indigo-500 dark:hover:to-purple-600 text-white px-8 py-4 rounded-2xl transition-all duration-300 font-semibold shadow-xl hover:shadow-2xl hover:shadow-azure-500/25 dark:hover:shadow-dark-accent/40 transform hover:-translate-y-1 overflow-hidden">
                        <span className="relative z-10 flex items-center">
                          🎯 Hacer Predicción
                          <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                      </button>
                    </Link>
                    
                    <Link href="/dashboard">
                      <button className="group bg-white/80 dark:bg-dark-card/80 hover:bg-white dark:hover:bg-dark-card text-azure-700 dark:text-dark-text border-2 border-azure-200 dark:border-dark-border px-8 py-4 rounded-2xl transition-all duration-300 font-semibold backdrop-blur-sm hover:backdrop-blur-md shadow-lg hover:shadow-xl dark:hover:shadow-dark-accent/20 transform hover:-translate-y-1">
                        <span className="flex items-center">
                          📊 Ver Dashboard
                          <svg className="ml-2 w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                        </span>
                      </button>
                    </Link>
                  </div>

                  {/* Stats */}
                  <div className="flex space-x-8 pt-8">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-azure-800 dark:text-dark-text">95%</div>
                      <div className="text-sm text-azure-600 dark:text-dark-text/70">Precisión</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-azure-800 dark:text-dark-text">50K+</div>
                      <div className="text-sm text-azure-600 dark:text-dark-text/70">Predicciones</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-azure-800 dark:text-dark-text">24/7</div>
                      <div className="text-sm text-azure-600 dark:text-dark-text/70">Disponible</div>
                    </div>
                  </div>
                </div>

                {/* Visualización 3D simulada */}
                <div className="relative animate-slide-up">
                  <div className="neo-container bg-gradient-to-br from-white/90 to-azure-50/90 dark:from-dark-card/90 dark:to-dark-surface/90 backdrop-blur-xl rounded-3xl border border-azure-200/30 dark:border-dark-border/30 shadow-xl hover:shadow-2xl dark:hover:shadow-dark-accent/20 transition-all duration-500 p-8">
                    
                    {/* Simulación de dashboard */}
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-azure-800 dark:text-dark-text">Análisis en Tiempo Real</h3>
                        <div className="w-3 h-3 bg-green-500 dark:bg-green-400 rounded-full animate-pulse shadow-lg dark:shadow-green-400/50"></div>
                      </div>
                      
                      {/* Gráfico simulado */}
                      <div className="h-32 bg-gradient-to-r from-azure-100 to-azure-200 dark:from-dark-hover dark:to-dark-card rounded-xl relative overflow-hidden border dark:border-dark-border/30">
                        <div className="absolute inset-0 bg-gradient-to-r from-azure-500/20 via-purple-500/20 to-blue-500/20 dark:from-dark-accent/30 dark:via-purple-400/20 dark:to-blue-400/20 animate-pulse"></div>
                        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                          <div className="w-8 h-16 bg-azure-500 dark:bg-dark-accent rounded-t opacity-80 shadow-lg"></div>
                          <div className="w-8 h-20 bg-purple-500 dark:bg-purple-400 rounded-t opacity-90 shadow-lg"></div>
                          <div className="w-8 h-12 bg-blue-500 dark:bg-blue-400 rounded-t opacity-70 shadow-lg"></div>
                          <div className="w-8 h-24 bg-azure-600 dark:bg-indigo-400 rounded-t opacity-95 shadow-lg"></div>
                        </div>
                      </div>
                      
                      {/* Métricas */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="card bg-white/80 dark:bg-dark-card/80 rounded-2xl shadow-xl p-4 border border-azure-100/50 dark:border-dark-border/30 backdrop-blur-md transition-all duration-300">
                          <div className="text-2xl font-bold text-azure-700 dark:text-dark-text">87.5</div>
                          <div className="text-sm text-azure-600 dark:text-dark-text/70">Score Predicho</div>
                        </div>
                        <div className="card bg-white/80 dark:bg-dark-card/80 rounded-2xl shadow-xl p-4 border border-azure-100/50 dark:border-dark-border/30 backdrop-blur-md transition-all duration-300">
                          <div className="text-2xl font-bold text-green-600 dark:text-green-400">92%</div>
                          <div className="text-sm text-azure-600 dark:text-dark-text/70">Confianza</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section Mejorada */}
        <section className="py-24 bg-white dark:bg-dark-surface transition-colors duration-500">
          <div className="container mx-auto px-4">
            <div className="text-center mb-20 animate-fade-in">
              <div className="inline-flex items-center px-4 py-2 bg-azure-100/50 dark:bg-dark-card/60 backdrop-blur-sm rounded-full border border-azure-200/50 dark:border-dark-border/50 mb-6">
                <span className="text-azure-600 dark:text-dark-accent text-sm font-medium">⚡ Características Avanzadas</span>
              </div>
              <h2 className="text-5xl font-bold text-azure-900 dark:text-dark-text mb-6">
                Tecnología de
                <span className="gradient-text bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent"> Vanguardia</span>
              </h2>
              <p className="text-xl text-azure-600 dark:text-dark-text/80 max-w-3xl mx-auto">
                Herramientas de inteligencia artificial que revolucionan la forma de entender y mejorar el rendimiento académico
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature Cards Modernos */}
              <FeatureCard
                icon="🎯"
                title="Predicción Neural"
                description="Redes neuronales avanzadas analizan patrones complejos para predicciones ultra-precisas del rendimiento estudiantil."
                color="from-azure-500 to-azure-600"
              />
              
              <FeatureCard
                icon="📊"
                title="Analytics Cuántico"
                description="Procesamiento masivo de datos con algoritmos cuánticos para insights institucionales sin precedentes."
                color="from-purple-500 to-blue-600"
              />
              
              <FeatureCard
                icon="🧠"
                title="IA Generativa"
                description="Inteligencia artificial que genera recomendaciones personalizadas y estrategias educativas optimizadas."
                color="from-blue-500 to-indigo-600"
              />
            </div>
          </div>
        </section>

        {/* CTA Section Final */}
        <section className="py-24 bg-gradient-to-br from-azure-900 via-azure-800 to-azure-900 dark:from-dark-bg dark:via-dark-surface dark:to-dark-card text-white relative overflow-hidden">
          {/* Efectos de fondo */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-azure-600/20 via-purple-600/10 to-blue-600/20 dark:from-dark-accent/30 dark:via-purple-400/20 dark:to-blue-400/20"></div>
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-azure-500/20 dark:bg-dark-accent/30 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/20 dark:bg-purple-400/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
          </div>

          <div className="container mx-auto px-4 text-center relative z-10">
            <h2 className="text-5xl font-bold mb-8">
              El Futuro de la Educación
              <span className="block text-transparent bg-gradient-to-r from-azure-300 to-blue-300 dark:from-dark-accent dark:to-indigo-300 bg-clip-text">
                Comienza Hoy
              </span>
            </h2>
            <p className="text-xl text-azure-200 dark:text-dark-text/90 mb-12 max-w-2xl mx-auto">
              Únete a la revolución educativa. Más de 1000 instituciones ya están usando nuestra IA 
              para transformar el aprendizaje.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/csv-upload">
                <button className="group bg-white text-azure-900 hover:bg-azure-50 dark:bg-dark-text dark:text-dark-bg dark:hover:bg-gray-100 px-12 py-5 rounded-2xl transition-all duration-300 font-bold shadow-2xl hover:shadow-3xl text-xl transform hover:-translate-y-2 hover:scale-105">
                  <span className="flex items-center">
                    📁 Subir CSV
                    <svg className="ml-3 w-6 h-6 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </span>
                </button>
              </Link>
              
              <Link href="/predict">
                <button className="group border-2 border-white dark:border-dark-text text-white dark:text-dark-text hover:bg-white hover:text-azure-900 dark:hover:bg-dark-text dark:hover:text-dark-bg px-12 py-5 rounded-2xl transition-all duration-300 font-bold text-xl transform hover:-translate-y-2 hover:scale-105">
                  <span className="flex items-center">
                    🎯 Predicción Individual
                    <svg className="ml-3 w-6 h-6 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                </button>
              </Link>
            </div>
          </div>
        </section>
      </Layout>
    </>
  )
}

// Componente FeatureCard reutilizable
const FeatureCard = ({ icon, title, description, color }: {
  icon: string;
  title: string;
  description: string;
  color: string;
}) => (
  <div className="group card bg-white/90 dark:bg-dark-card/90 rounded-2xl shadow-xl p-8 border border-azure-100/50 dark:border-dark-border/30 backdrop-blur-md hover:backdrop-blur-lg transition-all duration-500 hover:shadow-2xl hover:shadow-azure-500/10 dark:hover:shadow-dark-accent/20 transform hover:-translate-y-2 hover:scale-[1.02]">
    <div className={`w-20 h-20 bg-gradient-to-br ${color} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg group-hover:shadow-2xl dark:group-hover:shadow-dark-accent/30`}>
      <span className="text-4xl filter drop-shadow-sm">{icon}</span>
    </div>
    <h3 className="text-2xl font-bold text-azure-800 dark:text-dark-text mb-4 group-hover:text-azure-600 dark:group-hover:text-dark-accent transition-colors">
      {title}
    </h3>
    <p className="text-azure-600 dark:text-dark-text/80 leading-relaxed">
      {description}
    </p>
  </div>
)

export default Home
    