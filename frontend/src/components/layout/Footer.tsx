import Link from "next/link";

// Componente reutilizable para enlaces del footer
const FooterLink = ({
  href,
  children,
  external = false,
}: {
  href: string;
  children: React.ReactNode;
  external?: boolean;
}) => (
  <Link
    href={href}
    className="text-azure-200 hover:text-white transition-colors duration-200 text-sm hover:underline"
    {...(external && { target: "_blank", rel: "noopener noreferrer" })}
  >
    {children}
  </Link>
);

// Componente reutilizable para secciones del footer
const FooterSection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="space-y-4">
    <h4 className="font-semibold text-azure-100 text-base">{title}</h4>
    <div className="space-y-2">{children}</div>
  </div>
);

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-azure-900 via-azure-800 to-azure-900 text-white relative overflow-hidden">
      {/* Efecto de fondo sutil */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Información de la Empresa */}
          <div className="sm:col-span-2 lg:col-span-2 space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-azure-400 to-azure-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">SP</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">
                  PredictScore ML
                </h3>
                <p className="text-azure-300 text-sm">
                  Proyecto Final Machine Learning
                </p>
              </div>
            </div>

            <p className="text-azure-200 leading-relaxed max-w-md text-sm md:text-base">
              Sistema de Machine Learning para predicción de rendimiento
              académico estudiantil. Desarrollado como proyecto final del curso
              Machine Learning 2 aplicando algoritmos SVR y buenas prácticas de
              desarrollo.
            </p>

            {/* Información del proyecto */}
            <div className="space-y-3">
              <h5 className="text-azure-100 font-medium text-sm">
                Información del Proyecto
              </h5>
              <div className="text-xs text-azure-300 space-y-1">
                <p>🎓 Machine Learning 2 - 2025</p>
                <p>👥 Equipo Grupo 4</p>
                <p>🧠 Algoritmo SVR</p>
              </div>
            </div>
          </div>

          {/* Enlaces Rápidos - Solo páginas existentes */}
          <FooterSection title="Plataforma">
            <FooterLink href="/">Inicio</FooterLink>
            <FooterLink href="/predictor-academico">
              Predicción Académica
            </FooterLink>
          </FooterSection>

          {/* Información del Proyecto */}
          <FooterSection title="Proyecto Final">
            <div className="text-azure-200 text-sm space-y-2">
              <p>Machine Learning 2</p>
              <p>Equipo Grupo 4</p>
              <p>2025</p>
            </div>
          </FooterSection>
        </div>

        {/* Línea divisoria y footer bottom */}
        <div className="border-t border-azure-700/50 mt-12 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-azure-300 text-sm text-center md:text-left">
              © {currentYear} Student Predictor. Desarrollado con ❤️ por
              <span className="font-semibold text-azure-200 ml-1">
                Equipo Grupo 4
              </span>
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
              <span className="text-xs text-azure-400">
                Proyecto Académico 2025
              </span>
            </div>
          </div>

          {/* Información técnica */}
          <div className="mt-6 pt-4 border-t border-azure-800/30">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-azure-400">
              <p>Potenciado por Next.js 15, FastAPI y Machine Learning</p>
              <p className="flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                Todos los sistemas operacionales
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
