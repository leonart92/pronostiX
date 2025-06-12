// src/services/auth.service.js
import { api } from './api';

export const authService = {
    // Connexion
    login: async (email, password) => {
        const response = await api.post('/auth/login', {
            email,
            password
        });
        return response.data;
    },

    // Inscription
    register: async (userData) => {
        const response = await api.post('/auth/register', {
            username: userData.username,
            email: userData.email,
            password: userData.password
        });
        return response.data;
    },

    // Déconnexion
    logout: async (refreshToken) => {
        const response = await api.post('/auth/logout', {
            refreshToken
        });
        return response.data;
    },

    // Rafraîchir le token
    refreshToken: async (refreshToken) => {
        const response = await api.post('/auth/refresh', {
            refreshToken
        });
        return response.data;
    },

    // Obtenir le profil utilisateur
    getProfile: async () => {
        const response = await api.get('/auth/me');
        return response.data;
    },

    // Mot de passe oublié
    forgotPassword: async (email) => {
        const response = await api.post('/auth/forgot-password', {
            email
        });
        return response.data;
    },

    // Réinitialiser le mot de passe
    resetPassword: async (token, password) => {
        const response = await api.post('/auth/reset-password', {
            token,
            password
        });
        return response.data;
    },

    // Vérifier l'email (route GET /api/users/verify-email/:token)
    verifyEmail: async (token) => {
        const response = await api.get(`/users/verify-email/${token}`);
        return response.data;
    },

    // Renvoyer l'email de vérification (route POST /api/users/verify-email)
    resendVerificationEmail: async () => {
        const response = await api.post('/users/verify-email');
        return response.data;
    },

    // Déconnexion de tous les appareils (route POST /api/auth/logout-all)
    logoutAll: async () => {
        const response = await api.post('/auth/logout-all');
        return response.data;
    }
};