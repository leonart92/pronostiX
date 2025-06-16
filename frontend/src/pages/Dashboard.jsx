// src/pages/Dashboard.jsx - PAGE D'ACCUEIL AVEC VRAIES STATS
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import EmailVerificationBanner from "../components/common/EmailVerificationBanner";

const Dashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalBets: 0,
        wonBets: 0,
        winRate: 0,
        totalProfit: 0,
        roi: 0,
        avgOdds: 0
    });
    const [loading, setLoading] = useState(true);
    const [todayPronostics, setTodayPronostics] = useState([]);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);

            // ✨ MODIFIÉ : Utiliser les vrais endpoints qui existent
            const [statsRes, todayRes] = await Promise.all([
                api.get('/pronostics/stats/global'), // ← Vrai endpoint
                api.get('/pronostics/upcoming/today')  // ← Vrai endpoint
            ]);

            // ✨ MODIFIÉ : Traiter les vraies données avec conversion en nombres
            if (statsRes.data.success) {
                const rawStats = statsRes.data.data || {};
                setStats({
                    totalBets: Number(rawStats.totalBets) || 0,
                    wonBets: Number(rawStats.wonBets) || 0,
                    winRate: parseFloat(rawStats.winRate) || 0,
                    totalProfit: parseFloat(rawStats.totalProfit) || 0,
                    roi: parseFloat(rawStats.roi) || 0,
                    avgOdds: parseFloat(rawStats.avgOdds) || 0
                });
            }

            if (todayRes.data.success) {
                setTodayPronostics(todayRes.data.data?.pronostics || []);
            }
        } catch (error) {
            console.error('Erreur lors du chargement du dashboard:', error);
            // En cas d'erreur, garder les valeurs par défaut
            setStats({
                totalBets: 0,
                wonBets: 0,
                winRate: 0,
                totalProfit: 0,
                roi: 0,
                avgOdds: 0
            });
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
            timeZone:'Europe/Paris'
        });
    };

    const getStatusBadge = (result) => {
        const config = {
            'pending': { label: 'En cours', class: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' },
            'won': { label: 'Gagné ✓', class: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' },
            'lost': { label: 'Perdu ✗', class: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' },
            'void': { label: 'Annulé', class: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300' },
            'push': { label: 'Remboursé', class: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' }
        };

        const { label, class: className } = config[result] || config['pending'];
        return <span className={`px-2 py-1 rounded-full text-xs font-medium ${className}`}>{label}</span>;
    };

    // ✅ Badge d'abonnement amélioré avec CTA
    const getSubscriptionStatusBadge = () => {
        if (!user?.subscriptionStatus || user.subscriptionStatus === 'none') {
            return (
                <div className="flex items-center space-x-3">
                    <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300 rounded-full text-sm font-medium">
                        Compte Gratuit
                    </span>
                    <Link
                        to="/pricing"
                        className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-medium rounded-full hover:from-blue-600 hover:to-purple-700 transition-all flex items-center"
                    >
                        ✨ Passer Premium
                    </Link>
                </div>
            );
        }

        const config = {
            'active': { label: '💎 Premium Actif', class: 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white font-bold' },
            'expired': { label: 'Premium Expiré', class: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' },
            'cancelled': { label: 'Premium Annulé', class: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' }
        };

        const { label, class: className } = config[user.subscriptionStatus] || config['active'];
        return <span className={`px-4 py-2 rounded-full text-sm font-medium ${className}`}>{label}</span>;
    };

    // ✅ Fonction pour message de bienvenue selon l'heure
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Bonjour';
        if (hour < 18) return 'Bon après-midi';
        return 'Bonsoir';
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-slate-400">Chargement de votre dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
            {/* ✅ BANNIÈRE DE VÉRIFICATION EMAIL - TOUJOURS VISIBLE EN HAUT */}
            <EmailVerificationBanner />

            <div className="py-6">
                <div className="container-custom">
                    {/* ✅ Header de bienvenue personnalisé */}
                    <div className="mb-8">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                            <div>
                                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-slate-100 mb-2">
                                    {getGreeting()} {user?.username} ! 👋
                                </h1>
                                <p className="text-gray-600 dark:text-slate-400 text-lg">
                                    Prêt pour de nouveaux gains aujourd'hui ?
                                </p>
                            </div>
                            <div className="mt-4 md:mt-0">
                                {getSubscriptionStatusBadge()}
                            </div>
                        </div>
                    </div>

                    {/* ✅ Message spécial si email non vérifié */}
                    {!user?.isEmailVerified && (
                        <div className="mb-8 p-6 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-2xl border-2 border-orange-200 dark:border-orange-800">
                            <div className="flex items-center justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center mb-2">
                                        <span className="text-2xl mr-3">📧</span>
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-slate-100">
                                            Vérifiez votre email pour débloquer tout
                                        </h3>
                                    </div>
                                    <p className="text-gray-600 dark:text-slate-300 mb-4">
                                        Pour accéder à tous nos pronostics et fonctionnalités premium,
                                        vérifiez votre adresse email <strong>{user?.email}</strong>
                                    </p>
                                    <div className="flex items-center space-x-4">
                                        <span className="text-sm text-gray-500 dark:text-slate-400">
                                            ✓ Accès aux pronostics premium ✓ Statistiques avancées ✓ Support prioritaire
                                        </span>
                                    </div>
                                </div>
                                <div className="hidden md:block text-6xl">🔒</div>
                            </div>
                        </div>
                    )}

                    {/* ✅ Message d'accueil pour utilisateurs gratuits AVEC email vérifié */}
                    {user?.isEmailVerified && user?.subscriptionStatus !== 'active' && (
                        <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-slate-800 dark:to-slate-700 rounded-2xl border-2 border-blue-200 dark:border-slate-600">
                            <div className="flex items-center justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center mb-2">
                                        <span className="text-2xl mr-3">🚀</span>
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-slate-100">
                                            Débloquez tout le potentiel de PronostiX
                                        </h3>
                                    </div>
                                    <p className="text-gray-600 dark:text-slate-300 mb-4">
                                        Votre email est vérifié ! Passez maintenant Premium pour accéder à tous nos pronostics VIP
                                    </p>
                                    <div className="flex items-center space-x-4">
                                        <Link to="/pricing" className="btn btn-primary">
                                            Découvrir Premium 💎
                                        </Link>
                                        <span className="text-sm text-gray-500 dark:text-slate-400">
                                            ✓ 7 jours d'essai gratuit
                                        </span>
                                    </div>
                                </div>
                                <div className="hidden md:block text-6xl">💎</div>
                            </div>
                        </div>
                    )}

                    {/* ✅ Statistiques rapides avec VRAIES DONNÉES */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {/* Paris totaux */}
                        <div className="card card-white dark:bg-slate-800 card-padding group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                            <div className="flex items-center">
                                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg group-hover:scale-110 transition-transform">
                                    <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600 dark:text-slate-400">Total pronostics</p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-slate-100">{stats.totalBets || 0}</p>
                                </div>
                            </div>
                        </div>

                        {/* Pronostics gagnés */}
                        <div className="card card-white dark:bg-slate-800 card-padding group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                            <div className="flex items-center">
                                <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg group-hover:scale-110 transition-transform">
                                    <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600 dark:text-slate-400">Pronostics gagnés</p>
                                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.wonBets || 0}</p>
                                </div>
                            </div>
                        </div>

                        {/* Taux de réussite */}
                        <div className="card card-white dark:bg-slate-800 card-padding group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                            <div className="flex items-center">
                                <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg group-hover:scale-110 transition-transform">
                                    <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600 dark:text-slate-400">Taux de réussite</p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-slate-100">
                                        {(stats.winRate || 0).toFixed(1)}%
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Cote moyenne */}
                        <div className="card card-white dark:bg-slate-800 card-padding group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                            <div className="flex items-center">
                                <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-lg group-hover:scale-110 transition-transform">
                                    <svg className="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600 dark:text-slate-400">Cote moyenne</p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-slate-100">
                                        {(stats.avgOdds || 0).toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* ✅ Pronostics du jour améliorés */}
                        <div className="lg:col-span-2">
                            <div className="card card-white dark:bg-slate-800 card-padding">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-semibold text-gray-900 dark:text-slate-100 flex items-center">
                                        <span className="mr-2">🏆</span>
                                        Pronostics du jour
                                        {!user?.isEmailVerified && (
                                            <span className="ml-2 text-sm bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300 px-2 py-1 rounded-full">
                                                Vérification requise
                                            </span>
                                        )}
                                    </h2>
                                    {user?.isEmailVerified && (
                                        <Link to="/pronostics" className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center">
                                            Voir tous les pronostics
                                            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </Link>
                                    )}
                                </div>

                                {!user?.isEmailVerified ? (
                                    <div className="text-center py-12 bg-gray-50 dark:bg-slate-700 rounded-lg">
                                        <div className="text-6xl mb-4">🔒</div>
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-slate-100 mb-2">
                                            Vérifiez votre email
                                        </h3>
                                        <p className="text-gray-600 dark:text-slate-400 mb-6">
                                            Pour accéder aux pronostics, vous devez d'abord vérifier votre adresse email
                                        </p>
                                        <div className="text-sm text-gray-500 dark:text-slate-500">
                                            Consultez votre boîte mail et cliquez sur le lien de vérification
                                        </div>
                                    </div>
                                ) : todayPronostics.length > 0 ? (
                                    <div className="space-y-4">
                                        {todayPronostics.slice(0, 5).map((prono) => (
                                            <div key={prono._id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-600 transition-all cursor-pointer">
                                                <div className="flex-1">
                                                    <div className="flex items-center space-x-3 mb-2">
                                                        <span className="text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded">
                                                            {prono.sport}
                                                        </span>
                                                        {getStatusBadge(prono.result)}
                                                        <span className="text-xs text-gray-500 dark:text-slate-500">
                                                            Confiance: {prono.confidence}%
                                                        </span>
                                                    </div>
                                                    <h3 className="font-medium text-gray-900 dark:text-slate-100">
                                                        {prono.homeTeam} vs {prono.awayTeam}
                                                    </h3>
                                                    <p className="text-sm text-gray-600 dark:text-slate-400">{prono.league}</p>
                                                    <p className="text-sm text-gray-500 dark:text-slate-500">{formatDate(prono.matchDate)}</p>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-lg font-semibold text-gray-900 dark:text-slate-100">{prono.odds}</div>
                                                    <div className="text-sm text-gray-600 dark:text-slate-400">Cote</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12 text-gray-500 dark:text-slate-400">
                                        <div className="text-6xl mb-4">⚽</div>
                                        <p className="text-lg font-medium mb-2">Aucun pronostic pour aujourd'hui</p>
                                        <p className="text-sm">Revenez demain pour de nouveaux pronostics !</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* ✅ Sidebar optimisée */}
                        <div className="space-y-6">
                            {/* Actions rapides */}
                            <div className="card card-white dark:bg-slate-800 card-padding">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-4 flex items-center">
                                    <span className="mr-2">⚡</span>
                                    Actions rapides
                                </h3>
                                <div className="space-y-3">
                                    {user?.isEmailVerified ? (
                                        <Link to="/pronostics" className="w-full btn btn-primary">
                                            📊 Tous les pronostics
                                        </Link>
                                    ) : (
                                        <button disabled className="w-full btn bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed">
                                            🔒 Pronostics (Email requis)
                                        </button>
                                    )}
                                    <Link to="/profile" className="w-full btn btn-outline">
                                        ⚙️ Mon profil
                                    </Link>
                                    {user?.subscriptionStatus !== 'active' && (
                                        <Link to="/pricing" className="w-full btn bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700">
                                            💎 Devenir Premium
                                        </Link>
                                    )}
                                </div>
                            </div>

                            {/* ✅ Résumé des performances avec vraies données */}
                            <div className="card card-white dark:bg-slate-800 card-padding">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-4 flex items-center">
                                    <span className="mr-2">📈</span>
                                    Performance globale
                                </h3>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600 dark:text-slate-400">Paris gagnés</span>
                                        <span className="font-semibold text-gray-900 dark:text-slate-100">
                                            {stats.wonBets || 0} / {stats.totalBets || 0}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600 dark:text-slate-400">Cote moyenne</span>
                                        <span className="font-semibold text-gray-900 dark:text-slate-100">
                                            {(stats.avgOdds || 0).toFixed(2)}
                                        </span>
                                    </div>

                                    <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                                        <div
                                            className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all duration-500"
                                            style={{ width: `${Math.min(stats.winRate || 0, 100)}%` }}
                                        ></div>
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-slate-500 text-center">
                                        Taux de réussite: {(stats.winRate || 0).toFixed(1)}%
                                    </p>
                                </div>
                            </div>

                            {/* ✅ Conseil du jour amélioré */}
                            <div className="card card-white dark:bg-slate-800 card-padding">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-4 flex items-center">
                                    <span className="mr-2">💡</span>
                                    Conseil du jour
                                </h3>
                                <div className="bg-blue-50 dark:bg-blue-900/50 border-l-4 border-blue-400 p-4 rounded">
                                    <p className="text-sm text-blue-800 dark:text-blue-300">
                                        <strong>Bankroll Management:</strong> Ne jamais parier plus de 2-3% de votre capital total sur un seul pronostic, même avec une forte confiance.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;