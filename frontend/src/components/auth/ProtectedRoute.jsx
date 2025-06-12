// src/components/auth/ProtectedRoute.jsx - ADAPTÉ POUR NAVIGATION INTELLIGENTE
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({
                            children,
                            requireAdmin = false,
                            requireSubscription = false,
                            redirectTo = '/login'
                        }) => {
    const { isAuthenticated, user, loading } = useAuth();
    const location = useLocation();

    // ✅ Chargement - spinner amélioré
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-slate-400">Chargement...</p>
                </div>
            </div>
        );
    }

    // ✅ Pas authentifié - redirection vers login avec état
    if (!isAuthenticated) {
        return <Navigate to={redirectTo} state={{ from: location }} replace />;
    }

    // ✅ Vérification admin si requis
    if (requireAdmin && user?.role !== 'admin') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900">
                <div className="text-center max-w-md mx-auto px-4">
                    <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-red-100 dark:bg-red-900 mb-6">
                        <span className="text-3xl">🚫</span>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-4">Accès interdit</h1>
                    <p className="text-gray-600 dark:text-slate-400 mb-6">
                        Vous n'avez pas les permissions nécessaires pour accéder à cette page.
                        Cette section est réservée aux administrateurs.
                    </p>
                    <div className="space-y-3">
                        <button
                            onClick={() => window.history.back()}
                            className="w-full btn btn-primary"
                        >
                            ← Retour
                        </button>
                        <Navigate to="/dashboard" replace />
                    </div>
                </div>
            </div>
        );
    }

    // ✅ Vérification abonnement si requis
    if (requireSubscription && user?.subscriptionStatus !== 'active') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900">
                <div className="text-center max-w-md mx-auto px-4">
                    <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900 mb-6">
                        <span className="text-3xl">💎</span>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-4">Abonnement Premium requis</h1>
                    <p className="text-gray-600 dark:text-slate-400 mb-6">
                        Cette fonctionnalité est réservée aux abonnés Premium.
                        Découvrez tous nos avantages !
                    </p>
                    <div className="space-y-3">
                        <Navigate to="/pricing" state={{ from: location }} replace />
                        <button
                            onClick={() => window.history.back()}
                            className="w-full btn btn-outline"
                        >
                            ← Retour
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // ✅ Tout est ok, afficher le contenu
    return children;
};

export default ProtectedRoute;