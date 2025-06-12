import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { pronosticService } from '../services/pronostic.service';
import { useAuth } from '../context/AuthContext';

const SimulationPage = () => {
    const { user } = useAuth();
    const [settings, setSettings] = useState({
        stakePerBet: 100,
        initialBankroll: 1000,
        period: 'all',
        sport: 'all',
        strategy: 'fixed',
        minOdds: 1.0,
        maxOdds: 10.0
    });

    const [pronostics, setPronostics] = useState([]);
    const [simulationResults, setSimulationResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Charger les pronostics depuis l'API
    const loadPronostics = async () => {
        setLoading(true);
        setError('');

        try {
            // Construire les filtres
            const filters = {
                sort: 'date_asc',
                limit: 1000 // Limiter pour éviter les surcharges
            };

            if (settings.sport !== 'all') {
                filters.sport = settings.sport;
            }

            // Filtres par période
            if (settings.period !== 'all') {
                const now = new Date();
                switch (settings.period) {
                    case 'last30':
                        filters.dateFrom = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
                        break;
                    case 'last90':
                        filters.dateFrom = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString();
                        break;
                    case 'thisYear':
                        filters.dateFrom = new Date(now.getFullYear(), 0, 1).toISOString();
                        break;
                }
            }

            const response = await pronosticService.getPronostics(filters);

            if (response.success) {
                console.log('📊 Tous les pronostics:', response.data.pronostics.length);
                console.log('📋 Résultats trouvés:', response.data.pronostics.map(p => p.result));
                console.log('📋 Premiers pronostics:', response.data.pronostics.slice(0, 3));

                // Filtrer les pronostics terminés et par cotes
                const filteredPronostics = response.data.pronostics.filter(p =>
                    ['won', 'lost'].includes(p.result) &&
                    p.odds >= settings.minOdds &&
                    p.odds <= settings.maxOdds
                );

                setPronostics(filteredPronostics);
                calculateSimulation(filteredPronostics);
            } else {
                setError('Erreur lors du chargement des pronostics');
            }
        } catch (err) {
            console.error('Erreur chargement pronostics:', err);
            setError('Impossible de charger les données');
        }

        setLoading(false);
    };

    // Calculer la simulation
    const calculateSimulation = (dataPronostics = pronostics) => {
        if (!dataPronostics.length) {
            setSimulationResults(null);
            return;
        }

        let currentBankroll = settings.initialBankroll;
        let totalStaked = 0;
        let totalProfit = 0;
        let winCount = 0;
        let lossCount = 0;
        let maxBankroll = settings.initialBankroll;
        let minBankroll = settings.initialBankroll;

        const chartData = [{ day: 0, bankroll: currentBankroll, date: 'Début' }];
        const detailedResults = [];

        dataPronostics.forEach((prono, index) => {
            let stake;

            switch (settings.strategy) {
                case 'fixed':
                    stake = settings.stakePerBet;
                    break;
                case 'percentage':
                    stake = currentBankroll * (settings.stakePerBet / 100);
                    break;
                default:
                    stake = settings.stakePerBet;
            }

            // Ne pas miser plus que la bankroll disponible
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
            maxBankroll = Math.max(maxBankroll, currentBankroll);
            minBankroll = Math.min(minBankroll, currentBankroll);

            detailedResults.push({
                day: index + 1,
                match: `${prono.homeTeam} vs ${prono.awayTeam}`,
                sport: prono.sport,
                league: prono.league,
                odds: prono.odds,
                stake: stake,
                result: prono.result,
                profit: profit,
                bankroll: currentBankroll,
                date: new Date(prono.matchDate).toLocaleDateString('fr-FR')
            });

            chartData.push({
                day: index + 1,
                bankroll: Math.round(currentBankroll * 100) / 100,
                date: new Date(prono.matchDate).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })
            });

            // Arrêter si la bankroll est épuisée
            if (currentBankroll <= 0) {
                currentBankroll = 0;
                return;
            }
        });

        const roi = totalStaked > 0 ? (totalProfit / totalStaked) * 100 : 0;
        const winRate = (winCount + lossCount) > 0 ? (winCount / (winCount + lossCount)) * 100 : 0;
        const maxDrawdown = maxBankroll > 0 ? ((maxBankroll - minBankroll) / maxBankroll) * 100 : 0;

        setSimulationResults({
            summary: {
                initialBankroll: settings.initialBankroll,
                finalBankroll: currentBankroll,
                totalProfit: totalProfit,
                totalStaked: totalStaked,
                roi: roi,
                winRate: winRate,
                totalBets: winCount + lossCount,
                winCount: winCount,
                lossCount: lossCount,
                maxBankroll: maxBankroll,
                minBankroll: minBankroll,
                maxDrawdown: maxDrawdown
            },
            chartData: chartData,
            detailedResults: detailedResults
        });
    };

    // Recharger quand les settings changent
    useEffect(() => {
        if (user) {
            loadPronostics();
        }
    }, [settings.period, settings.sport, settings.minOdds, settings.maxOdds]);

    // Recalculer quand mise/stratégie change (sans recharger les data)
    useEffect(() => {
        if (pronostics.length > 0) {
            calculateSimulation();
        }
    }, [settings.stakePerBet, settings.initialBankroll, settings.strategy]);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'EUR'
        }).format(amount);
    };

    // Vérifier si l'utilisateur a un abonnement actif
    if (!user || user.subscriptionStatus !== 'active') {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-16">
                <div className="container mx-auto px-4 text-center">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-12 max-w-2xl mx-auto">
                        <div className="text-6xl mb-6">🔒</div>
                        <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
                            Fonctionnalité Premium
                        </h1>
                        <p className="text-gray-600 dark:text-gray-300 mb-8">
                            Le simulateur de gains est réservé aux abonnés premium.
                            Souscrivez à un abonnement pour accéder à cette fonctionnalité.
                        </p>
                        <button
                            onClick={() => window.location.href = '/pricing'}
                            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                        >
                            Voir les abonnements
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-8">
            <div className="container mx-auto px-4 max-w-7xl">

                {/* Header avec disclaimer */}
                <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl p-8 text-white mb-8 shadow-2xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl font-bold mb-4 flex items-center">
                                🎮 Simulateur de gains
                                <span className="ml-3 text-sm bg-white/20 px-3 py-1 rounded-full">PREMIUM</span>
                            </h1>
                            <p className="text-blue-100 text-lg mb-6 max-w-2xl">
                                Estimez vos gains potentiels en appliquant vos propres stratégies de mise sur notre historique de pronostics.
                            </p>
                        </div>
                        <div className="hidden lg:block">
                            <div className="text-6xl opacity-20">📊</div>
                        </div>
                    </div>

                    <div className="bg-blue-500/30 backdrop-blur-sm rounded-xl p-4 border border-blue-400/30">
                        <div className="flex items-start space-x-3">
                            <div className="text-yellow-300 text-xl">⚠️</div>
                            <div>
                                <p className="font-semibold text-sm mb-1">Avertissement important</p>
                                <p className="text-xs text-blue-100 leading-relaxed">
                                    Cette simulation est basée sur les performances passées et ne garantit pas les résultats futurs.
                                    Les paris sportifs comportent des risques. Ne misez que ce que vous pouvez vous permettre de perdre.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

                    {/* Panel de configuration */}
                    <div className="lg:col-span-1">
                        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 sticky top-4 border border-gray-100 dark:border-slate-700">
                            <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white flex items-center">
                                ⚙️ Configuration
                            </h2>

                            {/* Stratégie de mise */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium mb-3 text-gray-700 dark:text-gray-300">
                                    📈 Stratégie de mise
                                </label>
                                <select
                                    value={settings.strategy}
                                    onChange={(e) => setSettings(prev => ({...prev, strategy: e.target.value}))}
                                    className="w-full p-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="fixed">Mise fixe</option>
                                    <option value="percentage">% de la bankroll</option>
                                </select>
                            </div>

                            {/* Mise par pari */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium mb-3 text-gray-700 dark:text-gray-300">
                                    💰 {settings.strategy === 'fixed' ? 'Mise par pari' : 'Pourcentage par pari'}
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={settings.stakePerBet}
                                        onChange={(e) => setSettings(prev => ({
                                            ...prev,
                                            stakePerBet: parseFloat(e.target.value) || 0
                                        }))}
                                        className="w-full p-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 pr-10"
                                        min="1"
                                        step={settings.strategy === 'fixed' ? "10" : "0.1"}
                                    />
                                    <span className="absolute right-3 top-3 text-gray-500">
                                        {settings.strategy === 'fixed' ? '€' : '%'}
                                    </span>
                                </div>
                            </div>

                            {/* Bankroll initial */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium mb-3 text-gray-700 dark:text-gray-300">
                                    🏦 Bankroll de départ
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={settings.initialBankroll}
                                        onChange={(e) => setSettings(prev => ({
                                            ...prev,
                                            initialBankroll: parseFloat(e.target.value) || 0
                                        }))}
                                        className="w-full p-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 pr-8"
                                        min="100"
                                        step="1000"
                                    />
                                    <span className="absolute right-3 top-3 text-gray-500">€</span>
                                </div>
                            </div>

                            {/* Période */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium mb-3 text-gray-700 dark:text-gray-300">
                                    📅 Période d'analyse
                                </label>
                                <select
                                    value={settings.period}
                                    onChange={(e) => setSettings(prev => ({...prev, period: e.target.value}))}
                                    className="w-full p-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="all">Tout l'historique</option>
                                    <option value="thisYear">Cette année</option>
                                    <option value="last90">90 derniers jours</option>
                                    <option value="last30">30 derniers jours</option>
                                </select>
                            </div>

                            {/* Sport */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium mb-3 text-gray-700 dark:text-gray-300">
                                    ⚽ Sport
                                </label>
                                <select
                                    value={settings.sport}
                                    onChange={(e) => setSettings(prev => ({...prev, sport: e.target.value}))}
                                    className="w-full p-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="all">Tous les sports</option>
                                    <option value="football">Football</option>
                                    <option value="tennis">Tennis</option>
                                    <option value="basketball">Basketball</option>
                                    <option value="handball">Handball</option>
                                    <option value="volleyball">Volleyball</option>
                                </select>
                            </div>

                            {/* Plage de cotes */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium mb-3 text-gray-700 dark:text-gray-300">
                                    🎯 Plage de cotes
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    <input
                                        type="number"
                                        placeholder="Min"
                                        value={settings.minOdds}
                                        onChange={(e) => setSettings(prev => ({
                                            ...prev,
                                            minOdds: parseFloat(e.target.value) || 1.0
                                        }))}
                                        className="p-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                                        min="1.01"
                                        step="0.1"
                                    />
                                    <input
                                        type="number"
                                        placeholder="Max"
                                        value={settings.maxOdds}
                                        onChange={(e) => setSettings(prev => ({
                                            ...prev,
                                            maxOdds: parseFloat(e.target.value) || 10.0
                                        }))}
                                        className="p-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                                        min="1.01"
                                        step="0.1"
                                    />
                                </div>
                            </div>

                            {loading && (
                                <div className="text-center py-4">
                                    <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-lg">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                                        Chargement...
                                    </div>
                                </div>
                            )}

                            {error && (
                                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                                    {error}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Résultats */}
                    <div className="lg:col-span-3">
                        {simulationResults ? (
                            <>
                                {/* Résumé des résultats */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 text-center border border-gray-100 dark:border-slate-700">
                                        <div className="text-4xl mb-3">💰</div>
                                        <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                                            {formatCurrency(simulationResults.summary.finalBankroll)}
                                        </div>
                                        <div className="text-sm text-gray-600 dark:text-gray-400">Bankroll finale</div>
                                        <div className="text-xs text-gray-500 mt-1">
                                            Départ: {formatCurrency(simulationResults.summary.initialBankroll)}
                                        </div>
                                    </div>

                                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 text-center border border-gray-100 dark:border-slate-700">
                                        <div className="text-4xl mb-3">
                                            {simulationResults.summary.totalProfit >= 0 ? '📈' : '📉'}
                                        </div>
                                        <div className={`text-3xl font-bold mb-1 ${
                                            simulationResults.summary.totalProfit >= 0
                                                ? 'text-green-600'
                                                : 'text-red-600'
                                        }`}>
                                            {simulationResults.summary.totalProfit >= 0 ? '+' : ''}
                                            {formatCurrency(simulationResults.summary.totalProfit)}
                                        </div>
                                        <div className="text-sm text-gray-600 dark:text-gray-400">Profit/Perte</div>
                                        <div className="text-xs text-gray-500 mt-1">
                                            Misé: {formatCurrency(simulationResults.summary.totalStaked)}
                                        </div>
                                    </div>

                                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 text-center border border-gray-100 dark:border-slate-700">
                                        <div className="text-4xl mb-3">📊</div>
                                        <div className={`text-3xl font-bold mb-1 ${
                                            simulationResults.summary.roi >= 0
                                                ? 'text-green-600'
                                                : 'text-red-600'
                                        }`}>
                                            {simulationResults.summary.roi >= 0 ? '+' : ''}
                                            {simulationResults.summary.roi.toFixed(1)}%
                                        </div>
                                        <div className="text-sm text-gray-600 dark:text-gray-400">ROI</div>
                                        <div className="text-xs text-gray-500 mt-1">
                                            {simulationResults.summary.winRate.toFixed(1)}% de réussite
                                        </div>
                                    </div>
                                </div>

                                {/* Statistiques détaillées */}
                                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 mb-8 border border-gray-100 dark:border-slate-700">
                                    <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">📋 Statistiques détaillées</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-blue-600">
                                                {simulationResults.summary.totalBets}
                                            </div>
                                            <div className="text-sm text-gray-600 dark:text-gray-400">Total paris</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-green-600">
                                                {simulationResults.summary.winCount}
                                            </div>
                                            <div className="text-sm text-gray-600 dark:text-gray-400">Paris gagnés</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-red-600">
                                                {simulationResults.summary.lossCount}
                                            </div>
                                            <div className="text-sm text-gray-600 dark:text-gray-400">Paris perdus</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-orange-600">
                                                {simulationResults.summary.maxDrawdown.toFixed(1)}%
                                            </div>
                                            <div className="text-sm text-gray-600 dark:text-gray-400">Drawdown max</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Graphique d'évolution */}
                                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 mb-8 border border-gray-100 dark:border-slate-700">
                                    <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">📈 Évolution de la bankroll</h3>
                                    <div className="h-80">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart data={simulationResults.chartData}>
                                                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                                                <XAxis
                                                    dataKey="day"
                                                    className="text-xs"
                                                />
                                                <YAxis
                                                    className="text-xs"
                                                    tickFormatter={(value) => `${value}€`}
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

                                {/* Historique détaillé */}
                                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-slate-700">
                                    <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">📜 Historique détaillé</h3>
                                    <div className="max-h-96 overflow-y-auto">
                                        <table className="w-full text-sm">
                                            <thead className="bg-gray-50 dark:bg-slate-700 sticky top-0">
                                            <tr>
                                                <th className="text-left p-3 font-medium text-gray-600 dark:text-gray-300">Date</th>
                                                <th className="text-left p-3 font-medium text-gray-600 dark:text-gray-300">Match</th>
                                                <th className="text-center p-3 font-medium text-gray-600 dark:text-gray-300">Cote</th>
                                                <th className="text-center p-3 font-medium text-gray-600 dark:text-gray-300">Mise</th>
                                                <th className="text-center p-3 font-medium text-gray-600 dark:text-gray-300">Résultat</th>
                                                <th className="text-right p-3 font-medium text-gray-600 dark:text-gray-300">Bankroll</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {simulationResults.detailedResults.map((result, index) => (
                                                <tr key={index} className="border-b dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700">
                                                    <td className="p-3 text-gray-900 dark:text-white">{result.date}</td>
                                                    <td className="p-3">
                                                        <div className="text-gray-900 dark:text-white font-medium">{result.match}</div>
                                                        <div className="text-xs text-gray-500">{result.sport} • {result.league}</div>
                                                    </td>
                                                    <td className="text-center p-3 text-gray-900 dark:text-white font-mono">{result.odds}</td>
                                                    <td className="text-center p-3 text-gray-900 dark:text-white">{formatCurrency(result.stake)}</td>
                                                    <td className="text-center p-3">
                                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                                result.result === 'won'
                                                                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                                                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                                            }`}>
                                                                {result.result === 'won' ? `+${formatCurrency(result.profit)}` : formatCurrency(result.profit)}
                                                            </span>
                                                    </td>
                                                    <td className="text-right p-3 font-mono text-gray-900 dark:text-white">
                                                        {formatCurrency(result.bankroll)}
                                                    </td>
                                                </tr>
                                            ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-12 text-center border border-gray-100 dark:border-slate-700">
                                {loading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                                        <p className="text-gray-600 dark:text-gray-400">Chargement des données...</p>
                                    </>
                                ) : pronostics.length === 0 ? (
                                    <>
                                        <div className="text-6xl mb-4">📊</div>
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Aucune donnée disponible</h3>
                                        <p className="text-gray-600 dark:text-gray-400">
                                            Aucun pronostic ne correspond à vos critères. Essayez d'ajuster les filtres.
                                        </p>
                                    </>
                                ) : (
                                    <>
                                        <div className="text-6xl mb-4">🎮</div>
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Prêt pour la simulation</h3>
                                        <p className="text-gray-600 dark:text-gray-400">
                                            Ajustez vos paramètres à gauche pour commencer la simulation.
                                        </p>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SimulationPage;