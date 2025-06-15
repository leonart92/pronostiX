// src/components/common/Navbar.jsx - Version avec Simulation Premium
import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { DarkModeToggle } from '../../context/ThemeContext';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const { isAuthenticated, user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const userMenuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setIsUserMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        setIsOpen(false);
        setIsUserMenuOpen(false);
    }, [location.pathname]);

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/'); // ✅ Redirection vers home après déconnexion
            setIsUserMenuOpen(false);
        } catch (error) {
            console.error('Erreur lors de la déconnexion:', error);
        }
    };

    // ✅ Navigation intelligente selon statut de connexion
    const navigationLinks = [
        {
            name: 'Accueil',
            href: isAuthenticated ? '/dashboard' : '/',
            icon: isAuthenticated ? '📊' : '🏠'
        },
        // 🆕 Conditionner l'affichage des Pronostics selon l'authentification
        ...(isAuthenticated ? [{
            name: 'Pronostics',
            href: '/pronostics',
            icon: '⚽'
        }] : []),
        // 🎮 Simulation accessible aux utilisateurs connectés
        ...(isAuthenticated ? [{
            name: 'Simulation',
            href: '/simulation',
            icon: '🎮'
        }] : []),
        {
            name: 'À propos',
            href: '/about',
            icon: '🎯'
        },
        // 🆕 Conditionner l'affichage des Tarifs selon l'abonnement
        ...(user?.subscriptionStatus !== 'active' ? [{
            name: 'Tarifs',
            href: '/pricing',
            icon: '💎'
        }] : [])
    ];

    const isActiveLink = (href) => {
        // ✅ Logique d'active améliorée pour l'accueil
        if (href === '/' && (location.pathname === '/' || location.pathname === '/home')) return true;
        if (href === '/dashboard' && location.pathname === '/dashboard') return true;
        return location.pathname === href;
    };

    // ✅ Logo avec navigation intelligente
    const logoDestination = isAuthenticated ? '/dashboard' : '/';

    return (
        <nav className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-gray-200 dark:border-slate-700 shadow-lg sticky top-0 z-50 transition-all duration-300">
            <div className="container-custom">
                <div className="flex justify-between items-center h-16">
                    {/* Logo - ✅ Navigation intelligente */}
                    <Link to={logoDestination} className="flex items-center space-x-3 group">
                        <div className="relative group-hover:scale-105 transition-all duration-300">
                            <svg width="140" height="58" viewBox="0 0 120 50" className="h-12 w-auto">
                                <defs>
                                    <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" style={{stopColor: '#3b82f6'}} />
                                        <stop offset="100%" style={{stopColor: '#8b5cf6'}} />
                                    </linearGradient>
                                    <filter id="glow">
                                        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                                        <feMerge>
                                            <feMergeNode in="coloredBlur"/>
                                            <feMergeNode in="SourceGraphic"/>
                                        </feMerge>
                                    </filter>
                                </defs>
                                <rect x="5" y="10" width="35" height="35" rx="8" fill="url(#logoGradient)" filter="url(#glow)"/>
                                <path d="M12 32 L17 27 L22 30 L27 20 L33 25" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                                <circle cx="33" cy="25" r="2" fill="white"/>
                                <text x="48" y="22" fontFamily="system-ui, sans-serif" fontSize="16" fontWeight="700" fill="#1a202c" className="dark:fill-white">Pronosti</text>
                                <text x="48" y="37" fontFamily="system-ui, sans-serif" fontSize="16" fontWeight="700" fill="url(#logoGradient)">X</text>
                            </svg>
                            <div className="absolute -inset-2 bg-gradient-to-br from-blue-400 to-purple-600 rounded-xl opacity-0 group-hover:opacity-30 blur-sm transition-all duration-300"></div>
                        </div>
                    </Link>

                    {/* Navigation Desktop */}
                    <div className="hidden lg:flex items-center space-x-1">
                        {navigationLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.href}
                                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${
                                    isActiveLink(link.href)
                                        ? 'bg-blue-600 text-white shadow-lg'
                                        : 'text-gray-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-700 hover:text-blue-600 dark:hover:text-blue-400'
                                }`}
                            >
                                <span>
                                    {/* ✅ Affichage adapté selon statut */}
                                    {link.name === 'Accueil' ? (
                                        isAuthenticated ? 'Dashboard' : 'Accueil'
                                    ) : link.name}
                                </span>
                            </Link>
                        ))}
                    </div>

                    {/* Actions Desktop */}
                    <div className="hidden lg:flex items-center space-x-4">
                        <DarkModeToggle />

                        {isAuthenticated ? (
                            <div className="relative" ref={userMenuRef}>
                                <button
                                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors duration-200"
                                >
                                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                        <span className="text-white text-sm font-semibold">
                                            {user?.username?.charAt(0).toUpperCase() || 'U'}
                                        </span>
                                    </div>
                                    <div className="hidden md:block text-left">
                                        <div className="text-sm font-medium text-gray-900 dark:text-slate-100">
                                            {user?.username}
                                        </div>
                                        <div className="text-xs text-gray-500 dark:text-slate-400">
                                            {user?.subscriptionStatus === 'active' ? '💎 Premium' : '👤 Gratuit'}
                                        </div>
                                    </div>
                                    <svg className="w-4 h-4 text-gray-500 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {/* Menu déroulant utilisateur */}
                                {isUserMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-gray-200 dark:border-slate-600 py-2 z-50">
                                        <div className="px-4 py-2 text-sm text-gray-600 dark:text-slate-400 border-b border-gray-200 dark:border-slate-600">
                                            Connecté en tant que
                                            <div className="font-medium text-gray-900 dark:text-slate-100">{user?.username}</div>
                                        </div>

                                        <Link
                                            to="/profile"
                                            className="block px-4 py-2 text-sm text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700"
                                            onClick={() => setIsUserMenuOpen(false)}
                                        >
                                            <span className="flex items-center">
                                                <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 00-7-7z" />
                                                </svg>
                                                Mon profil
                                            </span>
                                        </Link>

                                        {user?.subscriptionStatus !== 'active' && (
                                            <Link
                                                to="/pricing"
                                                className="block px-4 py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-700"
                                                onClick={() => setIsUserMenuOpen(false)}
                                            >
                                                <span className="flex items-center">
                                                    <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                                    </svg>
                                                    Devenir Premium
                                                </span>
                                            </Link>
                                        )}

                                        <div className="border-t border-gray-200 dark:border-slate-600 my-1"></div>

                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left block px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                                        >
                                            <span className="flex items-center">
                                                <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                                </svg>
                                                Se déconnecter
                                            </span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center space-x-3">
                                <Link
                                    to="/login"
                                    className="px-4 py-2 text-gray-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors duration-200"
                                >
                                    Se connecter
                                </Link>
                                <Link
                                    to="/register"
                                    className="btn btn-primary"
                                >
                                    S'inscrire
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="lg:hidden p-2 rounded-lg text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors duration-200"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {isOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>

                {/* Mobile Menu */}
                {isOpen && (
                    <div className="lg:hidden py-4 border-t border-gray-200 dark:border-slate-700">
                        <div className="flex flex-col space-y-2">
                            {navigationLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.href}
                                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                                        isActiveLink(link.href)
                                            ? 'bg-blue-600 text-white shadow-lg'
                                            : 'text-gray-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-700 hover:text-blue-600 dark:hover:text-blue-400'
                                    }`}
                                    onClick={() => setIsOpen(false)}
                                >
                                    <span className="flex items-center">
                                        <span className="mr-3">{link.icon}</span>
                                        {/* ✅ Affichage adapté selon statut en mobile aussi */}
                                        {link.name === 'Accueil' ? (
                                            isAuthenticated ? 'Dashboard' : 'Accueil'
                                        ) : link.name}
                                    </span>
                                </Link>
                            ))}

                            <div className="pt-4 mt-4 border-t border-gray-200 dark:border-slate-700">
                                <div className="px-4 py-2">
                                    <DarkModeToggle />
                                </div>

                                {isAuthenticated ? (
                                    <div className="flex flex-col space-y-2">
                                        <div className="px-4 py-2 text-sm text-gray-600 dark:text-slate-400">
                                            Connecté: <span className="font-medium text-gray-900 dark:text-slate-100">{user?.username}</span>
                                        </div>

                                        <Link
                                            to="/profile"
                                            className="px-4 py-2 text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg font-medium transition-colors duration-200"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            <span className="flex items-center">
                                                <span className="mr-3">👤</span>
                                                Mon profil
                                            </span>
                                        </Link>

                                        {user?.subscriptionStatus !== 'active' && (
                                            <Link
                                                to="/pricing"
                                                className="px-4 py-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-700 rounded-lg font-medium transition-colors duration-200"
                                                onClick={() => setIsOpen(false)}
                                            >
                                                <span className="flex items-center">
                                                    <span className="mr-3">💎</span>
                                                    Devenir Premium
                                                </span>
                                            </Link>
                                        )}

                                        <button
                                            onClick={() => {
                                                handleLogout();
                                                setIsOpen(false);
                                            }}
                                            className="w-full text-left px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-slate-700 rounded-lg font-medium transition-colors duration-200"
                                        >
                                            <span className="flex items-center">
                                                <span className="mr-3">🚪</span>
                                                Se déconnecter
                                            </span>
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex flex-col space-y-2 pt-4 border-t border-gray-200 dark:border-slate-600">
                                        <Link
                                            to="/login"
                                            className="px-4 py-2 text-center text-gray-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors duration-200"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            Se connecter
                                        </Link>
                                        <Link
                                            to="/register"
                                            className="btn btn-primary text-center"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            S'inscrire
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;