import Link from "next/link";
import { useState } from "react";
import ThemeToggle from "@/components/ui/ThemeToggle";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="glass-header sticky top-0 z-50 bg-white/95 dark:bg-dark-surface/95 backdrop-blur-xl border-b border-azure-200/50 dark:border-dark-border/50 transition-all duration-500 shadow-lg dark:shadow-dark-accent/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo Section - Responsive */}
          <div className="flex items-center space-x-3 md:space-x-4 flex-shrink-0">
            <div className="relative group">
              {/* Logo con efectos mejorados */}
              <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-azure-600 to-azure-800 dark:from-dark-accent dark:to-indigo-600 rounded-xl md:rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 shadow-lg group-hover:shadow-2xl group-hover:shadow-azure-500/50 dark:group-hover:shadow-dark-accent/50">
                <span className="text-white font-bold text-lg md:text-xl drop-shadow-sm">
                  SP
                </span>
              </div>
              {/* Anillo de glow optimizado */}
              <div className="absolute inset-0 rounded-xl md:rounded-2xl bg-gradient-to-br from-azure-500/30 to-azure-700/30 dark:from-dark-accent/40 dark:to-indigo-600/40 opacity-0 group-hover:opacity-100 transition-all duration-500 blur-md -z-10 scale-110"></div>
            </div>

            <div className="hidden sm:block">
              <h1 className="text-lg md:text-xl lg:text-2xl font-bold gradient-text bg-gradient-to-r from-azure-600 via-azure-700 to-azure-800 dark:from-dark-accent dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
                Student Predictor
              </h1>
              <p className="text-xs md:text-sm text-azure-600 dark:text-dark-text/80 hidden md:block font-medium">
                AI-Powered Analytics
              </p>
            </div>

            {/* Logo móvil simplificado */}
            <div className="sm:hidden">
              <h1 className="text-lg font-bold gradient-text bg-gradient-to-r from-azure-600 to-azure-800 dark:from-dark-accent dark:to-indigo-400 bg-clip-text text-transparent">
                SP
              </h1>
            </div>
          </div>

          {/* Desktop Navigation - Solo páginas existentes */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
            <NavLink href="/" label=" Inicio" />
            <NavLink href="/predictor-academico" label=" Predicción" />
          </nav>

          {/* Desktop Controls */}
          <div className="hidden md:flex items-center space-x-3 lg:space-x-4">
            <ThemeToggle />
          </div>

          {/* Mobile Controls */}
          <div className="flex md:hidden items-center space-x-3">
            <ThemeToggle />

            {/* Hamburger Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="relative w-10 h-10 rounded-lg bg-azure-100/80 dark:bg-azure-800/80 hover:bg-azure-200/80 dark:hover:bg-azure-700/80 transition-colors duration-200 flex items-center justify-center"
              aria-label="Toggle mobile menu"
            >
              <div className="relative w-6 h-6">
                <span
                  className={`absolute block w-6 h-0.5 bg-azure-700 dark:bg-azure-300 transition-all duration-300 ${
                    isMobileMenuOpen ? "rotate-45 top-3" : "top-1"
                  }`}
                ></span>
                <span
                  className={`absolute block w-6 h-0.5 bg-azure-700 dark:bg-azure-300 transition-all duration-300 top-3 ${
                    isMobileMenuOpen ? "opacity-0" : "opacity-100"
                  }`}
                ></span>
                <span
                  className={`absolute block w-6 h-0.5 bg-azure-700 dark:bg-azure-300 transition-all duration-300 ${
                    isMobileMenuOpen ? "-rotate-45 top-3" : "top-5"
                  }`}
                ></span>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`
          md:hidden transition-all duration-300 ease-in-out overflow-hidden
          ${isMobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}
        `}
        >
          <div className="py-4 space-y-2 border-t border-azure-200/50 dark:border-azure-700/30 mt-4">
            <MobileNavLink
              href="/"
              label="🏠 Inicio"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <MobileNavLink
              href="/predictor-academico"
              label="🎯 Predicción Académica"
              onClick={() => setIsMobileMenuOpen(false)}
            />
          </div>
        </div>
      </div>
    </header>
  );
};

// Desktop NavLink Component
const NavLink = ({ href, label }: { href: string; label: string }) => (
  <Link
    href={href}
    className="relative px-3 xl:px-4 py-2 text-azure-700 dark:text-dark-text hover:text-azure-800 dark:hover:text-white font-medium transition-all duration-300 rounded-lg hover:bg-azure-100/50 dark:hover:bg-dark-hover/50 group text-sm xl:text-base"
  >
    {label}
    {/* Indicador de hover mejorado */}
    <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-azure-600 to-azure-800 dark:from-dark-accent dark:to-indigo-400 transition-all duration-300 group-hover:w-full"></div>
  </Link>
);

// Mobile NavLink Component
const MobileNavLink = ({
  href,
  label,
  onClick,
}: {
  href: string;
  label: string;
  onClick: () => void;
}) => (
  <Link
    href={href}
    onClick={onClick}
    className="block px-4 py-3 text-azure-700 dark:text-dark-text hover:text-azure-800 dark:hover:text-white hover:bg-azure-100/50 dark:hover:bg-dark-hover/30 rounded-lg transition-all duration-200 font-medium"
  >
    {label}
  </Link>
);

export default Header;
