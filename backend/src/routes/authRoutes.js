const express = require('express');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { sendVerificationEmail, sendPasswordResetEmail } = require('../services/emailService');
const User = require('../models/User');
const {
    generateToken,
    generateRefreshToken,
    verifyRefreshToken,
    authenticate
} = require('../middlewares/auth');
const {
    asyncHandler,
    ValidationError,
    AuthenticationError,
    ConflictError
} = require('../middlewares/errorHandler');

const { logSecurityEvent, logger } = require('../utils/logger');
// const { sendVerificationEmail } = require('../services/emailService'); // À décommenter quand vous aurez créé le service

const router = express.Router();

const registerValidation = [
    body('username')
        .trim()
        .isLength({ min: 3, max: 30 })
        .withMessage('Le nom d\'utilisateur doit contenir entre 3 et 30 caractères')
        .matches(/^[a-zA-Z0-9_-]+$/)
        .withMessage('Le nom d\'utilisateur doit contenir uniquement des lettres, des chiffres, et des underscores'),

    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Format d\'email invalide'),

    body('password')
        .isLength({ min: 6 })
        .withMessage('Le mot de passe doit contenir au moins 6 caractères')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Le mot de passe doit contenir au moins une lettre majuscule, une lettre minuscule et un chiffre'),
];

const loginValidation = [
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Format d\'email invalide'),

    body('password')
        .notEmpty()
        .withMessage('Mot de passe requis')
];

// @route   POST /api/auth/register
// @desc    Enregistrer un nouvel utilisateur
// @access  Public
router.post('/register', registerValidation, asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new ValidationError('Données de validation invalides', errors.array()[0].param);
    }

    const { username, email, password } = req.body;

    const existingUser = await User.findOne({
        $or: [{ email }, { username }]
    });

    if (existingUser) {
        const field = existingUser.email === email ? 'email' : 'username';
        throw new ConflictError(`Cet ${field} est déjà utilisé`);
    }

    const user = new User({
        username,
        email,
        password,
        emailVerificationToken: crypto.randomBytes(32).toString('hex')
    });

    await user.save();

    // Envoyer l'email de vérification
    try {
        await sendVerificationEmail(user.email, user.username, user.emailVerificationToken);
        logger.info(`Email de vérification envoyé à ${user.email}`);
        logger.info(`Token de vérification: ${user.emailVerificationToken}`); // À supprimer en production
    } catch (emailError) {
        logger.error('Erreur envoi email de vérification:', emailError);
        // Ne pas faire échouer l'inscription si l'email échoue
    }

    // Générer les tokens pour connexion automatique (optionnel)
    const accessToken = generateToken(user._id, '1h');
    const refreshToken = generateRefreshToken(user._id);

    user.refreshTokens.push({ token: refreshToken });
    await user.save();

    logSecurityEvent('USER_REGISTERED', {
        userId: user._id,
        username: user.username,
        email: user.email
    }, req);

    logger.info(`Nouvel utilisateur enregistré: ${user.email}`);

    res.status(201).json({
        success: true,
        message: 'Compte créé avec succès ! Vérifiez votre email pour l\'activer.',
        data: {
            user: user.profile,
            tokens: {
                accessToken,
                refreshToken
            }
        }
    });
}));

// @route   GET /api/auth/verify-email/:token
// @desc    Vérifier l'adresse email
// @access  Public
// @route   GET /api/auth/verify-email/:token
const verificationInProgress = new Map();

