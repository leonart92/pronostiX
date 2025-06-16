const jwt = require('jsonwebtoken');
const User = require('../models/User');
const {logger} = require('../utils/logger');

const authenticate = async(req, res, next ) => {
    try {
        const authHeader = req.header('Authorization');
        console.log('🔍 AUTH - Header reçu:', authHeader);
        if (!authHeader) {
            console.log('❌ AUTH - Pas de header');
            return res.status(401).json({
                success: false,
                message: 'Token not provided'
            });
        }

        const token = authHeader.replace('Bearer ', '').trim();
        console.log('🔍 AUTH - Token extrait:', token.slice(0, 30) + '...'); // LOG

        if (!token) {
            console.log('❌ AUTH - Token vide');
            return res.status(401).json({
                success: false,
                message: 'Token not provided'
            });
        }

        console.log('🔍 AUTH - JWT_SECRET existe:', !!process.env.JWT_SECRET); // LOG
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("AUTH decodé =>", decoded);

        const user = await User.findById(decoded.userId).select('-password -refreshTokens');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid User'
            });
        }
        console.log('✅ AUTH - User trouvé:', user.username, 'Status:', user.subscriptionStatus); // LOG

        req.user = user;
        req.userId = user._id;
        next();
    } catch (error) {
        logger.error('Authentication Error: ', error);

        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token expired',
                code: 'TOKEN_EXPIRED'
            });
        }

        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Invalid token',
                code: 'INVALID_TOKEN'
            });
        }

        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};

const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.header('Authorization');

        if (!authHeader) {
            req.user = null;
            req.userId = null;
            return next();
        }

        const token = authHeader.replace('Bearer ', '');

        if (!token) {
            req.user = null;
            req.userId = null;
            return next();
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).select('-password -refreshTokens');

        req.user = user;
        req.userId = user ? user._id: null;
        next();
    } catch (error) {
        req.user = null;
        req.userId = null;
        next();
    }
};

const requireAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(403).json({
            success: false,
            message: 'Unauthorized'
        });
    }
    next();
};



const requireActiveSubscription = (req, res, next) => {
    console.log('🔍 REQUIRE_SUB - Start, req.user exists:', !!req.user);
    console.log('🔍 REQUIRE_SUB - User:', req.user?.username);
    if (!req.user) {
        console.log('❌ REQUIRE_SUB - req.user est NULL !');

        return res.status(401).json({
            success: false,
            message: 'Authentication required'
        });
    }
    console.log('🔍 REQUIRE_SUB - Status:', req.user.subscriptionStatus);
    console.log('🔍 REQUIRE_SUB - hasActiveSubscription():', req.user.hasActiveSubscription());

    if (!req.user.hasActiveSubscription()) {
        console.log('❌ REQUIRE_SUB - Pas d\'abonnement actif');

        return res.status(403).json({
            success: false,
            message: 'Subscription required',
            code: 'SUBSCRIPTION_REQUIRED'
        });
    }
    console.log('✅ REQUIRE_SUB - OK, next()');

    next();
};

const requireSubscriptionOrAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: 'Authentication required'
        });
    }

    if (req.user.role === 'admin' || req.user.hasActiveSubscription()) {
        return next();
    }

    return res.status(403).json({
        success: false,
        message: 'Subscription required',
        code: 'SUBSCRIPTION_OR_ADMIN_REQUIRED'
    });
};

const requireOwnership = (resourceField = 'userId') => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
            success: false,message:'Authentication required'
            });
        }

        if (req.user.role === 'admin') {
            return next();
        }

        const resourceUserId = req.resource && req.resource[resourceField];

        if (!resourceUserId || resourceUserId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Unauthorized to this ressource'
            });
        }
        next();
    };
};

const requireVerifiedEmail = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: 'Authentication required'
        });
    }

    if (!req.user.isEmailVerified) {
        return res.status(403).json({
            success: false,
            message: 'Email not verified',
            code: 'EMAIL_NOT_VERIFIED'
        });
    }

    next();
};

const generateToken = (userId, expiresIn = '1h') => {
    return jwt.sign({userId}, process.env.JWT_SECRET, {expiresIn});
};

const generateRefreshToken = (userId) => {
    return jwt.sign(
        {userId, type: 'refresh'},
        process.env.JWT_REFRESH_SECRET,
        {expiresIn: '7d'}
    );
};

const verifyRefreshToken = (token) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

        if (decoded.type !== 'refresh') {
            throw new Error('Invalid token type');
        }

        return decoded;
    } catch (error) {
        throw error;
    }
};


module.exports = {
    authenticate,
    optionalAuth,
    requireAdmin,
    requireActiveSubscription,
    requireSubscriptionOrAdmin,
    requireOwnership,
    requireVerifiedEmail,
    generateToken,
    generateRefreshToken,
    verifyRefreshToken
};
