import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { Save, Building2, Upload, Image, Plus, Trash2, CreditCard as Edit2, X, Check } from 'lucide-react';
import { OrganizationSettings, QuickInvoiceItem } from '../../types';

const OrganizationSettingsForm: React.FC = () => {
  const { organizationSettings, setOrganizationSettings } = useApp();
  const [formData, setFormData] = useState<OrganizationSettings>(organizationSettings);
  const [logoPreview, setLogoPreview] = useState<string | null>(organizationSettings.logo || null);
  const [saved, setSaved] = useState(false);
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [newItem, setNewItem] = useState<Partial<QuickInvoiceItem>>({ category: 'consultation', label: '', price: 0, active: true });
  const [showAddItem, setShowAddItem] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (field: keyof OrganizationSettings, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const handleAddQuickItem = () => {
    if (!newItem.label || newItem.price === undefined) return;
    const item: QuickInvoiceItem = {
      id: Date.now().toString(),
      category: newItem.category as QuickInvoiceItem['category'],
      label: newItem.label,
      price: newItem.price,
      active: true,
      order: formData.quickInvoiceItems.filter(i => i.category === newItem.category).length + 1
    };
    setFormData(prev => ({
      ...prev,
      quickInvoiceItems: [...prev.quickInvoiceItems, item]
    }));
    setNewItem({ category: 'consultation', label: '', price: 0, active: true });
    setShowAddItem(false);
    setSaved(false);
  };

  const handleUpdateQuickItem = (id: string, updates: Partial<QuickInvoiceItem>) => {
    setFormData(prev => ({
      ...prev,
      quickInvoiceItems: prev.quickInvoiceItems.map(item =>
        item.id === id ? { ...item, ...updates } : item
      )
    }));
    setSaved(false);
  };

  const handleDeleteQuickItem = (id: string) => {
    setFormData(prev => ({
      ...prev,
      quickInvoiceItems: prev.quickInvoiceItems.filter(item => item.id !== id)
    }));
    setSaved(false);
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      consultation: 'Consultations',
      procedure: 'Actes medicaux',
      lab: 'Laboratoire',
      room: 'Chambres',
      medication: 'Medicaments',
      other: 'Autres'
    };
    return labels[category] || category;
  };

  const quickItemsByCategory = formData.quickInvoiceItems.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, QuickInvoiceItem[]>);

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setLogoPreview(base64);
        setFormData(prev => ({ ...prev, logo: base64 }));
        setSaved(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    setOrganizationSettings({ ...formData, updatedAt: new Date().toISOString() });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <Building2 className="w-5 h-5 text-blue-600" />
          Informations de l'organisation
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Ces informations apparaitront sur les factures, recus et rapports
        </p>
      </div>

      <div className="p-6 space-y-6">
        {/* Logo Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Logo</label>
          <div className="flex items-center gap-6">
            <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50 overflow-hidden">
              {logoPreview ? (
                <img src={logoPreview} alt="Logo" className="w-full h-full object-contain" />
              ) : (
                <Image className="w-12 h-12 text-gray-400" />
              )}
            </div>
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                Choisir un logo
              </button>
              {logoPreview && (
                <button
                  onClick={() => {
                    setLogoPreview(null);
                    setFormData(prev => ({ ...prev, logo: undefined }));
                  }}
                  className="ml-3 text-red-600 hover:text-red-700 text-sm"
                >
                  Supprimer
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Type d'organisation */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Type d'organisation</label>
          <select
            value={formData.type}
            onChange={(e) => handleChange('type', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="hospital">Hopital</option>
            <option value="clinic">Clinique</option>
            <option value="pharmacy">Pharmacie</option>
            <option value="laboratory">Laboratoire</option>
            <option value="health_center">Centre de sante</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nom */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nom</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Adresse */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Adresse</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Ville */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ville</label>
            <input
              type="text"
              value={formData.city}
              onChange={(e) => handleChange('city', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Pays */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Pays</label>
            <input
              type="text"
              value={formData.country}
              onChange={(e) => handleChange('country', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Telephone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Telephone</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Website */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Site web</label>
            <input
              type="url"
              value={formData.website || ''}
              onChange={(e) => handleChange('website', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="www.example.com"
            />
          </div>

          {/* Tax ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Numero fiscal</label>
            <input
              type="text"
              value={formData.taxId || ''}
              onChange={(e) => handleChange('taxId', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Registration Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Numero d'enregistrement</label>
            <input
              type="text"
              value={formData.registrationNumber || ''}
              onChange={(e) => handleChange('registrationNumber', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Banking Information */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Informations bancaires</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Banque</label>
              <input
                type="text"
                value={formData.bankName || ''}
                onChange={(e) => handleChange('bankName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Numero de compte</label>
              <input
                type="text"
                value={formData.bankAccount || ''}
                onChange={(e) => handleChange('bankAccount', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">IBAN</label>
              <input
                type="text"
                value={formData.bankIban || ''}
                onChange={(e) => handleChange('bankIban', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Colors */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Couleurs de marque</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Couleur principale</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={formData.primaryColor}
                  onChange={(e) => handleChange('primaryColor', e.target.value)}
                  className="w-12 h-12 rounded-lg border border-gray-300 cursor-pointer"
                />
                <input
                  type="text"
                  value={formData.primaryColor}
                  onChange={(e) => handleChange('primaryColor', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Couleur d'en-tete</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={formData.headerColor}
                  onChange={(e) => handleChange('headerColor', e.target.value)}
                  className="w-12 h-12 rounded-lg border border-gray-300 cursor-pointer"
                />
                <input
                  type="text"
                  value={formData.headerColor}
                  onChange={(e) => handleChange('headerColor', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Facturation & Finance */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Facturation & Finance</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Devise</label>
              <select
                value={formData.currency || 'EUR'}
                onChange={(e) => {
                  const currency = e.target.value;
                  const symbols: Record<string, string> = {
                    'EUR': '€',
                    'USD': '$',
                    'XOF': 'FCFA',
                    'XAF': 'FCFA',
                    'MAD': 'DH',
                    'DZD': 'DA',
                    'TND': 'DT',
                    'GBP': '£',
                    'CHF': 'CHF'
                  };
                  setFormData(prev => ({
                    ...prev,
                    currency,
                    currencySymbol: symbols[currency] || currency
                  }));
                  setSaved(false);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="EUR">Euro (EUR)</option>
                <option value="USD">Dollar US (USD)</option>
                <option value="XOF">Franc CFA (XOF)</option>
                <option value="XAF">Franc CFA (XAF)</option>
                <option value="MAD">Dirham Marocain (MAD)</option>
                <option value="DZD">Dinar Algérien (DZD)</option>
                <option value="TND">Dinar Tunisien (TND)</option>
                <option value="GBP">Livre Sterling (GBP)</option>
                <option value="CHF">Franc Suisse (CHF)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Symbole</label>
              <input
                type="text"
                value={formData.currencySymbol || '€'}
                onChange={(e) => handleChange('currencySymbol', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nom de la TVA</label>
              <input
                type="text"
                value={formData.taxName || 'TVA'}
                onChange={(e) => handleChange('taxName', e.target.value)}
                placeholder="TVA, Taxe, GST..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Taux TVA (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={formData.taxRate ?? 0}
                onChange={(e) => handleChange('taxRate', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Remise par defaut (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={formData.defaultDiscount ?? 0}
                onChange={(e) => handleChange('defaultDiscount', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Prefixe facture</label>
              <input
                type="text"
                value={formData.invoicePrefix || 'FAC'}
                onChange={(e) => handleChange('invoicePrefix', e.target.value)}
                placeholder="FAC, INV, FAC-2024..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Prefixe recu</label>
              <input
                type="text"
                value={formData.receiptPrefix || 'REC'}
                onChange={(e) => handleChange('receiptPrefix', e.target.value)}
                placeholder="REC, RCP, RECU..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Items de Facturation Rapide */}
        <div className="border-t border-gray-200 pt-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Items de Facturation Rapide</h3>
              <p className="text-sm text-gray-500">Configurez les items predefinis pour la creation rapide de factures</p>
            </div>
            <button
              onClick={() => setShowAddItem(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Ajouter
            </button>
          </div>

          {showAddItem && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Categorie</label>
                  <select
                    value={newItem.category}
                    onChange={(e) => setNewItem(prev => ({ ...prev, category: e.target.value as QuickInvoiceItem['category'] }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="consultation">Consultation</option>
                    <option value="procedure">Acte medical</option>
                    <option value="lab">Laboratoire</option>
                    <option value="room">Chambre</option>
                    <option value="medication">Medicament</option>
                    <option value="other">Autre</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Libelle</label>
                  <input
                    type="text"
                    value={newItem.label}
                    onChange={(e) => setNewItem(prev => ({ ...prev, label: e.target.value }))}
                    placeholder="Ex: Consultation generale"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prix</label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={newItem.price}
                      onChange={(e) => setNewItem(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">{formData.currencySymbol}</span>
                  </div>
                </div>
                <div className="flex items-end gap-2">
                  <button
                    onClick={handleAddQuickItem}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    Valider
                  </button>
                  <button
                    onClick={() => setShowAddItem(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {['consultation', 'procedure', 'lab', 'room', 'medication', 'other'].map(category => {
              const items = quickItemsByCategory[category] || [];
              if (items.length === 0 && !showAddItem) return null;

              return (
                <div key={category} className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">{getCategoryLabel(category)}</h4>
                  {items.length > 0 ? (
                    <div className="space-y-2">
                      {items.sort((a, b) => a.order - b.order).map(item => (
                        <div
                          key={item.id}
                          className={`flex items-center justify-between bg-white rounded-lg p-3 border ${
                            item.active ? 'border-gray-200' : 'border-gray-200 opacity-50'
                          }`}
                        >
                          {editingItem === item.id ? (
                            <div className="flex-1 grid grid-cols-3 gap-3">
                              <input
                                type="text"
                                value={item.label}
                                onChange={(e) => handleUpdateQuickItem(item.id, { label: e.target.value })}
                                className="px-3 py-1.5 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                              />
                              <div className="relative">
                                <input
                                  type="number"
                                  value={item.price}
                                  onChange={(e) => handleUpdateQuickItem(item.id, { price: parseFloat(e.target.value) || 0 })}
                                  className="w-full px-3 py-1.5 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                                />
                                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 text-sm">{formData.currencySymbol}</span>
                              </div>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => setEditingItem(null)}
                                  className="px-3 py-1.5 bg-green-600 text-white rounded hover:bg-green-700"
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => setEditingItem(null)}
                                  className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div className="flex items-center gap-3">
                                <button
                                  onClick={() => handleUpdateQuickItem(item.id, { active: !item.active })}
                                  className={`w-5 h-5 rounded border ${
                                    item.active
                                      ? 'bg-green-500 border-green-500 text-white'
                                      : 'border-gray-300 bg-white'
                                  } flex items-center justify-center`}
                                >
                                  {item.active && <Check className="w-3 h-3" />}
                                </button>
                                <span className="text-gray-900">{item.label}</span>
                              </div>
                              <div className="flex items-center gap-4">
                                <span className="font-medium text-gray-900">
                                  {item.price.toFixed(2)} {formData.currencySymbol}
                                </span>
                                <button
                                  onClick={() => setEditingItem(item.id)}
                                  className="text-blue-600 hover:text-blue-800"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteQuickItem(item.id)}
                                  className="text-red-600 hover:text-red-800"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 italic">Aucun item dans cette categorie</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200">
          {saved && (
            <span className="text-green-600 text-sm font-medium">Modifications enregistrees!</span>
          )}
          <button
            onClick={handleSave}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Enregistrer les modifications
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrganizationSettingsForm;
