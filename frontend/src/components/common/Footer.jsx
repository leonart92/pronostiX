// src/components/common/Footer.jsx - Version mise à jour
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-900 text-white">
            <div className="container-custom">
                {/* Footer principal */}
                <div className="py-12">
                    <div className="grid md:grid-cols-4 gap-8">
                        {/* Logo et description */}
                        <div className="md:col-span-2">
                            <div className="flex items-center space-x-2 mb-4">
                                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                    <span className="text-white font-bold text-sm">P</span>
                                </div>
                                <span className="text-xl font-bold">PronostiX</span>
                            </div>
                            <p className="text-gray-400 mb-6 max-w-md">
                                La plateforme de référence pour les pronostics sportifs.
                                Rejoignez des milliers de parieurs qui nous font confiance.
                            </p>

                            {/* Statistiques rapides */}
                            <div className="flex space-x-6">
                                <div>
                                    <div className="text-2xl font-bold text-blue-400">87%</div>
                                    <div className="text-sm text-gray-400">Taux de réussite</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-green-400">5k+</div>
                                    <div className="text-sm text-gray-400">Membres actifs</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-purple-400">2.4x</div>
                                    <div className="text-sm text-gray-400">ROI moyen</div>
                                </div>
                            </div>
                        </div>

                        {/* Navigation */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Navigation</h3>
                            <ul className="space-y-2">
                                <li>
                                    <Link to="/" className="text-gray-400 hover:text-white transition-colors">
                                        Accueil
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/pricing" className="text-gray-400 hover:text-white transition-colors">
                                        Tarifs
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/pronostics" className="text-gray-400 hover:text-white transition-colors">
                                        Pronostics
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/about" className="text-gray-400 hover:text-white transition-colors">
                                        À propos
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Support - SECTION MISE À JOUR */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Support</h3>
                            <ul className="space-y-2">
                                <li>
                                    <Link to="/help-center" className="text-gray-400 hover:text-white transition-colors">
                                        Centre d'aide
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/contact" className="text-gray-400 hover:text-white transition-colors">
                                        Contact
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/aide#faq" className="text-gray-400 hover:text-white transition-colors">
                                        FAQ
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/register" className="text-gray-400 hover:text-white transition-colors">
                                        Inscription
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Footer bottom */}
                <div className="border-t border-gray-800 py-6">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="text-gray-400 text-sm mb-4 md:mb-0">
                            © {currentYear} PronostiX. Tous droits réservés.
                        </div>

                        {/* Liens légaux */}
                        <div className="flex space-x-6 text-sm text-gray-400">
                            <Link to="/mentions-legales" className="hover:text-white transition-colors">
                                Mentions légales
                            </Link>
                            <Link to="/privacy-policy" className="hover:text-white transition-colors">
                                Politique de confidentialité
                            </Link>
                            <Link to="/terms-of-service" className="hover:text-white transition-colors">
                                CGU
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Warning responsabilité */}
                <div className="border-t border-gray-800 py-4">
                    <div className="text-center text-xs text-gray-500">
                        ⚠️ Avertissement : Les paris sportifs comportent des risques.
                        Jouez de manière responsable et ne pariez que ce que vous pouvez vous permettre de perdre.
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;