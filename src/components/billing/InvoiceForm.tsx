import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { X, Save, Plus, Trash2, Receipt, User, Calendar, Percent, ShieldCheck, Sparkles } from 'lucide-react';
import { Invoice, InvoiceItem } from '../../types';
import CustomSelect from '../common/CustomSelect';
import FormField from '../common/FormField';

interface InvoiceFormProps {
  onClose: () => void;
}

export const InvoiceForm: React.FC<InvoiceFormProps> = ({ onClose }) => {
  const { patients, addInvoice, organizationSettings } = useApp();
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  const currency = organizationSettings?.currencySymbol || '€';
  const [discountPercent, setDiscountPercent] = useState(organizationSettings?.defaultDiscount || 0);

  const [selectedPatientId, setSelectedPatientId] = useState<string>(patients[0]?.id || '');

  const patientOptions = patients.map(p => ({
    value: p.id,
    label: `${p.firstName} ${p.lastName} (${p.phone || 'Sans tél'})`,
    badge: p.insuranceName || p.insuranceId || 'Standard'
  }));

  const itemTypeOptions = [
    { value: 'consultation', label: 'Consultation / Examen' },
    { value: 'procedure', label: 'Acte / Procédure' },
    { value: 'medication', label: 'Médicament / Pharmacie' },
    { value: 'room', label: 'Hébergement / Chambre' },
    { value: 'other', label: 'Autre prestation' }
  ];

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    items: [
      {
        id: `item-${Date.now()}-1`,
        description: 'Consultation de médecine générale / Spécialiste',
        type: 'consultation' as InvoiceItem['type'],
        quantity: 1,
        unitPrice: 50.00,
        total: 50.00
      }
    ] as InvoiceItem[],
    notes: '',
    status: 'draft' as const
  });

  const [newItem, setNewItem] = useState({
    description: '',
    type: 'consultation' as InvoiceItem['type'],
    quantity: 1,
    unitPrice: 25.00
  });

  const subtotal = formData.items.reduce((sum, item) => sum + item.total, 0);
  const taxRate = organizationSettings?.taxRate || 0;
  const discountAmount = subtotal * (discountPercent / 100);
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const tax = taxableAmount * (taxRate / 100);
  const total = taxableAmount + tax;

  const addItem = () => {
    if (!newItem.description.trim()) {
      toast.warning('Description requise', 'Veuillez saisir un libellé pour la ligne de facture.');
      return;
    }
    if (newItem.unitPrice < 0) {
      toast.warning('Montant invalide', 'Le prix unitaire doit être positif.');
      return;
    }

    const item: InvoiceItem = {
      id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      description: newItem.description.trim(),
      type: newItem.type,
      quantity: Math.max(1, newItem.quantity),
      unitPrice: newItem.unitPrice,
      total: Math.max(1, newItem.quantity) * newItem.unitPrice
    };

    setFormData(prev => ({
      ...prev,
      items: [...prev.items, item]
    }));

    setNewItem({ description: '', type: 'consultation', quantity: 1, unitPrice: 25.00 });
    toast.success('Ligne ajoutée', item.description);
  };

  const removeItem = (id: string) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== id)
    }));
  };

  const quickAddItem = (description: string, price: number, type: InvoiceItem['type'] = 'procedure') => {
    const item: InvoiceItem = {
      id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
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
    toast.success('Prestation ajoutée', `${description} (${price} ${currency})`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedPatientId) {
      toast.error('Patient manquant', 'Veuillez sélectionner un patient pour la facture.');
      return;
    }

    if (formData.items.length === 0) {
      toast.error('Facture vide', 'Veuillez ajouter au moins une ligne de prestation.');
      return;
    }

    setLoading(true);

    try {
      const invoiceNumber = `FAC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      const invoice: Invoice = {
        id: `INV-${Date.now()}`,
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
      toast.success('Facture créée avec succès', `Numéro généré : ${invoiceNumber} (${total.toFixed(2)} ${currency})`);
      onClose();
    } catch (err) {
      console.error('Error creating invoice:', err);
      toast.error('Erreur', 'Impossible d\'enregistrer la facture.');
    } finally {
      setLoading(false);
    }
  };

  const quickPresets = [
    { label: 'Consultation Spécialiste', price: 65.00, type: 'consultation' as const },
    { label: 'Échographie Cardiaque', price: 120.00, type: 'procedure' as const },
    { label: 'Bilan Sanguin NFS + Bio', price: 45.00, type: 'procedure' as const },
    { label: 'Forfait Bloc Ambulatoire', price: 350.00, type: 'procedure' as const },
    { label: 'Journée Hospitalisation', price: 180.00, type: 'room' as const }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center font-bold">
            <Receipt className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Émission d'une Nouvelle Facture</h1>
            <p className="text-xs text-gray-500">
              Module de Facturation Hospitalière & Tiers Payant
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-2.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1 : Patient & Dates */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-5">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900 flex items-center gap-2 pb-3 border-b border-gray-100">
            <User className="w-4 h-4 text-cyan-600" />
            <span>1. Patient Facturé & Échéance</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-1">
              <FormField label="Patient Facturé" required={true}>
                <CustomSelect
                  options={patientOptions}
                  value={selectedPatientId}
                  onChange={(val) => setSelectedPatientId(val)}
                  searchable={true}
                  placeholder="Sélectionner un patient..."
                />
              </FormField>
            </div>

            <FormField label="Date d'Émission" required={true}>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-semibold focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
            </FormField>

            <FormField label="Date d'Échéance (Limite)" required={true}>
              <input
                type="date"
                required
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-semibold focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
            </FormField>
          </div>
        </div>

        {/* Section 2 : Lignes de Prestations */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-gray-100">
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900 flex items-center gap-2">
              <Receipt className="w-4 h-4 text-teal-600" />
              <span>2. Lignes de Prestations & Actes Médicaux</span>
            </h2>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] text-gray-500 font-bold flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-500" />
                Ajout rapide :
              </span>
              {quickPresets.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => quickAddItem(preset.label, preset.price, preset.type)}
                  className="px-2.5 py-1 text-[10px] bg-cyan-50 hover:bg-cyan-100 text-cyan-800 rounded-lg font-semibold border border-cyan-200 transition-colors"
                >
                  + {preset.label} ({preset.price} {currency})
                </button>
              ))}
            </div>
          </div>

          {/* Form to add a line */}
          <div className="p-4 bg-slate-50/80 rounded-2xl border border-gray-200 grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
            <div className="sm:col-span-3">
              <label className="block text-[11px] font-bold uppercase text-gray-600 mb-1">Catégorie</label>
              <CustomSelect
                options={itemTypeOptions}
                value={newItem.type}
                onChange={(val) => setNewItem({ ...newItem, type: val as any })}
              />
            </div>

            <div className="sm:col-span-4">
              <label className="block text-[11px] font-bold uppercase text-gray-600 mb-1">Désignation de l'acte</label>
              <input
                type="text"
                value={newItem.description}
                onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                placeholder="Ex: Consultation cardiologie..."
                className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-2xl text-xs font-medium"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[11px] font-bold uppercase text-gray-600 mb-1">Qté</label>
              <input
                type="number"
                min="1"
                value={newItem.quantity}
                onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) || 1 })}
                className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-2xl text-xs font-bold text-center"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[11px] font-bold uppercase text-gray-600 mb-1">Prix ({currency})</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={newItem.unitPrice}
                onChange={(e) => setNewItem({ ...newItem, unitPrice: parseFloat(e.target.value) || 0 })}
                className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-2xl text-xs font-bold text-right"
              />
            </div>

            <div className="sm:col-span-1">
              <button
                type="button"
                onClick={addItem}
                className="w-full py-2.5 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white rounded-2xl font-bold text-xs shadow-sm flex items-center justify-center transition-all"
                title="Ajouter la ligne"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Lines Table */}
          <div className="border border-gray-100 rounded-2xl overflow-hidden shadow-2xs">
            <table className="w-full text-xs">
              <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 font-bold uppercase">
                <tr>
                  <th className="px-4 py-3 text-left">Désignation</th>
                  <th className="px-4 py-3 text-center">Catégorie</th>
                  <th className="px-4 py-3 text-center">Qté</th>
                  <th className="px-4 py-3 text-right">Prix Unitaire</th>
                  <th className="px-4 py-3 text-right">Total</th>
                  <th className="px-4 py-3 text-center w-12">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 bg-white font-medium">
                {formData.items.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-6 text-center text-gray-400">
                      Aucune ligne de facturation. Utilisez le formulaire ci-dessus pour ajouter des prestations.
                    </td>
                  </tr>
                ) : (
                  formData.items.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/50">
                      <td className="px-4 py-3 font-semibold text-gray-900">{item.description}</td>
                      <td className="px-4 py-3 text-center">
                        <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 text-[10px] font-bold uppercase">
                          {item.type}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center font-bold">{item.quantity}</td>
                      <td className="px-4 py-3 text-right text-gray-600">{item.unitPrice.toFixed(2)} {currency}</td>
                      <td className="px-4 py-3 text-right font-bold text-gray-900">{item.total.toFixed(2)} {currency}</td>
                      <td className="px-4 py-3 text-center">
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Financial Summary */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6 pt-4 border-t border-gray-100">
            <div className="w-full sm:max-w-xs space-y-3">
              <FormField label="Remise Commerciale (%)" hint="Pourcentage de réduction éventuel">
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={discountPercent}
                    onChange={(e) => setDiscountPercent(Math.min(100, Math.max(0, parseFloat(e.target.value) || 0)))}
                    className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-bold"
                  />
                  <Percent className="w-3.5 h-3.5 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </FormField>

              <FormField label="Observations / Mentions Légales" value={formData.notes} showWordCount={true}>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Prise en charge tiers-payant CPAM 80%..."
                  className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-2xl text-xs"
                />
              </FormField>
            </div>

            <div className="w-full sm:w-72 bg-gradient-to-br from-slate-50 to-cyan-50/50 p-5 rounded-3xl border border-cyan-100 space-y-2.5 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>Sous-total HT :</span>
                <span className="font-semibold">{subtotal.toFixed(2)} {currency}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Remise ({discountPercent}%) :</span>
                  <span>-{discountAmount.toFixed(2)} {currency}</span>
                </div>
              )}

              {taxRate > 0 && (
                <div className="flex justify-between text-gray-600">
                  <span>TVA ({taxRate}%) :</span>
                  <span>{tax.toFixed(2)} {currency}</span>
                </div>
              )}

              <div className="flex justify-between items-center pt-3 border-t border-cyan-200 text-sm font-extrabold text-gray-900">
                <span>TOTAL À PAYER :</span>
                <span className="text-base text-cyan-700 font-black">{total.toFixed(2)} {currency}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-2xl text-xs font-bold hover:bg-gray-200 transition-colors"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={loading || formData.items.length === 0}
            className="px-8 py-3 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white rounded-2xl text-xs font-bold shadow-lg shadow-teal-600/25 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{loading ? 'Création en cours...' : 'Valider & Créer la Facture'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default InvoiceForm;
