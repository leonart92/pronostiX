const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const pronosticRoutes = require('./routes/pronosticRoutes');
const subscriptionRoutes = require('./routes/subscriptionRoutes');
const adminRoutes = require('./routes/adminRoutes');
const contactRoutes = require('./routes/contactRoutes');

const  { errorHandler } = require('./middlewares/errorHandler');
const { logger } = require('./utils/logger');

const app = express();
const PORT = process.env.PORT || 5000;

// Configuration MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => logger.info('✅ MongoDB connecté'))
    .catch(err => logger.error('❌ Erreur MongoDB:', err));

// Middlewares de sécurité
app.use(helmet());
app.use(compression());
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limite chaque IP à 100 requêtes par windowMs
    message: 'Trop de requêtes depuis cette IP, réessayez plus tard.',
    standardHeaders: true,
    legacyHeaders: false
});

app.use('/api/', limiter);

// Rate limiting strict pour auth
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 1000,
    message: 'Trop de tentatives de connexion, réessayez plus tard.'
});
app.use('/api/auth', authLimiter);

// Middlewares généraux
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/pronostics', pronosticRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Route par défaut
app.get('/', (req, res) => {
    res.json({
        message: '🏆 API Pronostics Sportifs',
        version: '1.0.0',
        status: 'Running'
    });
});

// Gestion des erreurs
app.use(errorHandler);

// Gestion des routes non trouvées
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route non trouvée'
    });
});

// Démarrage du serveur
app.listen(PORT, () => {
    logger.info(`🚀 Serveur démarré sur le port ${PORT}`);
    logger.info(`🌍 Environnement: ${process.env.NODE_ENV || 'development'}`);
});

// ========================================
// 🏓 KEEP ALIVE HACK - Évite les cold starts Render
// ========================================

const keepAlive = () => {
    // ⚠️ REMPLACE PAR TON URL RENDER ⚠️
    const appUrl = process.env.RENDER_EXTERNAL_URL ||
        'https://pronostix.onrender.com'; // ← CHANGE ICI !

    const interval = 10 * 60 * 1000; // 10 minutes

    logger.info(`🏓 Keep alive démarré: ping toutes les ${interval/1000/60} minutes`);
    logger.info(`🎯 URL à ping: ${appUrl}/health`);

    setInterval(async () => {
        try {
            const startTime = Date.now();

            // Utilisation de fetch natif Node.js (pas besoin d'import)
            const response = await fetch(`${appUrl}/health`, {
                method: 'GET',
                headers: {
                    'User-Agent': 'KeepAlive-Bot/1.0',
                    'Accept': 'application/json'
                },
                signal: AbortSignal.timeout(30000) // 30 secondes timeout
            });

            const duration = Date.now() - startTime;

            if (response.ok) {
                logger.info(`🏓 Keep alive OK (${duration}ms) - ${new Date().toLocaleTimeString()}`);
            } else {
                logger.warn(`⚠️ Keep alive réponse: ${response.status} (${duration}ms)`);
            }

        } catch (error) {
            logger.error(`❌ Keep alive failed: ${error.message} - ${new Date().toLocaleTimeString()}`);
        }
    }, interval);
};

// ✅ DÉMARRER SEULEMENT EN PRODUCTION
if (process.env.NODE_ENV === 'production') {
    logger.info('🚀 Mode production détecté - Démarrage du keep alive...');

    // Attendre 2 minutes après le démarrage pour laisser l'app se stabiliser
    setTimeout(() => {
        keepAlive();
    }, 2 * 60 * 1000); // 2 minutes

} else {
    logger.info('🏠 Mode développement - Keep alive désactivé');
}

// ✅ Arrêter proprement le keep alive
process.on('SIGTERM', () => {
    logger.info('🛑 Arrêt du serveur - Keep alive stoppé');
    process.exit(0);
});

process.on('SIGINT', () => {
    logger.info('🛑 Arrêt du serveur (Ctrl+C) - Keep alive stoppé');
    process.exit(0);
});

module.exports = app;