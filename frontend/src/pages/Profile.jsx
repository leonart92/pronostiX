// src/pages/Profile.jsx - ADAPTÉ POUR DARK MODE
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { toast } from 'react-hot-toast';

const Profile = () => {
    const { user, updateUser } = useAuth();
    const [activeTab, setActiveTab] = useState('profile');
    const [loading, setLoading] = useState(false);
    const [subscriptionInfo, setSubscriptionInfo] = useState(null);

    // Formulaire profil
    const [profileForm, setProfileForm] = useState({
        username: user?.username || '',
        email: user?.email || ''
    });

    // Formulaire mot de passe
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    useEffect(() => {
        if (user) {
            setProfileForm({
                username: user.username || '',
                email: user.email || ''
            });
        }
        fetchSubscriptionInfo();
    }, [user]);

    const fetchSubscriptionInfo = async () => {
        try {
            const response = await api.get('/users/subscription-status');
            setSubscriptionInfo(response.data.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des infos d\'abonnement:', error);
        }
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await api.put('/users/profile', profileForm);

            if (response.data.success) {
                updateUser(response.data.data.user);
                toast.success('Profil mis à jour avec succès');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Erreur lors de la mise à jour');
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();

        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            toast.error('Les mots de passe ne correspondent pas');
            return;
        }

        if (passwordForm.newPassword.length < 6) {
            toast.error('Le mot de passe doit contenir au moins 6 caractères');
            return;
        }

        setLoading(true);

        try {
            await api.put('/users/change-password', {
                currentPassword: passwordForm.currentPassword,
                newPassword: passwordForm.newPassword
            });

            toast.success('Mot de passe modifié avec succès');
            setPasswordForm({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Erreur lors du changement de mot de passe');
        } finally {
            setLoading(false);
        }
    };

    const handleCancelSubscription = async () => {
        if (!window.confirm('Êtes-vous sûr de vouloir annuler votre abonnement ?')) {
            return;
        }

        try {
            await api.post('/subscriptions/cancel');
            toast.success('Abonnement annulé. Il restera actif jusqu\'à la fin de la période.');
            fetchSubscriptionInfo();
        } catch (error) {
            toast.error('Erreur lors de l\'annulation de l\'abonnement');
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    const tabs = [
        { id: 'profile', name: 'Profil', icon: '👤' },
        { id: 'password', name: 'Mot de passe', icon: '🔒' },
        { id: 'subscription', name: 'Abonnement', icon: '💎' },
        { id: 'activity', name: 'Activité', icon: '📊' }
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-8">
            <div className="container-custom">
                {/* ✅ Header - Dark mode */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100 mb-2">Mon profil</h1>
                    <p className="text-gray-600 dark:text-slate-400">Gérez vos informations personnelles et votre abonnement</p>
                </div>

                <div className="grid lg:grid-cols-4 gap-8">
                    {/* ✅ Sidebar avec tabs - Dark mode */}
                    <div className="lg:col-span-1">
                        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg shadow-sm p-6">
                            <div className="space-y-2">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                                            activeTab === tab.id
                                                ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-medium'
                                                : 'text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700'
                                        }`}
                                    >
                                        <span className="mr-3">{tab.icon}</span>
                                        {tab.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* ✅ Contenu principal - Dark mode */}
                    <div className="lg:col-span-3">
                        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg shadow-sm p-6">

                            {/* ✅ Tab Profil - Dark mode */}
                            {activeTab === 'profile' && (
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-900 dark:text-slate-100 mb-6">Informations personnelles</h2>

                                    <form onSubmit={handleProfileUpdate} className="space-y-6">
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                                                    Nom d'utilisateur
                                                </label>
                                                <input
                                                    type="text"
                                                    value={profileForm.username}
                                                    onChange={(e) => setProfileForm({...profileForm, username: e.target.value})}
                                                    className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                                                    Email
                                                </label>
                                                <input
                                                    type="email"
                                                    value={profileForm.email}
                                                    onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                                                    className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded-lg">
                                            <h3 className="font-medium text-gray-900 dark:text-slate-100 mb-2">Informations du compte</h3>
                                            <div className="space-y-2 text-sm text-gray-600 dark:text-slate-400">
                                                <p>Membre depuis: {formatDate(user?.createdAt)}</p>
                                                <p>Dernière connexion: {user?.lastLogin ? formatDate(user.lastLogin) : 'N/A'}</p>
                                                <p>Rôle: {user?.role === 'admin' ? 'Administrateur' : 'Utilisateur'}</p>
                                            </div>
                                        </div>

                                        <div className="flex justify-end">
                                            <button
                                                type="submit"
                                                disabled={loading}
                                                className="btn btn-primary"
                                            >
                                                {loading ? 'Mise à jour...' : 'Mettre à jour le profil'}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}

                            {/* ✅ Tab Mot de passe - Dark mode */}
                            {activeTab === 'password' && (
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-900 dark:text-slate-100 mb-6">Changer le mot de passe</h2>

                                    <form onSubmit={handlePasswordChange} className="space-y-6 max-w-md">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                                                Mot de passe actuel
                                            </label>
                                            <input
                                                type="password"
                                                value={passwordForm.currentPassword}
                                                onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                                                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                                                Nouveau mot de passe
                                            </label>
                                            <input
                                                type="password"
                                                value={passwordForm.newPassword}
                                                onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                                                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                required
                                                minLength={6}
                                            />
                                            <p className="text-sm text-gray-500 dark:text-slate-500 mt-1">Au moins 6 caractères</p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                                                Confirmer le nouveau mot de passe
                                            </label>
                                            <input
                                                type="password"
                                                value={passwordForm.confirmPassword}
                                                onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                                                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                required
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="btn btn-primary"
                                        >
                                            {loading ? 'Modification...' : 'Changer le mot de passe'}
                                        </button>
                                    </form>
                                </div>
                            )}

                            {/* ✅ Tab Abonnement - Dark mode */}
                            {activeTab === 'subscription' && (
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-900 dark:text-slate-100 mb-6">Mon abonnement</h2>

                                    {subscriptionInfo ? (
                                        <div className="space-y-6">
                                            {/* ✅ Statut actuel - Dark mode */}
                                            <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
                                                <div className="flex items-center justify-between mb-4">
                                                    <h3 className="text-lg font-medium text-blue-900 dark:text-blue-100">Plan actuel</h3>
                                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                                        subscriptionInfo.status === 'active'
                                                            ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300'
                                                            : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300'
                                                    }`}>
                                                        {subscriptionInfo.status === 'active' ? 'Actif' : 'Inactif'}
                                                    </span>
                                                </div>

                                                <div className="grid md:grid-cols-2 gap-4 text-sm">
                                                    <div>
                                                        <span className="text-blue-700 dark:text-blue-300">Plan:</span>
                                                        <span className="ml-2 font-medium text-blue-900 dark:text-blue-100">
                                                            {subscriptionInfo.plan === 'monthly' ? 'Mensuel' :
                                                                subscriptionInfo.plan === 'quarterly' ? 'Trimestriel' : 'Annuel'}
                                                        </span>
                                                    </div>
                                                    {subscriptionInfo.endDate && (
                                                        <div>
                                                            <span className="text-blue-700 dark:text-blue-300">Expire le:</span>
                                                            <span className="ml-2 font-medium text-blue-900 dark:text-blue-100">{formatDate(subscriptionInfo.endDate)}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* ✅ Actions - Dark mode */}
                                            <div className="flex flex-wrap gap-4">
                                                <Link to="/pricing" className="btn btn-primary">
                                                    Changer de plan
                                                </Link>

                                                {subscriptionInfo.status === 'active' && !subscriptionInfo.cancelAtPeriodEnd && (
                                                    <button
                                                        onClick={handleCancelSubscription}
                                                        className="btn btn-outline border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30"
                                                    >
                                                        Annuler l'abonnement
                                                    </button>
                                                )}

                                                {subscriptionInfo.cancelAtPeriodEnd && (
                                                    <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                                                        <p className="text-yellow-800 dark:text-yellow-200 text-sm">
                                                            Votre abonnement sera annulé le {formatDate(subscriptionInfo.endDate)}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center py-8">
                                            <div className="text-gray-500 dark:text-slate-400 mb-4">
                                                <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                                </svg>
                                                <p className="font-medium mb-2 text-gray-900 dark:text-slate-100">Aucun abonnement actif</p>
                                                <p className="text-sm">Vous utilisez actuellement le plan gratuit</p>
                                            </div>
                                            <Link to="/pricing" className="btn btn-primary">
                                                Découvrir nos abonnements
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* ✅ Tab Activité - Dark mode */}
                            {activeTab === 'activity' && (
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-900 dark:text-slate-100 mb-6">Activité récente</h2>

                                    <div className="space-y-4">
                                        <div className="flex items-center p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
                                            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg mr-4">
                                                <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900 dark:text-slate-100">Connexion</p>
                                                <p className="text-sm text-gray-600 dark:text-slate-400">Dernière connexion aujourd'hui</p>
                                            </div>
                                        </div>

                                        <div className="text-center py-8 text-gray-500 dark:text-slate-400">
                                            <p>Plus d'activités à venir...</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;