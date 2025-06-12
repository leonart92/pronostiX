import { useContext} from "react";
import { ThemeContext } from "../context/ThemeContext";

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

export const useThemeClasses = () => {
    const { currentTheme } = useTheme();

    const getThemeClasses = (baseClasses = '', themeVariants = {}) => {
        const themeClass = themeVariants[currentTheme] || themeVariants.default || '';
        return `${baseClasses} ${themeClass}`.trim();
    };

    const getPrimaryClasses = (variant = 'solid') => {
        const variants = {
            solid: 'btn-primary',
            outline: 'btn-outline',
            ghost: 'btn-ghost'
        };
        return variants[variant] || variants.solid;
    };

    return {
        getThemeClasses,
        getPrimaryClasses,
        currentTheme
    };
};

// Composant pour le sélecteur de thème
export const ThemeSelector = ({ className = '' }) => {
    const { currentTheme, changeTheme, availableThemes, themes } = useTheme();

    return (
        <div className={`theme-selector ${className}`}>
            <label htmlFor="theme-select" className="block text-sm font-medium text-gray-700 mb-2">
                Choisir un thème
            </label>
            <select
                id="theme-select"
                value={currentTheme}
                onChange={(e) => changeTheme(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
                {availableThemes.map((themeName) => (
                    <option key={themeName} value={themeName}>
                        {themes[themeName].name}
                    </option>
                ))}
            </select>
        </div>
    );
};

// Composant pour le toggle dark mode
export const DarkModeToggle = ({ className = '' }) => {
    const { currentTheme, toggleDarkMode } = useTheme();
    const isDark = currentTheme === 'dark';

    return (
        <button
            onClick={toggleDarkMode}
            className={`
        p-2 rounded-lg transition-colors duration-200
        ${isDark
                ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}
        ${className}
      `}
            aria-label={isDark ? 'Activer le mode clair' : 'Activer le mode sombre'}
        >
            {isDark ? (
                // Icône soleil
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
            ) : (
                // Icône lune
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
            )}
        </button>
    );
};

