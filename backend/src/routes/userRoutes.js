const express = require('express');
const {body, validationResult} = require('express-validator');
const User = require('../models/User');
const Subscription = require('../models/Subscription');
const {
    authenticate,
    requireActiveSubscription,
    requireOwnership
} = require('../middlewares/auth');
const {
    asyncHandler,
    ValidationError,
    NotFoundError,
} = require('../middlewares/errorHandler');
const {logSecurityEvent, logger} = require('../utils/logger');
const router = express.Router();

router.get('/test', (req, res) => {
    res.json({ message: 'User routes OK'});
});

// @route   GET /api/users/profile
// @desc    Obtenir le profil de l'utilisateur connecté
// @access  Private
router.get('/profile', authenticate, asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)
        .populate('subscriptionId')
        .select('-password -refreshTokens');
    if (!user) {
        throw new NotFoundError('User not found');
    }

    res.json({
        success: true,
        data: {
            user: user.profile,
            subscription: user.subscriptionId
        }
    });
}));


// @route   PUT /api/users/profile
// @desc    Mettre à jour le profil utilisateur
// @access  Private
router.put('/profile', authenticate, [
    body('username')
        .optional()
        .trim()
        .isLength({min: 3, max: 30})
        .withMessage('Le nom d\'utilisateur doit contenir entre 3 et 30 caractères')
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage('Le nom d\'utilisateur ne peut contenir que des lettres, chiffres et underscore'),

    body('email')
        .optional()
        .isEmail()
        .normalizeEmail()
        .withMessage('Format d\'email invalide')
], asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new ValidationError('Données de validation invalides', errors.array()[0].param);
    }

    const { username, email } = req.body;
    const updateData = {};

    if (username && username !== req.user.username) {
        const existingUser = await User.findOne({ username});
        if (existingUser) {
            throw new ValidationError('Ce nom d\'utilisateur est déjà utilisé');
        }
        updateData.username = username;
    }

    if (email && email !== req.user.email) {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new ValidationError('Cet email est déjà utilisé');
        }
        updateData.email = email;
        updateData.isEmailVerified = false;
    }

    const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        updateData,
        { new: true , runValidators: true }
    ).select('-password -refreshTokens');

    logSecurityEvent('PROFILE_UPDATED', {
        userId: req.user._id,
        updatedFields: Object.keys(updateData)
    }, req);

    res.json({
        success: true,
        message: 'Profil mis à jour avec succès',
        data: {
            user : updatedUser.profile
        }
    });
}));


// @route   GET /api/users/subscription-status
// @desc    Obtenir le statut d'abonnement détaillé
// @access  Private
router.get('/subscription-status', authenticate, asyncHandler(async (req, res) => {
    const subscription = await Subscription.findOne({userId: req.user._id});

    if (!subscription) {
        return res.json({
            success: true,
            data: {
                hasSubscription: false,
                status: 'none',
                plan : null,
                daysRemaining: null,
                nextBillingDate: null
            }
        });
    }
    res.json({
        success: true,
        data: {
            hasSubscription: true,
            status: subscription.status,
            plan : subscription.plan,
            planDetails: subscription.planDetails,
            daysRemaining: subscription.getDaysRemaining(),
            nextBillingDate: subscription.getNextBillingDate(),
            startDate: subscription.startDate,
            endDate: subscription.endDate,
            cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
            isActive: subscription.isActive(),
            isTrialing: subscription.isTrialing()
        }
    });
}));


// @route   PUT /api/users/change-password
// @desc    Changer le mot de passe
// @access  Private
router.put('/change-password', authenticate, [
    body('currentPassword')
        .notEmpty()
        .withMessage('Mot de passe actuel requis'),

    body('newPassword')
        .isLength({min: 6})
        .withMessage('Le nouveau mot de passe doit contenir au moins 6 caractères')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Le nouveau mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre'),

    body('confirmPassword')
        .custom((value, {req}) => {
            if (value !== req.body.newPassword) {
                throw new Error('Les mots de passe ne correspondent pas');
            }
            return true;
        })
], asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new ValidationError('Données de validation invalides');
    }

    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id).select('+password');

    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
        throw new ValidationError('Mot de passe actuel incorrect');
    }

    user.password = newPassword;
    user.refreshTokens = [];
    await user.save();

    logSecurityEvent('PASSWORD_CHANGED', {
        userId: user._id
    }, req);

    res.json({
        success: true,
        message: 'Mot de passe modifié avec succès'
    });
}));


