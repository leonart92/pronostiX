// src/components/admin/PronosticManagement.jsx avec système d'étoiles
import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../hooks/useAdmin';
import ConfirmDialog from './ConfirmDialog';
import PronosticForm from './PronosticForm';
import { StakeStarsBadge, StakeProfitDisplay } from '../common/StakeStars';

const PronosticManagement = () => {
    const [pronostics, setPronostics] = useState([]);
    const [filteredPronostics, setFilteredPronostics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingPronostic, setEditingPronostic] = useState(null);
    const [deleteDialog, setDeleteDialog] = useState({ open: false, pronostic: null });

    // Modal pour les résultats
    const [resultModal, setResultModal] = useState({
        open: false,
        pronostic: null,
        result: '',
        actualResult: ''
    });

    const [filters, setFilters] = useState({
        sport: '',
        status: '',
        search: ''
    });

    // Récupérer toutes les fonctions du hook useAdmin
    const admin = useAdmin();

    const {
        getAllPronostics,
        createPronostic,
        updatePronostic,
        deletePronostic,
        publishPronostic,
        unpublishPronostic,
        updatePronosticResult
    } = admin;

    // Charger les pronostics
    const loadPronostics = async () => {
        try {
            setLoading(true);

            if (typeof getAllPronostics !== 'function') {
                console.error('getAllPronostics n\'est pas une fonction');
                return;
            }

            const response = await getAllPronostics();
            console.log('Response loadPronostics:', response);

            const pronosticsData = response?.data?.pronostics || response?.pronostics || [];
            setPronostics(pronosticsData);
            setFilteredPronostics(pronosticsData);

        } catch (error) {
            console.error('Erreur lors du chargement:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPronostics();
    }, []);

    // Filtrer les pronostics
    useEffect(() => {
        let filtered = pronostics;

        if (filters.sport) {
            filtered = filtered.filter(p => p.sport === filters.sport);
        }

        if (filters.status) {
            filtered = filtered.filter(p => p.result === filters.status);
        }

        if (filters.search) {
            filtered = filtered.filter(p => {
                const search = filters.search.toLowerCase();
                return (
                    p.homeTeam?.toLowerCase().includes(search) ||
                    p.awayTeam?.toLowerCase().includes(search) ||
                    p.league?.toLowerCase().includes(search) ||
                    p.prediction?.toLowerCase().includes(search)
                );
            });
        }

        setFilteredPronostics(filtered);
    }, [filters, pronostics]);

    // Handlers existants
    const handleCreate = () => {
        setEditingPronostic(null);
        setShowForm(true);
    };

    const handleEdit = (pronostic) => {
        setEditingPronostic(pronostic);
        setShowForm(true);
    };

    const handleSave = async (pronosticData) => {
        try {
            console.log('handleSave - données:', pronosticData);
            console.log('editingPronostic:', editingPronostic);

            if (editingPronostic) {
                if (typeof updatePronostic !== 'function') {
                    throw new Error('updatePronostic n\'est pas disponible');
                }
                console.log('Appel updatePronostic...');
                await updatePronostic(editingPronostic._id, pronosticData);
            } else {
                if (typeof createPronostic !== 'function') {
                    throw new Error('createPronostic n\'est pas disponible');
                }
                console.log('Appel createPronostic...');
                await createPronostic(pronosticData);
            }

            setShowForm(false);
            setEditingPronostic(null);
            loadPronostics();

        } catch (error) {
            console.error('Erreur dans handleSave:', error);
            alert(`Erreur: ${error.message}`);
        }
    };

    const handleDelete = async () => {
        try {
            if (typeof deletePronostic !== 'function') {
                throw new Error('deletePronostic n\'est pas disponible');
            }

            await deletePronostic(deleteDialog.pronostic._id);
            setDeleteDialog({ open: false, pronostic: null });
            loadPronostics();
        } catch (error) {
            console.error('Erreur lors de la suppression:', error);
            alert(`Erreur: ${error.message}`);
        }
    };

    const handlePublish = async (pronostic) => {
        try {
            if (pronostic.isVisible) {
                if (typeof unpublishPronostic !== 'function') {
                    throw new Error('unpublishPronostic n\'est pas disponible');
                }
                await unpublishPronostic(pronostic._id);
            } else {
                if (typeof publishPronostic !== 'function') {
                    throw new Error('publishPronostic n\'est pas disponible');
                }
                await publishPronostic(pronostic._id);
            }
            loadPronostics();
        } catch (error) {
            console.error('Erreur lors de la publication:', error);
            alert(`Erreur: ${error.message}`);
        }
    };

    // Handlers pour les résultats
    const handleOpenResultModal = (pronostic) => {
        setResultModal({
            open: true,
            pronostic: pronostic,
            result: pronostic.result === 'pending' ? '' : pronostic.result,
            actualResult: pronostic.actualResult || ''
        });
    };

    const handleCloseResultModal = () => {
        setResultModal({
            open: false,
            pronostic: null,
            result: '',
            actualResult: ''
        });
    };

    const handleUpdateResult = async () => {
        try {
            if (!resultModal.result) {
                alert('Veuillez sélectionner un résultat');
                return;
            }

            if (typeof updatePronosticResult !== 'function') {
                throw new Error('updatePronosticResult n\'est pas disponible');
            }

            await updatePronosticResult(resultModal.pronostic._id, {
                result: resultModal.result,
                actualResult: resultModal.actualResult
            });

            handleCloseResultModal();
            loadPronostics();
        } catch (error) {
            console.error('Erreur lors de la mise à jour du résultat:', error);
            alert(`Erreur: ${error.message}`);
        }
    };

    const getStatusBadge = (result) => {
        const classes = {
            pending: 'bg-yellow-100 text-yellow-800',
            won: 'bg-green-100 text-green-800',
            lost: 'bg-red-100 text-red-800',
            void: 'bg-gray-100 text-gray-800',
            push: 'bg-blue-100 text-blue-800'
        };

        const labels = {
            pending: 'En cours',
            won: 'Gagné',
            lost: 'Perdu',
            void: 'Annulé',
            push: 'Nul'
        };

        return (
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${classes[result] || classes.pending}`}>
                {labels[result] || result}
            </span>
        );
    };

    const getPriorityBadge = (priority) => {
        const classes = {
            low: 'bg-green-100 text-green-800',
            medium: 'bg-yellow-100 text-yellow-800',
            high: 'bg-red-100 text-red-800'
        };

        const labels = {
            low: '🟢 Faible',
            medium: '🟡 Moyenne',
            high: '🔴 Élevée'
        };

        return (
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${classes[priority] || classes.medium}`}>
                {labels[priority] || priority}
            </span>
        );
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Gestion des Pronostics</h2>
                    <p className="text-gray-600">Gérer tous les pronostics de la plateforme</p>
                </div>
                <button
                    onClick={handleCreate}
                    className="mt-4 sm:mt-0 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 flex items-center transition-colors"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Nouveau Pronostic
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Sport</label>
                        <select
                            value={filters.sport}
                            onChange={(e) => setFilters(prev => ({ ...prev, sport: e.target.value }))}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                        >
                            <option value="">Tous les sports</option>
                            <option value="football">Football</option>
                            <option value="tennis">Tennis</option>
                            <option value="basketball">Basketball</option>
                            <option value="handball">Handball</option>
                            <option value="volleyball">Volleyball</option>
                            <option value="other">Autre</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                        <select
                            value={filters.status}
                            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                        >
                            <option value="">Tous les statuts</option>
                            <option value="pending">En cours</option>
                            <option value="won">Gagné</option>
                            <option value="lost">Perdu</option>
                            <option value="void">Annulé</option>
                            <option value="push">Nul</option>
                        </select>
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Recherche</label>
                        <input
                            type="text"
                            placeholder="Rechercher par équipe, ligue ou pronostic..."
                            value={filters.search}
                            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                        />
                    </div>
                </div>
            </div>

            {/* Pronostics Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Match
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Pronostic
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Cote / Mise
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Priorité
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Statut
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Visibilité
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {filteredPronostics.map((pronostic) => (
                            <tr key={pronostic._id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div>
                                        <div className="text-sm font-medium text-gray-900">
                                            {pronostic.homeTeam} vs {pronostic.awayTeam}
                                        </div>
                                        <div className="text-xs text-gray-500 capitalize">
                                            {pronostic.sport} • {pronostic.league}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {new Date(pronostic.matchDate).toLocaleDateString('fr-FR', {
                                                day: '2-digit',
                                                month: '2-digit',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="max-w-xs">
                                        <div className="text-sm font-medium text-gray-900 truncate">
                                            {pronostic.prediction}
                                        </div>
                                        <div className="text-xs text-gray-500 capitalize">
                                            {pronostic.predictionType?.replace('_', ' ')}
                                        </div>
                                        {pronostic.confidence && (
                                            <div className="text-xs text-blue-600">
                                                Confiance: {pronostic.confidence}%
                                            </div>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="space-y-2">
                                        <div className="text-sm font-medium text-gray-900">
                                            Cote: {pronostic.odds}
                                        </div>
                                        {/* ⭐ NOUVEAU AFFICHAGE AVEC ÉTOILES */}
                                        <div>
                                            <StakeStarsBadge stake={pronostic.stake} />
                                        </div>
                                        {/* Profit/Perte avec étoiles */}
                                        <StakeProfitDisplay
                                            stake={pronostic.stake}
                                            odds={pronostic.odds}
                                            result={pronostic.result}
                                        />
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {getPriorityBadge(pronostic.priority)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {getStatusBadge(pronostic.result)}
                                    {pronostic.actualResult && (
                                        <div className="text-xs text-gray-500 mt-1">
                                            {pronostic.actualResult}
                                        </div>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex flex-col space-y-1">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                            pronostic.isVisible
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-gray-100 text-gray-800'
                                        }`}>
                                            {pronostic.isVisible ? 'Publié' : 'Brouillon'}
                                        </span>
                                        {pronostic.isFree && (
                                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                                                Gratuit
                                            </span>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() => handleEdit(pronostic)}
                                            className="text-primary-600 hover:text-primary-900 transition-colors"
                                            title="Modifier"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </button>

                                        <button
                                            onClick={() => handlePublish(pronostic)}
                                            className={`transition-colors ${
                                                pronostic.isVisible
                                                    ? 'text-gray-600 hover:text-gray-900'
                                                    : 'text-green-600 hover:text-green-900'
                                            }`}
                                            title={pronostic.isVisible ? 'Dépublier' : 'Publier'}
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        </button>

                                        <button
                                            onClick={() => handleOpenResultModal(pronostic)}
                                            className="text-blue-600 hover:text-blue-900 transition-colors"
                                            title="Mettre à jour le résultat"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </button>

                                        <button
                                            onClick={() => setDeleteDialog({ open: true, pronostic })}
                                            className="text-red-600 hover:text-red-900 transition-colors"
                                            title="Supprimer"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                {filteredPronostics.length === 0 && (
                    <div className="text-center py-12">
                        <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p className="text-gray-500">Aucun pronostic trouvé</p>
                    </div>
                )}
            </div>

            {/* Form Modal */}
            {showForm && (
                <PronosticForm
                    pronostic={editingPronostic}
                    onSave={handleSave}
                    onCancel={() => {
                        setShowForm(false);
                        setEditingPronostic(null);
                    }}
                />
            )}

            {/* Modal Résultat */}
            {resultModal.open && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={handleCloseResultModal}></div>

                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                                        Mettre à jour le résultat
                                    </h3>
                                    <button
                                        type="button"
                                        onClick={handleCloseResultModal}
                                        className="text-gray-400 hover:text-gray-600"
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <h4 className="font-medium text-gray-900 mb-2">
                                            {resultModal.pronostic?.homeTeam} vs {resultModal.pronostic?.awayTeam}
                                        </h4>
                                        <p className="text-sm text-gray-600">
                                            Pronostic: {resultModal.pronostic?.prediction}
                                        </p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Résultat du pronostic <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            value={resultModal.result}
                                            onChange={(e) => setResultModal(prev => ({ ...prev, result: e.target.value }))}
                                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            required
                                        >
                                            <option value="">Sélectionnez un résultat</option>
                                            <option value="won">✅ Gagné</option>
                                            <option value="lost">❌ Perdu</option>
                                            <option value="push">🔄 Nul / Remboursé</option>
                                            <option value="void">⚪ Annulé</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Résultat réel du match (optionnel)
                                        </label>
                                        <input
                                            type="text"
                                            value={resultModal.actualResult}
                                            onChange={(e) => setResultModal(prev => ({ ...prev, actualResult: e.target.value }))}
                                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            placeholder="Ex: 2-1, Federer gagne en 3 sets..."
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            Score final, détails du match, etc.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button
                                    type="button"
                                    onClick={handleUpdateResult}
                                    disabled={!resultModal.result}
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Mettre à jour
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCloseResultModal}
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                >
                                    Annuler
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation */}
            <ConfirmDialog
                isOpen={deleteDialog.open}
                onClose={() => setDeleteDialog({ open: false, pronostic: null })}
                onConfirm={handleDelete}
                title="Supprimer le pronostic"
                message={`Êtes-vous sûr de vouloir supprimer le pronostic "${deleteDialog.pronostic?.prediction}" pour le match "${deleteDialog.pronostic?.homeTeam} vs ${deleteDialog.pronostic?.awayTeam}" ?`}
                confirmText="Supprimer"
                type="danger"
            />
        </div>
    );
};

export default PronosticManagement;