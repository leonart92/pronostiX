const { logger } = require('../utils/logger');

class AppError extends Error {
    constructor(message, statusCode, code = null) {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

class ValidationError extends AppError {
    constructor(message, field = null) {
        super(message, 400, 'VALIDATION_ERROR');
        this.field = field;
    }
}

class AuthenticationError extends AppError {
    constructor(message = 'Authentification required') {
        super(message, 401, 'AUTHENTICATION_ERROR');
    }
}

class AuthorizationError extends AppError {
    constructor(message = 'Authorization required') {
        super(message, 403, 'AUTHORIZATION_ERROR');
    }
}

class NotFoundError extends AppError {
    constructor(message = 'Resource not found') {
        super(message, 404, 'NOT_FOUND_ERROR');
    }
}

class ConflictError extends AppError {
    constructor(message = 'Conflict data') {
        super(message, 409, 'CONFLICT_ERROR');
    }
}

class PaymentError extends AppError {
    constructor(message= 'Payment error') {
        super(message, 402, 'PAYMENT_ERROR');
    }
}

class SubscriptionError extends AppError {
    constructor(message = 'Subscription error') {
        super(message, 400, 'SUBSCRIPTION_ERROR');
    }
}

const handleMongoError = (error) => {
    if (error.code === 11000) {
        const field = Object.keys(error.keyValue)[0];
        const value = error.keyValue[field];
        return new ConflictError(`${field} '${value}' already exists`);
    }

    if (error.name === 'ValidationError') {
        return new ValidationError(`Format d'ID invalide: ${error.value}`);
    }

    return error;
};

const handleJWTError = (error) => {
    if (error.name === 'JsonWbTokenError') {
        return new AuthenticationError('Invalid token');
    }
    if (error.name === 'TokenExpiredError') {
        return new AuthenticationError('Token expired');
    }
    return error;
};

const handleStripeError = (error) => {
    switch(error.type) {
        case 'StripeCardError':
            return new PaymentError(`Error of card type: ${error.message}`);
            case 'StripeInvalidRequestError':
                return new PaymentError(`Error of card type: ${error.message}`);
                case 'StripeAPIError':
                    return new PaymentError('Stripe API error');
                    case 'StripeConnectionError':
                        return new PaymentError('Stripe connection error');
                        case 'StripeAuthenticationError':
                            return new PaymentError('Error authentication Stripe');
                            case 'StripeRateLimitError':
                                return new PaymentError('Stripe rate limit error');
        default:
            return new PaymentError(`Error payment Stripe: ${error.message}`);
    }
};

const sendErrorProd = (err, res) => {
    if (err.isOperational) {
        const response = {
            success: false,
            message: err.message
        };

        if (err.code) {
            response.code = err.code;
        }
        if (err.field) {
            response.field = err.field;
        }

        return res.status(err.statusCode).json(response);
    }

    logger.error('SYSTEM ERROR: ', err);

    res.status(500).json({
        success: false,
        message: 'Internal server error'
    });
};

const sendErrorDev = (err, res) => {
    const response = {
        success: false,
        message: err.message,
        error: err,
        stack: err.stack
    };

    if (err.code) {
        response.code = err.code;
    }

    if (err.field) {
        response.field = err.field;
    }

    res.status(err.statusCode || 500).json(response);
};


const errorHandler = (err, req, res, next) => {
    let error = {...err};
    error.message = err.message;

    logger.error(`Error ${req.method} ${req.originalUrl}:`, {
        message: err.message,
        stack: err.stack,
        user: req.user ? req.user._id : 'Anonyme',
        ip: req.ip,
        userAgent: req.get('User-Agent')
    });

    if (err.name === 'MongoError' || err.name === 'MongoServerError' || err.name === 'ValidationError' || err.name === 'CastError') {
        error = handleMongoError(error);
    } else if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
        error = handleJWTError(error);
    } else if (err.type && err.type.includes('Stripe')) {
        error = handleStripeError(error);
    }

    if (process.env.NODE_ENV === 'production') {
        sendErrorProd(error, res);
    } else {
        sendErrorDev(error, res);
    }
};

const notFound = (req, res, next) => {
    const error = new NotFoundError(`Route ${req.originalUrl} not found`);
    next(error);
};

const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};

process.on('unhandledRejection', (err) => {
    logger.error('Unhandled Rejection: ', err);
});

process.on('uncaughtException', (err) => {
    logger.error('Uncaught Exception: ', err);
    process.exit(1);
});

module.exports = {
    errorHandler,
    notFound,
    asyncHandler,
    AppError,
    ValidationError,
    AuthenticationError,
    AuthorizationError,
    NotFoundError,
    ConflictError,
    PaymentError,
    SubscriptionError
};
