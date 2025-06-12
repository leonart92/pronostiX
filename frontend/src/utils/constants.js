// src/utils/constants.js

// Configuration API
export const API_CONFIG = {
    BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
    TIMEOUT: 10000,
};

// Routes de navigation
export const ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    REGISTER: '/register',
    DASHBOARD: '/dashboard',
    PROFILE: '/profile',
    SETTINGS: '/settings',
    PRICING: '/pricing',
    PRONOSTICS: '/pronostics',
    PRONOSTICS_PREMIUM: '/pronostics/premium',
    ADMIN: '/admin',
    SUCCESS: '/success',
    CANCEL: '/cancel',
    NOT_FOUND: '/404'
};

// API Endpoints selon API_ENDPOINTS.md
export const API_ENDPOINTS = {
    // 🔐 Authentification
    AUTH: {
        REGISTER: '/auth/register',
        LOGIN: '/auth/login',
        REFRESH: '/auth/refresh',
        LOGOUT: '/auth/logout',
        LOGOUT_ALL: '/auth/logout-all',
        ME: '/auth/me',
        FORGOT_PASSWORD: '/auth/forgot-password',
        RESET_PASSWORD: '/auth/reset-password'
    },

    // 👤 Utilisateurs
    USERS: {
        PROFILE: '/users/profile',
        CHANGE_PASSWORD: '/users/change-password',
        DELETE_ACCOUNT: '/users/account',
        SUBSCRIPTION_STATUS: '/users/subscription-status',
        ACTIVITY: '/users/activity',
        STATS: '/users/stats',
        VERIFY_EMAIL: '/users/verify-email',
        VERIFY_EMAIL_TOKEN: (token) => `/users/verify-email/${token}`
    },

    // 🏆 Pronostics
    PRONOSTICS: {
        LIST: '/pronostics',
        BY_ID: (id) => `/pronostics/${id}`,
        STATS_GLOBAL: '/pronostics/stats/global',
        TODAY: '/pronostics/upcoming/today',
        PUBLISH: (id) => `/pronostics/${id}/publish`,
        UNPUBLISH: (id) => `/pronostics/${id}/unpublish`,
        RESULT: (id) => `/pronostics/${id}/result`
    },

    // 💳 Abonnements
    SUBSCRIPTIONS: {
        PLANS: '/subscriptions/plans',
        CURRENT: '/subscriptions/current',
        CREATE_CHECKOUT: '/subscriptions/create-checkout',
        SESSION: (sessionId) => `/subscriptions/session/${sessionId}`,
        CANCEL: '/subscriptions/cancel',
        REACTIVATE: '/subscriptions/reactivate',
        INVOICES: '/subscriptions/invoices',
        WEBHOOK: '/subscriptions/webhook'
    },

    // 🛡️ Administration
    ADMIN: {
        DASHBOARD: '/admin/dashboard',
        ANALYTICS_REVENUE: '/admin/analytics/revenue',
        USERS: '/admin/users',
        USER_BY_ID: (id) => `/admin/users/${id}`,
        PRONOSTICS: '/admin/pronostics',
        SUBSCRIPTIONS: '/admin/subscriptions',
        CANCEL_SUBSCRIPTION: (id) => `/admin/subscriptions/${id}/cancel`,
        PAYMENTS: '/admin/payments',
        SECURITY_LOGS: '/admin/logs/security',
        MAINTENANCE: '/admin/system/maintenance'
    }
};

// Statuts d'abonnement
export const SUBSCRIPTION_STATUS = {
    NONE: 'none',
    ACTIVE: 'active',
    EXPIRED: 'expired',
    CANCELLED: 'cancelled'
};

// Rôles utilisateurs
export const USER_ROLES = {
    USER: 'user',
    ADMIN: 'admin'
};

// Types de sports
export const SPORTS = {
    FOOTBALL: 'football',
    TENNIS: 'tennis',
    BASKETBALL: 'basketball',
    HANDBALL: 'handball',
    VOLLEYBALL: 'volleyball',
    OTHER: 'other'
};

// Statuts des pronostics
export const PRONOSTIC_STATUS = {
    PENDING: 'pending',
    WON: 'won',
    LOST: 'lost',
    VOID: 'void',
    PUSH: 'push'
};