// @route   GET /api/auth/verify-email/:token
router.get('/verify-email/:token', asyncHandler(async (req, res) => {
    const { token } = req.params;

    console.log('🔍 Token reçu:', token);

    // ✅ PROTECTION : Éviter les appels simultanés
    if (verificationInProgress.has(token)) {
        console.log('⚠️ Vérification déjà en cours pour ce token');
        return res.json({
            success: true,
            message: 'Vérification déjà en cours...',
            data: { alreadyProcessing: true }
        });
    }

    // Marquer comme en cours
    verificationInProgress.set(token, true);

    try {
        // ✅ Chercher l'user avec ce token (même si déjà vérifié)
        const userWithToken = await User.findOne({
            emailVerificationToken: token
        });

        console.log('👤 User trouvé:', userWithToken ? 'OUI' : 'NON');

        // ✅ Si token pas trouvé, peut-être déjà vérifié
        if (!userWithToken) {
            // Chercher un user récemment vérifié (dans les 5 dernières minutes)
            const recentlyVerified = await User.findOne({
                isEmailVerified: true,
                updatedAt: { $gte: new Date(Date.now() - 5 * 60 * 1000) } // 5 minutes
            });

            if (recentlyVerified) {
                console.log('✅ User récemment vérifié trouvé');
                return res.json({
                    success: true,
                    message: 'Email déjà vérifié !',
                    data: {
                        user: recentlyVerified.profile,
                        alreadyVerified: true
                    }
                });
            }

            throw new ValidationError('Token de vérification invalide ou expiré');
        }

        // ✅ Si email déjà vérifié
        if (userWithToken.isEmailVerified) {
            console.log('✅ Email déjà vérifié');
            return res.json({
                success: true,
                message: 'Email déjà vérifié !',
                data: {
                    user: userWithToken.profile,
                    alreadyVerified: true
                }
            });
        }

        // ✅ Vérifier l'email
        userWithToken.isEmailVerified = true;
        userWithToken.emailVerificationToken = undefined;
        await userWithToken.save();

        logSecurityEvent('EMAIL_VERIFIED', {
            userId: userWithToken._id,
            email: userWithToken.email
        }, req);

        logger.info(`Email vérifié pour: ${userWithToken.email}`);

        res.json({
            success: true,
            message: 'Email vérifié avec succès !',
            data: {
                user: userWithToken.profile,
                alreadyVerified: false
            }
        });

    } finally {
        // ✅ Nettoyer après 5 secondes
        setTimeout(() => {
            verificationInProgress.delete(token);
        }, 5000);
    }
}));

// @route   POST /api/auth/resend-verification
// @desc    Renvoyer l'email de vérification
// @access  Private
router.post('/resend-verification', authenticate, asyncHandler(async (req, res) => {
    const user = req.user;

    if (user.isEmailVerified) {
        return res.status(400).json({
            success: false,
            message: 'Email déjà vérifié'
        });
    }

    // Générer un nouveau token si nécessaire
    if (!user.emailVerificationToken) {
        user.emailVerificationToken = crypto.randomBytes(32).toString('hex');
        await user.save();
    }

    try {
        await sendVerificationEmail(user.email, user.username, user.emailVerificationToken);
        logger.info(`Email de vérification renvoyé à ${user.email}`);
        logger.info(`Token de vérification: ${user.emailVerificationToken}`); // À supprimer en production
    } catch (emailError) {
        logger.error('Erreur renvoi email de vérification:', emailError);
        throw new Error('Erreur lors de l\'envoi de l\'email');
    }

    res.json({
        success: true,
        message: 'Email de vérification renvoyé'
    });
}));

// @route   POST /api/auth/login
// @desc    Connecter un utilisateur
// @access  Public
router.post('/login', loginValidation, asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new ValidationError('Données de validation invalides');
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
        logSecurityEvent('LOGIN_FAILED', {
            email,
            reason: 'User not found'
        }, req);
        throw new AuthenticationError('Email ou mot de passe invalide');
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
        logSecurityEvent('LOGIN_FAILED', {
            userId: user._id,
            email,
            reason: 'Invalid password'
        }, req);
        throw new AuthenticationError('Email ou mot de passe incorrect');
    }

    // Nettoyer les anciens refresh tokens
    user.refreshTokens = user.refreshTokens.filter(tokenObj => {
        try {
            verifyRefreshToken(tokenObj.token);
            return true;
        } catch {
            return false;
        }
    });

    const accessToken = generateToken(user._id, '1h');
    const refreshToken = generateRefreshToken(user._id);

    user.refreshTokens.push({ token: refreshToken });
    user.lastLogin = new Date();

    await user.save();

    logSecurityEvent('LOGIN_SUCCESS', {
        userId: user._id,
        email: user.email
    }, req);

    logger.info(`Connexion réussie pour: ${user.email}`);

    res.json({
        success: true,
        message: 'Connexion réussie',
        data: {
            user: user.profile,
            tokens: {
                accessToken,
                refreshToken
            }
        }
    });
}));