// @route   DELETE /api/users/account
// @desc    Supprimer le compte utilisateur
// @access  Private
router.delete('/account', authenticate, [
    body('password')
        .notEmpty()
        .withMessage('Mot de passe requis pour supprimer le compte'),

    body('confirmation')
        .equals('DELETE_MY_ACCOUNT')
        .withMessage('Confirmation requise')
], asyncHandler(async (req, res) =>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new ValidationError('Confirmation requise pour supprimer le compte');
    }

    const { password } = req.body;

    const user = await User.findById(req.user._id).select('+password');

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
        throw new ValidationError('Mot de passe incorrect');
    }

    const subscription = await Subscription.findOne({userId: user._id});
    if (subscription && subscription.isActive()) {
        // TODO: Annuler l'abonnement Stripe
        subscription.status = 'canceled';
        subscription.cancelledAt = new Date();
        await subscription.save();
    }

    await User.findByIdAndDelete(user._id);

    logSecurityEvent('ACCOUNT_DELETED', {
        userId: user._id,
        email: user.email
    }, req);

    res.json({
        success: true,
        message: 'Compte supprimé avec succès'
    });
}));


// @route   GET /api/users/activity
// @desc    Obtenir l'activité récente de l'utilisateur
// @access  Private
router.get('/activity', authenticate, asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).select('lastLogin createdAt');

    // TODO: Ajouter d'autres activités (pronostics consultés, etc.)
    const activity = {
        lastLogin: user.lastLogin,
        accountCreated: user.createdAt
        // recentViews: [], // Pronostics récemment consultés
        // favoriteTeams: [], // Équipes suivies
    };

    res.json({
        success: true,
        data: activity
    });
}));


// @route   GET /api/users/stats
// @desc    Obtenir les statistiques utilisateur (basiques pour tous, détaillées pour abonnés)
// @access  Private
router.get('/stats', authenticate, asyncHandler(async (req, res) => {
    const hasActiveSubscription = req.user.hasActiveSubscription();

    // Stats basiques pour tous les utilisateurs
    const basicStats = {
        totalPronostics: 0,      // Nombre de pronostics consultés
        winRate: 0,              // Taux de réussite basique
        roi: 0,                  // ROI basique
        accountAge: Math.floor((new Date() - req.user.createdAt) / (1000 * 60 * 60 * 24)) // Jours depuis inscription
    };

    // Stats premium pour les abonnés
    if (hasActiveSubscription) {
        // TODO: Calculer les vraies statistiques depuis la DB
        const premiumStats = {
            ...basicStats,
            detailedProfit: 0,       // Gains/pertes détaillés
            favoriteSports: [],      // Sports préférés
            bestPerformance: {},     // Meilleures performances
            monthlyStats: [],        // Stats mensuelles
            streaks: {               // Séries
                currentWin: 0,
                longestWin: 0,
                currentLoss: 0
            }
        };

        return res.json({
            success: true,
            data: premiumStats
        });
    }

    // Retourner les stats basiques pour les utilisateurs gratuits
    res.json({
        success: true,
        data: basicStats
    });
}));


// @route   POST /api/users/verify-email
// @desc    Renvoyer un email de vérification
// @access  Private
router.post('/verify-email', authenticate, asyncHandler(async (req, res) => {
    if (req.user.isEmailVerified) {
        return res.json({
            success: true,
            message: 'Email déjà vérifié'
        });
    }

    // TODO: Générer un nouveau token et envoyer l'email
    const crypto = require('crypto');
    const verificationToken = crypto.randomBytes(32).toString('hex');

    await User.findByIdAndUpdate(req.user._id, {
        emailVerificationToken: verificationToken
    });

    // TODO: Envoyer l'email avec le lien de vérification
    logger.info(`Token de vérification pour ${req.user.email}: ${verificationToken}`);

    res.json({
        success: true,
        message: 'Email de vérification envoyé'
    });
}));


