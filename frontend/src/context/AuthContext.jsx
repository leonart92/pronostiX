import { createContext, useContext, useReducer, useEffect } from 'react';
import { authService } from '../services/auth.service';
import { api } from '../services/api'; // 🆕 Ajout pour les appels API directs
import { toast } from 'react-hot-toast';

const AuthContext = createContext();

// Actions pour le reducer
const AUTH_ACTIONS = {
    LOGIN_START: 'LOGIN_START',
    LOGIN_SUCCESS: 'LOGIN_SUCCESS',
    LOGIN_FAILURE: 'LOGIN_FAILURE',
    LOGOUT: 'LOGOUT',
    REGISTER_START: 'REGISTER_START',
    REGISTER_SUCCESS: 'REGISTER_SUCCESS',
    REGISTER_FAILURE: 'REGISTER_FAILURE',
    LOAD_USER: 'LOAD_USER',
    UPDATE_USER: 'UPDATE_USER'
};

// Reducer pour gérer l'état d'authentification
const authReducer = (state, action) => {
    switch (action.type) {
        case AUTH_ACTIONS.LOGIN_START:
        case AUTH_ACTIONS.REGISTER_START:
            return {
                ...state,
                loading: true,
                error: null
            };

        case AUTH_ACTIONS.LOGIN_SUCCESS:
        case AUTH_ACTIONS.REGISTER_SUCCESS:
            return {
                ...state,
                isAuthenticated: true,
                user: action.payload.user,
                token: action.payload.tokens.accessToken,
                loading: false,
                error: null
            };

        case AUTH_ACTIONS.LOGIN_FAILURE:
        case AUTH_ACTIONS.REGISTER_FAILURE:
            return {
                ...state,
                isAuthenticated: false,
                user: null,
                token: null,
                loading: false,
                error: action.payload
            };

        case AUTH_ACTIONS.LOGOUT:
            return {
                ...state,
                isAuthenticated: false,
                user: null,
                token: null,
                loading: false,
                error: null
            };

        case AUTH_ACTIONS.LOAD_USER:
            return {
                ...state,
                user: action.payload,
                isAuthenticated: true,
                loading: false
            };

        case AUTH_ACTIONS.UPDATE_USER:
            return {
                ...state,
                user: { ...state.user, ...action.payload }
            };

        default:
            return state;
    }
};

// État initial
const initialState = {
    isAuthenticated: false,
    user: null,
    token: localStorage.getItem('accessToken'),
    loading: true,
    error: null
};

