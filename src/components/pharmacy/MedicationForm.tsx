import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Save, Loader2, Barcode, QrCode, Sparkles, Snowflake, Dna } from 'lucide-react';
import { generateBarcode128Svg, generateQrCodeSvg } from '../../utils/barcodeUtils';
import { Medication } from '../../types';

interface MedicationFormProps {
  medicationId?: string | null;
  onClose: () => void;
}

const MedicationForm: React.FC<MedicationFormProps> = ({ medicationId, onClose }) => {
  const { medications, addMedication, updateMedication } = useApp();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    genericName: '',
    category: '',
    stock: 0,
    minStock: 10,
    unitPrice: 0,
    expiryDate: '',
    batchNumber: '',
    barcode: '',
    supplier: '',
    dosageForm: 'tablet' as Medication['dosageForm'],
    strength: '',
    location: '',
    storageCondition: 'ambient' as NonNullable<Medication['storageCondition']>,
    isBiotech: false,
    atcCode: ''
  });

  useEffect(() => {
    if (medicationId) {
      const medication = medications.find(m => m.id === medicationId);
      if (medication) {
        setFormData({
          name: medication.name,
          genericName: medication.genericName || '',
          category: medication.category || '',
          stock: medication.stock || 0,
          minStock: medication.minStock || 10,
          unitPrice: medication.unitPrice || medication.price || 0,
          expiryDate: medication.expiryDate || '',
          batchNumber: medication.batchNumber || '',
          barcode: medication.barcode || '',
          supplier: medication.supplier || '',
          dosageForm: medication.dosageForm || 'tablet',
          strength: medication.strength || '',
          location: medication.location || '',
          storageCondition: medication.storageCondition || 'ambient',
          isBiotech: !!medication.isBiotech,
          atcCode: medication.atcCode || ''
        });
      }
    } else {
      // Pré-génération automatique d'un numéro de lot et code-barre
      const randomSuffix = Math.floor(100000 + Math.random() * 900000);
      const year = new Date().getFullYear();
      setFormData(prev => ({
        ...prev,
        batchNumber: `LT-${year}-${Math.floor(100 + Math.random() * 900)}`,
        barcode: `34009${randomSuffix}`
      }));
    }
  }, [medicationId, medications]);

  const handleGenerateBarcode = () => {
    const randomCode = `34009${Math.floor(10000000 + Math.random() * 90000000).toString().slice(0, 8)}`;
    setFormData(prev => ({ ...prev, barcode: randomCode }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const medicationData: Partial<Medication> = {
        name: formData.name,
        genericName: formData.genericName,
        category: formData.category,
        stock: formData.stock,
        minStock: formData.minStock,
        unitPrice: formData.unitPrice,
        price: formData.unitPrice,
        expiryDate: formData.expiryDate,
        batchNumber: formData.batchNumber,
        barcode: formData.barcode || `MED-${formData.batchNumber}`,
        qrCode: `SOFTCARE|MED:${formData.name}|CODE:${formData.barcode}|LOT:${formData.batchNumber}|EXP:${formData.expiryDate}`,
        supplier: formData.supplier,
        dosageForm: formData.dosageForm,
        strength: formData.strength,
        location: formData.location,
        storageCondition: formData.storageCondition,
        isBiotech: formData.isBiotech,
        atcCode: formData.atcCode
      };

      if (medicationId) {
        await updateMedication(medicationId, medicationData);
      } else {
        await addMedication(medicationData);
      }

      onClose();
    } catch (err) {
      console.error('Error saving medication:', err);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    'Antalgique',
    'Antalgique Palier 2',
    'Antibiotique',
    'Anti-inflammatoire',
    'Antiagrégant',
    'Antidiabétique',
    'Bronchodilatateur',
    'Cardiovasculaire',
    'Digestif',
    'Neurologique',
    'Oncologie / Biothérapie',
    'Autre'
  ];

  const dosageForms: { value: NonNullable<Medication['dosageForm']>; label: string }[] = [
    { value: 'tablet', label: 'Comprimé' },
    { value: 'capsule', label: 'Gélule / Capsule' },
    { value: 'syrup', label: 'Sirop / Solution buvable' },
    { value: 'injection', label: 'Injectable (Ampoule/Flacon)' },
    { value: 'cream', label: 'Pommade / Crème' },
    { value: 'drops', label: 'Gouttes / Collyre' }
  ];

  const storageOptions = [
    { value: 'ambient', label: '🌡️ Température Ambiante (15-25°C)' },
    { value: 'cold_2_8', label: '❄️ Réfrigéré (2-8°C Chaîne du froid)' },
    { value: 'frozen_minus_20', label: '🧊 Congélateur (-20°C)' },
    { value: 'cryo_minus_80', label: '🧬 Cryogénique (-80°C Biotech)' }
  ];

  const previewBarcode = formData.barcode || '3400930000000';
  const previewBarcodeSvg = generateBarcode128Svg(previewBarcode, { height: 36, barWidth: 1.6 });
  const previewQrSvg = generateQrCodeSvg(`SOFTCARE|${formData.name || 'MED'}|${previewBarcode}`, { size: 68 });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-600 text-white flex items-center justify-center shadow-lg shadow-teal-500/20">
            <Barcode className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              {medicationId ? 'Modifier Médicament & Traçabilité' : 'Nouveau Médicament & Code-barres'}
            </h1>
            <p className="text-xs text-gray-500">
              Identification unique par lot, code-barres GS1/CIP, conservation et profil Biotech.
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="border-b border-gray-100 pb-4">
              <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                <span>1. Informations Générales</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Nom commercial *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ex: Plavix 75mg, Doliprane 1000mg"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Nom générique / DCI
                  </label>
                  <input
                    type="text"
                    value={formData.genericName}
                    onChange={(e) => setFormData({ ...formData, genericName: e.target.value })}
                    placeholder="Ex: Clopidogrel, Paracétamol"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Catégorie Thérapeutique *
                  </label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all"
                  >
                    <option value="">Sélectionner une catégorie</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Forme galénique
                  </label>
                  <select
                    value={formData.dosageForm}
                    onChange={(e) => setFormData({ ...formData, dosageForm: e.target.value as Medication['dosageForm'] })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all"
                  >
                    {dosageForms.map(form => (
                      <option key={form.value} value={form.value}>{form.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Dosage / Concentration
                  </label>
                  <input
                    type="text"
                    value={formData.strength}
                    onChange={(e) => setFormData({ ...formData, strength: e.target.value })}
                    placeholder="Ex: 500mg, 100 U/ml, 10mg/2ml"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Fournisseur / Laboratoire
                  </label>
                  <input
                    type="text"
                    value={formData.supplier}
                    onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                    placeholder="Ex: Sanofi, Roche, Biogaran"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Section 2 : Traçabilité & Codes-barres */}
            <div className="border-b border-gray-100 pb-4">
              <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Barcode className="w-4 h-4 text-cyan-600" />
                <span>2. Traçabilité, Lot & Code-barres</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Numéro de lot (Batch Number) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.batchNumber}
                    onChange={(e) => setFormData({ ...formData, batchNumber: e.target.value })}
                    placeholder="Ex: LT-2026-X01"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-mono focus:bg-white focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-xs font-semibold text-gray-700">
                      Code-barres (EAN / CIP / GS1) *
                    </label>
                    <button
                      type="button"
                      onClick={handleGenerateBarcode}
                      className="text-xs text-cyan-600 hover:text-cyan-700 font-medium flex items-center gap-1"
                    >
                      <Sparkles className="w-3 h-3" /> Auto-générer
                    </button>
                  </div>
                  <input
                    type="text"
                    required
                    value={formData.barcode}
                    onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                    placeholder="Ex: 3400938472910"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-mono focus:bg-white focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Date d'expiration *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Condition de Conservation
                  </label>
                  <select
                    value={formData.storageCondition}
                    onChange={(e) => setFormData({ ...formData, storageCondition: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all"
                  >
                    {storageOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Section 3 : Stock & Tarifs */}
            <div className="border-b border-gray-100 pb-4">
              <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                <span>3. Stock, Emplacement & Prix</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Stock actuel *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold focus:bg-white focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Seuil d'alerte min *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.minStock}
                    onChange={(e) => setFormData({ ...formData, minStock: parseInt(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Prix unitaire (€) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={formData.unitPrice}
                    onChange={(e) => setFormData({ ...formData, unitPrice: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold focus:bg-white focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all"
                  />
                </div>

                <div className="md:col-span-3">
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Emplacement physique
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Ex: Armoire B, Tiroir 3, Réfrigérateur R1"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Section 4 : Biotech & PGx */}
            <div className="p-4 bg-purple-50/60 rounded-2xl border border-purple-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-md">
                  <Dna className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-sm text-purple-950">Biothérapie & Pharmacogénomique (PGx)</span>
                  <p className="text-xs text-purple-700">
                    Active les contrôles d'interactions gène-médicament (CYP2D6, CYP2C19, DPYD) et le suivi biotechnologique.
                  </p>
                </div>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isBiotech}
                  onChange={(e) => setFormData({ ...formData, isBiotech: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-5 py-2.5 text-gray-700 bg-gray-100 rounded-xl text-sm font-semibold hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700 text-white rounded-xl text-sm font-semibold shadow-lg shadow-teal-500/25 flex items-center gap-2 transition-all hover:scale-[1.02] disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>{loading ? 'Enregistrement...' : (medicationId ? 'Enregistrer les modifications' : 'Créer le Médicament')}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Live Preview Column */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sticky top-6">
            <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-4 flex items-center justify-between">
              <span>Aperçu de l'étiquette</span>
              <span className="text-[10px] bg-cyan-100 text-cyan-800 px-2 py-0.5 rounded-full font-mono">En direct</span>
            </h3>

            {/* Visual Card */}
            <div className="p-4 bg-slate-50 border-2 border-dashed border-cyan-500/50 rounded-2xl space-y-3">
              <div className="flex justify-between items-start border-b border-gray-200 pb-2">
                <div>
                  <h4 className="font-bold text-sm text-gray-900 leading-tight">
                    {formData.name || 'Nom du médicament'}
                  </h4>
                  <p className="text-[11px] text-gray-500 italic">
                    {formData.genericName || 'DCI non spécifiée'}
                  </p>
                </div>
                {formData.isBiotech && (
                  <span className="px-2 py-0.5 text-[9px] font-bold bg-purple-100 text-purple-700 rounded-full">
                    🧬 PGx
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between gap-2 text-[10px] text-gray-600 bg-white p-2.5 rounded-xl border border-gray-200">
                <div className="space-y-1">
                  <div><strong>Lot :</strong> <span className="font-mono">{formData.batchNumber || 'LT-2026-X'}</span></div>
                  <div><strong>Exp :</strong> <span className="text-rose-600 font-bold">{formData.expiryDate || 'AAAA-MM-JJ'}</span></div>
                  <div><strong>Stock :</strong> {formData.stock} u.</div>
                </div>
                <div className="flex-shrink-0" dangerouslySetInnerHTML={{ __html: previewQrSvg }} />
              </div>

              <div className="pt-2 text-center flex flex-col items-center">
                <div dangerouslySetInnerHTML={{ __html: previewBarcodeSvg }} className="max-w-full overflow-hidden" />
              </div>
            </div>

            <div className="mt-4 p-3 bg-cyan-50/60 rounded-xl text-xs text-cyan-900 space-y-1.5">
              <div className="flex items-center gap-1.5 font-semibold">
                <Snowflake className="w-3.5 h-3.5 text-cyan-600" />
                <span>Chaîne de conservation :</span>
              </div>
              <p className="text-[11px] text-cyan-800">
                {storageOptions.find(o => o.value === formData.storageCondition)?.label}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicationForm;