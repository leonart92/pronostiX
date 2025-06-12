// src/pages/EmailVerification.jsx - Protection contre double appel
import { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { toast } from 'react-hot-toast';

const EmailVerification = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('loading');
    const [message, setMessage] = useState('');
    const [alreadyVerified, setAlreadyVerified] = useState(false);
    const hasCalledRef = useRef(false); // ✅ Protection contre double appel

    useEffect(() => {
        const verifyEmail = async () => {
            // ✅ Éviter les appels multiples
            if (hasCalledRef.current) {
                console.log('⚠️ Appel déjà effectué, ignore');
                return;
            }
            hasCalledRef.current = true;

            try {
                console.log('📧 Vérification du token:', token);
                const response = await api.get(`/auth/verify-email/${token}`);

                console.log('✅ Réponse reçue:', response.data);
                setStatus('success');
                setMessage(response.data.message);
                setAlreadyVerified(response.data.data?.alreadyVerified || false);

                toast.success(response.data.message);

                // ✅ Redirection après 2 secondes
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

        if (token && !hasCalledRef.current) {
            verifyEmail();
        } else if (!token) {
            setStatus('error');
            setMessage('Token manquant');
        }
    }, [token, navigate]);

    // ✅ Protection : Si déjà appelé, ne pas refaire d'appel
    useEffect(() => {
        return () => {
            hasCalledRef.current = false;
        };
    }, []);

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

    if (status === 'success') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900">
                <div className="max-w-md w-full">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 text-center">
                        <div className="text-6xl mb-6">🎉</div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-4">
                            {alreadyVerified ? 'Email déjà vérifié !' : 'Email vérifié !'}
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
                            className="w-full btn btn-primary"
                        >
                            Aller au Dashboard maintenant
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // Status error
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900">
            <div className="max-w-md w-full">
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 text-center">
                    <div className="text-6xl mb-6">❌</div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-4">
                        Erreur de vérification
                    </h2>
                    <p className="text-gray-600 dark:text-slate-400 mb-8">
                        {message}
                    </p>
                    <Link to="/dashboard" className="w-full btn btn-primary">
                        Retour au Dashboard
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default EmailVerification;