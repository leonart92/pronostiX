# 📡 API Endpoints - Pronostics Sportifs

## 🔐 Authentification

### Publiques
```
POST   /api/auth/register          # Inscription
POST   /api/auth/login             # Connexion
POST   /api/auth/refresh           # Rafraîchir token
POST   /api/auth/forgot-password   # Mot de passe oublié
POST   /api/auth/reset-password    # Réinitialiser mot de passe
GET    /api/users/verify-email/:token # Vérifier email
```

### Privées
```
GET    /api/auth/me                # Profil utilisateur connecté
POST   /api/auth/logout            # Déconnexion
POST   /api/auth/logout-all        # Déconnexion tous appareils
```

---

## 👤 Gestion Utilisateurs

### Profil
```
GET    /api/users/profile          # Obtenir profil
PUT    /api/users/profile          # Modifier profil
PUT    /api/users/change-password  # Changer mot de passe
DELETE /api/users/account          # Supprimer compte
```

### Abonnement & Activité
```
GET    /api/users/subscription-status  # Statut abonnement détaillé
GET    /api/users/activity             # Activité récente
GET    /api/users/stats                # Statistiques (abonnés uniquement)
POST   /api/users/verify-email         # Renvoyer email de vérification
```

---

## 🏆 Pronostics

### Consultation
```
GET    /api/pronostics             # Liste avec pagination et filtres
GET    /api/pronostics/:id         # Détail d'un pronostic
GET    /api/pronostics/stats/global # Statistiques globales
GET    /api/pronostics/upcoming/today # Pronostics du jour
```

**Paramètres de requête disponibles pour GET /api/pronostics :**
- `page` : Numéro de page (défaut: 1)
- `limit` : Éléments par page (défaut: 10, max: 50)
- `sport` : football, tennis, basketball, handball, volleyball, other
- `status` : pending, won, lost, void, push
- `priority` : low, medium, high
- `league` : Nom de la ligue (recherche partielle)
- `upcoming` : true (matches à venir uniquement)
- `dateFrom` / `dateTo` : Filtres de date
- `sort` : date_asc, date_desc, odds_asc, odds_desc

### Gestion (Admin uniquement)
```
POST   /api/pronostics             # Créer pronostic
PUT    /api/pronostics/:id         # Modifier pronostic
DELETE /api/pronostics/:id         # Supprimer pronostic
POST   /api/pronostics/:id/publish # Publier
POST   /api/pronostics/:id/unpublish # Dépublier
POST   /api/pronostics/:id/result  # Mettre à jour résultat
```

---

## 💳 Abonnements & Paiements

### Plans et Abonnements
```
GET    /api/subscriptions/plans    # Plans disponibles
GET    /api/subscriptions/current  # Abonnement actuel
POST   /api/subscriptions/create-checkout # Créer session Stripe
GET    /api/subscriptions/session/:sessionId # Statut session
```

### Gestion Abonnement
```
POST   /api/subscriptions/cancel   # Annuler (fin de période)
POST   /api/subscriptions/reactivate # Réactiver
GET    /api/subscriptions/invoices # Historique factures
```

### Webhooks
```
POST   /api/subscriptions/webhook  # Webhook Stripe (signature requise)
```

**Événements Stripe gérés :**
- `checkout.session.completed`
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `payment_intent.succeeded`
- `payment_intent.payment_failed`
- `invoice.payment_succeeded`
- `invoice.payment_failed`

---

## 🛡️ Administration

### Dashboard
```
GET    /api/admin/dashboard        # Statistiques générales
GET    /api/admin/analytics/revenue # Évolution revenus
```

### Gestion Utilisateurs
```
GET    /api/admin/users            # Liste utilisateurs
GET    /api/admin/users/:id        # Détails utilisateur
PUT    /api/admin/users/:id        # Modifier utilisateur
DELETE /api/admin/users/:id        # Supprimer utilisateur
```

### Gestion Pronostics
```
GET    /api/admin/pronostics       # Tous les pronostics
```

### Gestion Abonnements
```
GET    /api/admin/subscriptions    # Tous les abonnements
POST   /api/admin/subscriptions/:id/cancel # Annuler (admin)
```

