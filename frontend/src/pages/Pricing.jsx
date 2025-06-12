// src/pages/Pricing.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Pricing = () => {
    const [selectedPlan, setSelectedPlan] = useState('quarterly');
    const { isAuthenticated } = useAuth();

    const plans = {
        monthly: {
            id: 'monthly',
            name: 'Mensuel',
            price: 14.99,
            period: 'mois',
            totalPrice: 14.99,
            savings: null,
            description: 'Parfait pour commencer',
            badge: null,
            buttonText: 'Commencer - 14,99€/mois'
        },
        quarterly: {
            id: 'quarterly',
            name: 'Trimestriel',
            price: 12.49,
            originalPrice: 14.99,
            period: 'mois',
            totalPrice: 37.47,
            savings: '17%',
            description: 'Le plus populaire',
            badge: 'Plus populaire',
            buttonText: 'Choisir - 37,47€ tous les 3 mois'
        },
        annually: {
            id: 'annually',
            name: 'Annuel',
            price: 11.24,
            originalPrice: 14.99,
            period: 'mois',
            totalPrice: 134.88,
            savings: '25%',
            description: 'Meilleure économie',
            badge: 'Meilleur prix',
            buttonText: 'Choisir - 134,88€/an'
        }
    };


    const features = [
        'Pronostics illimités sur tous les sports',
        'Analyses détaillées de chaque match',
        'Statistiques et historique complet',
        'Notifications en temps réel',
        'Conseils de bankroll management',
        'Support client prioritaire',
        'Accès mobile et desktop',
        'Historique des performances',
        'Taux de réussite transparents',
        'Résiliation à tout moment'
    ];

    const handleSubscribe = (planId) => {
        if (!isAuthenticated) {
            // Rediriger vers inscription avec le plan sélectionné
            window.location.href = `/register?plan=${planId}`;
        } else {
            // Rediriger vers checkout
            window.location.href = `/checkout?plan=${planId}`;
        }
    };

    return (
        <div className="min-h-screen py-12 bg-white dark:bg-slate-900">
            <div className="container-custom">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-slate-100 mb-4">
                        Un seul abonnement,<br />
                        <span className="text-gradient">tous les avantages</span>
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-slate-300 max-w-2xl mx-auto mb-8">
                        Accédez à tous nos pronostics sportifs avec un abonnement simple et transparent.
                        Choisissez la durée qui vous convient.
                    </p>
                </div>

                {/* Plan Selection Cards */}
                <div className="grid md:grid-cols-3 gap-8 mb-16 max-w-5xl mx-auto">
                    {Object.values(plans).map((plan) => (
                        <PricingCard
                            key={plan.id}
                            plan={plan}
                            isSelected={selectedPlan === plan.id}
                            onSelect={() => setSelectedPlan(plan.id)}
                            onSubscribe={() => handleSubscribe(plan.id)}
                            isAuthenticated={isAuthenticated}
                        />
                    ))}
                </div>

                {/* Features Section */}
                <FeaturesSection features={features} />

                {/* FAQ Section */}
                <FAQSection />

                {/* Guarantees */}
                <GuaranteesSection />

                {/* CTA Final */}
                <CTASection selectedPlan={plans[selectedPlan]} onSubscribe={() => handleSubscribe(selectedPlan)} />
            </div>
        </div>
    );
};

