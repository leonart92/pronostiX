// src/pages/Contact.jsx
import React, { useState } from 'react';
import {
    EnvelopeIcon,
    PhoneIcon,
    MapPinIcon,
    ClockIcon,
    UserIcon,
    BuildingOfficeIcon,
    ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import { contactService } from '../services/contact.service';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        category: 'general',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const contactCategories = [
        { value: 'general', label: 'Demande générale' },
        { value: 'subscription', label: 'Questions abonnement' },
        { value: 'technical', label: 'Support technique' },
        { value: 'partnership', label: 'Partenariat' },
        { value: 'press', label: 'Presse & Média' },
        { value: 'other', label: 'Autre' }
    ];

    const contactInfo = [
        {
            icon: EnvelopeIcon,
            title: 'Email de support',
            content: 'pronostix.service@gmail.com',
            description: 'Réponse sous 4h'
        },
        {
            icon: MapPinIcon,
            title: 'Adresse',
            content: '4 All. Alfred Sisley, Levallois-Perret, 91100',
            description: 'France'
        },
        {
            icon: ClockIcon,
            title: 'Horaires',
            content: 'Lun-Ven: 9h-18h',
            description: 'Sam: 10h-16h'
        }
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // 🆕 Appel API réel au lieu de la simulation
            const response = await contactService.sendMessage(formData);

            toast.success(response.message || 'Message envoyé avec succès ! Nous vous répondrons rapidement.');

            // Reset form
            setFormData({
                name: '',
                email: '',
                subject: '',
                category: 'general',
                message: ''
            });

        } catch (error) {
            console.error('Erreur contact:', error);

            const errorMessage = error.response?.data?.message ||
                'Erreur lors de l\'envoi. Veuillez réessayer plus tard.';

            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-200">
            {/* Header */}
            <div className="bg-white dark:bg-slate-800 shadow-sm">
                <div className="container-custom py-16">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-slate-50 mb-4">
                            Contactez-nous
                        </h1>
                        <p className="text-xl text-gray-600 dark:text-slate-300 max-w-2xl mx-auto">
                            Une question ? Un projet ? Notre équipe est là pour vous accompagner
                            dans votre passion du sport et des pronostics.
                        </p>
                    </div>
                </div>
            </div>

            <div className="container-custom py-16">
                <div className="grid lg:grid-cols-3 gap-12">
                    {/* Formulaire de contact */}
                    <div className="lg:col-span-2">
                        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-8">
                            <div className="flex items-center mb-6">
                                <ChatBubbleLeftRightIcon className="w-6 h-6 text-blue-600 mr-3" />
                                <h2 className="text-2xl font-semibold text-gray-900 dark:text-slate-50">
                                    Envoyez-nous un message
                                </h2>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                                            Nom complet *
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg
                                                     bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100
                                                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                            placeholder="Votre nom"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                                            Email *
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg
                                                     bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100
                                                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                            placeholder="votre@email.com"
                                        />
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                                            Catégorie
                                        </label>
                                        <select
                                            name="category"
                                            value={formData.category}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg
                                                     bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100
                                                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        >
                                            {contactCategories.map(category => (
                                                <option key={category.value} value={category.value}>
                                                    {category.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                                            Sujet
                                        </label>
                                        <input
                                            type="text"
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg
                                                     bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100
                                                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                            placeholder="Sujet de votre message"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                                        Message *
                                    </label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleInputChange}
                                        required
                                        rows={6}
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg
                                                 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100
                                                 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        placeholder="Décrivez votre demande en détail..."
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full md:w-auto px-8 py-3 bg-blue-600 text-white font-medium rounded-lg
                                             hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                                             disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200
                                             flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                                            Envoi en cours...
                                        </>
                                    ) : (
                                        <>
                                            <EnvelopeIcon className="w-5 h-5" />
                                            Envoyer le message
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Informations de contact */}
                    <div className="space-y-8">
                        {/* Informations principales */}
                        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-50 mb-6">
                                Informations de contact
                            </h3>
                            <div className="space-y-4">
                                {contactInfo.map((info, index) => (
                                    <div key={index} className="flex items-start">
                                        <div className="flex-shrink-0">
                                            <info.icon className="w-6 h-6 text-blue-600 mt-1" />
                                        </div>
                                        <div className="ml-4">
                                            <p className="font-medium text-gray-900 dark:text-slate-50">
                                                {info.title}
                                            </p>
                                            <p className="text-gray-600 dark:text-slate-300">
                                                {info.content}
                                            </p>
                                            <p className="text-sm text-gray-500 dark:text-slate-400">
                                                {info.description}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Réseaux sociaux */}
                        {/*} <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-50 mb-4">
                                Suivez-nous
                            </h3>
                            <div className="flex space-x-4">
                                {[
                                    { name: 'Twitter', icon: '🐦', href: '#', color: 'bg-blue-500' },
                                    { name: 'Instagram', icon: '📸', href: '#', color: 'bg-pink-500' },
                                    { name: 'YouTube', icon: '📺', href: '#', color: 'bg-red-500' },
                                    { name: 'Discord', icon: '💬', href: '#', color: 'bg-indigo-500' }
                                ].map((social) => (
                                    <a
                                        key={social.name}
                                        href={social.href}
                                        className={`w-10 h-10 ${social.color} rounded-lg flex items-center justify-center
                                                   text-white hover:opacity-80 transition-opacity`}
                                        title={social.name}
                                    >
                                        <span className="text-lg">{social.icon}</span>
                                    </a>
                                ))}
                            </div>
                        </div>
                        */}

                        {/* Temps de réponse */}
                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
                            <div className="flex items-center mb-3">
                                <ClockIcon className="w-5 h-5 text-blue-600 mr-2" />
                                <h3 className="font-semibold text-blue-900 dark:text-blue-100">
                                    Temps de réponse
                                </h3>
                            </div>
                            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                                <li>• Support technique: <strong>2-4h</strong></li>
                                <li>• Questions abonnement: <strong>2-4h</strong></li>
                                <li>• Demandes générales: <strong>4h</strong></li>
                                <li>• Partenariats: <strong>5h</strong></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Section FAQ rapide */}
            <div className="bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-slate-700">
                <div className="container-custom py-16">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-slate-50 mb-4">
                            Questions fréquentes
                        </h2>
                        <p className="text-gray-600 dark:text-slate-300">
                            Retrouvez rapidement les réponses aux questions les plus courantes
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            {
                                question: "Comment souscrire à un abonnement ?",
                                answer: "Rendez-vous sur notre page 'Tarifs' et choisissez le plan qui vous convient."
                            },
                            {
                                question: "Puis-je annuler mon abonnement ?",
                                answer: "Oui, vous pouvez annuler à tout moment depuis votre profil utilisateur."
                            },
                            {
                                question: "Vos pronostics sont-ils garantis ?",
                                answer: "Aucun pronostic n'est garanti. Nous analysons et partageons nos convictions."
                            },
                            {
                                question: "Comment accéder aux pronostics ?",
                                answer: "Connectez-vous à votre compte et rendez-vous dans l'espace 'Pronostics'."
                            },
                            {
                                question: "Acceptez-vous les remboursements ?",
                                answer: "Nous proposons une garantie satisfait ou remboursé de 7 jours."
                            },
                            {
                                question: "Puis-je partager mon compte ?",
                                answer: "Chaque compte est personnel et ne peut être partagé."
                            }
                        ].map((faq, index) => (
                            <div key={index} className="bg-gray-50 dark:bg-slate-700 rounded-lg p-6">
                                <h3 className="font-semibold text-gray-900 dark:text-slate-50 mb-2">
                                    {faq.question}
                                </h3>
                                <p className="text-gray-600 dark:text-slate-300 text-sm">
                                    {faq.answer}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-8">
                        <a
                            href="/help-center"
                            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg
                                     hover:bg-blue-700 transition-colors duration-200"
                        >
                            Voir toutes les questions
                            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d="M9 5l7 7-7 7" />
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;