// @route   POST /api/auth/refresh
// @desc    Rafraîchir le token d'accès
// @access  Public
router.post('/refresh', asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        throw new ValidationError('RefreshToken is required');
    }

    const decoded = verifyRefreshToken(refreshToken);

    const user = await User.findById(decoded.userId);
    if (!user) {
        throw new AuthenticationError('User not found');
    }

    const tokenExists = user.refreshTokens.some(tokenObj => tokenObj.token === refreshToken);
    if (!tokenExists) {
        logSecurityEvent('REFRESH_FAILED', {
            userId: user._id
        }, req);
        throw new AuthenticationError('Refresh token is invalid');
    }

    const newAccessToken = generateToken(user._id, '1h');

    res.json({
        success: true,
        message: 'Token refreshed',
        data: {
            accessToken: newAccessToken
        }
    });
}));

// @route   POST /api/auth/logout
// @desc    Déconnecter un utilisateur
// @access  Private
router.post('/logout', authenticate, asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;

    try {
        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        if (!user.refreshTokens) {
            user.refreshTokens = [];
        }

        if (refreshToken) {
            user.refreshTokens = user.refreshTokens.filter(
                tokenObj => tokenObj.token !== refreshToken
            );
        } else {
            user.refreshTokens = [];
        }

        await user.save();

        logSecurityEvent('LOGOUT', {
            userId: user._id
        }, req);

        res.json({
            success: true,
            message: 'Logout successful'
        });

    } catch (error) {
        logger.error('Logout error:', error);

        res.json({
            success: true,
            message: 'Logout successful'
        });
    }
}));

// @route   POST /api/auth/logout-all
// @desc    Déconnecter de tous les appareils
// @access  Private
router.post('/logout-all', authenticate, asyncHandler(async (req, res) => {
    req.user.refreshTokens = [];

    await req.user.save();

    logSecurityEvent('LOGOUT_ALL', {
        userId: req.user._id
    }, req);

    res.json({
        success: true,
        message: 'Logout of all devices successful'
    });
}));

// @route   POST /api/auth/forgot-password
// @desc    Demander une réinitialisation de mot de passe
// @access  Public
router.post('/forgot-password', [
    body('email').isEmail().normalizeEmail().withMessage('Email invalide')
], asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new ValidationError('Email invalide');
    }

    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        return res.json({
            success: true,
            message: 'Si cet email existe, vous recevrez un lien de réinitialisation'
        });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    await user.save();

    logSecurityEvent('PASSWORD_RESET_REQUESTED', {
        userId: user._id,
        email: user.email
    }, req);

    // TODO: Envoyer l'email avec le lien de réinitialisation
    await sendPasswordResetEmail(user.email, user.username, resetToken);
    logger.info(`Token de réinitialisation pour ${email}: ${resetToken}`);

    res.json({
        success: true,
        message: 'Si cet email existe, vous recevrez un lien de réinitialisation'
    });
}));

// @route   POST /api/auth/reset-password
// @desc    Réinitialiser le mot de passe
// @access  Public
router.post('/reset-password', [
    body('token').notEmpty().withMessage('Token requis'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Le mot de passe doit contenir au moins 6 caractères')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre')
], asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new ValidationError('Données invalides');
    }

    const { token, password } = req.body;

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: {
            $gt: Date.now()
        }
    });

    if (!user) {
        throw new AuthenticationError('Token invalide ou expiré');
    }

    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.refreshTokens = []; // Déconnecter de tous les appareils

    await user.save();

    logSecurityEvent('PASSWORD_RESET_SUCCESS', {
        userId: user._id,
        email: user.email
    }, req);

    res.json({
        success: true,
        message: 'Mot de passe réinitialisé avec succès'
    });
}));

// @route   GET /api/auth/me
// @desc    Obtenir les informations de l'utilisateur connecté
// @access  Private
router.get('/me', authenticate, asyncHandler(async (req, res) => {
    res.json({
        success: true,
        message: 'User profile',
        data: {
            user: req.user.profile
        }
    });
}));

module.exports = router;