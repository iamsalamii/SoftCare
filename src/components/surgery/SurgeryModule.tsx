import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import {
  Scissors, Plus, Search, Calendar, Clock, User, CheckCircle2,
  AlertCircle, Activity, Download, FileSpreadsheet, Printer, X, Sparkles, Bed
} from 'lucide-react';
import { Surgery } from '../../types';
import CustomSelect from '../common/CustomSelect';
import FormField from '../common/FormField';
import { printDocument, generateDocumentHeader, generateDocumentFooter } from '../../utils/exportUtils';

export const SurgeryModule: React.FC = () => {
  const {
    surgeries,
    operatingRooms,
    patients,
    users,
    addSurgery,
    updateSurgery,
    currentUser,
    organizationSettings
  } = useApp();

  const toast = useToast();
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDate, setFilterDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewSurgery, setShowNewSurgery] = useState(false);
  const [selectedSurgery, setSelectedSurgery] = useState<Surgery | null>(null);

  const getPatientName = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId);
    return patient ? `${patient.firstName} ${patient.lastName}` : 'Patient Programmé';
  };

  const getUserName = (userId: string) => {
    const user = users.find(u => u.id === userId);
    return user ? user.name : 'Chirurgien de garde';
  };

  const getORName = (roomId: string) => {
    const room = operatingRooms.find(r => r.id === roomId);
    return room ? room.name : 'Bloc Polyvalent 1';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-50 text-cyan-800 border border-cyan-200">Planifiée</span>;
      case 'pre-op':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">Pré-opératoire</span>;
      case 'in-progress':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-800 border border-purple-200 animate-pulse">En cours au bloc</span>;
      case 'completed':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">Terminée avec succès</span>;
      case 'cancelled':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-800 border border-rose-200">Annulée</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-700">{status}</span>;
    }
  };

  const filteredSurgeries = surgeries.filter(s => {
    const pName = getPatientName(s.patientId).toLowerCase();
    const proc = (s.procedure || '').toLowerCase();
    const matchesSearch = pName.includes(searchTerm.toLowerCase()) || proc.includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || s.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handlePrintProgram = async () => {
    const rows = filteredSurgeries.map(s => `
      <tr style="border-bottom: 1px solid #e2e8f0;">
        <td style="padding: 8px; font-weight: bold;">${getPatientName(s.patientId)}</td>
        <td style="padding: 8px;">${s.procedure}</td>
        <td style="padding: 8px; text-align: center;">${getORName(s.operatingRoomId)}</td>
        <td style="padding: 8px; text-align: center;">${s.scheduledDate} ${s.scheduledTime || '08:30'}</td>
        <td style="padding: 8px;">Dr. ${getUserName(s.surgeonId)}</td>
        <td style="padding: 8px; text-align: center;">${s.status}</td>
      </tr>
    `).join('');

    const html = `
      ${generateDocumentHeader(organizationSettings, 'report', `CHI-${Date.now().toString().slice(-6)}`)}
      <h2 style="margin: 20px 0 10px 0; color: ${organizationSettings.primaryColor};">PROGRAMME DU BLOC OPÉRATOIRE</h2>
      <p style="color: #64748b; font-size: 13px; margin-bottom: 20px;">Date d'édition : ${new Date().toLocaleString('fr-FR')} | ${filteredSurgeries.length} interventions planifiées</p>

      <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
        <thead>
          <tr style="background: ${organizationSettings.primaryColor}; color: white;">
            <th style="padding: 8px; text-align: left;">Patient</th>
            <th style="padding: 8px; text-align: left;">Acte Chirurgical</th>
            <th style="padding: 8px; text-align: center;">Salle d'Opération</th>
            <th style="padding: 8px; text-align: center;">Date & Heure</th>
            <th style="padding: 8px; text-align: left;">Chirurgien Opérateur</th>
            <th style="padding: 8px; text-align: center;">Statut</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>

      ${generateDocumentFooter(organizationSettings)}
    `;

    await printDocument(html, organizationSettings, 'Programme-Bloc-Operatoire');
    toast.success('Programme imprimé', `${filteredSurgeries.length} interventions exportées.`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center font-bold">
            <Scissors className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Bloc Opératoire & Chirurgie</h1>
            <p className="text-xs text-gray-500">
              Planning opératoire, gestion des salles d'intervention et suivi anesthésique.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrintProgram}
            className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimer Programme</span>
          </button>

          <button
            onClick={() => setShowNewSurgery(true)}
            className="px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white rounded-xl text-xs font-bold shadow-lg shadow-teal-600/25 transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Programmer une Intervention</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm space-y-1">
          <span className="text-xs text-gray-400 font-medium">Interventions au Programme</span>
          <p className="text-2xl font-black text-gray-900">{surgeries.length}</p>
          <span className="text-[10px] text-teal-600 font-semibold">Toutes spécialités confondues</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm space-y-1">
          <span className="text-xs text-gray-400 font-medium">En Cours au Bloc</span>
          <p className="text-2xl font-black text-purple-700">
            {surgeries.filter(s => s.status === 'in-progress').length}
          </p>
          <span className="text-[10px] text-purple-600 font-semibold">Surveillance anesthésique active</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm space-y-1">
          <span className="text-xs text-gray-400 font-medium">Salles d'Opération</span>
          <p className="text-2xl font-black text-emerald-700">
            {operatingRooms.length > 0 ? operatingRooms.length : 4} salles
          </p>
          <span className="text-[10px] text-emerald-600 font-semibold">Flux laminaires opérationnels</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm space-y-1">
          <span className="text-xs text-gray-400 font-medium">Terminées avec Succès</span>
          <p className="text-2xl font-black text-cyan-700">
            {surgeries.filter(s => s.status === 'completed').length}
          </p>
          <span className="text-[10px] text-cyan-600 font-semibold">Transférées en SSPI / Réveil</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher patient ou intervention..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-2xl text-xs focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-medium"
          >
            <option value="all">Tous les statuts</option>
            <option value="scheduled">Planifiée</option>
            <option value="pre-op">Pré-opératoire</option>
            <option value="in-progress">En cours</option>
            <option value="completed">Terminée</option>
          </select>
        </div>
      </div>

      {/* Surgery Cards List */}
      <div className="space-y-3">
        {filteredSurgeries.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center text-gray-400 border border-gray-100 space-y-2">
            <Scissors className="w-12 h-12 mx-auto text-gray-300" />
            <p className="text-xs font-semibold">Aucune intervention chirurgicale programmée</p>
          </div>
        ) : (
          filteredSurgeries.map((surgery) => (
            <div
              key={surgery.id}
              onClick={() => setSelectedSurgery(surgery)}
              className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs"
            >
              <div className="space-y-1.5 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-extrabold text-sm text-gray-900">
                    {getPatientName(surgery.patientId)}
                  </span>
                  {getStatusBadge(surgery.status)}
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-500 font-medium flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-teal-600" />
                    {surgery.scheduledDate} à {surgery.scheduledTime || '09:00'} ({surgery.duration || 60} min)
                  </span>
                </div>

                <p className="text-xs font-bold text-teal-900">
                  Acte : <span>{surgery.procedure}</span>
                </p>

                <div className="flex items-center gap-4 text-gray-500 text-[11px] pt-0.5">
                  <span>Chirurgien : <strong className="text-gray-700">Dr. {getUserName(surgery.surgeonId)}</strong></span>
                  <span>Salle : <strong className="text-gray-700">{getORName(surgery.operatingRoomId)}</strong></span>
                  <span>Anesthésie : <strong className="capitalize text-gray-700">{surgery.anesthesiaType || 'Générale'}</strong></span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedSurgery(surgery)}
                className="px-4 py-2 bg-gray-100 hover:bg-cyan-50 hover:text-cyan-800 text-gray-700 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors self-end sm:self-center"
              >
                <span>Détails & Suivi</span>
              </button>
            </div>
          ))
        )}
      </div>

      {/* Modal 1: Nouvelle Chirurgie */}
      {showNewSurgery && (
        <SurgeryFormModal
          patients={patients}
          users={users}
          operatingRooms={operatingRooms}
          onClose={() => setShowNewSurgery(false)}
          onSave={async (surgery) => {
            await addSurgery(surgery);
            toast.success('Intervention programmée !', `${surgery.procedure} enregistrée au planning.`);
            setShowNewSurgery(false);
          }}
        />
      )}

      {/* Modal 2: Détails & Suivi Chirurgical */}
      {selectedSurgery && (
        <SurgeryDetailsModal
          surgery={selectedSurgery}
          patients={patients}
          users={users}
          operatingRooms={operatingRooms}
          onClose={() => setSelectedSurgery(null)}
          onUpdate={async (updated) => {
            await updateSurgery(updated.id, updated);
            toast.success('Chirurgie mise à jour', `Statut : ${updated.status}`);
            setSelectedSurgery(null);
          }}
        />
      )}
    </div>
  );
};

