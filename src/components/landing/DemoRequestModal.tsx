import React, { useState } from 'react';
import {
  X, Sparkles, Building2, Calendar, Clock, User, Mail, Phone,
  CheckCircle2, ArrowRight, ShieldCheck, HeartPulse, Stethoscope, Dna,
  Send, Layers, BedDouble, Check
} from 'lucide-react';

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

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

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
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto bg-white rounded-3xl shadow-2xl border border-teal-100 flex flex-col">
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
              Session interactive de 30 min animée par un ingénieur biomédical & spécialiste hospitalier
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {isSubmitted ? (
            <div className="text-center py-10 space-y-5 animate-in zoom-in-95 duration-200">
              <div className="w-20 h-20 mx-auto rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200 shadow-inner">
                <CheckCircle2 className="w-10 h-10 animate-pulse" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-gray-900">Demande de Démo Enregistrée !</h3>
                <p className="text-sm text-gray-600 max-w-md mx-auto">
                  Merci <strong>{formData.fullName}</strong>. Un spécialiste hospitalier SoftCare vous contactera sous 24h à l'adresse <strong>{formData.workEmail}</strong> pour confirmer le créneau du <strong>{formData.preferredDate || 'prochain créneau disponible'}</strong> ({formData.preferredTime}).
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-gray-200 max-w-md mx-auto text-left space-y-2 text-xs text-gray-600">
                <div className="flex justify-between font-semibold text-gray-800">
                  <span>Établissement :</span>
                  <span>{formData.facilityName || 'Établissement de Santé'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Profil :</span>
                  <span>{formData.role}</span>
                </div>
                <div className="flex justify-between">
                  <span>Modules ciblés :</span>
                  <span className="text-cyan-700 font-bold">{formData.selectedModules.length} sélectionné(s)</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setIsSubmitted(false);
                  onClose();
                }}
                className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-teal-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-teal-600/20 hover:scale-[1.02] transition-transform"
              >
                Fermer la fenêtre
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Form Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Nom complet */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Nom et Prénom *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      required
                      placeholder="Dr. Alexandre Martin"
                      value={formData.fullName}
                      onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 focus:bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Email professionnel */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Email Professionnel *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      required
                      placeholder="a.martin@chu-paris.fr"
                      value={formData.workEmail}
                      onChange={e => setFormData({ ...formData, workEmail: e.target.value })}
                      className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 focus:bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Téléphone */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Téléphone
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="tel"
                      placeholder="+33 1 42 68 00 00"
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 focus:bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Nom de l'établissement */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Nom de l'Établissement *
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      required
                      placeholder="CHU de Lyon / Clinique Saint-Jean"
                      value={formData.facilityName}
                      onChange={e => setFormData({ ...formData, facilityName: e.target.value })}
                      className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 focus:bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Type d'établissement */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Type d'Établissement
                  </label>
                  <select
                    value={formData.facilityType}
                    onChange={e => setFormData({ ...formData, facilityType: e.target.value })}
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 focus:bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition-all"
                  >
                    <option value="CHU / Hôpital Universitaire">CHU / Hôpital Universitaire</option>
                    <option value="Centre Hospitalier (CH)">Centre Hospitalier (CH)</option>
                    <option value="Clinique Privée / ESPIC">Clinique Privée / ESPIC</option>
                    <option value="Laboratoire Biotech / LIMS">Laboratoire Biotech / LIMS</option>
                    <option value="Groupement Hospitalier de Territoire (GHT)">GHT / Multi-sites</option>
                  </select>
                </div>

                {/* Fonction du demandeur */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Votre Rôle
                  </label>
                  <select
                    value={formData.role}
                    onChange={e => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 focus:bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition-all"
                  >
                    <option value="Chef de Service Médical">Chef de Service Médical / Praticien</option>
                    <option value="Directeur d'Établissement / DG">Directeur d'Établissement / DG</option>
                    <option value="DSI / Responsable SI Santé">DSI / Responsable SI Santé</option>
                    <option value="Pharmacien Hospitalier Chef (PUI)">Pharmacien Hospitalier Chef (PUI)</option>
                    <option value="Cadre de Santé / Soignant">Cadre de Santé / Soignant</option>
                    <option value="Biologiste / Responsable Biobanque">Biologiste / Responsable Biobanque</option>
                  </select>
                </div>

                {/* Date souhaitée */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Date Souhaitée
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="date"
                      value={formData.preferredDate}
                      onChange={e => setFormData({ ...formData, preferredDate: e.target.value })}
                      className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 focus:bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Créneau horaire */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Créneau Horaire Préféré
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <select
                      value={formData.preferredTime}
                      onChange={e => setFormData({ ...formData, preferredTime: e.target.value })}
                      className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 focus:bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition-all"
                    >
                      <option value="09:00 - 10:00">09:00 - 10:00</option>
                      <option value="10:00 - 11:00">10:00 - 11:00</option>
                      <option value="11:30 - 12:30">11:30 - 12:30</option>
                      <option value="14:00 - 15:00">14:00 - 15:00</option>
                      <option value="16:00 - 17:00">16:00 - 17:00</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Modules d'intérêt */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-700">
                  Modules Spécifiques à Aborder
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {modulesList.map(mod => {
                    const isSelected = formData.selectedModules.includes(mod);
                    return (
                      <button
                        type="button"
                        key={mod}
                        onClick={() => handleModuleToggle(mod)}
                        className={`px-3 py-2 rounded-xl text-xs font-semibold text-left border flex items-center justify-between transition-all ${
                          isSelected
                            ? 'bg-cyan-50 border-cyan-400 text-cyan-900 shadow-sm'
                            : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        <span className="truncate pr-2">{mod}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-cyan-600 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Note / Message */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Besoins particuliers ou questions spécifiques
                </label>
                <textarea
                  rows={2}
                  placeholder="Ex : Intégration avec notre SIH existant, conformité HDS, déploiement sur 3 sites..."
                  value={formData.notes}
                  onChange={e => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 focus:bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition-all resize-none"
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
                  className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-teal-600/25 transition-all hover:scale-[1.02] flex items-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Envoi en cours...</span>
                    </>
                  ) : (
                    <>
                      <span>Confirmer la Demande</span>
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
