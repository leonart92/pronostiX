// scripts/create-test-pronostics.js
const mongoose = require('mongoose');
const Pronostic = require('./models/Pronostic');
const User = require('./models/User');
require('dotenv').config();

async function createTestPronostics() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connecté à MongoDB');

        // Trouver un admin pour créer les pronostics
        const admin = await User.findOne({ role: 'admin' });
        if (!admin) {
            console.log('❌ Aucun admin trouvé. Créez d\'abord un utilisateur admin.');
            return;
        }

        console.log('👑 Admin trouvé:', admin.username);

        // Pronostics de test
        const testPronostics = [
            // Pronostics gratuits
            {
                sport: 'football',
                league: 'Ligue 1',
                homeTeam: 'PSG',
                awayTeam: 'OM',
                matchDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // Dans 2 jours
                predictionType: '1X2',
                prediction: 'Victoire PSG',
                odds: 1.75,
                stake: 8,
                confidence: 85,
                analysis: 'Le PSG reste favori à domicile face à l\'OM. Leur forme récente et leur supériorité technique devraient leur permettre de s\'imposer.',
                isFree: true,
                priority: 'high',
                createdBy: admin._id
            },
            {
                sport: 'tennis',
                league: 'ATP Masters',
                homeTeam: 'Djokovic',
                awayTeam: 'Nadal',
                matchDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // Demain
                predictionType: 'other',
                prediction: 'Djokovic en 3 sets',
                odds: 2.10,
                stake: 6,
                confidence: 70,
                analysis: 'Match serré mais Djokovic a l\'avantage sur dur.',
                isFree: true,
                priority: 'medium',
                createdBy: admin._id
            },

            // Pronostics premium
            {
                sport: 'football',
                league: 'Premier League',
                homeTeam: 'Manchester City',
                awayTeam: 'Liverpool',
                matchDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // Dans 3 jours
                predictionType: 'over_under',
                prediction: 'Plus de 2.5 buts',
                odds: 1.90,
                stake: 9,
                confidence: 90,
                analysis: 'Deux attaques prolifiques qui devraient nous offrir un festival offensif. Les statistiques des confrontations précédentes confirment cette tendance.',
                reasoning: 'City et Liverpool marquent en moyenne 2.8 buts par match cette saison.',
                isFree: false, // ← PREMIUM
                priority: 'high',
                createdBy: admin._id
            },
            {
                sport: 'basketball',
                league: 'NBA',
                homeTeam: 'Lakers',
                awayTeam: 'Warriors',
                matchDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // Demain
                predictionType: 'handicap',
                prediction: 'Lakers -5.5',
                odds: 1.95,
                stake: 7,
                confidence: 75,
                analysis: 'Les Lakers sont en grande forme à domicile et devraient dominer les Warriors affaiblis.',
                isFree: false, // ← PREMIUM
                priority: 'medium',
                createdBy: admin._id
            },
            {
                sport: 'tennis',
                league: 'WTA',
                homeTeam: 'Swiatek',
                awayTeam: 'Sabalenka',
                matchDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // Dans 4 jours
                predictionType: '1X2',
                prediction: 'Victoire Swiatek',
                odds: 1.65,
                stake: 8,
                confidence: 80,
                analysis: 'Swiatek domine sur terre battue et devrait s\'imposer facilement.',
                isFree: false, // ← PREMIUM
                priority: 'high',
                createdBy: admin._id
            },
            {
                sport: 'football',
                league: 'Champions League',
                homeTeam: 'Real Madrid',
                awayTeam: 'Bayern Munich',
                matchDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // Dans 5 jours
                predictionType: 'both_teams_score',
                prediction: 'Les deux équipes marquent',
                odds: 1.70,
                stake: 9,
                confidence: 85,
                analysis: 'Deux attaques de classe mondiale qui ne manqueront pas de trouver le chemin des filets.',
                isFree: false, // ← PREMIUM
                priority: 'high',
                createdBy: admin._id
            }
        ];

        // Supprimer les anciens pronostics de test (optionnel)
        await Pronostic.deleteMany({
            $or: [
                { homeTeam: { $in: ['PSG', 'Manchester City', 'Lakers', 'Real Madrid'] } },
                { awayTeam: { $in: ['OM', 'Liverpool', 'Warriors', 'Bayern Munich'] } }
            ]
        });

        // Créer les nouveaux pronostics
        const createdPronostics = await Pronostic.insertMany(testPronostics);

        console.log(`✅ ${createdPronostics.length} pronostics de test créés :`);

        createdPronostics.forEach((p, index) => {
            console.log(`${index + 1}. ${p.homeTeam} vs ${p.awayTeam} (${p.isFree ? 'GRATUIT' : 'PREMIUM'})`);
        });

        console.log('\n📊 Répartition :');
        const freeCount = createdPronostics.filter(p => p.isFree).length;
        const premiumCount = createdPronostics.filter(p => !p.isFree).length;
        console.log(`  - Gratuits : ${freeCount}`);
        console.log(`  - Premium : ${premiumCount}`);

        mongoose.disconnect();

    } catch (error) {
        console.error('❌ Erreur:', error);
        mongoose.disconnect();
    }
}

createTestPronostics();