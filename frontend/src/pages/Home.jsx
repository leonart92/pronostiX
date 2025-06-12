// src/pages/Home.jsx - VERSION MODERNISÉE 2025
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import HeroSection from '../components/home/HeroSection';
import { FeaturesSection } from '../components/home/HeroSection';
import { pronosticService } from '../services/pronostic.service';
import { useAuth } from '../context/AuthContext';

import {
    ResponsiveContainer,
    LineChart,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Line
} from 'recharts';

// 🚀 NOUVELLE SECTION : Process "En quelques clics"
// Sections modernisées et cohérentes avec la DA du site

const ProcessSection = () => {
    const [activeStep, setActiveStep] = useState(0);

    const steps = [
        {
            id: 1,
            title: "Inscription gratuite",
            description: "Créez votre compte en 30 secondes et accédez immédiatement à nos pronostics exclusifs",
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
            ),
            gradient: "from-blue-500 to-blue-600",
            bgGradient: "from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30"
        },
        {
            id: 2,
            title: "Découvrez nos analyses",
            description: "Accédez aux pronostics détaillés avec analyses approfondies et statistiques complètes",
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
            ),
            gradient: "from-purple-500 to-purple-600",
            bgGradient: "from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30"
        },
        {
            id: 3,
            title: "Maximisez vos gains",
            description: "Suivez nos conseils d'experts et transformez votre passion du sport en revenus réguliers",
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
            ),
            gradient: "from-green-500 to-green-600",
            bgGradient: "from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30"
        }
    ];

    // Animation automatique toutes les 4 secondes
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveStep((prev) => (prev + 1) % steps.length);
        }, 4000);

        return () => clearInterval(interval);
    }, []);

    return (
        <section className="section-lg bg-gray-50 dark:bg-slate-800">
            <div className="container-custom">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium mb-6">
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Simple et efficace
                    </div>

                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-slate-100 mb-4">
                        Commencez à gagner <span className="text-gradient">en quelques clics</span>
                    </h2>
                    <p className="text-xl text-gray-600 dark:text-slate-300 max-w-3xl mx-auto">
                        Notre plateforme vous accompagne étape par étape pour transformer votre passion du sport en gains réguliers
                    </p>
                </div>

                {/* Timeline interactive */}
                <div className="relative max-w-5xl mx-auto">
                    {/* Ligne de connexion pour desktop */}
                    <div className="absolute top-20 left-1/2 transform -translate-x-1/2 w-full max-w-3xl h-0.5 bg-gray-200 dark:bg-gray-700 rounded-full hidden lg:block">
                        <div
                            className="h-full bg-blue-500 rounded-full transition-all duration-1000 ease-in-out"
                            style={{ width: `${((activeStep + 1) / steps.length) * 100}%` }}
                        />
                    </div>

                    {/* Étapes */}
                    <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
                        {steps.map((step, index) => (
                            <div
                                key={step.id}
                                className={`relative cursor-pointer group ${
                                    activeStep === index ? 'transform scale-105' : ''
                                } transition-all duration-300`}
                                onClick={() => setActiveStep(index)}
                            >
                                {/* Numéro de l'étape */}
                                <div className={`absolute -top-6 left-1/2 transform -translate-x-1/2 z-10 w-12 h-12 rounded-full flex items-center justify-center font-bold text-white text-lg shadow-lg transition-all duration-300 ${
                                    activeStep === index
                                        ? `bg-gradient-to-r ${step.gradient} scale-110`
                                        : 'bg-gray-400 dark:bg-gray-600'
                                }`}>
                                    {step.id}
                                </div>

                                {/* Card */}
                                <div className={`relative p-8 rounded-xl border transition-all duration-300 hover:shadow-lg ${
                                    activeStep === index
                                        ? `bg-gradient-to-br ${step.bgGradient} border-blue-200 dark:border-blue-700 shadow-xl`
                                        : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-600 hover:border-blue-200 dark:hover:border-blue-700'
                                }`}>

                                    {/* Icon */}
                                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-xl mb-6 transition-all duration-300 ${
                                        activeStep === index
                                            ? `bg-gradient-to-r ${step.gradient} text-white shadow-md`
                                            : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/50'
                                    }`}>
                                        {step.icon}
                                    </div>

                                    {/* Contenu */}
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-slate-100 mb-3">
                                        {step.title}
                                    </h3>

                                    <p className="text-gray-600 dark:text-slate-300">
                                        {step.description}
                                    </p>

                                    {/* Badge actif */}
                                    {activeStep === index && (
                                        <div className="absolute top-4 right-4">
                                            <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium px-2 py-1 rounded-full">
                                                En cours
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Progress indicators */}
                    <div className="flex justify-center mt-12 space-x-2">
                        {steps.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setActiveStep(index)}
                                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                    activeStep === index
                                        ? 'bg-blue-500 w-8'
                                        : 'bg-gray-300 dark:bg-gray-600 hover:bg-blue-300 dark:hover:bg-blue-700'
                                }`}
                            />
                        ))}
                    </div>
                </div>

                {/* CTA */}
                <div className="text-center mt-16">
                    <Link
                        to="/register"
                        className="inline-flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                        Commencer maintenant
                        <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    </Link>
                    <p className="text-sm text-gray-600 dark:text-slate-400 mt-3">
                        Gratuit • Sans engagement • Accès immédiat
                    </p>
                </div>
            </div>
        </section>
    );
};

