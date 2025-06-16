// src/pages/About.jsx - PAGE À PROPOS AUTHENTIQUE
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

// ✅ Section Hero About - Vraie histoire
const AboutHeroSection = () => {
    return (
        <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 text-white overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
                <div
                    className="absolute inset-0 bg-repeat"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='0.4'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                    }}
                ></div>
            </div>

            <div className="relative container-custom py-20 lg:py-32">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="text-6xl md:text-8xl mb-6">⚽</div>
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                        Deux potes de 25 ans qui en avaient <span className="text-yellow-400">marre</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-blue-100 mb-8 leading-relaxed">
                        De voir les gens se faire <strong className="text-red-400">plumer</strong> dans les paris sportifs
                        parce qu'ils ne connaissent pas les <strong className="text-green-400">vraies values</strong>
                    </p>

                    {/* Points clés sans stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                        <div className="text-center">
                            <div className="text-3xl md:text-4xl font-bold text-green-400 mb-2">🔥</div>
                            <div className="text-blue-100">Passion pour les algos</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl md:text-4xl font-bold text-yellow-400 mb-2">🎯</div>
                            <div className="text-blue-100">Analyses détaillées</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl md:text-4xl font-bold text-purple-400 mb-2">💯</div>
                            <div className="text-blue-100">Transparence totale</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

// ✅ Section Notre Histoire - Version authentique
const OurRealStorySection = () => {
    return (
        <section className="section-lg bg-white dark:bg-slate-900">
            <div className="container-custom">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <div className="text-5xl mb-6">🎯</div>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-slate-100 mb-6">
                            Notre vraie histoire
                        </h2>
                        <div className="space-y-6 text-lg text-gray-600 dark:text-slate-300">
                            <p>
                                On était juste deux potes passionnés de <strong className="text-blue-600">foot, tennis et basket </strong>
                                qui regardaient les matchs ensemble depuis des années.
                            </p>
                            <p>
                                Un jour, on s'est rendu compte d'un truc : <strong className="text-red-600">la plupart des gens
                                qui parient n'y connaissent rien aux vraies cotes</strong>. Ils voient "PSG favori"
                                et ils parient, sans analyser si la cote est intéressante ou non.
                            </p>
                            <p>
                                Nous, on passait déjà nos soirées à analyser les stats, les formes,
                                les compositions... Alors on s'est dit : <em className="text-blue-600">
                                "Et si on aidait les gens à ne plus se faire avoir ?"</em>
                            </p>
                        </div>

                        <div className="mt-8 p-6 bg-gray-100 dark:bg-slate-800 rounded-xl">
                            <h4 className="font-bold text-gray-900 dark:text-slate-100 mb-3">Notre premier test :</h4>
                            <p className="text-gray-600 dark:text-slate-300">
                                Un simple fichier <strong>Excel</strong> avec nos prédictions vs les résultats réels.
                                Résultat : on était <strong className="text-green-600">bien plus souvent dans le vrai</strong> que la moyenne.
                                C'est là qu'on a su qu'on tenait quelque chose.
                            </p>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-8 text-white shadow-2xl">
                            <div className="text-4xl mb-4">📊</div>
                            <h3 className="text-2xl font-bold mb-4">On fait les choses différemment</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center bg-white/20 rounded-lg p-3">
                                    <span>Matchs analysés par semaine</span>
                                    <span className="text-yellow-300 font-bold">+45</span>
                                </div>
                                <div className="flex justify-between items-center bg-white/20 rounded-lg p-3">
                                    <span>Variables analysées par match</span>
                                    <span className="text-green-300 font-bold">+50</span>
                                </div>
                                <div className="flex justify-between items-center bg-white/20 rounded-lg p-3">
                                    <span>Temps moyen par analyse</span>
                                    <span className="text-blue-300 font-bold">+1h</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

// ✅ Section Notre Approche Tech
const TechApproachSection = () => {
    return (
        <section className="section-lg bg-gray-50 dark:bg-slate-800">
            <div className="container-custom">
                <div className="text-center mb-16">
                    <div className="text-5xl mb-6">🤖</div>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-slate-100 mb-4">
                        Notre approche
                    </h2>
                    <p className="text-xl text-gray-600 dark:text-slate-300 max-w-3xl mx-auto">
                        On combine notre passion du sport avec de la tech pour détecter les vraies opportunités
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <div className="card card-white dark:bg-slate-700 card-padding text-center group hover:shadow-xl transition-all duration-300">
                        <div className="text-5xl mb-4">🕷️</div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-slate-100 mb-4">
                            Data scraping
                        </h3>
                        <p className="text-gray-600 dark:text-slate-300 text-sm leading-relaxed">
                            On récupère les données de partout : stats officielles, réseaux sociaux,
                            news, compositions... Tout ce qui peut influencer un match.
                        </p>
                    </div>

                    <div className="card card-white dark:bg-slate-700 card-padding text-center group hover:shadow-xl transition-all duration-300">
                        <div className="text-5xl mb-4">📈</div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-slate-100 mb-4">
                            Machine Learning
                        </h3>
                        <p className="text-gray-600 dark:text-slate-300 text-sm leading-relaxed">
                            Nos algorithmes apprennent des patterns qu'on ne voit pas à l'œil nu.
                            Python, pandas, scikit-learn... tout l'arsenal.
                        </p>
                    </div>

                    <div className="card card-white dark:bg-slate-700 card-padding text-center group hover:shadow-xl transition-all duration-300">
                        <div className="text-5xl mb-4">🧠</div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-slate-100 mb-4">
                            Analyse humaine
                        </h3>
                        <p className="text-gray-600 dark:text-slate-300 text-sm leading-relaxed">
                            L'IA c'est bien, mais on regarde aussi les matchs ! Contexte, motivation,
                            enjeux... des trucs qu'une machine ne peut pas comprendre.
                        </p>
                    </div>
                </div>

                {/* Process détaillé */}
                <div className="mt-16 bg-white dark:bg-slate-700 rounded-2xl p-8">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-6 text-center">
                        Notre process (step by step)
                    </h3>
                    <div className="grid md:grid-cols-4 gap-6">
                        <div className="text-center">
                            <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3">1</div>
                            <h4 className="font-semibold text-gray-900 dark:text-slate-100 mb-2">Data collection</h4>
                            <p className="text-sm text-gray-600 dark:text-slate-300">Scraping + APIs pour récupérer toutes les infos</p>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3">2</div>
                            <h4 className="font-semibold text-gray-900 dark:text-slate-100 mb-2">IA Analysis</h4>
                            <p className="text-sm text-gray-600 dark:text-slate-300">Nos modèles calculent les vraies probabilités</p>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3">3</div>
                            <h4 className="font-semibold text-gray-900 dark:text-slate-100 mb-2">Human check</h4>
                            <p className="text-sm text-gray-600 dark:text-slate-300">On valide avec notre connaissance du terrain</p>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3">4</div>
                            <h4 className="font-semibold text-gray-900 dark:text-slate-100 mb-2">Value detection</h4>
                            <p className="text-sm text-gray-600 dark:text-slate-300">On identifie les cotes sous-évaluées</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

