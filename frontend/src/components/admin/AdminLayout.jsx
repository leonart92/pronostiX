// src/components/admin/AdminLayout.jsx
import React, { useState } from 'react';
import AdminSidebar from './AdminSidebar';
import AdminDashboard from './AdminDashboard';
import PronosticManagement from './PronosticManagement';
import UserManagement from './UserManagement';
import SubscriptionManagement from './SubscriptionManagement';
import PaymentHistory from './PaymentHistory';

const AdminLayout = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return <AdminDashboard />;
            case 'pronostics':
                return <PronosticManagement />;
            case 'users':
                return <UserManagement />;
            case 'subscriptions':
                return <SubscriptionManagement />;
            case 'payments':
                return <PaymentHistory />;
            default:
                return <AdminDashboard />;
        }
    };

    const getPageTitle = () => {
        const titles = {
            dashboard: 'Dashboard',
            pronostics: 'Gestion des Pronostics',
            users: 'Gestion des Utilisateurs',
            subscriptions: 'Gestion des Abonnements',
            payments: 'Historique des Paiements'
        };
        return titles[activeTab] || 'Dashboard';
    };

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <AdminSidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                isMobileOpen={isMobileMenuOpen}
                setIsMobileOpen={setIsMobileMenuOpen}
            />

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
                {/* Top Navigation Bar */}
                <header className="bg-white border-b border-gray-200 px-4 py-4 lg:px-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            {/* Mobile menu button */}
                            <button
                                className="lg:hidden mr-4 p-2 rounded-md hover:bg-gray-100"
                                onClick={() => setIsMobileMenuOpen(true)}
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>

                            <h1 className="text-2xl font-bold text-gray-900">
                                {getPageTitle()}
                            </h1>
                        </div>

                        {/* Quick Actions */}
                        <div className="flex items-center space-x-4">
                            {/* Notifications */}
                            <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-5-5-5 5h5V7a3 3 0 116 0v10z" />
                                </svg>
                            </button>

                            {/* Settings */}
                            <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto">
                    <div className="p-4 lg:p-8">
                        {renderContent()}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;