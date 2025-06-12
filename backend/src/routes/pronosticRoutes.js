// src/routes/pronosticRoutes.js - SANS FILTRAGE CÔTÉ BACKEND
const express = require('express');
const { authenticate, requireAdmin, optionalAuth } = require('../middlewares/auth');
const { asyncHandler } = require('../middlewares/errorHandler');
const Pronostic = require('../models/Pronostic');
const { logger } = require('../utils/logger');

const router = express.Router();

// ===== ROUTES SPÉCIFIQUES D'ABORD (avant /:id) =====


// @route   GET /api/pronostics/upcoming/today
// @desc    Pronostics du jour
// @access  Public
router.get('/upcoming/today', optionalAuth, asyncHandler(async (req, res) => {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

    const filter = {
        isVisible: true,
        matchDate: {
            $gte: startOfDay,
            $lt: endOfDay
        }
    };

    const pronostics = await Pronostic.find(filter)
        .sort({ matchDate: 1 })
        .populate('createdBy', 'username')
        .lean();

    res.json({
        success: true,
        data: {
            pronostics: pronostics,
            count: pronostics.length
        }
    });
}));


// @route   GET /api/pronostics/stats/global
// @desc    Statistiques globales des pronostics
// @access  Public
router.get('/stats/global', asyncHandler(async (req, res) => {
    const stats = await Pronostic.getStats({ isVisible: true });

    res.json({
        success: true,
        data: stats
    });
}));

// ===== ROUTES GÉNÉRALES =====

// @route   GET /api/pronostics
// @desc    Liste des pronostics avec pagination et filtres
// @access  Public - 🔧 RETOURNE TOUS LES PRONOSTICS !
router.get('/', optionalAuth, asyncHandler(async (req, res) => {
    const {
        page = 1,
        limit = 10,
        sport,
        status,
        priority,
        league,
        upcoming,
        dateFrom,
        dateTo,
        sort = 'date_desc'
    } = req.query;

    // 🔍 Debug: Logger les paramètres reçus
    console.log('📋 GET /api/pronostics appelé:', {
        userId: req.user?._id,
        userRole: req.user?.role,
        subscriptionStatus: req.user?.subscriptionStatus,
        params: req.query
    });

    // Construction du filtre
    let filter = { isVisible: true };

    if (sport) filter.sport = sport;
    if (status) filter.result = status;
    if (priority) filter.priority = priority;
    if (league) filter.league = { $regex: league, $options: 'i' };

    if (upcoming === 'true') {
        filter.matchDate = { $gt: new Date() };
    }

    if (dateFrom || dateTo) {
        filter.matchDate = {};
        if (dateFrom) filter.matchDate.$gte = new Date(dateFrom);
        if (dateTo) filter.matchDate.$lte = new Date(dateTo);
    }

    // 🔧 POINT CLÉ : NE PAS FILTRER selon l'abonnement !
    // ❌ SUPPRIMÉ : if (!req.user || !req.user.hasActiveSubscription()) { filter.isFree = true; }
    // ✅ Le frontend décidera quoi afficher selon l'abonnement

    console.log('🔍 Filtres MongoDB construits:', JSON.stringify(filter, null, 2));

    // Tri
    let sortOption = {};
    switch (sort) {
        case 'date_asc': sortOption = { matchDate: 1 }; break;
        case 'date_desc': sortOption = { matchDate: -1 }; break;
        case 'odds_asc': sortOption = { odds: 1 }; break;
        case 'odds_desc': sortOption = { odds: -1 }; break;
        default: sortOption = { matchDate: -1 };
    }

    const pronostics = await Pronostic.find(filter)
        .sort(sortOption)
        .limit(parseInt(limit))
        .skip((parseInt(page) - 1) * parseInt(limit))
        .populate('createdBy', 'username')
        .lean(); // Pour de meilleures performances

    const total = await Pronostic.countDocuments(filter);
    const totalPages = Math.ceil(total / parseInt(limit));

    // 🔍 Debug: Logger les résultats
    console.log(`📊 ${pronostics.length} pronostics trouvés sur ${total} total`);
    console.log('📋 Pronostics retournés:', pronostics.map(p => ({
        id: p._id,
        homeTeam: p.homeTeam,
        awayTeam: p.awayTeam,
        isFree: p.isFree,
        sport: p.sport
    })));

    res.json({
        success: true,
        data: {
            pronostics: pronostics, // ← TOUS les pronostics (gratuits + premium)
            pagination: {
                currentPage: parseInt(page),
                totalPages,
                total,
                hasNext: page < totalPages,
                hasPrev: page > 1
            }
        }
    });
}));

// @route   GET /api/pronostics/:id
// @desc    Détail d'un pronostic (APRÈS les routes spécifiques)
// @access  Public - 🔧 RETOURNE TOUS LES DÉTAILS !
router.get('/:id', optionalAuth, asyncHandler(async (req, res) => {
    const pronostic = await Pronostic.findById(req.params.id)
        .populate('createdBy', 'username')
        .lean();

    if (!pronostic || !pronostic.isVisible) {
        return res.status(404).json({
            success: false,
            message: 'Pronostic non trouvé'
        });
    }

    // Incrémenter les vues (sans .lean())
    await Pronostic.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });

    // 🔧 POINT CLÉ : Retourner TOUTES les données !
    // Le frontend décidera quoi afficher selon l'abonnement
    // ❌ SUPPRIMÉ : Masquage conditionnel des détails selon l'abonnement

    console.log('📋 Pronostic retourné:', {
        id: pronostic._id,
        homeTeam: pronostic.homeTeam,
        awayTeam: pronostic.awayTeam,
        isFree: pronostic.isFree,
        hasPrediction: !!pronostic.prediction,
        hasAnalysis: !!pronostic.analysis
    });

    res.json({
        success: true,
        data: { pronostic: pronostic } // ← Pronostic complet avec tous les détails
    });
}));

