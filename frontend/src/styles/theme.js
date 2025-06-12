// src/styles/theme.js
export const theme = {
    // Couleurs principales
    colors: {
        primary: {
            50: '#eff6ff',
            100: '#dbeafe',
            200: '#bfdbfe',
            300: '#93c5fd',
            400: '#60a5fa',
            500: '#3b82f6',  // Couleur principale
            600: '#2563eb',
            700: '#1d4ed8',
            800: '#1e40af',
            900: '#1e3a8a'
        },
        secondary: {
            50: '#f8fafc',
            100: '#f1f5f9',
            200: '#e2e8f0',
            300: '#cbd5e1',
            400: '#94a3b8',
            500: '#64748b',
            600: '#475569',
            700: '#334155',
            800: '#1e293b',
            900: '#0f172a'
        },
        success: {
            light: '#d1fae5',
            DEFAULT: '#10b981',
            dark: '#047857'
        },
        warning: {
            light: '#fef3c7',
            DEFAULT: '#f59e0b',
            dark: '#d97706'
        },
        danger: {
            light: '#fee2e2',
            DEFAULT: '#ef4444',
            dark: '#dc2626'
        },
        // Couleurs neutres
        white: '#ffffff',
        black: '#000000',
        gray: {
            50: '#f9fafb',
            100: '#f3f4f6',
            200: '#e5e7eb',
            300: '#d1d5db',
            400: '#9ca3af',
            500: '#6b7280',
            600: '#4b5563',
            700: '#374151',
            800: '#1f2937',
            900: '#111827'
        }
    },

    // Typographie
    typography: {
        fontFamily: {
            sans: ['Inter', 'system-ui', 'sans-serif'],
            heading: ['Poppins', 'system-ui', 'sans-serif'],
            mono: ['Fira Code', 'monospace']
        },
        fontSize: {
            xs: '0.75rem',    // 12px
            sm: '0.875rem',   // 14px
            base: '1rem',     // 16px
            lg: '1.125rem',   // 18px
            xl: '1.25rem',    // 20px
            '2xl': '1.5rem',  // 24px
            '3xl': '1.875rem', // 30px
            '4xl': '2.25rem',  // 36px
            '5xl': '3rem',     // 48px
            '6xl': '3.75rem'   // 60px
        },
        fontWeight: {
            thin: '100',
            light: '300',
            normal: '400',
            medium: '500',
            semibold: '600',
            bold: '700',
            extrabold: '800',
            black: '900'
        }
    },

    // Espacements
    spacing: {
        xs: '0.25rem',   // 4px
        sm: '0.5rem',    // 8px
        md: '1rem',      // 16px
        lg: '1.5rem',    // 24px
        xl: '2rem',      // 32px
        '2xl': '3rem',   // 48px
        '3xl': '4rem',   // 64px
        '4xl': '6rem',   // 96px
        '5xl': '8rem'    // 128px
    },

    // Rayons de bordure
    borderRadius: {
        none: '0',
        sm: '0.25rem',   // 4px
        md: '0.375rem',  // 6px
        lg: '0.5rem',    // 8px
        xl: '0.75rem',   // 12px
        '2xl': '1rem',   // 16px
        '3xl': '1.5rem', // 24px
        full: '9999px'
    },

    // Ombres
    shadows: {
        sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
        '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)'
    },

    // Transitions
    transitions: {
        fast: '150ms ease-in-out',
        DEFAULT: '200ms ease-in-out',
        slow: '300ms ease-in-out'
    },

    // Breakpoints responsive
    breakpoints: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px'
    }
};

// Thèmes prédéfinis
export const themes = {
    default: {
        name: 'Default',
        primary: theme.colors.primary[500],
        primaryHover: theme.colors.primary[600],
        primaryLight: theme.colors.primary[100],
        background: theme.colors.white,
        surface: theme.colors.gray[50],
        text: theme.colors.gray[900],
        textSecondary: theme.colors.gray[600]
    },

    dark: {
        name: 'Dark',
        primary: theme.colors.primary[400],
        primaryHover: theme.colors.primary[500],
        primaryLight: theme.colors.primary[900],
        background: theme.colors.gray[900],
        surface: theme.colors.gray[800],
        text: theme.colors.white,
        textSecondary: theme.colors.gray[300]
    },

    success: {
        name: 'Success Theme',
        primary: theme.colors.success.DEFAULT,
        primaryHover: theme.colors.success.dark,
        primaryLight: theme.colors.success.light,
        background: theme.colors.white,
        surface: theme.colors.gray[50],
        text: theme.colors.gray[900],
        textSecondary: theme.colors.gray[600]
    }
};

// Fonction pour appliquer un thème
export const applyTheme = (themeName = 'default') => {
    const selectedTheme = themes[themeName] || themes.default;

    const root = document.documentElement;
    Object.entries(selectedTheme).forEach(([key, value]) => {
        root.style.setProperty(`--color-${key}`, value);
    });

    // Sauvegarder le thème choisi
    localStorage.setItem('selectedTheme', themeName);
};

// Fonction pour obtenir le thème sauvegardé
export const getSavedTheme = () => {
    return localStorage.getItem('selectedTheme') || 'default';
};

export default theme;