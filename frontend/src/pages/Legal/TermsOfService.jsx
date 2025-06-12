// src/pages/Legal/TermsOfService.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    DocumentTextIcon,
    UserIcon,
    CreditCardIcon,
    ExclamationTriangleIcon,
    ShieldCheckIcon,
    NoSymbolIcon,
    ScaleIcon,
    ChevronDownIcon,
    ChevronUpIcon
} from '@heroicons/react/24/outline';

const TermsOfService = () => {
    const [openSection, setOpenSection] = useState(null);

    const toggleSection = (index) => {
        setOpenSection(openSection === index ? null : index);
    };

    const subscriptionPlans = [
        { name: "Mensuel", price: "14,99€", duration: "1 mois" },
        { name: "Trimestriel", price: "37,47€", duration: "3 mois" },
        { name: "Annuel", price: "134,88€", duration: "12 mois" }
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-200">
            {/* Header */}
            <div className="bg-white dark:bg-slate-800 shadow-sm">
                <div className="container-custom py-16">
                    <div className="text-center">
                        <div className="flex items-center justify-center mb-4">
                            <DocumentTextIcon className="w-12 h-12 text-blue-600 mr-4" />
                            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-slate-50">
                                Conditions Générales d'Utilisation
                            </h1>
                        </div>
                        <p className="text-xl text-gray-600 dark:text-slate-300 max-w-3xl mx-auto">
                            Les présentes conditions générales d'utilisation régissent l'usage de la plateforme PronostiX
                            et définissent les droits et obligations de chaque partie.
                        </p>
                        <div className="mt-6 text-sm text-gray-500 dark:text-slate-400">
                            Dernière mise à jour : 30 mai 2025 • Entrée en vigueur : 30 mai 2025
                        </div>
                    </div>
                </div>
            </div>

            <div className="container-custom py-16">
                <div className="max-w-4xl mx-auto">

                    {/* Table des matières */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-8">
                        <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-4">
                            📋 Table des matières
                        </h2>
                        <div className="grid md:grid-cols-2 gap-2 text-blue-800 dark:text-blue-200 text-sm">
                            <a href="#article1" className="hover:underline">1. Objet et acceptation</a>
                            <a href="#article2" className="hover:underline">2. Définitions</a>
                            <a href="#article3" className="hover:underline">3. Accès au service</a>
                            <a href="#article4" className="hover:underline">4. Abonnements et tarifs</a>
                            <a href="#article5" className="hover:underline">5. Obligations de l'utilisateur</a>
                            <a href="#article6" className="hover:underline">6. Responsabilités</a>
                            <a href="#article7" className="hover:underline">7. Propriété intellectuelle</a>
                            <a href="#article8" className="hover:underline">8. Résiliation</a>
                            <a href="#article9" className="hover:underline">9. Droit applicable</a>
                        </div>
                    </div>

                    {/* Avertissement important */}
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6 mb-8">
                        <div className="flex items-start">
                            <ExclamationTriangleIcon className="w-6 h-6 text-yellow-600 mr-3 mt-1" />
                            <div>
                                <h2 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                                    ⚠️ Avertissement Important - Jeu Responsable
                                </h2>
                                <ul className="text-yellow-700 dark:text-yellow-300 text-sm space-y-1">
                                    <li>• Les paris sportifs comportent des risques financiers</li>
                                    <li>• Aucun pronostic n'est garanti, malgré nos analyses approfondies</li>
                                    <li>• Ne pariez que l'argent que vous pouvez vous permettre de perdre</li>
                                    <li>• Si vous avez un problème avec le jeu, contactez Joueurs Info Service : 09 74 75 13 13</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Article 1 */}
                    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-8 mb-8">
                        <section id="article1" className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 dark:text-slate-50 mb-4">
                                1. Objet et acceptation des conditions
                            </h2>
                            <div className="space-y-4 text-gray-600 dark:text-slate-300">
                                <p>
                                    Les présentes Conditions Générales d'Utilisation (ci-après "CGU") ont pour objet de définir
                                    les modalités et conditions d'utilisation de la plateforme PronostiX accessible à l'adresse
                                    <a href="https://pronostix.fr" className="text-blue-600 hover:text-blue-700"> pronostix.fr</a>.
                                </p>
                                <p>
                                    L'utilisation de la plateforme implique l'acceptation pleine et entière des présentes CGU.
                                    Si vous n'acceptez pas ces conditions, vous ne devez pas utiliser nos services.
                                </p>
                                <p>
                                    PronostiX se réserve le droit de modifier ces CGU à tout moment. Les modifications entrent en vigueur
                                    dès leur publication sur la plateforme. Il appartient à l'utilisateur de consulter régulièrement
                                    les présentes conditions.
                                </p>
                            </div>
                        </section>

                        {/* Article 2 */}
                        <section id="article2" className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 dark:text-slate-50 mb-4">
                                2. Définitions
                            </h2>
                            <div className="space-y-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                    {[
                                        { term: "Plateforme", def: "Le site web PronostiX et ses services associés" },
                                        { term: "Éditeur", def: "PronostiX SAS, société éditrice de la plateforme" },
                                        { term: "Utilisateur", def: "Toute personne utilisant la plateforme" },
                                        { term: "Abonné", def: "Utilisateur ayant souscrit à un abonnement payant" },
                                        { term: "Pronostic", def: "Analyse et prédiction sur un événement sportif" },
                                        { term: "Services", def: "L'ensemble des fonctionnalités proposées par la plateforme" }
                                    ].map((item, index) => (
                                        <div key={index} className="bg-gray-50 dark:bg-slate-700 p-4 rounded-lg">
                                            <h3 className="font-semibold text-gray-900 dark:text-slate-50 text-sm mb-1">
                                                {item.term}
                                            </h3>
                                            <p className="text-gray-600 dark:text-slate-300 text-sm">
                                                {item.def}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>

                        {/* Article 3 */}
                        <section id="article3" className="mb-8">
                            <div className="flex items-center mb-4">
                                <UserIcon className="w-6 h-6 text-blue-600 mr-3" />
                                <h2 className="text-2xl font-semibold text-gray-900 dark:text-slate-50">
                                    3. Accès au service et inscription
                                </h2>
                            </div>
                            <div className="space-y-4 text-gray-600 dark:text-slate-300">
                                <h3 className="font-semibold text-gray-900 dark:text-slate-50">3.1 Conditions d'accès</h3>
                                <ul className="space-y-2 ml-4">
                                    <li>• Être âgé de 18 ans minimum (majorité légale)</li>
                                    <li>• Résider dans un pays où les paris sportifs sont autorisés</li>
                                    <li>• Disposer d'une adresse email valide</li>
                                    <li>• Accepter les présentes CGU et la politique de confidentialité</li>
                                </ul>

                                <h3 className="font-semibold text-gray-900 dark:text-slate-50 mt-6">3.2 Création de compte</h3>
                                <p>
                                    Pour accéder aux services payants, l'utilisateur doit créer un compte en fournissant des
                                    informations exactes, complètes et à jour. L'utilisateur s'engage à :
                                </p>
                                <ul className="space-y-2 ml-4">
                                    <li>• Ne créer qu'un seul compte personnel</li>
                                    <li>• Ne pas partager ses identifiants de connexion</li>
                                    <li>• Informer PronostiX de toute utilisation non autorisée de son compte</li>
                                    <li>• Maintenir la confidentialité de son mot de passe</li>
                                </ul>
                            </div>
                        </section>

                        {/* Article 4 */}
                        <section id="article4" className="mb-8">
                            <div className="flex items-center mb-4">
                                <CreditCardIcon className="w-6 h-6 text-blue-600 mr-3" />
                                <h2 className="text-2xl font-semibold text-gray-900 dark:text-slate-50">
                                    4. Abonnements et tarifs
                                </h2>
                            </div>

                            <h3 className="font-semibold text-gray-900 dark:text-slate-50 mb-4">4.1 Formules d'abonnement</h3>
                            <div className="grid md:grid-cols-3 gap-4 mb-6">
                                {subscriptionPlans.map((plan, index) => (
                                    <div key={index} className="border border-gray-200 dark:border-slate-700 rounded-lg p-4 text-center">
                                        <h3 className="font-semibold text-gray-900 dark:text-slate-50 mb-2">{plan.name}</h3>
                                        <p className="text-2xl font-bold text-blue-600 mb-1">{plan.price}</p>
                                        <p className="text-gray-600 dark:text-slate-300 text-sm">pour {plan.duration}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-4 text-gray-600 dark:text-slate-300">
                                <h3 className="font-semibold text-gray-900 dark:text-slate-50">4.2 Modalités de paiement</h3>
                                <ul className="space-y-2 ml-4">
                                    <li>• Paiement par carte bancaire via Stripe (sécurisé)</li>
                                    <li>• Prélèvement automatique pour les abonnements récurrents</li>
                                    <li>• Facturation TTC (TVA française applicable)</li>
                                    <li>• Aucun remboursement sauf exercice du droit de rétractation</li>
                                </ul>

                                <h3 className="font-semibold text-gray-900 dark:text-slate-50 mt-6">4.3 Droit de rétractation</h3>
                                <p>
                                    Conformément au Code de la consommation, vous disposez d'un délai de 14 jours pour exercer
                                    votre droit de rétractation sans avoir à justifier de motifs ni à payer de pénalités.
                                </p>

                                <h3 className="font-semibold text-gray-900 dark:text-slate-50 mt-6">4.4 Garantie satisfait ou remboursé</h3>
                                <p>
                                    En plus du droit de rétractation légal, PronostiX propose une garantie satisfait ou remboursé
                                    de 7 jours sur tous les abonnements. Cette garantie peut être exercée sans condition particulière.
                                </p>
                            </div>
                        </section>

                        {/* Article 5 */}
                        <section id="article5" className="mb-8">
                            <div className="flex items-center mb-4">
                                <ShieldCheckIcon className="w-6 h-6 text-blue-600 mr-3" />
                                <h2 className="text-2xl font-semibold text-gray-900 dark:text-slate-50">
                                    5. Obligations de l'utilisateur
                                </h2>
                            </div>
                            <div className="space-y-4 text-gray-600 dark:text-slate-300">
                                <h3 className="font-semibold text-gray-900 dark:text-slate-50">5.1 Usage conforme</h3>
                                <p>L'utilisateur s'engage à utiliser la plateforme conformément à sa destination et à :</p>
                                <ul className="space-y-2 ml-4">
                                    <li>• Respecter les lois et réglementations en vigueur</li>
                                    <li>• Ne pas porter atteinte aux droits de tiers</li>
                                    <li>• Ne pas diffuser de contenu illicite, offensant ou diffamatoire</li>
                                    <li>• Ne pas perturber le fonctionnement de la plateforme</li>
                                    <li>• Ne pas tenter d'accéder aux données d'autres utilisateurs</li>
                                </ul>

                                <h3 className="font-semibold text-gray-900 dark:text-slate-50 mt-6">5.2 Comportements interdits</h3>
                                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                                    <h4 className="font-semibold text-red-800 dark:text-red-200 mb-2">Sont strictement interdits :</h4>
                                    <ul className="space-y-1 text-red-700 dark:text-red-300 text-sm">
                                        <li>• Le partage ou la revente des pronostics à des tiers</li>
                                        <li>• L'utilisation automatisée (bots, scripts) de la plateforme</li>
                                        <li>• La création de comptes multiples pour contourner les restrictions</li>
                                        <li>• L'utilisation de fausses informations lors de l'inscription</li>
                                        <li>• Toute tentative de piratage ou d'intrusion</li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        {/* Article 6 */}
                        <section id="article6" className="mb-8">
                            <div className="flex items-center mb-4">
                                <ExclamationTriangleIcon className="w-6 h-6 text-blue-600 mr-3" />
                                <h2 className="text-2xl font-semibold text-gray-900 dark:text-slate-50">
                                    6. Responsabilités et limitations
                                </h2>
                            </div>
                            <div className="space-y-4 text-gray-600 dark:text-slate-300">
                                <h3 className="font-semibold text-gray-900 dark:text-slate-50">6.1 Nature des pronostics</h3>
                                <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
                                    <p className="text-orange-800 dark:text-orange-200 text-sm font-medium">
                                        IMPORTANT : Les pronostics proposés constituent des analyses et opinions d'experts,
                                        basées sur l'étude de statistiques et d'informations sportives. Ils ne constituent
                                        en aucun cas une garantie de gain.
                                    </p>
                                </div>

                                <h3 className="font-semibold text-gray-900 dark:text-slate-50 mt-6">6.2 Limitation de responsabilité</h3>
                                <p>PronostiX ne saurait être tenue responsable :</p>
                                <ul className="space-y-2 ml-4">
                                    <li>• Des pertes financières résultant de l'utilisation des pronostics</li>
                                    <li>• Des décisions de paris prises par l'utilisateur</li>
                                    <li>• Des interruptions temporaires du service</li>
                                    <li>• Des dommages résultant d'un usage non conforme de la plateforme</li>
                                </ul>

                                <h3 className="font-semibold text-gray-900 dark:text-slate-50 mt-6">6.3 Disponibilité du service</h3>
                                <p>
                                    PronostiX s'efforce d'assurer une disponibilité du service 24h/24, 7j/7, mais ne peut
                                    garantir une accessibilité permanente en raison de contraintes techniques, de maintenance
                                    ou de force majeure.
                                </p>
                            </div>
                        </section>

                        {/* Article 7 */}
                        <section id="article7" className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 dark:text-slate-50 mb-4">
                                7. Propriété intellectuelle
                            </h2>
                            <div className="space-y-4 text-gray-600 dark:text-slate-300">
                                <p>
                                    Tous les contenus présents sur la plateforme (textes, images, logos, analyses, algorithmes,
                                    base de données) sont protégés par le droit d'auteur et appartiennent à PronostiX ou à ses partenaires.
                                </p>
                                <p>
                                    L'abonnement confère uniquement un droit d'usage personnel et non exclusif des contenus pour
                                    la durée de l'abonnement. Toute reproduction, représentation ou exploitation des contenus
                                    à des fins commerciales est strictement interdite.
                                </p>
                                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                                    <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Utilisation autorisée</h3>
                                    <ul className="text-blue-700 dark:text-blue-300 text-sm space-y-1">
                                        <li>• Consultation personnelle des pronostics</li>
                                        <li>• Impression pour usage personnel uniquement</li>
                                        <li>• Aucune redistribution ou partage autorisé</li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        {/* Article 8 */}
                        <section id="article8" className="mb-8">
                            <div className="flex items-center mb-4">
                                <NoSymbolIcon className="w-6 h-6 text-blue-600 mr-3" />
                                <h2 className="text-2xl font-semibold text-gray-900 dark:text-slate-50">
                                    8. Résiliation et suspension
                                </h2>
                            </div>
                            <div className="space-y-4 text-gray-600 dark:text-slate-300">
                                <h3 className="font-semibold text-gray-900 dark:text-slate-50">8.1 Résiliation par l'utilisateur</h3>
                                <p>
                                    L'utilisateur peut résilier son abonnement à tout moment depuis son espace personnel.
                                    La résiliation prend effet à la fin de la période d'abonnement en cours.
                                </p>

                                <h3 className="font-semibold text-gray-900 dark:text-slate-50 mt-6">8.2 Résiliation par PronostiX</h3>
                                <p>
                                    PronostiX se réserve le droit de suspendre ou résilier immédiatement l'accès au service
                                    en cas de manquement aux présentes CGU, notamment :
                                </p>
                                <ul className="space-y-2 ml-4">
                                    <li>• Non-respect des conditions d'utilisation</li>
                                    <li>• Utilisation frauduleuse du service</li>
                                    <li>• Défaut de paiement</li>
                                    <li>• Comportement nuisant au service ou aux autres utilisateurs</li>
                                </ul>

                                <h3 className="font-semibold text-gray-900 dark:text-slate-50 mt-6">8.3 Conséquences de la résiliation</h3>
                                <p>
                                    En cas de résiliation, l'utilisateur perd immédiatement l'accès à tous les services payants.
                                    Aucun remboursement n'est dû sauf en cas de résiliation fautive de PronostiX.
                                </p>
                            </div>
                        </section>

                        {/* Article 9 */}
                        <section id="article9" className="mb-6">
                            <div className="flex items-center mb-4">
                                <ScaleIcon className="w-6 h-6 text-blue-600 mr-3" />
                                <h2 className="text-2xl font-semibold text-gray-900 dark:text-slate-50">
                                    9. Droit applicable et litiges
                                </h2>
                            </div>
                            <div className="space-y-4 text-gray-600 dark:text-slate-300">
                                <h3 className="font-semibold text-gray-900 dark:text-slate-50">9.1 Droit applicable</h3>
                                <p>
                                    Les présentes CGU sont régies par le droit français. Tout litige relatif à leur interprétation
                                    et/ou à leur exécution relève des tribunaux français.
                                </p>

                                <h3 className="font-semibold text-gray-900 dark:text-slate-50 mt-6">9.2 Résolution amiable</h3>
                                <p>
                                    En cas de litige, les parties s'efforceront de trouver une solution amiable avant toute
                                    action judiciaire. Vous pouvez nous contacter à l'adresse :
                                    <a href="mailto:legal@pronostix.fr" className="text-blue-600 hover:text-blue-700"> pronostix.service@gmail.com</a>
                                </p>

                                <h3 className="font-semibold text-gray-900 dark:text-slate-50 mt-6">9.3 Médiation de la consommation</h3>
                                <p>
                                    Conformément à l'article L. 616-1 du Code de la consommation, le consommateur a le droit
                                    de recourir gratuitement à un médiateur de la consommation en vue de la résolution amiable
                                    du litige qui l'oppose au professionnel.
                                </p>
                                <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded-lg">
                                    <p className="text-sm">
                                        <strong>Médiateur compétent :</strong> Centre de médiation et d'arbitrage de Paris<br />
                                        <strong>Site web :</strong> <a href="https://www.cmap.fr" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">www.cmap.fr</a>
                                    </p>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Contact et informations */}
                    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-8 mb-8">
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-slate-50 mb-4">
                            Contact et questions
                        </h2>
                        <div className="space-y-4 text-gray-600 dark:text-slate-300">
                            <p>
                                Pour toute question relative aux présentes conditions générales d'utilisation :
                            </p>
                            <div className="bg-gray-50 dark:bg-slate-700 p-6 rounded-lg">
                                <h3 className="font-semibold text-gray-900 dark:text-slate-50 mb-3">PronostiX SAS</h3>
                                <div className="grid md:grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p><strong>Adresse :</strong> 123 Rue du Sport, 75001 Paris</p>
                                        <p><strong>Email :</strong> <a href="mailto:legal@pronostix.fr" className="text-blue-600 hover:text-blue-700">legal@pronostix.fr</a></p>
                                    </div>
                                    <div>
                                        <p><strong>Téléphone :</strong> +33 1 23 45 67 89</p>
                                        <p><strong>Support :</strong> <a href="mailto:support@pronostix.fr" className="text-blue-600 hover:text-blue-700">support@pronostix.fr</a></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Navigation vers autres pages légales */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <Link
                            to="/mentions-legales"
                            className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow border border-gray-200 dark:border-slate-700"
                        >
                            <h3 className="font-semibold text-gray-900 dark:text-slate-50 mb-2">
                                Mentions légales
                            </h3>
                            <p className="text-gray-600 dark:text-slate-300 text-sm">
                                Informations légales sur PronostiX et notre société
                            </p>
                        </Link>

                        <Link
                            to="/privacy-policy"
                            className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow border border-gray-200 dark:border-slate-700"
                        >
                            <h3 className="font-semibold text-gray-900 dark:text-slate-50 mb-2">
                                Politique de confidentialité
                            </h3>
                            <p className="text-gray-600 dark:text-slate-300 text-sm">
                                Comment nous protégeons vos données personnelles
                            </p>
                        </Link>
                    </div>

                    {/* Dernière mise à jour */}
                    <div className="text-center mt-8 text-sm text-gray-500 dark:text-slate-400">
                        Document mis à jour le 30 mai 2025 • Version 1.0
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TermsOfService;