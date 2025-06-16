import axios from 'axios';
import { toast} from "react-hot-toast";

// ✅ Utiliser la même variable que dans .env
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Créer l'instance axios
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Intercepteur pour ajouter le token à chaque requête
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Intercepteur pour gérer les réponses et erreurs
api.interceptors.response.use(
    (response) => {
        console.log('✅ INTERCEPTOR - Réponse OK:', response.status);
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        console.log('❌ INTERCEPTOR - Erreur:', error.response?.status, 'Retry?', originalRequest._retry);


        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            console.log('🔄 INTERCEPTOR - Tentative refresh token...');


            try {
                const refreshToken = localStorage.getItem('refreshToken');
                console.log('🔍 INTERCEPTOR - RefreshToken exists:', !!refreshToken);

                if (refreshToken) {
                    const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
                        refreshToken
                    });

                    const newToken = response.data.data.accessToken;
                    console.log('✅ INTERCEPTOR - Nouveau token obtenu');

                    localStorage.setItem('accessToken', newToken);

                    originalRequest.headers.Authorization = `Bearer ${newToken}`;
                    console.log('🔄 INTERCEPTOR - Retry de la requête originale...');

                    return api(originalRequest);
                }
            } catch (refreshError) {
                console.log('❌ INTERCEPTOR - Échec refresh:', refreshError.message);

                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                window.location.href = '/login';

                return Promise.reject(refreshError);
            }
        }
        console.log('❌ INTERCEPTOR - Erreur finale:', error.response?.data);

        handleApiError(error);
        return Promise.reject(error);
    }
);


const handleApiError = (error) => {
    if (!error.response) {
        toast.error('Erreur de connexion au serveur');
        return;
    }

    const { status, data } = error.response;

    switch (status) {
        case 400:
            toast.error(data.message || 'Données invalides');
            break;
        case 401:
            if (data.code === 'TOKEN_EXPIRED') {
                return;
            }
            toast.error(data.message || 'Non autorisé');
            break;
        case 403:
            if (data.code === 'SUBSCRIPTION_REQUIRED') {
                toast.error('Abonnement requis pour accéder à ce contenu');
            } else {
                toast.error(data.message || 'Accès interdit');
            }
            break;
        case 404:
            toast.error(data.message || 'Ressource introuvable');
            break;
        case 500:
            toast.error(data.message || 'Une erreur est survenue');
    }
};

// Fonction utilitaire pour les requêtes avec gestion d'erreur
export const apiRequest = async (requestFn, options = {}) => {
    const { showSuccessToast = false, successMessage = 'Opération réussie' } = options;

    try {
        const response = await requestFn();
        if (showSuccessToast) {
            toast.success(successMessage);
        }
        return response;
    } catch (error) {
        throw error;
    }
};


export { api };