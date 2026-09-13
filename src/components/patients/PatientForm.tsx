import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Save, User, Phone, MapPin, Heart, Shield, AlertTriangle, Building2, Calendar } from 'lucide-react';
import CustomSelect from '../common/CustomSelect';
import FormField from '../common/FormField';

interface PatientFormProps {
  patientId?: string | null;
  onClose: () => void;
}

export const PatientForm: React.FC<PatientFormProps> = ({ patientId, onClose }) => {
  const { patients, addPatient, updatePatient, insurances, getDropdownOptions } = useApp();
  const [loading, setLoading] = useState(false);
  const [noInsurance, setNoInsurance] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: 'male' as 'male' | 'female' | 'other',
    phone: '',
    email: '',
    address: '',
    city: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelationship: 'Conjoint(e)',
    bloodType: '',
    socialSecurityNumber: '',
    insuranceName: '',
    insurancePolicyNumber: '',
    allergies: '',
    notes: ''
  });

  // Dynamic Dictionaries — villes (vide par défaut pour compatibilité internationale)
  const cityDropdown = getDropdownOptions ? getDropdownOptions('city') : [];
  const cityOptions = cityDropdown.length > 0
    ? cityDropdown.map(c => ({ value: c.value, label: c.label }))
    : [];

  const relDropdown = getDropdownOptions ? getDropdownOptions('relationship') : [];
  const relationshipOptions = relDropdown.length > 0
    ? relDropdown.map(r => ({ value: r.value, label: r.label }))
    : [
        { value: 'Conjoint(e)', label: 'Conjoint(e) / Époux(se)' },
        { value: 'Parent', label: 'Père / Mère' },
        { value: 'Enfant', label: 'Fils / Fille' },
        { value: 'Frère / Sœur', label: 'Frère / Sœur' },
        { value: 'Ami(e)', label: 'Ami(e) / Proche' },
        { value: 'Tuteur légal', label: 'Tuteur / Mandataire légal' }
      ];

  // Insurance Options from Settings or presets with custom support
  const insDropdown = getDropdownOptions ? getDropdownOptions('insurance_provider') : [];
  const insuranceOptions = insDropdown.length > 0
    ? insDropdown.map(i => ({ value: i.value, label: i.label, badge: 'Organisme' }))
    : (insurances && insurances.length > 0
      ? insurances.map(ins => ({ value: ins.name, label: ins.name, badge: `${ins.coverageRate || 80}%` }))
      : [
          { value: 'CPAM / Sécurité Sociale', label: 'CPAM / Sécurité Sociale', badge: 'Régime Général' },
          { value: 'MGEN', label: 'MGEN (Mutuelle Générale)', badge: 'Mutuelle' },
          { value: 'Harmonie Mutuelle', label: 'Harmonie Mutuelle', badge: 'Complémentaire' },
          { value: 'Alan Santé', label: 'Alan Santé Pro', badge: '100% Santé' },
          { value: 'AXA Santé & Prévoyance', label: 'AXA Santé & Prévoyance', badge: 'Tiers Payant' },
          { value: 'Malakoff Humanis', label: 'Malakoff Humanis', badge: 'Complémentaire' },
          { value: 'SwissLife Santé', label: 'SwissLife Santé', badge: 'Privé' },
          { value: 'Sans Mutuelle / Aide Médicale État (AME)', label: 'Sans Mutuelle / AME', badge: 'Aide d\'État' }
        ]);

  const bloodTypeOptions = [
    { value: '', label: 'Inconnu / À déterminer par analyse', badge: 'Non déterminé' },
    { value: 'A+', label: 'A Positif (A+)', badge: 'Rhésus +' },
    { value: 'A-', label: 'A Négatif (A-)', badge: 'Rhésus -' },
    { value: 'B+', label: 'B Positif (B+)', badge: 'Rhésus +' },
    { value: 'B-', label: 'B Négatif (B-)', badge: 'Rhésus -' },
    { value: 'AB+', label: 'AB Positif (AB+)', badge: 'Receveur Universel' },
    { value: 'AB-', label: 'AB Négatif (AB-)', badge: 'Rhésus -' },
    { value: 'O+', label: 'O Positif (O+)', badge: 'Fréquent' },
    { value: 'O-', label: 'O Négatif (O-)', badge: 'Donneur Universel' }
  ];

  const genderOptions = [
    { value: 'male', label: 'Masculin (Homme)' },
    { value: 'female', label: 'Féminin (Femme)' },
    { value: 'other', label: 'Autre / Non spécifié' }
  ];

  useEffect(() => {
    if (patientId) {
      const patient = patients.find(p => p.id === patientId);
      if (patient) {
        setFormData({
          firstName: patient.firstName || '',
          lastName: patient.lastName || '',
          dateOfBirth: patient.dateOfBirth ? patient.dateOfBirth.slice(0, 10) : '',
          gender: (patient.gender as any) || 'male',
          phone: patient.phone || '',
          email: patient.email || '',
          address: patient.address || '',
          city: patient.city || 'Paris',
          emergencyContactName: patient.emergencyContactName || (typeof patient.emergencyContact === 'object' ? patient.emergencyContact?.name : '') || '',
          emergencyContactPhone: patient.emergencyContactPhone || (typeof patient.emergencyContact === 'object' ? patient.emergencyContact?.phone : '') || '',
          emergencyContactRelationship: patient.emergencyContactRelationship || 'Proche',
          bloodType: patient.bloodType || (patient as any).bloodGroup || 'A+',
          socialSecurityNumber: patient.socialSecurityNumber || '',
          insuranceName: patient.insuranceName || patient.insuranceId || 'CPAM / Sécurité Sociale',
          insurancePolicyNumber: patient.insurancePolicyNumber || '',
          allergies: Array.isArray(patient.allergies) ? patient.allergies.join(', ') : '',
          notes: (patient as any).notes || ''
        });
      }
    }
  }, [patientId, patients]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const patientPayload = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        address: formData.address.trim(),
        city: formData.city.trim(),
        emergencyContactName: formData.emergencyContactName.trim(),
        emergencyContactPhone: formData.emergencyContactPhone.trim(),
        emergencyContactRelationship: formData.emergencyContactRelationship,
        bloodType: formData.bloodType,
        socialSecurityNumber: formData.socialSecurityNumber.trim(),
        insuranceId: formData.insuranceName,
        insuranceName: formData.insuranceName,
        insurancePolicyNumber: formData.insurancePolicyNumber.trim(),
        allergies: formData.allergies
          ? formData.allergies.split(',').map(a => a.trim()).filter(Boolean)
          : []
      };

      if (patientId) {
        await updatePatient(patientId, patientPayload);
      } else {
        await addPatient(patientPayload);
      }

      onClose();
    } catch (err) {
      console.error('Error saving patient:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top bar */}
      <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center font-bold">
            <User className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {patientId ? 'Modifier le Dossier Patient' : 'Création d\'un Nouveau Dossier Patient'}
            </h1>
            <p className="text-xs text-gray-500">
              Les champs marqués d'une étoile rouge (<span className="text-rose-500 font-bold">*</span>) sont requis pour l'immatriculation sanitaire.
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
        {/* Section 1: État Civil & Identité */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-5">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900 flex items-center gap-2 pb-3 border-b border-gray-100">
            <User className="w-4 h-4 text-cyan-600" />
            <span>1. État Civil & Identification Sécurité Sociale</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <FormField label="Prénom" required={true}>
              <input
                type="text"
                required
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                placeholder="Ex: Jean"
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-semibold focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
            </FormField>

            <FormField label="Nom de Famille" required={true}>
              <input
                type="text"
                required
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                placeholder="Ex: Dupont"
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-semibold focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
            </FormField>

            <FormField label="Date de Naissance" required={true}>
              <input
                type="date"
                required
                value={formData.dateOfBirth}
                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-semibold focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
            </FormField>

            <FormField label="Sexe / Genre" required={true}>
              <CustomSelect
                options={genderOptions}
                value={formData.gender}
                onChange={(val) => setFormData({ ...formData, gender: val as any })}
              />
            </FormField>

            <FormField label="Numéro d'Identification Sanitaire / NIR" hint="Optionnel — selon pays (sécurité sociale, carte patient, passeport sanitaire)">
              <input
                type="text"
                value={formData.socialSecurityNumber}
                onChange={(e) => setFormData({ ...formData, socialSecurityNumber: e.target.value })}
                placeholder="NIR, Numéro CNSS, ID Sanitaire National..."
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-mono font-bold focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
            </FormField>

            <FormField label="Groupe Sanguin" hint="Optionnel — à renseigner après analyse si non connu">
              <CustomSelect
                options={bloodTypeOptions}
                value={formData.bloodType}
                onChange={(val) => setFormData({ ...formData, bloodType: val })}
                placeholder="Sélectionner si connu..."
              />
            </FormField>
          </div>
        </div>

        {/* Section 2: Contact & Adresse */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-5">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900 flex items-center gap-2 pb-3 border-b border-gray-100">
            <Phone className="w-4 h-4 text-teal-600" />
            <span>2. Coordonnées & Adresse de Résidence</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <FormField label="Téléphone Mobile" required={true}>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+XXX XX XX XX XX (ex: +225 07 12 34 56)"
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-medium focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
            </FormField>

            <FormField label="Email">
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="jean.dupont@email.fr"
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-medium focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
            </FormField>

            <FormField label="Ville">
              <CustomSelect
                options={cityOptions}
                value={formData.city}
                onChange={(val) => setFormData({ ...formData, city: val })}
                searchable={true}
                allowCustom={true}
                placeholder="Saisir ou sélectionner une ville..."
              />
            </FormField>

            <div className="sm:col-span-2 lg:col-span-3">
              <FormField label="Adresse Complète">
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="123 Rue de la République"
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-medium focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                />
              </FormField>
            </div>
          </div>
        </div>

        {/* Section 3: Assurance & Tiers Payant (Combo Box Paramétrable) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-gray-100">
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900 flex items-center gap-2">
              <Shield className="w-4 h-4 text-cyan-600" />
              <span>3. Couverture Santé & Organisme d'Assurance</span>
            </h2>
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-gray-600 bg-gray-50 hover:bg-gray-100 px-3 py-1.5 rounded-xl border border-gray-200 transition-colors">
              <input
                type="checkbox"
                checked={noInsurance}
                onChange={(e) => {
                  setNoInsurance(e.target.checked);
                  if (e.target.checked) {
                    setFormData(prev => ({ ...prev, insuranceName: 'Sans Mutuelle / Paiement Direct', insurancePolicyNumber: 'N/A' }));
                  } else {
                    setFormData(prev => ({ ...prev, insuranceName: 'CPAM / Sécurité Sociale', insurancePolicyNumber: '' }));
                  }
                }}
                className="rounded text-cyan-600 focus:ring-cyan-500"
              />
              <span>Sans couverture / Paiement Direct</span>
            </label>
          </div>

          {!noInsurance ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Organisme d'Assurance / Mutuelle" hint="Optionnel — sélectionner ou saisir">
                <CustomSelect
                  options={insuranceOptions}
                  value={formData.insuranceName}
                  onChange={(val) => setFormData({ ...formData, insuranceName: val })}
                  searchable={true}
                  allowCustom={true}
                  placeholder="CNAM, CNSS, Mutuelle, Assurance privée..."
                />
              </FormField>

              <FormField label="Numéro d'Adhérent / Police Mutuelle">
                <input
                  type="text"
                  value={formData.insurancePolicyNumber}
                  onChange={(e) => setFormData({ ...formData, insurancePolicyNumber: e.target.value })}
                  placeholder="MUT-88492-X"
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-mono focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                />
              </FormField>
            </div>
          ) : (
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 text-xs text-gray-600">
              <p className="font-semibold text-gray-800">Mode de facturation directe activé</p>
              <p className="mt-0.5">Le patient règlera l'intégralité des prestations et honoraires directement sans prise en charge par un tiers payeur.</p>
            </div>
          )}
        </div>

        {/* Section 4: Contact d'Urgence & Allergies */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-5">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900 flex items-center gap-2 pb-3 border-b border-gray-100">
            <Heart className="w-4 h-4 text-rose-500" />
            <span>4. Personne de Confiance & Allergies Médicamenteuses</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FormField label="Nom Personne de Confiance">
              <input
                type="text"
                value={formData.emergencyContactName}
                onChange={(e) => setFormData({ ...formData, emergencyContactName: e.target.value })}
                placeholder="Marie Dupont"
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-medium"
              />
            </FormField>

            <FormField label="Lien de Parenté">
              <CustomSelect
                options={relationshipOptions}
                value={formData.emergencyContactRelationship}
                onChange={(val) => setFormData({ ...formData, emergencyContactRelationship: val })}
                searchable={true}
                allowCustom={true}
                placeholder="Sélectionner ou saisir..."
              />
            </FormField>

            <FormField label="Téléphone d'Urgence">
              <input
                type="tel"
                value={formData.emergencyContactPhone}
                onChange={(e) => setFormData({ ...formData, emergencyContactPhone: e.target.value })}
                placeholder="+33 6 98 76 54 32"
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-medium"
              />
            </FormField>

            <div className="sm:col-span-3">
              <FormField
                label="Allergies et Contre-indications Notifiées"
                hint="Séparer les substances par des virgules (ex: Pénicilline, Aspirine, Latex)"
                value={formData.allergies}
                showWordCount={true}
              >
                <input
                  type="text"
                  value={formData.allergies}
                  onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                  placeholder="Pénicilline, Sulfamides, Latex, Arachide..."
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-medium"
                />
              </FormField>
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
            disabled={loading}
            className="px-8 py-3 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white rounded-2xl text-xs font-bold shadow-lg shadow-teal-600/25 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{loading ? 'Enregistrement...' : (patientId ? 'Mettre à Jour le Dossier' : 'Enregistrer le Patient')}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default PatientForm;