// backend/models/User.js - VERSION MISE À JOUR
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        trim: true,
        minlength: [3, 'Username must be at least 3 characters'],
        maxlength: [25, 'Username must be at most 25 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters'],
        select: false
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    subscriptionStatus: {
        type: String,
        enum: ['none', 'active', 'expired', 'cancelled'],
        default: 'none'
    },
    subscriptionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subscription',
        default: null
    },
    // 🆕 AJOUT DU CHAMP STRIPE CUSTOMER ID
    stripeCustomerId: {
        type: String,
        default: null,
        sparse: true // Permet d'avoir des valeurs null sans conflit d'unicité
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    emailVerificationToken: String,
    passwordResetToken: String,
    passwordResetExpires: Date,
    lastLogin: Date,
    refreshTokens: [{
        token: String,
        createdAt: {
            type: Date,
            default: Date.now,
        }
    }]
}, {
    timestamps: true
});

// Indices
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });
userSchema.index({ subscriptionStatus: 1 });
userSchema.index({ stripeCustomerId: 1 }); // 🆕 Index pour Stripe Customer ID

// Hash du mot de passe avant sauvegarde
userSchema.pre('save', async function(next) {
    if (!this.isModified('password'))
        return next();

    try {
        const salt = await bcrypt.genSalt(12);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Méthode pour comparer les mots de passe
userSchema.methods.comparePassword = async function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

// Méthode pour vérifier l'abonnement actif
userSchema.methods.hasActiveSubscription = function() {
    return this.subscriptionStatus === 'active';
};

// Méthode pour vérifier si l'utilisateur est admin
userSchema.methods.isAdmin = function() {
    return this.role === 'admin';
};

// 🆕 Méthode pour obtenir les détails d'abonnement
userSchema.methods.getSubscriptionDetails = function() {
    return {
        status: this.subscriptionStatus,
        isActive: this.hasActiveSubscription(),
        subscriptionId: this.subscriptionId,
        stripeCustomerId: this.stripeCustomerId
    };
};

// Méthode toJSON pour masquer les champs sensibles
userSchema.methods.toJSON = function() {
    const user = this.toObject();
    delete user.password;
    delete user.refreshTokens;
    delete user.emailVerificationToken;
    delete user.passwordResetToken;
    delete user.passwordResetExpires;
    // Ne pas exposer le Stripe Customer ID dans toJSON pour la sécurité
    delete user.stripeCustomerId;
    return user;
};

// Propriété virtuelle pour le profil public
userSchema.virtual('profile').get(function() {
    return {
        id: this._id,
        username: this.username,
        email: this.email,
        role: this.role,
        subscriptionStatus: this.subscriptionStatus,
        isEmailVerified: this.isEmailVerified,
        createdAt: this.createdAt,
        lastLogin: this.lastLogin,
        hasActiveSubscription: this.hasActiveSubscription()
    };
});

module.exports = mongoose.model('User', userSchema);