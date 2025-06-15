// src/pages/HelpCenter.jsx
import React, { useState } from 'react';
import {
    MagnifyingGlassIcon,
    QuestionMarkCircleIcon,
    CreditCardIcon,
    UserCircleIcon,
    TrophyIcon,
    ShieldCheckIcon,
    ChevronDownIcon,
    ChevronUpIcon,
    ChatBubbleLeftRightIcon,
    EnvelopeIcon,
    PhoneIcon
} from '@heroicons/react/24/outline';

const HelpCenter = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('all');
    const [openFaq, setOpenFaq] = useState(null);

    const categories = [
        { id: 'all', name: 'Toutes les catégories', icon: QuestionMarkCircleIcon, count: 24 },
        { id: 'account', name: 'Compte & Profil', icon: UserCircleIcon, count: 6 },
        { id: 'subscription', name: 'Abonnements', icon: CreditCardIcon, count: 8 },
        { id: 'pronostics', name: 'Pronostics', icon: TrophyIcon, count: 7 },
        { id: 'security', name: 'Sécurité', icon: ShieldCheckIcon, count: 3 }
    ];

    /*
    ===== GUIDES RAPIDES - DONNÉES À UTILISER PLUS TARD =====

    const quickGuides = [
        {
            title: "Premier pas sur PronostiX",
            description: "Guide complet pour débuter",
            duration: "5 min",
            steps: ["Créer un compte", "Choisir un abonnement", "Accéder aux pronostics"],
            color: "bg-blue-500"
        },
        {
            title: "Gérer mon abonnement",
            description: "Tout savoir sur votre abonnement",
            duration: "3 min",
            steps: ["Modifier mon plan", "Annuler/Réactiver", "Consulter l'historique"],
            color: "bg-green-500"
        },
        {
            title: "Comprendre les pronostics",
            description: "Types de paris et stratégies",
            duration: "7 min",
            steps: ["Types de paris", "Cotes et probabilités", "Gestion de bankroll"],
            color: "bg-purple-500"
        },
        {
            title: "Sécurité du compte",
            description: "Protéger votre compte",
            duration: "4 min",
            steps: ["Mot de passe fort", "Vérification email", "Déconnexion sécurisée"],
            color: "bg-orange-500"
        }
    ];

    ===== FIN DONNÉES GUIDES =====
    */

    const faqData = [
        {
            category: 'account',
            question: "Comment créer un compte ?",
            answer: "Pour créer un compte, cliquez sur 'S'inscrire' en haut de la page, remplissez le formulaire avec vos informations (nom, email, mot de passe) et validez votre email via le lien reçu."
        },
        {
            category: 'account',
            question: "J'ai oublié mon mot de passe, que faire ?",
            answer: "Cliquez sur 'Mot de passe oublié' sur la page de connexion, saisissez votre email et suivez les instructions du email de réinitialisation que vous recevrez."
        },
        {
            category: 'account',
            question: "Comment modifier mes informations personnelles ?",
            answer: "Connectez-vous à votre compte, allez dans 'Mon Profil' > 'Paramètres' pour modifier vos informations personnelles comme nom, email ou mot de passe."
        },
        {
            category: 'account',
            question: "Puis-je supprimer mon compte ?",
            answer: "Oui, vous pouvez supprimer votre compte depuis les paramètres. Attention : cette action est irréversible et supprimera toutes vos données."
        },
        {
            category: 'subscription',
            question: "Quels sont les différents plans d'abonnement ?",
            answer: "Nous proposons 3 plans : Mensuel (14,99€), Trimestriel (37,47€) et Annuel (134,88€). Chaque plan donne accès à tous nos pronostics exclusifs."
        },
        {
            category: 'subscription',
            question: "Comment souscrire à un abonnement ?",
            answer: "Rendez-vous sur la page 'Tarifs', choisissez votre plan et suivez le processus de paiement sécurisé via Stripe. L'accès est immédiat après paiement."
        },
        {
            category: 'subscription',
            question: "Puis-je changer de plan en cours d'abonnement ?",
            answer: "Oui, vous pouvez passer à un plan supérieur à tout moment. Le prorata sera calculé automatiquement. Pour rétrograder, le changement s'appliquera au prochain cycle."
        },
        {
            category: 'subscription',
            question: "Comment annuler mon abonnement ?",
            answer: "Allez dans 'Mon Profil' > 'Abonnement' et cliquez sur 'Annuler'. Votre abonnement restera actif jusqu'à la fin de la période payée."
        },
        {
            category: 'subscription',
            question: "Proposez-vous une période d'essai ?",
            answer: "Nous proposons une garantie satisfait ou remboursé de 7 jours sur tous nos plans. Si vous n'êtes pas satisfait, nous vous remboursons intégralement."
        },
        {
            category: 'subscription',
            question: "Quels modes de paiement acceptez-vous ?",
            answer: "Nous acceptons toutes les cartes bancaires (Visa, Mastercard, Amex) via notre partenaire sécurisé Stripe. Aucune donnée bancaire n'est stockée sur nos serveurs."
        },
        {
            category: 'pronostics',
            question: "À quelle fréquence publiez-vous des pronostics ?",
            answer: "Nous publions 3-5 pronostics par jour en moyenne, avec une analyse détaillée pour chaque pari. Plus de pronostics sont disponibles les weekends."
        },
        {
            category: 'pronostics',
            question: "Sur quels sports proposez-vous des pronostics ?",
            answer: "Nous couvrons principalement le football et le tennis, avec occasionnellement du basketball, handball et volleyball selon les événements majeurs."
        },
        {
            category: 'pronostics',
            question: "Comment sont calculées vos statistiques de réussite ?",
            answer: "Nos statistiques sont calculées sur tous les pronostics publiés, sans exclusion. Nous affichons le taux de réussite, le ROI et le profit/perte en temps réel."
        },
        {
            category: 'pronostics',
            question: "Puis-je recevoir des notifications pour les nouveaux pronostics ?",
            answer: "Oui, vous pouvez activer les notifications email dans vos paramètres de compte pour être alerté dès qu'un nouveau pronostic est publié."
        },
        {
            category: 'pronostics',
            question: "Vos pronostics sont-ils garantis ?",
            answer: "Aucun pronostic n'est garanti dans le monde du sport. Nous partageons nos analyses et convictions, mais les paris restent soumis aux aléas sportifs."
        },
        {
            category: 'security',
            question: "Mes données personnelles sont-elles sécurisées ?",
            answer: "Oui, nous utilisons un chiffrement SSL/TLS pour toutes les communications et respectons le RGPD. Vos données ne sont jamais partagées avec des tiers."
        },
        {
            category: 'security',
            question: "Comment protéger mon compte ?",
            answer: "Utilisez un mot de passe fort et unique, ne le partagez jamais, et déconnectez-vous après utilisation sur des ordinateurs publics."
        }
    ];

    const filteredFaq = faqData.filter(item => {
        const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
        const matchesSearch = searchQuery === '' ||
            item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.answer.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const toggleFaq = (index) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-200">
            {/* Header */}
            <div className="bg-white dark:bg-slate-800 shadow-sm">
                <div className="container-custom py-16">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-slate-50 mb-4">
                            Centre d'aide
                        </h1>
                        <p className="text-xl text-gray-600 dark:text-slate-300 max-w-2xl mx-auto mb-8">
                            Trouvez rapidement les réponses à toutes vos questions sur PronostiX
                        </p>

                        {/* Barre de recherche */}
                        <div className="max-w-2xl mx-auto relative">
                            <div className="relative">
                                <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Rechercher dans l'aide..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 border border-gray-300 dark:border-slate-600 rounded-lg
                                             bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100
                                             focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors
                                             text-lg"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container-custom py-16">
                {/*
                ===== GUIDES RAPIDES - À IMPLÉMENTER PLUS TARD =====

                <div className="mb-16">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-50 mb-8">
                        Guides rapides
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {quickGuides.map((guide, index) => (
                            <div key={index} className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                                <div className={`w-12 h-12 ${guide.color} rounded-lg flex items-center justify-center mb-4`}>
                                    <span className="text-white text-xl">📚</span>
                                </div>
                                <h3 className="font-semibold text-gray-900 dark:text-slate-50 mb-2">
                                    {guide.title}
                                </h3>
                                <p className="text-gray-600 dark:text-slate-300 text-sm mb-4">
                                    {guide.description}
                                </p>
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-xs text-gray-500 dark:text-slate-400 bg-gray-100 dark:bg-slate-700 px-2 py-1 rounded">
                                        ⏱️ {guide.duration}
                                    </span>
                                </div>
                                <ul className="text-xs text-gray-600 dark:text-slate-300 space-y-1 mb-4">
                                    {guide.steps.map((step, i) => (
                                        <li key={i} className="flex items-center">
                                            <span className="w-4 h-4 bg-blue-100 dark:bg-blue-900 text-blue-600 rounded-full text-xs flex items-center justify-center mr-2">
                                                {i + 1}
                                            </span>
                                            {step}
                                        </li>
                                    ))}
                                </ul>
                                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                                    Voir le guide →
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                ===== FIN GUIDES RAPIDES =====
                */}

                <div className="grid lg:grid-cols-4 gap-12">
                    {/* Catégories */}
                    <div className="lg:col-span-1">
                        <h3 className="font-semibold text-gray-900 dark:text-slate-50 mb-4">
                            Catégories
                        </h3>
                        <div className="space-y-2">
                            {categories.map((category) => (
                                <button
                                    key={category.id}
                                    onClick={() => setActiveCategory(category.id)}
                                    className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors
                                              ${activeCategory === category.id
                                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 border border-blue-200 dark:border-blue-800'
                                        : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-300 border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700'
                                    }`}
                                >
                                    <div className="flex items-center">
                                        <category.icon className="w-5 h-5 mr-3" />
                                        <span className="text-sm font-medium">{category.name}</span>
                                    </div>
                                    <span className={`text-xs px-2 py-1 rounded-full
                                                   ${activeCategory === category.id
                                        ? 'bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200'
                                        : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-400'
                                    }`}>
                                        {category.count}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* FAQ */}
                    <div className="lg:col-span-3">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-slate-50">
                                Questions fréquentes
                            </h3>
                            <span className="text-sm text-gray-500 dark:text-slate-400">
                                {filteredFaq.length} question(s) trouvée(s)
                            </span>
                        </div>

                        <div className="space-y-4">
                            {filteredFaq.map((faq, index) => (
                                <div key={index} className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700">
                                    <button
                                        onClick={() => toggleFaq(index)}
                                        className="w-full flex items-center justify-between p-6 text-left"
                                    >
                                        <h4 className="font-medium text-gray-900 dark:text-slate-50 pr-4">
                                            {faq.question}
                                        </h4>
                                        {openFaq === index ? (
                                            <ChevronUpIcon className="w-5 h-5 text-gray-400 flex-shrink-0" />
                                        ) : (
                                            <ChevronDownIcon className="w-5 h-5 text-gray-400 flex-shrink-0" />
                                        )}
                                    </button>
                                    {openFaq === index && (
                                        <div className="px-6 pb-6 border-t border-gray-100 dark:border-slate-700 pt-4">
                                            <p className="text-gray-600 dark:text-slate-300 leading-relaxed">
                                                {faq.answer}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {filteredFaq.length === 0 && (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <MagnifyingGlassIcon className="w-8 h-8 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 dark:text-slate-50 mb-2">
                                    Aucun résultat trouvé
                                </h3>
                                <p className="text-gray-600 dark:text-slate-300">
                                    Essayez d'autres termes de recherche ou consultez nos guides rapides.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Contact rapide */}
            <div className="bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-slate-700">
                <div className="container-custom py-16">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-slate-50 mb-4">
                            Vous ne trouvez pas votre réponse ?
                        </h2>
                        <p className="text-gray-600 dark:text-slate-300 max-w-2xl mx-auto">
                            Notre équipe support est là pour vous aider. Contactez-nous via le canal qui vous convient le mieux.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                        <a
                            href="/contact"
                            className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 text-center hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors group"
                        >
                            <EnvelopeIcon className="w-8 h-8 text-blue-600 mx-auto mb-4" />
                            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                                Email
                            </h3>
                            <p className="text-blue-700 dark:text-blue-300 text-sm">
                                Réponse sous 24h
                            </p>
                        </a>

                        <a
                            href="#"
                            className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6 text-center hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors group"
                        >
                            <ChatBubbleLeftRightIcon className="w-8 h-8 text-green-600 mx-auto mb-4" />
                            <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">
                                Chat en direct
                            </h3>
                            <p className="text-green-700 dark:text-green-300 text-sm">
                                Lun-Ven 9h-18h
                            </p>
                        </a>

                        <a
                            href="tel:+33123456789"
                            className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-6 text-center hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors group"
                        >
                            <PhoneIcon className="w-8 h-8 text-purple-600 mx-auto mb-4" />
                            <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">
                                Téléphone
                            </h3>
                            <p className="text-purple-700 dark:text-purple-300 text-sm">
                                +33 1 23 45 67 89
                            </p>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HelpCenter;