// @route   GET /api/users/verify-email/:token
// @desc    Vérifier l'email avec le token
// @access  Public
router.get('/verify-email/:token', asyncHandler(async (req, res) => {
    const { token } = req.params;

    const user = await User.findOne({ emailVerificationToken: token });
    if (!user) {
        throw new ValidationError('Token de vérification invalide');
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    await user.save();

    logSecurityEvent('EMAIL_VERIFIED', {
        userId: user._id,
        email: user.email
    }, req);

    res.json({
        success: true,
        message: 'Email vérifié avec succès'
    });
}));

// @route   GET /api/users/subscription-status
// @desc    Obtenir le statut détaillé de l'abonnement de l'utilisateur
// @access  Private
router.get('/subscription-status', authenticate, asyncHandler(async (req, res) => {
    const user = req.user;

    console.log('🔍 Demande statut abonnement pour:', user.email);

    try {
        let subscriptionData = {
            status: user.subscriptionStatus || 'none',
            hasActiveSubscription: user.hasActiveSubscription(),
            plan: null,
            endDate: null,
            cancelAtPeriodEnd: false,
            daysRemaining: 0
        };

        // Si l'utilisateur a un abonnement actif, récupérer les détails
        if (user.subscriptionStatus === 'active') {

            // 1. Essayer de récupérer depuis la BDD locale
            try {
                const Subscription = require('../models/Subscription');
                const localSubscription = await Subscription.findOne({
                    userId: user._id,
                    status: 'active'
                }).sort({ createdAt: -1 });

                if (localSubscription) {
                    console.log('✅ Abonnement trouvé en BDD locale');
                    subscriptionData = {
                        ...subscriptionData,
                        plan: localSubscription.plan,
                        endDate: localSubscription.endDate,
                        cancelAtPeriodEnd: localSubscription.cancelAtPeriodEnd,
                        daysRemaining: localSubscription.getDaysRemaining(),
                        nextBillingDate: localSubscription.getNextBillingDate(),
                        amount: localSubscription.amount,
                        currency: localSubscription.currency,
                        stripeSubscriptionId: localSubscription.stripeSubscriptionId
                    };
                } else {
                    console.log('ℹ️ Pas d\'abonnement en BDD locale, vérification Stripe...');
                }
            } catch (dbError) {
                console.log('⚠️ Erreur BDD locale (pas grave):', dbError.message);
            }

            // 2. Si pas d'info locale et qu'on a un Stripe Customer ID, vérifier chez Stripe
            if (!subscriptionData.plan && user.stripeCustomerId) {
                try {
                    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

                    console.log('🔍 Vérification abonnements Stripe...');
                    const stripeSubscriptions = await stripe.subscriptions.list({
                        customer: user.stripeCustomerId,
                        status: 'active',
                        limit: 1
                    });

                    if (stripeSubscriptions.data.length > 0) {
                        const stripeSubscription = stripeSubscriptions.data[0];
                        console.log('✅ Abonnement actif trouvé chez Stripe');

                        // Déterminer le plan basé sur le price ID
                        const priceId = stripeSubscription.items.data[0].price.id;
                        let plan = 'unknown';

                        if (priceId === process.env.STRIPE_MONTHLY_PRICE_ID) plan = 'monthly';
                        else if (priceId === process.env.STRIPE_QUARTERLY_PRICE_ID) plan = 'quarterly';
                        else if (priceId === process.env.STRIPE_ANNUAL_PRICE_ID) plan = 'annually';

                        const endDate = new Date(stripeSubscription.current_period_end * 1000);
                        const now = new Date();
                        const daysRemaining = Math.max(0, Math.ceil((endDate - now) / (1000 * 60 * 60 * 24)));

                        subscriptionData = {
                            ...subscriptionData,
                            plan: plan,
                            endDate: endDate,
                            cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
                            daysRemaining: daysRemaining,
                            nextBillingDate: stripeSubscription.cancel_at_period_end ? null : endDate,
                            amount: stripeSubscription.items.data[0].price.unit_amount / 100,
                            currency: stripeSubscription.currency.toUpperCase(),
                            stripeSubscriptionId: stripeSubscription.id
                        };
                    }
                } catch (stripeError) {
                    console.log('⚠️ Erreur vérification Stripe:', stripeError.message);
                }
            }
        }

        // 3. Ajouter des infos supplémentaires basées sur le plan
        if (subscriptionData.plan) {
            const planNames = {
                monthly: 'Mensuel',
                quarterly: 'Trimestriel',
                annually: 'Annuel'
            };

            subscriptionData.planName = planNames[subscriptionData.plan] || subscriptionData.plan;
            subscriptionData.isExpiringSoon = subscriptionData.daysRemaining <= 7;
        }

        console.log('✅ Statut abonnement récupéré:', {
            status: subscriptionData.status,
            plan: subscriptionData.plan,
            daysRemaining: subscriptionData.daysRemaining
        });

        res.json({
            success: true,
            data: subscriptionData
        });

    } catch (error) {
        console.error('❌ Erreur récupération statut abonnement:', error);

        // En cas d'erreur, retourner les infos de base
        res.json({
            success: true,
            data: {
                status: user.subscriptionStatus || 'none',
                hasActiveSubscription: user.hasActiveSubscription(),
                plan: null,
                endDate: null,
                error: 'Impossible de récupérer les détails complets'
            }
        });
    }
}));

module.exports = router;