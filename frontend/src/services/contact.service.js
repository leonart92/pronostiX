// services/contact.service.js
import { api } from './api';

export const contactService = {
    // Envoyer un message de contact
    sendMessage: async (contactData) => {
        const response = await api.post('/contact', contactData);
        return response.data;
    },

    // Test de la configuration email (développement uniquement)
    testEmail: async () => {
        const response = await api.get('/contact/test');
        return response.data;
    }
};