// Provider
export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    // Vérifier si l'utilisateur est connecté au chargement
    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            loadUser();
        } else {
            dispatch({ type: AUTH_ACTIONS.LOGOUT });
        }
    }, []);

    // Charger les données utilisateur
    const loadUser = async () => {
        try {
            const response = await authService.getProfile();
            dispatch({
                type: AUTH_ACTIONS.LOAD_USER,
                payload: response.data.user
            });
        } catch (error) {
            console.error('Erreur lors du chargement de l\'utilisateur:', error);
            logout();
        }
    };

    // Connexion
    const login = async (email, password) => {
        try {
            dispatch({ type: AUTH_ACTIONS.LOGIN_START });

            const response = await authService.login(email, password);

            // Stocker les tokens
            localStorage.setItem('accessToken', response.data.tokens.accessToken);
            localStorage.setItem('refreshToken', response.data.tokens.refreshToken);

            dispatch({
                type: AUTH_ACTIONS.LOGIN_SUCCESS,
                payload: response.data
            });

            toast.success('Connexion réussie !');
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Erreur de connexion';
            dispatch({
                type: AUTH_ACTIONS.LOGIN_FAILURE,
                payload: errorMessage
            });
            toast.error(errorMessage);
            throw error;
        }
    };

    // Inscription
    const register = async (userData) => {
        try {
            dispatch({ type: AUTH_ACTIONS.REGISTER_START });

            const response = await authService.register(userData);

            // Stocker les tokens
            localStorage.setItem('accessToken', response.data.tokens.accessToken);
            localStorage.setItem('refreshToken', response.data.tokens.refreshToken);

            dispatch({
                type: AUTH_ACTIONS.REGISTER_SUCCESS,
                payload: response.data
            });

            toast.success('Compte créé avec succès !');
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Erreur lors de l\'inscription';
            dispatch({
                type: AUTH_ACTIONS.REGISTER_FAILURE,
                payload: errorMessage
            });
            toast.error(errorMessage);
            throw error;
        }
    };

    // Déconnexion
    const logout = async () => {
        try {
            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken && refreshToken !== 'null') {
                await authService.logout(refreshToken);
            }
        } catch (error) {
            console.error('Erreur lors de la déconnexion:', error);
        } finally {
            // Nettoyer le localStorage
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');

            dispatch({ type: AUTH_ACTIONS.LOGOUT });
            toast.success('Déconnexion réussie');
        }
    };

    // Mettre à jour le profil utilisateur
    const updateUser = (userData) => {
        console.log('🔄 Mise à jour contexte utilisateur:', userData); // 🆕 Log pour debug
        dispatch({
            type: AUTH_ACTIONS.UPDATE_USER,
            payload: userData
        });
    };

    // 🆕 Fonction pour rafraîchir les données utilisateur depuis le serveur
    const refreshUser = async () => {
        try {
            console.log('🔄 Rafraîchissement données utilisateur...');
            const response = await authService.getProfile();

            if (response.data.success) {
                dispatch({
                    type: AUTH_ACTIONS.LOAD_USER,
                    payload: response.data.user
                });
                console.log('✅ Utilisateur rafraîchi:', response.data.user);
                return response.data.user;
            }
        } catch (error) {
            console.error('❌ Erreur refresh user:', error);
            if (error.response?.status === 401) {
                logout();
            }
            throw error;
        }
    };

    // 🆕 Fonction pour vérifier et mettre à jour le statut d'abonnement
    const checkSubscriptionStatus = async () => {
        try {
            console.log('🔍 Vérification statut abonnement...');
            const response = await api.get('/users/subscription-status');

            if (response.data.success) {
                const subscriptionData = response.data.data;
                console.log('✅ Statut abonnement:', subscriptionData);

                // Mettre à jour l'utilisateur avec les nouvelles infos d'abonnement
                const updatedUserData = {
                    subscriptionStatus: subscriptionData.status || 'none'
                };

                updateUser(updatedUserData);
                return subscriptionData;
            }
        } catch (error) {
            console.error('❌ Erreur vérification abonnement:', error);
            throw error;
        }
    };

    // 🆕 Fonction pour synchroniser l'abonnement après paiement Stripe
    const syncSubscriptionFromStripe = async (sessionId) => {
        try {
            console.log('🔄 Synchronisation abonnement Stripe...');
            const response = await api.post('/subscriptions/sync-from-stripe', {
                sessionId: sessionId
            });

            if (response.data.success) {
                console.log('✅ Synchronisation réussie');

                // Mettre à jour l'utilisateur avec les nouvelles données
                const updatedUser = response.data.data.user;
                updateUser(updatedUser);

                toast.success('🎉 Abonnement activé avec succès !');
                return response.data;
            }
        } catch (error) {
            console.error('❌ Erreur synchronisation Stripe:', error);
            toast.error('Erreur lors de la synchronisation de l\'abonnement');
            throw error;
        }
    };

    // Vérifier si l'utilisateur a un abonnement actif
    const hasActiveSubscription = () => {
        return state.user?.subscriptionStatus === 'active';
    };

    // Vérifier si l'utilisateur est admin
    const isAdmin = () => {
        return state.user?.role === 'admin';
    };

    const value = {
        ...state,
        login,
        register,
        logout,
        updateUser,
        refreshUser, // 🆕 Ajout
        checkSubscriptionStatus, // 🆕 Ajout
        syncSubscriptionFromStripe, // 🆕 Ajout
        hasActiveSubscription,
        isAdmin,
        loadUser
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook personnalisé pour utiliser l'AuthContext
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth doit être utilisé dans un AuthProvider');
    }
    return context;
};

export default AuthContext;