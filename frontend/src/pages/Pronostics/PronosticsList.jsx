// src/pages/Pronostics/PronosticsList.jsx - VERSION AVEC TOGGLE HISTORIQUE
import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { toast } from 'react-hot-toast';

const PronosticsList = () => {
    const { isAuthenticated, user } = useAuth();
    const [searchParams, setSearchParams] = useSearchParams();

    const [pronostics, setPronostics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedPeriod, setSelectedPeriod] = useState('week');

    // ✨ NOUVEAU : Toggle À venir / Historique
    const [viewMode, setViewMode] = useState(searchParams.get('view') || 'upcoming');

    // ✨ NOUVEAU : Stats pour l'historique
    const [historyStats, setHistoryStats] = useState({
        totalBets: 0,
        wonBets: 0,
        winRate: 0,
        totalProfit: 0,
        roi: 0
    });

    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        total: 0,
        limit: 50
    });

    // Filtres - ✨ MODIFIÉ pour prendre en compte le viewMode
    const [filters, setFilters] = useState({
        sport: searchParams.get('sport') || '',
        status: searchParams.get('status') || '',
        priority: searchParams.get('priority') || '',
        league: searchParams.get('league') || '',
        upcoming: searchParams.get('upcoming') || (viewMode === 'upcoming' ? 'true' : ''),
        dateFrom: searchParams.get('dateFrom') || '',
        dateTo: searchParams.get('dateTo') || '',
        sort: searchParams.get('sort') || (viewMode === 'upcoming' ? 'date_asc' : 'date_desc')
    });

    const [showFilters, setShowFilters] = useState(false);

    // Fonction pour vérifier l'accès aux pronostics
    const canViewPronostic = (pronostic) => {
        // Si le pronostic est gratuit, tout le monde peut le voir
        if (pronostic.isFree) {
            return true;
        }

        // Si l'utilisateur n'est pas connecté
        if (!isAuthenticated || !user) {
            return false;
        }

        // Si l'utilisateur a un abonnement actif
        if (user.subscriptionStatus === 'active') {
            return true;
        }

        // Si l'utilisateur est admin
        if (user.role === 'admin') {
            return true;
        }

        return false;
    };

    // ✨ NOUVEAU : Récupérer les vraies stats depuis l'API
    const fetchHistoryStats = async () => {
        try {
            const response = await api.get('/pronostics/stats/global');

            if (response.data.success) {
                const stats = response.data.data;
                setHistoryStats({
                    totalBets: stats.totalBets || 0,
                    wonBets: stats.wonBets || 0,
                    winRate: parseFloat(stats.winRate || 0),
                    totalProfit: stats.totalProfit || 0,
                    roi: parseFloat(stats.roi || 0)
                });
            }
        } catch (err) {
            console.error('Erreur lors du chargement des stats:', err);
            setHistoryStats({
                totalBets: 0,
                wonBets: 0,
                winRate: 0,
                totalProfit: 0,
                roi: 0
            });
        }
    };

    // ✨ MODIFIÉ pour inclure les stats
    useEffect(() => {
        fetchPronostics();

        // Récupérer les stats pour l'historique
        if (viewMode === 'history') {
            fetchHistoryStats();
        }
    }, [pagination.currentPage, filters, selectedPeriod, viewMode]);

    const fetchPronostics = async () => {
        try {
            setLoading(true);
            setError(null);

            const params = {
                page: pagination.currentPage,
                limit: pagination.limit,
                ...filters
            };

            // ✨ NOUVEAU : Gestion des filtres selon le mode
            if (viewMode === 'upcoming') {
                // Mode "À venir" : garder upcoming = true
                params.upcoming = 'true';
            } else {
                // Mode "Historique" : supprimer upcoming pour avoir tous les résultats
                delete params.upcoming;
            }

            // Ajouter les filtres de période
            if (selectedPeriod === 'week') {
                const today = new Date();
                if (viewMode === 'upcoming') {
                    const nextWeek = new Date();
                    nextWeek.setDate(today.getDate() + 7);
                    params.dateFrom = today.toISOString().split('T')[0];
                    params.dateTo = nextWeek.toISOString().split('T')[0];
                } else {
                    // Pour l'historique : 7 derniers jours
                    const lastWeek = new Date();
                    lastWeek.setDate(today.getDate() - 7);
                    params.dateFrom = lastWeek.toISOString().split('T')[0];
                    params.dateTo = today.toISOString().split('T')[0];
                }
            } else if (selectedPeriod === 'month') {
                const today = new Date();
                if (viewMode === 'upcoming') {
                    const nextMonth = new Date();
                    nextMonth.setMonth(today.getMonth() + 1);
                    params.dateFrom = today.toISOString().split('T')[0];
                    params.dateTo = nextMonth.toISOString().split('T')[0];
                } else {
                    // Pour l'historique : 30 derniers jours
                    const lastMonth = new Date();
                    lastMonth.setDate(today.getDate() - 30);
                    params.dateFrom = lastMonth.toISOString().split('T')[0];
                    params.dateTo = today.toISOString().split('T')[0];
                }
            }

            // Nettoyer les paramètres vides
            Object.keys(params).forEach(key => {
                if (!params[key]) delete params[key];
            });

            const response = await api.get('/pronostics', { params });

            if (response.data.success) {
                let pronostics = response.data.data.pronostics || [];

                // ✨ NOUVEAU : Filtrage côté frontend pour l'historique
                if (viewMode === 'history') {
                    // Ne garder que les paris terminés (non pending)
                    pronostics = pronostics.filter(p =>
                        ['won', 'lost', 'void', 'push'].includes(p.result)
                    );
                }

                setPronostics(pronostics);
                setPagination(prev => ({
                    ...prev,
                    currentPage: response.data.data.pagination?.currentPage || 1,
                    totalPages: response.data.data.pagination?.totalPages || 1,
                    total: response.data.data.pagination?.total || 0
                }));
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Erreur lors du chargement des pronostics';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // ✨ NOUVEAU : Changer le mode de vue
    const changeViewMode = (mode) => {
        setViewMode(mode);

        // Mettre à jour les filtres selon le mode
        const newFilters = { ...filters };
        if (mode === 'upcoming') {
            newFilters.upcoming = 'true';
            newFilters.sort = 'date_asc';
            // Réinitialiser le filtre status pour upcoming
            newFilters.status = '';
        } else {
            delete newFilters.upcoming;
            newFilters.sort = 'date_desc';
        }
        setFilters(newFilters);

        // Mettre à jour l'URL
        const params = new URLSearchParams(searchParams);
        params.set('view', mode);
        setSearchParams(params);

        setPagination(prev => ({ ...prev, currentPage: 1 }));
    };

    const updateFilters = (newFilters) => {
        const updatedFilters = { ...filters, ...newFilters };
        setFilters(updatedFilters);

        // Mettre à jour l'URL
        const params = new URLSearchParams();
        params.set('view', viewMode);
        Object.keys(updatedFilters).forEach(key => {
            if (updatedFilters[key]) {
                params.set(key, updatedFilters[key]);
            }
        });
        setSearchParams(params);

        setPagination(prev => ({ ...prev, currentPage: 1 }));
    };

    const resetFilters = () => {
        const newFilters = {
            sport: '',
            status: '',
            priority: '',
            league: '',
            upcoming: viewMode === 'upcoming' ? 'true' : '',
            dateFrom: '',
            dateTo: '',
            sort: viewMode === 'upcoming' ? 'date_asc' : 'date_desc'
        };
        setFilters(newFilters);

        const params = new URLSearchParams();
        params.set('view', viewMode);
        setSearchParams(params);

        setPagination(prev => ({ ...prev, currentPage: 1 }));
    };

    // ✨ NOUVEAU : Composant Stats Historique (📍 TU PEUX MODIFIER ICI)
    const HistoryStats = () => (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-4">
                📊 Statistiques globales de l'historique
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {historyStats.totalBets}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-slate-400">
                        Paris terminés
                    </div>
                </div>

                <div className="text-center">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {historyStats.winRate.toFixed(1)}%
                    </div>
                    <div className="text-sm text-gray-600 dark:text-slate-400">
                        Taux de réussite
                    </div>
                </div>

                <div className="text-center">
                    <div className={`text-2xl font-bold ${
                        historyStats.totalProfit >= 0
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-red-600 dark:text-red-400'
                    }`}>
                        {historyStats.totalProfit >= 0 ? '+' : ''}{historyStats.totalProfit.toFixed(2)}€
                    </div>
                    <div className="text-sm text-gray-600 dark:text-slate-400">
                        Profit total
                    </div>
                </div>

                <div className="text-center">
                    <div className={`text-2xl font-bold ${
                        historyStats.roi >= 0
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-red-600 dark:text-red-400'
                    }`}>
                        {historyStats.roi >= 0 ? '+' : ''}{historyStats.roi.toFixed(1)}%
                    </div>
                    <div className="text-sm text-gray-600 dark:text-slate-400">
                        ROI
                    </div>
                </div>
            </div>

            <div className="mt-4 text-center">
                <p className="text-sm text-gray-600 dark:text-slate-400">
                    {historyStats.wonBets} paris gagnés sur {historyStats.totalBets} terminés
                </p>
            </div>
        </div>
    );

    // Organiser les pronostics par date - ✨ MODIFIÉ pour l'ordre historique
    const organizeByDate = () => {
        const grouped = pronostics.reduce((acc, pronostic) => {
            const date = new Date(pronostic.matchDate).toDateString();
            if (!acc[date]) {
                acc[date] = [];
            }
            acc[date].push(pronostic);
            return acc;
        }, {});

        // ✨ NOUVEAU : Trier les dates selon le mode
        const sortedDates = Object.keys(grouped).sort((a, b) => {
            if (viewMode === 'history') {
                // Pour l'historique : plus récent en premier (ordre décroissant)
                return new Date(b) - new Date(a);
            } else {
                // Pour "À venir" : plus proche en premier (ordre croissant)
                return new Date(a) - new Date(b);
            }
        });

        return sortedDates.map(date => ({
            date,
            pronostics: grouped[date].sort((a, b) => {
                if (viewMode === 'history') {
                    // Pour l'historique : plus récent en premier dans la même journée
                    return new Date(b.matchDate) - new Date(a.matchDate);
                } else {
                    // Pour "À venir" : plus tôt en premier dans la même journée
                    return new Date(a.matchDate) - new Date(b.matchDate);
                }
            })
        }));
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const today = new Date();
        const tomorrow = new Date();
        tomorrow.setDate(today.getDate() + 1);

        if (date.toDateString() === today.toDateString()) {
            return 'Aujourd\'hui';
        } else if (date.toDateString() === tomorrow.toDateString()) {
            return 'Demain';
        }

        return date.toLocaleDateString('fr-FR', {
            weekday: 'long',
            day: 'numeric',
            month: 'long'
        });
    };

    const formatTime = (dateString) => {
        return new Date(dateString).toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusBadge = (result) => {
        const config = {
            'pending': { label: 'En cours', class: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300', icon: '⏳' },
            'won': { label: 'Gagné', class: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300', icon: '✅' },
            'lost': { label: 'Perdu', class: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300', icon: '❌' },
            'void': { label: 'Annulé', class: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300', icon: '⚪' },
            'push': { label: 'Nul', class: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300', icon: '🔄' }
        };

        const { label, class: className, icon } = config[result] || config['pending'];
        return (
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${className}`}>
                <span className="mr-1">{icon}</span>
                {label}
            </span>
        );
    };

    const getSportIcon = (sport) => {
        const icons = {
            'football': '⚽',
            'tennis': '🎾',
            'basketball': '🏀',
            'handball': '🤾',
            'volleyball': '🏐',
            'other': '🏆'
        };
        return icons[sport] || icons['other'];
    };

    const getSportColor = (sport) => {
        const colors = {
            'football': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
            'tennis': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
            'basketball': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
            'handball': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
            'volleyball': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
            'other': 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
        };
        return colors[sport] || colors['other'];
    };

    const TimelinePronosticCard = ({ pronostic }) => {
        const canView = canViewPronostic(pronostic);

        return (
            <div className="flex items-start space-x-4 p-4 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg hover:shadow-md transition-all duration-200">
                {/* Heure et sport */}
                <div className="flex-shrink-0 text-center">
                    <div className="text-lg font-bold text-gray-900 dark:text-slate-100">
                        {formatTime(pronostic.matchDate)}
                    </div>
                    <div className="text-2xl">{getSportIcon(pronostic.sport)}</div>
                    <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getSportColor(pronostic.sport)} mt-1`}>
                        {pronostic.sport?.charAt(0).toUpperCase() + pronostic.sport?.slice(1)}
                    </span>
                </div>

                {/* Contenu principal */}
                <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                        <div>
                            <h3 className="font-bold text-lg text-gray-900 dark:text-slate-100">
                                {pronostic.homeTeam} <span className="text-gray-400 dark:text-slate-500">vs</span> {pronostic.awayTeam}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-slate-400">{pronostic.league}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                            {getStatusBadge(pronostic.result)}
                            {pronostic.isFree && (
                                <span className="px-2 py-1 bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300 rounded text-xs font-medium">
                                    🆓 Gratuit
                                </span>
                            )}
                            {!pronostic.isFree && (
                                <span className="px-2 py-1 bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300 rounded text-xs font-medium">
                                    💎 Premium
                                </span>
                            )}
                            {pronostic.priority === 'high' && (
                                <span className="text-lg">🔥</span>
                            )}
                        </div>
                    </div>

                    {/* Pronostic et détails */}
                    {canView && pronostic.prediction ? (
                        <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-3 mb-3">
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-xs font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wide">
                                    {pronostic.predictionType?.replace('_', ' ')}
                                </span>
                                <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                                    {pronostic.confidence}% confiance
                                </span>
                            </div>
                            <p className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                                {pronostic.prediction}
                            </p>
                            <div className="flex items-center space-x-4 text-sm">
                                <span className="text-blue-700 dark:text-blue-300">
                                    Cote: <strong>{pronostic.odds}</strong>
                                </span>
                                {/*} <span className="text-blue-700 dark:text-blue-300">
                                    Mise: <strong>{pronostic.stake}/10</strong>
                                </span> */}
                            </div>
                            {pronostic.analysis && (
                                <div className="mt-2 text-sm text-blue-800 dark:text-blue-200">
                                    <p className="font-medium mb-1">Analyse:</p>
                                    <p className="text-xs">{pronostic.analysis.substring(0, 150)}...</p>
                                </div>
                            )}
                        </div>
                    ) : canView && !pronostic.prediction ? (
                        <div className="bg-yellow-50 dark:bg-yellow-900/30 rounded-lg p-3 mb-3">
                            <div className="flex items-center justify-center text-yellow-600 dark:text-yellow-400">
                                <span className="text-sm">⚠️ Pronostic en cours de préparation</span>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-gray-100 dark:bg-slate-700 rounded-lg p-3 mb-3">
                            <div className="flex items-center justify-center text-gray-500 dark:text-slate-400">
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                                <span className="text-sm">Pronostic premium - Abonnement requis</span>
                            </div>
                        </div>
                    )}

                    {/* Résultat si terminé */}
                    {pronostic.result !== 'pending' && pronostic.actualResult && (
                        <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-3 mb-3">
                            <p className="text-xs text-gray-600 dark:text-slate-400 mb-1">Résultat final</p>
                            <p className="font-medium text-gray-900 dark:text-slate-100">{pronostic.actualResult}</p>

                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center space-x-3">
                        {canView ? (
                            <Link
                                to={`/pronostics/${pronostic._id}`}
                                className="btn btn-outline btn-sm"
                            >
                                Voir le détail →
                            </Link>
                        ) : (
                            <>
                                <span className="text-sm text-gray-500 dark:text-slate-400">Abonnement requis</span>
                                <Link to="/pricing" className="btn btn-primary btn-sm">
                                    💎 S'abonner
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    const groupedPronostics = organizeByDate();

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-8">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header avec contrôles */}
                <div className="mb-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100 mb-2">
                                {viewMode === 'upcoming' ? '📅 Planning des pronostics' : '📊 Historique des pronostics'}
                            </h1>
                            <p className="text-gray-600 dark:text-slate-400">
                                {pagination.total} pronostic{pagination.total > 1 ? 's' : ''} •
                                {viewMode === 'upcoming' ? ' Vue organisée par dates' : ' Résultats passés'}
                            </p>
                        </div>

                        <div className="mt-4 md:mt-0 flex flex-wrap items-center gap-3">
                            {/* ✨ NOUVEAU : Toggle À venir / Historique - Style épuré et cohérent */}
                            <div className="inline-flex bg-gray-100 dark:bg-slate-700 rounded-lg p-1 shadow-sm">
                                {[
                                    { key: 'upcoming', label: 'À venir', icon: '📅' },
                                    { key: 'history', label: 'Historique', icon: '📊' }
                                ].map(view => (
                                    <button
                                        key={view.key}
                                        onClick={() => changeViewMode(view.key)}
                                        className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                                            viewMode === view.key
                                                ? 'bg-white dark:bg-slate-600 text-blue-600 dark:text-blue-400 shadow-sm'
                                                : 'text-gray-600 dark:text-slate-300 hover:text-gray-900 dark:hover:text-slate-100'
                                        }`}
                                    >
                                        <span className="mr-2">{view.icon}</span>
                                        {view.label}
                                    </button>
                                ))}
                            </div>

                            {/* Sélecteur de période - Style cohérent */}
                            <div className="inline-flex bg-gray-100 dark:bg-slate-700 rounded-lg p-1 shadow-sm">
                                {[
                                    { key: 'week', label: '7 jours', icon: '📅' },
                                    { key: 'month', label: '30 jours', icon: '🗓️' },
                                    { key: 'all', label: 'Tous', icon: '📊' }
                                ].map(period => (
                                    <button
                                        key={period.key}
                                        onClick={() => setSelectedPeriod(period.key)}
                                        className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                                            selectedPeriod === period.key
                                                ? 'bg-white dark:bg-slate-600 text-gray-900 dark:text-slate-100 shadow-sm'
                                                : 'text-gray-600 dark:text-slate-300 hover:text-gray-900 dark:hover:text-slate-100'
                                        }`}
                                    >
                                        <span className="mr-1.5">{period.icon}</span>
                                        {period.label}
                                    </button>
                                ))}
                            </div>

                            {/* Bouton Filtres - Style cohérent */}
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 shadow-sm ${
                                    showFilters
                                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800'
                                        : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-600'
                                }`}
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                                </svg>
                                Filtres
                                <svg className={`w-3 h-3 ml-1.5 transition-transform duration-200 ${showFilters ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {!isAuthenticated && (
                                <Link to="/register" className="btn btn-primary">
                                    Inscription gratuite
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Filtres rapides */}
                    <div className="flex flex-wrap gap-2 mb-4">
                        {['football', 'tennis', 'basketball'].map(sport => (
                            <button
                                key={sport}
                                onClick={() => updateFilters({ sport: filters.sport === sport ? '' : sport })}
                                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                                    filters.sport === sport
                                        ? getSportColor(sport)
                                        : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-slate-600'
                                }`}
                            >
                                <span className="mr-1">{getSportIcon(sport)}</span>
                                {sport.charAt(0).toUpperCase() + sport.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Filtres détaillés */}
                {showFilters && (
                    <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg shadow p-6 mb-8">
                        <div className="grid md:grid-cols-4 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Sport</label>
                                <select
                                    value={filters.sport}
                                    onChange={(e) => updateFilters({ sport: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Tous les sports</option>
                                    <option value="football">Football</option>
                                    <option value="tennis">Tennis</option>
                                    <option value="basketball">Basketball</option>
                                    <option value="handball">Handball</option>
                                    <option value="volleyball">Volleyball</option>
                                    <option value="other">Autres</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Statut</label>
                                <select
                                    value={filters.status}
                                    onChange={(e) => updateFilters({ status: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Tous les statuts</option>
                                    <option value="pending">En cours</option>
                                    <option value="won">Gagnés</option>
                                    <option value="lost">Perdus</option>
                                    <option value="void">Annulés</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Priorité</label>
                                <select
                                    value={filters.priority}
                                    onChange={(e) => updateFilters({ priority: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Toutes les priorités</option>
                                    <option value="high">🔥 Haute</option>
                                    <option value="medium">⭐ Moyenne</option>
                                    <option value="low">📍 Faible</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Affichage</label>
                                <select
                                    value={filters.upcoming}
                                    onChange={(e) => updateFilters({ upcoming: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Tous les matchs</option>
                                    <option value="true">Matchs à venir</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            <button
                                onClick={resetFilters}
                                className="text-sm text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-200 transition-colors"
                            >
                                Réinitialiser les filtres
                            </button>
                        </div>
                    </div>
                )}

                {/* ✨ NOUVEAU : Affichage des stats pour l'historique */}
                {viewMode === 'history' && <HistoryStats />}

                {/* Message pour utilisateurs non abonnés (sauf admin) */}
                {isAuthenticated && user?.subscriptionStatus !== 'active' && user?.role !== 'admin' && (
                    <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-8">
                        <div className="flex items-center">
                            <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div className="flex-1">
                                <p className="text-blue-800 dark:text-blue-200 font-medium">Accès limité aux pronostics gratuits</p>
                                <p className="text-blue-700 dark:text-blue-300 text-sm">Abonnez-vous pour accéder à tous nos pronostics premium</p>
                            </div>
                            <Link to="/pricing" className="btn btn-primary ml-4">
                                Voir les plans
                            </Link>
                        </div>
                    </div>
                )}

                {/* Timeline des pronostics */}
                {loading ? (
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-gray-300 dark:border-slate-600 border-t-blue-600 mb-4"></div>
                        <p className="text-gray-600 dark:text-slate-400">Chargement du planning...</p>
                    </div>
                ) : error ? (
                    <div className="text-center py-12">
                        <div className="text-red-600 dark:text-red-400 mb-4">
                            <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="font-medium">{error}</p>
                        </div>
                        <button onClick={fetchPronostics} className="btn btn-outline">
                            Réessayer
                        </button>
                    </div>
                ) : groupedPronostics.length > 0 ? (
                    <div className="space-y-8">
                        {groupedPronostics.map(({ date, pronostics }) => (
                            <div key={date} className="space-y-4">
                                {/* Header de date */}
                                <div className="sticky top-4 z-10">
                                    <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg px-6 py-3 shadow-sm">
                                        <div className="flex items-center justify-between">
                                            <h2 className="text-xl font-bold text-gray-900 dark:text-slate-100">
                                                {formatDate(date)}
                                            </h2>
                                            <span className="text-sm text-gray-600 dark:text-slate-400 bg-gray-100 dark:bg-slate-700 px-3 py-1 rounded-full">
                                                {pronostics.length} pronostic{pronostics.length > 1 ? 's' : ''}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Liste des pronostics du jour */}
                                <div className="space-y-3 pl-4">
                                    {pronostics.map((pronostic) => (
                                        <TimelinePronosticCard key={pronostic._id} pronostic={pronostic} />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <div className="text-gray-500 dark:text-slate-400">
                            <div className="text-6xl mb-4">📅</div>
                            <p className="font-medium mb-2 text-gray-900 dark:text-slate-100">Aucun pronostic trouvé</p>
                            <p className="text-sm">Modifiez vos filtres ou changez la période d'affichage</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PronosticsList;