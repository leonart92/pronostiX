// src/routes/adminRoutes.js - Routes admin avec gestion d'erreur corrigée
const express = require('express');
const { authenticate, requireAdmin } = require('../middlewares/auth');
const { asyncHandler } = require('../middlewares/errorHandler');
const { logger } = require('../utils/logger');

// Models
const User = require('../models/User');
const Pronostic = require('../models/Pronostic');
const Subscription = require('../models/Subscription');
const Payment = require('../models/Payment');

const router = express.Router();

// Middleware pour toutes les routes admin
router.use(authenticate);
router.use(requireAdmin);

// @route   GET /api/admin/dashboard
// @desc    Obtenir les statistiques du dashboard admin
// @access  Admin
router.get('/dashboard', asyncHandler(async (req, res) => {
    try {
        // Dates pour les calculs
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfYear = new Date(now.getFullYear(), 0, 1);
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

        // Statistiques utilisateurs
        const totalUsers = await User.countDocuments();
        const newUsersThisMonth = await User.countDocuments({
            createdAt: { $gte: startOfMonth }
        });
        const newUsersLastMonth = await User.countDocuments({
            createdAt: { $gte: lastMonth, $lt: startOfMonth }
        });

        // Statistiques abonnements
        const activeSubscriptions = await Subscription.countDocuments({
            status: 'active'
        });
        const newSubscriptionsThisMonth = await Subscription.countDocuments({
            createdAt: { $gte: startOfMonth },
            status: 'active'
        });

        // Statistiques pronostics
        const totalPronostics = await Pronostic.countDocuments();
        const monthlyPronostics = await Pronostic.countDocuments({
            createdAt: { $gte: startOfMonth }
        });

        // Statistiques de performance des pronostics
        const pronosticStats = await Pronostic.aggregate([
            {
                $match: {
                    result: { $in: ['won', 'lost'] }
                }
            },
            {
                $group: {
                    _id: null,
                    totalBets: { $sum: 1 },
                    wonBets: {
                        $sum: { $cond: [{ $eq: ['$result', 'won'] }, 1, 0] }
                    },
                    totalStake: { $sum: '$stake' },
                    totalProfit: { $sum: '$profit' }
                }
            }
        ]);

        const stats = pronosticStats[0] || {
            totalBets: 0,
            wonBets: 0,
            totalStake: 0,
            totalProfit: 0
        };

        const successRate = stats.totalBets > 0
            ? ((stats.wonBets / stats.totalBets) * 100).toFixed(1)
            : 0;

        const averageROI = stats.totalStake > 0
            ? ((stats.totalProfit / stats.totalStake) * 100).toFixed(1)
            : 0;

        // Revenus mensuels (approximation)
        const monthlyRevenue = activeSubscriptions * 19.99; // Approximation

        // Calcul du taux de conversion (approximation)
        const conversionRate = totalUsers > 0
            ? ((activeSubscriptions / totalUsers) * 100).toFixed(1)
            : 0;

        // Calcul des variations
        const userGrowth = newUsersLastMonth > 0
            ? (((newUsersThisMonth - newUsersLastMonth) / newUsersLastMonth) * 100).toFixed(1)
            : newUsersThisMonth > 0 ? 100 : 0;

        const response = {
            totalUsers,
            activeSubscriptions,
            monthlyRevenue,
            monthlyPronostics,
            conversionRate: parseFloat(conversionRate),
            successRate: parseFloat(successRate),
            averageROI: parseFloat(averageROI),
            newUsersThisMonth,
            userGrowth: parseFloat(userGrowth),
            stats: {
                ...stats,
                successRate: parseFloat(successRate),
                roi: parseFloat(averageROI)
            }
        };

        logger.info(`Admin dashboard accessed by user ${req.user._id}`);

        res.json({
            success: true,
            data: response
        });

    } catch (error) {
        logger.error('Error in admin dashboard:', error);
        throw error;
    }
}));

// @route   GET /api/admin/users
// @desc    Obtenir la liste des utilisateurs avec filtres
// @access  Admin
router.get('/users', asyncHandler(async (req, res) => {
    const { page = 1, limit = 20, role, subscriptionStatus, search } = req.query;

    // Construction du filtre
    let filter = {};

    if (role) {
        filter.role = role;
    }

    if (subscriptionStatus) {
        filter.subscriptionStatus = subscriptionStatus;
    }

    if (search) {
        filter.$or = [
            { username: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } }
        ];
    }

    // Exécution de la requête avec pagination
    const users = await User.find(filter)
        .select('-password -refreshTokens -emailVerificationToken -passwordResetToken')
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .populate('subscriptionId', 'plan status endDate');

    const totalUsers = await User.countDocuments(filter);
    const totalPages = Math.ceil(totalUsers / limit);

    res.json({
        success: true,
        data: {
            users,
            pagination: {
                currentPage: parseInt(page),
                totalPages,
                totalUsers,
                hasNext: page < totalPages,
                hasPrev: page > 1
            }
        }
    });
}));

