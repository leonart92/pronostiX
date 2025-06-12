const express = require('express');
const { body, validationResult } = require('express-validator');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const User = require('../models/User');
const Subscription = require('../models/Subscription');
const Payment = require('../models/Payment');
const {
    authenticate,
    requireActiveSubscription
} = require('../middlewares/auth');
const {
    asyncHandler,
    ValidationError,
    NotFoundError,
    PaymentError,
} = require('../middlewares/errorHandler');
const { logPaymentEvent, logger } = require('../utils/logger');

const router = express.Router();

// @route   GET /api/subscriptions/plans
// @desc    Obtenir les plans d'abonnement disponibles
// @access  Public
router.get('/plans', asyncHandler(async (req, res) => {
    const plans = Subscription.getAvailablePlans(); // ✅ CORRIGÉ

    res.json({
        success: true,
        data: plans
    });
}));

// @route   POST /api/subscriptions/create-checkout
// @desc    Créer une session de checkout Stripe
// @access  Private
// Dans votre routes/subscriptionRoutes.js - Remplacez la route create-checkout par :

router.post('/create-checkout', authenticate, [
    body('plan')
        .isIn(['monthly', 'quarterly', 'annually'])
        .withMessage('Plan invalide'),

    // ✅ VALIDATION CORRIGÉE - Accepter localhost en développement
    body('successUrl')
        .custom((value) => {
            // Accepter localhost en développement
            if (process.env.NODE_ENV === 'development' && value.startsWith('http://localhost:')) {
                return true;
            }
            // Sinon, validation URL normale
            return /^https?:\/\/.+/.test(value);
        })
        .withMessage('URL de succès invalide'),

    body('cancelUrl')
        .custom((value) => {
            // Accepter localhost en développement
            if (process.env.NODE_ENV === 'development' && value.startsWith('http://localhost:')) {
                return true;
            }
            // Sinon, validation URL normale
            return /^https?:\/\/.+/.test(value);
        })
        .withMessage('URL d\'annulation invalide')
], asyncHandler(async (req, res) => {

    // 🔍 DEBUG
    console.log('=== DEBUG CREATE-CHECKOUT ===');
    console.log('NODE_ENV:', process.env.NODE_ENV);
    console.log('Données reçues:', req.body);
    console.log('User connecté:', req.user?.email);
    console.log('Plan reçu:', req.body.plan);
    console.log('successUrl reçu:', req.body.successUrl);
    console.log('cancelUrl reçu:', req.body.cancelUrl);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log('❌ Erreurs de validation:', errors.array());
        return res.status(400).json({
            success: false,
            message: 'Erreurs de validation',
            code: 'VALIDATION_ERROR',
            errors: errors.array()
        });
    }
    console.log('✅ Validation réussie');
    console.log('===============================');

    const { plan, successUrl, cancelUrl } = req.body;
    const user = req.user;

    // Vérifier l'abonnement existant
    try {
        const existingSubscription = await Subscription.findOne({
            userId: user._id,
            status: { $in: ['active', 'trialing'] }
        });

        if (existingSubscription) {
            return res.status(400).json({
                success: false,
                message: 'Vous avez déjà un abonnement actif',
                code: 'EXISTING_SUBSCRIPTION'
            });
        }
    } catch (subscriptionError) {
        // Si le modèle Subscription n'existe pas encore, on continue
        console.log('ℹ️ Pas de modèle Subscription (normal pour premier test)');
    }

    // Récupérer les plans disponibles
    let plans;
    try {
        plans = Subscription.getAvailablePlans();
    } catch (planError) {
        // Fallback si le modèle n'est pas encore configuré
        console.log('ℹ️ Utilisation des plans en dur');
        plans = {
            monthly: {
                name: 'Mensuel',
                price: 14.99,
                stripePriceId: process.env.STRIPE_MONTHLY_PRICE_ID
            },
            quarterly: {
                name: 'Trimestriel',
                price: 37.47,
                stripePriceId: process.env.STRIPE_QUARTERLY_PRICE_ID
            },
            annually: {
                name: 'Annuel',
                price: 134.88,
                stripePriceId: process.env.STRIPE_ANNUAL_PRICE_ID
            }
        };
    }

    const selectedPlan = plans[plan];

    if (!selectedPlan) {
        return res.status(400).json({
            success: false,
            message: 'Plan sélectionné invalide',
            code: 'INVALID_PLAN'
        });
    }

    console.log('🔍 Plan sélectionné:', selectedPlan);
    console.log('🔍 Price ID:', selectedPlan.stripePriceId);

    if (!selectedPlan.stripePriceId) {
        return res.status(500).json({
            success: false,
            message: `Price ID manquant pour le plan ${plan}`,
            code: 'MISSING_PRICE_ID'
        });
    }

    // Création de la session Stripe
    try {
        console.log('🔍 Création customer Stripe...');

        let stripeCustomer;

        // Chercher un customer existant
        const customers = await stripe.customers.list({
            email: user.email,
            limit: 1
        });

        if (customers.data.length > 0) {
            stripeCustomer = customers.data[0];
            console.log('✅ Customer existant trouvé:', stripeCustomer.id);
        } else {
            stripeCustomer = await stripe.customers.create({
                email: user.email,
                name: user.username,
                metadata: {
                    userId: user._id.toString()
                }
            });
            console.log('✅ Nouveau customer créé:', stripeCustomer.id);
        }

        console.log('🔍 Création session Checkout...');

        const session = await stripe.checkout.sessions.create({
            customer: stripeCustomer.id,
            payment_method_types: ['card'],
            line_items: [
                {
                    price: selectedPlan.stripePriceId,
                    quantity: 1
                }
            ],
            mode: 'subscription',
            success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: cancelUrl,
            metadata: {
                userId: user._id.toString(),
                plan: plan
            },
            subscription_data: {
                metadata: {
                    userId: user._id.toString(),
                    plan: plan
                }
            }
        });

        console.log('✅ Session Stripe créée:', session.id);
        console.log('✅ URL checkout:', session.url);

        // Log de l'événement (optionnel)
        try {
            logPaymentEvent('CHECKOUT_SESSION_CREATED', {
                sessionId: session.id,
                plan: plan,
                amount: selectedPlan.price
            }, user._id);
        } catch (logError) {
            console.log('ℹ️ Log événement échoué (pas grave)');
        }

        res.json({
            success: true,
            data: {
                sessionId: session.id,
                checkoutUrl: session.url
            }
        });

    } catch (error) {
        console.error('❌ Erreur création session Stripe:', error);

        // Gestion des erreurs Stripe spécifiques
        if (error.type === 'StripeInvalidRequestError') {
            return res.status(400).json({
                success: false,
                message: `Erreur Stripe: ${error.message}`,
                code: 'STRIPE_ERROR',
                details: error.param
            });
        }

        res.status(500).json({
            success: false,
            message: 'Erreur lors de la création de la session de paiement',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}));

// @route   GET /api/subscriptions/session/:sessionId
// @desc    Récupérer le statut d'une session de checkout
// @access  Private
router.get('/session/:sessionId', authenticate, asyncHandler(async (req, res) => {
    const { sessionId } = req.params;

    try {
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        if (session.metadata.userId !== req.user._id.toString()) {
            throw new ValidationError('Session non autorisée');
        }

        res.json({
            success: true,
            data: {
                status: session.payment_status,
                customerEmail: session.customer_details?.email,
                amountTotal: session.amount_total / 100,
                currency: session.currency
            }
        });
    } catch (error) {
        logger.error('Erreur lors de la récupération de la session:', error);
        throw new PaymentError('Erreur lors de la vérification du paiement');
    }
}));

// @route   POST /api/subscriptions/webhook
// @desc    Webhook Stripe pour gérer les événements
// @access  Public (avec signature Stripe)
router.post('/webhook', express.raw({ type: 'application/json' }), asyncHandler(async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (error) {
        logger.error('Erreur de signature webhook:', error.message);
        return res.status(400).send(`Webhook Error: ${error.message}`);
    }

    logger.info(`Webhook reçu: ${event.type}`);

    try {
        switch (event.type) {
            case 'checkout.session.completed':
                await handleCheckoutSessionCompleted(event.data.object);
                break;
            case 'customer.subscription.created':
                await handleSubscriptionCreated(event.data.object);
                break;
            case 'customer.subscription.updated':
                await handleSubscriptionUpdated(event.data.object);
                break;
            case 'customer.subscription.deleted':
                await handleSubscriptionDeleted(event.data.object);
                break;
            case 'payment_intent.succeeded':
                await handlePaymentSucceeded(event.data.object);
                break;
            case 'payment_intent.payment_failed':
                await handlePaymentFailed(event.data.object);
                break;
            case 'invoice.payment_succeeded':
                await handleInvoicePaymentSucceeded(event.data.object);
                break;
            case 'invoice.payment_failed':
                await handleInvoicePaymentFailed(event.data.object);
                break;

            default:
                logger.info(`Évènement webhook non géré: ${event.type}`);
        }

        res.json({ received: true });
    } catch (error) {
        logger.error('Erreur lors du traitement du webhook:', error);
        res.status(500).json({ error: 'Erreur lors du traitement du webhook' });
    }
}));

// @route   GET /api/subscriptions/current
// @desc    Obtenir l'abonnement actuel de l'utilisateur
// @access  Private
router.get('/current', authenticate, asyncHandler(async (req, res) => {
    const subscription = await Subscription.findOne({ userId: req.user._id })
        .sort({ createdAt: -1 });

    if (!subscription) {
        return res.json({
            success: true,
            data: {
                subscription: null,
                hasActiveSubscription: false
            }
        });
    }

    res.json({
        success: true,
        data: {
            subscription: {
                ...subscription.toObject(),
                planDetails: subscription.planDetails,
                daysRemaining: subscription.getDaysRemaining(),
                nextBillingDate: subscription.getNextBillingDate(), // ✅ CORRIGÉ
                isActive: subscription.isActive()
            },
            hasActiveSubscription: subscription.isActive() // ✅ CORRIGÉ
        }
    });
}));

// @route   POST /api/subscriptions/cancel
// @desc    Annuler l'abonnement à la fin de la période
// @access  Private
router.post('/cancel', requireActiveSubscription, asyncHandler(async (req, res) => {
    const user = req.user;
    const subscription = await Subscription.findOne({
        userId: user._id,
        status: 'active'
    });

    if (!subscription) {
        throw new NotFoundError('Aucun abonnement actif trouvé');
    }

    try {
        const stripeSubscription = await stripe.subscriptions.update(
            subscription.stripeSubscriptionId,
            { cancel_at_period_end: true }
        );

        subscription.cancelAtPeriodEnd = true;
        await subscription.save(); // ✅ CORRIGÉ

        logPaymentEvent('SUBSCRIPTION_CANCELLED', {
            subscriptionId: subscription._id,
            stripeSubscriptionId: subscription.stripeSubscriptionId
        }, user._id);

        res.json({
            success: true,
            message: 'Abonnement annulé. Il restera actif jusqu\'à la fin de la période de facturation.',
            data: {
                subscription: {
                    ...subscription.toObject(),
                    cancelAtPeriodEnd: true,
                    endsAt: subscription.currentPeriodEnd
                }
            }
        });
    } catch (error) {
        logger.error('Erreur lors de l\'annulation de l\'abonnement:', error);
        throw new PaymentError('Erreur lors de l\'annulation de l\'abonnement');
    }
}));

// @route   POST /api/subscriptions/reactivate
// @desc    Réactiver un abonnement annulé
// @access  Private
router.post('/reactivate', authenticate, asyncHandler(async (req, res) => {
    const user = req.user;
    const subscription = await Subscription.findOne({
        userId: user._id,
        status: 'active',
        cancelAtPeriodEnd: true
    });

    if (!subscription) {
        throw new NotFoundError('Aucun abonnement annulé trouvé');
    }

    try {
        const stripeSubscription = await stripe.subscriptions.update(
            subscription.stripeSubscriptionId,
            { cancel_at_period_end: false }
        );

        subscription.cancelAtPeriodEnd = false; // ✅ CORRIGÉ
        await subscription.save();

        logPaymentEvent('SUBSCRIPTION_REACTIVATED', {
            subscriptionId: subscription._id,
            stripeSubscriptionId: subscription.stripeSubscriptionId
        }, user._id);

        res.json({
            success: true,
            message: 'Abonnement réactivé avec succès',
            data: { // ✅ CORRIGÉ
                subscription
            }
        });
    } catch (error) {
        logger.error('Erreur lors de la réactivation:', error);
        throw new PaymentError('Erreur lors de la réactivation de l\'abonnement');
    }
}));

// @route   GET /api/subscriptions/invoices
// @desc    Obtenir l'historique des factures
// @access  Private
router.get('/invoices', requireActiveSubscription, asyncHandler(async (req, res) => {
    const user = req.user;

    if (!user.stripeCustomerId) {
        return res.json({
            success: true,
            data: {
                invoices: []
            }
        });
    }

    try {
        const invoices = await stripe.invoices.list({
            customer: user.stripeCustomerId,
            limit: 10
        });

        const formattedInvoices = invoices.data.map(invoice => ({
            id: invoice.id,
            number: invoice.number,
            amount: invoice.amount_paid / 100,
            currency: invoice.currency,
            status: invoice.status,
            date: new Date(invoice.created * 1000),
            pdfUrl: invoice.invoice_pdf,
            hostedUrl: invoice.hosted_invoice_url
        }));

        res.json({
            success: true,
            data: {
                invoices: formattedInvoices
            }
        });
    } catch (error) {
        logger.error('Erreur lors de la récupération des factures:', error);
        throw new PaymentError('Erreur lors de la récupération des factures');
    }
}));


// @route   POST /api/subscriptions/sync-from-stripe
// @desc    Synchroniser l'abonnement depuis Stripe vers la BDD
// @access  Private
router.post('/sync-from-stripe', authenticate, asyncHandler(async (req, res) => {
    const { sessionId } = req.body;
    const user = req.user;

    console.log('🔄 Synchronisation Stripe pour user:', user.email, 'session:', sessionId);

    if (!sessionId) {
        return res.status(400).json({
            success: false,
            message: 'Session ID requis',
            code: 'MISSING_SESSION_ID'
        });
    }

    try {
        // 1. Récupérer la session Stripe
        console.log('🔍 Récupération session Stripe...');
        const session = await stripe.checkout.sessions.retrieve(sessionId, {
            expand: ['subscription', 'customer']
        });

        console.log('✅ Session trouvée:', {
            id: session.id,
            status: session.payment_status,
            customer: session.customer?.id,
            subscription: session.subscription?.id
        });

        // Vérifier que la session appartient à cet utilisateur
        if (session.metadata.userId !== user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Cette session ne vous appartient pas',
                code: 'UNAUTHORIZED_SESSION'
            });
        }

        // Vérifier que le paiement a réussi
        if (session.payment_status !== 'paid') {
            return res.status(400).json({
                success: false,
                message: 'Paiement non confirmé',
                code: 'PAYMENT_NOT_CONFIRMED'
            });
        }

        // 2. Récupérer l'abonnement Stripe
        if (!session.subscription) {
            return res.status(400).json({
                success: false,
                message: 'Aucun abonnement trouvé dans cette session',
                code: 'NO_SUBSCRIPTION_FOUND'
            });
        }

        console.log('🔍 Récupération abonnement Stripe...');
        const stripeSubscription = await stripe.subscriptions.retrieve(session.subscription.id);

        console.log('✅ Abonnement Stripe:', {
            id: stripeSubscription.id,
            status: stripeSubscription.status,
            current_period_end: new Date(stripeSubscription.current_period_end * 1000),
            plan: session.metadata.plan
        });

        // 3. Mettre à jour l'utilisateur dans la BDD
        console.log('🔄 Mise à jour utilisateur...');

        const User = require('../models/User');
        const updatedUser = await User.findByIdAndUpdate(
            user._id,
            {
                subscriptionStatus: 'active',
                // Optionnel : stocker l'ID Stripe customer
                stripeCustomerId: session.customer.id
            },
            { new: true }
        );

        console.log('✅ Utilisateur mis à jour:', {
            id: updatedUser._id,
            email: updatedUser.email,
            subscriptionStatus: updatedUser.subscriptionStatus
        });

        // 4. 🆕 Créer/mettre à jour l'enregistrement Subscription (optionnel)
        try {
            // Essayer de créer un enregistrement Subscription
            const subscriptionData = {
                userId: user._id,
                plan: session.metadata.plan,
                status: stripeSubscription.status,
                stripeSubscriptionId: stripeSubscription.id,
                stripeCustomerId: session.customer.id,
                stripePriceId: stripeSubscription.items.data[0].price.id,
                amount: stripeSubscription.items.data[0].price.unit_amount / 100,
                currency: stripeSubscription.currency.toUpperCase(),
                startDate: new Date(stripeSubscription.current_period_start * 1000),
                endDate: new Date(stripeSubscription.current_period_end * 1000),
                currentPeriodStart: new Date(stripeSubscription.current_period_start * 1000),
                currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000)
            };

            // Vérifier si un abonnement existe déjà
            let subscription = await Subscription.findOne({
                $or: [
                    { userId: user._id, status: 'active' },
                    { stripeSubscriptionId: stripeSubscription.id }
                ]
            });

            if (subscription) {
                // Mettre à jour l'abonnement existant
                Object.assign(subscription, subscriptionData);
                await subscription.save();
                console.log('✅ Abonnement mis à jour:', subscription._id);
            } else {
                // Créer un nouvel abonnement
                subscription = new Subscription(subscriptionData);
                await subscription.save();
                console.log('✅ Nouvel abonnement créé:', subscription._id);
            }

            // Mettre à jour l'utilisateur avec l'ID de l'abonnement
            updatedUser.subscriptionId = subscription._id;
            await updatedUser.save();

        } catch (subscriptionError) {
            console.log('⚠️ Erreur création Subscription (pas bloquant):', subscriptionError.message);
            // Ne pas faire échouer la synchronisation si le modèle Subscription a des problèmes
        }

        // 5. Réponse de succès
        console.log('🎉 Synchronisation terminée avec succès');

        res.json({
            success: true,
            message: 'Abonnement synchronisé avec succès',
            data: {
                user: updatedUser.profile, // Utilise la méthode profile du modèle User
                subscription: {
                    id: stripeSubscription.id,
                    status: stripeSubscription.status,
                    plan: session.metadata.plan,
                    current_period_end: new Date(stripeSubscription.current_period_end * 1000),
                    cancel_at_period_end: stripeSubscription.cancel_at_period_end
                },
                session: {
                    id: session.id,
                    payment_status: session.payment_status,
                    amount_total: session.amount_total / 100,
                    currency: session.currency
                }
            }
        });

    } catch (error) {
        console.error('❌ Erreur synchronisation Stripe:', error);

        // Gestion des erreurs Stripe spécifiques
        if (error.type === 'StripeInvalidRequestError') {
            return res.status(400).json({
                success: false,
                message: `Erreur Stripe: ${error.message}`,
                code: 'STRIPE_ERROR'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Erreur lors de la synchronisation',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}));

// Dans routes/subscriptionRoutes.js - Remplacez la route session par :

router.get('/session/:sessionId', authenticate, asyncHandler(async (req, res) => {
    const { sessionId } = req.params;

    console.log('🔍 Route session appelée:', sessionId);
    console.log('🔍 User:', req.user?.email);

    try {
        console.log('🔍 Récupération session Stripe...');
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        console.log('✅ Session Stripe récupérée:', {
            id: session.id,
            payment_status: session.payment_status,
            status: session.status,
            customer_email: session.customer_details?.email,
            amount_total: session.amount_total,
            metadata: session.metadata
        });

        // Vérifier que la session appartient à l'utilisateur
        if (session.metadata.userId !== req.user._id.toString()) {
            console.log('❌ Session non autorisée:', {
                sessionUserId: session.metadata.userId,
                currentUserId: req.user._id.toString()
            });
            return res.status(403).json({
                success: false,
                message: 'Session non autorisée'
            });
        }

        console.log('✅ Session autorisée');

        res.json({
            success: true,
            data: {
                status: session.payment_status,
                payment_status: session.payment_status, // 🆕 Ajout explicite
                session_status: session.status, // 🆕 Ajout du statut de session
                customerEmail: session.customer_details?.email,
                amountTotal: session.amount_total / 100,
                currency: session.currency,
                subscription_id: session.subscription // 🆕 Ajout subscription ID
            }
        });
    } catch (error) {
        console.error('❌ Erreur récupération session:', error);

        res.status(500).json({
            success: false,
            message: 'Erreur lors de la vérification du paiement',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}));

// ✅ NOUVELLE FONCTION AJOUTÉE
async function handleCheckoutSessionCompleted(session) {
    const userId = session.metadata.userId;
    const plan = session.metadata.plan;

    try {
        const user = await User.findById(userId);
        if (!user) {
            logger.error(`Utilisateur non trouvé pour checkout session: ${userId}`);
            return;
        }

        // Récupérer l'abonnement Stripe
        const stripeSubscription = await stripe.subscriptions.retrieve(session.subscription);

        // Créer l'abonnement dans notre base
        await handleSubscriptionCreated(stripeSubscription);

        logPaymentEvent('CHECKOUT_SESSION_COMPLETED', {
            sessionId: session.id,
            userId: userId,
            plan: plan
        }, userId);

    } catch (error) {
        logger.error('Erreur lors du traitement de checkout session completed:', error);
    }
}

async function handleSubscriptionCreated(stripeSubscription) {
    const userId = stripeSubscription.metadata.userId;
    const plan = stripeSubscription.metadata.plan;

    const user = await User.findById(userId);
    if (!user) {
        logger.error(`Utilisateur non trouvé pour subscription created: ${userId}`);
        return;
    }

    const subscription = new Subscription({
        userId: userId,
        plan: plan,
        status: stripeSubscription.status,
        stripeSubscriptionId: stripeSubscription.id,
        stripeCustomerId: stripeSubscription.customer,
        stripePriceId: stripeSubscription.items.data[0].price.id,
        amount: stripeSubscription.items.data[0].price.unit_amount / 100,
        currentPeriodStart: new Date(stripeSubscription.current_period_start * 1000),
        currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000)
    });

    await subscription.save(); // ✅ CORRIGÉ

    user.subscriptionStatus = 'active';
    user.subscriptionId = subscription._id;
    await user.save();

    logPaymentEvent('SUBSCRIPTION_CREATED', {
        subscriptionId: subscription._id,
        stripeSubscriptionId: stripeSubscription.id,
        plan: plan
    }, userId);
}

async function handleSubscriptionUpdated(stripeSubscription) {
    const subscription = await Subscription.findOne({
        stripeSubscriptionId: stripeSubscription.id
    });

    if (!subscription) {
        logger.error(`Subscription non trouvée: ${stripeSubscription.id}`);
        return;
    }

    subscription.status = stripeSubscription.status;
    subscription.currentPeriodStart = new Date(stripeSubscription.current_period_start * 1000);
    subscription.currentPeriodEnd = new Date(stripeSubscription.current_period_end * 1000);
    subscription.cancelAtPeriodEnd = stripeSubscription.cancel_at_period_end;

    if (stripeSubscription.canceled_at) { // ✅ CORRIGÉ
        subscription.cancelledAt = new Date(stripeSubscription.canceled_at * 1000);
    }

    await subscription.save();

    const user = await User.findById(subscription.userId);
    if (user) {
        user.subscriptionStatus = stripeSubscription.status;
        await user.save();
    }

    logPaymentEvent('SUBSCRIPTION_UPDATED', {
        subscriptionId: subscription._id,
        newStatus: stripeSubscription.status
    }, subscription.userId);
}

async function handleSubscriptionDeleted(stripeSubscription) {
    const subscription = await Subscription.findOne({
        stripeSubscriptionId: stripeSubscription.id
    });

    if (!subscription) {
        logger.error(`Subscription non trouvée pour deletion: ${stripeSubscription.id}`); // ✅ CORRIGÉ
        return;
    }

    subscription.status = 'cancelled';
    subscription.cancelledAt = new Date();
    await subscription.save();

    const user = await User.findById(subscription.userId);
    if (user) {
        user.subscriptionStatus = 'cancelled'; // ✅ CORRIGÉ
        await user.save();
    }

    logPaymentEvent('SUBSCRIPTION_DELETED', {
        subscriptionId: subscription._id
    }, subscription.userId);
}

async function handlePaymentSucceeded(paymentIntent) {
    const payment = new Payment({
        userId: paymentIntent.metadata.userId,
        subscriptionId: paymentIntent.metadata.subscriptionId,
        amount: paymentIntent.amount / 100,
        currency: paymentIntent.currency,
        status: 'succeeded',
        stripePaymentIntentId: paymentIntent.id,
        description: paymentIntent.description
    });

    await payment.markAsSucceeded({
        receiptUrl: paymentIntent.charges?.data[0]?.receipt_url
    });

    logPaymentEvent('PAYMENT_SUCCEEDED', {
        paymentId: payment._id,
        amount: payment.amount
    }, payment.userId);
}

async function handlePaymentFailed(paymentIntent) {
    const payment = await Payment.findOne({
        stripePaymentIntentId: paymentIntent.id
    });

    if (payment) {
        await payment.markAsFailed(paymentIntent.last_payment_error?.message);
    }

    logPaymentEvent('PAYMENT_FAILED', {
        paymentIntentId: paymentIntent.id,
        error: paymentIntent.last_payment_error?.message
    }, paymentIntent.metadata.userId);
}

async function handleInvoicePaymentSucceeded(invoice) {
    logger.info(`Facture payée: ${invoice.id}`);
}

async function handleInvoicePaymentFailed(invoice) {
    logger.error(`Échec de paiement de facture: ${invoice.id}`);
}

module.exports = router;