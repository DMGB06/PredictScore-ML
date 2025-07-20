import Link from 'next/link'

// Componente reutilizable para enlaces del footer
const FooterLink = ({ href, children, external = false }: {
  href: string
  children: React.ReactNode
  external?: boolean
}) => (
  <Link 
    href={href} 
    className="text-azure-200 hover:text-white transition-colors duration-200 text-sm hover:underline"
    {...(external && { target: "_blank", rel: "noopener noreferrer" })}
  >
    {children}
  </Link>
)

// Componente reutilizable para secciones del footer
const FooterSection = ({ title, children }: {
  title: string
  children: React.ReactNode
}) => (
  <div className="space-y-4">
    <h4 className="font-semibold text-azure-100 text-base">{title}</h4>
    <div className="space-y-2">
      {children}
    </div>
  </div>
)

// Componente reutilizable para iconos sociales
const SocialIcon = ({ icon, href, label }: {
  icon: React.ReactNode
  href: string
  label: string
}) => (
  <Link 
    href={href}
    className="w-9 h-9 bg-azure-800/80 hover:bg-azure-700 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110 hover:shadow-lg"
    aria-label={label}
    target="_blank"
    rel="noopener noreferrer"
  >
    {icon}
  </Link>
)

const Footer = () => {
  const currentYear = new Date().getFullYear()

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
                <h3 className="text-xl font-bold text-white">Student Predictor</h3>
                <p className="text-azure-300 text-sm">AI Performance Analytics</p>
              </div>
            </div>
            
            <p className="text-azure-200 leading-relaxed max-w-md text-sm md:text-base">
              Plataforma de inteligencia artificial que ayuda a predecir y mejorar el rendimiento académico 
              estudiantil mediante análisis avanzados de Machine Learning.
            </p>
            
            {/* Redes Sociales */}
            <div className="space-y-3">
              <h5 className="text-azure-100 font-medium text-sm">Síguenos</h5>
              <div className="flex space-x-3">
                <SocialIcon
                  icon={
                    <svg className="w-4 h-4 text-azure-200" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                    </svg>
                  }
                  href="mailto:contact@studentpredictor.com"
                  label="Email"
                />
                <SocialIcon
                  icon={
                    <svg className="w-4 h-4 text-azure-200" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.042-3.441.219-.937 1.404-5.965 1.404-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.357-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z"/>
                    </svg>
                  }
                  href="https://github.com/studentpredictor"
                  label="GitHub"
                />
                <SocialIcon
                  icon={
                    <svg className="w-4 h-4 text-azure-200" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                  }
                  href="https://twitter.com/studentpredictor"
                  label="Twitter"
                />
              </div>
            </div>
          </div>

          {/* Enlaces Rápidos */}
          <FooterSection title="Plataforma">
            <FooterLink href="/predict">Predicción Individual</FooterLink>
            <FooterLink href="/csv-upload">Análisis CSV</FooterLink>
            <FooterLink href="/dashboard">Dashboard</FooterLink>
            <FooterLink href="/analytics">Analíticas Avanzadas</FooterLink>
          </FooterSection>

          {/* Soporte y Recursos */}
          <FooterSection title="Recursos">
            <FooterLink href="/docs">Documentación</FooterLink>
            <FooterLink href="/api">API Reference</FooterLink>
            <FooterLink href="/support">Centro de Ayuda</FooterLink>
            <FooterLink href="/contact">Contacto</FooterLink>
          </FooterSection>
        </div>

        {/* Línea divisoria y footer bottom */}
        <div className="border-t border-azure-700/50 mt-12 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-azure-300 text-sm text-center md:text-left">
              © {currentYear} Student Predictor. Desarrollado con ❤️ por 
              <span className="font-semibold text-azure-200 ml-1">Equipo Grupo 4</span>
            </p>
            
            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
              <FooterLink href="/privacy">Privacidad</FooterLink>
              <FooterLink href="/terms">Términos</FooterLink>
              <FooterLink href="/cookies">Cookies</FooterLink>
              <FooterLink href="/licenses">Licencias</FooterLink>
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
  )
}

export default Footer
