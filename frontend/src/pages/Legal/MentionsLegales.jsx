// src/pages/Legal/MentionsLegales.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import {
    BuildingOfficeIcon,
    EnvelopeIcon,
    PhoneIcon,
    GlobeAltIcon,
    IdentificationIcon
} from '@heroicons/react/24/outline';

const MentionsLegales = () => {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-200">
            {/* Header */}
            <div className="bg-white dark:bg-slate-800 shadow-sm">
                <div className="container-custom py-16">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-slate-50 mb-4">
                            Mentions légales
                        </h1>
                        <p className="text-xl text-gray-600 dark:text-slate-300 max-w-2xl mx-auto">
                            Informations légales relatives au site PronostiX
                        </p>
                    </div>
                </div>
            </div>

            <div className="container-custom py-16">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-8 mb-8">

                        {/* 1. Identification de l'éditeur */}
                        <section className="mb-12">
                            <div className="flex items-center mb-6">
                                <IdentificationIcon className="w-6 h-6 text-blue-600 mr-3" />
                                <h2 className="text-2xl font-semibold text-gray-900 dark:text-slate-50">
                                    1. Identification de l'éditeur
                                </h2>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <div className="flex items-start">
                                        <BuildingOfficeIcon className="w-5 h-5 text-gray-400 mt-1 mr-3" />
                                        <div>
                                            <p className="font-medium text-gray-900 dark:text-slate-50">Dénomination sociale</p>
                                            <p className="text-gray-600 dark:text-slate-300">PronostiX SAS</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <IdentificationIcon className="w-5 h-5 text-gray-400 mt-1 mr-3" />
                                        <div>
                                            <p className="font-medium text-gray-900 dark:text-slate-50">Forme juridique</p>
                                            <p className="text-gray-600 dark:text-slate-300">Société par Actions Simplifiée (SAS)</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <div className="w-5 h-5 text-gray-400 mt-1 mr-3 flex items-center justify-center">
                                            <span className="text-xs">€</span>
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900 dark:text-slate-50">Capital social</p>
                                            <p className="text-gray-600 dark:text-slate-300">10 000 € entièrement libéré</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-start">
                                        <span className="w-5 h-5 text-gray-400 mt-1 mr-3 text-xs font-bold">RCS</span>
                                        <div>
                                            <p className="font-medium text-gray-900 dark:text-slate-50">RCS</p>
                                            <p className="text-gray-600 dark:text-slate-300">Paris B 123 456 789</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <span className="w-5 h-5 text-gray-400 mt-1 mr-3 text-xs font-bold">SIRET</span>
                                        <div>
                                            <p className="font-medium text-gray-900 dark:text-slate-50">SIRET</p>
                                            <p className="text-gray-600 dark:text-slate-300">123 456 789 00012</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <span className="w-5 h-5 text-gray-400 mt-1 mr-3 text-xs font-bold">TVA</span>
                                        <div>
                                            <p className="font-medium text-gray-900 dark:text-slate-50">N° TVA Intracommunautaire</p>
                                            <p className="text-gray-600 dark:text-slate-300">FR12 123456789</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* 2. Coordonnées */}
                        <section className="mb-12">
                            <div className="flex items-center mb-6">
                                <EnvelopeIcon className="w-6 h-6 text-blue-600 mr-3" />
                                <h2 className="text-2xl font-semibold text-gray-900 dark:text-slate-50">
                                    2. Coordonnées
                                </h2>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <div className="flex items-start">
                                        <BuildingOfficeIcon className="w-5 h-5 text-gray-400 mt-1 mr-3" />
                                        <div>
                                            <p className="font-medium text-gray-900 dark:text-slate-50">Adresse du siège social</p>
                                            <p className="text-gray-600 dark:text-slate-300">
                                                123 Rue du Sport<br />
                                                75001 Paris<br />
                                                France
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-start">
                                        <EnvelopeIcon className="w-5 h-5 text-gray-400 mt-1 mr-3" />
                                        <div>
                                            <p className="font-medium text-gray-900 dark:text-slate-50">Email</p>
                                            <p className="text-gray-600 dark:text-slate-300">contact@pronostix.fr</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <PhoneIcon className="w-5 h-5 text-gray-400 mt-1 mr-3" />
                                        <div>
                                            <p className="font-medium text-gray-900 dark:text-slate-50">Téléphone</p>
                                            <p className="text-gray-600 dark:text-slate-300">+33 1 23 45 67 89</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* 3. Directeur de publication */}
                        <section className="mb-12">
                            <h2 className="text-2xl font-semibold text-gray-900 dark:text-slate-50 mb-4">
                                3. Directeur de publication
                            </h2>
                            <p className="text-gray-600 dark:text-slate-300">
                                Le directeur de la publication du site PronostiX est <strong>[Nom du Président/Directeur]</strong>,
                                en sa qualité de représentant légal de la société PronostiX SAS.
                            </p>
                        </section>

                        {/* 4. Hébergement */}
                        <section className="mb-12">
                            <div className="flex items-center mb-6">
                                <GlobeAltIcon className="w-6 h-6 text-blue-600 mr-3" />
                                <h2 className="text-2xl font-semibold text-gray-900 dark:text-slate-50">
                                    4. Hébergement
                                </h2>
                            </div>

                            <div className="bg-gray-50 dark:bg-slate-700 p-6 rounded-lg">
                                <h3 className="font-semibold text-gray-900 dark:text-slate-50 mb-2">Vercel Inc.</h3>
                                <p className="text-gray-600 dark:text-slate-300 mb-2">
                                    340 S Lemon Ave #4133<br />
                                    Walnut, CA 91789<br />
                                    États-Unis
                                </p>
                                <p className="text-gray-600 dark:text-slate-300">
                                    Site web : <a href="https://vercel.com" target="_blank" rel="noopener noreferrer"
                                                  className="text-blue-600 hover:text-blue-700">vercel.com</a>
                                </p>
                            </div>
                        </section>

                        {/* 5. Propriété intellectuelle */}
                        <section className="mb-12">
                            <h2 className="text-2xl font-semibold text-gray-900 dark:text-slate-50 mb-4">
                                5. Propriété intellectuelle
                            </h2>
                            <div className="space-y-4 text-gray-600 dark:text-slate-300">
                                <p>
                                    L'ensemble de ce site relève de la législation française et internationale sur le droit d'auteur et la propriété intellectuelle.
                                    Tous les droits de reproduction sont réservés, y compris pour les documents téléchargeables et les représentations iconographiques et photographiques.
                                </p>
                                <p>
                                    La reproduction de tout ou partie de ce site sur un support électronique quel qu'il soit est formellement interdite
                                    sauf autorisation expresse du directeur de la publication.
                                </p>
                                <p>
                                    Les marques et logos figurant sur le site sont déposés par PronostiX SAS ou éventuellement par ses partenaires.
                                </p>
                            </div>
                        </section>

                        {/* 6. Responsabilité */}
                        <section className="mb-12">
                            <h2 className="text-2xl font-semibold text-gray-900 dark:text-slate-50 mb-4">
                                6. Limitation de responsabilité
                            </h2>
                            <div className="space-y-4 text-gray-600 dark:text-slate-300">
                                <p>
                                    Les informations contenues sur ce site sont aussi précises que possible et le site est périodiquement remis à jour,
                                    mais peut toutefois contenir des inexactitudes, des omissions ou des lacunes.
                                </p>
                                <p>
                                    PronostiX SAS ne pourra en aucun cas être tenue responsable de tout dommage de quelque nature qu'il soit résultant
                                    de l'interprétation ou de l'utilisation des informations et/ou documents disponibles sur ce site.
                                </p>
                                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                                    <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                                        ⚠️ Avertissement Jeu Responsable
                                    </h3>
                                    <p className="text-yellow-700 dark:text-yellow-300 text-sm">
                                        Les pronostics sportifs comportent des risques financiers. PronostiX fournit des analyses et opinions
                                        sans garantie de résultats. L'utilisateur est seul responsable de ses décisions d'investissement.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* 7. Liens hypertextes */}
                        <section className="mb-12">
                            <h2 className="text-2xl font-semibold text-gray-900 dark:text-slate-50 mb-4">
                                7. Liens hypertextes
                            </h2>
                            <div className="space-y-4 text-gray-600 dark:text-slate-300">
                                <p>
                                    Les liens hypertextes mis en place dans le cadre du présent site web en direction d'autres ressources
                                    présentes sur le réseau Internet ne sauraient engager la responsabilité de PronostiX SAS.
                                </p>
                                <p>
                                    De même, PronostiX SAS ne peut être tenue responsable du contenu des sites web qui pointent vers le présent site web.
                                </p>
                            </div>
                        </section>

                        {/* 8. Droit applicable */}
                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 dark:text-slate-50 mb-4">
                                8. Droit applicable et juridiction
                            </h2>
                            <div className="space-y-4 text-gray-600 dark:text-slate-300">
                                <p>
                                    Les présentes mentions légales sont régies par le droit français. En cas de litige,
                                    les tribunaux français seront seuls compétents.
                                </p>
                                <p>
                                    Pour toute question relative aux présentes mentions légales, vous pouvez nous contacter
                                    à l'adresse : <a href="mailto:legal@pronostix.fr" className="text-blue-600 hover:text-blue-700">legal@pronostix.fr</a>
                                </p>
                            </div>
                        </section>
                    </div>

                    {/* Navigation vers autres pages légales */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <Link
                            to="/privacy-policy"
                            className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow border border-gray-200 dark:border-slate-700"
                        >
                            <h3 className="font-semibold text-gray-900 dark:text-slate-50 mb-2">
                                Politique de confidentialité
                            </h3>
                            <p className="text-gray-600 dark:text-slate-300 text-sm">
                                Découvrez comment nous protégeons vos données personnelles
                            </p>
                        </Link>

                        <Link
                            to="/terms-of-service"
                            className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow border border-gray-200 dark:border-slate-700"
                        >
                            <h3 className="font-semibold text-gray-900 dark:text-slate-50 mb-2">
                                Conditions Générales d'Utilisation
                            </h3>
                            <p className="text-gray-600 dark:text-slate-300 text-sm">
                                Les règles d'utilisation de notre plateforme
                            </p>
                        </Link>
                    </div>

                    {/* Dernière mise à jour */}
                    <div className="text-center mt-8 text-sm text-gray-500 dark:text-slate-400">
                        Dernière mise à jour : 30 mai 2025
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MentionsLegales;