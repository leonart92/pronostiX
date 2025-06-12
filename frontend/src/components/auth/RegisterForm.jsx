// src/components/auth/RegisterForm.jsx - Version améliorée
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { useAuth } from '../../context/AuthContext';

const RegisterForm = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { register: registerUser, loading } = useAuth();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
        setError
    } = useForm();

    const password = watch('password');

    const onSubmit = async (data) => {
        try {
            await registerUser({
                username: data.username,
                email: data.email,
                password: data.password
            });
            navigate('/dashboard');
        } catch (error) {
            if (error.response?.data?.field) {
                setError(error.response.data.field, {
                    type: 'server',
                    message: error.response.data.message
                });
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-12 px-4 sm:px-6 lg:px-8 relative">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-30">
                <div className="absolute top-10 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
                <div className="absolute top-40 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
                <div className="absolute -bottom-8 right-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
            </div>

            <div className="max-w-md w-full space-y-8 relative z-10">
                {/* Card container */}
                <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-200/50 dark:border-slate-700/50 p-8">
                    {/* Header */}
                    <div className="text-center">
                        <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-blue-600 shadow-lg mb-6">
                            <span className="text-3xl">🚀</span>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-slate-100 mb-2">
                            Rejoignez-nous !
                        </h2>
                        <p className="text-gray-600 dark:text-slate-400">
                            Créez votre compte et commencez à gagner
                        </p>
                    </div>

                    {/* Formulaire */}
                    <form className="mt-8 space-y-5" onSubmit={handleSubmit(onSubmit)}>
                        {/* Nom d'utilisateur */}
                        <div>
                            <label htmlFor="username" className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">
                                Nom d'utilisateur
                            </label>
                            <div className="relative">
                                <input
                                    {...register('username', {
                                        required: 'Le nom d\'utilisateur est requis',
                                        minLength: {
                                            value: 3,
                                            message: 'Le nom d\'utilisateur doit contenir au moins 3 caractères'
                                        },
                                        maxLength: {
                                            value: 30,
                                            message: 'Le nom d\'utilisateur ne peut pas dépasser 30 caractères'
                                        },
                                        pattern: {
                                            value: /^[a-zA-Z0-9_-]+$/,
                                            message: 'Le nom d\'utilisateur doit contenir uniquement des lettres, chiffres, tirets et underscores'
                                        }
                                    })}
                                    type="text"
                                    autoComplete="username"
                                    className={`w-full px-4 py-3 pl-10 border rounded-xl bg-white/50 dark:bg-slate-700/50 backdrop-blur-sm transition-all duration-200 ${
                                        errors.username
                                            ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20'
                                            : 'border-gray-300 dark:border-slate-600 focus:border-purple-500 focus:ring-purple-500/20 dark:focus:border-purple-400'
                                    } focus:outline-none focus:ring-4 text-gray-900 dark:text-slate-100 placeholder-gray-500 dark:placeholder-slate-400`}
                                    placeholder="john_doe"
                                />
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                            </div>
                            {errors.username && (
                                <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center">
                                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    {errors.username.message}
                                </p>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">
                                Adresse email
                            </label>
                            <div className="relative">
                                <input
                                    {...register('email', {
                                        required: 'L\'email est requis',
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: 'Format d\'email invalide'
                                        }
                                    })}
                                    type="email"
                                    autoComplete="email"
                                    className={`w-full px-4 py-3 pl-10 border rounded-xl bg-white/50 dark:bg-slate-700/50 backdrop-blur-sm transition-all duration-200 ${
                                        errors.email
                                            ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20'
                                            : 'border-gray-300 dark:border-slate-600 focus:border-purple-500 focus:ring-purple-500/20 dark:focus:border-purple-400'
                                    } focus:outline-none focus:ring-4 text-gray-900 dark:text-slate-100 placeholder-gray-500 dark:placeholder-slate-400`}
                                    placeholder="votre@email.com"
                                />
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                    </svg>
                                </div>
                            </div>
                            {errors.email && (
                                <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center">
                                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    {errors.email.message}
                                </p>
                            )}
                        </div>

                        {/* Mot de passe */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">
                                Mot de passe
                            </label>
                            <div className="relative">
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
                                    type={showPassword ? 'text' : 'password'}
                                    autoComplete="new-password"
                                    className={`w-full px-4 py-3 pl-10 pr-12 border rounded-xl bg-white/50 dark:bg-slate-700/50 backdrop-blur-sm transition-all duration-200 ${
                                        errors.password
                                            ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20'
                                            : 'border-gray-300 dark:border-slate-600 focus:border-purple-500 focus:ring-purple-500/20 dark:focus:border-purple-400'
                                    } focus:outline-none focus:ring-4 text-gray-900 dark:text-slate-100 placeholder-gray-500 dark:placeholder-slate-400`}
                                    placeholder="••••••••"
                                />
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center hover:bg-gray-100 dark:hover:bg-slate-600 rounded-r-xl transition-colors"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <EyeSlashIcon className="h-5 w-5 text-gray-400 dark:text-slate-500" />
                                    ) : (
                                        <EyeIcon className="h-5 w-5 text-gray-400 dark:text-slate-500" />
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center">
                                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    {errors.password.message}
                                </p>
                            )}
                        </div>

                        {/* Confirmation mot de passe */}
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">
                                Confirmer le mot de passe
                            </label>
                            <div className="relative">
                                <input
                                    {...register('confirmPassword', {
                                        required: 'La confirmation du mot de passe est requise',
                                        validate: value =>
                                            value === password || 'Les mots de passe ne correspondent pas'
                                    })}
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    autoComplete="new-password"
                                    className={`w-full px-4 py-3 pl-10 pr-12 border rounded-xl bg-white/50 dark:bg-slate-700/50 backdrop-blur-sm transition-all duration-200 ${
                                        errors.confirmPassword
                                            ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20'
                                            : 'border-gray-300 dark:border-slate-600 focus:border-purple-500 focus:ring-purple-500/20 dark:focus:border-purple-400'
                                    } focus:outline-none focus:ring-4 text-gray-900 dark:text-slate-100 placeholder-gray-500 dark:placeholder-slate-400`}
                                    placeholder="••••••••"
                                />
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center hover:bg-gray-100 dark:hover:bg-slate-600 rounded-r-xl transition-colors"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? (
                                        <EyeSlashIcon className="h-5 w-5 text-gray-400 dark:text-slate-500" />
                                    ) : (
                                        <EyeIcon className="h-5 w-5 text-gray-400 dark:text-slate-500" />
                                    )}
                                </button>
                            </div>
                            {errors.confirmPassword && (
                                <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center">
                                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    {errors.confirmPassword.message}
                                </p>
                            )}
                        </div>

                        {/* Conditions d'utilisation */}
                        <div className="pt-2">
                            <div className="flex items-start">
                                <input
                                    {...register('acceptTerms', {
                                        required: 'Vous devez accepter les conditions d\'utilisation'
                                    })}
                                    id="accept-terms"
                                    type="checkbox"
                                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 dark:border-slate-600 rounded mt-1 transition-colors"
                                />
                                <label htmlFor="accept-terms" className="ml-3 block text-sm text-gray-700 dark:text-slate-300 leading-relaxed">
                                    J'accepte les{' '}
                                    <Link
                                        to="/terms-of-service"
                                        className="text-purple-600 dark:text-purple-400 hover:text-purple-500 dark:hover:text-purple-300 font-medium transition-colors"
                                        target="_blank"
                                    >
                                        conditions d'utilisation
                                    </Link>{' '}
                                    et la{' '}
                                    <Link
                                        to="/privacy-policy"
                                        className="text-purple-600 dark:text-purple-400 hover:text-purple-500 dark:hover:text-purple-300 font-medium transition-colors"
                                        target="_blank"
                                    >
                                        politique de confidentialité
                                    </Link>
                                </label>
                            </div>
                            {errors.acceptTerms && (
                                <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center">
                                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    {errors.acceptTerms.message}
                                </p>
                            )}
                        </div>

                        {/* Bouton d'inscription */}
                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-xl text-white shadow-lg transform transition-all duration-200 ${
                                    loading
                                        ? 'bg-gray-400 dark:bg-slate-600 cursor-not-allowed scale-95'
                                        : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-4 focus:ring-purple-500/50 hover:scale-105 hover:shadow-xl'
                                }`}
                            >
                                {loading ? (
                                    <div className="flex items-center">
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                                        Création du compte...
                                    </div>
                                ) : (
                                    <span className="flex items-center">
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                        </svg>
                                        Créer mon compte
                                    </span>
                                )}
                            </button>
                        </div>
                    </form>

                    {/* Divider */}
                    <div className="mt-8 mb-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300 dark:border-slate-600" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white/80 dark:bg-slate-800/80 text-gray-500 dark:text-slate-400">
                                    Déjà membre ?
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Lien connexion */}
                    <div className="text-center">
                        <Link
                            to="/login"
                            className="inline-flex items-center px-6 py-2 border-2 border-purple-600 dark:border-purple-400 text-purple-600 dark:text-purple-400 font-semibold rounded-xl hover:bg-purple-50 dark:hover:bg-slate-700 transition-all duration-200 hover:scale-105"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                            </svg>
                            Se connecter
                        </Link>
                    </div>
                </div>

                {/* Retour à l'accueil */}
                <div className="text-center">
                    <Link
                        to="/"
                        className="inline-flex items-center text-sm text-gray-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Retour à l'accueil
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default RegisterForm;