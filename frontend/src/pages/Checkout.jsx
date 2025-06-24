// src/pages/Checkout.jsx - VERSION SIMPLE SANS NGROK
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { toast } from 'react-hot-toast';

const Checkout = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { isAuthenticated, user } = useAuth();

    const [loading, setLoading] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [currentSubscription, setCurrentSubscription] = useState(null);

    // Plans disponibles (correspondent à ceux de Pricing.jsx)
    const availablePlans = {
    monthly: {
        id: 'monthly',
        name: 'Mensuel',
        price: 9.99,
        period: 'mois',
        totalPrice: 9.99,
        savings: null,
        description: 'Parfait pour commencer',
        billingInfo: 'Facturé mensuellement'
    },
    quarterly: {
        id: 'quarterly',
        name: 'Trimestriel',
        price: 8.29, // 24.88 / 3
        originalPrice: 9.99,
        period: 'mois',
        totalPrice: 24.88,
        savings: '17%',
        description: 'Le plus populaire',
        billingInfo: 'Facturé tous les 3 mois'
    },
    annually: {
        id: 'annually',
        name: 'Annuel',
        price: 7.49, // 89.91 / 12
        originalPrice: 9.99,
        period: 'mois',
        totalPrice: 89.91,
        savings: '25%',
        description: 'Meilleure économie',
        billingInfo: 'Facturé annuellement'
    }
};

    useEffect(() => {
        // Vérifier si l'utilisateur est connecté
        if (!isAuthenticated) {
            toast.error('Vous devez être connecté pour accéder à cette page');
            navigate('/login');
            return;
        }

        // Récupérer le plan depuis l'URL
        const planId = searchParams.get('plan');
        if (!planId || !availablePlans[planId]) {
            toast.error('Plan invalide');
            navigate('/pricing');
            return;
        }

        setSelectedPlan(availablePlans[planId]);
        fetchCurrentSubscription();
    }, [isAuthenticated, searchParams, navigate]);

    const fetchCurrentSubscription = async () => {
        try {
            console.log('🔍 Récupération subscription actuelle...');
            const response = await api.get('/subscriptions/current');

            if (response.data.success) {
                setCurrentSubscription(response.data.data.subscription);
                console.log('✅ Subscription:', response.data.data.subscription);
            }
        } catch (error) {
            console.log('ℹ️ Pas de subscription actuelle (normal si premier abonnement)');
            // C'est normal si l'utilisateur n'a pas encore d'abonnement
        }
    };


    const handleCheckout = async () => {
        if (!selectedPlan) return;

        setLoading(true);

        try {
            // 🔍 DEBUG - VÉRIFIER LES DONNÉES AVANT ENVOI
            const checkoutData = {
                plan: selectedPlan.id,
                successUrl: `${window.location.origin}/success`,
                cancelUrl: `${window.location.origin}/pricing`
            };

            console.log('=== DEBUG FRONTEND ===');
            console.log('selectedPlan objet complet:', selectedPlan);
            console.log('selectedPlan.id:', selectedPlan.id);
            console.log('Données à envoyer:', checkoutData);
            console.log('window.location.origin:', window.location.origin);
            console.log('User connecté:', user);
            console.log('=====================');

            // Vérifications supplémentaires
            if (!selectedPlan.id) {
                console.error('❌ selectedPlan.id est undefined!');
                toast.error('Erreur: Plan non défini');
                return;
            }

            if (!checkoutData.successUrl || !checkoutData.cancelUrl) {
                console.error('❌ URLs non définies!');
                toast.error('Erreur: URLs non définies');
                return;
            }

            // Vérifier que l'ID du plan est correct
            const validPlans = ['monthly', 'quarterly', 'annually'];
            if (!validPlans.includes(selectedPlan.id)) {
                console.error('❌ Plan ID invalide:', selectedPlan.id, 'Valides:', validPlans);
                toast.error(`Plan invalide: ${selectedPlan.id}`);
                return;
            }

            console.log('✅ Toutes les vérifications passées, envoi de la requête...');

            const response = await api.post('/subscriptions/create-checkout', checkoutData);

            console.log('✅ Réponse serveur:', response.data);

            if (response.data.success) {
                console.log('✅ Redirection vers Stripe...');
                window.location.href = response.data.data.checkoutUrl;
            }
        } catch (error) {
            // 🔍 DEBUG DÉTAILLÉ DES ERREURS
            console.log('=== ERREUR CHECKOUT DÉTAILLÉE ===');
            console.log('Status:', error.response?.status);
            console.log('Message:', error.response?.data?.message);
            console.log('Code:', error.response?.data?.code);
            console.log('Erreurs détaillées:', error.response?.data?.errors); // 🆕 Nouvelles erreurs détaillées
            console.log('URL appelée:', error.config?.url);
            console.log('Données envoyées:', error.config?.data);
            console.log('Token présent:', !!error.config?.headers?.Authorization);
            console.log('==================================');

            // Messages d'erreur spécifiques
            const errorMessage = error.response?.data?.message || 'Erreur lors de la création de la session de paiement';

            if (error.response?.status === 401) {
                toast.error('Session expirée, veuillez vous reconnecter');
                navigate('/login');
            } else if (error.response?.status === 403) {
                toast.error('Accès refusé - Vérifiez vos permissions');
            } else if (error.response?.data?.code === 'VALIDATION_ERROR') {
                // Afficher les erreurs de validation spécifiques
                const errors = error.response?.data?.errors;
                if (errors && errors.length > 0) {
                    errors.forEach(err => {
                        console.log(`❌ Validation échouée: ${err.param} - ${err.msg}`);
                        toast.error(`${err.param}: ${err.msg}`);
                    });
                } else {
                    toast.error('Erreur de validation des données');
                }
            } else {
                toast.error(errorMessage);
            }
        } finally {
            setLoading(false);
        }
    };

    // Si l'utilisateur a déjà un abonnement actif
    if (currentSubscription && currentSubscription.status === 'active') {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center py-12 px-4">
                <div className="max-w-md w-full">
                    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-8 text-center">
                        <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-4">
                            Vous êtes déjà abonné !
                        </h2>
                        <p className="text-gray-600 dark:text-slate-400 mb-6">
                            Vous avez déjà un abonnement <strong>{currentSubscription.planDetails?.name}</strong> actif.
                        </p>
                        <div className="space-y-3">
                            <Link
                                to="/dashboard"
                                className="w-full btn btn-primary"
                            >
                                Accéder au dashboard
                            </Link>
                            <Link
                                to="/pricing"
                                className="w-full btn btn-outline"
                            >
                                Voir les plans
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!selectedPlan) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="loading-spinner mb-4"></div>
                    <p className="text-gray-600 dark:text-slate-400">Chargement...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-12 px-4">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100 mb-2">
                        Finaliser votre abonnement
                    </h1>
                    <p className="text-gray-600 dark:text-slate-400">
                        Vous êtes à un clic de profiter de tous nos pronostics
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Récapitulatif du plan */}
                    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-slate-100 mb-6">
                            Récapitulatif de votre commande
                        </h2>

                        {/* Plan sélectionné */}
                        <div className="border border-gray-200 dark:border-slate-700 rounded-lg p-4 mb-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-semibold text-gray-900 dark:text-slate-100">
                                        Plan {selectedPlan.name}
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-slate-400">
                                        {selectedPlan.description}
                                    </p>
                                </div>
                                {selectedPlan.savings && (
                                    <span className="badge badge-success">
                                        -{selectedPlan.savings}
                                    </span>
                                )}
                            </div>

                            {/* Prix */}
                            <div className="flex justify-between items-center">
                                <div>
                                    {selectedPlan.originalPrice && (
                                        <span className="text-sm text-gray-400 dark:text-slate-500 line-through mr-2">
                                            {selectedPlan.originalPrice}€/{selectedPlan.period}
                                        </span>
                                    )}
                                    <span className="text-lg font-bold text-gray-900 dark:text-slate-100">
                                        {selectedPlan.price}€/{selectedPlan.period}
                                    </span>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                        {selectedPlan.totalPrice}€
                                    </div>
                                    <div className="text-sm text-gray-600 dark:text-slate-400">
                                        {selectedPlan.billingInfo}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Ce qui est inclus */}
                        <div className="space-y-3">
                            <h4 className="font-semibold text-gray-900 dark:text-slate-100">
                                Ce qui est inclus :
                            </h4>
                            {[
                                'Pronostics illimités',
                                'Analyses détaillées',
                                'Statistiques avancées',
                                'Notifications en temps réel',
                                'Support prioritaire'
                            ].map((feature, index) => (
                                <div key={index} className="flex items-center">
                                    <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    <span className="text-gray-700 dark:text-slate-300">{feature}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Informations de facturation */}
                    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-slate-100 mb-6">
                            Informations de paiement
                        </h2>

                        {/* Infos utilisateur */}
                        <div className="mb-6">
                            <h4 className="font-semibold text-gray-900 dark:text-slate-100 mb-3">
                                Compte utilisateur
                            </h4>
                            <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4">
                                <div className="flex items-center">
                                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mr-3">
                                        <span className="text-blue-600 dark:text-blue-400 font-medium">
                                            {user?.username?.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-slate-100">
                                            {user?.username}
                                        </p>
                                        <p className="text-sm text-gray-600 dark:text-slate-400">
                                            {user?.email}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Méthode de paiement */}
                        <div className="mb-6">
                            <h4 className="font-semibold text-gray-900 dark:text-slate-100 mb-3">
                                Méthode de paiement
                            </h4>
                            <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4">
                                <div className="flex items-center">
                                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mr-3">
                                        <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-slate-100">
                                            Carte bancaire
                                        </p>
                                        <p className="text-sm text-gray-600 dark:text-slate-400">
                                            Paiement sécurisé par Stripe
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bouton de paiement */}
                        <button
                            onClick={handleCheckout}
                            disabled={loading}
                            className={`w-full btn btn-primary btn-lg ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {loading ? (
                                <div className="flex items-center justify-center">
                                    <div className="loading-spinner mr-2 !w-5 !h-5"></div>
                                    Redirection vers Stripe...
                                </div>
                            ) : (
                                <>
                                    Payer {selectedPlan.totalPrice}€
                                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </>
                            )}
                        </button>

                        {/* Garanties */}
                        <div className="mt-6 space-y-2">
                            <div className="flex items-center text-sm text-gray-600 dark:text-slate-400">
                                <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                Paiement 100% sécurisé
                            </div>
                            <div className="flex items-center text-sm text-gray-600 dark:text-slate-400">
                                <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                Garantie de remboursement 7 jours
                            </div>
                            <div className="flex items-center text-sm text-gray-600 dark:text-slate-400">
                                <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                Résiliation à tout moment
                            </div>
                        </div>
                    </div>
                </div>

                {/* Liens utiles */}
                <div className="text-center mt-8">
                    <p className="text-gray-600 dark:text-slate-400 mb-4">
                        Besoin d'aide ?
                        <Link to="/contact" className="text-blue-600 dark:text-blue-400 hover:underline ml-1">
                            Contactez-nous
                        </Link>
                    </p>
                    <Link
                        to="/pricing"
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                        ← Retour aux plans
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Checkout;