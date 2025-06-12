// src/context/ThemeContext.jsx - Version corrigée
import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(false);

    // Initialiser le thème au chargement
    useEffect(() => {
        const savedTheme = localStorage.getItem('darkMode');
        const shouldBeDark = savedTheme === 'true';

        setIsDarkMode(shouldBeDark);
        applyTheme(shouldBeDark);
    }, []);

    // Fonction pour appliquer le thème - VERSION CORRIGÉE
    const applyTheme = (isDark) => {
        const html = document.documentElement;

        if (isDark) {
            // Ajouter la classe dark à html
            html.classList.add('dark');

            // Variables CSS pour mode sombre
            html.style.setProperty('--bg-primary', '#0f172a');      // slate-900
            html.style.setProperty('--bg-secondary', '#1e293b');    // slate-800
            html.style.setProperty('--bg-card', '#334155');         // slate-700
            html.style.setProperty('--text-primary', '#f8fafc');    // slate-50
            html.style.setProperty('--text-secondary', '#cbd5e1');  // slate-300
            html.style.setProperty('--border-color', '#475569');    // slate-600
            html.style.setProperty('--shadow', '0 10px 15px -3px rgba(0, 0, 0, 0.3)');

            // Forcer le body
            document.body.className = document.body.className.replace(/bg-\w+-\d+/g, '') + ' bg-slate-900 text-slate-50';
        } else {
            // Retirer la classe dark
            html.classList.remove('dark');

            // Variables CSS pour mode clair
            html.style.setProperty('--bg-primary', '#ffffff');
            html.style.setProperty('--bg-secondary', '#ffffff');
            html.style.setProperty('--bg-card', '#f8fafc');
            html.style.setProperty('--text-primary', '#0f172a');
            html.style.setProperty('--text-secondary', '#64748b');
            html.style.setProperty('--border-color', '#e2e8f0');
            html.style.setProperty('--shadow', '0 4px 6px -1px rgba(0, 0, 0, 0.1)');

            // Forcer le body
            document.body.className = document.body.className.replace(/bg-\w+-\d+/g, '') + ' bg-white text-gray-900';
        }

        // Forcer le re-render des composants React
        window.dispatchEvent(new CustomEvent('themechange', { detail: { isDark } }));
    };

    // Toggle du dark mode
    const toggleDarkMode = () => {
        const newDarkMode = !isDarkMode;
        setIsDarkMode(newDarkMode);
        applyTheme(newDarkMode);
        localStorage.setItem('darkMode', newDarkMode.toString());
    };

    const value = {
        isDarkMode,
        toggleDarkMode
    };

    return (
        <ThemeContext.Provider value={value}>
            <div className={isDarkMode ? 'dark' : ''}>
                {children}
            </div>
        </ThemeContext.Provider>
    );
};

// Hook pour utiliser le thème
export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

// Composant DarkModeToggle corrigé
export const DarkModeToggle = ({ className = '' }) => {
    const { isDarkMode, toggleDarkMode } = useTheme();

    return (
        <button
            onClick={toggleDarkMode}
            className={`
                p-2 rounded-lg transition-all duration-200 
                ${isDarkMode
                ? 'bg-slate-700 text-yellow-400 hover:bg-slate-600'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }
                focus:outline-none focus:ring-2 focus:ring-blue-500
                ${className}
            `}
            title={isDarkMode ? 'Mode clair' : 'Mode sombre'}
        >
            {isDarkMode ? (
                // Soleil
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
            ) : (
                // Lune
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
            )}
        </button>
    );
};