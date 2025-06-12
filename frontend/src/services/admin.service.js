// src/services/admin.service.js
import { api } from './api';

class AdminService {
    // Dashboard & Analytics
    async getDashboardStats() {
        const response = await api.get('/admin/dashboard');
        return response.data;
    }

    async getRevenueAnalytics() {
        const response = await api.get('/admin/analytics/revenue');
        return response.data;
    }

    // Gestion des utilisateurs
    async getUsers(filters = {}) {
        const params = new URLSearchParams(filters);
        const response = await api.get(`/admin/users?${params}`);
        return response.data;
    }

    async getUserById(id) {
        const response = await api.get(`/admin/users/${id}`);
        return response.data;
    }

    async updateUser(id, userData) {
        const response = await api.put(`/admin/users/${id}`, userData);
        return response.data;
    }

    async deleteUser(id) {
        const response = await api.delete(`/admin/users/${id}`);
        return response.data;
    }

    // Gestion des pronostics (selon API_ENDPOINTS.md)
    async getAllPronostics(filters = {}) {
        try {
            // Essayer d'abord via les routes admin
            const params = new URLSearchParams(filters);
            const response = await api.get(`/admin/pronostics?${params}`);
            return response.data;
        } catch (error) {
            // Fallback: utiliser les routes normales avec un limit élevé
            console.log('Fallback: utilisation des routes normales pour les pronostics');
            const params = new URLSearchParams({ ...filters, limit: 100 });
            const response = await api.get(`/pronostics?${params}`);
            return response.data;
        }
    }

    async createPronostic(pronosticData) {
        console.log('Service: Création pronostic', pronosticData);
        // Selon API_ENDPOINTS.md: POST /api/pronostics (admin)
        const response = await api.post('/pronostics', pronosticData);
        return response.data;
    }

    async updatePronostic(id, pronosticData) {
        console.log('Service: Modification pronostic', id, pronosticData);
        // Selon API_ENDPOINTS.md: PUT /api/pronostics/:id (admin)
        const response = await api.put(`/pronostics/${id}`, pronosticData);
        return response.data;
    }

    async deletePronostic(id) {
        console.log('Service: Suppression pronostic', id);
        // Selon API_ENDPOINTS.md: DELETE /api/pronostics/:id (admin)
        const response = await api.delete(`/pronostics/${id}`);
        return response.data;
    }

    async publishPronostic(id) {
        console.log('Service: Publication pronostic', id);
        // Selon API_ENDPOINTS.md: POST /api/pronostics/:id/publish (admin)
        const response = await api.post(`/pronostics/${id}/publish`);
        return response.data;
    }

    async unpublishPronostic(id) {
        console.log('Service: Dépublication pronostic', id);
        // Selon API_ENDPOINTS.md: POST /api/pronostics/:id/unpublish (admin)
        const response = await api.post(`/pronostics/${id}/unpublish`);
        return response.data;
    }

    async updatePronosticResult(id, result) {
        console.log('Service: Mise à jour résultat', id, result);
        // Selon API_ENDPOINTS.md: POST /api/pronostics/:id/result (admin)
        const response = await api.post(`/pronostics/${id}/result`, result);
        return response.data;
    }

    // Statistiques pronostics
    async getGlobalStats() {
        // Selon API_ENDPOINTS.md: GET /api/pronostics/stats/global
        const response = await api.get('/pronostics/stats/global');
        return response.data;
    }

    async getTodayPronostics() {
        // Selon API_ENDPOINTS.md: GET /api/pronostics/upcoming/today
        const response = await api.get('/pronostics/upcoming/today');
        return response.data;
    }

    // Gestion des abonnements
    async getAllSubscriptions(filters = {}) {
        const params = new URLSearchParams(filters);
        const response = await api.get(`/admin/subscriptions?${params}`);
        return response.data;
    }

    async cancelSubscription(id) {
        const response = await api.post(`/admin/subscriptions/${id}/cancel`);
        return response.data;
    }

    // Gestion des paiements
    async getPayments(filters = {}) {
        const params = new URLSearchParams(filters);
        const response = await api.get(`/admin/payments?${params}`);
        return response.data;
    }

    // Logs et système
    async getSecurityLogs(filters = {}) {
        const params = new URLSearchParams(filters);
        const response = await api.get(`/admin/logs/security?${params}`);
        return response.data;
    }

    async toggleMaintenanceMode() {
        const response = await api.post('/admin/system/maintenance');
        return response.data;
    }
}

// IMPORTANT: Export d'une instance unique
export const adminService = new AdminService();

// Export par défaut pour compatibilité
export default adminService;