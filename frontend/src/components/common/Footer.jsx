// src/components/common/Footer.jsx - Version moderne et belle
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gradient-to-b from-slate-900 to-slate-950 text-white relative overflow-hidden">
            {/* Effet de fond décoratif */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-blue-600/5"></div>
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>

            <div className="container-custom relative z-10">
                {/* Footer principal */}
                <div className="py-16">
                    <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-12">
                        {/* Logo et description - 2 colonnes sur desktop */}
                        <div className="lg:col-span-2">
                            {/* Logo */}
                            <div className="mb-6">
                                <svg width="140" height="58" viewBox="0 0 120 50" className="h-12 w-auto">
                                    <defs>
                                        <linearGradient id="footerLogoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
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
                                    <rect x="5" y="10" width="35" height="35" rx="8" fill="url(#footerLogoGradient)" filter="url(#glow)"/>
                                    <path d="M12 32 L17 27 L22 30 L27 20 L33 25" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                                    <circle cx="33" cy="25" r="2" fill="white"/>
                                    <text x="48" y="22" fontFamily="system-ui, sans-serif" fontSize="16" fontWeight="700" fill="white">Pronosti</text>
                                    <text x="48" y="37" fontFamily="system-ui, sans-serif" fontSize="16" fontWeight="700" fill="url(#footerLogoGradient)">X</text>
                                </svg>
                            </div>

                            {/* Description */}
                            <p className="text-slate-300 text-lg leading-relaxed mb-8 max-w-md">
                                La plateforme de référence pour les
                                <span className="text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text font-semibold"> pronostics sportifs professionnels</span>.
                                Analyses expertes et prédictions fiables.
                            </p>

                            {/* Stats visuelles */}
                            <div className="flex flex-wrap gap-6 mb-8">
                                <div className="flex items-center space-x-2">
                                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                                    <span className="text-slate-400 text-sm">Service actif 24/7</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                                    <span className="text-slate-400 text-sm">Support premium</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                                    <span className="text-slate-400 text-sm">Analyses quotidiennes</span>
                                </div>
                            </div>

                            {/* CTA Button */}
                            <Link
                                to="/register"
                                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 group"
                            >
                                <span>Commencer gratuitement</span>
                                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </Link>
                        </div>

                        {/* Navigation */}
                        <div>
                            <h3 className="text-xl font-bold mb-6 text-white flex items-center">
                                <svg className="w-5 h-5 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Navigation
                            </h3>
                            <ul className="space-y-4">
                                {[
                                    { to: "/home", label: "Accueil" },
                                    { to: "/pronostics", label: "Pronostics" },
                                    { to: "/pricing", label: "Tarifs", badge: "Popular" },
                                    { to: "/about", label: "À propos" }
                                ].map((link, index) => (
                                    <li key={index}>
                                        <Link
                                            to={link.to}
                                            className="text-slate-300 hover:text-white transition-all duration-200 flex items-center group"
                                        >
                                            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                            <span className="group-hover:translate-x-1 transition-transform">{link.label}</span>
                                            {link.badge && (
                                                <span className="ml-2 px-2 py-0.5 bg-gradient-to-r from-blue-500 to-purple-500 text-xs rounded-full">
                                                    {link.badge}
                                                </span>
                                            )}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Support */}
                        <div>
                            <h3 className="text-xl font-bold mb-6 text-white flex items-center">
                                <svg className="w-5 h-5 mr-2 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a.75.75 0 01.75.75v6l4.5 3.75-4.5 3.75v6a.75.75 0 01-1.5 0v-6L6.75 12 11.25 8.25v-6a.75.75 0 01.75-.75z" />
                                </svg>
                                Support
                            </h3>
                            <ul className="space-y-4">
                                {[
                                    { to: "/help-center", label: "Centre d'aide" },
                                    { to: "/contact", label: "Contact" },
                                    { to: "/help-center", label: "FAQ" },
                                    { to: "/discord", label: "Communauté Discord", external: true }
                                ].map((link, index) => (
                                    <li key={index}>
                                        <Link
                                            to={link.to}
                                            className="text-slate-300 hover:text-white transition-all duration-200 flex items-center group"
                                            {...(link.external && { target: "_blank", rel: "noopener noreferrer" })}
                                        >
                                            <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                            <span className="group-hover:translate-x-1 transition-transform">{link.label}</span>
                                            {link.external && (
                                                <svg className="w-3 h-3 ml-1 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                </svg>
                                            )}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Séparateur avec gradient */}
                <div className="h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent"></div>

                {/* Footer bottom */}
                <div className="py-8">
                    <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
                        <div className="text-slate-400 text-sm">
                            © {currentYear} PronostiX. Tous droits réservés.
                        </div>

                        {/* Liens légaux */}
                        <div className="flex flex-wrap justify-center lg:justify-end gap-6 text-sm text-slate-400">
                            {[
                                { to: "/mentions-legales", label: "Mentions légales" },
                                { to: "/privacy-policy", label: "Confidentialité" },
                                { to: "/terms-of-service", label: "CGU" }
                            ].map((link, index) => (
                                <Link
                                    key={index}
                                    to={link.to}
                                    className="hover:text-white transition-colors duration-200 hover:underline"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Warning responsabilité - Design moderne */}
                <div className="border-t border-slate-800 py-6">
                    <div className="flex justify-center">
                        <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-xl backdrop-blur-sm">
                            <div className="flex items-center space-x-3">
                                <div className="flex-shrink-0">
                                    <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <span className="text-sm text-yellow-100 font-medium">
                                    Les paris sportifs comportent des risques. Jouez responsable.
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;