// src/pages/Success.jsx - AVEC SUCCESS ET CANCEL
import React, { useEffect, useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { toast } from 'react-hot-toast';

const Success = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { user, syncSubscriptionFromStripe } = useAuth(); // 🆕 Utilise votre fonction
    const [loading, setLoading] = useState(true);
    const [sessionData, setSessionData] = useState(null);
    const [error, setError] = useState(null);
    const [syncStatus, setSyncStatus] = useState('pending'); // pending, syncing, success, error

    useEffect(() => {
        const sessionId = searchParams.get('session_id');

        if (sessionId) {
            verifyAndSyncSubscription(sessionId);
        } else {
            setError('Session ID manquant');
            setLoading(false);
        }
    }, [searchParams]);

    const verifyAndSyncSubscription = async (sessionId) => {
        let retryCount = 0;
        const maxRetries = 5;
        const retryDelay = 2000; // 2 secondes

        const attemptVerification = async () => {
            try {
                console.log(`🔍 Vérification session (tentative ${retryCount + 1}/${maxRetries}):`, sessionId);

                // 1. Vérifier la session Stripe
                const sessionResponse = await api.get(`/subscriptions/session/${sessionId}`);
                const sessionData = sessionResponse.data.data;
                setSessionData(sessionData);

                console.log('✅ Session data:', sessionData);
                console.log('💳 Payment status:', sessionData.payment_status || sessionData.status);

                // 🆕 Vérifier plusieurs statuts possibles
                const isPaymentSuccessful =
                    sessionData.payment_status === 'paid' ||
                    sessionData.status === 'paid' ||
                    sessionData.status === 'complete' ||
                    sessionData.payment_status === 'complete';

                if (isPaymentSuccessful) {
                    console.log('✅ Paiement confirmé, synchronisation...');

                    // 2. Synchroniser l'abonnement
                    try {
                        setSyncStatus('syncing');
                        await syncSubscriptionFromStripe(sessionId);

                        console.log('✅ Synchronisation réussie via AuthContext');
                        setSyncStatus('success');

                        // 3. Redirection automatique vers le dashboard après 3 secondes
                        setTimeout(() => {
                            navigate('/dashboard');
                        }, 3000);

                    } catch (syncError) {
                        console.error('❌ Erreur synchronisation:', syncError);
                        setSyncStatus('error');
                    }
                } else {
                    // 🆕 Si pas encore payé, réessayer
                    if (retryCount < maxRetries - 1) {
                        retryCount++;
                        console.log(`⏳ Paiement en cours (${sessionData.payment_status}), nouvelle tentative dans ${retryDelay/1000}s...`);

                        setTimeout(() => {
                            attemptVerification();
                        }, retryDelay);
                        return; // Ne pas finir le loading
                    } else {
                        console.log('⚠️ Paiement non confirmé après', maxRetries, 'tentatives');

                        // 🆕 Essayer quand même la synchronisation (au cas où)
                        try {
                            console.log('🔄 Tentative de synchronisation forcée...');
                            setSyncStatus('syncing');
                            await syncSubscriptionFromStripe(sessionId);

                            console.log('✅ Synchronisation forcée réussie');
                            setSyncStatus('success');

                            setTimeout(() => {
                                navigate('/dashboard');
                            }, 3000);
                        } catch (forcedSyncError) {
                            console.error('❌ Synchronisation forcée échouée:', forcedSyncError);
                            setSyncStatus('error');
                            setError('Paiement en cours de traitement. Vérifiez votre dashboard dans quelques minutes.');
                        }
                    }
                }
            } catch (error) {
                console.error('❌ Erreur vérification:', error);

                // 🆕 Si erreur 404 ou 400, essayer la synchronisation directe
                if (error.response?.status === 404 || error.response?.status === 400) {
                    console.log('🔄 Session non trouvée, tentative synchronisation directe...');
                    try {
                        setSyncStatus('syncing');
                        await syncSubscriptionFromStripe(sessionId);

                        console.log('✅ Synchronisation directe réussie');
                        setSyncStatus('success');

                        setTimeout(() => {
                            navigate('/dashboard');
                        }, 3000);
                        return;
                    } catch (directSyncError) {
                        console.error('❌ Synchronisation directe échouée:', directSyncError);
                    }
                }

                setError('Erreur lors de la vérification du paiement');
                toast.error('Erreur lors de la vérification du paiement');
            } finally {
                if (retryCount >= maxRetries - 1 || syncStatus === 'success') {
                    setLoading(false);
                }
            }
        };

        // Commencer la vérification
        attemptVerification();
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="loading-spinner mb-4"></div>
                    <p className="text-gray-600 dark:text-slate-400">
                        {syncStatus === 'syncing' ? 'Activation de votre abonnement...' : 'Vérification de votre paiement...'}
                    </p>
                    {syncStatus === 'syncing' && (
                        <p className="text-sm text-blue-600 dark:text-blue-400 mt-2">
                            Synchronisation avec Stripe en cours...
                        </p>
                    )}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center py-12 px-4">
                <div className="max-w-md w-full">
                    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-8 text-center">
                        <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-4">
                            Erreur de vérification
                        </h2>
                        <p className="text-gray-600 dark:text-slate-400 mb-6">
                            {error}
                        </p>
                        <div className="space-y-3">
                            <Link to="/dashboard" className="w-full btn btn-primary">
                                Accéder au dashboard
                            </Link>
                            <Link to="/pricing" className="w-full btn btn-outline">
                                Retour aux plans
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center py-12 px-4">
            <div className="max-w-lg w-full">
                <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-8 text-center">
                    {/* Statut de synchronisation */}
                    {syncStatus === 'success' && (
                        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg">
                            <div className="flex items-center justify-center mb-2">
                                <svg className="w-6 h-6 text-green-600 dark:text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span className="text-green-800 dark:text-green-200 font-medium">Abonnement activé !</span>
                            </div>
                            <p className="text-sm text-green-700 dark:text-green-300">
                                Redirection automatique vers votre dashboard...
                            </p>
                        </div>
                    )}

                    {syncStatus === 'error' && (
                        <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                            <div className="flex items-center justify-center mb-2">
                                <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="text-yellow-800 dark:text-yellow-200 font-medium">Synchronisation en attente</span>
                            </div>
                            <p className="text-sm text-yellow-700 dark:text-yellow-300">
                                Votre paiement a été traité. L'activation sera effective sous peu.
                            </p>
                        </div>
                    )}

                    {/* Icône de succès */}
                    <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>

                    <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100 mb-4">
                        🎉 Paiement réussi !
                    </h1>

                    <p className="text-gray-600 dark:text-slate-400 mb-6">
                        Félicitations ! Votre paiement a été traité avec succès.
                        {syncStatus === 'success'
                            ? ' Vous avez maintenant accès à tous nos pronostics exclusifs.'
                            : ' Votre abonnement sera activé dans les prochaines minutes.'
                        }
                    </p>

                    {/* Détails de la session */}
                    {sessionData && (
                        <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4 mb-6">
                            <h3 className="font-semibold text-gray-900 dark:text-slate-100 mb-2">
                                Détails de votre commande
                            </h3>
                            <div className="text-sm text-gray-600 dark:text-slate-400">
                                <p>Statut: <span className="text-green-600 dark:text-green-400 font-medium">Payé</span></p>
                                {sessionData.subscription_id && (
                                    <p>ID Abonnement: <span className="font-mono text-xs">{sessionData.subscription_id}</span></p>
                                )}
                                {sessionData.customerEmail && (
                                    <p>Email: {sessionData.customerEmail}</p>
                                )}
                                {sessionData.amountTotal && (
                                    <p>Montant: {sessionData.amountTotal}€</p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Prochaines étapes */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-6">
                        <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                            Prochaines étapes
                        </h3>
                        <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                            <li>✅ Explorez vos nouveaux pronostics Premium</li>
                            <li>✅ Consultez vos statistiques détaillées</li>
                            <li>✅ Configurez vos notifications</li>
                        </ul>
                    </div>

                    {/* Actions */}
                    <div className="space-y-3">
                        <Link
                            to="/dashboard"
                            className="w-full btn btn-primary"
                        >
                            {syncStatus === 'success' ? 'Accéder à mon dashboard Premium' : 'Accéder à mon dashboard'}
                        </Link>
                        <Link
                            to="/pronostics"
                            className="w-full btn btn-outline"
                        >
                            Voir les pronostics
                        </Link>
                    </div>

                    {/* Support */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600 dark:text-slate-400">
                            Problème avec votre abonnement ?{' '}
                            <Link to="/contact" className="text-blue-600 dark:text-blue-400 hover:underline">
                                Contactez notre support
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

// 🆕 COMPOSANT CANCEL AJOUTÉ
const Cancel = () => {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center py-12 px-4">
            <div className="max-w-md w-full">
                <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-8 text-center">
                    {/* Icône d'annulation */}
                    <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>

                    <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-4">
                        Paiement annulé
                    </h2>

                    <p className="text-gray-600 dark:text-slate-400 mb-6">
                        Votre paiement a été annulé. Aucun montant n'a été débité de votre compte.
                    </p>

                    {/* Pourquoi reprendre l'abonnement */}
                    <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4 mb-6">
                        <h3 className="font-semibold text-gray-900 dark:text-slate-100 mb-2">
                            Pourquoi s'abonner ?
                        </h3>
                        <ul className="text-sm text-gray-600 dark:text-slate-400 space-y-1">
                            <li>• Pronostics exclusifs et analyses détaillées</li>
                            <li>• Taux de réussite élevé</li>
                            <li>• Support prioritaire</li>
                            <li>• Statistiques avancées</li>
                        </ul>
                    </div>

                    <div className="space-y-3">
                        <Link
                            to="/pricing"
                            className="w-full btn btn-primary"
                        >
                            Voir les plans d'abonnement
                        </Link>
                        <Link
                            to="/"
                            className="w-full btn btn-outline"
                        >
                            Retour à l'accueil
                        </Link>
                    </div>

                    {/* Support */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600 dark:text-slate-400">
                            Des questions ?{' '}
                            <Link to="/contact" className="text-blue-600 dark:text-blue-400 hover:underline">
                                Contactez-nous
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

// 🆕 EXPORTS DES DEUX COMPOSANTS
export { Success, Cancel };
export default Success;