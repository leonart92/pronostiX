// src/App.jsx - Version avec vérification email + Reset Password
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// Components
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/Auth/ForgotPassword';  // ← NOUVELLE PAGE
import ResetPassword from './pages/Auth/ResetPassword';    // ← NOUVELLE PAGE
import Pricing from './pages/Pricing';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import PronosticsList from './pages/Pronostics/PronosticsList';
import PronosticDetail from './pages/Pronostics/PronosticDetail';
import Checkout from "./pages/Checkout";
import Success from "./pages/SuccessCancel";
import { Cancel } from "./pages/SuccessCancel";
import About from "./pages/About";
import EmailVerification from "./pages/EmailVerification";
import Contact from "./pages/Contact";
import HelpCenter from "./pages/HelpCenter";
import MentionsLegales from './pages/Legal/MentionsLegales';
import PrivacyPolicy from './pages/Legal/PrivacyPolicy';
import TermsOfService from './pages/Legal/TermsOfService';
import SimulationPage from "./pages/Simulation";

// Admin Pages
import AdminPanel from './pages/Admin/AdminPanel';

// Styles
import './styles/global.css';

import { Analytics } from "@vercel/analytics/react"

// ✅ Composant pour redirection intelligente de la racine
const RootRedirect = () => {
    // Cette logique sera gérée par le useAuth dans le Route
    return null;
};

// Pages d'erreur avec dark mode
const NotFound = () => (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900">
        <div className="text-center">
            <div className="text-6xl font-bold text-gray-300 dark:text-slate-600 mb-4">404</div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-2">Page non trouvée</h1>
            <p className="text-gray-600 dark:text-slate-300 mb-6">
                La page que vous recherchez n'existe pas ou a été déplacée.
            </p>
            <div className="space-x-4">
                <a href="/home" className="btn btn-primary">
                    Retour à l'accueil
                </a>
                <button onClick={() => window.history.back()} className="btn btn-outline">
                    Page précédente
                </button>
            </div>
        </div>
    </div>
);

const Forbidden = () => (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900">
        <div className="text-center">
            <div className="text-6xl mb-4">🚫</div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-2">Accès refusé</h1>
            <p className="text-gray-600 dark:text-slate-300 mb-6">
                Vous n'avez pas les permissions nécessaires pour accéder à cette page.
            </p>
            <div className="space-x-4">
                <a href="/home" className="btn btn-primary">
                    Retour à l'accueil
                </a>
                <a href="/pricing" className="btn btn-outline">
                    Voir les abonnements
                </a>
            </div>
        </div>
    </div>
);

// ✅ Composant qui gère la redirection intelligente selon l'auth
const SmartRedirect = () => {
    return (
        <ProtectedRoute
            redirectTo="/home" // Si pas connecté, va vers home
        >
            <Navigate to="/dashboard" replace /> {/* Si connecté, va vers dashboard */}
        </ProtectedRoute>
    );
};

function App() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <Router>
                    <div className="min-h-screen bg-white dark:bg-slate-900 transition-colors duration-300">
                        <Routes>
                            {/* Routes Admin - Layout spécial sans navbar/footer */}
                            <Route path="/admin/*" element={
                                <ProtectedRoute requireAdmin>
                                    <AdminPanel />
                                </ProtectedRoute>
                            } />

                            {/* Routes avec layout normal (navbar + footer) */}
                            <Route path="/*" element={
                                <>
                                    <Navbar />
                                    <main className="transition-colors duration-300">
                                        <Routes>
                                            {/* ✅ Route racine avec redirection intelligente */}
                                            <Route path="/" element={<SmartRedirect />} />

                                            {/* ✅ Routes publiques explicites */}
                                            <Route path="/home" element={<Home />} />
                                            <Route path="/login" element={<Login />} />
                                            <Route path="/register" element={<Register />} />

                                            {/* 🆕 NOUVELLES ROUTES : Reset Password */}
                                            <Route path="/forgot-password" element={<ForgotPassword />} />
                                            <Route path="/reset-password/:token" element={<ResetPassword />} />

                                            <Route path="/pricing" element={<Pricing />} />
                                            <Route path="/about" element={<About />} />
                                            <Route path="/contact" element={<Contact />} />
                                            <Route path="/help-center" element={<HelpCenter />} />
                                            <Route path="/mentions-legales" element={<MentionsLegales />} />
                                            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                                            <Route path="/terms-of-service" element={<TermsOfService />} />
                                            <Route path="/cgu" element={<TermsOfService />} />
                                            <Route path="/simulation" element={<SimulationPage />} />

                                            {/* ✅ Route vérification d'email existante */}
                                            <Route path="/verify-email/:token" element={<EmailVerification />} />

                                            {/* Routes des pronostics (accessibles avec restrictions) */}
                                            <Route path="/pronostics" element={<PronosticsList />} />
                                            <Route path="/pronostics/:id" element={<PronosticDetail />} />

                                            {/* ✅ Routes protégées - nécessitent une connexion */}
                                            <Route path="/dashboard" element={
                                                <ProtectedRoute>
                                                    <Dashboard />
                                                </ProtectedRoute>
                                            } />

                                            <Route path="/profile" element={
                                                <ProtectedRoute>
                                                    <Profile />
                                                </ProtectedRoute>
                                            } />

                                            <Route path="/checkout" element={
                                                <ProtectedRoute>
                                                    <Checkout />
                                                </ProtectedRoute>
                                            } />
                                            <Route path="/success" element={<Success />} />
                                            <Route path="/cancel" element={<Cancel />} />

                                            {/* Routes avec abonnement requis - pour plus tard */}
                                            {/*
                                            <Route path="/pronostics-premium" element={
                                                <ProtectedRoute requireSubscription>
                                                    <PremiumPronostics />
                                                </ProtectedRoute>
                                            } />
                                            */}

                                            {/* Pages d'erreur */}
                                            <Route path="/403" element={<Forbidden />} />
                                            <Route path="*" element={<NotFound />} />
                                        </Routes>
                                    </main>
                                    <Footer />
                                </>
                            } />
                        </Routes>

                        {/* Toast notifications avec dark mode */}
                        <Toaster
                            position="top-right"
                            toastOptions={{
                                duration: 4000,
                                className: 'toast-custom',
                                style: {
                                    background: 'var(--bg-secondary)',
                                    color: 'var(--text-primary)',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: '0.5rem',
                                    boxShadow: 'var(--shadow)',
                                },
                                success: {
                                    style: {
                                        background: '#10b981',
                                        color: 'white',
                                        border: 'none',
                                    },
                                    iconTheme: {
                                        primary: 'white',
                                        secondary: '#10b981',
                                    },
                                },
                                error: {
                                    style: {
                                        background: '#ef4444',
                                        color: 'white',
                                        border: 'none',
                                    },
                                    iconTheme: {
                                        primary: 'white',
                                        secondary: '#ef4444',
                                    },
                                },
                                loading: {
                                    style: {
                                        background: '#3b82f6',
                                        color: 'white',
                                        border: 'none',
                                    },
                                },
                            }}
                        />
                    </div>
                </Router>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;