// @route   GET /api/admin/pronostics
// @desc    Obtenir tous les pronostics avec filtres
// @access  Admin
router.get('/pronostics', asyncHandler(async (req, res) => {
    const { page = 1, limit = 20, sport, status, search } = req.query;

    // Construction du filtre
    let filter = {};

    if (sport) {
        filter.sport = sport;
    }

    if (status) {
        filter.result = status;
    }

    if (search) {
        filter.$or = [
            { homeTeam: { $regex: search, $options: 'i' } },
            { awayTeam: { $regex: search, $options: 'i' } },
            { league: { $regex: search, $options: 'i' } }
        ];
    }

    // Exécution de la requête avec pagination
    const pronostics = await Pronostic.find(filter)
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .populate('createdBy', 'username');

    const totalPronostics = await Pronostic.countDocuments(filter);
    const totalPages = Math.ceil(totalPronostics / limit);

    res.json({
        success: true,
        data: {
            pronostics,
            pagination: {
                currentPage: parseInt(page),
                totalPages,
                totalPronostics,
                hasNext: page < totalPages,
                hasPrev: page > 1
            }
        }
    });
}));

// @route   GET /api/admin/subscriptions
// @desc    Obtenir tous les abonnements avec filtres
// @access  Admin
router.get('/subscriptions', asyncHandler(async (req, res) => {
    const { page = 1, limit = 20, status, plan, search } = req.query;

    // Construction du filtre
    let filter = {};

    if (status) {
        filter.status = status;
    }

    if (plan) {
        filter.plan = plan;
    }

    // Pipeline d'agrégation pour inclure les données utilisateur
    let pipeline = [
        { $match: filter },
        {
            $lookup: {
                from: 'users',
                localField: 'userId',
                foreignField: '_id',
                as: 'user'
            }
        },
        { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } }
    ];

    // Ajouter le filtre de recherche sur l'utilisateur si nécessaire
    if (search) {
        pipeline.push({
            $match: {
                $or: [
                    { 'user.username': { $regex: search, $options: 'i' } },
                    { 'user.email': { $regex: search, $options: 'i' } }
                ]
            }
        });
    }

    // Ajouter tri et pagination
    pipeline.push(
        { $sort: { createdAt: -1 } },
        { $skip: (page - 1) * limit },
        { $limit: parseInt(limit) }
    );

    const subscriptions = await Subscription.aggregate(pipeline);

    // Compter le total pour la pagination
    let countPipeline = [
        { $match: filter },
        {
            $lookup: {
                from: 'users',
                localField: 'userId',
                foreignField: '_id',
                as: 'user'
            }
        },
        { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } }
    ];

    if (search) {
        countPipeline.push({
            $match: {
                $or: [
                    { 'user.username': { $regex: search, $options: 'i' } },
                    { 'user.email': { $regex: search, $options: 'i' } }
                ]
            }
        });
    }

    countPipeline.push({ $count: "total" });

    const countResult = await Subscription.aggregate(countPipeline);
    const totalSubscriptions = countResult.length > 0 ? countResult[0].total : 0;
    const totalPages = Math.ceil(totalSubscriptions / limit);

    res.json({
        success: true,
        data: {
            subscriptions,
            pagination: {
                currentPage: parseInt(page),
                totalPages,
                totalSubscriptions,
                hasNext: page < totalPages,
                hasPrev: page > 1
            }
        }
    });
}));

// @route   GET /api/admin/analytics/revenue
// @desc    Obtenir l'évolution des revenus (selon API_ENDPOINTS.md)
// @access  Admin
router.get('/analytics/revenue', asyncHandler(async (req, res) => {
    try {
        const now = new Date();
        const currentYear = now.getFullYear();

        // Revenus par mois pour l'année courante
        const monthlyRevenue = [];

        for (let month = 0; month < 12; month++) {
            const startOfMonth = new Date(currentYear, month, 1);
            const endOfMonth = new Date(currentYear, month + 1, 0);

            // Calculer les revenus du mois (approximation basée sur les abonnements actifs)
            const activeSubscriptions = await Subscription.countDocuments({
                status: 'active',
                startDate: { $lte: endOfMonth },
                endDate: { $gte: startOfMonth }
            });

            const monthRevenue = activeSubscriptions * 19.99; // Prix moyen

            monthlyRevenue.push({
                month: month + 1,
                monthName: new Date(currentYear, month, 1).toLocaleString('fr-FR', { month: 'long' }),
                revenue: monthRevenue,
                subscriptions: activeSubscriptions
            });
        }

        res.json({
            success: true,
            data: {
                year: currentYear,
                monthlyRevenue,
                totalYearRevenue: monthlyRevenue.reduce((sum, month) => sum + month.revenue, 0)
            }
        });

    } catch (error) {
        logger.error('Error in admin revenue analytics:', error);
        throw error;
    }
}));