// Composant pour une carte de prix
const PricingCard = ({ plan, isSelected, onSelect, onSubscribe, isAuthenticated }) => {
    const isPopular = plan.id === 'quarterly';

    return (
        <div
            className={`
                card card-white card-padding-xl relative cursor-pointer transition-all duration-200
                ${isSelected
                ? 'ring-2 ring-blue-500 shadow-2xl transform scale-105 bg-blue-50 dark:bg-slate-700'
                : 'hover:shadow-xl hover:border-blue-300 hover:bg-gray-50 dark:hover:bg-slate-700'
            }
                ${isPopular ? 'border-blue-200' : ''}
            `}
            onClick={onSelect}
        >
            {/* Badge */}
            {plan.badge && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                        plan.id === 'quarterly'
                            ? 'bg-blue-500 text-white'
                            : 'bg-green-500 text-white'
                    }`}>
                        {plan.id === 'annually' ? 'Meilleur prix' : plan.badge}
                    </span>
                </div>
            )}

            {/* Plan Header */}
            <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-2">{plan.name}</h3>
                <p className="text-gray-600 dark:text-slate-400 mb-4">{plan.description}</p>

                {/* Price */}
                <div className="mb-4">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        {plan.originalPrice && (
                            <span className="text-lg text-gray-400 dark:text-slate-500 line-through">
                                {plan.originalPrice}€
                            </span>
                        )}
                        <span className="text-4xl font-bold text-gray-900 dark:text-slate-100">
                            {plan.price}€
                        </span>
                    </div>
                    <span className="text-gray-600 dark:text-slate-400">/{plan.period}</span>

                    {/* Savings & Total */}
                    {plan.savings && (
                        <div className="mt-3">
                            <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-3 py-1 rounded-full text-sm font-medium">
                                Économisez {plan.savings}
                            </span>
                            <p className="text-sm text-gray-600 dark:text-slate-400 mt-2">
                                {plan.totalPrice}€ facturé {plan.id === 'quarterly' ? 'tous les 3 mois' : 'annuellement'}
                            </p>
                        </div>
                    )}

                    {/* Monthly billing info */}
                    {plan.id === 'monthly' && (
                        <p className="text-sm text-gray-600 dark:text-slate-400 mt-2">
                            {plan.totalPrice}€ facturé mensuellement
                        </p>
                    )}
                </div>
            </div>

            {/* Selection Indicator */}
            <div className="flex items-center justify-center mb-6">
                <div className={`
                    w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200
                    ${isSelected
                    ? 'border-blue-500 bg-blue-500 shadow-md'
                    : 'border-gray-300 dark:border-slate-600 hover:border-blue-400'
                }
                `}>
                    {isSelected && (
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                    )}
                </div>
            </div>

            {/* Action Button */}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onSubscribe();
                }}
                className={`w-full btn btn-lg transition-all duration-200 ${
                    isSelected
                        ? 'btn-primary shadow-lg hover:shadow-xl hover:bg-blue-700'
                        : 'btn-outline hover:btn-primary hover:shadow-md hover:border-blue-500'
                }`}
            >
                {plan.buttonText}
            </button>

            <p className="text-center text-sm text-gray-500 dark:text-slate-400 mt-4">
                Sans engagement • Résiliation à tout moment
            </p>
        </div>
    );
};

// Section des fonctionnalités
const FeaturesSection = ({ features }) => {
    return (
        <section className="mb-16">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-slate-100 mb-4">
                    Tout inclus dans votre abonnement
                </h2>
                <p className="text-xl text-gray-600 dark:text-slate-300">
                    Un seul prix, toutes les fonctionnalités
                </p>
            </div>

            <div className="max-w-4xl mx-auto">
                <div className="grid md:grid-cols-2 gap-6">
                    {features.map((feature, index) => (
                        <div key={index} className="flex items-start">
                            <svg className="w-6 h-6 text-green-500 mr-4 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            <span className="text-gray-700 dark:text-slate-300 font-medium">{feature}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

// Section FAQ
const FAQSection = () => {
    const [openFAQ, setOpenFAQ] = useState(null);

    const faqs = [
        {
            question: "Puis-je changer la durée de mon abonnement ?",
            answer: "Oui, vous pouvez passer d'un abonnement mensuel à trimestriel ou annuel à tout moment depuis votre espace personnel. Les changements sont proratisés automatiquement."
        },
        {
            question: "Y a-t-il une période d'essai gratuite ?",
            answer: "Nous n'offrons pas d'essai gratuit, mais vous bénéficiez d'une garantie de remboursement de 7 jours. Si vous n'êtes pas satisfait, nous vous remboursons intégralement."
        },
        {
            question: "Puis-je annuler mon abonnement à tout moment ?",
            answer: "Absolument ! Vous pouvez annuler votre abonnement à tout moment depuis votre espace personnel. L'annulation prend effet à la fin de la période de facturation en cours."
        },
        {
            question: "Quels sports sont couverts ?",
            answer: "Nous couvrons tous les sports majeurs : football, tennis, basketball, hockey, baseball, et bien d'autres. La liste complète est disponible dans votre espace membre."
        },
        {
            question: "Les statistiques sont-elles vérifiables ?",
            answer: "Oui, toutes nos statistiques sont transparentes et vérifiables. Vous pouvez consulter l'historique complet de nos pronostics et performances dans votre espace membre."
        },
        {
            question: "Comment puis-je vous contacter ?",
            answer: "Notre support client est disponible par email, chat en direct et téléphone. Les abonnés bénéficient d'un support prioritaire avec des temps de réponse garantis."
        }
    ];

    return (
        <section className="mb-16">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-slate-100 mb-4">
                    Questions fréquentes
                </h2>
                <p className="text-xl text-gray-600 dark:text-slate-300">
                    Tout ce que vous devez savoir sur votre abonnement
                </p>
            </div>

            <div className="max-w-3xl mx-auto">
                {faqs.map((faq, index) => (
                    <div key={index} className="border-b border-gray-200 dark:border-slate-700 last:border-b-0">
                        <button
                            className="w-full py-6 text-left flex justify-between items-center text-gray-900 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                            onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                        >
                            <span className="font-semibold text-lg pr-8">{faq.question}</span>
                            <svg
                                className={`w-5 h-5 transition-transform ${openFAQ === index ? 'rotate-180' : ''}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        {openFAQ === index && (
                            <div className="pb-6 text-gray-600 dark:text-slate-400 animate-fade-in">
                                {faq.answer}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
};

// Section Garanties
const GuaranteesSection = () => {
    const guarantees = [
        {
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
            ),
            title: "Paiements sécurisés",
            description: "Tous vos paiements sont sécurisés par Stripe, leader mondial du paiement en ligne."
        },
        {
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
            ),
            title: "Garantie 7 jours",
            description: "Testez notre service sans risque. Pas satisfait ? Nous vous remboursons intégralement."
        },
        {
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            title: "Support prioritaire",
            description: "Bénéficiez d'un support client dédié avec des temps de réponse garantis."
        }
    ];

    return (
        <section className="bg-gray-50 dark:bg-slate-800 rounded-2xl p-8 mb-16">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-2">
                    Nos garanties
                </h2>
                <p className="text-gray-600 dark:text-slate-300">
                    Votre satisfaction est notre priorité
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {guarantees.map((guarantee, index) => (
                    <div key={index} className="text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full mb-4">
                            {guarantee.icon}
                        </div>
                        <h3 className="font-semibold text-gray-900 dark:text-slate-100 mb-2">{guarantee.title}</h3>
                        <p className="text-gray-600 dark:text-slate-300 text-sm">{guarantee.description}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};

// Section CTA finale
const CTASection = ({ selectedPlan, onSubscribe }) => {
    return (
        <section className="text-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-800 dark:to-slate-700 rounded-2xl p-12 border border-gray-200 dark:border-slate-600">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-slate-100 mb-4">
                Prêt à améliorer vos paris sportifs ?
            </h2>
            <p className="text-xl text-gray-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto">
                Rejoignez des milliers de parieurs qui nous font confiance pour leurs pronostics quotidiens.
            </p>

            <div className="bg-white dark:bg-slate-700 rounded-xl p-6 max-w-md mx-auto mb-8 shadow-lg border border-gray-200 dark:border-slate-600">
                <h3 className="font-semibold text-gray-900 dark:text-slate-100 mb-2">Plan sélectionné :</h3>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{selectedPlan.name}</p>
                <p className="text-gray-600 dark:text-slate-400">{selectedPlan.price}€/{selectedPlan.period}</p>
                {selectedPlan.savings && (
                    <p className="text-green-600 dark:text-green-400 font-medium mt-2">
                        Économisez {selectedPlan.savings} !
                    </p>
                )}
            </div>

            <button
                onClick={onSubscribe}
                className="btn btn-primary btn-lg px-12 shadow-lg hover:shadow-xl transition-all"
            >
                Commencer maintenant
            </button>

            <p className="text-sm text-gray-500 dark:text-slate-400 mt-4">
                Résiliation possible à tout moment • Garantie 7 jours
            </p>
        </section>
    );
};

export default Pricing;