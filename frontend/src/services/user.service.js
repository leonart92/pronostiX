// src/services/user.service.js
import { api } from './api';

export const userService = {
    // 👤 Gestion du profil
    getProfile: async () => {
        const response = await api.get('/users/profile');
        return response.data;
    },

    updateProfile: async (profileData) => {
        const response = await api.put('/users/profile', profileData);
        return response.data;
    },

    changePassword: async (passwordData) => {
        const response = await api.put('/users/change-password', {
            currentPassword: passwordData.currentPassword,
            newPassword: passwordData.newPassword
        });
        return response.data;
    },

    deleteAccount: async () => {
        const response = await api.delete('/users/account');
        return response.data;
    },

    // 💳 Abonnement & Activité
    getSubscriptionStatus: async () => {
        const response = await api.get('/users/subscription-status');
        return response.data;
    },

    getActivity: async () => {
        const response = await api.get('/users/activity');
        return response.data;
    },

    getStats: async () => {
        const response = await api.get('/users/stats');
        return response.data;
    },

    // 📧 Gestion email
    verifyEmail: async (token) => {
        const response = await api.get(`/users/verify-email/${token}`);
        return response.data;
    },

    resendVerificationEmail: async () => {
        const response = await api.post('/users/verify-email');
        return response.data;
    }
};