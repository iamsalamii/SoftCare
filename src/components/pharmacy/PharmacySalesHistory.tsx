import React, { useState, useEffect } from 'react';
import { Search, Printer, Calendar, User } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { apiService } from '../../services/apiService';
import { PharmacySale } from '../../types';
import { formatCurrency, printDocument } from '../../utils/exportUtils';
import { useToast } from '../../context/ToastContext';

export const PharmacySalesHistory: React.FC = () => {
  const { organizationSettings } = useApp();
  const { error } = useToast();
  const [sales, setSales] = useState<PharmacySale[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    try {
      setLoading(true);
      const data = await apiService.pharmacySales.getAll();
      setSales(data);
    } catch (err) {
      console.error('Failed to fetch sales', err);
      error('Erreur', "Impossible de charger l'historique des ventes.");
    } finally {
      setLoading(false);
    }
  };

  const handlePrintReceipt = async (sale: PharmacySale) => {
    try {
      const receiptDate = sale.saleDate || sale.createdAt;
      const receiptContent = `
        <div style="font-family: monospace; width: 80mm; margin: 0 auto; text-align: center;">
          <h2 style="margin-bottom: 5px;">${organizationSettings.name}</h2>
          <p style="font-size: 12px; margin: 0 0 10px 0;">Ticket de Caisse: ${sale.receiptNumber}</p>
          <hr style="border-top: 1px dashed #333;" />
          <p style="text-align: left; font-size: 12px;">Date: ${receiptDate ? new Date(receiptDate).toLocaleString('fr-FR') : 'N/A'}</p>
          ${sale.patient ? `<p style="text-align: left; font-size: 12px;">Patient: ${sale.patient.firstName} ${sale.patient.lastName}</p>` : ''}
          ${sale.customerName ? `<p style="text-align: left; font-size: 12px;">Client: ${sale.customerName}</p>` : ''}
          <hr style="border-top: 1px dashed #333;" />
          <table style="width: 100%; font-size: 12px; text-align: left; margin: 10px 0;">
            <thead>
              <tr><th>Qte</th><th>Article</th><th style="text-align: right;">Prix</th></tr>
            </thead>
            <tbody>
              ${sale.items.map(item => `
                <tr>
                  <td>${item.quantity}</td>
                  <td>${item.medicationName || item.medication?.name || 'Inconnu'}</td>
                  <td style="text-align: right;">${formatCurrency(item.subtotal || item.total, organizationSettings)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <hr style="border-top: 1px dashed #333;" />
          <h3 style="text-align: right;">Total: ${formatCurrency(sale.totalAmount ?? sale.total, organizationSettings)}</h3>
          <p style="text-align: left; font-size: 12px;">Paiement: ${sale.paymentMethod}</p>
          <p style="text-align: center; font-size: 10px; margin-top: 20px;">Merci de votre visite !</p>
        </div>
      `;
      await printDocument(receiptContent, organizationSettings, `Ticket-${sale.receiptNumber}`);
    } catch (err) {
      console.error(err);
      error('Erreur', "Impossible d'imprimer le ticket.");
    }
  };

  const filteredSales = sales.filter(s => {
    const matchesSearch = s.receiptNumber.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (s.customerName && s.customerName.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          (s.patient?.lastName && s.patient.lastName.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const saleDateStr = s.saleDate || s.createdAt;
    const matchesDate = dateFilter && saleDateStr ? new Date(saleDateStr).toISOString().split('T')[0] === dateFilter : true;
    
    return matchesSearch && matchesDate;
  });

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Chargement de l'historique...</div>;
  }

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-5 border-b border-gray-100 bg-gray-50/50">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Historique des ventes</h2>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1 max-w-3xl">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par N° ticket, patient, client..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-4 py-3 w-full bg-white border border-gray-200 rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all duration-200 shadow-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gray-400" />
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 shadow-sm"
            />
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
            <tr>
              <th className="px-5 py-3">Date & N° Ticket</th>
              <th className="px-5 py-3">Client / Patient</th>
              <th className="px-5 py-3">Montant</th>
              <th className="px-5 py-3">Paiement</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredSales.map(sale => (
              <tr key={sale.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-5 py-3">
                  <div className="font-medium text-gray-900">{new Date(sale.saleDate || sale.createdAt).toLocaleString('fr-FR')}</div>
                  <div className="text-xs text-gray-500 font-mono">{sale.receiptNumber}</div>
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="font-medium text-gray-900">
                      {sale.patient ? `${sale.patient.firstName} ${sale.patient.lastName}` : (sale.customerName || 'Client anonyme')}
                    </span>
                  </div>
                </td>
                <td className="px-5 py-3">
                  <span className="font-bold text-gray-900">{formatCurrency(sale.totalAmount ?? sale.total, organizationSettings)}</span>
                </td>
                <td className="px-5 py-3">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold bg-green-100 text-green-700">
                    {sale.paymentMethod}
                  </span>
                </td>
                <td className="px-5 py-3 text-right">
                  <button
                    onClick={() => handlePrintReceipt(sale)}
                    className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors"
                    title="Réimprimer ticket"
                  >
                    <Printer className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredSales.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-sm">Aucune vente trouvée.</p>
          </div>
        )}
      </div>
    </div>
  );
};
