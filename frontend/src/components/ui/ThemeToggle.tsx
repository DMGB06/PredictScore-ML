import { useTheme } from '@/utils/useTheme'

const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className="relative w-10 h-10 flex items-center justify-center group transition-all duration-300 hover:scale-110"
      aria-label={`Cambiar a tema ${isDark ? 'claro' : 'oscuro'}`}
    >
      {/* Sol - Visible en modo claro */}
      <div className={`absolute inset-0 flex items-center justify-center transition-all duration-500 transform ${
        !isDark ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-0 rotate-180'
      }`}>
        <svg 
          className="w-6 h-6 text-amber-500 group-hover:text-amber-600 transition-colors duration-200 drop-shadow-lg" 
          fill="currentColor" 
          viewBox="0 0 24 24"
        >
          <path d="M12 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm0 17a5 5 0 100-10 5 5 0 000 10zm8-5a1 1 0 110 2h-1a1 1 0 110-2h1zM5 12a1 1 0 110 2H4a1 1 0 110-2h1zm13.66-4.66a1 1 0 111.414 1.414l-.707.707a1 1 0 11-1.414-1.414l.707-.707zM6.34 17.66a1 1 0 111.414 1.414l-.707.707a1 1 0 11-1.414-1.414l.707-.707zm0-11.32a1 1 0 011.414 0l.707.707a1 1 0 11-1.414 1.414L6.34 7.76a1 1 0 010-1.414zM17.66 17.66a1 1 0 011.414 0l.707.707a1 1 0 11-1.414 1.414l-.707-.707a1 1 0 010-1.414z"/>
        </svg>
      </div>

      {/* Luna - Visible en modo oscuro */}
      <div className={`absolute inset-0 flex items-center justify-center transition-all duration-500 transform ${
        isDark ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-0 -rotate-180'
      }`}>
        <svg 
          className="w-6 h-6 text-slate-600 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors duration-200 drop-shadow-lg" 
          fill="currentColor" 
          viewBox="0 0 24 24"
        >
          <path d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"/>
        </svg>
      </div>

      {/* Efecto de glow sutil al hacer hover */}
      <div className={`absolute inset-0 rounded-full transition-all duration-300 ${
        isDark 
          ? 'bg-slate-500/10 shadow-slate-500/20' 
          : 'bg-amber-300/10 shadow-amber-400/20'
      } opacity-0 group-hover:opacity-100 group-hover:shadow-lg blur-sm -z-10`} />
    </button>
  )
}

export default ThemeToggle
