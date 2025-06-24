const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({ // ✅ CORRIGÉ
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    plan: {
        type: String,
        enum: ['monthly', 'quarterly', 'annually'],
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'expired', 'cancelled', 'past_due', 'trialing'],
        default: 'active'
    },
    startDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    endDate: {
        type: Date,
        required: true
    },
    currentPeriodStart: Date,
    currentPeriodEnd: Date,
    cancelAtPeriodEnd: {
        type: Boolean,
        default: false
    },
    cancelledAt: Date,
    trialStart: Date,
    trialEnd: Date,

    stripeSubscriptionId: {
        type: String,
        unique: true,
        sparse: true
    },
    stripePriceId: String,
    stripeCustomerId: String,

    paymentMethod: { // ✅ CORRIGÉ
        type: String,
        enum: ['stripe', 'paypal'],
        default: 'stripe'
    },
    amount: {
        type: Number,
        default: 0 // ✅ CORRIGÉ - était 'EUR'
    },
    currency: {
        type: String,
        default: 'EUR'
    },

    paymentHistory: [{
        amount: Number,
        currency: String,
        status: String,
        stripePaymentIntentId: String,
        paidAt: Date,
        createdAt: {
            type: Date,
            default: Date.now,
        }
    }],

    metadata: {
        type: Map,
        of: String
    }
}, {
    timestamps: true
});

subscriptionSchema.index({ userId: 1 }); // ✅ CORRIGÉ
subscriptionSchema.index({ status: 1 });
subscriptionSchema.index({ stripeSubscriptionId: 1 });
subscriptionSchema.index({ endDate: 1 });

subscriptionSchema.methods.isActive = function () {
    return this.status === 'active' && this.endDate > Date.now();
};

subscriptionSchema.methods.isTrialing = function () {
    return this.status === 'trialing' &&
        this.trialEnd &&
        this.trialEnd > new Date();
};

subscriptionSchema.methods.getDaysRemaining = function () {
    const now = new Date();
    const endDate = new Date(this.endDate);
    const diffTime = endDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
};

subscriptionSchema.methods.getNextBillingDate = function () {
    if (this.cancelAtPeriodEnd) {
        return null;
    }
    return this.currentPeriodEnd || this.endDate;
};

subscriptionSchema.statics.getAvailablePlans = function () {
    return {
        monthly: {
            name: 'Mensuel',
            price: 9.99,
            duration: 30,
            stripePriceId: process.env.STRIPE_MONTHLY_PRICE_ID
        },
        quarterly: {
            name: 'Trimestriel',
            price: 24.88,
            duration: 90,
            stripePriceId: process.env.STRIPE_QUARTERLY_PRICE_ID,
            savings: '17%'
        },
        annually: {
            name: 'Annuel',
            price: 89.91,
            duration: 365,
            stripePriceId: process.env.STRIPE_ANNUAL_PRICE_ID,
            savings: '25%'
        }
    };
};

subscriptionSchema.pre('save', function (next) {
    if (this.isNew || this.isModified('startDate') || this.isModified('plan')) {
        const plans = this.constructor.getAvailablePlans(); // ✅ CORRIGÉ
        const planDuration = plans[this.plan].duration;

        this.endDate = new Date(this.startDate);
        this.endDate.setDate(this.endDate.getDate() + planDuration);

        this.currentPeriodStart = this.startDate;
        this.currentPeriodEnd = this.endDate;
    }
    next();
});

subscriptionSchema.virtual('planDetails').get(function () {
    return this.constructor.getAvailablePlans()[this.plan]; // ✅ CORRIGÉ
});

module.exports = mongoose.model('Subscription', subscriptionSchema);