// Types de prédictions
export const PREDICTION_TYPES = {
    '1X2': '1X2',
    OVER_UNDER: 'over_under',
    BOTH_TEAMS_SCORE: 'both_teams_score',
    HANDICAP: 'handicap',
    CORRECT_SCORE: 'correct_score',
    OTHER: 'other'
};

// Niveaux de priorité
export const PRIORITY_LEVELS = {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high'
};

// Plans d'abonnement
export const SUBSCRIPTION_PLANS = {
    MONTHLY: {
        id: 'monthly',
        name: 'Mensuel',
        price: 19.99,
        duration: 30,
        description: 'Accès complet pendant 1 mois'
    },
    QUARTERLY: {
        id: 'quarterly',
        name: 'Trimestriel',
        price: 49.99,
        duration: 90,
        description: 'Accès complet pendant 3 mois',
        savings: '17%'
    },
    ANNUALLY: {
        id: 'annually',
        name: 'Annuel',
        price: 179.99,
        duration: 365,
        description: 'Accès complet pendant 1 an',
        savings: '25%'
    }
};

// Messages d'erreur courants
export const ERROR_MESSAGES = {
    NETWORK_ERROR: 'Erreur de connexion au serveur',
    UNAUTHORIZED: 'Vous devez être connecté pour accéder à cette page',
    FORBIDDEN: 'Vous n\'avez pas les permissions nécessaires',
    NOT_FOUND: 'Ressource non trouvée',
    VALIDATION_ERROR: 'Veuillez vérifier les données saisies',
    SERVER_ERROR: 'Erreur interne du serveur',
    SUBSCRIPTION_REQUIRED: 'Abonnement requis pour accéder à ce contenu'
};

// Messages de succès
export const SUCCESS_MESSAGES = {
    LOGIN: 'Connexion réussie !',
    REGISTER: 'Compte créé avec succès !',
    LOGOUT: 'Déconnexion réussie',
    PROFILE_UPDATED: 'Profil mis à jour avec succès',
    PASSWORD_CHANGED: 'Mot de passe modifié avec succès',
    EMAIL_VERIFIED: 'Email vérifié avec succès',
    SUBSCRIPTION_CREATED: 'Abonnement créé avec succès'
};

// Configuration des toasts
export const TOAST_CONFIG = {
    POSITION: 'top-right',
    DURATION: {
        SUCCESS: 3000,
        ERROR: 5000,
        INFO: 4000
    },
    STYLE: {
        SUCCESS: {
            background: '#10b981',
            color: '#ffffff'
        },
        ERROR: {
            background: '#ef4444',
            color: '#ffffff'
        },
        INFO: {
            background: '#3b82f6',
            color: '#ffffff'
        }
    }
};

// Expressions régulières pour validation
export const REGEX_PATTERNS = {
    EMAIL: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
    PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    USERNAME: /^[a-zA-Z0-9_-]+$/,
    PHONE: /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/
};

// Limites de pagination
export const PAGINATION = {
    DEFAULT_PAGE_SIZE: 10,
    MAX_PAGE_SIZE: 50,
    DEFAULT_PAGE: 1
};

// Couleurs du thème
export const THEME_COLORS = {
    PRIMARY: {
        50: '#eff6ff',
        100: '#dbeafe',
        200: '#bfdbfe',
        300: '#93c5fd',
        400: '#60a5fa',
        500: '#3b82f6',
        600: '#2563eb',
        700: '#1d4ed8',
        800: '#1e40af',
        900: '#1e3a8a'
    },
    SUCCESS: '#10b981',
    WARNING: '#f59e0b',
    DANGER: '#ef4444',
    INFO: '#3b82f6'
};

// Configuration localStorage
export const STORAGE_KEYS = {
    ACCESS_TOKEN: 'accessToken',
    REFRESH_TOKEN: 'refreshToken',
    USER_PREFERENCES: 'userPreferences',
    THEME: 'theme'
};

export default {
    API_CONFIG,
    ROUTES,
    SUBSCRIPTION_STATUS,
    USER_ROLES,
    SPORTS,
    PRONOSTIC_STATUS,
    PREDICTION_TYPES,
    PRIORITY_LEVELS,
    SUBSCRIPTION_PLANS,
    ERROR_MESSAGES,
    SUCCESS_MESSAGES,
    TOAST_CONFIG,
    REGEX_PATTERNS,
    PAGINATION,
    THEME_COLORS,
    STORAGE_KEYS
};