// ✅ Section Transparence totale
const TransparencySection = () => {
    return (
        <section className="section-lg bg-white dark:bg-slate-900">
            <div className="container-custom">
                <div className="text-center mb-16">
                    <div className="text-5xl mb-6">🔍</div>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-slate-100 mb-4">
                        100% transparents (même sur nos fails)
                    </h2>
                    <p className="text-xl text-gray-600 dark:text-slate-300 max-w-3xl mx-auto">
                        On vous montre tout : nos réussites, nos échecs, notre méthodologie. Zéro filtre.
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Nos principes */}
                    <div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-6">
                            Nos principes (non négociables)
                        </h3>
                        <div className="space-y-6">
                            <div className="flex items-start space-x-4">
                                <div className="text-2xl">✅</div>
                                <div>
                                    <h4 className="font-bold text-gray-900 dark:text-slate-100 mb-2">
                                        On publie tous nos résultats
                                    </h4>
                                    <p className="text-gray-600 dark:text-slate-300">
                                        Wins ET losses. Pas de cherry-picking, pas de manipulation.
                                        Notre historique complet est accessible.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-4">
                                <div className="text-2xl">🎯</div>
                                <div>
                                    <h4 className="font-bold text-gray-900 dark:text-slate-100 mb-2">
                                        On prend des risques calculés
                                    </h4>
                                    <p className="text-gray-600 dark:text-slate-300">
                                        Parfois on mise sur des cotes élevées parce qu'on a détecté une value.
                                        Ça peut foirer, mais statistiquement ça paye.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-4">
                                <div className="text-2xl">🚫</div>
                                <div>
                                    <h4 className="font-bold text-gray-900 dark:text-slate-100 mb-2">
                                        Zéro bullshit "expert"
                                    </h4>
                                    <p className="text-gray-600 dark:text-slate-300">
                                        On ne prétend pas avoir 20 ans d'expérience ou être d'anciens pros.
                                        Juste deux mecs qui savent analyser les data.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Nos vraies promesses */}
                    <div className="bg-gray-50 dark:bg-slate-800 rounded-2xl p-8">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-6">
                            Ce qu'on vous promet
                        </h3>

                        <div className="space-y-6">
                            <div className="flex items-center p-4 bg-white dark:bg-slate-700 rounded-lg">
                                <span className="text-2xl mr-4">🔍</span>
                                <div>
                                    <div className="font-bold text-gray-900 dark:text-slate-100">Transparence totale</div>
                                    <div className="text-sm text-gray-600 dark:text-slate-300">Historique complet public</div>
                                </div>
                            </div>

                            <div className="flex items-center p-4 bg-white dark:bg-slate-700 rounded-lg">
                                <span className="text-2xl mr-4">🤖</span>
                                <div>
                                    <div className="font-bold text-gray-900 dark:text-slate-100">Amélioration continue</div>
                                    <div className="text-sm text-gray-600 dark:text-slate-300">Nos algos évoluent constamment</div>
                                </div>
                            </div>

                            <div className="flex items-center p-4 bg-white dark:bg-slate-700 rounded-lg">
                                <span className="text-2xl mr-4">💬</span>
                                <div>
                                    <div className="font-bold text-gray-900 dark:text-slate-100">Support réactif</div>
                                    <div className="text-sm text-gray-600 dark:text-slate-300">On répond toujours aux questions</div>
                                </div>
                            </div>

                            <div className="flex items-center p-4 bg-white dark:bg-slate-700 rounded-lg">
                                <span className="text-2xl mr-4">🎯</span>
                                <div>
                                    <div className="font-bold text-gray-900 dark:text-slate-100">Analyses détaillées</div>
                                    <div className="text-sm text-gray-600 dark:text-slate-300">On explique toujours notre raisonnement</div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 p-4 bg-green-100 dark:bg-green-900/30 rounded-lg">
                            <p className="text-sm text-green-800 dark:text-green-200">
                                <strong>Notre engagement :</strong> Même si on débute, on met tout en œuvre
                                pour vous offrir la meilleure expérience possible.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

