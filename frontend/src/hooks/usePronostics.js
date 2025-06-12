// src/hooks/usePronostics.js
// 🎣 Hook personnalisé pour gérer les pronostics depuis votre API

import { useState, useEffect, useCallback } from 'react';
import { pronosticService } from '../services/pronostic.service';
import { toast } from 'react-hot-toast';

// Hook principal pour les pronostics
export const usePronostics = (filters = {}) => {
    const [pronostics, setPronostics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        total: 0,
        limit: 10
    });

    const fetchPronostics = useCallback(async (newFilters = {}) => {
        try {
            setLoading(true);
            setError(null);

            const params = { ...filters, ...newFilters };
            const response = await pronosticService.getPronostics(params);

            setPronostics(response.pronostics || []);
            setPagination({
                currentPage: response.currentPage || 1,
                totalPages: response.totalPages || 1,
                total: response.total || 0,
                limit: response.limit || 10
            });
        } catch (err) {
            setError(err.message || 'Erreur lors du chargement des pronostics');
            toast.error('Impossible de charger les pronostics');
        } finally {
            setLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        fetchPronostics();
    }, [fetchPronostics]);

    return {
        pronostics,
        loading,
        error,
        pagination,
        refetch: fetchPronostics
    };
};

// Hook spécialisé pour les pronostics gratuits
export const useFreePronostics = (limit = 6) => {
    const [freePronostics, setFreePronostics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchFreePronostics = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await pronosticService.getFreePronostics({ limit });
            setFreePronostics(response.pronostics || []);
        } catch (err) {
            setError(err.message || 'Erreur lors du chargement des pronostics gratuits');
            console.error('Erreur pronostics gratuits:', err);

            // En cas d'erreur, on peut afficher des données mock ou rien
            setFreePronostics([]);
        } finally {
            setLoading(false);
        }
    }, [limit]);

    useEffect(() => {
        fetchFreePronostics();
    }, [fetchFreePronostics]);

    return {
        freePronostics,
        loading,
        error,
        refetch: fetchFreePronostics
    };
};

// Hook pour les statistiques globales
export const usePronosticsStats = () => {
    const [stats, setStats] = useState({
        totalBets: 0,
        wonBets: 0,
        winRate: 0,
        roi: 0,
        totalStake: 0,
        totalProfit: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                const response = await pronosticService.getGlobalStats();
                setStats(response.stats || stats);
            } catch (err) {
                setError(err.message);
                console.error('Erreur stats:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    return { stats, loading, error };
};

// Hook pour un pronostic individuel
export const usePronostic = (id) => {
    const [pronostic, setPronostic] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!id) return;

        const fetchPronostic = async () => {
            try {
                setLoading(true);
                const response = await pronosticService.getPronosticById(id);
                setPronostic(response.pronostic);

                // Incrémenter les vues
                await pronosticService.incrementViews(id);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPronostic();
    }, [id]);

    return { pronostic, loading, error };
};

// Hook pour les pronostics du jour
export const useTodayPronostics = () => {
    const [todayPronostics, setTodayPronostics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTodayPronostics = async () => {
            try {
                setLoading(true);
                const response = await pronosticService.getTodayPronostics();
                setTodayPronostics(response.pronostics || []);
            } catch (err) {
                setError(err.message);
                setTodayPronostics([]);
            } finally {
                setLoading(false);
            }
        };

        fetchTodayPronostics();
    }, []);

    return { todayPronostics, loading, error };
};

// Hook pour la recherche
export const usePronosticsSearch = () => {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const search = useCallback(async (query, filters = {}) => {
        if (!query.trim()) {
            setResults([]);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const response = await pronosticService.searchPronostics(query, filters);
            setResults(response.pronostics || []);
        } catch (err) {
            setError(err.message);
            setResults([]);
        } finally {
            setLoading(false);
        }
    }, []);

    const clearSearch = useCallback(() => {
        setResults([]);
        setError(null);
    }, []);

    return {
        results,
        loading,
        error,
        search,
        clearSearch
    };
};

// Hook pour les pronostics tendances
export const useTrendingPronostics = (limit = 5) => {
    const [trending, setTrending] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTrending = async () => {
            try {
                const response = await pronosticService.getTrendingPronostics(limit);
                setTrending(response.pronostics || []);
            } catch (err) {
                console.error('Erreur trending:', err);
                setTrending([]);
            } finally {
                setLoading(false);
            }
        };

        fetchTrending();
    }, [limit]);

    return { trending, loading };
};

// Hook utilitaire pour le refresh automatique
export const useAutoRefresh = (callback, interval = 60000) => { // 1 minute par défaut
    useEffect(() => {
        const intervalId = setInterval(callback, interval);
        return () => clearInterval(intervalId);
    }, [callback, interval]);
};