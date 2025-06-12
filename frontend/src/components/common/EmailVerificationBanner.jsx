// src/components/common/EmailVerificationBanner.jsx
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { toast } from 'react-hot-toast';

const EmailVerificationBanner = () => {
    const { user } = useAuth();
    const [isVisible, setIsVisible] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    // Ne pas afficher si : pas d'user, email déjà vérifié, ou bannière masquée
    if (!user || user.isEmailVerified || !isVisible) {
        return null;
    }

    const resendVerification = async () => {
        setIsLoading(true);
        try {
            await api.post('/auth/resend-verification');
            toast.success('📧 Email de vérification renvoyé ! Vérifiez votre boîte mail');
        } catch (error) {
            toast.error('❌ Erreur lors du renvoi de l\'email');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-l-4 border-yellow-400 dark:border-yellow-500">
            <div className="p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="text-2xl">⚠️</div>
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                                Vérification d'email requise
                            </h3>
                            <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                                Vérifiez votre email (<strong>{user.email}</strong>) pour débloquer tous les pronostics
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-3">
                        <button
                            onClick={resendVerification}
                            disabled={isLoading}
                            className={`inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md transition-colors ${
                                isLoading
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    : 'bg-yellow-400 hover:bg-yellow-500 text-yellow-900 hover:text-yellow-800'
                            }`}
                        >
                            {isLoading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-900 mr-2"></div>
                                    Envoi...
                                </>
                            ) : (
                                <>
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    Renvoyer l'email
                                </>
                            )}
                        </button>

                        <button
                            onClick={() => setIsVisible(false)}
                            className="text-yellow-400 hover:text-yellow-600 dark:text-yellow-300 dark:hover:text-yellow-500 p-1 rounded-full hover:bg-yellow-100 dark:hover:bg-yellow-800/30 transition-colors"
                            aria-label="Fermer"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmailVerificationBanner;