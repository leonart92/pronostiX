// src/pages/EmailVerification.jsx - CORRIGÉ SANS AUTO-APPEL
import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { toast } from 'react-hot-toast';

const EmailVerification = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('waiting'); // waiting, loading, success, error
    const [message, setMessage] = useState('');
    const [alreadyVerified, setAlreadyVerified] = useState(false);

    // ✅ FONCTION MANUELLE - L'utilisateur doit cliquer
    const handleVerifyEmail = async () => {
        setStatus('loading');

        try {
            console.log('📧 Vérification manuelle du token:', token);
            const response = await api.get(`/auth/verify-email/${token}`);

            console.log('✅ Réponse reçue:', response.data);
            setStatus('success');
            setMessage(response.data.message);
            setAlreadyVerified(response.data.data?.alreadyVerified || false);

            toast.success(response.data.message);

            // Redirection après 2 secondes
            setTimeout(() => {
                navigate('/dashboard');
            }, 2000);

        } catch (error) {
            console.error('❌ Erreur vérification:', error);
            setStatus('error');
            setMessage(error.response?.data?.message || 'Erreur lors de la vérification');
            toast.error('Erreur de vérification');
        }
    };

    // ✅ PAGE D'ATTENTE - L'utilisateur doit cliquer pour vérifier
    if (status === 'waiting') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900">
                <div className="max-w-md w-full">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 text-center">
                        <div className="text-6xl mb-6">📧</div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-4">
                            Vérification d'email
                        </h2>
                        <p className="text-gray-600 dark:text-slate-400 mb-6">
                            Cliquez sur le bouton ci-dessous pour confirmer et vérifier votre adresse email.
                        </p>

                        {token && (
                            <div className="mb-6 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                                <div className="text-blue-600 dark:text-blue-400 text-xs">
                                    Token reçu ✅
                                </div>
                            </div>
                        )}

                        <button
                            onClick={handleVerifyEmail}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors mb-4"
                        >
                            ✅ Vérifier mon email
                        </button>

                        <Link
                            to="/dashboard"
                            className="text-sm text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-300"
                        >
                            Passer pour l'instant
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // ✅ LOADING - Vérification en cours
    if (status === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-slate-100 mb-2">
                        Vérification en cours...
                    </h2>
                    <p className="text-gray-600 dark:text-slate-400">
                        Veuillez patienter
                    </p>
                </div>
            </div>
        );
    }

    // ✅ SUCCESS - Email vérifié
    if (status === 'success') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900">
                <div className="max-w-md w-full">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 text-center">
                        <div className="text-6xl mb-6">🎉</div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-4">
                            {alreadyVerified ? 'Email déjà vérifié !' : 'Email vérifié avec succès !'}
                        </h2>
                        <p className="text-gray-600 dark:text-slate-400 mb-6">
                            {message}
                        </p>

                        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                            <div className="text-green-600 dark:text-green-400 text-sm">
                                ✅ Redirection automatique vers le dashboard...
                            </div>
                        </div>

                        <Link
                            to="/dashboard"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                        >
                            Aller au Dashboard maintenant
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // ✅ ERROR - Erreur de vérification
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900">
            <div className="max-w-md w-full">
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 text-center">
                    <div className="text-6xl mb-6">❌</div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-4">
                        Erreur de vérification
                    </h2>
                    <p className="text-gray-600 dark:text-slate-400 mb-6">
                        {message}
                    </p>

                    <div className="space-y-3">
                        <button
                            onClick={handleVerifyEmail}
                            className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                        >
                            🔄 Réessayer
                        </button>
                        <Link
                            to="/dashboard"
                            className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                        >
                            Retour au Dashboard
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmailVerification;