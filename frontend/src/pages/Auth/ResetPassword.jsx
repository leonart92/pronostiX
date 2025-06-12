// pages/Auth/ResetPassword.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { authService } from '../../services/index';

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [isValidToken, setIsValidToken] = useState(null);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors }
    } = useForm();

    const password = watch('password', '');

    // Vérifier la validité du token au chargement
    useEffect(() => {
        if (!token) {
            setIsValidToken(false);
            return;
        }

        // Pour l'instant, on considère que le token est valide
        // Dans une vraie app, vous pourriez vérifier côté serveur
        setIsValidToken(true);
    }, [token]);

    const onSubmit = async (data) => {
        if (data.password !== data.confirmPassword) {
            toast.error('Les mots de passe ne correspondent pas');
            return;
        }

        setIsLoading(true);

        try {
            await authService.resetPassword(token, data.password);

            toast.success('🎉 Mot de passe réinitialisé avec succès !');

            // Rediriger vers la page de connexion après 2 secondes
            setTimeout(() => {
                navigate('/login', {
                    state: {
                        message: 'Vous pouvez maintenant vous connecter avec votre nouveau mot de passe'
                    }
                });
            }, 2000);

        } catch (error) {
            const message = error.response?.data?.message || 'Erreur lors de la réinitialisation';
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    };

    // Fonction pour vérifier la force du mot de passe
    const getPasswordStrength = (password) => {
        if (!password) return { score: 0, label: '', color: '' };

        let score = 0;
        if (password.length >= 8) score++;
        if (/[a-z]/.test(password)) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;

        const levels = [
            { score: 0, label: '', color: '' },
            { score: 1, label: 'Très faible', color: 'bg-red-500' },
            { score: 2, label: 'Faible', color: 'bg-orange-500' },
            { score: 3, label: 'Moyen', color: 'bg-yellow-500' },
            { score: 4, label: 'Fort', color: 'bg-blue-500' },
            { score: 5, label: 'Très fort', color: 'bg-green-500' }
        ];

        return levels[score];
    };

    const passwordStrength = getPasswordStrength(password);

    if (isValidToken === null) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (isValidToken === false) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="max-w-md w-full space-y-8 p-8">
                    <div className="text-center">
                        <div className="mx-auto h-24 w-24 bg-red-100 rounded-full flex items-center justify-center">
                            <svg className="h-12 w-12 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                            Lien invalide
                        </h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Ce lien de réinitialisation est invalide ou a expiré.
                        </p>
                        <div className="mt-6">
                            <Link
                                to="/forgot-password"
                                className="text-blue-600 hover:text-blue-500 font-medium"
                            >
                                Demander un nouveau lien
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <div className="mx-auto h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center">
                        <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                        </svg>
                    </div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Nouveau mot de passe
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Choisissez un mot de passe sécurisé pour votre compte
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    <div className="space-y-4">
                        {/* Nouveau mot de passe */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Nouveau mot de passe
                            </label>
                            <div className="mt-1">
                                <input
                                    {...register('password', {
                                        required: 'Le mot de passe est requis',
                                        minLength: {
                                            value: 6,
                                            message: 'Le mot de passe doit contenir au moins 6 caractères'
                                        },
                                        pattern: {
                                            value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                                            message: 'Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre'
                                        }
                                    })}
                                    type="password"
                                    className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                    placeholder="Entrez votre nouveau mot de passe"
                                />
                                {errors.password && (
                                    <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                                )}

                                {/* Indicateur de force du mot de passe */}
                                {password && (
                                    <div className="mt-2">
                                        <div className="flex items-center space-x-2">
                                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                                                <div
                                                    className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                                                    style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-xs text-gray-600">{passwordStrength.label}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Confirmation mot de passe */}
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                                Confirmer le mot de passe
                            </label>
                            <div className="mt-1">
                                <input
                                    {...register('confirmPassword', {
                                        required: 'Veuillez confirmer votre mot de passe',
                                        validate: value => value === password || 'Les mots de passe ne correspondent pas'
                                    })}
                                    type="password"
                                    className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                    placeholder="Confirmez votre mot de passe"
                                />
                                {errors.confirmPassword && (
                                    <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Conseils de sécurité */}
                    <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-blue-800">
                                    Conseils pour un mot de passe sécurisé :
                                </h3>
                                <div className="mt-2 text-sm text-blue-700">
                                    <ul className="list-disc list-inside space-y-1">
                                        <li>Au moins 8 caractères</li>
                                        <li>Une majuscule et une minuscule</li>
                                        <li>Au moins un chiffre</li>
                                        <li>Évitez les mots du dictionnaire</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Réinitialisation...
                                </>
                            ) : (
                                '🔑 Réinitialiser mon mot de passe'
                            )}
                        </button>
                    </div>

                    <div className="text-center">
                        <Link
                            to="/login"
                            className="text-sm text-blue-600 hover:text-blue-500"
                        >
                            Retour à la connexion
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;