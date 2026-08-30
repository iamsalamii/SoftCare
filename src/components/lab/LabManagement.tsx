import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Plus, Search, FlaskConical, Clock, AlertTriangle, CheckCircle, Eye, FileText, Download, FileSpreadsheet, Printer } from 'lucide-react';
import { LabOrder } from '../../types';
import { printDocument, generateDocumentHeader, generateDocumentFooter, exportToExcel } from '../../utils/exportUtils';

const LabManagement: React.FC = () => {
  const { labOrders, labTests, patients, users, addLabOrder, updateLabOrder, organizationSettings } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [showNewOrder, setShowNewOrder] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<LabOrder | null>(null);
  const [showExportMenu, setShowExportMenu] = useState(false);

  const getPatientName = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId);
    return patient ? `${patient.firstName} ${patient.lastName}` : 'Inconnu';
  };

  const getDoctorName = (doctorId: string) => {
    const doctor = users.find(u => u.id === doctorId);
    return doctor?.name || 'Inconnu';
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      collected: 'bg-blue-100 text-blue-800',
      'in-progress': 'bg-purple-100 text-purple-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status: string) => {
    const texts: Record<string, string> = {
      pending: 'En attente',
      collected: 'Prelevement fait',
      'in-progress': 'En cours',
      completed: 'Termine',
      cancelled: 'Annule'
    };
    return texts[status] || status;
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      routine: 'border-gray-300',
      urgent: 'border-orange-400 bg-orange-50',
      stat: 'border-red-500 bg-red-50'
    };
    return colors[priority] || 'border-gray-300';
  };

  const filteredOrders = labOrders.filter(order => {
    const patientName = getPatientName(order.patientId).toLowerCase();
    const matchesSearch = patientName.includes(searchTerm.toLowerCase()) ||
                          order.id.includes(searchTerm);
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || order.priority === filterPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const stats = {
    total: labOrders.length,
    pending: labOrders.filter(o => o.status === 'pending').length,
    inProgress: labOrders.filter(o => o.status === 'in-progress' || o.status === 'collected').length,
    completed: labOrders.filter(o => o.status === 'completed').length,
    urgent: labOrders.filter(o => o.priority === 'urgent' || o.priority === 'stat').length
  };

  const generateLabHTML = () => {
    const rows = filteredOrders.map(order => `
      <tr>
        <td style="padding: 10px; border: 1px solid #ddd;">#${order.id.slice(-6)}</td>
        <td style="padding: 10px; border: 1px solid #ddd;">${getPatientName(order.patientId)}</td>
        <td style="padding: 10px; border: 1px solid #ddd;">${new Date(order.orderDate).toLocaleDateString('fr-FR')}</td>
        <td style="padding: 10px; border: 1px solid #ddd;">${order.tests.map(t => t.testName).join(', ')}</td>
        <td style="padding: 10px; border: 1px solid #ddd;">${getStatusText(order.status)}</td>
        <td style="padding: 10px; border: 1px solid #ddd;">${order.priority}</td>
      </tr>
    `).join('');

    return `
      ${generateDocumentHeader(organizationSettings, 'report', `LAB-${Date.now().toString().slice(-8)}`)}
      <h2 style="margin: 20px 0; color: #333;">Demandes Laboratoire</h2>
      <p style="color: #666; margin-bottom: 20px;">Total: ${stats.total} | En attente: ${stats.pending} | En cours: ${stats.inProgress} | Termines: ${stats.completed}</p>
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="background-color: ${organizationSettings.primaryColor};">
            <th style="padding: 10px; color: white; text-align: left;">N</th>
            <th style="padding: 10px; color: white; text-align: left;">Patient</th>
            <th style="padding: 10px; color: white; text-align: left;">Date</th>
            <th style="padding: 10px; color: white; text-align: left;">Analyses</th>
            <th style="padding: 10px; color: white; text-align: left;">Statut</th>
            <th style="padding: 10px; color: white; text-align: left;">Priorite</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
      ${generateDocumentFooter(organizationSettings)}
    `;
  };

  const handleExportPDF = async () => {
    await printDocument(generateLabHTML(), organizationSettings, 'Laboratoire');
    setShowExportMenu(false);
  };

  const handleExportExcel = () => {
    const data = filteredOrders.map(order => ({
      numero: order.id.slice(-6),
      patient: getPatientName(order.patientId),
      date: new Date(order.orderDate).toLocaleDateString('fr-FR'),
      analyses: order.tests.map(t => t.testName).join(', '),
      statut: getStatusText(order.status),
      priorite: order.priority
    }));
    exportToExcel(data, 'Laboratoire', ['N', 'Patient', 'Date', 'Analyses', 'Statut', 'Priorite']);
    setShowExportMenu(false);
  };

  const handlePrint = async () => {
    await printDocument(generateLabHTML(), organizationSettings, 'Laboratoire');
    setShowExportMenu(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Laboratoire</h1>
        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Exporter
            </button>

            {showExportMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowExportMenu(false)} />
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden">
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
            onClick={() => setShowNewOrder(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Nouvelle Analyse
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <FlaskConical className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">En attente</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">En cours</p>
              <p className="text-2xl font-bold text-purple-600">{stats.inProgress}</p>
            </div>
            <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Terminés</p>
              <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Urgents</p>
              <p className="text-2xl font-bold text-red-600">{stats.urgent}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher par patient ou N° commande..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tous les statuts</option>
            <option value="pending">En attente</option>
            <option value="collected">Prélèvement fait</option>
            <option value="in-progress">En cours</option>
            <option value="completed">Terminé</option>
          </select>
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Toutes priorités</option>
            <option value="routine">Routine</option>
            <option value="urgent">Urgent</option>
            <option value="stat">STAT</option>
          </select>
        </div>
      </div>

      {/* Orders List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <FlaskConical className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Aucune analyse trouvée</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className={`p-6 hover:bg-gray-50 cursor-pointer border-l-4 ${getPriorityColor(order.priority)}`}
                onClick={() => setSelectedOrder(order)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-mono text-sm text-gray-500">#{order.id}</span>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                      {(order.priority === 'urgent' || order.priority === 'stat') && (
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          order.priority === 'stat' ? 'bg-red-600 text-white' : 'bg-orange-200 text-orange-800'
                        }`}>
                          {order.priority === 'stat' ? 'STAT' : 'URGENT'}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-4 text-sm mb-2">
                      <span className="font-medium text-gray-900">{getPatientName(order.patientId)}</span>
                      <span className="text-gray-500">Dr. {getDoctorName(order.doctorId)}</span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {order.tests.map((test) => (
                        <span
                          key={test.id}
                          className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded flex items-center gap-1"
                        >
                          {test.testName}
                          {test.flag && test.flag !== 'normal' && (
                            <span className={`w-2 h-2 rounded-full ${
                              test.flag === 'high' ? 'bg-red-500' :
                              test.flag === 'low' ? 'bg-yellow-500' :
                              test.flag === 'critical' ? 'bg-red-600 animate-pulse' : ''
                            }`} />
                          )}
                        </span>
                      ))}
                    </div>

                    {order.notes && (
                      <p className="text-sm text-gray-500 mt-2">{order.notes}</p>
                    )}

                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      <span>Créé: {new Date(order.createdAt).toLocaleString('fr-FR')}</span>
                      {order.collectedAt && (
                        <span>Prélèvement: {new Date(order.collectedAt).toLocaleString('fr-FR')}</span>
                      )}
                      {order.completedAt && (
                        <span>Terminé: {new Date(order.completedAt).toLocaleString('fr-FR')}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedOrder(order);
                      }}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg"
                    >
                      <FileText className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* New Order Modal */}
      {showNewOrder && <LabOrderForm onClose={() => setShowNewOrder(false)} />}

      {/* Order Details Modal */}
      {selectedOrder && (
        <LabOrderDetails order={selectedOrder} onClose={() => setSelectedOrder(null)} />
      )}
    </div>
  );
};

// Composant Formulaire Commande Labo
const LabOrderForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { patients, labTests, users, addLabOrder } = useApp();
  const [selectedPatient, setSelectedPatient] = useState('');
  const [selectedTests, setSelectedTests] = useState<string[]>([]);
  const [priority, setPriority] = useState<'routine' | 'urgent' | 'stat'>('routine');
  const [notes, setNotes] = useState('');

  const doctors = users.filter(u => u.role === 'doctor');

  const toggleTest = (testId: string) => {
    setSelectedTests(prev =>
      prev.includes(testId) ? prev.filter(id => id !== testId) : [...prev, testId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient || selectedTests.length === 0) return;

    const order: LabOrder = {
      id: Date.now().toString(),
      patientId: selectedPatient,
      doctorId: '1',
      tests: selectedTests.map(testId => {
        const test = labTests.find(t => t.id === testId)!;
        return {
          id: `${testId}-${Date.now()}`,
          labTestId: testId,
          testName: test.name
        };
      }),
      priority,
      status: 'pending',
      notes,
      createdAt: new Date().toISOString()
    };

    addLabOrder(order);
    onClose();
  };

  const testsByCategory = labTests.reduce((acc, test) => {
    if (!acc[test.category]) acc[test.category] = [];
    acc[test.category].push(test);
    return acc;
  }, {} as Record<string, typeof labTests>);

  const totalPrice = selectedTests.reduce((sum, testId) => {
    const test = labTests.find(t => t.id === testId);
    return sum + (test?.price || 0);
  }, 0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Nouvelle Analyse</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <Plus className="w-6 h-6 rotate-45" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Patient */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Patient</label>
            <select
              value={selectedPatient}
              onChange={(e) => setSelectedPatient(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Sélectionner un patient</option>
              {patients.map(patient => (
                <option key={patient.id} value={patient.id}>
                  {patient.firstName} {patient.lastName} - {patient.phone}
                </option>
              ))}
            </select>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Priorité</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: 'routine', label: 'Routine', color: 'border-gray-300' },
                { value: 'urgent', label: 'Urgent', color: 'border-orange-400' },
                { value: 'stat', label: 'STAT', color: 'border-red-500' }
              ].map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setPriority(opt.value as typeof priority)}
                  className={`px-4 py-3 rounded-lg border-2 ${
                    priority === opt.value
                      ? `${opt.color} bg-gray-50`
                      : 'border-gray-200'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tests */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Analyses demandées</label>
            <div className="grid grid-cols-3 gap-4">
              {Object.entries(testsByCategory).map(([category, tests]) => (
                <div key={category}>
                  <h4 className="font-medium text-gray-900 mb-2 capitalize">{category}</h4>
                  <div className="space-y-2">
                    {tests.map(test => (
                      <label
                        key={test.id}
                        className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer ${
                          selectedTests.includes(test.id) ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedTests.includes(test.id)}
                          onChange={() => toggleTest(test.id)}
                          className="rounded"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{test.name}</p>
                          <p className="text-xs text-gray-500">{test.price.toFixed(2)} €</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">{selectedTests.length} analyse(s) sélectionnée(s)</span>
              <span className="text-lg font-bold text-gray-900">{totalPrice.toFixed(2)} €</span>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Informations complémentaires..."
            />
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg">
              Annuler
            </button>
            <button
              type="submit"
              disabled={!selectedPatient || selectedTests.length === 0}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              Créer la demande
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Composant Détails Commande
const LabOrderDetails: React.FC<{ order: LabOrder; onClose: () => void }> = ({ order, onClose }) => {
  const { patients, labTests } = useApp();
  const patient = patients.find(p => p.id === order.patientId);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Résultats - Commande #{order.id}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <Plus className="w-6 h-6 rotate-45" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Patient Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Patient</p>
                <p className="font-medium">{patient?.firstName} {patient?.lastName}</p>
              </div>
              <div>
                <p className="text-gray-500">Date demande</p>
                <p className="font-medium">{new Date(order.createdAt).toLocaleDateString('fr-FR')}</p>
              </div>
              <div>
                <p className="text-gray-500">Statut</p>
                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                  {order.status}
                </span>
              </div>
            </div>
          </div>

          {/* Results */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Résultats</h3>
            <div className="space-y-4">
              {order.tests.map((test) => {
                const labTest = labTests.find(t => t.id === test.labTestId);
                return (
                  <div key={test.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">{test.testName}</span>
                      {test.flag && (
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          test.flag === 'critical' ? 'bg-red-100 text-red-800' :
                          test.flag === 'high' ? 'bg-orange-100 text-orange-800' :
                          test.flag === 'low' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {test.flag === 'normal' ? 'Normal' : test.flag === 'high' ? 'Élevé' : test.flag === 'low' ? 'Bas' : 'Critique'}
                        </span>
                      )}
                    </div>

                    {test.result ? (
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Résultat</p>
                          <p className="text-lg font-bold text-gray-900">
                            {test.result} <span className="text-sm font-normal text-gray-500">{test.unit}</span>
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500">Valeurs normales</p>
                          <p className="text-gray-900">{test.referenceRange}</p>
                        </div>
                        {test.notes && (
                          <div>
                            <p className="text-gray-500">Notes</p>
                            <p className="text-gray-900">{test.notes}</p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-gray-500 italic">Résultat en attente</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Notes */}
          {order.notes && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Notes</h3>
              <p className="text-gray-700 bg-yellow-50 p-3 rounded-lg">{order.notes}</p>
            </div>
          )}

          <div className="flex gap-3 pt-4 border-t">
            <button onClick={onClose} className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg">
              Fermer
            </button>
            <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2">
              <FileText className="w-4 h-4" />
              Imprimer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LabManagement;
