// src/components/common/StakeStars.jsx - Composant réutilisable pour les étoiles
import React from 'react';

// ⭐ Configuration des étoiles
const stakeStars = {
    1: {
        stars: '⭐',
        label: 'Mise légère',
        description: 'Pronostic secondaire',
        color: 'text-gray-500',
        bgColor: 'bg-gray-100',
        borderColor: 'border-gray-300'
    },
    2: {
        stars: '⭐⭐',
        label: 'Mise normale',
        description: 'Pronostic standard',
        color: 'text-blue-500',
        bgColor: 'bg-blue-100',
        borderColor: 'border-blue-300'
    },
    3: {
        stars: '⭐⭐⭐',
        label: 'Mise importante',
        description: 'Bonne conviction',
        color: 'text-yellow-500',
        bgColor: 'bg-yellow-100',
        borderColor: 'border-yellow-300'
    },
    4: {
        stars: '⭐⭐⭐⭐',
        label: 'Mise forte',
        description: 'Très forte conviction',
        color: 'text-orange-500',
        bgColor: 'bg-orange-100',
        borderColor: 'border-orange-300'
    },
    5: {
        stars: '⭐⭐⭐⭐⭐',
        label: 'BANKO',
        description: 'Mise maximum',
        color: 'text-red-500',
        bgColor: 'bg-red-100',
        borderColor: 'border-red-300'
    }
};

// 🎨 Composant d'affichage simple (pour les cartes)
export const StakeStars = ({ stake, size = 'normal', showLabel = true }) => {
    const config = stakeStars[stake] || stakeStars[3];

    const sizeClasses = {
        small: 'text-sm',
        normal: 'text-base',
        large: 'text-lg'
    };

    return (
        <div className="inline-flex items-center">
            <span className={`${sizeClasses[size]} mr-2`}>{config.stars}</span>
            {showLabel && (
                <span className={`text-sm font-medium ${config.color}`}>
                    {config.label}
                </span>
            )}
        </div>
    );
};

// 🏷️ Composant badge (pour les tableaux admin)
export const StakeStarsBadge = ({ stake }) => {
    const config = stakeStars[stake] || stakeStars[3];

    return (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${config.bgColor} ${config.color} border ${config.borderColor}`}>
            <span className="mr-1">{config.stars}</span>
            {config.label}
        </span>
    );
};

// 🎯 Composant détaillé (pour les pages de détail)
export const StakeStarsDetailed = ({ stake }) => {
    const config = stakeStars[stake] || stakeStars[3];

    return (
        <div className={`inline-flex items-center px-4 py-2 rounded-lg ${config.bgColor} border ${config.borderColor}`}>
            <div className="text-center">
                <div className="text-2xl mb-1">{config.stars}</div>
                <div className={`text-sm font-medium ${config.color}`}>
                    {config.label}
                </div>
                <div className="text-xs text-gray-600">
                    {config.description}
                </div>
            </div>
        </div>
    );
};

// 🎮 Sélecteur pour l'admin
export const StakeStarsSelector = ({ value, onChange, disabled = false }) => {
    return (
        <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
                Force du pronostic (système d'étoiles)
            </label>

            <div className="grid grid-cols-5 gap-2">
                {[1, 2, 3, 4, 5].map(stars => {
                    const config = stakeStars[stars];
                    const isSelected = value === stars;

                    return (
                        <button
                            key={stars}
                            type="button"
                            onClick={() => !disabled && onChange(stars)}
                            disabled={disabled}
                            className={`p-3 border-2 rounded-lg text-center transition-all transform hover:scale-105 ${
                                isSelected
                                    ? `${config.borderColor} ${config.bgColor} ring-2 ring-offset-1 ring-blue-500 scale-105`
                                    : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                            } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                        >
                            <div className="text-xl mb-1">{config.stars}</div>
                            <div className={`text-xs font-medium ${isSelected ? config.color : 'text-gray-600'}`}>
                                {config.label}
                            </div>
                            <div className="text-xs text-gray-500">
                                {config.description}
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* Guide rapide */}
            <div className="bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                <div className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
                    💡 Guide des étoiles
                </div>
                <div className="text-xs text-blue-800 dark:text-blue-200 space-y-1">
                    <div>• <strong>⭐ - ⭐⭐</strong> : Pronostics secondaires, paris fun</div>
                    <div>• <strong>⭐⭐⭐</strong> : Vos pronostics quotidiens principaux</div>
                    <div>• <strong>⭐⭐⭐⭐ - ⭐⭐⭐⭐⭐</strong> : Vos coups de cœur, BANKO</div>
                </div>
            </div>
        </div>
    );
};

// 📊 Composant pour afficher les gains avec étoiles
export const StakeProfitDisplay = ({ stake, odds, result, className = "" }) => {
    const config = stakeStars[stake] || stakeStars[3];

    const calculateProfit = () => {
        if (result === 'won') {
            return `+${((odds - 1) * stake).toFixed(1)} ⭐`;
        } else if (result === 'lost') {
            return `-${stake} ⭐`;
        } else if (result === 'push' || result === 'void') {
            return '0 ⭐';
        }
        return 'En cours';
    };

    const getProfitColor = () => {
        if (result === 'won') return 'text-green-600 dark:text-green-400';
        if (result === 'lost') return 'text-red-600 dark:text-red-400';
        return 'text-gray-600 dark:text-gray-400';
    };

    return (
        <div className={`space-y-1 ${className}`}>
            <div className="flex items-center">
                <span className="text-lg mr-2">{config.stars}</span>
                <span className={`text-sm font-medium ${config.color}`}>
                    {config.label}
                </span>
            </div>
            {result !== 'pending' && (
                <div className={`text-sm font-bold ${getProfitColor()}`}>
                    {calculateProfit()}
                </div>
            )}
        </div>
    );
};

export default StakeStars;