

const winston = require('winston');
const path = require('path');

const fs = require('fs');
const {log} = require("winston");
const logDir = 'logs';

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const logFormat = winston.format.combine(
    winston.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
    }),
    winston.format.errors({ stack : true}),
    winston.format.json(),
    winston.format.prettyPrint()
);

const consoleFormat= winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp({
        format: 'HH:mm:ss'
    }),
    winston.format.printf(({ timestamp, level, message, ...meta}) => {
        let msg = `${timestamp}[${level}]: ${message}`;

        if (Object.keys(meta).length > 0) {
            msg += '\n' + JSON.stringify(meta, null, 2);
        }
        return msg;
    })
);

const transports = [];

if (process.env.NODE_ENV !== 'production') {
    transports.push(
        new winston.transports.Console({
            format : consoleFormat,
            level: 'debug'
        })
    );
}

transports.push(
    new winston.transports.File({
        filename: path.join(logDir, 'error.log'),
        level: 'error',
        format: logFormat,
        maxsize: 5242880,
        maxFiles: 5
    }),
    // Tous les logs
    new winston.transports.File({
        filename: path.join(logDir, 'combined.log'),
        format: logFormat,
        maxsize: 5242880, // 5MB
        maxFiles: 5
    }),

    // Logs d'accès/activité
    new winston.transports.File({
        filename: path.join(logDir, 'access.log'),
        level: 'info',
        format: logFormat,
        maxsize: 5242880, // 5MB
        maxFiles: 5
    })
);

// Créer le logger
const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: logFormat,
    transports: transports,

    // Gérer les exceptions non capturées
    exceptionHandlers: [
        new winston.transports.File({
            filename: path.join(logDir, 'exceptions.log'),
            format: logFormat
        })
    ],

    // Gérer les rejections non capturées
    rejectionHandlers: [
        new winston.transports.File({
            filename: path.join(logDir, 'rejections.log'),
            format: logFormat
        })
    ]
});

const requestLogger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.File({
            filename: path.join(logDir, 'requests.log'),
            maxsize: 5242880,
            maxFiles: 5,
        })
    ]
});

const paymentLogger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.File({
            filename: path.join(logDir, 'payments.log'),
            maxsize: 5242880,
            maxFiles: 5,
        })
    ]
});

const securityLogger = winston.createLogger({
    level: 'warn',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.File({
            filename: path.join(logDir, 'security.log'),
            maxsize: 5242880,
            maxFiles: 10
        })
    ]
});

const logRequest = (req, res, next) => {
    const start = Date.now();

    res.on('finish', () => {
        const duration = Date.now() - start;
        const logData = {
            method: req.method,
            url: req.originalUrl,
            status: res.statusCode,
            duration: duration,
            ip: req.ip,
            userAgent: req.get('User-Agent'),
            userId: req.user ? req.user_id : null,
            timestamp: new Date().toISOString()
        };

        requestLogger.info('HTTP Request', logData);

        if (res.statusCode >= 400) {
            logger.warn('HTTP Request', logData);
        }
    });
    next();
};

const logSecurityEvent = (event, details, req = null) => {
    const logData = {
        event : event,
        details: details,
        timestamp: new Date().toISOString(),
    };

    if (req) {
        logData.ip = req.ip;
        logData.userAgent = req.get('User-Agent');
        logData.userId = req.user ? req.user._id: null;
    }

    securityLogger.warn('Security Event', logData);
    logger.warn(`SECURITY: ${event}`, logData);
};

const logPaymentEvent = (event, details, userId = null) => {
    const logData = {
        event: event,
        details: details,
        userId: userId,
        timestamp: new Date().toISOString()
    };
    paymentLogger.info('Payment Event', logData);
    logger.info(`PAYMENT: ${event}`, logData);
};

const logCriticalError = (error, context = {}) => {
    const logData = {
        error: {
            message: error.message,
            stack: error.stack,
            name: error.name
        },
        context: context,
        timestamp: new Date().toISOString()
    };

    logger.error('Critical Error', logData);

    if (process.env.NODE_ENV === 'production') {
        console.error('🚨 ERREUR CRITIQUE DÉTECTÉE 🚨', logData);
    }
};

module.exports = {
    logger,
    requestLogger,
    paymentLogger,
    securityLogger,
    logRequest,
    logSecurityEvent,
    logPaymentEvent,
    logCriticalError
};
