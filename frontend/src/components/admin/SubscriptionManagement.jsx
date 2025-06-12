// src/components/admin/SubscriptionManagement.jsx
import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../hooks/useAdmin';
import ConfirmDialog from './ConfirmDialog';

const SubscriptionManagement = () => {
    const [subscriptions, setSubscriptions] = useState([]);
    const [filteredSubscriptions, setFilteredSubscriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cancelDialog, setCancelDialog] = useState({ open: false, subscription: null });
    const [filters, setFilters] = useState({
        status: '',
        plan: '',
        search: ''
    });

    const { getAllSubscriptions, cancelSubscription } = useAdmin();

    // Charger les abonnements
    const loadSubscriptions = async () => {
        try {
            setLoading(true);
            const response = await getAllSubscriptions();
            setSubscriptions(response.data.subscriptions || []);
            setFilteredSubscriptions(response.data.subscriptions || []);
        } catch (error) {
            console.error('Erreur lors du chargement:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadSubscriptions();
    }, []);

    // Filtrer les abonnements
    useEffect(() => {
        let filtered = subscriptions;

        if (filters.status) {
            filtered = filtered.filter(s => s.status === filters.status);
        }

        if (filters.plan) {
            filtered = filtered.filter(s => s.plan === filters.plan);
        }

        if (filters.search) {
            filtered = filtered.filter(s =>
                s.user?.username?.toLowerCase().includes(filters.search.toLowerCase()) ||
                s.user?.email?.toLowerCase().includes(filters.search.toLowerCase())
            );
        }

        setFilteredSubscriptions(filtered);
    }, [filters, subscriptions]);

    const handleCancelSubscription = async () => {
        try {
            await cancelSubscription(cancelDialog.subscription._id);
            setCancelDialog({ open: false, subscription: null });
            loadSubscriptions();
        } catch (error) {
            console.error('Erreur lors de l\'annulation:', error);
        }
    };

    const getStatusBadge = (status) => {
        const classes = {
            active: 'bg-green-100 text-green-800',
            expired: 'bg-red-100 text-red-800',
            cancelled: 'bg-yellow-100 text-yellow-800',
            past_due: 'bg-orange-100 text-orange-800',
            trialing: 'bg-blue-100 text-blue-800'
        };

        const labels = {
            active: 'Actif',
            expired: 'Expiré',
            cancelled: 'Annulé',
            past_due: 'En retard',
            trialing: 'Essai'
        };

        return (
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${classes[status] || 'bg-gray-100 text-gray-800'}`}>
        {labels[status] || status}
      </span>
        );
    };

    const getPlanBadge = (plan) => {
        const classes = {
            monthly: 'bg-blue-100 text-blue-800',
            quarterly: 'bg-purple-100 text-purple-800',
            annually: 'bg-green-100 text-green-800'
        };

        const labels = {
            monthly: 'Mensuel',
            quarterly: 'Trimestriel',
            annually: 'Annuel'
        };

        return (
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${classes[plan] || 'bg-gray-100 text-gray-800'}`}>
        {labels[plan] || plan}
      </span>
        );
    };

    const getDaysRemaining = (endDate) => {
        const now = new Date();
        const end = new Date(endDate);
        const diffTime = end - now;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return Math.max(0, diffDays);
    };

    const formatCurrency = (amount, currency = 'EUR') => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: currency
        }).format(amount);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Gestion des Abonnements</h2>
                    <p className="text-gray-600">Gérer tous les abonnements de la plateforme</p>
                </div>
                <div className="mt-4 sm:mt-0 flex items-center space-x-4">
                    <div className="text-sm text-gray-500">
                        <span className="font-medium">{filteredSubscriptions.length}</span> abonnement{filteredSubscriptions.length > 1 ? 's' : ''}
                    </div>
                    <div className="text-sm text-gray-500">
            <span className="font-medium text-green-600">
              {filteredSubscriptions.filter(s => s.status === 'active').length}
            </span> actif{filteredSubscriptions.filter(s => s.status === 'active').length > 1 ? 's' : ''}
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                        <select
                            value={filters.status}
                            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        >
                            <option value="">Tous les statuts</option>
                            <option value="active">Actif</option>
                            <option value="expired">Expiré</option>
                            <option value="cancelled">Annulé</option>
                            <option value="past_due">En retard</option>
                            <option value="trialing">Essai</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Plan</label>
                        <select
                            value={filters.plan}
                            onChange={(e) => setFilters(prev => ({ ...prev, plan: e.target.value }))}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        >
                            <option value="">Tous les plans</option>
                            <option value="monthly">Mensuel</option>
                            <option value="quarterly">Trimestriel</option>
                            <option value="annually">Annuel</option>
                        </select>
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Recherche</label>
                        <input
                            type="text"
                            placeholder="Rechercher par utilisateur..."
                            value={filters.search}
                            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-green-100">
                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm text-gray-600">Abonnements Actifs</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {subscriptions.filter(s => s.status === 'active').length}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-blue-100">
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm text-gray-600">Revenus Mensuels</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {formatCurrency(
                                    subscriptions.filter(s => s.status === 'active' && s.plan === 'monthly')
                                        .reduce((sum, s) => sum + (s.amount || 19.99), 0)
                                )}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-yellow-100">
                            <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm text-gray-600">Expirent ce mois</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {subscriptions.filter(s => {
                                    const daysRemaining = getDaysRemaining(s.endDate);
                                    return daysRemaining <= 30 && daysRemaining > 0;
                                }).length}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-red-100">
                            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm text-gray-600">Annulés ce mois</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {subscriptions.filter(s => s.status === 'cancelled').length}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Subscriptions Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Utilisateur
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Plan
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Statut
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Montant
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Dates
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {filteredSubscriptions.map((subscription) => (
                            <tr key={subscription._id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-700">
                          {subscription.user?.username?.charAt(0).toUpperCase() || 'U'}
                        </span>
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">
                                                {subscription.user?.username || 'Utilisateur supprimé'}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {subscription.user?.email || 'Email non disponible'}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {getPlanBadge(subscription.plan)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {getStatusBadge(subscription.status)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">
                                        {formatCurrency(subscription.amount || 0, subscription.currency)}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        {subscription.paymentMethod || 'stripe'}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">
                                        Début: {new Date(subscription.startDate).toLocaleDateString('fr-FR')}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        Fin: {new Date(subscription.endDate).toLocaleDateString('fr-FR')}
                                        {subscription.status === 'active' && (
                                            <span className="ml-2 text-blue-600">
                          ({getDaysRemaining(subscription.endDate)} jours restants)
                        </span>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <div className="flex items-center space-x-2">
                                        {subscription.status === 'active' && (
                                            <button
                                                onClick={() => setCancelDialog({ open: true, subscription })}
                                                className="text-red-600 hover:text-red-900"
                                                title="Annuler l'abonnement"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        )}

                                        <button
                                            className="text-blue-600 hover:text-blue-900"
                                            title="Voir les détails"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                {filteredSubscriptions.length === 0 && (
                    <div className="text-center py-12">
                        <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        <p className="text-gray-500">Aucun abonnement trouvé</p>
                    </div>
                )}
            </div>

            {/* Cancel Confirmation */}
            <ConfirmDialog
                isOpen={cancelDialog.open}
                onClose={() => setCancelDialog({ open: false, subscription: null })}
                onConfirm={handleCancelSubscription}
                title="Annuler l'abonnement"
                message={`Êtes-vous sûr de vouloir annuler l'abonnement de "${cancelDialog.subscription?.user?.username}" ? L'abonnement restera actif jusqu'à la fin de la période en cours.`}
                confirmText="Annuler l'abonnement"
                type="warning"
            />
        </div>
    );
};

export default SubscriptionManagement;