// ===== ROUTES ADMIN UNIQUEMENT =====

// @route   POST /api/pronostics
// @desc    Créer un nouveau pronostic (Admin uniquement)
// @access  Admin
router.post('/', authenticate, requireAdmin, asyncHandler(async (req, res) => {
    const {
        sport,
        league,
        homeTeam,
        awayTeam,
        matchDate,
        prediction,
        predictionType,
        odds,
        stake,
        confidence,
        analysis,
        reasoning,
        tags,
        priority,
        isFree,
        bookmaker
    } = req.body;

    const pronostic = new Pronostic({
        sport,
        league,
        homeTeam,
        awayTeam,
        matchDate,
        prediction,
        predictionType,
        odds,
        stake,
        confidence,
        analysis,
        reasoning,
        tags: tags || [],
        priority: priority || 'medium',
        isFree: isFree || false,
        bookmaker,
        createdBy: req.user._id,
        isVisible: true // ← Visible par défaut
    });

    await pronostic.save();

    logger.info(`Pronostic créé par admin ${req.user._id}: ${homeTeam} vs ${awayTeam}`);

    res.status(201).json({
        success: true,
        message: 'Pronostic créé avec succès',
        data: { pronostic }
    });
}));

// @route   PUT /api/pronostics/:id
// @desc    Modifier un pronostic (Admin uniquement)
// @access  Admin
router.put('/:id', authenticate, requireAdmin, asyncHandler(async (req, res) => {
    const pronostic = await Pronostic.findById(req.params.id);

    if (!pronostic) {
        return res.status(404).json({
            success: false,
            message: 'Pronostic non trouvé'
        });
    }

    // Mettre à jour les champs
    Object.keys(req.body).forEach(key => {
        if (req.body[key] !== undefined) {
            pronostic[key] = req.body[key];
        }
    });

    pronostic.updatedBy = req.user._id;
    await pronostic.save();

    logger.info(`Pronostic modifié par admin ${req.user._id}: ${pronostic._id}`);

    res.json({
        success: true,
        message: 'Pronostic mis à jour avec succès',
        data: { pronostic }
    });
}));

// @route   DELETE /api/pronostics/:id
// @desc    Supprimer un pronostic (Admin uniquement)
// @access  Admin
router.delete('/:id', authenticate, requireAdmin, asyncHandler(async (req, res) => {
    const pronostic = await Pronostic.findById(req.params.id);

    if (!pronostic) {
        return res.status(404).json({
            success: false,
            message: 'Pronostic non trouvé'
        });
    }

    await Pronostic.findByIdAndDelete(req.params.id);

    logger.info(`Pronostic supprimé par admin ${req.user._id}: ${req.params.id}`);

    res.json({
        success: true,
        message: 'Pronostic supprimé avec succès'
    });
}));

// @route   POST /api/pronostics/:id/publish
// @desc    Publier un pronostic (Admin uniquement)
// @access  Admin
router.post('/:id/publish', authenticate, requireAdmin, asyncHandler(async (req, res) => {
    const pronostic = await Pronostic.findById(req.params.id);

    if (!pronostic) {
        return res.status(404).json({
            success: false,
            message: 'Pronostic non trouvé'
        });
    }

    await pronostic.publish();

    logger.info(`Pronostic publié par admin ${req.user._id}: ${req.params.id}`);

    res.json({
        success: true,
        message: 'Pronostic publié avec succès',
        data: { pronostic }
    });
}));

// @route   POST /api/pronostics/:id/unpublish
// @desc    Dépublier un pronostic (Admin uniquement)
// @access  Admin
router.post('/:id/unpublish', authenticate, requireAdmin, asyncHandler(async (req, res) => {
    const pronostic = await Pronostic.findById(req.params.id);

    if (!pronostic) {
        return res.status(404).json({
            success: false,
            message: 'Pronostic non trouvé'
        });
    }

    await pronostic.unpublish();

    logger.info(`Pronostic dépublié par admin ${req.user._id}: ${req.params.id}`);

    res.json({
        success: true,
        message: 'Pronostic dépublié avec succès',
        data: { pronostic }
    });
}));

// @route   POST /api/pronostics/:id/result
// @desc    Mettre à jour le résultat d'un pronostic (Admin uniquement)
// @access  Admin
router.post('/:id/result', authenticate, requireAdmin, asyncHandler(async (req, res) => {
    const { result, actualResult } = req.body;

    if (!['won', 'lost', 'void', 'push'].includes(result)) {
        return res.status(400).json({
            success: false,
            message: 'Résultat invalide. Valeurs acceptées: won, lost, void, push'
        });
    }

    const pronostic = await Pronostic.findById(req.params.id);

    if (!pronostic) {
        return res.status(404).json({
            success: false,
            message: 'Pronostic non trouvé'
        });
    }

    // Mettre à jour le résultat selon la méthode appropriée
    switch (result) {
        case 'won':
            await pronostic.markAsWon(actualResult);
            break;
        case 'lost':
            await pronostic.markAsLost(actualResult);
            break;
        case 'push':
            await pronostic.markAsPush(actualResult);
            break;
        case 'void':
            pronostic.result = 'void';
            pronostic.actualResult = actualResult;
            pronostic.profit = 0;
            await pronostic.save();
            break;
    }

    logger.info(`Résultat mis à jour par admin ${req.user._id}: ${req.params.id} -> ${result}`);

    res.json({
        success: true,
        message: 'Résultat mis à jour avec succès',
        data: { pronostic }
    });
}));

module.exports = router;