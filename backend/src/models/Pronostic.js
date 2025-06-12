// src/models/Pronostic.js - Modèle avec système d'étoiles
const mongoose = require('mongoose');

const pronosticSchema = new mongoose.Schema({
    sport: {
        type: String,
        required: true,
        enum: ['football', 'tennis', 'basketball', 'handball', 'volleyball', 'other']
    },
    league: {
        type: String,
        required: true,
        trim: true
    },
    homeTeam: {
        type: String,
        required: true,
        trim: true
    },
    awayTeam: {
        type: String,
        required: true,
        trim: true
    },
    matchDate: {
        type: Date,
        required: true
    },

    // Le pronostic écrit à la main
    prediction: {
        type: String,
        required: true,
        trim: true,
        maxlength: 200
    },

    // Type de pari pour la catégorisation
    predictionType: {
        type: String,
        required: true,
        enum: ['1X2', 'over_under', 'both_teams_score', 'handicap', 'correct_score', 'other']
    },

    odds: {
        type: Number,
        required: true,
        min: 1.01,
        max: 50.00
    },

    // ⭐ NOUVEAU SYSTÈME D'ÉTOILES (1-5 au lieu de 1-10)
    stake: {
        type: Number,
        required: true,
        min: 1,        // ⭐ Minimum 1 étoile
        max: 5,        // ⭐⭐⭐⭐⭐ Maximum 5 étoiles
        default: 3     // ⭐⭐⭐ 3 étoiles par défaut
    },
    stakeType: {
        type: String,
        enum: ['stars'],
        default: 'stars'
    },

    confidence: {
        type: Number,
        required: true,
        min: 1,
        max: 100,
        default: 50
    },

    result: {
        type: String,
        enum: ['pending', 'won', 'lost', 'void', 'push'],
        default: 'pending'
    },
    actualResult: {
        type: String,
        default: null
    },
    profit: {
        type: Number,
        default: 0
    },
    isVisible: {
        type: Boolean,
        default: true
    },
    isFree: {
        type: Boolean,
        default: false
    },
    publishedAt: {
        type: Date,
        default: null
    },

    analysis: {
        type: String,
        maxlength: 2000
    },
    reasoning: {
        type: String,
        maxlength: 1000
    },

    tags: [{
        type: String,
        trim: true,
    }],
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    },
    bookmaker: {
        type: String,
        trim: true
    },

    views: {
        type: Number,
        default: 0
    },
    likes: {
        type: Number,
        default: 0
    },

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

// Indices pour les performances
pronosticSchema.index({ sport: 1 });
pronosticSchema.index({ matchDate: 1 });
pronosticSchema.index({ isVisible: 1 });
pronosticSchema.index({ result: 1 });
pronosticSchema.index({ publishedAt: 1 });
pronosticSchema.index({ createdAt: -1 });
pronosticSchema.index({ prediction: 'text' });

// Indices composés
pronosticSchema.index({ sport: 1, isVisible: 1, matchDate: 1 });
pronosticSchema.index({ isVisible: 1, publishedAt: -1 });

// Méthodes d'instance
pronosticSchema.methods.publish = function () {
    this.isVisible = true;
    this.publishedAt = new Date();
    return this.save();
};

pronosticSchema.methods.unpublish = function () {
    this.isVisible = false;
    this.publishedAt = null;
    return this.save();
};

// ⭐ MÉTHODES ADAPTÉES AU SYSTÈME D'ÉTOILES
pronosticSchema.methods.markAsWon = function (actualResult = '') {
    this.result = 'won';
    this.actualResult = actualResult;
    // Profit basé sur les étoiles (mise en étoiles)
    this.profit = (this.odds - 1) * this.stake;
    return this.save();
};

pronosticSchema.methods.markAsLost = function (actualResult = '') {
    this.result = 'lost';
    this.actualResult = actualResult;
    // Perte = nombre d'étoiles
    this.profit = -this.stake;
    return this.save();
};

pronosticSchema.methods.markAsPush = function (actualResult = '') {
    this.result = 'push';
    this.actualResult = actualResult;
    this.profit = 0;
    return this.save();
};

pronosticSchema.methods.incrementViews = function () {
    this.views += 1;
    return this.save();
};

// ⭐ NOUVELLE MÉTHODE - Obtenir la description de la mise
pronosticSchema.methods.getStakeDescription = function() {
    const stakeDescriptions = {
        1: { label: 'Mise légère', description: 'Pronostic secondaire' },
        2: { label: 'Mise normale', description: 'Pronostic standard' },
        3: { label: 'Mise importante', description: 'Bonne conviction' },
        4: { label: 'Mise forte', description: 'Très forte conviction' },
        5: { label: 'BANKO', description: 'Mise maximum' }
    };
    return stakeDescriptions[this.stake] || stakeDescriptions[3];
};

// Propriétés virtuelles
pronosticSchema.virtual('roi').get(function () {
    if (this.result === 'pending' || this.stake === 0)
        return 0;
    return ((this.profit / this.stake) * 100).toFixed(2);
});

pronosticSchema.virtual('isUpcoming').get(function () {
    return this.matchDate > new Date();
});

// ⭐ NOUVELLE PROPRIÉTÉ VIRTUELLE - Étoiles affichage
pronosticSchema.virtual('starsDisplay').get(function() {
    return '⭐'.repeat(this.stake);
});

// Méthodes statiques (adaptées pour les étoiles)
pronosticSchema.statics.getStats = async function(filters = {}) {
    const pipeline = [
        { $match: { result: { $in: ['won', 'lost'] }, ...filters } },
        {
            $group: {
                _id: null,
                totalBets: { $sum: 1 },
                wonBets: {
                    $sum: { $cond: [{ $eq: ['$result', 'won'] }, 1, 0] }
                },
                totalStake: { $sum: '$stake' },        // Somme des étoiles
                totalProfit: { $sum: '$profit' },      // Profit en étoiles
                avgOdds: { $avg: '$odds' },
                avgStake: { $avg: '$stake' }           // Moyenne des étoiles
            }
        }
    ];

    const result = await this.aggregate(pipeline);

    if (result.length === 0) {
        return {
            totalBets: 0,
            wonBets: 0,
            winRate: 0,
            totalStake: 0,
            totalProfit: 0,
            roi: 0,
            avgOdds: 0,
            avgStake: 0
        };
    }

    const stats = result[0];
    stats.winRate = ((stats.wonBets / stats.totalBets) * 100).toFixed(2);
    stats.roi = ((stats.totalProfit / stats.totalStake) * 100).toFixed(2);

    return stats;
};

pronosticSchema.statics.getMonthlyStats = async function(year = new Date().getFullYear()) {
    const pipeline = [
        {
            $match: {
                result: { $in: ['won', 'lost'] },
                createdAt: {
                    $gte: new Date(year, 0, 1),
                    $lt: new Date(year + 1, 0, 1)
                }
            }
        },
        {
            $group: {
                _id: { $month: '$createdAt' },
                totalBets: { $sum: 1 },
                wonBets: { $sum: { $cond: [{ $eq: ['$result', 'won'] }, 1, 0] } },
                totalProfit: { $sum: '$profit' },       // Profit en étoiles
                totalStake: { $sum: '$stake' }          // Total étoiles misées
            }
        },
        { $sort: { '_id': 1 } }
    ];

    return this.aggregate(pipeline);
};

module.exports = mongoose.model('Pronostic', pronosticSchema);