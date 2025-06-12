// src/services/subscription.service.js
import { api } from './api';

export const subscriptionService = {
    // 💳 Plans et Abonnements
    getAvailablePlans: async () => {
        const response = await api.get('/subscriptions/plans');
        return response.data;
    },

    getCurrentSubscription: async () => {
        const response = await api.get('/subscriptions/current');
        return response.data;
    },

    createCheckoutSession: async (planId, urls = {}) => {
        const response = await api.post('/subscriptions/create-checkout', {
            plan: planId,
            successUrl: urls.successUrl || `${window.location.origin}/success`,
            cancelUrl: urls.cancelUrl || `${window.location.origin}/cancel`
        });
        return response.data;
    },

    getSessionStatus: async (sessionId) => {
        const response = await api.get(`/subscriptions/session/${sessionId}`);
        return response.data;
    },

    // 🔧 Gestion Abonnement
    cancelSubscription: async () => {
        const response = await api.post('/subscriptions/cancel');
        return response.data;
    },

    reactivateSubscription: async () => {
        const response = await api.post('/subscriptions/reactivate');
        return response.data;
    },

    getInvoices: async () => {
        const response = await api.get('/subscriptions/invoices');
        return response.data;
    },

    // 🎯 Utilitaires
    redirectToCheckout: async (planId, urls = {}) => {
        try {
            const session = await this.createCheckoutSession(planId, urls);
            if (session.checkoutUrl) {
                window.location.href = session.checkoutUrl;
            } else {
                throw new Error('URL de checkout non reçue');
            }
        } catch (error) {
            console.error('Erreur lors de la redirection vers Stripe:', error);
            throw error;
        }
    },

    // Vérifier si l'utilisateur a un abonnement actif
    checkActiveSubscription: async () => {
        try {
            const subscription = await this.getCurrentSubscription();
            return subscription.data?.status === 'active';
        } catch (error) {
            return false;
        }
    }
};