// Sub-Modal: Formulaire Programmation Nouvelle Chirurgie
const SurgeryFormModal: React.FC<{
  patients: any[];
  users: any[];
  operatingRooms: any[];
  onClose: () => void;
  onSave: (surgery: Surgery) => void;
}> = ({ patients, users, operatingRooms, onClose, onSave }) => {
  const { currentUser } = useApp();

  const [selectedPatientId, setSelectedPatientId] = useState<string>(patients[0]?.id || '');
  const [scheduledDate, setScheduledDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [scheduledTime, setScheduledTime] = useState<string>('09:00');
  const [duration, setDuration] = useState<number>(60);
  const [procedure, setProcedure] = useState<string>('Appendicectomie sous coelioscopie');
  const [surgeonId, setSurgeonId] = useState<string>(
    currentUser?.id || users.find(u => u.role === 'surgeon' || u.role === 'doctor')?.id || '1'
  );

  const fallbackRooms = operatingRooms.length > 0
    ? operatingRooms
    : [
        { id: '1', name: 'Salle d\'Opération 1 - Cardiovasculaire & Thoracique', status: 'available' },
        { id: '2', name: 'Salle d\'Opération 2 - Orthopédie & Traumatologie', status: 'available' },
        { id: '3', name: 'Salle d\'Opération 3 - Viscérale & Ambulatoire', status: 'available' },
        { id: '4', name: 'Salle d\'Opération 4 - Neurochirurgie & Urgences', status: 'available' }
      ];

  const [operatingRoomId, setOperatingRoomId] = useState<string>(fallbackRooms[0]?.id || '1');
  const [anesthesiaType, setAnesthesiaType] = useState<Surgery['anesthesiaType']>('general');
  const [preOpDiagnosis, setPreOpDiagnosis] = useState<string>('Appendicite aiguë fébrile');

  const patientOptions = patients.map(p => ({
    value: p.id,
    label: `${p.firstName} ${p.lastName} (${p.phone || 'Sans tél'})`
  }));

  const surgeonOptions = users
    .filter(u => u.role === 'surgeon' || u.role === 'doctor' || u.role === 'admin')
    .map(u => ({ value: u.id, label: u.name, badge: u.specialization || 'Chirurgien' }));

  const roomOptions = fallbackRooms.map(r => ({
    value: r.id,
    label: r.name,
    badge: r.status === 'available' ? 'Disponible' : 'En service'
  }));

  const procedurePresets = [
    { value: 'Appendicectomie sous coelioscopie', label: 'Appendicectomie sous coelioscopie', badge: 'Viscéral' },
    { value: 'Pontage Aorto-Coronarien (PAC)', label: 'Pontage Aorto-Coronarien (PAC)', badge: 'Cardiaque' },
    { value: 'Prothèse Totale de Hanche (PTH)', label: 'Prothèse Totale de Hanche (PTH)', badge: 'Orthopédie' },
    { value: 'Prothèse Totale de Genou (PTG)', label: 'Prothèse Totale de Genou (PTG)', badge: 'Orthopédie' },
    { value: 'Cholécystectomie par laparoscopie', label: 'Cholécystectomie par laparoscopie', badge: 'Viscéral' },
    { value: 'Césarienne programmée', label: 'Césarienne programmée', badge: 'Obstétrique' },
    { value: 'Cure de hernie inguinale', label: 'Cure de hernie inguinale', badge: 'Ambulatoire' },
    { value: 'Angioplastie transluminale coronaire', label: 'Angioplastie transluminale coronaire', badge: 'Cardiaque' },
    { value: 'Craniotomie d\'évacuation d\'hématome', label: 'Craniotomie d\'évacuation', badge: 'Neuro' },
    { value: 'Thyroïdectomie totale', label: 'Thyroïdectomie totale', badge: 'ORL' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatientId || !procedure.trim()) return;

    onSave({
      id: `SURG-${Date.now()}`,
      patientId: selectedPatientId,
      scheduledDate,
      scheduledTime,
      duration,
      type: 'elective',
      procedure: procedure.trim(),
      surgeonId,
      operatingRoomId,
      anesthesiaType,
      preOpDiagnosis,
      status: 'scheduled'
    });
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl shadow-2xl border border-cyan-100 max-w-2xl w-full overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center font-bold">
              <Scissors className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-gray-900">Programmation d'Intervention au Bloc</h3>
              <p className="text-xs text-gray-500">Planification chirurgicale et affectation des salles</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-600 rounded-xl">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 modal-scroll max-h-[80vh]">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Patient Opéré" required={true}>
              <CustomSelect
                options={patientOptions}
                value={selectedPatientId}
                onChange={(val) => setSelectedPatientId(val)}
                searchable={true}
                placeholder="Sélectionner le patient..."
              />
            </FormField>

            <FormField label="Chirurgien Opérateur" required={true}>
              <CustomSelect
                options={surgeonOptions}
                value={surgeonId}
                onChange={(val) => setSurgeonId(val)}
                searchable={true}
              />
            </FormField>
          </div>

          {/* Procedure Custom Select with presets & custom input */}
          <FormField
            label="Procédure Chirurgicale"
            required={true}
            hint="Sélectionnez une intervention usuelle ou saisissez librement l'intitulé"
          >
            <CustomSelect
              options={procedurePresets}
              value={procedure}
              onChange={(val) => setProcedure(val)}
              searchable={true}
              allowCustom={true}
              placeholder="Choisir ou saisir l'acte chirurgical..."
            />
          </FormField>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <FormField label="Date de l'Intervention" required={true}>
              <input
                type="date"
                required
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold"
              />
            </FormField>

            <FormField label="Heure de Passage" required={true}>
              <input
                type="time"
                required
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold"
              />
            </FormField>

            <FormField label="Durée Estimée (min)" required={true}>
              <input
                type="number"
                min="15"
                step="15"
                required
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value) || 60)}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold"
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Salle d'Opération (Bloc)" required={true}>
              <CustomSelect
                options={roomOptions}
                value={operatingRoomId}
                onChange={(val) => setOperatingRoomId(val)}
              />
            </FormField>

            <FormField label="Type d'Anesthésie">
              <select
                value={anesthesiaType}
                onChange={(e) => setAnesthesiaType(e.target.value as any)}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold"
              >
                <option value="general">Anesthésie Générale (AG)</option>
                <option value="regional">Rachianesthésie / Péridurale</option>
                <option value="local">Anesthésie Loco-régionale (ALR)</option>
                <option value="sedation">Sédation vigile / Neuroleptanalgésie</option>
              </select>
            </FormField>
          </div>

          <FormField label="Diagnostic Pré-opératoire" required={true} value={preOpDiagnosis} showWordCount={true}>
            <input
              type="text"
              required
              value={preOpDiagnosis}
              onChange={(e) => setPreOpDiagnosis(e.target.value)}
              placeholder="Ex: Lithiase vésiculaire symptomatique..."
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold"
            />
          </FormField>

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
              className="px-6 py-2.5 bg-gradient-to-r from-cyan-600 to-teal-600 text-white rounded-xl text-xs font-bold shadow-md hover:from-cyan-700 hover:to-teal-700"
            >
              Valider la Programmation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Sub-Modal: Détails et Suivi Chirurgical
