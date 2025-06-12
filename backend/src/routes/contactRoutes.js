// routes/contactRoutes.js
const express = require('express');
const { body, validationResult } = require('express-validator');
const { sendContactEmail } = require('../services/emailService');
const { asyncHandler, ValidationError } = require('../middlewares/errorHandler');
const { logger } = require('../utils/logger');

const router = express.Router();

// Validation des données de contact
const contactValidation = [
    body('name')
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Le nom doit contenir entre 2 et 100 caractères'),

    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Format d\'email invalide'),

    body('category')
        .isIn(['general', 'subscription', 'technical', 'partnership', 'press', 'other'])
        .withMessage('Catégorie invalide'),

    body('subject')
        .optional()
        .trim()
        .isLength({ max: 200 })
        .withMessage('Le sujet ne doit pas dépasser 200 caractères'),

    body('message')
        .trim()
        .isLength({ min: 10, max: 2000 })
        .withMessage('Le message doit contenir entre 10 et 2000 caractères')
];

// @route   POST /api/contact
// @desc    Envoyer un message de contact
// @access  Public
router.post('/', contactValidation, asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new ValidationError('Données de validation invalides', errors.array()[0].param);
    }

    const { name, email, subject, category, message } = req.body;

    // Log de sécurité pour traçabilité
    logger.info('📞 Nouveau message de contact:', {
        from: email,
        name: name,
        category: category,
        ip: req.ip,
        userAgent: req.get('User-Agent')
    });

    try {
        // Envoyer l'email de contact
        await sendContactEmail({
            name,
            email,
            subject,
            category,
            message
        });

        logger.info('✅ Email de contact envoyé avec succès à l\'admin');

        res.json({
            success: true,
            message: 'Message envoyé avec succès ! Nous vous répondrons rapidement.'
        });

    } catch (emailError) {
        logger.error('❌ Erreur envoi email de contact:', emailError);

        // Ne pas révéler l'erreur technique au client
        res.status(500).json({
            success: false,
            message: 'Erreur lors de l\'envoi du message. Veuillez réessayer plus tard.'
        });
    }
}));

// @route   GET /api/contact/test
// @desc    Test de la configuration email (développement uniquement)
// @access  Public
if (process.env.NODE_ENV === 'development') {
    router.get('/test', asyncHandler(async (req, res) => {
        try {
            await sendContactEmail({
                name: 'Test User',
                email: 'test@example.com',
                subject: 'Test de contact',
                category: 'technical',
                message: 'Ceci est un message de test pour vérifier la configuration email.'
            });

            res.json({
                success: true,
                message: 'Email de test envoyé avec succès !'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Erreur lors du test email',
                error: error.message
            });
        }
    }));
}

module.exports = router;