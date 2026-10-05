import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { Plus, Search, FileText, Eye, Printer, CreditCard, Euro, Calendar, Building, Download, FileSpreadsheet } from 'lucide-react';
import InvoiceForm from './InvoiceForm';
import { Invoice } from '../../types';
import { printDocument, generateDocumentHeader, generateDocumentFooter, exportToExcel, generateInvoiceHTML, formatCurrency } from '../../utils/exportUtils';

const InvoiceList: React.FC = () => {
  const { invoices, patients, organizationSettings } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  const getPatientName = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId);
    return patient ? `${patient.firstName} ${patient.lastName}` : 'Patient inconnu';
  };

  const getPatient = (patientId: string) => {
    return patients.find(p => p.id === patientId);
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      draft: 'bg-gray-100 text-gray-800',
      sent: 'bg-blue-100 text-blue-800',
      paid: 'bg-green-100 text-green-800',
      partial: 'bg-yellow-100 text-yellow-800',
      cancelled: 'bg-red-100 text-red-800',
      overdue: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status: string) => {
    const texts: Record<string, string> = {
      draft: 'Brouillon',
      sent: 'Envoyée',
      paid: 'Payée',
      partial: 'Partielle',
      cancelled: 'Annulée',
      overdue: 'En retard'
    };
    return texts[status] || status;
  };

  const filteredInvoices = invoices.filter(invoice => {
    const patientName = getPatientName(invoice.patientId).toLowerCase();
    const matchesSearch = patientName.includes(searchTerm.toLowerCase()) ||
                          invoice.id.includes(searchTerm);
    const matchesStatus = filterStatus === 'all' || invoice.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const totalRevenue = invoices
    .filter(i => i.status === 'paid' || i.status === 'partial')
    .reduce((sum, i) => sum + (i.payments || []).reduce((s, p) => s + p.amount, 0), 0);

  const pendingAmount = invoices
    .filter(i => i.status === 'sent' || i.status === 'partial' || i.status === 'overdue')
    .reduce((sum, i) => sum + (i.total - (i.payments || []).reduce((s, p) => s + p.amount, 0)), 0);

  const generateInvoicesHTML = () => {
    const rows = filteredInvoices.map(inv => {
      const paidAmount = (inv.payments || []).reduce((sum, p) => sum + p.amount, 0);
      return `
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd;">#${inv.id}</td>
          <td style="padding: 10px; border: 1px solid #ddd;">${getPatientName(inv.patientId)}</td>
          <td style="padding: 10px; border: 1px solid #ddd;">${new Date(inv.date).toLocaleDateString('fr-FR')}</td>
          <td style="padding: 10px; border: 1px solid #ddd;">${formatCurrency(inv.total, organizationSettings)}</td>
          <td style="padding: 10px; border: 1px solid #ddd;">${formatCurrency(paidAmount, organizationSettings)}</td>
          <td style="padding: 10px; border: 1px solid #ddd;">${getStatusText(inv.status)}</td>
        </tr>
      `;
    }).join('');

    return `
      ${generateDocumentHeader(organizationSettings, 'report', `FAC-${Date.now().toString().slice(-8)}`)}
      <h2 style="margin: 20px 0; color: #333;">Liste des Factures</h2>
      <p style="color: #666; margin-bottom: 20px;">Total: ${filteredInvoices.length} factures - Revenus: ${formatCurrency(totalRevenue, organizationSettings)} - En attente: ${formatCurrency(pendingAmount, organizationSettings)}</p>
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="background-color: ${organizationSettings.primaryColor};">
            <th style="padding: 10px; color: white; text-align: left;">N Facture</th>
            <th style="padding: 10px; color: white; text-align: left;">Patient</th>
            <th style="padding: 10px; color: white; text-align: left;">Date</th>
            <th style="padding: 10px; color: white; text-align: left;">Montant</th>
            <th style="padding: 10px; color: white; text-align: left;">Paye</th>
            <th style="padding: 10px; color: white; text-align: left;">Statut</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
      ${generateDocumentFooter(organizationSettings)}
    `;
  };

  const handleExportPDF = async () => {
    await printDocument(generateInvoicesHTML(), organizationSettings, 'Liste-Factures');
    setShowExportMenu(false);
  };

  const handleExportExcel = () => {
    const data = filteredInvoices.map(inv => ({
      numero: inv.id,
      patient: getPatientName(inv.patientId),
      date: new Date(inv.date).toLocaleDateString('fr-FR'),
      montant: inv.total,
      paye: (inv.payments || []).reduce((s, p) => s + p.amount, 0),
      statut: getStatusText(inv.status)
    }));
    exportToExcel(data, 'Liste-Factures', ['N Facture', 'Patient', 'Date', 'Montant', 'Paye', 'Statut']);
    setShowExportMenu(false);
  };

  const handlePrint = async () => {
    await printDocument(generateInvoicesHTML(), organizationSettings, 'Liste-Factures');
    setShowExportMenu(false);
  };

  const printCurrentInvoice = async (invoice: Invoice) => {
    const patient = getPatient(invoice.patientId);
    const html = generateInvoiceHTML(
      {
        number: invoice.id,
        date: invoice.date,
        dueDate: invoice.dueDate,
        patient: {
          name: patient ? `${patient.firstName} ${patient.lastName}` : 'Patient',
          address: patient?.address || '',
          phone: patient?.phone || ''
        },
        items: invoice.items.map(i => ({
          description: i.description,
          quantity: i.quantity,
          unitPrice: i.unitPrice,
          total: i.total
        })),
        subtotal: invoice.subtotal,
        tax: invoice.tax,
        discount: invoice.discount,
        total: invoice.total,
        status: invoice.status
      },
      organizationSettings
    );
    await printDocument(html, organizationSettings, `Facture-${invoice.id}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Facturation</h1>
        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Exporter
            </button>

            {showExportMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowExportMenu(false)} />
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden sc-dropdown-menu">
                  <button
                    onClick={handleExportPDF}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                  >
                    <Download className="w-4 h-4 text-red-500" />
                    <span>Exporter PDF</span>
                  </button>
                  <button
                    onClick={handleExportExcel}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-green-500" />
                    <span>Exporter Excel</span>
                  </button>
                  <button
                    onClick={handlePrint}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                  >
                    <Printer className="w-4 h-4 text-blue-500" />
                    <span>Imprimer</span>
                  </button>
                </div>
              </>
            )}
          </div>

          <button
            onClick={() => {
              setShowForm(true);
              setTimeout(() => {
                formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }, 50);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Nouvelle Facture</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Factures</p>
              <p className="text-2xl font-bold text-gray-900">{invoices.length}</p>
            </div>
            <FileText className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Revenus</p>
              <p className="text-2xl font-bold text-green-600">{totalRevenue.toFixed(2)} {organizationSettings?.currencySymbol || '€'}</p>
            </div>
            <CreditCard className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">En attente</p>
              <p className="text-2xl font-bold text-yellow-600">{pendingAmount.toFixed(2)} {organizationSettings?.currencySymbol || '€'}</p>
            </div>
            <CreditCard className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">En retard</p>
              <p className="text-2xl font-bold text-red-600">
                {invoices.filter(i => i.status === 'overdue').length}
              </p>
            </div>
            <Calendar className="w-8 h-8 text-red-500" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher une facture..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="sc-select"
            >
              <option value="all">Tous les statuts</option>
              <option value="draft">Brouillon</option>
              <option value="sent">Envoyée</option>
              <option value="paid">Payée</option>
              <option value="partial">Partielle</option>
              <option value="overdue">En retard</option>
              <option value="cancelled">Annulée</option>
            </select>
          </div>
        </div>

        {filteredInvoices.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Aucune facture trouvée</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    N° Facture
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patient
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Échéance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Montant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payé
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredInvoices.map((invoice) => {
                  const paidAmount = (invoice.payments || []).reduce((sum, p) => sum + p.amount, 0);
                  return (
                    <tr key={invoice.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-medium text-gray-900">#{invoice.id}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                        {getPatientName(invoice.patientId)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                        {invoice.date ? new Date(invoice.date).toLocaleDateString('fr-FR') : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                        {invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString('fr-FR') : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                        {invoice.total.toFixed(2)} {organizationSettings?.currencySymbol || '€'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-green-600">
                        {paidAmount.toFixed(2)} {organizationSettings?.currencySymbol || '€'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(invoice.status)}`}>
                          {getStatusText(invoice.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedInvoice(invoice)}
                            className="p-1.5 text-gray-400 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition-colors"
                            title="Aperçu de la facture"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => printCurrentInvoice(invoice)}
                            className="p-1.5 text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                            title="Imprimer la facture"
                          >
                            <Printer className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Formulaire */}
      {showForm && (
        <div ref={formRef} className="mt-6">
          <InvoiceForm onClose={() => setShowForm(false)} />
        </div>
      )}

      {/* Modal Détails */}
      {selectedInvoice && (
        <InvoiceDetails
          invoice={selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
          onPrint={() => printCurrentInvoice(selectedInvoice)}
        />
      )}
    </div>
  );
};

// Composant Détails Facture
const InvoiceDetails: React.FC<{ invoice: Invoice; onClose: () => void; onPrint: () => void }> = ({ invoice, onClose, onPrint }) => {
  const { patients, organizationSettings } = useApp();
  const patient = patients.find(p => p.id === invoice.patientId);
  const paidAmount = (invoice.payments || []).reduce((sum, p) => sum + p.amount, 0);
  const currencySymbol = organizationSettings?.currencySymbol || '€';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Facture #{invoice.id}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <Plus className="w-6 h-6 rotate-45" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* En-tête */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Patient</h3>
              <p className="text-gray-700">{patient?.firstName} {patient?.lastName}</p>
              <p className="text-sm text-gray-500">{patient?.address}</p>
              <p className="text-sm text-gray-500">{patient?.phone}</p>
            </div>
            <div className="text-right">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">{organizationSettings?.name || 'Hôpital'}</h3>
              <p className="text-gray-700">{organizationSettings?.address || '123 Avenue de la Santé'}</p>
              <p className="text-sm text-gray-500">{organizationSettings?.phone || '01 23 45 67 89'}</p>
              <p className="text-sm text-gray-500">{organizationSettings?.email || 'contact@hopital.fr'}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 py-4 border-t border-gray-200">
            <div>
              <p className="text-sm text-gray-500">Date</p>
              <p className="font-medium">{invoice.date ? new Date(invoice.date).toLocaleDateString('fr-FR') : '-'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Échéance</p>
              <p className="font-medium">{invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString('fr-FR') : '-'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Statut</p>
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                invoice.status === 'paid' ? 'bg-green-100 text-green-800' :
                invoice.status === 'overdue' ? 'bg-red-100 text-red-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {invoice.status}
              </span>
            </div>
          </div>

          {/* Articles */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Articles</h3>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Description</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Prix unitaire</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Qté</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {invoice.items.map((item) => (
                    <tr key={item.id}>
                      <td className="px-4 py-3 text-gray-900">{item.description}</td>
                      <td className="px-4 py-3 text-right text-gray-600">{item.unitPrice.toFixed(2)} {currencySymbol}</td>
                      <td className="px-4 py-3 text-right text-gray-600">{item.quantity}</td>
                      <td className="px-4 py-3 text-right font-medium text-gray-900">{item.total.toFixed(2)} {currencySymbol}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totaux */}
          <div className="flex justify-end">
            <div className="w-64 space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Sous-total</span>
                <span>{invoice.subtotal.toFixed(2)} {currencySymbol}</span>
              </div>
              {invoice.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Remise</span>
                  <span>-{invoice.discount.toFixed(2)} {currencySymbol}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold text-gray-900 border-t pt-2">
                <span>Total</span>
                <span>{invoice.total.toFixed(2)} {currencySymbol}</span>
              </div>
              <div className="flex justify-between text-green-600">
                <span>Payé</span>
                <span>{paidAmount.toFixed(2)} {currencySymbol}</span>
              </div>
              <div className="flex justify-between text-red-600 font-medium">
                <span>Reste à payer</span>
                <span>{(invoice.total - paidAmount).toFixed(2)} {currencySymbol}</span>
              </div>
            </div>
          </div>

          {/* Paiements */}
          {(invoice.payments || []).length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Paiements</h3>
              <div className="space-y-2">
                {(invoice.payments || []).map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between bg-green-50 p-3 rounded-lg">
                    <div>
                      <span className="font-medium text-green-800">{payment.amount.toFixed(2)} {currencySymbol}</span>
                      <span className="text-green-600 ml-2">par {payment.method}</span>
                    </div>
                    <div className="text-sm text-green-600">
                      {new Date(payment.date).toLocaleDateString('fr-FR')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              Fermer
            </button>
            {invoice.status !== 'paid' && (
              <button className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                Enregistrer un paiement
              </button>
            )}
            <button
              onClick={onPrint}
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white rounded-xl shadow-md shadow-teal-600/20 transition-all flex items-center justify-center gap-2 font-medium"
            >
              <Printer className="w-4 h-4" />
              Imprimer la facture
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceList;
