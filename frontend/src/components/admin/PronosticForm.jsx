// src/components/admin/components/PronosticForm.jsx avec système d'étoiles
import React, { useState, useEffect } from 'react';
import { StakeStarsSelector } from '../common/StakeStars';

const PronosticForm = ({ pronostic, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        sport: 'football',
        league: '',
        homeTeam: '',
        awayTeam: '',
        matchDate: '',
        prediction: '',
        predictionType: '1X2',
        odds: '',
        stake: 3,        // ⭐⭐⭐ Par défaut 3 étoiles
        confidence: 50,
        analysis: '',
        reasoning: '',
        tags: '',
        priority: 'medium',
        bookmaker: '',
        isFree: false
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (pronostic) {
            setFormData({
                ...pronostic,
                matchDate: new Date(pronostic.matchDate).toISOString().slice(0, 16),
                tags: pronostic.tags?.join(', ') || ''
            });
        }
    }, [pronostic]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    // ⭐ NOUVEAU HANDLER pour les étoiles
    const handleStakeChange = (stakeValue) => {
        setFormData(prev => ({
            ...prev,
            stake: stakeValue
        }));

        // Clear error if any
        if (errors.stake) {
            setErrors(prev => ({ ...prev, stake: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.league.trim()) {
            newErrors.league = 'La ligue est requise';
        }
        if (!formData.homeTeam.trim()) {
            newErrors.homeTeam = 'L\'équipe domicile est requise';
        }
        if (!formData.awayTeam.trim()) {
            newErrors.awayTeam = 'L\'équipe extérieur est requise';
        }
        if (!formData.matchDate) {
            newErrors.matchDate = 'La date du match est requise';
        }
        if (!formData.prediction.trim()) {
            newErrors.prediction = 'Le pronostic est requis';
        }
        if (!formData.odds || formData.odds < 1.01 || formData.odds > 50) {
            newErrors.odds = 'La cote doit être entre 1.01 et 50';
        }
        if (!formData.stake || formData.stake < 1 || formData.stake > 5) {
            newErrors.stake = 'Sélectionnez entre 1 et 5 étoiles';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const submitData = {
            ...formData,
            odds: parseFloat(formData.odds),
            stake: parseInt(formData.stake),        // ⭐ Les étoiles sont des entiers 1-5
            confidence: parseInt(formData.confidence),
            tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : []
        };

        onSave(submitData);
    };

    // Exemples de pronostics selon le type sélectionné
    const getPredictionExamples = (type) => {
        const examples = {
            '1X2': 'Victoire PSG, Match nul, Victoire OM',
            'over_under': 'Plus de 2.5 buts, Moins de 1.5 buts',
            'both_teams_score': 'Les deux équipes marquent, Une seule équipe marque',
            'handicap': 'PSG -1.5, OM +2.5',
            'correct_score': '2-1, 1-0, 3-2',
            'other': 'Premier buteur, Nombre de cartons...'
        };
        return examples[type] || 'Décrivez votre pronostic...';
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                {/* Overlay */}
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onCancel}></div>

                {/* Modal */}
                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-5xl sm:w-full">
                    <form onSubmit={handleSubmit}>
                        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg leading-6 font-medium text-gray-900">
                                    {pronostic ? 'Modifier le pronostic' : 'Nouveau pronostic'}
                                </h3>
                                <button
                                    type="button"
                                    onClick={onCancel}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Informations du match */}
                                <div className="space-y-4">
                                    <h4 className="text-md font-medium text-gray-900 border-b pb-2">Informations du match</h4>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Sport</label>
                                        <select
                                            name="sport"
                                            value={formData.sport}
                                            onChange={handleChange}
                                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        >
                                            <option value="football">Football</option>
                                            <option value="tennis">Tennis</option>
                                            <option value="basketball">Basketball</option>
                                            <option value="handball">Handball</option>
                                            <option value="volleyball">Volleyball</option>
                                            <option value="other">Autre</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Ligue / Compétition</label>
                                        <input
                                            type="text"
                                            name="league"
                                            value={formData.league}
                                            onChange={handleChange}
                                            className={`w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${errors.league ? 'border-red-300' : ''}`}
                                            placeholder="Ex: Ligue 1, Premier League, Roland Garros..."
                                        />
                                        {errors.league && <p className="text-red-500 text-xs mt-1">{errors.league}</p>}
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                {formData.sport === 'tennis' ? 'Joueur 1' : 'Équipe domicile'}
                                            </label>
                                            <input
                                                type="text"
                                                name="homeTeam"
                                                value={formData.homeTeam}
                                                onChange={handleChange}
                                                className={`w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${errors.homeTeam ? 'border-red-300' : ''}`}
                                                placeholder={formData.sport === 'tennis' ? 'Federer' : 'PSG'}
                                            />
                                            {errors.homeTeam && <p className="text-red-500 text-xs mt-1">{errors.homeTeam}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                {formData.sport === 'tennis' ? 'Joueur 2' : 'Équipe extérieur'}
                                            </label>
                                            <input
                                                type="text"
                                                name="awayTeam"
                                                value={formData.awayTeam}
                                                onChange={handleChange}
                                                className={`w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${errors.awayTeam ? 'border-red-300' : ''}`}
                                                placeholder={formData.sport === 'tennis' ? 'Nadal' : 'OM'}
                                            />
                                            {errors.awayTeam && <p className="text-red-500 text-xs mt-1">{errors.awayTeam}</p>}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Date et heure du match</label>
                                        <input
                                            type="datetime-local"
                                            name="matchDate"
                                            value={formData.matchDate}
                                            onChange={handleChange}
                                            className={`w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${errors.matchDate ? 'border-red-300' : ''}`}
                                        />
                                        {errors.matchDate && <p className="text-red-500 text-xs mt-1">{errors.matchDate}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Bookmaker (optionnel)</label>
                                        <input
                                            type="text"
                                            name="bookmaker"
                                            value={formData.bookmaker}
                                            onChange={handleChange}
                                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            placeholder="Betclic, Winamax, Unibet..."
                                        />
                                    </div>
                                </div>

                                {/* Informations du pronostic */}
                                <div className="space-y-4">
                                    <h4 className="text-md font-medium text-gray-900 border-b pb-2">Pronostic</h4>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Type de pari</label>
                                        <select
                                            name="predictionType"
                                            value={formData.predictionType}
                                            onChange={handleChange}
                                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        >
                                            <option value="1X2">1X2 (Victoire/Nul/Défaite)</option>
                                            <option value="over_under">Plus/Moins (Buts, Jeux...)</option>
                                            <option value="both_teams_score">Les deux équipes marquent</option>
                                            <option value="handicap">Handicap</option>
                                            <option value="correct_score">Score exact</option>
                                            <option value="other">Autre</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Votre pronostic <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="prediction"
                                            value={formData.prediction}
                                            onChange={handleChange}
                                            className={`w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${errors.prediction ? 'border-red-300' : ''}`}
                                            placeholder={getPredictionExamples(formData.predictionType)}
                                        />
                                        {errors.prediction && <p className="text-red-500 text-xs mt-1">{errors.prediction}</p>}
                                        <p className="text-xs text-gray-500 mt-1">
                                            Exemples : {getPredictionExamples(formData.predictionType)}
                                        </p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Cote</label>
                                        <input
                                            type="number"
                                            name="odds"
                                            value={formData.odds}
                                            onChange={handleChange}
                                            step="0.01"
                                            min="1.01"
                                            max="50"
                                            className={`w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${errors.odds ? 'border-red-300' : ''}`}
                                            placeholder="1.85"
                                        />
                                        {errors.odds && <p className="text-red-500 text-xs mt-1">{errors.odds}</p>}
                                    </div>

                                    {/* ⭐ NOUVEAU SÉLECTEUR D'ÉTOILES */}
                                    <div>
                                        <StakeStarsSelector
                                            value={formData.stake}
                                            onChange={handleStakeChange}
                                        />
                                        {errors.stake && <p className="text-red-500 text-xs mt-1">{errors.stake}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Confiance ({formData.confidence}%)
                                        </label>
                                        <input
                                            type="range"
                                            name="confidence"
                                            value={formData.confidence}
                                            onChange={handleChange}
                                            min="1"
                                            max="100"
                                            className="w-full"
                                        />
                                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                                            <span>Faible</span>
                                            <span>Moyenne</span>
                                            <span>Élevée</span>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Priorité</label>
                                        <select
                                            name="priority"
                                            value={formData.priority}
                                            onChange={handleChange}
                                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        >
                                            <option value="low">🟢 Faible - Pari fun</option>
                                            <option value="medium">🟡 Moyenne - Bon potentiel</option>
                                            <option value="high">🔴 Élevée - Pick du jour</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="flex items-center">
                                            <input
                                                type="checkbox"
                                                name="isFree"
                                                checked={formData.isFree}
                                                onChange={handleChange}
                                                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            />
                                            <span className="ml-2 text-sm text-gray-700">Pronostic gratuit (visible par tous)</span>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Analyse et raisonnement */}
                            <div className="mt-8 space-y-4">
                                <h4 className="text-md font-medium text-gray-900 border-b pb-2">Analyse et justification</h4>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Analyse détaillée</label>
                                    <textarea
                                        name="analysis"
                                        value={formData.analysis}
                                        onChange={handleChange}
                                        rows="4"
                                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        placeholder="Analyse complète du match : forme des équipes, statistiques, historique des confrontations, blessures, enjeux..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Raisonnement du pronostic</label>
                                    <textarea
                                        name="reasoning"
                                        value={formData.reasoning}
                                        onChange={handleChange}
                                        rows="3"
                                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        placeholder="Pourquoi ce pronostic ? Justification de votre choix, facteurs clés..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tags (séparés par des virgules)</label>
                                    <input
                                        type="text"
                                        name="tags"
                                        value={formData.tags}
                                        onChange={handleChange}
                                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        placeholder="favori, statistiques, forme, derby, finale"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Mots-clés pour faciliter la recherche et le classement</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                            <button
                                type="submit"
                                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                            >
                                {pronostic ? 'Mettre à jour' : 'Créer le pronostic'}
                            </button>
                            <button
                                type="button"
                                onClick={onCancel}
                                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                            >
                                Annuler
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PronosticForm;