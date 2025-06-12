// src/pages/Legal/PrivacyPolicy.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    ShieldCheckIcon,
    EyeIcon,
    CogIcon,
    TrashIcon,
    DocumentTextIcon,
    LockClosedIcon,
    UserIcon,
    CreditCardIcon,
    ChevronDownIcon,
    ChevronUpIcon
} from '@heroicons/react/24/outline';

const PrivacyPolicy = () => {
    const [openSection, setOpenSection] = useState(null);

    const toggleSection = (index) => {
        setOpenSection(openSection === index ? null : index);
    };

    const dataTypes = [
        {
            icon: UserIcon,
            title: "Données d'identification",
            items: ["Nom et prénom", "Adresse email", "Nom d'utilisateur", "Date de création du compte"],
            purpose: "Création et gestion de votre compte utilisateur"
        },
        {
            icon: CreditCardIcon,
            title: "Données de paiement",
            items: ["Informations de facturation", "Historique des paiements", "Statut d'abonnement"],
            purpose: "Traitement des paiements et gestion des abonnements"
        },
        {
            icon: CogIcon,
            title: "Données techniques",
            items: ["Adresse IP", "Type de navigateur", "Pages visitées", "Temps de connexion"],
            purpose: "Amélioration de l'expérience utilisateur et sécurité"
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-200">
            {/* Header */}
            <div className="bg-white dark:bg-slate-800 shadow-sm">
                <div className="container-custom py-16">
                    <div className="text-center">
                        <div className="flex items-center justify-center mb-4">
                            <ShieldCheckIcon className="w-12 h-12 text-blue-600 mr-4" />
                            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-slate-50">
                                Politique de confidentialité
                            </h1>
                        </div>
                        <p className="text-xl text-gray-600 dark:text-slate-300 max-w-3xl mx-auto">
                            Chez PronostiX, nous respectons votre vie privée et protégeons vos données personnelles
                            conformément au RGPD et à la législation française.
                        </p>
                        <div className="mt-6 text-sm text-gray-500 dark:text-slate-400">
                            Dernière mise à jour : 30 mai 2025 • Entrée en vigueur : 30 mai 2025
                        </div>
                    </div>
                </div>
            </div>

            <div className="container-custom py-16">
                <div className="max-w-4xl mx-auto">

                    {/* Résumé rapide */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-8">
                        <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-4">
                            🔒 En bref
                        </h2>
                        <ul className="space-y-2 text-blue-800 dark:text-blue-200 text-sm">
                            <li>• Nous collectons uniquement les données nécessaires au fonctionnement du service</li>
                            <li>• Vos données ne sont jamais vendues à des tiers</li>
                            <li>• Vous gardez le contrôle total sur vos informations</li>
                            <li>• Notre traitement est conforme au RGPD</li>
                            <li>• Vous pouvez demander la suppression de vos données à tout moment</li>
                        </ul>
                    </div>

                    {/* 1. Responsable du traitement */}
                    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-8 mb-8">
                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 dark:text-slate-50 mb-4">
                                1. Responsable du traitement des données
                            </h2>
                            <div className="bg-gray-50 dark:bg-slate-700 p-6 rounded-lg">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <h3 className="font-semibold text-gray-900 dark:text-slate-50 mb-2">PronostiX SAS</h3>
                                        <p className="text-gray-600 dark:text-slate-300 text-sm">
                                            123 Rue du Sport<br />
                                            75001 Paris, France<br />
                                            Email : <a href="mailto:privacy@pronostix.fr" className="text-blue-600 hover:text-blue-700">privacy@pronostix.fr</a>
                                        </p>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 dark:text-slate-50 mb-2">Délégué à la Protection des Données</h3>
                                        <p className="text-gray-600 dark:text-slate-300 text-sm">
                                            Email : <a href="mailto:dpo@pronostix.fr" className="text-blue-600 hover:text-blue-700">dpo@pronostix.fr</a><br />
                                            Pour toute question relative à vos données personnelles
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* 2. Données collectées */}
                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 dark:text-slate-50 mb-6">
                                2. Quelles données collectons-nous ?
                            </h2>
                            <div className="grid gap-6">
                                {dataTypes.map((dataType, index) => (
                                    <div key={index} className="border border-gray-200 dark:border-slate-700 rounded-lg p-6">
                                        <div className="flex items-start mb-4">
                                            <dataType.icon className="w-6 h-6 text-blue-600 mr-3 mt-1" />
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-gray-900 dark:text-slate-50 mb-2">
                                                    {dataType.title}
                                                </h3>
                                                <p className="text-gray-600 dark:text-slate-300 text-sm mb-3">
                                                    <strong>Finalité :</strong> {dataType.purpose}
                                                </p>
                                                <ul className="text-gray-600 dark:text-slate-300 text-sm space-y-1">
                                                    {dataType.items.map((item, i) => (
                                                        <li key={i} className="flex items-center">
                                                            <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                                                            {item}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* 3. Base légale */}
                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 dark:text-slate-50 mb-4">
                                3. Base légale du traitement
                            </h2>
                            <div className="space-y-4 text-gray-600 dark:text-slate-300">
                                <p>Nos traitements de données personnelles sont fondés sur :</p>
                                <ul className="space-y-3">
                                    <li className="flex items-start">
                                        <span className="w-6 h-6 bg-green-100 dark:bg-green-900 text-green-600 rounded-full text-sm flex items-center justify-center mr-3 mt-0.5">✓</span>
                                        <div>
                                            <strong>L'exécution du contrat :</strong> Pour la création de votre compte, la gestion de votre abonnement et la fourniture de nos services.
                                        </div>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="w-6 h-6 bg-green-100 dark:bg-green-900 text-green-600 rounded-full text-sm flex items-center justify-center mr-3 mt-0.5">✓</span>
                                        <div>
                                            <strong>Votre consentement :</strong> Pour l'envoi de newsletters et communications marketing (révocable à tout moment).
                                        </div>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="w-6 h-6 bg-green-100 dark:bg-green-900 text-green-600 rounded-full text-sm flex items-center justify-center mr-3 mt-0.5">✓</span>
                                        <div>
                                            <strong>L'intérêt légitime :</strong> Pour l'amélioration de nos services, la sécurité et la prévention de la fraude.
                                        </div>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="w-6 h-6 bg-green-100 dark:bg-green-900 text-green-600 rounded-full text-sm flex items-center justify-center mr-3 mt-0.5">✓</span>
                                        <div>
                                            <strong>L'obligation légale :</strong> Pour respecter nos obligations comptables et fiscales.
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </section>

                        {/* 4. Durée de conservation */}
                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 dark:text-slate-50 mb-4">
                                4. Durée de conservation
                            </h2>
                            <div className="overflow-x-auto">
                                <table className="w-full border border-gray-200 dark:border-slate-700 rounded-lg">
                                    <thead className="bg-gray-50 dark:bg-slate-700">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-slate-50">Type de données</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-slate-50">Durée de conservation</th>
                                    </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                                    <tr>
                                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-slate-300">Données de compte utilisateur</td>
                                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-slate-300">Durée d'utilisation du service + 3 ans</td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-slate-300">Données de facturation</td>
                                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-slate-300">10 ans (obligation légale)</td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-slate-300">Logs de connexion</td>
                                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-slate-300">12 mois maximum</td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-slate-300">Données de navigation (cookies)</td>
                                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-slate-300">13 mois maximum</td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </section>

                        {/* 5. Partage des données */}
                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 dark:text-slate-50 mb-4">
                                5. Partage des données
                            </h2>
                            <div className="space-y-4 text-gray-600 dark:text-slate-300">
                                <p className="font-medium text-gray-900 dark:text-slate-50">
                                    Nous ne vendons jamais vos données personnelles.
                                </p>
                                <p>Nous pouvons partager vos données uniquement avec :</p>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="border border-gray-200 dark:border-slate-700 rounded-lg p-4">
                                        <h3 className="font-semibold text-gray-900 dark:text-slate-50 mb-2">
                                            Stripe (Processeur de paiement)
                                        </h3>
                                        <p className="text-sm">
                                            Pour traiter vos paiements de manière sécurisée. Stripe est certifié PCI DSS et conforme au RGPD.
                                        </p>
                                    </div>
                                    <div className="border border-gray-200 dark:border-slate-700 rounded-lg p-4">
                                        <h3 className="font-semibold text-gray-900 dark:text-slate-50 mb-2">
                                            Services d'hébergement
                                        </h3>
                                        <p className="text-sm">
                                            Nos partenaires d'infrastructure (Vercel, MongoDB Atlas) stockent vos données dans des centres sécurisés.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* 6. Sécurité */}
                        <section className="mb-8">
                            <div className="flex items-center mb-4">
                                <LockClosedIcon className="w-6 h-6 text-blue-600 mr-3" />
                                <h2 className="text-2xl font-semibold text-gray-900 dark:text-slate-50">
                                    6. Sécurité des données
                                </h2>
                            </div>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <h3 className="font-semibold text-gray-900 dark:text-slate-50">Mesures techniques</h3>
                                    <ul className="space-y-2 text-gray-600 dark:text-slate-300 text-sm">
                                        <li>• Chiffrement SSL/TLS pour toutes les communications</li>
                                        <li>• Hachage sécurisé des mots de passe (bcrypt)</li>
                                        <li>• Authentification par tokens JWT</li>
                                        <li>• Surveillance des accès et logs de sécurité</li>
                                    </ul>
                                </div>
                                <div className="space-y-4">
                                    <h3 className="font-semibold text-gray-900 dark:text-slate-50">Mesures organisationnelles</h3>
                                    <ul className="space-y-2 text-gray-600 dark:text-slate-300 text-sm">
                                        <li>• Accès aux données limité aux employés autorisés</li>
                                        <li>• Formation régulière à la sécurité</li>
                                        <li>• Procédures de réponse aux incidents</li>
                                        <li>• Audits de sécurité réguliers</li>
                                    </ul>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Vos droits */}
                    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-8 mb-8">
                        <div className="flex items-center mb-6">
                            <UserIcon className="w-6 h-6 text-blue-600 mr-3" />
                            <h2 className="text-2xl font-semibold text-gray-900 dark:text-slate-50">
                                7. Vos droits RGPD
                            </h2>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            {[
                                {
                                    icon: EyeIcon,
                                    title: "Droit d'accès",
                                    description: "Vous pouvez demander une copie de toutes les données que nous détenons sur vous."
                                },
                                {
                                    icon: CogIcon,
                                    title: "Droit de rectification",
                                    description: "Vous pouvez demander la correction de données inexactes ou incomplètes."
                                },
                                {
                                    icon: TrashIcon,
                                    title: "Droit à l'effacement",
                                    description: "Vous pouvez demander la suppression de vos données personnelles."
                                },
                                {
                                    icon: DocumentTextIcon,
                                    title: "Droit à la portabilité",
                                    description: "Vous pouvez récupérer vos données dans un format structuré."
                                }
                            ].map((right, index) => (
                                <div key={index} className="flex items-start p-4 border border-gray-200 dark:border-slate-700 rounded-lg">
                                    <right.icon className="w-6 h-6 text-blue-600 mr-3 mt-1" />
                                    <div>
                                        <h3 className="font-semibold text-gray-900 dark:text-slate-50 mb-2">
                                            {right.title}
                                        </h3>
                                        <p className="text-gray-600 dark:text-slate-300 text-sm">
                                            {right.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                                Comment exercer vos droits ?
                            </h3>
                            <p className="text-blue-800 dark:text-blue-200 text-sm mb-3">
                                Envoyez un email à <a href="mailto:privacy@pronostix.fr" className="underline">privacy@pronostix.fr</a>
                                avec une pièce d'identité pour vérification. Nous répondrons sous 30 jours maximum.
                            </p>
                            <p className="text-blue-800 dark:text-blue-200 text-sm">
                                Vous avez également le droit de déposer une plainte auprès de la CNIL :
                                <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="underline ml-1">
                                    www.cnil.fr
                                </a>
                            </p>
                        </div>
                    </div>

                    {/* Cookies */}
                    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-8 mb-8">
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-slate-50 mb-4">
                            8. Cookies et technologies similaires
                        </h2>
                        <div className="space-y-4 text-gray-600 dark:text-slate-300">
                            <p>
                                Nous utilisons des cookies pour améliorer votre expérience et analyser l'utilisation de notre site.
                            </p>
                            <div className="grid md:grid-cols-3 gap-4">
                                <div className="border border-gray-200 dark:border-slate-700 rounded-lg p-4">
                                    <h3 className="font-semibold text-gray-900 dark:text-slate-50 mb-2">Cookies essentiels</h3>
                                    <p className="text-sm">Nécessaires au fonctionnement du site (authentification, panier)</p>
                                </div>
                                <div className="border border-gray-200 dark:border-slate-700 rounded-lg p-4">
                                    <h3 className="font-semibold text-gray-900 dark:text-slate-50 mb-2">Cookies analytiques</h3>
                                    <p className="text-sm">Pour comprendre comment vous utilisez notre site (avec votre consentement)</p>
                                </div>
                                <div className="border border-gray-200 dark:border-slate-700 rounded-lg p-4">
                                    <h3 className="font-semibold text-gray-900 dark:text-slate-50 mb-2">Cookies marketing</h3>
                                    <p className="text-sm">Pour personnaliser les publicités (avec votre consentement)</p>
                                </div>
                            </div>
                            <p className="text-sm">
                                Vous pouvez gérer vos préférences de cookies dans les paramètres de votre navigateur ou
                                via notre bannière de consentement.
                            </p>
                        </div>
                    </div>

                    {/* Contact et modifications */}
                    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-8 mb-8">
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-slate-50 mb-4">
                            9. Contact et modifications
                        </h2>
                        <div className="space-y-4 text-gray-600 dark:text-slate-300">
                            <p>
                                Cette politique de confidentialité peut être modifiée pour refléter les changements
                                dans nos pratiques ou la législation. Nous vous informerons de tout changement significatif.
                            </p>
                            <p>
                                Pour toute question sur cette politique ou sur le traitement de vos données personnelles :
                            </p>
                            <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded-lg">
                                <p className="font-medium text-gray-900 dark:text-slate-50">Contact</p>
                                <p>Email : <a href="mailto:privacy@pronostix.fr" className="text-blue-600 hover:text-blue-700">privacy@pronostix.fr</a></p>
                                <p>Adresse : 123 Rue du Sport, 75001 Paris, France</p>
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
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;