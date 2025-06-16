// src/services/pronostic.service.js
import { api } from './api';

export const pronosticService = {
    // 🏆 Consultation des pronostics
    getPronostics: async (params = {}) => {
        const queryParams = new URLSearchParams();

        // Paramètres de pagination
        if (params.page) queryParams.append('page', params.page);
        if (params.limit) queryParams.append('limit', params.limit);

        // Filtres
        if (params.sport) queryParams.append('sport', params.sport);
        if (params.status) queryParams.append('status', params.status);
        if (params.priority) queryParams.append('priority', params.priority);
        if (params.league) queryParams.append('league', params.league);
        if (params.upcoming) queryParams.append('upcoming', params.upcoming);
        if (params.dateFrom) queryParams.append('dateFrom', params.dateFrom);
        if (params.dateTo) queryParams.append('dateTo', params.dateTo);
        if (params.sort) queryParams.append('sort', params.sort);

        const response = await api.get(`/pronostics?${queryParams.toString()}`);

        return response.data;
    },

    getPronosticById: async (id) => {
        const response = await api.get(`/pronostics/${id}`);
        return response.data;
    },

    getGlobalStats: async () => {
        const response = await api.get('/pronostics/stats/global');
        return response.data;
    },

    getTodayPronostics: async () => {
        const response = await api.get('/pronostics/upcoming/today');
        return response.data;
    },

    // 👑 Gestion Admin (Admin uniquement)
    createPronostic: async (pronosticData) => {
        const response = await api.post('/pronostics', pronosticData);
        return response.data;
    },

    updatePronostic: async (id, pronosticData) => {
        const response = await api.put(`/pronostics/${id}`, pronosticData);
        return response.data;
    },

    deletePronostic: async (id) => {
        const response = await api.delete(`/pronostics/${id}`);
        return response.data;
    },

    publishPronostic: async (id) => {
        const response = await api.post(`/pronostics/${id}/publish`);
        return response.data;
    },

    unpublishPronostic: async (id) => {
        const response = await api.post(`/pronostics/${id}/unpublish`);
        return response.data;
    },

    updateResult: async (id, resultData) => {
        const response = await api.post(`/pronostics/${id}/result`, resultData);
        return response.data;
    }
};