// @route   GET /api/admin/users/:id
// @desc    Obtenir les détails d'un utilisateur (selon API_ENDPOINTS.md)
// @access  Admin
router.get('/users/:id', asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id)
        .select('-password -refreshTokens -emailVerificationToken -passwordResetToken')
        .populate('subscriptionId', 'plan status startDate endDate amount');

    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'Utilisateur non trouvé'
        });
    }

    // Récupérer les statistiques de l'utilisateur
    const userStats = {
        totalPronostics: await Pronostic.countDocuments({ createdBy: user._id }),
        paymentsCount: await Payment.countDocuments({ userId: user._id }),
        registrationDate: user.createdAt,
        lastLogin: user.lastLogin || null
    };

    res.json({
        success: true,
        data: {
            user,
            stats: userStats
        }
    });
}));
// @desc    Obtenir l'historique des paiements
// @access  Admin
router.get('/payments', asyncHandler(async (req, res) => {
    const { page = 1, limit = 20, status, paymentMethod, dateFrom, dateTo } = req.query;

    // Construction du filtre
    let filter = {};

    if (status) {
        filter.status = status;
    }

    if (paymentMethod) {
        filter.paymentMethod = paymentMethod;
    }

    if (dateFrom || dateTo) {
        filter.createdAt = {};
        if (dateFrom) {
            filter.createdAt.$gte = new Date(dateFrom);
        }
        if (dateTo) {
            filter.createdAt.$lte = new Date(dateTo);
        }
    }

    // Pipeline d'agrégation pour inclure les données utilisateur
    const pipeline = [
        { $match: filter },
        {
            $lookup: {
                from: 'users',
                localField: 'userId',
                foreignField: '_id',
                as: 'user'
            }
        },
        { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
        { $sort: { createdAt: -1 } },
        { $skip: (page - 1) * limit },
        { $limit: parseInt(limit) }
    ];

    const payments = await Payment.aggregate(pipeline);

    // Compter le total
    const totalPayments = await Payment.countDocuments(filter);
    const totalPages = Math.ceil(totalPayments / limit);

    res.json({
        success: true,
        data: {
            payments,
            pagination: {
                currentPage: parseInt(page),
                totalPages,
                totalPayments,
                hasNext: page < totalPages,
                hasPrev: page > 1
            }
        }
    });
}));

// @route   PUT /api/admin/users/:id
// @desc    Modifier un utilisateur
// @access  Admin
router.put('/users/:id', asyncHandler(async (req, res) => {
    const { username, email, role, isEmailVerified } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'Utilisateur non trouvé'
        });
    }

    // Mise à jour des champs
    if (username) user.username = username;
    if (email) user.email = email;
    if (role) user.role = role;
    if (typeof isEmailVerified === 'boolean') user.isEmailVerified = isEmailVerified;

    await user.save();

    res.json({
        success: true,
        message: 'Utilisateur mis à jour avec succès',
        data: {
            user: user.profile
        }
    });
}));

// @route   DELETE /api/admin/users/:id
// @desc    Supprimer un utilisateur
// @access  Admin
router.delete('/users/:id', asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'Utilisateur non trouvé'
        });
    }

    // Empêcher la suppression d'un admin par sécurité
    if (user.role === 'admin') {
        return res.status(403).json({
            success: false,
            message: 'Impossible de supprimer un administrateur'
        });
    }

    await User.findByIdAndDelete(req.params.id);

    res.json({
        success: true,
        message: 'Utilisateur supprimé avec succès'
    });
}));

// @route   POST /api/admin/subscriptions/:id/cancel
// @desc    Annuler un abonnement
// @access  Admin
router.post('/subscriptions/:id/cancel', asyncHandler(async (req, res) => {
    const subscription = await Subscription.findById(req.params.id);
    if (!subscription) {
        return res.status(404).json({
            success: false,
            message: 'Abonnement non trouvé'
        });
    }

    subscription.status = 'cancelled';
    subscription.cancelledAt = new Date();
    subscription.cancelAtPeriodEnd = true;

    await subscription.save();

    // Mettre à jour le statut de l'utilisateur
    await User.findByIdAndUpdate(subscription.userId, {
        subscriptionStatus: 'cancelled'
    });

    res.json({
        success: true,
        message: 'Abonnement annulé avec succès'
    });
}));

module.exports = router;