// Section "Pourquoi nous rejoindre ?" - Cohérente avec la DA
const WhyJoinSection = () => {
    const advantages = [
        {
            title: "Analyses expertes",
            description: "Chaque pronostic est accompagné d'une analyse détaillée avec statistiques et contexte",
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
            )
        },
        {
            title: "100% transparent",
            description: "Tous nos résultats sont publics et vérifiables. Aucun filtrage, aucune manipulation",
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            )
        },
        {
            title: "Communauté active",
            description: "Rejoignez plus de 30 parieurs passionnés et partagez vos stratégies gagnantes",
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
            )
        },
        {
            title: "Support réactif",
            description: "Une équipe dédiée pour vous accompagner dans votre progression vers la rentabilité",
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
            )
        }
    ];

    return (
        <section className="section-lg bg-white dark:bg-slate-900">
            <div className="container-custom">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center px-4 py-2 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-sm font-medium mb-6">
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                        </svg>
                        La différence PronostiX
                    </div>

                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-slate-100 mb-4">
                        Pourquoi nous <span className="text-gradient">rejoindre</span> ?
                    </h2>
                    <p className="text-xl text-gray-600 dark:text-slate-300 max-w-3xl mx-auto">
                        Découvrez les avantages exclusifs qui font de PronostiX la référence du pari sportif intelligent
                    </p>
                </div>

                {/* Grid des avantages */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {advantages.map((advantage, index) => (
                        <div
                            key={index}
                            className="group text-center p-6 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 hover:border-blue-200 dark:hover:border-blue-700 transition-all duration-300 hover:shadow-lg hover:transform hover:scale-105"
                        >
                            {/* Icon */}
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl mb-6 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                                {advantage.icon}
                            </div>

                            {/* Titre */}
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-slate-100 mb-3">
                                {advantage.title}
                            </h3>

                            {/* Description */}
                            <p className="text-gray-600 dark:text-slate-300">
                                {advantage.description}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Statistiques en bas */}
                {/*<div className="mt-16 bg-blue-50 dark:bg-blue-900/20 rounded-xl p-8 text-center border border-blue-200 dark:border-blue-800">
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="group">
                            <div className="text-4xl font-bold text-gradient mb-2 group-hover:scale-110 transition-transform">
                                7 jours
                            </div>
                            <div className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-1">
                                Essai gratuit
                            </div>
                            <div className="text-sm text-gray-600 dark:text-slate-400">
                                Testez sans engagement
                            </div>
                        </div>

                        <div className="group">
                            <div className="text-4xl font-bold text-gradient mb-2 group-hover:scale-110 transition-transform">
                                Jan 2025
                            </div>
                            <div className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-1">
                                Depuis janvier
                            </div>
                            <div className="text-sm text-gray-600 dark:text-slate-400">
                                Plateforme récente
                            </div>
                        </div>

                        <div className="group">
                            <div className="text-4xl font-bold text-gradient mb-2 group-hover:scale-110 transition-transform">
                                30+
                            </div>
                            <div className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-1">
                                Communauté active
                            </div>
                            <div className="text-sm text-gray-600 dark:text-slate-400">
                                Membres engagés
                            </div>
                        </div>
                    </div>
                </div> */}
            </div>
        </section>
    );
};

// Section CTA cohérente avec la DA
const ModernCTASection = () => {
    return (
        <section className="section-lg bg-gradient-to-r from-blue-600 to-purple-600">
            <div className="container-custom text-center">
                {/* Badge */}
                <div className="inline-flex items-center px-6 py-2 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm font-medium mb-8">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Offre de lancement
                </div>

                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                    Prêt à transformer votre
                    <span className="block text-yellow-400">
                        passion en profits ?
                    </span>
                </h2>

                <p className="text-xl text-blue-100 mb-12 max-w-3xl mx-auto">
                    Rejoignez dès maintenant PronostiX et découvrez nos analyses expertes
                    qui révolutionnent le pari sportif. <strong>7 jours d'essai gratuit !</strong>
                </p>

                {/* Boutons d'action */}
                <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
                    <Link
                        to="/register"
                        className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                        Commencer gratuitement
                        <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    </Link>

                    <Link
                        to="/pricing"
                        className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-all duration-300 transform hover:scale-105"
                    >
                        Voir nos offres
                        <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </Link>
                </div>

                {/* Garanties */}
                <div className="flex flex-wrap justify-center items-center gap-8 text-blue-200 text-sm">
                    <div className="flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span>7 jours gratuits</span>
                    </div>
                    <div className="flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span>Sans engagement</span>
                    </div>
                    <div className="flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span>Résiliation à tout moment</span>
                    </div>
                    <div className="flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span>Support réactif</span>
                    </div>
                </div>
            </div>
        </section>
    );
};

// 🏆 Section VictoryWall (gardée identique)
const VictoryWallSection = () => {
    const { isAuthenticated, user } = useAuth();
    const [winningBets, setWinningBets] = useState([]);
    const [loading, setLoading] = useState(true);

    const MAX_DISPLAYED_BETS = 4;

    const [simulatorSettings, setSimulatorSettings] = useState({
        stakePerBet: 100,
        initialBankroll: 1000,
        strategy: 'fixed'
    });
    const [simulationResults, setSimulationResults] = useState(null);
    const [allPronostics, setAllPronostics] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                const response = await pronosticService.getPronostics({
                    limit: 50,
                    sort: 'matchDate_desc'
                });

                const allPronostics = response?.data?.pronostics || response?.pronostics || response?.data || [];
                console.log('🏆 Pronostics trouvés:', allPronostics.length);

                const winners = allPronostics.filter(prono => prono.result === 'won');
                if (winners.length > 0) {
                    const shuffledWinners = [...winners].sort(() => Math.random() - 0.5);
                    setWinningBets(shuffledWinners.slice(0, MAX_DISPLAYED_BETS));
                } else if (allPronostics.length > 0) {
                    const shuffledAll = [...allPronostics].sort(() => Math.random() - 0.5);
                    setWinningBets(shuffledAll.slice(0, MAX_DISPLAYED_BETS));
                } else {
                    setWinningBets([]);
                }

                setAllPronostics(allPronostics);

            } catch (error) {
                console.error('❌ Erreur chargement données:', error);
                setWinningBets([]);
                setAllPronostics([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const calculateSimulation = () => {
        const filteredPronostics = allPronostics.filter(p => ['won', 'lost'].includes(p.result));

        if (!filteredPronostics.length) {
            setSimulationResults(null);
            return;
        }

        let currentBankroll = simulatorSettings.initialBankroll;
        let totalStaked = 0;
        let totalProfit = 0;
        let winCount = 0;
        let lossCount = 0;

        const chartData = [{ day: 0, bankroll: currentBankroll }];

        filteredPronostics.forEach((prono, index) => {
            let stake;

            switch (simulatorSettings.strategy) {
                case 'fixed':
                    stake = simulatorSettings.stakePerBet;
                    break;
                case 'percentage':
                    stake = currentBankroll * (simulatorSettings.stakePerBet / 100);
                    break;
                default:
                    stake = simulatorSettings.stakePerBet;
            }

            stake = Math.min(stake, currentBankroll);
            totalStaked += stake;

            let profit = 0;
            if (prono.result === 'won') {
                profit = stake * (prono.odds - 1);
                currentBankroll += profit;
                winCount++;
            } else if (prono.result === 'lost') {
                profit = -stake;
                currentBankroll += profit;
                lossCount++;
            }

            totalProfit += profit;

            chartData.push({
                day: index + 1,
                bankroll: Math.round(currentBankroll * 100) / 100
            });

            if (currentBankroll <= 0) {
                currentBankroll = 0;
                return;
            }
        });

        const roi = totalStaked > 0 ? (totalProfit / totalStaked) * 100 : 0;
        const winRate = (winCount + lossCount) > 0 ? (winCount / (winCount + lossCount)) * 100 : 0;

        setSimulationResults({
            summary: {
                initialBankroll: simulatorSettings.initialBankroll,
                finalBankroll: currentBankroll,
                totalProfit: totalProfit,
                totalStaked: totalStaked,
                roi: roi,
                winRate: winRate,
                totalBets: winCount + lossCount
            },
            chartData: chartData
        });
    };

    useEffect(() => {
        if (allPronostics.length > 0) {
            calculateSimulation();
        }
    }, [allPronostics, simulatorSettings]);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'EUR'
        }).format(amount);
    };

    const calculateGain = (odds, stake = 50) => {
        return ((odds - 1) * stake).toFixed(0);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return "Aujourd'hui";
        if (diffDays === 1) return "Hier";
        if (diffDays < 7) return `Il y a ${diffDays} jours`;
        return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
    };

    if (loading) {
        return (
            <section className="section-lg bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
                <div className="container-custom">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
                        <p className="text-gray-600 dark:text-slate-300 mt-4">Chargement de nos pronostics...</p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="section-lg bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
            <div className="container-custom">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center px-4 py-2 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm font-medium mb-6">
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        🔥 Mur des victoires
                    </div>

                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-slate-100 mb-4">
                        Nos performances en action
                    </h2>
                    <p className="text-xl text-gray-600 dark:text-slate-300 max-w-3xl mx-auto">
                        Découvrez nos pronostics récents et testez votre stratégie
                        avec notre simulateur basé sur nos vraies performances.
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-12 items-start">
                    {/* Pronostics ou message */}
                    <div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-6">
                            {winningBets.length > 0 ?
                                `🏆 ${winningBets.filter(bet => bet.result === 'won').length > 0 ? 'Derniers paris gagnants' : 'Nos derniers pronostics'}` :
                                '🎯 Pronostics en préparation'
                            }
                        </h3>

                        {winningBets.length === 0 ? (
                            <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-xl border-2 border-dashed border-gray-300 dark:border-slate-600">
                                <div className="text-6xl mb-4">⏳</div>
                                <h4 className="text-xl font-semibold text-gray-900 dark:text-slate-100 mb-3">
                                    Premiers pronostics en cours d'analyse
                                </h4>
                                <p className="text-gray-600 dark:text-slate-300 mb-6 max-w-md mx-auto">
                                    Nos experts préparent les premiers coups gagnants.
                                    Les analyses arrivent très bientôt !
                                </p>
                                <div className="inline-flex items-center px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium">
                                    <svg className="w-4 h-4 mr-2 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                    </svg>
                                    Mise en ligne imminente
                                </div>
                            </div>
                        ) : (
                            <div className="grid gap-4">
                                {winningBets.map((bet, index) => {
                                    const isWinner = bet.result === 'won';
                                    return (
                                        <div
                                            key={bet._id || index}
                                            className={`card card-white p-4 border-l-4 transition-all duration-300 hover:shadow-lg ${
                                                isWinner ? 'border-green-500 bg-green-50 dark:bg-green-900/20' :
                                                    bet.result === 'lost' ? 'border-red-500 bg-red-50 dark:bg-red-900/20' :
                                                        'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                            }`}
                                        >
                                            <div className="flex justify-between items-start mb-3">
                                                <div className="flex-1">
                                                    <div className="font-semibold text-gray-900 dark:text-slate-100 text-lg">
                                                        {bet.homeTeam} vs {bet.awayTeam}
                                                    </div>
                                                    <div className="text-sm text-gray-600 dark:text-slate-400 mb-2">
                                                        {bet.league} • {formatDate(bet.matchDate)}
                                                    </div>
                                                    <div className="text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/50 px-2 py-1 rounded inline-block">
                                                        {bet.predictionType || 'Pronostic'} {bet.prediction && `- ${bet.prediction}`}
                                                    </div>
                                                </div>

                                                <div className="text-right ml-4">
                                                    <div className={`text-2xl font-bold ${
                                                        isWinner ? 'text-green-600' :
                                                            bet.result === 'lost' ? 'text-red-600' :
                                                                'text-blue-600'
                                                    }`}>
                                                        {bet.odds || '2.0'}
                                                    </div>
                                                    {isWinner && (
                                                        <div className="text-sm text-green-600 font-medium">
                                                            +{calculateGain(bet.odds)}€
                                                        </div>
                                                    )}
                                                    <div className="text-xs text-gray-500">
                                                        {isWinner ? '50€ mise' : `Cote ${bet.odds || '2.0'}`}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-slate-600">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                                    isWinner ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300' :
                                                        bet.result === 'lost' ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300' :
                                                            bet.result === 'pending' ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300' :
                                                                'bg-gray-100 dark:bg-slate-700 text-gray-800 dark:text-slate-300'
                                                }`}>
                                                    {isWinner ? '✓ GAGNÉ' :
                                                        bet.result === 'lost' ? '✗ PERDU' :
                                                            bet.result === 'pending' ? '⏳ EN COURS' :
                                                                '📊 ANALYSÉ'}
                                                </span>
                                                {bet.confidence && (
                                                    <span className="text-xs text-gray-600 dark:text-slate-400">
                                                        {bet.confidence}% confiance
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {winningBets.length > 0 && (
                            <div className="text-center mt-6">
                                <Link to="/pronostics" className="btn btn-outline">
                                    Voir tous nos pronostics 📊
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* 🎮 SIMULATEUR INTERACTIF */}
                    <div className="card card-white p-8">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-6">
                            🎮 Simulateur de gains interactif
                        </h3>

                        {/* Paramètres simplifiés */}
                        <div className="space-y-4 mb-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                                    📈 Stratégie de mise
                                </label>
                                <select
                                    value={simulatorSettings.strategy}
                                    onChange={(e) => setSimulatorSettings(prev => ({...prev, strategy: e.target.value}))}
                                    className="w-full p-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm"
                                >
                                    <option value="fixed">Mise fixe</option>
                                    <option value="percentage">% de la bankroll</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                                    💰 {simulatorSettings.strategy === 'fixed' ? 'Mise par pari' : 'Pourcentage par pari'}
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={simulatorSettings.stakePerBet}
                                        onChange={(e) => setSimulatorSettings(prev => ({
                                            ...prev,
                                            stakePerBet: parseFloat(e.target.value) || 0
                                        }))}
                                        className="w-full p-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm pr-8"
                                        min="1"
                                        step={simulatorSettings.strategy === 'fixed' ? "10" : "0.1"}
                                    />
                                    <span className="absolute right-2 top-2 text-gray-500 text-sm">
                                        {simulatorSettings.strategy === 'fixed' ? '€' : '%'}
                                    </span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                                    🏦 Bankroll de départ
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={simulatorSettings.initialBankroll}
                                        onChange={(e) => setSimulatorSettings(prev => ({
                                            ...prev,
                                            initialBankroll: parseFloat(e.target.value) || 0
                                        }))}
                                        className="w-full p-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm pr-8"
                                        min="100"
                                        step="100"
                                    />
                                    <span className="absolute right-2 top-2 text-gray-500 text-sm">€</span>
                                </div>
                            </div>
                        </div>

                        {/* Résultats de simulation */}
                        {simulationResults ? (
                            <>
                                <div className="grid grid-cols-3 gap-3 mb-6">
                                    <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                        <div className="text-lg font-bold text-blue-600">
                                            {formatCurrency(simulationResults.summary.finalBankroll)}
                                        </div>
                                        <div className="text-xs text-gray-600 dark:text-gray-400">Bankroll finale</div>
                                    </div>
                                    <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                        <div className={`text-lg font-bold ${
                                            simulationResults.summary.totalProfit >= 0 ? 'text-green-600' : 'text-red-600'
                                        }`}>
                                            {simulationResults.summary.totalProfit >= 0 ? '+' : ''}
                                            {formatCurrency(simulationResults.summary.totalProfit)}
                                        </div>
                                        <div className="text-xs text-gray-600 dark:text-gray-400">Profit/Perte</div>
                                    </div>
                                    <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                                        <div className={`text-lg font-bold ${
                                            simulationResults.summary.roi >= 0 ? 'text-green-600' : 'text-red-600'
                                        }`}>
                                            {simulationResults.summary.roi >= 0 ? '+' : ''}
                                            {simulationResults.summary.roi.toFixed(1)}%
                                        </div>
                                        <div className="text-xs text-gray-600 dark:text-gray-400">ROI</div>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <h4 className="text-sm font-medium text-gray-700 dark:text-slate-300 mb-3">
                                        📈 Évolution de la bankroll
                                    </h4>
                                    <div className="h-40">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart data={simulationResults.chartData}>
                                                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                                                <XAxis
                                                    dataKey="day"
                                                    className="text-xs"
                                                    tick={{ fontSize: 10 }}
                                                />
                                                <YAxis
                                                    className="text-xs"
                                                    tickFormatter={(value) => `${value}€`}
                                                    tick={{ fontSize: 10 }}
                                                />
                                                <Tooltip
                                                    formatter={(value) => [formatCurrency(value), 'Bankroll']}
                                                    labelFormatter={(label) => `Jour ${label}`}
                                                />
                                                <Line
                                                    type="monotone"
                                                    dataKey="bankroll"
                                                    stroke="#3B82F6"
                                                    strokeWidth={2}
                                                    dot={false}
                                                />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                <div className="text-center text-sm text-gray-600 dark:text-slate-400 mb-6">
                                    {simulationResults.summary.totalBets} paris • {simulationResults.summary.winRate.toFixed(1)}% de réussite
                                    <br />
                                    Basé sur {allPronostics.filter(p => ['won', 'lost'].includes(p.result)).length} pronostics réels
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-8">
                                <div className="text-4xl mb-3">📊</div>
                                <p className="text-gray-600 dark:text-slate-400 text-sm">
                                    {allPronostics.length === 0 ?
                                        'Chargement des données...' :
                                        'Ajustez vos paramètres pour voir la simulation'
                                    }
                                </p>
                            </div>
                        )}

                        <div className="text-xs text-gray-500 dark:text-slate-400 text-center mb-6">
                            * Simulation basée sur nos performances réelles.
                            Les gains passés ne présagent pas des gains futurs.
                        </div>

                        {isAuthenticated ? (
                            <Link to="/simulation" className="w-full btn btn-primary btn-lg group">
                                <span className="flex items-center justify-center">
                                    🚀 Simulateur complet avec tous les filtres
                                    <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </span>
                            </Link>
                        ) : (
                            <div className="space-y-3">
                                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 text-center">
                                    <div className="text-sm text-blue-800 dark:text-blue-300 mb-2">
                                        🔒 <strong>Version complète disponible</strong>
                                    </div>
                                    <div className="text-xs text-blue-600 dark:text-blue-400">
                                        Accédez aux filtres avancés, historique détaillé et export de données
                                    </div>
                                </div>

                                <Link to="/register" className="w-full btn btn-primary btn-lg group">
                                    <span className="flex items-center justify-center">
                                        🚀 S'inscrire gratuitement
                                        <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </span>
                                </Link>

                                <div className="text-center">
                                    <Link to="/login" className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">
                                        Déjà inscrit ? Se connecter
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

// 💬 Section BetaTestersSection (gardée identique)
const BetaTestersSection = () => {
    const testimonials = [
        {
            name: "Alexandre D.",
            role: "Bêta-testeur depuis 3 semaines",
            content: "La transparence totale change tout ! Voir tous les résultats sans filtre, c'est exactement ce qui manquait dans ce secteur. Interface claire et analyses détaillées.",
            rating: 5,
            avatar: "AD",
            highlight: "transparence"
        },
        {
            name: "Sarah M.",
            role: "Utilisatrice early access",
            content: "J'ai testé la version bêta pendant 1 mois. L'approche honnête et les vraies performances affichées font toute la différence. Très prometteur !",
            rating: 5,
            avatar: "SM",
            highlight: "honnêteté"
        },
        {
            name: "Kevin L.",
            role: "Testeur phase pilote",
            content: "Après 2 semaines d'utilisation, je suis impressionné par la qualité des analyses et le suivi personnalisé. L'équipe écoute vraiment les retours.",
            rating: 4,
            avatar: "KL",
            highlight: "qualité analyses"
        }
    ];

    return (
        <section className="section-lg bg-blue-50 dark:bg-slate-800">
            <div className="container-custom">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium mb-6">
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        Phase bêta terminée
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-slate-100 mb-4">
                        Premiers retours de nos bêta-testeurs
                    </h2>
                    <p className="text-xl text-gray-600 dark:text-slate-300 max-w-2xl mx-auto">
                        Découvrez l'expérience de ceux qui ont testé notre plateforme en avant-première
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <div
                            key={index}
                            className="card card-white card-padding relative"
                        >
                            <div className="absolute -top-2 -right-2">
                                <span className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                    NOUVEAU
                                </span>
                            </div>

                            <div className="flex items-center mb-4">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                            </div>

                            <p className="text-gray-700 dark:text-slate-300 mb-6 italic">
                                "{testimonial.content}"
                            </p>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-semibold mr-3">
                                        {testimonial.avatar}
                                    </div>
                                    <div>
                                        <div className="font-semibold text-gray-900 dark:text-slate-100">{testimonial.name}</div>
                                        <div className="text-sm text-gray-600 dark:text-slate-400">{testimonial.role}</div>
                                    </div>
                                </div>

                                <div className="text-right">
                                    <span className="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 px-2 py-1 rounded-full">
                                        {testimonial.highlight}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="text-center mt-12">
                    <p className="text-gray-600 dark:text-slate-300 mb-6">
                        La phase bêta nous a permis d'affiner notre système et de valider notre approche.
                        <br />
                        <strong>Maintenant, c'est votre tour de découvrir PronostiX !</strong>
                    </p>
                    <Link to="/register" className="btn btn-primary btn-lg">
                        Rejoindre la communauté
                    </Link>
                </div>
            </div>
        </section>
    );
};

// ✅ Composant principal Home modernisé
const Home = () => {
    // Animation au scroll
    useEffect(() => {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fade-in');
                }
            });
        }, observerOptions);

        document.querySelectorAll('.observe').forEach(el => {
            observer.observe(el);
        });

        return () => observer.disconnect();
    }, []);

    return (
        <div className="min-h-screen">
            {/* ✅ Hero Section - GARDÉ tel quel */}
            <HeroSection />

            {/* 🚀 NOUVELLE SECTION: Process "En quelques clics" */}
            <div className="observe">
                <ProcessSection />
            </div>

            {/* 🎯 NOUVELLE SECTION: "Pourquoi nous rejoindre ?" */}
            <div className="observe">
                <WhyJoinSection />
            </div>

            {/* 🏆 Mur des victoires - GARDÉ tel quel */}
            <div className="observe">
                <VictoryWallSection />
            </div>

            {/* ✅ Features - GARDÉ tel quel */}
            <div className="observe">
                <FeaturesSection />
            </div>

            {/* 💬 Premiers retours bêta-testeurs - GARDÉ tel quel */}
            <div className="observe">
                <BetaTestersSection />
            </div>

            {/* 🚀 NOUVELLE SECTION CTA MODERNISÉE */}
            <div className="observe">
                <ModernCTASection />
            </div>
        </div>
    );
};

export default Home;