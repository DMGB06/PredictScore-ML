import type { NextPage } from "next";
import Head from "next/head";
import Layout from "@/components/layout/Layout";
import FormField from "@/components/FormField";
import VariableGuide from "@/components/forms/VariableGuide";
import ResultsPanel from "@/components/prediction/ResultsPanel";
import { usePredictionForm } from "@/hooks/usePredictionForm";
import { formFields } from "@/config/formConfig";

const Predict: NextPage = () => {
  const {
    formData,
    prediction,
    loading,
    error,
    showGuide,
    handleInputChange,
    handleSubmit,
    toggleGuide,
  } = usePredictionForm();

  return (
    <>
      <Head>
        <title>Predicción Individual - Student Predictor</title>
        <meta
          name="description"
          content="Predice el rendimiento académico de un estudiante usando IA avanzada"
        />
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </Head>

      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-azure-50 via-white to-azure-100 dark:from-dark-bg dark:via-dark-surface dark:to-dark-card py-12">
          <div className="container mx-auto px-4">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-azure-900 dark:text-dark-text mb-4">
                Predice el Rendimiento
                <span className="block text-transparent bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text">
                  Académico
                </span>
              </h1>
              <p className="text-xl text-azure-600 dark:text-dark-text/80 max-w-2xl mx-auto mb-6">
                Ingresa los datos del estudiante y obtén una predicción precisa
                usando nuestros modelos de IA
              </p>

              <VariableGuide showGuide={showGuide} onToggle={toggleGuide} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Formulario */}
              <div className="lg:col-span-2">
                <form
                  onSubmit={handleSubmit}
                  style={{
                    backgroundColor: 'white',
                    padding: '40px',
                    borderRadius: '16px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
                  }}
                >
                  <h2
                    style={{
                      color: '#1a202c',
                      marginBottom: '32px',
                      fontSize: '28px',
                      fontWeight: '700',
                      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                      textAlign: 'center' as const,
                      borderBottom: '3px solid #3182ce',
                      paddingBottom: '16px'
                    }}
                  >
                    📊 Datos del Estudiante
                  </h2>

                  {/* Campos del formulario */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                      gap: '24px',
                      marginBottom: '32px'
                    }}
                  >
                    {formFields.map((field) => (
                      <FormField
                        key={field.name}
                        {...field}
                        value={
                          formData[field.name as keyof typeof formData] || ""
                        }
                        onChange={handleInputChange}
                      />
                    ))}
                  </div>

                  {/* Botón de envío */}
                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      width: '100%',
                      padding: '16px 24px',
                      backgroundColor: loading ? '#a0aec0' : '#3182ce',
                      color: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      fontSize: '18px',
                      fontWeight: '600',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: loading ? 'none' : '0 4px 12px rgba(49, 130, 206, 0.3)',
                      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                      transform: loading ? 'none' : 'translateY(0)',
                      marginTop: '16px'
                    }}
                    onMouseEnter={(e) => {
                      if (!loading) {
                        e.currentTarget.style.backgroundColor = '#2c5aa0';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 6px 16px rgba(49, 130, 206, 0.4)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!loading) {
                        e.currentTarget.style.backgroundColor = '#3182ce';
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(49, 130, 206, 0.3)';
                      }
                    }}
                  >
                    {loading ? (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div
                          style={{
                            width: '20px',
                            height: '20px',
                            border: '2px solid #ffffff',
                            borderTop: '2px solid transparent',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite',
                            marginRight: '12px'
                          }}
                        ></div>
                        Analizando datos...
                      </div>
                    ) : (
                      <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        🎯 Generar Predicción
                        <span style={{ marginLeft: '8px', fontSize: '16px' }}>→</span>
                      </span>
                    )}
                  </button>
                </form>
              </div>

              {/* Panel de Resultados */}
              <div className="lg:col-span-1">
                <ResultsPanel
                  prediction={prediction}
                  loading={loading}
                  error={error}
                />
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Predict;