### Gestion Paiements
```
GET    /api/admin/payments         # Historique paiements
```

### Système
```
GET    /api/admin/logs/security    # Logs de sécurité
POST   /api/admin/system/maintenance # Mode maintenance
```

---

## 🔒 Niveaux d'autorisation

### 🌐 Public
- Consultation des pronostics gratuits
- Authentification
- Plans d'abonnement

### 🔓 Utilisateur connecté
- Gestion du profil
- Consultation de l'historique
- Accès aux pronostics selon abonnement

### 💎 Abonné actif
- Accès à tous les pronostics
- Statistiques personnalisées
- Historique complet

### 👑 Administrateur
- Gestion complète des pronostics
- Panel d'administration
- Gestion des utilisateurs et abonnements

---

## 📊 Codes de statut HTTP

### Succès
- `200` : Succès
- `201` : Ressource créée

### Erreurs Client
- `400` : Requête invalide / Erreur de validation
- `401` : Non authentifié
- `403` : Accès refusé / Abonnement requis
- `404` : Ressource non trouvée
- `409` : Conflit (email/username existant)

### Erreurs Serveur
- `500` : Erreur interne du serveur

---

## 🎯 Exemples d'usage

### Inscription et connexion
```javascript
// Inscription
POST /api/auth/register
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "Password123"
}

// Connexion
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "Password123"
}
```

### Créer un abonnement
```javascript
// 1. Créer session checkout
POST /api/subscriptions/create-checkout
{
  "plan": "monthly",
  "successUrl": "https://monsite.com/success",
  "cancelUrl": "https://monsite.com/cancel"
}

// 2. Rediriger vers session.url retournée
// 3. Stripe gère le paiement
// 4. Webhook met à jour l'abonnement automatiquement
```

### Consulter les pronostics
```javascript
// Pronostics du jour pour les abonnés
GET /api/pronostics?upcoming=true&sport=football

// Avec authentification Bearer token
Headers: {
  "Authorization": "Bearer your_jwt_token"
}
```

### Créer un pronostic (Admin)
```javascript
POST /api/pronostics
{
  "sport": "football",
  "league": "Ligue 1",
  "homeTeam": "PSG",
  "awayTeam": "OM",
  "matchDate": "2024-02-15T20:00:00Z",
  "prediction": "1",
  "predictionType": "1X2",
  "odds": 1.85,
  "stake": 7,
  "confidence": 4,
  "analysis": "Analyse détaillée du match...",
  "isFree": false
}
```

---

## 🔧 Configuration requise

### Variables d'environnement
```env
MONGODB_URI=mongodb://localhost:27017/pronostics-app
JWT_SECRET=votre_secret_jwt
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
FRONTEND_URL=http://localhost:3000
```

### Headers requis
```
Content-Type: application/json
Authorization: Bearer <token> (pour les routes privées)
```

---

## 🚀 Intégration Frontend

### Gestion des tokens
```javascript
// Stocker les tokens après connexion
localStorage.setItem('accessToken', response.data.tokens.accessToken);
localStorage.setItem('refreshToken', response.data.tokens.refreshToken);

// Intercepteur pour rafraîchir automatiquement
axios.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401 && error.response?.data?.code === 'TOKEN_EXPIRED') {
      // Rafraîchir le token automatiquement
    }
  }
);
```

### Gestion des abonnements
```javascript
// Vérifier le statut d'abonnement
const checkSubscription = async () => {
  const response = await api.get('/users/subscription-status');
  return response.data.hasActiveSubscription;
};

// Créer un checkout Stripe
const createCheckout = async (plan) => {
  const response = await api.post('/subscriptions/create-checkout', {
    plan,
    successUrl: window.location.origin + '/success',
    cancelUrl: window.location.origin + '/pricing'
  });
  
  // Rediriger vers Stripe Checkout
  window.location.href = response.data.checkoutUrl;
};
```

Cette documentation couvre l'ensemble des endpoints disponibles pour votre plateforme de pronostics sportifs ! 🏆