const SurgeryDetailsModal: React.FC<{
  surgery: Surgery;
  patients: any[];
  users: any[];
  operatingRooms: any[];
  onClose: () => void;
  onUpdate: (updated: Surgery) => void;
}> = ({ surgery, patients, users, operatingRooms, onClose, onUpdate }) => {
  const patient = patients.find(p => p.id === surgery.patientId);

  const [status, setStatus] = useState(surgery.status);
  const [postOpDiagnosis, setPostOpDiagnosis] = useState(surgery.postOpDiagnosis || '');
  const [surgicalNotes, setSurgicalNotes] = useState((surgery as any).surgicalNotes || '');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate({
      ...surgery,
      status: status as any,
      postOpDiagnosis,
      surgicalNotes
    } as any);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl shadow-2xl border border-cyan-100 max-w-lg w-full overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="font-bold text-base text-gray-900">Suivi Opératoire : {surgery.procedure}</h3>
            <p className="text-xs text-gray-500">
              Patient : <span className="font-bold text-gray-900">{patient?.firstName} {patient?.lastName}</span>
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-600 rounded-xl">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-4 modal-scroll max-h-[80vh]">
          <FormField label="Statut de l'Intervention" required={true}>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold"
            >
              <option value="scheduled">Planifiée</option>
              <option value="pre-op">En préparation pré-opératoire</option>
              <option value="in-progress">En cours d'intervention au bloc</option>
              <option value="completed">Terminée / Transférée en Salle de Réveil (SSPI)</option>
              <option value="cancelled">Annulée</option>
            </select>
          </FormField>

          <FormField label="Compte-rendu Post-opératoire & Diagnostic" value={postOpDiagnosis} showWordCount={true}>
            <input
              type="text"
              value={postOpDiagnosis}
              onChange={(e) => setPostOpDiagnosis(e.target.value)}
              placeholder="Ex: Exérèse complète sans complication hémorragique..."
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs"
            />
          </FormField>

          <FormField label="Observations Chirurgicales / Matériel Implanté" value={surgicalNotes} showWordCount={true}>
            <textarea
              rows={3}
              value={surgicalNotes}
              onChange={(e) => setSurgicalNotes(e.target.value)}
              placeholder="Fils résorbables 3-0, drainage Redon en place..."
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs"
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
              className="px-5 py-2 bg-gradient-to-r from-cyan-600 to-teal-600 text-white rounded-xl text-xs font-bold shadow-md"
            >
              Mettre à Jour le Suivi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SurgeryModule;
