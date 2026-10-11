import React, { useState } from 'react';
import {
  X, Sparkles, Building2, Calendar, Clock, User, Mail, Phone,
  CheckCircle2, ArrowRight, ShieldCheck, HeartPulse, Stethoscope, Dna,
  Send, Layers, BedDouble, Check, Briefcase, AlertCircle, Download
} from 'lucide-react';
import CustomSelect, { SelectOption } from '../common/CustomSelect';

interface DemoRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DemoRequestModal: React.FC<DemoRequestModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    workEmail: '',
    phone: '',
    facilityName: '',
    facilityType: 'CHU / Hôpital Universitaire',
    role: 'Chef de Service Médical',
    bedCapacity: '100 à 500 lits',
    preferredDate: '',
    preferredTime: '10:00 - 11:00',
    selectedModules: ['Dossier Patient Informatisé (DPI)', 'Biotech & Pharmacogénomique (PGx)'],
    notes: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [confirmationNumber, setConfirmationNumber] = useState('');

  if (!isOpen) return null;

  const facilityTypeOptions: SelectOption[] = [
    { value: 'CHU / Hôpital Universitaire', label: 'CHU / Hôpital Universitaire', badge: 'Public', icon: Building2 },
    { value: 'Centre Hospitalier (CH)', label: 'Centre Hospitalier (CH)', badge: 'Public', icon: Building2 },
    { value: 'Clinique Privée / ESPIC', label: 'Clinique Privée / ESPIC', badge: 'Privé', icon: Building2 },
    { value: 'Laboratoire Biotech / LIMS', label: 'Laboratoire Biotech / LIMS', badge: 'Biotech', icon: Dna },
    { value: 'Groupement Hospitalier (GHT)', label: 'Groupement Hospitalier (GHT)', badge: 'Multi-sites', icon: Layers }
  ];

  const roleOptions: SelectOption[] = [
    { value: 'Chef de Service Médical', label: 'Chef de Service Médical / Praticien', badge: 'Médical', icon: Stethoscope },
    { value: 'Directeur d\'Établissement / DG', label: 'Directeur d\'Établissement / DG', badge: 'Direction', icon: Briefcase },
    { value: 'DSI / Responsable SI Santé', label: 'DSI / Responsable SI Santé', badge: 'IT / SIH', icon: ShieldCheck },
    { value: 'Pharmacien Hospitalier Chef (PUI)', label: 'Pharmacien Hospitalier Chef (PUI)', badge: 'Pharmacie', icon: HeartPulse },
    { value: 'Cadre de Santé / Soignant', label: 'Cadre de Santé / Soignant', badge: 'Soins', icon: User },
    { value: 'Biologiste / Responsable Biobanque', label: 'Biologiste / Responsable Biobanque', badge: 'Laboratoire', icon: Dna }
  ];

  const timeSlotOptions: SelectOption[] = [
    { value: '09:00 - 10:00', label: '09:00 - 10:00 (Matin)', badge: 'Matin', icon: Clock },
    { value: '10:00 - 11:00', label: '10:00 - 11:00 (Matin)', badge: 'Recommandé', icon: Clock },
    { value: '11:30 - 12:30', label: '11:30 - 12:30 (Midi)', badge: 'Midi', icon: Clock },
    { value: '14:00 - 15:00', label: '14:00 - 15:00 (Après-midi)', badge: 'Après-midi', icon: Clock },
    { value: '16:00 - 17:00', label: '16:00 - 17:00 (Fin de journée)', badge: 'Après-midi', icon: Clock }
  ];

  const modulesList = [
    'Dossier Patient Informatisé (DPI)',
    'Biotech & Pharmacogénomique (PGx)',
    'Pharmacie & Traçabilité Code-Barres',
    'Aide au Diagnostic Clinique IA',
    'Urgences & Triage Hémodynamique',
    'Gestion des Lits & Admissions'
  ];

  const handleModuleToggle = (module: string) => {
    setFormData(prev => ({
      ...prev,
      selectedModules: prev.selectedModules.includes(module)
        ? prev.selectedModules.filter(m => m !== module)
        : [...prev.selectedModules, module]
    }));
    if (errors.modules) {
      setErrors(prev => ({ ...prev, modules: '' }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.fullName.trim() || formData.fullName.trim().length < 3) {
      newErrors.fullName = 'Veuillez saisir votre nom et prénom (au moins 3 caractères).';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.workEmail.trim() || !emailRegex.test(formData.workEmail.trim())) {
      newErrors.workEmail = 'Veuillez renseigner une adresse email professionnelle valide.';
    }
    if (!formData.facilityName.trim()) {
      newErrors.facilityName = 'Le nom de votre établissement est obligatoire.';
    }
    if (!formData.phone.trim() || formData.phone.trim().length < 8) {
      newErrors.phone = 'Veuillez indiquer un numéro de téléphone joignable.';
    }
    if (formData.selectedModules.length === 0) {
      newErrors.modules = 'Veuillez sélectionner au moins un module d\'intérêt.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    const generatedRef = `DEMO-${Date.now().toString().slice(-6)}`;
    setConfirmationNumber(generatedRef);

    // Save to local storage for persistence & verification
    try {
      const existing = JSON.parse(localStorage.getItem('softcare_demo_requests') || '[]');
      existing.unshift({
        ref: generatedRef,
        date: new Date().toISOString(),
        ...formData
      });
      localStorage.setItem('softcare_demo_requests', JSON.stringify(existing));
    } catch {
      // Ignored
    }

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 700);
  };

  const downloadCalendarInvite = () => {
    const icsContent = `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//SoftCare//Démonstration Médicale//FR\nBEGIN:VEVENT\nSUMMARY:Démonstration Plateforme SoftCare - ${formData.facilityName}\nDESCRIPTION:Démonstration personnalisée SoftCare pour ${formData.fullName}\\nModules: ${formData.selectedModules.join(', ')}\nSTATUS:CONFIRMED\nEND:VEVENT\nEND:VCALENDAR`;
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Demonstration_SoftCare_${confirmationNumber}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto bg-white rounded-3xl shadow-2xl border border-teal-100 flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-gradient-to-r from-slate-900 via-teal-950 to-cyan-950 text-white p-6 rounded-t-3xl flex items-start justify-between">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-500/20 text-teal-300 rounded-full text-xs font-bold border border-teal-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Démonstration Personnalisée & Live</span>
            </div>
            <h2 className="text-2xl font-black tracking-tight text-white">
              Découvrez SoftCare en Situation Réelle
            </h2>
            <p className="text-xs text-cyan-200/80">
              Présentation interactive et personnalisée des fonctionnalités de la plateforme SoftCare.
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 inline-flex items-center justify-center text-white/80 hover:text-white bg-white/10 hover:bg-white/20 active:bg-white/25 rounded-xl border border-white/20 transition-all shrink-0 cursor-pointer"
            title="Fermer"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {isSubmitted ? (
            <div className="text-center py-8 space-y-5 animate-in zoom-in-95 duration-200">
              <div className="w-20 h-20 mx-auto rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200 shadow-inner">
                <CheckCircle2 className="w-10 h-10 animate-pulse" />
              </div>
              <div className="space-y-2">
                <div className="inline-block px-3 py-1 bg-teal-50 border border-teal-200 rounded-full text-xs font-mono font-bold text-teal-800">
                  Réf. {confirmationNumber}
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Demande de Démonstration Confirmée !</h3>
                <p className="text-sm text-gray-600 max-w-md mx-auto">
                  Merci <strong>{formData.fullName}</strong>. Votre demande a été enregistrée avec succès. Un conseiller médical vous contactera à l'adresse <strong>{formData.workEmail}</strong> pour confirmer le créneau du <strong>{formData.preferredDate || 'prochain créneau disponible'}</strong> ({formData.preferredTime}).
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-gray-200 max-w-md mx-auto text-left space-y-2 text-xs text-gray-600">
                <div className="flex justify-between font-semibold text-gray-800">
                  <span>Établissement :</span>
                  <span>{formData.facilityName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Profil & Fonction :</span>
                  <span>{formData.role}</span>
                </div>
                <div className="flex justify-between">
                  <span>Téléphone :</span>
                  <span>{formData.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span>Modules ciblés :</span>
                  <span className="text-teal-700 font-bold">{formData.selectedModules.length} sélectionné(s)</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  onClick={downloadCalendarInvite}
                  className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4 text-slate-600" />
                  <span>Ajouter au calendrier (.ics)</span>
                </button>
                <button
                  onClick={() => {
                    setIsSubmitted(false);
                    onClose();
                  }}
                  className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-teal-600 to-cyan-700 text-white rounded-xl text-xs font-bold shadow-md hover:from-teal-700 hover:to-cyan-800 transition-all"
                >
                  Fermer la fenêtre
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-6">
              {Object.keys(errors).length > 0 && (
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3 text-xs text-rose-800">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Veuillez corriger les champs indiqués :</span>
                    <ul className="list-disc pl-4 mt-1 space-y-0.5 text-[11px]">
                      {Object.values(errors).map((err, i) => (
                        <li key={i}>{err}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Form Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Nom complet */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Nom et Prénom *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="Dr. Alexandre Martin"
                      value={formData.fullName}
                      onChange={e => {
                        setFormData({ ...formData, fullName: e.target.value });
                        if (errors.fullName) setErrors({ ...errors, fullName: '' });
                      }}
                      className={`w-full pl-10 pr-3.5 py-2.5 bg-gray-50/80 border rounded-2xl text-xs font-semibold text-gray-900 focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all ${
                        errors.fullName ? 'border-rose-400 bg-rose-50/30' : 'border-gray-200'
                      }`}
                    />
                  </div>
                </div>

                {/* Email Pro */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Email Professionnel *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    <input
                      type="email"
                      placeholder="alexandre.martin@chu-hopital.fr"
                      value={formData.workEmail}
                      onChange={e => {
                        setFormData({ ...formData, workEmail: e.target.value });
                        if (errors.workEmail) setErrors({ ...errors, workEmail: '' });
                      }}
                      className={`w-full pl-10 pr-3.5 py-2.5 bg-gray-50/80 border rounded-2xl text-xs font-semibold text-gray-900 focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all ${
                        errors.workEmail ? 'border-rose-400 bg-rose-50/30' : 'border-gray-200'
                      }`}
                    />
                  </div>
                </div>

                {/* Téléphone */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Téléphone Professionnel *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    <input
                      type="tel"
                      placeholder="01 42 68 00 00"
                      value={formData.phone}
                      onChange={e => {
                        setFormData({ ...formData, phone: e.target.value });
                        if (errors.phone) setErrors({ ...errors, phone: '' });
                      }}
                      className={`w-full pl-10 pr-3.5 py-2.5 bg-gray-50/80 border rounded-2xl text-xs font-semibold text-gray-900 focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all ${
                        errors.phone ? 'border-rose-400 bg-rose-50/30' : 'border-gray-200'
                      }`}
                    />
                  </div>
                </div>

                {/* Nom établissement */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Nom de l'Établissement / Structure *
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="Centre Hospitalier Universitaire"
                      value={formData.facilityName}
                      onChange={e => {
                        setFormData({ ...formData, facilityName: e.target.value });
                        if (errors.facilityName) setErrors({ ...errors, facilityName: '' });
                      }}
                      className={`w-full pl-10 pr-3.5 py-2.5 bg-gray-50/80 border rounded-2xl text-xs font-semibold text-gray-900 focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all ${
                        errors.facilityName ? 'border-rose-400 bg-rose-50/30' : 'border-gray-200'
                      }`}
                    />
                  </div>
                </div>

                {/* Type d'établissement with CustomSelect */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Type de Structure
                  </label>
                  <CustomSelect
                    options={facilityTypeOptions}
                    value={formData.facilityType}
                    onChange={(val) => setFormData({ ...formData, facilityType: val })}
                    placeholder="Sélectionner le type..."
                  />
                </div>

                {/* Fonction du demandeur with CustomSelect */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Votre Rôle
                  </label>
                  <CustomSelect
                    options={roleOptions}
                    value={formData.role}
                    onChange={(val) => setFormData({ ...formData, role: val })}
                    placeholder="Sélectionner votre fonction..."
                  />
                </div>

                {/* Date souhaitée */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Date Souhaitée
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    <input
                      type="date"
                      value={formData.preferredDate}
                      onChange={e => setFormData({ ...formData, preferredDate: e.target.value })}
                      className="w-full pl-10 pr-3.5 py-2.5 bg-gray-50/80 border border-gray-200 rounded-2xl text-xs font-semibold text-gray-900 focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Créneau horaire with CustomSelect */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Créneau Horaire Préféré
                  </label>
                  <CustomSelect
                    options={timeSlotOptions}
                    value={formData.preferredTime}
                    onChange={(val) => setFormData({ ...formData, preferredTime: val })}
                    placeholder="Sélectionner un horaire..."
                  />
                </div>
              </div>

              {/* Modules d'intérêt */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-700">
                  Modules Spécifiques à Aborder *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {modulesList.map(mod => {
                    const isSelected = formData.selectedModules.includes(mod);
                    return (
                      <button
                        key={mod}
                        type="button"
                        onClick={() => handleModuleToggle(mod)}
                        className={`p-3 rounded-2xl border text-left text-xs font-semibold transition-all flex items-center justify-between cursor-pointer ${
                          isSelected
                            ? 'bg-teal-50/90 border-teal-500 text-teal-900 shadow-xs'
                            : 'bg-gray-50/60 border-gray-200 text-gray-600 hover:bg-gray-100/80'
                        }`}
                      >
                        <span className="truncate pr-2">{mod}</span>
                        {isSelected && <Check className="w-4 h-4 text-teal-600 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
                {errors.modules && (
                  <p className="text-[11px] text-rose-600 font-medium">{errors.modules}</p>
                )}
              </div>

              {/* Note / Message */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Besoins particuliers ou questions spécifiques
                </label>
                <textarea
                  rows={2}
                  placeholder="Ex : Déploiement multi-services, intégration SIH, traçabilité des délivrances..."
                  value={formData.notes}
                  onChange={e => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50/80 border border-gray-200 rounded-2xl text-xs font-medium text-gray-900 focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all resize-none"
                />
              </div>

              {/* Submit Button */}
              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
                  <ShieldCheck className="w-4 h-4 text-teal-600" />
                  <span>Données de contact protégées & confidentielles</span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-700 hover:from-teal-700 hover:to-cyan-800 active:scale-[0.98] text-white rounded-2xl text-xs sm:text-sm font-bold shadow-lg shadow-teal-700/25 transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Enregistrement en cours...</span>
                    </>
                  ) : (
                    <>
                      <span>Confirmer la Démo</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default DemoRequestModal;
