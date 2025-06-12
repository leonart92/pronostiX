// src/components/home/FreePronosticsSection.jsx
// 🎯 Composant qui utilise vos vraies données depuis MongoDB

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useFreePronostics, usePronosticsStats } from '../../hooks/usePronostics';
import { PronosticUtils } from '../../services/pronostic.service';

const FreePronosticsSection = () => {
    const [displayLimit, setDisplayLimit] = useState(3);

    // 🔗 Récupération des données depuis votre API
    const { freePronostics, loading, error, refetch } = useFreePronostics(displayLimit);
    const { stats, loading: statsLoading } = usePronosticsStats();

    // 🎨 Composant pour une carte de pronostic
    const PronosticCard = ({ pronostic }) => {
        const statusBadge = PronosticUtils.getStatusBadge(pronostic.result);
        const sportColor = PronosticUtils.getSportColor(pronostic.sport);
        const confidenceBadge = PronosticUtils.getConfidenceBadge(pronostic.confidence);
        const priorityBadge = PronosticUtils.getPriorityBadge(pronostic.priority);

        return (
            <div className="card card-white card-padding group hover:shadow-lg transition-all duration-300">
                {/* Header avec sport et statut */}
                <div className="flex items-center justify-between mb-4">
          <span className={`text-xs font-medium px-2 py-1 rounded ${sportColor}`}>
            {pronostic.sport?.charAt(0).toUpperCase() + pronostic.sport?.slice(1)}
          </span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusBadge.class}`}>
            <span className="mr-1">{statusBadge.icon}</span>
                        {statusBadge.label}
          </span>
                </div>

                {/* Informations du match */}
                <div className="mb-4">
                    <h3 className="font-semibold text-lg text-gray-900 mb-1">
                        {pronostic.homeTeam} vs {pronostic.awayTeam}
                    </h3>
                    <p className="text-sm text-gray-600 mb-1">{pronostic.league}</p>
                    <p className="text-sm text-gray-500">
                        {PronosticUtils.formatMatchDate(pronostic.matchDate)}
                    </p>
                </div>

                {/* Type de pronostic et prédiction */}
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              {pronostic.predictionType}
            </span>
                        <span className={`text-xs px-2 py-1 rounded ${confidenceBadge.class}`}>
              {pronostic.confidence}% - {confidenceBadge.label}
            </span>
                    </div>

                    <div className="mb-2">
                        <span className="font-semibold text-gray-900">Cote: {pronostic.odds}</span>
                        <span className="ml-3 text-sm text-gray-600">Mise: {pronostic.stake}/10</span>
                    </div>

                    {/* Priorité si haute */}
                    {pronostic.priority === 'high' && (
                        <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${priorityBadge.class}`}>
              🔥 {priorityBadge.label} priorité
            </span>
                    )}
                </div>

                {/* Analyse preview */}
                {pronostic.analysis && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {pronostic.analysis}
                    </p>
                )}

                {/* Résultat si terminé */}
                {pronostic.actualResult && (
                    <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm font-medium text-blue-900">
                            Résultat: {pronostic.actualResult}
                        </p>
                        {pronostic.profit !== undefined && (
                            <p className={`text-sm ${pronostic.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                Profit: {pronostic.profit > 0 ? '+' : ''}{pronostic.profit}€
                            </p>
                        )}
                    </div>
                )}

                {/* Tags */}
                {pronostic.tags && pronostic.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                        {pronostic.tags.slice(0, 3).map((tag, index) => (
                            <span
                                key={index}
                                className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                            >
                {tag}
              </span>
                        ))}
                    </div>
                )}

                {/* Bouton d'action */}
                <button
                    className="w-full btn btn-outline btn-sm group-hover:btn-primary transition-all"
                    onClick={() => {
                        // Ici vous pourrez rediriger vers la page de détail du pronostic
                        console.log('Voir détail pronostic:', pronostic._id);
                    }}
                >
                    Voir l'analyse complète
                </button>
            </div>
        );
    };

    return (
        <section className="section-lg">
            <div className="container-custom">
                {/* Header avec statistiques */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Pronostics gratuits
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
                        Découvrez la qualité de nos analyses avec ces pronostics offerts.
                        Données en temps réel depuis notre base !
                    </p>

                    {/* Statistiques en temps réel */}
                    {!statsLoading && stats && (
                        <div className="flex flex-wrap justify-center gap-6 mb-8">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-green-600">{stats.winRate}%</div>
                                <div className="text-sm text-gray-600">Taux de réussite</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-blue-600">{stats.totalBets}</div>
                                <div className="text-sm text-gray-600">Pronostics totaux</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-purple-600">{stats.roi}%</div>
                                <div className="text-sm text-gray-600">ROI moyen</div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Gestion des états de chargement et d'erreur */}
                {loading && (
                    <div className="text-center py-12">
                        <div className="loading-spinner mx-auto mb-4"></div>
                        <p className="text-gray-600">Chargement des pronostics...</p>
                    </div>
                )}

                {error && (
                    <div className="text-center py-12">
                        <div className="text-red-600 mb-4">
                            <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="font-medium">Impossible de charger les pronostics</p>
                            <p className="text-sm text-gray-500 mt-1">{error}</p>
                        </div>
                        <button
                            onClick={refetch}
                            className="btn btn-outline"
                        >
                            Réessayer
                        </button>
                    </div>
                )}

                {/* Grille des pronostics */}
                {!loading && !error && (
                    <>
                        {freePronostics.length > 0 ? (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                                {freePronostics.map((pronostic) => (
                                    <PronosticCard key={pronostic._id} pronostic={pronostic} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="text-gray-500">
                                    <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    <p className="font-medium mb-2">Aucun pronostic gratuit disponible</p>
                                    <p className="text-sm">Nos experts préparent de nouveaux pronostics...</p>
                                </div>
                            </div>
                        )}

                        {/* Boutons d'action */}
                        <div className="text-center">
                            {/* Bouton pour afficher plus */}
                            {freePronostics.length > 0 && displayLimit < 6 && (
                                <button
                                    onClick={() => setDisplayLimit(6)}
                                    className="btn btn-outline mr-4 mb-4"
                                >
                                    Voir plus de pronostics
                                </button>
                            )}

                            {/* CTA vers inscription */}
                            <div className="inline-flex items-center justify-center p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl">
                                <div className="text-center">
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                        Accès à tous nos pronostics VIP
                                    </h3>
                                    <p className="text-gray-600 mb-4">
                                        Analyses détaillées, conseils de bankroll et statistiques avancées
                                    </p>
                                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                        <Link
                                            to="/register"
                                            className="btn btn-primary"
                                        >
                                            Inscription gratuite
                                        </Link>
                                        <Link
                                            to="/pricing"
                                            className="btn btn-outline"
                                        >
                                            Voir les abonnements
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </section>
    );
};

export default FreePronosticsSection;