import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import {
  AlertTriangle, Clock, User, Truck, ArrowRight, Download, FileSpreadsheet,
  Printer, Plus, Search, CheckCircle2, Bed, Stethoscope, Edit3, X, Sparkles
} from 'lucide-react';
import { EmergencyVisit } from '../../types';
import CustomSelect from '../common/CustomSelect';
import FormField from '../common/FormField';
import { printDocument, generateDocumentHeader, generateDocumentFooter } from '../../utils/exportUtils';

export const EmergencyModule: React.FC = () => {
  const {
    emergencyVisits,
    patients,
    users,
    beds,
    addEmergencyVisit,
    updateEmergencyVisit,
    currentUser,
    organizationSettings
  } = useApp();

  const toast = useToast();
  const [filterTriage, setFilterTriage] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewVisit, setShowNewVisit] = useState(false);
  const [selectedVisit, setSelectedVisit] = useState<EmergencyVisit | null>(null);

  const getPatientName = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId);
    return patient ? `${patient.firstName} ${patient.lastName}` : 'Patient non répertorié';
  };

  const getDoctorName = (doctorId?: string) => {
    if (!doctorId) return 'Non assigné';
    const doctor = users.find(u => u.id === doctorId);
    return doctor ? doctor.name : 'Médecin de garde';
  };

  const getTriageColor = (level: number) => {
    switch (level) {
      case 1: return 'bg-rose-600 text-white border-rose-700 shadow-rose-500/25';
      case 2: return 'bg-orange-500 text-white border-orange-600 shadow-orange-500/25';
      case 3: return 'bg-amber-400 text-slate-900 border-amber-500 shadow-amber-500/25';
      case 4: return 'bg-emerald-500 text-white border-emerald-600 shadow-emerald-500/25';
      case 5: return 'bg-cyan-500 text-white border-cyan-600 shadow-cyan-500/25';
      default: return 'bg-gray-400 text-white';
    }
  };

  const getTriageLabel = (level: number) => {
    const labels = [
      'Niveau 1 : Réanimation Immédiate',
      'Niveau 2 : Très Urgent (<15 min)',
      'Niveau 3 : Urgent (<60 min)',
      'Niveau 4 : Moins Urgent (<120 min)',
      'Niveau 5 : Non Urgent (<240 min)'
    ];
    return labels[level - 1] || 'N/A';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'waiting':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">En attente</span>;
      case 'in-treatment':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-50 text-cyan-800 border border-cyan-200 animate-pulse">En cours de soins</span>;
      case 'admitted':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-800 border border-purple-200">Hospitalisé en service</span>;
      case 'discharged':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">Sortie autorisée</span>;
      case 'transferred':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-800 border border-slate-200">Transféré</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-700">{status}</span>;
    }
  };

  const filteredVisits = emergencyVisits.filter(visit => {
    const pName = getPatientName(visit.patientId).toLowerCase();
    const matchesSearch = pName.includes(searchTerm.toLowerCase()) || visit.chiefComplaint.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTriage = filterTriage === 'all' || visit.triageLevel.toString() === filterTriage;
    const matchesStatus = filterStatus === 'all' || visit.status === filterStatus;
    return matchesSearch && matchesTriage && matchesStatus;
  });

  const handleTakeCharge = async (visit: EmergencyVisit, e: React.MouseEvent) => {
    e.stopPropagation();
    const assignedDoc = currentUser?.id || users.find(u => u.role === 'doctor')?.id || '1';
    const updated: EmergencyVisit = {
      ...visit,
      status: 'in-treatment',
      assignedDoctorId: assignedDoc
    };

    await updateEmergencyVisit(visit.id, updated);
    toast.success('Patient pris en charge !', `${getPatientName(visit.patientId)} est maintenant en cours de soins.`);
  };

  const handlePrintEmergencyRegister = async () => {
    const rows = filteredVisits.map(v => `
      <tr style="border-bottom: 1px solid #e2e8f0;">
        <td style="padding: 8px; font-weight: bold;">${getPatientName(v.patientId)}</td>
        <td style="padding: 8px; text-align: center;">Niveau ${v.triageLevel}</td>
        <td style="padding: 8px; text-align: center;">${new Date(v.arrivalTime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</td>
        <td style="padding: 8px;">${v.chiefComplaint}</td>
        <td style="padding: 8px; text-align: center;">${v.status}</td>
        <td style="padding: 8px;">Dr. ${getDoctorName(v.assignedDoctorId)}</td>
      </tr>
    `).join('');

    const html = `
      ${generateDocumentHeader(organizationSettings, 'report', `URG-${Date.now().toString().slice(-6)}`)}
      <h2 style="margin: 20px 0 10px 0; color: ${organizationSettings.primaryColor};">REGISTRE DES ADMISSIONS D'URGENCE</h2>
      <p style="color: #64748b; font-size: 13px; margin-bottom: 20px;">Date : ${new Date().toLocaleString('fr-FR')} | Total : ${filteredVisits.length} passages</p>

      <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
        <thead>
          <tr style="background: ${organizationSettings.primaryColor}; color: white;">
            <th style="padding: 8px; text-align: left;">Patient</th>
            <th style="padding: 8px; text-align: center;">Triage</th>
            <th style="padding: 8px; text-align: center;">Arrivée</th>
            <th style="padding: 8px; text-align: left;">Motif d'Urgence</th>
            <th style="padding: 8px; text-align: center;">Statut</th>
            <th style="padding: 8px; text-align: left;">Praticien</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>

      ${generateDocumentFooter(organizationSettings)}
    `;

    await printDocument(html, organizationSettings, 'Registre-Urgences');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Urgences & Triage Hospitalier</h1>
            <p className="text-xs text-gray-500">
              Échelle de triage Manchester/Manchot, régulation et orientation des urgences.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrintEmergencyRegister}
            className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimer Registre</span>
          </button>

          <button
            onClick={() => setShowNewVisit(true)}
            className="px-5 py-2.5 bg-gradient-to-r from-rose-600 to-red-700 hover:from-rose-700 hover:to-red-800 text-white rounded-xl text-xs font-bold shadow-lg shadow-rose-600/25 transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Nouvelle Admission Urgence</span>
          </button>
        </div>
      </div>

      {/* Triage Interactive Scale */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-3">
        <div className="flex justify-between items-center">
          <h2 className="text-xs font-bold uppercase tracking-wider text-gray-700">
            File d'Attente par Niveau de Triage
          </h2>
          {filterTriage !== 'all' && (
            <button
              onClick={() => setFilterTriage('all')}
              className="text-xs text-cyan-700 font-bold hover:underline"
            >
              Afficher tous les niveaux
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[1, 2, 3, 4, 5].map(level => {
            const count = emergencyVisits.filter(v => v.triageLevel === level && v.status !== 'discharged').length;
            const isSelected = filterTriage === level.toString();
            return (
              <button
                key={level}
                type="button"
                onClick={() => setFilterTriage(isSelected ? 'all' : level.toString())}
                className={`p-4 rounded-2xl border text-center transition-all ${getTriageColor(level)} ${
                  isSelected ? 'ring-4 ring-offset-2 ring-slate-900 scale-105' : 'hover:opacity-90'
                }`}
              >
                <p className="text-2xl font-black">{level}</p>
                <p className="text-[10px] font-bold uppercase tracking-wider opacity-90 mt-0.5">
                  {level === 1 ? 'Réa / STAT' : level === 2 ? 'Très Urgent' : level === 3 ? 'Urgent' : level === 4 ? 'Relatif' : 'Non Urgent'}
                </p>
                <p className="text-xs font-black mt-2 bg-black/20 rounded-full py-0.5 px-2 w-fit mx-auto">
                  {count} en cours
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher patient ou motif..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-2xl text-xs focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-medium"
          >
            <option value="all">Tous les statuts</option>
            <option value="waiting">En attente</option>
            <option value="in-treatment">En cours de soins</option>
            <option value="admitted">Hospitalisé</option>
            <option value="discharged">Sortie autorisée</option>
          </select>
        </div>
      </div>

      {/* Emergency Visits Cards */}
      <div className="space-y-3">
        {filteredVisits.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center text-gray-400 border border-gray-100 space-y-2">
            <AlertTriangle className="w-12 h-12 mx-auto text-gray-300" />
            <p className="text-xs font-semibold">Aucun passage aux urgences correspondant</p>
          </div>
        ) : (
          filteredVisits
            .sort((a, b) => a.triageLevel - b.triageLevel)
            .map((visit) => (
              <div
                key={visit.id}
                onClick={() => setSelectedVisit(visit)}
                className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs"
              >
                <div className="flex items-start gap-4 min-w-0">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg flex-shrink-0 shadow-md ${getTriageColor(visit.triageLevel)}`}>
                    {visit.triageLevel}
                  </div>

                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-black text-sm text-gray-900">
                        {getPatientName(visit.patientId)}
                      </span>
                      {getStatusBadge(visit.status)}
                      <span className="text-gray-400">•</span>
                      <span className="text-gray-500 font-medium flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        Arrivée : {new Date(visit.arrivalTime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <p className="text-xs font-medium text-gray-700 leading-snug">
                      Motif : <span className="font-bold text-gray-900">{visit.chiefComplaint}</span>
                    </p>

                    <div className="flex items-center gap-4 text-gray-500 text-[11px] pt-0.5">
                      <span>Praticien : <strong className="text-gray-700">Dr. {getDoctorName(visit.assignedDoctorId)}</strong></span>
                      {visit.arrivalMode && (
                        <span>Mode : <strong className="capitalize text-gray-700">{visit.arrivalMode}</strong></span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  {visit.status === 'waiting' && (
                    <button
                      type="button"
                      onClick={(e) => handleTakeCharge(visit, e)}
                      className="px-4 py-2.5 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white rounded-xl font-bold text-xs shadow-md shadow-teal-600/20 flex items-center gap-1.5 transition-all"
                    >
                      <Stethoscope className="w-4 h-4" />
                      <span>Prendre en charge</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setSelectedVisit(visit)}
                    className="px-3.5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Modifier / Gérer</span>
                  </button>
                </div>
              </div>
            ))
        )}
      </div>

      {/* Modal 1: Nouvelle Admission */}
      {showNewVisit && (
        <NewEmergencyVisitModal
          patients={patients}
          onClose={() => setShowNewVisit(false)}
          onSave={async (visit) => {
            await addEmergencyVisit(visit);
            toast.success('Patient admis aux urgences', `Triage Niveau ${visit.triageLevel}`);
            setShowNewVisit(false);
          }}
        />
      )}

      {/* Modal 2: Détails & Modification de l'Admission */}
      {selectedVisit && (
        <EmergencyVisitDetailsModal
          visit={selectedVisit}
          patients={patients}
          users={users}
          onClose={() => setSelectedVisit(null)}
          onUpdate={async (updated) => {
            await updateEmergencyVisit(updated.id, updated);
            toast.success('Dossier d\'urgence mis à jour', `Statut : ${updated.status}`);
            setSelectedVisit(null);
          }}
        />
      )}
    </div>
  );
};

// Sub-Modal : Nouvelle Admission
const NewEmergencyVisitModal: React.FC<{
  patients: any[];
  onClose: () => void;
  onSave: (visit: EmergencyVisit) => void;
}> = ({ patients, onClose, onSave }) => {
  const { currentUser, users } = useApp();
  const [patientId, setPatientId] = useState(patients[0]?.id || '');
  const [chiefComplaint, setChiefComplaint] = useState('');
  const [triageLevel, setTriageLevel] = useState<number>(3);
  const [arrivalMode, setArrivalMode] = useState<string>('walking');
  const [assignedDoctorId, setAssignedDoctorId] = useState<string>(
    currentUser?.id || users.find(u => u.role === 'doctor')?.id || ''
  );

  const patientOptions = patients.map(p => ({
    value: p.id,
    label: `${p.firstName} ${p.lastName} (${p.phone || 'Sans tél'})`
  }));

  const doctorOptions = [
    { value: '', label: 'Non assigné (File d\'attente)' },
    ...users.filter(u => u.role === 'doctor' || u.role === 'surgeon').map(u => ({
      value: u.id,
      label: u.name
    }))
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientId || !chiefComplaint.trim()) return;

    onSave({
      id: `URG-${Date.now()}`,
      patientId,
      arrivalTime: new Date().toISOString(),
      arrivalMode: arrivalMode as any,
      chiefComplaint: chiefComplaint.trim(),
      triageLevel: triageLevel as any,
      status: assignedDoctorId ? 'in-treatment' : 'waiting',
      assignedDoctorId: assignedDoctorId || undefined
    });
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl shadow-2xl border border-rose-100 max-w-lg w-full overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-gray-900">Nouvelle Admission aux Urgences</h3>
              <p className="text-xs text-gray-500">Triage immédiat et enregistrement du motif</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-600 rounded-xl">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 modal-scroll max-h-[80vh]">
          <FormField label="Dossier Patient" required={true}>
            <CustomSelect
              options={patientOptions}
              value={patientId}
              onChange={(val) => setPatientId(val)}
              searchable={true}
            />
          </FormField>

          <FormField label="Motif d'Urgence / Plaintes Principales" required={true} value={chiefComplaint} showWordCount={true}>
            <textarea
              rows={3}
              required
              value={chiefComplaint}
              onChange={(e) => setChiefComplaint(e.target.value)}
              placeholder="Ex: Douleur thoracique irradiant dans le bras gauche, dyspnée aiguë..."
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 font-semibold"
            />
          </FormField>

          {/* Triage Level Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
              Niveau de Gravité (Triage Manchot) <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-5 gap-1.5">
              {[1, 2, 3, 4, 5].map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setTriageLevel(lvl)}
                  className={`py-3 px-1 rounded-xl text-center font-black transition-all ${
                    triageLevel === lvl
                      ? 'ring-2 ring-slate-900 scale-105 shadow-md ' + (
                          lvl === 1 ? 'bg-rose-600 text-white' :
                          lvl === 2 ? 'bg-orange-500 text-white' :
                          lvl === 3 ? 'bg-amber-400 text-slate-900' :
                          lvl === 4 ? 'bg-emerald-500 text-white' : 'bg-cyan-500 text-white'
                        )
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span className="text-lg block">{lvl}</span>
                  <span className="text-[9px] block font-semibold">{lvl === 1 ? 'STAT' : `Niv.${lvl}`}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <FormField label="Mode d'Arrivée">
              <select
                value={arrivalMode}
                onChange={(e) => setArrivalMode(e.target.value)}
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold"
              >
                <option value="walking">Consultation spontanée (À pied)</option>
                <option value="ambulance">Ambulance privée</option>
                <option value="samu">SAMU / SMUR (15)</option>
                <option value="firefighters">Sapeurs-Pompiers (18)</option>
                <option value="police">Police / Gendarmerie</option>
              </select>
            </FormField>

            <FormField label="Médecin Praticien Assigné">
              <CustomSelect
                options={doctorOptions}
                value={assignedDoctorId}
                onChange={(val) => setAssignedDoctorId(val)}
                searchable={true}
              />
            </FormField>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-xs font-semibold hover:bg-gray-200"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-gradient-to-r from-rose-600 to-red-700 text-white rounded-xl text-xs font-bold shadow-md"
            >
              Admettre aux Urgences
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Sub-Modal : Détails et Modification de l'Admission
const EmergencyVisitDetailsModal: React.FC<{
  visit: EmergencyVisit;
  patients: any[];
  users: any[];
  onClose: () => void;
  onUpdate: (updated: EmergencyVisit) => void;
}> = ({ visit, patients, users, onClose, onUpdate }) => {
  const patient = patients.find(p => p.id === visit.patientId);

  const [status, setStatus] = useState(visit.status);
  const [triageLevel, setTriageLevel] = useState<number>(visit.triageLevel);
  const [chiefComplaint, setChiefComplaint] = useState(visit.chiefComplaint);
  const [assignedDoctorId, setAssignedDoctorId] = useState(visit.assignedDoctorId || '');

  const doctorOptions = [
    { value: '', label: 'Non assigné' },
    ...users.filter(u => u.role === 'doctor' || u.role === 'surgeon').map(u => ({
      value: u.id,
      label: u.name
    }))
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate({
      ...visit,
      status: status as any,
      triageLevel: triageLevel as any,
      chiefComplaint,
      assignedDoctorId: assignedDoctorId || undefined
    });
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl shadow-2xl border border-rose-100 max-w-lg w-full overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="font-bold text-base text-gray-900">Dossier d'Urgence #{visit.id}</h3>
            <p className="text-xs text-gray-500">
              Patient : <span className="font-bold text-gray-900">{patient?.firstName} {patient?.lastName}</span>
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-600 rounded-xl">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-4 modal-scroll max-h-[80vh]">
          <FormField label="Statut de la Prise en Charge" required={true}>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold"
            >
              <option value="waiting">En attente</option>
              <option value="in-treatment">En cours de soins / Traitement</option>
              <option value="admitted">Hospitalisé en service de soins</option>
              <option value="discharged">Sortie autorisée (Domicile)</option>
              <option value="transferred">Transféré vers autre établissement</option>
            </select>
          </FormField>

          <FormField label="Motif d'Urgence" required={true} value={chiefComplaint} showWordCount={true}>
            <textarea
              rows={3}
              required
              value={chiefComplaint}
              onChange={(e) => setChiefComplaint(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold"
            />
          </FormField>

          <FormField label="Médecin Praticien Assigné">
            <CustomSelect
              options={doctorOptions}
              value={assignedDoctorId}
              onChange={(val) => setAssignedDoctorId(val)}
              searchable={true}
            />
          </FormField>

          <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-xs font-semibold hover:bg-gray-200"
            >
              Fermer
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-gradient-to-r from-rose-600 to-red-700 text-white rounded-xl text-xs font-bold shadow-md"
            >
              Enregistrer Modifications
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmergencyModule;