// ✅ Section Pourquoi on fait ça
const WhyWeDoItSection = () => {
    return (
        <section className="section-lg bg-gray-50 dark:bg-slate-800">
            <div className="container-custom">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="text-5xl mb-6">💡</div>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-slate-100 mb-8">
                        Pourquoi on fait ça ?
                    </h2>

                    <div className="text-left space-y-8">
                        <div className="bg-white dark:bg-slate-700 rounded-xl p-8">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-slate-100 mb-4">
                                🔥 Parce qu'on en avait marre de voir les gens se faire avoir
                            </h3>
                            <p className="text-gray-600 dark:text-slate-300 leading-relaxed">
                                Tous ces "tipsters" qui vendent du rêve avec des screenshots bidons,
                                ces sites qui cachent leurs vraies stats... On voulait faire les choses proprement.
                            </p>
                        </div>

                        <div className="bg-white dark:bg-slate-700 rounded-xl p-8">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-slate-100 mb-4">
                                🚀 Parce qu'on kiffe développer nos algos
                            </h3>
                            <p className="text-gray-600 dark:text-slate-300 leading-relaxed">
                                Honnêtement, on passerait des heures à optimiser nos modèles même si personne ne s'abonnait.
                                C'est notre passion, autant la partager.
                            </p>
                        </div>

                        <div className="bg-white dark:bg-slate-700 rounded-xl p-8">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-slate-100 mb-4">
                                🎯 Parce qu'on veut prouver qu'on peut battre les bookmakers
                            </h3>
                            <p className="text-gray-600 dark:text-slate-300 leading-relaxed">
                                C'est un défi technique et sportif. Les bookmakers ont leurs algorithmes,
                                nous on a les nôtres. May the best algo win.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

// ✅ Section CTA finale authentique
const AuthenticCTASection = () => {
    return (
        <section className="section-lg bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 text-white">
            <div className="container-custom text-center">
                <div className="max-w-4xl mx-auto">
                    <div className="text-6xl mb-6">🤝</div>
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">
                        Envie de nous suivre dans l'aventure ?
                    </h2>
                    <p className="text-xl text-blue-100 mb-12 leading-relaxed">
                        On ne va pas vous promettre de devenir riche. Mais si vous voulez des analyses
                        honnêtes, transparentes et basées sur de la vraie data, vous êtes au bon endroit.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
                        <Link
                            to="/register"
                            className="btn bg-white text-blue-900 hover:bg-gray-100 px-8 py-4 text-lg font-bold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                        >
                            🚀 Tester gratuitement
                        </Link>
                        <Link
                            to="/pricing"
                            className="btn border-2 border-white text-white hover:bg-white hover:text-blue-900 px-8 py-4 text-lg font-semibold transition-all"
                        >
                            💰 Voir les prix
                        </Link>
                    </div>

                    <div className="bg-white/10 rounded-xl p-6">
                        <h3 className="text-lg font-bold mb-4">Ce qu'on vous garantit :</h3>
                        <div className="grid md:grid-cols-3 gap-6 text-sm">
                            <div>
                                <div className="text-green-400 font-bold mb-1">✅ Transparence totale</div>
                                <div className="text-blue-100">Tous nos résultats publics</div>
                            </div>
                            <div>
                                <div className="text-yellow-400 font-bold mb-1">🔥 Analyses detaillées</div>
                                <div className="text-blue-100">On explique notre raisonnement</div>
                            </div>
                            <div>
                                <div className="text-purple-400 font-bold mb-1">🤖 Tech de pointe</div>
                                <div className="text-blue-100">ML + expertise humaine</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

// ✅ Composant principal About
const About = () => {
    useEffect(() => {
        // Animation au scroll
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

        // Observer tous les éléments avec la classe 'observe'
        document.querySelectorAll('.observe').forEach(el => {
            observer.observe(el);
        });

        // Cleanup
        return () => observer.disconnect();
    }, []);

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <AboutHeroSection />

            {/* Notre Histoire */}
            <div className="observe">
                <OurRealStorySection />
            </div>

            {/* Notre Approche Tech */}
            <div className="observe">
                <TechApproachSection />
            </div>

            {/* Transparence */}
            <div className="observe">
                <TransparencySection />
            </div>

            {/* Pourquoi on fait ça */}
            <div className="observe">
                <WhyWeDoItSection />
            </div>

            {/* CTA finale */}
            <div className="observe">
                <AuthenticCTASection />
            </div>

            {/* Styles inline pour éviter les problèmes de parsing */}
            <style>{`
                .observe {
                    opacity: 0;
                    transform: translateY(30px);
                    transition: all 0.6s ease-out;
                }

                .animate-fade-in {
                    animation: fadeInUp 0.6s ease-out forwards;
                }

                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </div>
    );
};

export default About;