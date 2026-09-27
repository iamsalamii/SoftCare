import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Plus, Search, Edit3, AlertTriangle, Package, Download, FileSpreadsheet,
  Printer, Trash2, Barcode, ScanLine, Snowflake, Dna, ShieldAlert, CheckCircle2
} from 'lucide-react';
import MedicationForm from './MedicationForm';
import BarcodeGenerator from '../common/BarcodeGenerator';
import BarcodeScannerModal from '../common/BarcodeScannerModal';
import { printDocument, generateDocumentHeader, generateDocumentFooter, exportToExcel, formatCurrency } from '../../utils/exportUtils';
import ConfirmDialog from '../common/ConfirmDialog';
import { Medication } from '../../types';

const PharmacyManagement: React.FC = () => {
  const { medications, organizationSettings, deleteMedication } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedMedication, setSelectedMedication] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterBiotechOnly, setFilterBiotechOnly] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Modals for Barcode & Scanner
  const [barcodeMedication, setBarcodeMedication] = useState<Medication | null>(null);
  const [showScannerModal, setShowScannerModal] = useState(false);

  const categories = ['all', ...new Set(medications.map(med => med.category).filter(Boolean))];

  const filteredMedications = medications.filter(medication => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      medication.name.toLowerCase().includes(term) ||
      (medication.genericName && medication.genericName.toLowerCase().includes(term)) ||
      (medication.barcode && medication.barcode.toLowerCase().includes(term)) ||
      (medication.batchNumber && medication.batchNumber.toLowerCase().includes(term));

    const matchesCategory = filterCategory === 'all' || medication.category === filterCategory;
    const matchesBiotech = !filterBiotechOnly || medication.isBiotech;
    return matchesSearch && matchesCategory && matchesBiotech;
  });

  const lowStockMedications = medications.filter(med => med.stock <= med.minStock);
  const biotechMedications = medications.filter(med => med.isBiotech);
  const coldChainMedications = medications.filter(med => med.storageCondition === 'cold_2_8' || med.storageCondition === 'cryo_minus_80');

  const handleNewMedication = () => {
    setSelectedMedication(null);
    setShowForm(true);
  };

  const handleEditMedication = (medicationId: string) => {
    setSelectedMedication(medicationId);
    setShowForm(true);
  };

  const handleDeleteConfirm = async (medicationId: string) => {
    setDeleting(true);
    try {
      await deleteMedication(medicationId);
      setShowDeleteConfirm(null);
    } catch (err) {
      console.error('Error deleting medication:', err);
    } finally {
      setDeleting(false);
    }
  };

  const handleScanSuccess = (scannedMed: Medication) => {
    setSearchTerm(scannedMed.name);
  };

  const generateMedicationsHTML = () => {
    const rows = filteredMedications.map(med => {
      const isLowStock = med.stock <= med.minStock;
      const formattedExp = med.expiryDate ? new Date(med.expiryDate).toLocaleDateString('fr-FR') : 'N/A';
      return `
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd;">
            <strong>${med.name}</strong><br/>
            <span style="color: #666; font-size: 11px;">DCI: ${med.genericName || 'N/A'} • Lot: ${med.batchNumber || 'N/A'}</span>
          </td>
          <td style="padding: 10px; border: 1px solid #ddd;">${med.barcode || 'N/A'}</td>
          <td style="padding: 10px; border: 1px solid #ddd;">${med.category || 'N/A'}</td>
          <td style="padding: 10px; border: 1px solid #ddd; ${isLowStock ? 'color: #e11d48; font-weight: bold;' : ''}">${med.stock}</td>
          <td style="padding: 10px; border: 1px solid #ddd;">${formatCurrency(med.price || med.unitPrice || 0)}</td>
          <td style="padding: 10px; border: 1px solid #ddd;">${formattedExp}</td>
        </tr>
      `;
    }).join('');

    return `
      ${generateDocumentHeader(organizationSettings, 'report', `STK-${Date.now().toString().slice(-8)}`)}
      <h2 style="margin: 20px 0; color: #0e7490;">Registre & Inventaire de Pharmacie</h2>
      <p style="color: #64748b; margin-bottom: 20px;">
        Total références : <strong>${filteredMedications.length}</strong> | 
        Stock critique : <strong>${lowStockMedications.length}</strong> |
        Produits Biotech/PGx : <strong>${biotechMedications.length}</strong>
      </p>
      <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
        <thead>
          <tr style="background-color: ${organizationSettings.primaryColor || '#0891b2'}; color: white;">
            <th style="padding: 10px; text-align: left;">Médicament & Lot</th>
            <th style="padding: 10px; text-align: left;">Code-barres</th>
            <th style="padding: 10px; text-align: left;">Catégorie</th>
            <th style="padding: 10px; text-align: left;">Stock</th>
            <th style="padding: 10px; text-align: left;">Prix Unitaire</th>
            <th style="padding: 10px; text-align: left;">Date Péremption</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
      ${generateDocumentFooter(organizationSettings)}
    `;
  };

  const handleExportPDF = async () => {
    await printDocument(generateMedicationsHTML(), organizationSettings, 'Inventaire-Pharmacie');
    setShowExportMenu(false);
  };

  const handleExportExcel = () => {
    const data = filteredMedications.map(m => ({
      nom: m.name,
      nom_generique: m.genericName || '',
      code_barres: m.barcode || '',
      numero_lot: m.batchNumber || '',
      categorie: m.category || '',
      stock: m.stock,
      stock_min: m.minStock,
      prix: m.price || m.unitPrice || 0,
      conservation: m.storageCondition || 'ambient',
      biotech: m.isBiotech ? 'Oui' : 'Non',
      expiration: m.expiryDate ? new Date(m.expiryDate).toLocaleDateString('fr-FR') : 'N/A'
    }));
    exportToExcel(
      data,
      'Inventaire-Pharmacie-SoftCare',
      ['Nom', 'DCI', 'Code-barres', 'N° Lot', 'Catégorie', 'Stock', 'Stock min', 'Prix', 'Conservation', 'Biotech', 'Expiration']
    );
    setShowExportMenu(false);
  };

  const handlePrint = async () => {
    await printDocument(generateMedicationsHTML(), organizationSettings, 'Inventaire-Pharmacie');
    setShowExportMenu(false);
  };

  if (showForm) {
    return (
      <MedicationForm
        medicationId={selectedMedication}
        onClose={() => setShowForm(false)}
      />
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-teal-600 text-white flex items-center justify-center shadow-lg shadow-teal-500/25">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Pharmacie & Traçabilité</h1>
              <p className="text-xs text-gray-500">
                Gestion des stocks, codes-barres GS1/CIP, étiquetage 2D et chaîne du froid.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {/* Scanner Button */}
          <button
            onClick={() => setShowScannerModal(true)}
            className="flex-1 sm:flex-initial bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition-all hover:scale-[1.02]"
          >
            <ScanLine className="w-4 h-4 text-cyan-400" />
            <span>Scanner Code</span>
          </button>

          {/* Export Menu */}
          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="bg-gray-100 text-gray-700 px-4 py-2.5 rounded-xl font-semibold text-xs hover:bg-gray-200 transition-colors flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Exporter</span>
            </button>

            {showExportMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowExportMenu(false)} />
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden py-1">
                  <button
                    onClick={handleExportPDF}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-xs font-medium text-gray-700 text-left transition-colors"
                  >
                    <Download className="w-4 h-4 text-rose-500" />
                    <span>Exporter PDF</span>
                  </button>
                  <button
                    onClick={handleExportExcel}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-xs font-medium text-gray-700 text-left transition-colors"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                    <span>Exporter Excel</span>
                  </button>
                  <button
                    onClick={handlePrint}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-xs font-medium text-gray-700 text-left transition-colors"
                  >
                    <Printer className="w-4 h-4 text-cyan-600" />
                    <span>Imprimer Registre</span>
                  </button>
                </div>
              </>
            )}
          </div>

          {/* New Medication */}
          <button
            onClick={handleNewMedication}
            className="flex-1 sm:flex-initial bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700 text-white px-4 py-2.5 rounded-xl font-semibold text-xs shadow-lg shadow-teal-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4" />
            <span>Nouveau Médicament</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-gray-500">Total Références</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1">{medications.length}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
            <Package className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-gray-500">Stock Faible / Alerte</p>
            <h3 className={`text-2xl font-bold mt-1 ${lowStockMedications.length > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
              {lowStockMedications.length}
            </h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-gray-500">Biomédicaments / PGx</p>
            <h3 className="text-2xl font-bold text-purple-700 mt-1">{biotechMedications.length}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Dna className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-gray-500">Chaîne du Froid (2-8°C)</p>
            <h3 className="text-2xl font-bold text-blue-700 mt-1">{coldChainMedications.length}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Snowflake className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Critical Stock Alerts Banner */}
      {lowStockMedications.length > 0 && (
        <div className="bg-rose-50 border border-rose-200/80 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <ShieldAlert className="w-5 h-5 text-rose-600" />
            <h3 className="text-sm font-bold text-rose-900">
              Rupture Imminente : {lowStockMedications.length} médicament(s) sous le seuil critique
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {lowStockMedications.map(med => (
              <div key={med.id} className="bg-white rounded-xl p-3 border border-rose-200 shadow-sm flex justify-between items-center">
                <div>
                  <p className="font-bold text-xs text-gray-900">{med.name}</p>
                  <p className="text-[11px] text-gray-500 font-mono">Lot: {med.batchNumber || 'N/A'}</p>
                </div>
                <span className="px-2 py-1 text-xs font-bold bg-rose-100 text-rose-700 rounded-lg">
                  {med.stock} / {med.minStock} min
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Table Card */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Search & Filters */}
        <div className="p-5 border-b border-gray-100 bg-gray-50/50">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-3xl">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher par nom, code-barres, n° lot, DCI..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-4 py-3 w-full bg-gray-50/50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all duration-200 text-sm shadow-sm"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setFilterBiotechOnly(!filterBiotechOnly)}
                className={`px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all shadow-sm ${
                  filterBiotechOnly
                    ? 'bg-purple-600 text-white shadow-purple-500/20'
                    : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Dna className="w-5 h-5" />
                <span>Biotech & PGx</span>
              </button>

              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:bg-white focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all duration-200 shadow-sm"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'Toutes les catégories' : category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Médicament & Spécificités</th>
                <th className="px-6 py-4">Code-barres & Lot</th>
                <th className="px-6 py-4">Conservation</th>
                <th className="px-6 py-4">Stock</th>
                <th className="px-6 py-4">Prix</th>
                <th className="px-6 py-4">Péremption</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {filteredMedications.map((medication) => {
                const isLowStock = medication.stock <= medication.minStock;
                const expiryDate = medication.expiryDate ? new Date(medication.expiryDate) : null;
                const isExpiringSoon = expiryDate && expiryDate < new Date(Date.now() + 60 * 24 * 60 * 60 * 1000);

                return (
                  <tr key={medication.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Name */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          medication.isBiotech ? 'bg-purple-100 text-purple-700' : 'bg-cyan-50 text-cyan-600'
                        }`}>
                          {medication.isBiotech ? <Dna className="w-4 h-4" /> : <Package className="w-4 h-4" />}
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 flex items-center gap-2">
                            <span>{medication.name}</span>
                            {medication.strength && (
                              <span className="text-[10px] text-gray-500 font-normal">({medication.strength})</span>
                            )}
                          </div>
                          <div className="text-[11px] text-gray-500">
                            {medication.genericName || 'DCI non précisée'} • {medication.category}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Barcode & Lot */}
                    <td className="px-6 py-4 font-mono text-[11px]">
                      <div className="font-semibold text-gray-800">{medication.barcode || 'NON DÉFINI'}</div>
                      <div className="text-gray-500 text-[10px]">Lot : {medication.batchNumber || 'LT-STD'}</div>
                    </td>

                    {/* Storage */}
                    <td className="px-6 py-4">
                      {medication.storageCondition === 'cold_2_8' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                          <Snowflake className="w-3 h-3 text-blue-500" /> 2-8°C Frigo
                        </span>
                      ) : medication.storageCondition === 'cryo_minus_80' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                          ❄️ -80°C Cryo
                        </span>
                      ) : (
                        <span className="text-gray-500 text-[11px]">Température Ambiante</span>
                      )}
                    </td>

                    {/* Stock */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        <span className={`font-bold ${isLowStock ? 'text-rose-600' : 'text-gray-900'}`}>
                          {medication.stock}
                        </span>
                        {isLowStock ? (
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                        ) : (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        )}
                      </div>
                      <span className="text-[10px] text-gray-400">Min: {medication.minStock}</span>
                    </td>

                    {/* Price */}
                    <td className="px-6 py-4 font-bold text-gray-900">
                      {formatCurrency(medication.price || medication.unitPrice || 0)}
                    </td>

                    {/* Expiry */}
                    <td className="px-6 py-4">
                      <span className={`font-medium ${isExpiringSoon ? 'text-rose-600 font-bold' : 'text-gray-700'}`}>
                        {expiryDate ? expiryDate.toLocaleDateString('fr-FR') : 'N/A'}
                      </span>
                      {isExpiringSoon && (
                        <div className="text-[10px] text-rose-500 font-semibold">Périme bientôt</div>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Barcode print button */}
                        <button
                          onClick={() => setBarcodeMedication(medication)}
                          title="Générer / Imprimer Étiquette Code-barres"
                          className="p-2 text-cyan-600 hover:bg-cyan-50 rounded-xl transition-colors"
                        >
                          <Barcode className="w-4 h-4" />
                        </button>

                        {/* Edit */}
                        <button
                          onClick={() => handleEditMedication(medication.id)}
                          title="Modifier"
                          className="p-2 text-gray-500 hover:text-cyan-600 hover:bg-gray-100 rounded-xl transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => setShowDeleteConfirm(medication.id)}
                          title="Supprimer"
                          className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Barcode Print Modal */}
      {barcodeMedication && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <BarcodeGenerator
            medication={barcodeMedication}
            onClose={() => setBarcodeMedication(null)}
          />
        </div>
      )}

      {/* Barcode Scanner Modal */}
      <BarcodeScannerModal
        isOpen={showScannerModal}
        onClose={() => setShowScannerModal(false)}
        onScanSuccess={handleScanSuccess}
        title="Recherche Rapide par Code-barres"
        description="Scannez l'étiquette d'une boîte pour filtrer instantanément le catalogue."
      />

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={!!showDeleteConfirm}
        title="Supprimer le médicament"
        message="Êtes-vous sûr de vouloir supprimer cette référence du catalogue ? Cette action est irréversible."
        confirmLabel={deleting ? 'Suppression...' : 'Supprimer'}
        onConfirm={() => showDeleteConfirm && handleDeleteConfirm(showDeleteConfirm)}
        onCancel={() => setShowDeleteConfirm(null)}
        variant="danger"
        loading={deleting}
      />
    </div>
  );
};

export default PharmacyManagement;