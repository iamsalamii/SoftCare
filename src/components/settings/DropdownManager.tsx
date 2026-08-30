import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Plus, Trash2, CreditCard as Edit2, Save, X, ChevronDown, Settings } from 'lucide-react';
import { DropdownOption } from '../../types';

const CATEGORY_LABELS: Record<string, string> = {
  appointment_type: 'Types de rendez-vous',
  record_type: 'Types de dossiers medicaux',
  payment_method: 'Methodes de paiement',
  bed_type: 'Types de lits',
  medication_category: 'Categories de medicaments',
  user_role: 'Roles utilisateurs',
  invoice_status: 'Statuts de facture',
  surgery_type: 'Types de chirurgie',
  lab_test_category: 'Categories d\'analyses',
  urgency_level: 'Niveaux d\'urgence',
};

const DropdownManager: React.FC = () => {
  const { dropdownOptions, addDropdownOption, updateDropdownOption, deleteDropdownOption } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('appointment_type');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newOption, setNewOption] = useState({ value: '', label: '' });

  const categories = [...new Set(dropdownOptions.map(o => o.category))];

  const currentOptions = dropdownOptions
    .filter(o => o.category === selectedCategory)
    .sort((a, b) => a.order - b.order);

  const handleAdd = () => {
    if (!newOption.value || !newOption.label) return;

    const maxOrder = Math.max(...currentOptions.map(o => o.order), 0);
    const option: DropdownOption = {
      id: Date.now().toString(),
      category: selectedCategory,
      value: newOption.value.toLowerCase().replace(/\s+/g, '-'),
      label: newOption.label,
      order: maxOrder + 1,
      active: true,
      createdAt: new Date().toISOString()
    };

    addDropdownOption(option);
    setNewOption({ value: '', label: '' });
    setShowAddForm(false);
  };

  const handleUpdate = (id: string, field: 'value' | 'label' | 'active', value: string | boolean) => {
    updateDropdownOption(id, { [field]: value });
  };

  const handleDelete = (id: string) => {
    if (confirm('Supprimer cette option?')) {
      deleteDropdownOption(id);
    }
  };

  const handleMoveUp = (option: DropdownOption) => {
    const prevOption = currentOptions.find(o => o.order === option.order - 1);
    if (prevOption) {
      updateDropdownOption(option.id, { order: option.order - 1 });
      updateDropdownOption(prevOption.id, { order: prevOption.order + 1 });
    }
  };

  const handleMoveDown = (option: DropdownOption) => {
    const nextOption = currentOptions.find(o => o.order === option.order + 1);
    if (nextOption) {
      updateDropdownOption(option.id, { order: option.order + 1 });
      updateDropdownOption(nextOption.id, { order: nextOption.order - 1 });
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <Settings className="w-5 h-5 text-blue-600" />
          Gestion des listes et outils
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Creez et modifiez les options des menus deroulants de l'application
        </p>
      </div>

      <div className="p-6">
        {/* Category Selector */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Categorie</label>
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full md:w-96 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {CATEGORY_LABELS[cat] || cat}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Options List */}
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">
              {currentOptions.length} option(s)
            </span>
            <button
              onClick={() => setShowAddForm(true)}
              className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              Ajouter
            </button>
          </div>

          {showAddForm && (
            <div className="bg-blue-50 px-4 py-4 border-b border-blue-200">
              <div className="flex flex-col md:flex-row gap-3">
                <input
                  type="text"
                  placeholder="Valeur (ex: consultation)"
                  value={newOption.value}
                  onChange={(e) => setNewOption(prev => ({ ...prev, value: e.target.value }))}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Libelle (ex: Consultation)"
                  value={newOption.label}
                  onChange={(e) => setNewOption(prev => ({ ...prev, label: e.target.value }))}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleAdd}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-1"
                  >
                    <Save className="w-4 h-4" />
                    Sauvegarder
                  </button>
                  <button
                    onClick={() => {
                      setShowAddForm(false);
                      setNewOption({ value: '', label: '' });
                    }}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="divide-y divide-gray-200">
            {currentOptions.map((option, index) => (
              <div
                key={option.id}
                className={`px-4 py-3 flex items-center gap-4 ${!option.active ? 'bg-gray-100' : ''}`}
              >
                <span className="text-sm text-gray-400 w-8">{index + 1}</span>

                {editingId === option.id ? (
                  <>
                    <input
                      type="text"
                      value={option.value}
                      onChange={(e) => handleUpdate(option.id, 'value', e.target.value)}
                      className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                    <input
                      type="text"
                      value={option.label}
                      onChange={(e) => handleUpdate(option.id, 'label', e.target.value)}
                      className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                    <button
                      onClick={() => setEditingId(null)}
                      className="p-1.5 text-green-600 hover:bg-green-50 rounded"
                    >
                      <Save className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded font-mono">
                      {option.value}
                    </span>
                    <span className="flex-1 text-gray-900">{option.label}</span>

                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={option.active}
                        onChange={(e) => handleUpdate(option.id, 'active', e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-600">Actif</span>
                    </label>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleMoveUp(option)}
                        disabled={index === 0}
                        className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                      >
                        ▲
                      </button>
                      <button
                        onClick={() => handleMoveDown(option)}
                        disabled={index === currentOptions.length - 1}
                        className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                      >
                        ▼
                      </button>
                    </div>

                    <button
                      onClick={() => setEditingId(option.id)}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(option.id)}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            ))}

            {currentOptions.length === 0 && (
              <div className="px-4 py-8 text-center text-gray-500">
                Aucune option dans cette categorie. Cliquez sur "Ajouter" pour en creer une.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DropdownManager;
