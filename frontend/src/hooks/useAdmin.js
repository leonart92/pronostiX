// src/hooks/useAdmin.js
import { useState, useEffect } from 'react';
import { adminService } from '../services/admin.service';
import toast from 'react-hot-toast';

export const useAdmin = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleRequest = async (requestFn, successMessage = null) => {
        try {
            setLoading(true);
            setError(null);
            const result = await requestFn();
            if (successMessage) {
                toast.success(successMessage);
            }
            return result;
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Une erreur est survenue';
            setError(errorMessage);
            toast.error(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        error,

        // Dashboard
        getDashboardStats: () => handleRequest(() => adminService.getDashboardStats()),
        getRevenueAnalytics: () => handleRequest(() => adminService.getRevenueAnalytics()),

        // Utilisateurs
        getUsers: (filters) => handleRequest(() => adminService.getUsers(filters)),
        getUserById: (id) => handleRequest(() => adminService.getUserById(id)),
        updateUser: (id, data) => handleRequest(
            () => adminService.updateUser(id, data),
            'Utilisateur mis à jour'
        ),
        deleteUser: (id) => handleRequest(
            () => adminService.deleteUser(id),
            'Utilisateur supprimé'
        ),

        // Pronostics - CORRECTION: ces fonctions n'étaient pas exportées
        getAllPronostics: (filters) => handleRequest(() => adminService.getAllPronostics(filters)),
        createPronostic: (data) => handleRequest(
            () => adminService.createPronostic(data),
            'Pronostic créé avec succès'
        ),
        updatePronostic: (id, data) => handleRequest(
            () => adminService.updatePronostic(id, data),
            'Pronostic mis à jour'
        ),
        deletePronostic: (id) => handleRequest(
            () => adminService.deletePronostic(id),
            'Pronostic supprimé'
        ),
        publishPronostic: (id) => handleRequest(
            () => adminService.publishPronostic(id),
            'Pronostic publié'
        ),
        unpublishPronostic: (id) => handleRequest(
            () => adminService.unpublishPronostic(id),
            'Pronostic dépublié'
        ),
        updatePronosticResult: (id, result) => handleRequest(
            () => adminService.updatePronosticResult(id, result),
            'Résultat mis à jour'
        ),

        // Statistiques pronostics
        getGlobalStats: () => handleRequest(() => adminService.getGlobalStats()),
        getTodayPronostics: () => handleRequest(() => adminService.getTodayPronostics()),

        // Abonnements
        getAllSubscriptions: (filters) => handleRequest(() => adminService.getAllSubscriptions(filters)),
        cancelSubscription: (id) => handleRequest(
            () => adminService.cancelSubscription(id),
            'Abonnement annulé'
        ),

        // Paiements
        getPayments: (filters) => handleRequest(() => adminService.getPayments(filters)),

        // Système
        getSecurityLogs: (filters) => handleRequest(() => adminService.getSecurityLogs(filters)),
        toggleMaintenanceMode: () => handleRequest(
            () => adminService.toggleMaintenanceMode(),
            'Mode maintenance modifié'
        )
    };
};

// Hook spécialisé pour les données du dashboard
export const useDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                const response = await adminService.getDashboardStats();
                setStats(response.data || response);
            } catch (error) {
                console.error('Erreur dashboard:', error);
                // Fournir des données par défaut en cas d'erreur
                setStats({
                    totalUsers: 0,
                    activeSubscriptions: 0,
                    monthlyRevenue: 0,
                    monthlyPronostics: 0,
                    conversionRate: 0,
                    successRate: 0,
                    averageROI: 0
                });
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
        // Rafraîchir toutes les 5 minutes (mais pas en boucle)
        const interval = setInterval(fetchStats, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, []); // ← CORRECTION: Pas de dépendances pour éviter la boucle

    const refresh = () => {
        setLoading(true);
        // Re-déclencher le fetch
        adminService.getDashboardStats()
            .then(response => setStats(response.data || response))
            .catch(error => {
                console.error('Erreur refresh dashboard:', error);
                setStats({
                    totalUsers: 0,
                    activeSubscriptions: 0,
                    monthlyRevenue: 0,
                    monthlyPronostics: 0,
                    conversionRate: 0,
                    successRate: 0,
                    averageROI: 0
                });
            })
            .finally(() => setLoading(false));
    };

    return { stats, loading, refresh };
};