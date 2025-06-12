const mongoose = require('mongoose');
const {mongo} = require("mongoose");

const paymentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    subscriptionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subscription',
        required: true
    },

    amount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        required: true,
        default: 'EUR',
        uppercase: true
    },
    status: {
        type: String,
        required: true,
        enum: ['pending', 'succeeded', 'failed', 'cancelled', 'refunded', 'disputed'],
        default: 'pending'
    },

    paymentMethod: {
        type: String,
        required: true,
        enum: ['stripe', 'paypal'],
        default: 'stripe'
    },
    stripePaymentIntentId: {
        type: String,
        unique: true,
        sparse: true
    },
    stripeChargeId: String,
    paypalTransactionId: String,

    description: {
        type: String,
        required: true
    },
    receiptUrl: String,
    invoiceUrl: String,

    billingDetails: {
        name: String,
        email: String,
        address: {
            line1: String,
            line2: String,
            city: String,
            state: String,
            postalCode: String,
            country: String,
        }
    },

    paymentMethodDetails: {
        type: {
            type: String,
            enum: ['card', 'bank_transfer', 'paypal']
        },
        card: {
            brand: String,
            last4: String,
            exp_month: Number,
            exp_year: Number
        }
    },

    paidAt: Date,
    failedAt: Date,
    refundedAt: Date,

    refunds: [{
        amount: Number,
        reason: String,
        stripeRefundId: String,
        refundAt: {
            type: Date,
            default: Date.now,
        }
    }],

    disputes: [{
        amount: Number,
        reason: String,
        status: String,
        stripeDisputeId: String,
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],

    metadata: {
        type: Map,
        of: String
    },

    ipAddress: String,
    userAgent: String,

    webhookEvents: [{
        eventType: String,
        eventId: String,
        processedAt: {
            type: Date,
            default: Date.now,
        }
    }]
}, {
    timestamps: true
})

paymentSchema.index({userId:1});
paymentSchema.index({ subscriptionId : 1});
paymentSchema.index({ status: 1});
paymentSchema.index({ stripePaymentIntentId:1});
paymentSchema.index({ createdAt: -1});
paymentSchema.index({ paidAt: -1});

paymentSchema.index({ userId: 1, status: 1, createdAt: -1});


paymentSchema.methods.markAsSucceeded = function (paymentDetails) {
    this.status = 'succeeded';
    this.paidAt = new Date();

    if (paymentDetails.receiptUrl) {
        this.receiptUrl = paymentDetails.receiptUrl;
    }

    if (paymentDetails.stripeChargeId) {
        this.stripeChargeId = paymentDetails.stripeChargeId;
    }
    return this.save();
};

paymentSchema.methods.markAsFailed = function (reason = '') {
    this.status = 'failed';
    this.failedAt = new Date();

    if (reason) {
        this.metadata.set('failureReason', reason);
    }
    return this.save();
};

paymentSchema.methods.processRefund = function (refundAmount, reason = '', stripeRefundId = '') {
    this.refunds.push({
        amount: refundAmount,
        reason: reason,
        stripeRefundId: stripeRefundId
    });

    const totalRefunded = this.refunds.reduce((sum, refund) => sum + refund.amount, 0);
    if (totalRefunded >= this.amount) {
        this.status = 'refunded';
        this.refundedAt = new Date();
    }
    return this.save();
};

paymentSchema.methods.addWebhookEvent = function (eventType, eventId) {
    this.webhookEvents.push({
        eventType: eventType,
        eventId: eventId
    });
    return this.save();
};

paymentSchema.virtual('netAmount').get(function () {
    const totalRefunded = this.refunds.reduce((sum, refund) => sum + refund.amount, 0);
    return this.amount - totalRefunded;
});

paymentSchema.virtual('isRefundable').get(function () {
    return this.status === 'succeeded' &&
        this.paidAt &&
        (new Date() - this.paidAt) < (30 * 24 * 60 * 60 * 1000);
});

paymentSchema.statics.getRevenueStats = async function (startDate, endDate) {
    const pipeline = [
        {
            $match: {
                status: 'succeeded',
                paidAt: {
                    $gte: startDate,
                    $lte: endDate
                }
            }
        },
        {
            $group: {
                _id: null,
                totalRevenue: { $sum: '$amount' },
                totalTransactions: { $sum: 1 },
                avgTransactionValue: { $avg: '$amount' },
                currencies: { $addToSet: '$currency' }
            }
        }
    ];

    const result = await this.aggregate(pipeline);
    return result.length > 0 ? result[0] : {
        totalRevenue: 0,
        totalTransactions: 0,
        avgTransactionValue: 0,
        currencies: []
    };
};

paymentSchema.statics.getMonthlyRevenue = async function (year) {
    const pipeline = [
        {
            $match: {
                status: 'succeeded',
                paidAt: {
                    $gte: new Date(year, 0, 1),
                    $lt: new Date(year + 1, 0, 1)
                }
            }
        },
        {
            $group: {
                _id: { $month: '$paidAt' },
                revenue: { $sum: '$amount' },
                transactions: { $sum: 1 }
            }
        },
        {
            $sort: { '_id': 1 }
        }
    ];
    return this.aggregate(pipeline);
};

module.exports = mongoose.model('Payment', paymentSchema);

