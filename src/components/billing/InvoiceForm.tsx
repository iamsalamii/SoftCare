import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Save, Plus, Trash2, Search } from 'lucide-react';
import { Invoice, InvoiceItem, Payment } from '../../types';
import { formatCurrency } from '../../utils/exportUtils';

interface InvoiceFormProps {
  onClose: () => void;
}

const InvoiceForm: React.FC<InvoiceFormProps> = ({ onClose }) => {
  const { patients, addInvoice, organizationSettings } = useApp();
  const [loading, setLoading] = useState(false);
  const [discount, setDiscount] = useState(organizationSettings.defaultDiscount || 0);

  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [searchPatient, setSearchPatient] = useState('');
  const [showPatientSelect, setShowPatientSelect] = useState(false);

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    items: [] as InvoiceItem[],
    notes: '',
    status: 'draft' as const
  });

  const [newItem, setNewItem] = useState({
    description: '',
    type: 'consultation' as InvoiceItem['type'],
    quantity: 1,
    unitPrice: 0
  });

  const filteredPatients = patients.filter(p =>
    `${p.firstName} ${p.lastName}`.toLowerCase().includes(searchPatient.toLowerCase()) ||
    p.phone.includes(searchPatient)
  );

  const subtotal = formData.items.reduce((sum, item) => sum + item.total, 0);
  const taxRate = organizationSettings.taxRate || 0;
  const discountAmount = subtotal * (discount / 100);
  const taxableAmount = subtotal - discountAmount;
  const tax = taxableAmount * (taxRate / 100);
  const total = taxableAmount + tax;

  const addItem = () => {
    if (newItem.description && newItem.unitPrice > 0) {
      const item: InvoiceItem = {
        id: Date.now().toString(),
        description: newItem.description,
        type: newItem.type,
        quantity: newItem.quantity,
        unitPrice: newItem.unitPrice,
        total: newItem.quantity * newItem.unitPrice
      };
      setFormData(prev => ({
        ...prev,
        items: [...prev.items, item]
      }));
      setNewItem({ description: '', type: 'consultation', quantity: 1, unitPrice: 0 });
    }
  };

  const removeItem = (id: string) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== id)
    }));
  };

  const quickAddItem = (type: InvoiceItem['type'], description: string, price: number) => {
    const item: InvoiceItem = {
      id: Date.now().toString(),
      description,
      type,
      quantity: 1,
      unitPrice: price,
      total: price
    };
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, item]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatientId || formData.items.length === 0) return;

    setLoading(true);

    const invoice: Invoice = {
      id: Date.now().toString(),
      patientId: selectedPatientId,
      date: formData.date,
      dueDate: formData.dueDate,
      items: formData.items,
      subtotal,
      tax,
      discount: discountAmount,
      total,
      status: 'draft',
      payments: [],
      notes: formData.notes,
      createdAt: new Date().toISOString(),
      createdBy: '1'
    };

    addInvoice(invoice);
    setLoading(false);
    onClose();
  };

  const selectedItemTypes: Record<string, { label: string; price: number }[]> = {
    consultation: organizationSettings.quickInvoiceItems
      .filter(i => i.category === 'consultation' && i.active)
      .sort((a, b) => a.order - b.order)
      .map(i => ({ label: i.label, price: i.price })),
    procedure: organizationSettings.quickInvoiceItems
      .filter(i => i.category === 'procedure' && i.active)
      .sort((a, b) => a.order - b.order)
      .map(i => ({ label: i.label, price: i.price })),
    lab: organizationSettings.quickInvoiceItems
      .filter(i => i.category === 'lab' && i.active)
      .sort((a, b) => a.order - b.order)
      .map(i => ({ label: i.label, price: i.price })),
    room: organizationSettings.quickInvoiceItems
      .filter(i => i.category === 'room' && i.active)
      .sort((a, b) => a.order - b.order)
      .map(i => ({ label: i.label, price: i.price })),
    medication: organizationSettings.quickInvoiceItems
      .filter(i => i.category === 'medication' && i.active)
      .sort((a, b) => a.order - b.order)
      .map(i => ({ label: i.label, price: i.price })),
    other: organizationSettings.quickInvoiceItems
      .filter(i => i.category === 'other' && i.active)
      .sort((a, b) => a.order - b.order)
      .map(i => ({ label: i.label, price: i.price }))
  };

  const selectedPatient = patients.find(p => p.id === selectedPatientId);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-xl font-bold text-gray-900">Nouvelle Facture</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Patient */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Patient</label>
            {selectedPatient ? (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-blue-900">{selectedPatient.firstName} {selectedPatient.lastName}</p>
                  <p className="text-sm text-blue-600">{selectedPatient.phone}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedPatientId('')}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowPatientSelect(!showPatientSelect)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-left text-gray-500 hover:border-blue-500"
                >
                  Sélectionner un patient
                </button>
                {showPatientSelect && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-20 max-h-64 overflow-y-auto">
                    <div className="p-2 border-b">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          value={searchPatient}
                          onChange={(e) => setSearchPatient(e.target.value)}
                          placeholder="Rechercher..."
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                    {filteredPatients.map(patient => (
                      <button
                        key={patient.id}
                        type="button"
                        onClick={() => {
                          setSelectedPatientId(patient.id);
                          setShowPatientSelect(false);
                          setSearchPatient('');
                        }}
                        className="w-full px-4 py-3 text-left hover:bg-blue-50 flex items-center justify-between"
                      >
                        <div>
                          <p className="font-medium text-gray-900">{patient.firstName} {patient.lastName}</p>
                          <p className="text-sm text-gray-500">{patient.phone}</p>
                        </div>
                        <span className="text-xs text-gray-400">{patient.bloodType}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Échéance</label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {/* Quick Add */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ajout rapide</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {Object.entries(selectedItemTypes).map(([type, items]) => (
                <div key={type} className="space-y-1">
                  <p className="text-xs font-medium text-gray-500 uppercase">{type}</p>
                  {items.slice(0, 2).map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => quickAddItem(type as InvoiceItem['type'], item.label, item.price)}
                      className="w-full text-left px-2 py-1 text-xs bg-gray-100 hover:bg-blue-100 text-gray-700 hover:text-blue-700 rounded transition-colors"
                    >
                      {item.label} ({item.price} {organizationSettings.currencySymbol})
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Items */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Articles</label>
            <div className="bg-gray-50 rounded-lg p-4 space-y-4">
              <div className="grid grid-cols-12 gap-2">
                <div className="col-span-4">
                  <input
                    type="text"
                    value={newItem.description}
                    onChange={(e) => setNewItem(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Description"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="col-span-2">
                  <select
                    value={newItem.type}
                    onChange={(e) => setNewItem(prev => ({ ...prev, type: e.target.value as InvoiceItem['type'] }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="consultation">Consultation</option>
                    <option value="procedure">Acte</option>
                    <option value="lab">Laboratoire</option>
                    <option value="room">Chambre</option>
                    <option value="medication">Médicament</option>
                    <option value="other">Autre</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <input
                    type="number"
                    value={newItem.quantity}
                    onChange={(e) => setNewItem(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="col-span-2">
                  <div className="relative">
                    <input
                      type="number"
                      value={newItem.unitPrice}
                      onChange={(e) => setNewItem(prev => ({ ...prev, unitPrice: parseFloat(e.target.value) || 0 }))}
                      min="0"
                      step="0.01"
                      className="w-full pl-3 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">{organizationSettings.currencySymbol}</span>
                  </div>
                </div>
                <div className="col-span-2">
                  <button
                    type="button"
                    onClick={addItem}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {formData.items.length > 0 && (
                <div className="mt-4 border border-gray-200 rounded-lg overflow-hidden bg-white">
                  <table className="w-full">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Description</th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Qté</th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">P.U.</th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Total</th>
                        <th className="px-4 py-2 w-10"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {formData.items.map((item) => (
                        <tr key={item.id}>
                          <td className="px-4 py-2 text-gray-900">{item.description}</td>
                          <td className="px-4 py-2 text-right text-gray-600">{item.quantity}</td>
                          <td className="px-4 py-2 text-right text-gray-600">{formatCurrency(item.unitPrice, organizationSettings)}</td>
                          <td className="px-4 py-2 text-right font-medium text-gray-900">{formatCurrency(item.total, organizationSettings)}</td>
                          <td className="px-4 py-2">
                            <button
                              type="button"
                              onClick={() => removeItem(item.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-72 space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Sous-total</span>
                <span>{formatCurrency(subtotal, organizationSettings)}</span>
              </div>
              <div className="flex justify-between text-gray-600 items-center">
                <span>Remise (%)</span>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={discount}
                  onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                  className="w-20 px-2 py-1 text-right border border-gray-300 rounded"
                />
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Remise</span>
                  <span>-{formatCurrency(discountAmount, organizationSettings)}</span>
                </div>
              )}
              {taxRate > 0 && (
                <div className="flex justify-between text-gray-600">
                  <span>{organizationSettings.taxName} ({taxRate}%)</span>
                  <span>{formatCurrency(tax, organizationSettings)}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold text-gray-900 border-t pt-2">
                <span>Total</span>
                <span>{formatCurrency(total, organizationSettings)}</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Notes ou mentions légales"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading || !selectedPatientId || formData.items.length === 0}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              {loading ? 'Création...' : 'Créer la facture'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InvoiceForm;
