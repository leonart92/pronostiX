// src/pages/Pronostics/PronosticDetail.jsx - SANS ÉTOILES
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { toast } from 'react-hot-toast';

const PronosticDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated, user } = useAuth();

    const [pronostic, setPronostic] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [relatedPronostics, setRelatedPronostics] = useState([]);

    // 💰 État pour le calculateur de profit
    const [userStake, setUserStake] = useState(100); // Mise par défaut

    useEffect(() => {
        if (id) {
            fetchPronostic();
        }
    }, [id]);

    const fetchPronostic = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await api.get(`/pronostics/${id}`);

            if (response.data.success) {
                setPronostic(response.data.data.pronostic);
                fetchRelatedPronostics(response.data.data.pronostic);
            }
        } catch (err) {
            if (err.response?.status === 404) {
                setError('Pronostic non trouvé');
            } else if (err.response?.status === 403) {
                setError('Vous devez être abonné pour voir ce pronostic');
            } else {
                setError('Erreur lors du chargement du pronostic');
            }
            console.error('Erreur fetch pronostic:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchRelatedPronostics = async (currentPronostic) => {
        try {
            const response = await api.get('/pronostics', {
                params: {
                    sport: currentPronostic.sport,
                    limit: 4,
                    exclude: currentPronostic._id
                }
            });

            if (response.data.success) {
                setRelatedPronostics(response.data.data.pronostics || []);
            }
        } catch (err) {
            console.error('Erreur fetch pronostics similaires:', err);
        }
    };

    const canViewPronostic = () => {
        if (!pronostic) return false;
        if (pronostic.isFree) return true;
        if (isAuthenticated && user?.subscriptionStatus === 'active') return true;
        return false;
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = (date - now) / (1000 * 60 * 60);

        if (diffInHours > 0 && diffInHours < 24) {
            return `Aujourd'hui à ${date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit',timeZone: 'Europe/Paris'})}`;
        } else if (diffInHours >= 24 && diffInHours < 48) {
            return `Demain à ${date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Paris'})}`;
        }

        return date.toLocaleDateString('fr-FR', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            hour: '2-digit',
            minute: '2-digit',
            timeZone: 'Europe/Paris'
        });
    };

    const getStatusBadge = (result) => {
        const config = {
            'pending': {
                label: 'En cours',
                class: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
                icon: '⏳'
            },
            'won': {
                label: 'Gagné',
                class: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
                icon: '✅'
            },
            'lost': {
                label: 'Perdu',
                class: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
                icon: '❌'
            },
            'void': {
                label: 'Annulé',
                class: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
                icon: '⚪'
            },
            'push': {
                label: 'Nul',
                class: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
                icon: '🔄'
            }
        };

        const { label, class: className, icon } = config[result] || config['pending'];
        return (
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${className}`}>
                <span className="mr-2">{icon}</span>
                {label}
            </span>
        );
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

    const getConfidenceColor = (confidence) => {
        if (confidence >= 90) return 'text-emerald-600 dark:text-emerald-400';
        if (confidence >= 80) return 'text-green-600 dark:text-green-400';
        if (confidence >= 70) return 'text-blue-600 dark:text-blue-400';
        if (confidence >= 60) return 'text-yellow-600 dark:text-yellow-400';
        return 'text-red-600 dark:text-red-400';
    };

    // 💰 Fonction pour calculer le profit avec la mise de l'utilisateur
    const calculateUserProfit = (odds, stake) => {
        return ((odds - 1) * stake).toFixed(2);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-gray-300 dark:border-slate-600 border-t-blue-600 mb-4"></div>
                    <p className="text-gray-600 dark:text-slate-400">Chargement du pronostic...</p>
                </div>
            </div>
        );
    }

    if (error || !pronostic) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900">
                <div className="text-center max-w-md mx-auto px-4">
                    <div className="text-6xl mb-4">⚠️</div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-2">
                        {error || 'Pronostic non trouvé'}
                    </h1>
                    <p className="text-gray-600 dark:text-slate-400 mb-6">
                        {error === 'Vous devez être abonné pour voir ce pronostic' ? (
                            <>Ce pronostic est réservé aux abonnés Premium</>
                        ) : (
                            <>Le pronostic demandé n'existe pas ou n'est plus disponible</>
                        )}
                    </p>
                    <div className="space-x-4">
                        {error === 'Vous devez être abonné pour voir ce pronostic' ? (
                            <Link to="/pricing" className="btn btn-primary">
                                Voir les abonnements
                            </Link>
                        ) : (
                            <Link to="/pronostics" className="btn btn-primary">
                                Voir tous les pronostics
                            </Link>
                        )}
                        <button onClick={() => navigate(-1)} className="btn btn-outline">
                            Retour
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const canView = canViewPronostic();

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-8">
            <div className="container-custom">
                {/* Breadcrumb */}
                <nav className="flex items-center space-x-2 text-sm text-gray-600 dark:text-slate-400 mb-6">
                    <Link to="/" className="hover:text-blue-600 dark:hover:text-blue-400">Accueil</Link>
                    <span>›</span>
                    <Link to="/pronostics" className="hover:text-blue-600 dark:hover:text-blue-400">Pronostics</Link>
                    <span>›</span>
                    <span className="text-gray-900 dark:text-slate-100">{pronostic.homeTeam} vs {pronostic.awayTeam}</span>
                </nav>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Contenu principal */}
                    <div className="lg:col-span-2">
                        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg shadow-sm p-6 mb-6">

                            {/* Header du pronostic */}
                            <div className="border-b border-gray-200 dark:border-slate-700 pb-6 mb-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center space-x-3">
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSportColor(pronostic.sport)}`}>
                                            {pronostic.sport?.charAt(0).toUpperCase() + pronostic.sport?.slice(1)}
                                        </span>
                                        {pronostic.isFree && (
                                            <span className="px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 rounded-full text-sm font-medium">
                                                Gratuit
                                            </span>
                                        )}
                                        {pronostic.priority === 'high' && (
                                            <span className="px-3 py-1 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 rounded-full text-sm font-medium">
                                                🔥 Priorité haute
                                            </span>
                                        )}
                                    </div>
                                    {getStatusBadge(pronostic.result)}
                                </div>

                                <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100 mb-2">
                                    {pronostic.homeTeam} vs {pronostic.awayTeam}
                                </h1>

                                <div className="flex flex-col md:flex-row md:items-center md:justify-between text-gray-600 dark:text-slate-400">
                                    <div>
                                        <p className="text-lg font-medium">{pronostic.league}</p>
                                        <p className="text-sm">{formatDate(pronostic.matchDate)}</p>
                                    </div>
                                    <div className="mt-2 md:mt-0 text-right">
                                        <p className="text-sm text-gray-500 dark:text-slate-500">Publié le {new Date(pronostic.createdAt).toLocaleDateString('fr-FR')}</p>
                                        {pronostic.views && <p className="text-sm text-gray-500 dark:text-slate-500">{pronostic.views} vues</p>}
                                    </div>
                                </div>
                            </div>

                            {/* Section Pronostic principal - SANS ÉTOILES */}
                            {canView && pronostic.prediction && (
                                <div className="mb-6">
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-slate-100 mb-4">Notre pronostic</h3>
                                    <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-sm font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wide">
                                                {pronostic.predictionType?.replace('_', ' ')}
                                            </span>
                                            <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                                                {pronostic.confidence}% confiance
                                            </span>
                                        </div>
                                        <p className="text-lg font-bold text-blue-900 dark:text-blue-100 mb-4">
                                            {pronostic.prediction}
                                        </p>

                                        {/* Section simplifiée avec cote et profit potentiel */}
                                        <div className="flex justify-between items-center pt-3 border-t border-blue-200 dark:border-blue-800">
                                            <div>
                                                <span className="text-blue-700 dark:text-blue-300 text-sm">Cote : </span>
                                                <span className="font-bold text-blue-900 dark:text-blue-100 text-2xl">{pronostic.odds}</span>
                                            </div>

                                            {pronostic.result && pronostic.result !== 'pending' && (
                                                <div className="text-right">
                                                    <div className={`text-lg font-bold ${
                                                        pronostic.result === 'won' ? 'text-green-600 dark:text-green-400' :
                                                            pronostic.result === 'lost' ? 'text-red-600 dark:text-red-400' :
                                                                'text-gray-600 dark:text-gray-400'
                                                    }`}>
                                                        {pronostic.result === 'won' ? '✅ Gagné' :
                                                            pronostic.result === 'lost' ? '❌ Perdu' :
                                                                '🔄 Nul'}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Calculateur de profit personnalisé */}
                            {canView && (
                                <div className="mb-6">
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-slate-100 mb-4">Calculateur de profit</h3>
                                    <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg p-6">
                                        <div className="grid md:grid-cols-3 gap-4 items-end">
                                            <div>
                                                <label className="block text-sm font-medium text-green-700 dark:text-green-300 mb-2">
                                                    Votre mise (€)
                                                </label>
                                                <input
                                                    type="text"
                                                    value={userStake}
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        // Permettre seulement les chiffres et un point décimal
                                                        if (/^\d*\.?\d*$/.test(value) || value === '') {
                                                            const numValue = parseFloat(value) || 0;
                                                            // Limiter à 2 décimales maximum
                                                            if (value === '' || numValue <= 99999.99) {
                                                                setUserStake(value === '' ? 0 : numValue);
                                                            }
                                                        }
                                                    }}
                                                    onBlur={(e) => {
                                                        // Formater à 2 décimales quand on perd le focus
                                                        const value = parseFloat(e.target.value) || 0;
                                                        setUserStake(value);
                                                    }}
                                                    placeholder="10.00"
                                                    className="w-full px-3 py-2 border border-green-300 dark:border-green-700 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                                />
                                            </div>
                                            <div className="text-center">
                                                <p className="text-sm text-green-700 dark:text-green-300 mb-1">Cote</p>
                                                <p className="text-2xl font-bold text-green-900 dark:text-green-100">{pronostic.odds}</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-sm text-green-700 dark:text-green-300 mb-1">Profit potentiel</p>
                                                <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                                                    +{calculateUserProfit(pronostic.odds, userStake)}€
                                                </p>
                                            </div>
                                        </div>
                                        <div className="mt-4 pt-4 border-t border-green-200 dark:border-green-800">
                                            <div className="flex justify-between text-sm text-green-700 dark:text-green-300">
                                                <span>Total récupéré si gagné :</span>
                                                <span className="font-medium">{(userStake * pronostic.odds).toFixed(2)}€</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Détails du pronostic - SIMPLIFIÉ SANS ÉTOILES */}
                            <div className="grid md:grid-cols-2 gap-6 mb-6">
                                <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-6">
                                    <h3 className="font-semibold text-gray-900 dark:text-slate-100 mb-4">Détails du pari</h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-gray-700 dark:text-slate-300">Type:</span>
                                            <span className="font-medium text-gray-900 dark:text-slate-100">{pronostic.predictionType?.replace('_', ' ')}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-700 dark:text-slate-300">Cote:</span>
                                            <span className="font-bold text-lg text-gray-900 dark:text-slate-100">{pronostic.odds}</span>
                                        </div>
                                        {pronostic.bookmaker && (
                                            <div className="flex justify-between">
                                                <span className="text-gray-700 dark:text-slate-300">Bookmaker:</span>
                                                <span className="font-medium text-gray-900 dark:text-slate-100">{pronostic.bookmaker}</span>
                                            </div>
                                        )}
                                        {pronostic.priority === 'high' && (
                                            <div className="flex justify-between">
                                                <span className="text-gray-700 dark:text-slate-300">Priorité:</span>
                                                <span className="font-medium text-red-600 dark:text-red-400">🔥 Haute</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Section Confiance UNIQUE */}
                                <div className="bg-purple-50 dark:bg-purple-900/30 rounded-lg p-6">
                                    <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-4">Niveau de confiance</h3>
                                    <div className="text-center">
                                        <div className={`text-4xl font-bold mb-2 ${getConfidenceColor(pronostic.confidence)}`}>
                                            {pronostic.confidence}%
                                        </div>
                                        <div className="w-full bg-gray-200 dark:bg-slate-600 rounded-full h-3 mb-2">
                                            <div
                                                className={`h-3 rounded-full ${
                                                    pronostic.confidence >= 80 ? 'bg-green-500' :
                                                        pronostic.confidence >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                                                }`}
                                                style={{ width: `${pronostic.confidence}%` }}
                                            ></div>
                                        </div>
                                        <p className="text-sm text-purple-700 dark:text-purple-300">
                                            {pronostic.confidence >= 90 ? 'Très forte confiance' :
                                                pronostic.confidence >= 80 ? 'Forte confiance' :
                                                    pronostic.confidence >= 70 ? 'Bonne confiance' :
                                                        pronostic.confidence >= 60 ? 'Confiance moyenne' : 'Confiance faible'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Résultat si terminé */}
                            {pronostic.actualResult && (
                                <div className={`rounded-lg p-6 mb-6 ${
                                    pronostic.result === 'won' ? 'bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800' :
                                        pronostic.result === 'lost' ? 'bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800' :
                                            'bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800'
                                }`}>
                                    <h3 className={`font-semibold mb-3 ${
                                        pronostic.result === 'won' ? 'text-green-900 dark:text-green-100' :
                                            pronostic.result === 'lost' ? 'text-red-900 dark:text-red-100' :
                                                'text-yellow-900 dark:text-yellow-100'
                                    }`}>
                                        Résultat final
                                    </h3>
                                    <p className="text-gray-900 dark:text-slate-100 mb-2">{pronostic.actualResult}</p>
                                    {userStake > 0 && (
                                        <div className="mt-4 p-3 bg-white dark:bg-slate-800 rounded-lg">
                                            <p className="text-sm text-gray-600 dark:text-slate-400 mb-1">Avec votre mise de {userStake}€ :</p>
                                            <p className={`font-semibold text-lg ${
                                                pronostic.result === 'won' ? 'text-green-600 dark:text-green-400' :
                                                    pronostic.result === 'lost' ? 'text-red-600 dark:text-red-400' :
                                                        'text-gray-600 dark:text-slate-400'
                                            }`}>
                                                {pronostic.result === 'won' ? (
                                                    <>Profit: +{calculateUserProfit(pronostic.odds, userStake)}€</>
                                                ) : pronostic.result === 'lost' ? (
                                                    <>Perte: -{userStake}€</>
                                                ) : (
                                                    <>Mise remboursée: {userStake}€</>
                                                )}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Analyse et raisonnement */}
                            {canView ? (
                                <div className="space-y-6">
                                    {pronostic.analysis && (
                                        <div>
                                            <h3 className="text-xl font-semibold text-gray-900 dark:text-slate-100 mb-4">Analyse détaillée</h3>
                                            <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-6">
                                                <p className="text-gray-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                                                    {pronostic.analysis}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {pronostic.reasoning && (
                                        <div>
                                            <h3 className="text-xl font-semibold text-gray-900 dark:text-slate-100 mb-4">Justification du pronostic</h3>
                                            <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-6">
                                                <p className="text-blue-800 dark:text-blue-200 leading-relaxed">
                                                    {pronostic.reasoning}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {pronostic.tags && pronostic.tags.length > 0 && (
                                        <div>
                                            <h3 className="text-xl font-semibold text-gray-900 dark:text-slate-100 mb-4">Tags</h3>
                                            <div className="flex flex-wrap gap-2">
                                                {pronostic.tags.map((tag, index) => (
                                                    <span
                                                        key={index}
                                                        className="px-3 py-1 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300 rounded-full text-sm"
                                                    >
                                                        #{tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="bg-gray-100 dark:bg-slate-700 rounded-lg p-8 text-center">
                                    <div className="text-4xl mb-4">🔒</div>
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-slate-100 mb-2">Contenu Premium</h3>
                                    <p className="text-gray-600 dark:text-slate-400 mb-4">
                                        L'analyse détaillée et le raisonnement sont réservés aux abonnés
                                    </p>
                                    <Link to="/pricing" className="btn btn-primary">
                                        Voir les abonnements
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Actions */}
                        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg shadow-sm p-6">
                            <h3 className="font-semibold text-gray-900 dark:text-slate-100 mb-4">Actions</h3>
                            <div className="space-y-3">
                                <Link to="/pronostics" className="w-full btn btn-outline">
                                    ← Tous les pronostics
                                </Link>

                                {!isAuthenticated && (
                                    <Link to="/register" className="w-full btn btn-primary">
                                        Inscription gratuite
                                    </Link>
                                )}

                                {isAuthenticated && user?.subscriptionStatus !== 'active' && (
                                    <Link to="/pricing" className="w-full btn bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700">
                                        💎 Devenir Premium
                                    </Link>
                                )}
                            </div>
                        </div>

                        {/* Pronostics similaires */}
                        {relatedPronostics.length > 0 && (
                            <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg shadow-sm p-6">
                                <h3 className="font-semibold text-gray-900 dark:text-slate-100 mb-4">Pronostics similaires</h3>
                                <div className="space-y-3">
                                    {relatedPronostics.map((related) => (
                                        <Link
                                            key={related._id}
                                            to={`/pronostics/${related._id}`}
                                            className="block p-3 bg-gray-50 dark:bg-slate-700 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors"
                                        >
                                            <div className="font-medium text-sm text-gray-900 dark:text-slate-100 mb-1">
                                                {related.homeTeam} vs {related.awayTeam}
                                            </div>
                                            <div className="flex items-center justify-between text-xs text-gray-600 dark:text-slate-400">
                                                <span>{related.league}</span>
                                                <span>Cote: {related.odds}</span>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Avertissement */}
                        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg shadow-sm p-6">
                            <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                                <div className="flex items-start">
                                    <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.348 15.5c-.77.833.192 2.5 1.732 2.5z" />
                                    </svg>
                                    <div>
                                        <p className="text-yellow-800 dark:text-yellow-200 text-sm font-medium mb-1">Pariez responsable</p>
                                        <p className="text-yellow-700 dark:text-yellow-300 text-xs">
                                            Ne pariez que ce que vous pouvez vous permettre de perdre.
                                            Le jeu peut créer une dépendance.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PronosticDetail;