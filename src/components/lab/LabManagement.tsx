import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import {
  FlaskConical, Plus, Search, Eye, FileText, CheckCircle2, Clock,
  AlertTriangle, Filter, Calendar, User, Printer, Download, Sparkles, X
} from 'lucide-react';
import { LabOrder, LabTest } from '../../types';
import CustomSelect from '../common/CustomSelect';
import FormField from '../common/FormField';
import { printDocument, generateDocumentHeader, generateDocumentFooter } from '../../utils/exportUtils';

export const LabManagement: React.FC = () => {
  const { labOrders, labTests, patients, users, organizationSettings } = useApp();
  const toast = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [showNewOrder, setShowNewOrder] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<LabOrder | null>(null);

  const getPatientName = (patientId?: string) => {
    if (!patientId) return 'Patient inconnu';
    const patient = patients.find(p => p.id === patientId);
    return patient ? `${patient.firstName} ${patient.lastName}` : 'Patient inconnu';
  };

  const getDoctorName = (doctorId?: string) => {
    if (!doctorId) return 'Dr. Non assigné';
    const doctor = users.find(u => u.id === doctorId);
    return doctor ? doctor.name : 'Dr. Non assigné';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">En attente</span>;
      case 'collected':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-50 text-cyan-700 border border-cyan-200">Prélèvement effectué</span>;
      case 'in-progress':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">En analyse</span>;
      case 'completed':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">Résultats disponibles</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-700">{status}</span>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'stat':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-600 text-white animate-pulse">STAT Immédiat</span>;
      case 'urgent':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-white">Urgent</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-700">Routine</span>;
    }
  };

  const filteredOrders = (labOrders || []).filter(order => {
    const pName = getPatientName(order.patientId).toLowerCase();
    const orderId = (order.id || '').toLowerCase();
    const matchesSearch = pName.includes(searchTerm.toLowerCase()) || orderId.includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || order.priority === filterPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handlePrintReport = async (order: LabOrder) => {
    const p = patients.find(pat => pat.id === order.patientId);
    const docName = getDoctorName(order.doctorId);
    const html = `
      ${generateDocumentHeader(organizationSettings, 'lab_result', `LAB-${order.id}`)}
      <div style="margin: 20px 0; padding: 15px; background: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0;">
        <h2 style="margin: 0 0 10px 0; font-size: 16px; color: ${organizationSettings.primaryColor};">RÉSULTATS DU BILAN BIOLOGIQUE</h2>
        <p style="margin: 3px 0; font-size: 13px;"><strong>Patient :</strong> ${p?.firstName || 'Patient'} ${p?.lastName || ''} (${p?.gender === 'male' ? 'Homme' : 'Femme'}, ${p?.dateOfBirth ? new Date(p.dateOfBirth).toLocaleDateString('fr-FR') : 'N/A'})</p>
        <p style="margin: 3px 0; font-size: 13px;"><strong>Médecin Prescripteur :</strong> ${docName}</p>
        <p style="margin: 3px 0; font-size: 13px;"><strong>Date de prélèvement :</strong> ${order.collectedAt ? new Date(order.collectedAt).toLocaleString('fr-FR') : order.createdAt ? new Date(order.createdAt).toLocaleString('fr-FR') : 'N/A'}</p>
      </div>

      <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
        <thead>
          <tr style="background: ${organizationSettings.primaryColor}; color: white; text-align: left;">
            <th style="padding: 10px;">Paramètre Biologique</th>
            <th style="padding: 10px; text-align: center;">Résultat</th>
            <th style="padding: 10px; text-align: center;">Valeurs de Référence</th>
            <th style="padding: 10px; text-align: center;">Interprétation</th>
          </tr>
        </thead>
        <tbody>
          ${(order.tests || []).map(t => `
            <tr style="border-bottom: 1px solid #e2e8f0;">
              <td style="padding: 10px; font-weight: bold;">${t.testName}</td>
              <td style="padding: 10px; text-align: center; font-weight: bold; color: ${t.flag && t.flag !== 'normal' ? '#dc2626' : '#059669'};">${t.result || '98'} ${t.unit || 'mg/dL'}</td>
              <td style="padding: 10px; text-align: center; color: #64748b;">${t.referenceRange || '70 - 110'}</td>
              <td style="padding: 10px; text-align: center; font-size: 11px; font-weight: bold;">${t.flag === 'critical' ? 'CRITIQUE' : t.flag === 'high' ? 'ÉLEVÉ' : t.flag === 'low' ? 'BAS' : 'NORMAL'}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      ${order.notes ? `<div style="margin-top: 20px; padding: 10px; background: #fffbeb; border-left: 4px solid #f59e0b; font-size: 12px;"><strong>Observations Biologiste :</strong> ${order.notes}</div>` : ''}

      ${generateDocumentFooter(organizationSettings)}
    `;

    await printDocument(html, organizationSettings, `Resultats-Labo-${order.id}`);
    toast.success('Compte-rendu généré', `Résultats du dossier #${order.id}`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center font-bold">
            <FlaskConical className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Laboratoire & Biologie Médicale</h1>
            <p className="text-xs text-gray-500">
              Analyses hématologiques, biochimiques, microbiologiques et génomiques.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowNewOrder(true)}
          className="px-5 py-3 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white rounded-2xl text-xs font-bold shadow-lg shadow-teal-600/25 transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Nouvelle Demande d'Analyse</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher par patient ou N° d'ordre..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-2xl text-xs focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto z-10">
          <div className="w-40">
            <CustomSelect
              options={[
                { value: 'all', label: 'Tous les statuts' },
                { value: 'pending', label: 'En attente' },
                { value: 'collected', label: 'Prélèvement fait' },
                { value: 'in-progress', label: 'En cours' },
                { value: 'completed', label: 'Terminé' }
              ]}
              value={filterStatus}
              onChange={(val) => setFilterStatus(val)}
            />
          </div>

          <div className="w-40">
            <CustomSelect
              options={[
                { value: 'all', label: 'Toutes priorités' },
                { value: 'routine', label: 'Routine' },
                { value: 'urgent', label: 'Urgent' },
                { value: 'stat', label: 'STAT Immédiat' }
              ]}
              value={filterPriority}
              onChange={(val) => setFilterPriority(val)}
            />
          </div>
        </div>
      </div>

      {/* Lab Orders List */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-50">
        {filteredOrders.length === 0 ? (
          <div className="p-12 text-center text-gray-400 space-y-3">
            <FlaskConical className="w-12 h-12 mx-auto text-gray-300" />
            <p className="text-xs font-semibold">Aucune analyse biologique enregistrée</p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div
              key={order.id}
              className="p-5 hover:bg-slate-50/60 transition-colors flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs"
            >
              <div className="space-y-1.5 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono font-bold text-gray-900 text-sm">#{order.id}</span>
                  {getStatusBadge(order.status)}
                  {getPriorityBadge(order.priority)}
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-500 font-medium">
                    {new Date(order.createdAt).toLocaleString('fr-FR')}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-extrabold text-gray-900 text-sm">
                    {getPatientName(order.patientId)}
                  </span>
                  <span className="text-gray-400">|</span>
                  <span className="text-gray-600 font-medium">
                    Prescrit par : <span className="font-bold">{getDoctorName(order.doctorId)}</span>
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {(order.tests || []).map((t) => (
                    <span
                      key={t.id}
                      className="px-2.5 py-0.5 bg-cyan-50 text-cyan-800 border border-cyan-100 rounded-lg text-[11px] font-semibold"
                    >
                      {t.testName}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  type="button"
                  onClick={() => setSelectedOrder(order)}
                  className="px-3 py-2 bg-gray-100 hover:bg-cyan-50 hover:text-cyan-800 text-gray-700 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors"
                  title="Consulter les résultats"
                >
                  <Eye className="w-4 h-4" />
                  <span>Consulter</span>
                </button>

                <button
                  type="button"
                  onClick={() => handlePrintReport(order)}
                  className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors"
                  title="Imprimer le compte-rendu officiel"
                >
                  <FileText className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal 1: Nouvelle Demande d'Analyse */}
      {showNewOrder && <LabOrderForm onClose={() => setShowNewOrder(false)} />}

      {/* Modal 2: Détails et Consultation de la Commande */}
      {selectedOrder && (
        <LabOrderDetails
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onPrint={() => handlePrintReport(selectedOrder)}
        />
      )}
    </div>
  );
};

// Formulaire Nouvelle Demande d'Analyse
const LabOrderForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { patients, labTests, users, addLabOrder, currentUser } = useApp();
  const toast = useToast();

  const isDoctor = currentUser?.role === 'doctor' || currentUser?.role === 'surgeon';
  const isSuperAdmin = currentUser?.role === 'admin' || currentUser?.id === '1' || currentUser?.id === 'admin-1';
  const defaultDoctorId = isDoctor ? currentUser?.id : (users.find(u => u.role === 'doctor')?.id || '1');

  const [isExternalPatient, setIsExternalPatient] = useState(false);
  const [externalPatientName, setExternalPatientName] = useState('');
  const [externalPatientPhone, setExternalPatientPhone] = useState('');
  const [externalPrescriber, setExternalPrescriber] = useState('');

  const [selectedPatientId, setSelectedPatientId] = useState<string>(patients[0]?.id || '');
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>(defaultDoctorId || '1');
  const [priority, setPriority] = useState<'routine' | 'urgent' | 'stat'>('routine');
  const [selectedTests, setSelectedTests] = useState<string[]>([]);
  const [notes, setNotes] = useState('');

  const patientOptions = patients.map(p => ({
    value: p.id,
    label: `${p.firstName} ${p.lastName} (${p.phone || 'Sans tél'})`
  }));

  const doctorOptions = users
    .filter(u => u.role === 'doctor' || u.role === 'surgeon' || u.role === 'admin')
    .map(u => ({ value: u.id, label: u.name, badge: u.specialization }));

  // Dynamic test list without showing prices here as requested
  const testOptions = labTests.length > 0
    ? labTests
    : [
        { id: '1', name: 'Numération Formule Sanguine (NFS / Hémogramme)', category: 'Hématologie', ref: '4.5-5.9 M/uL', unit: 'g/dL' },
        { id: '2', name: 'Ionogramme Sanguin (Na, K, Cl, Bicar)', category: 'Biochimie', ref: '135-145 mEq/L', unit: 'mEq/L' },
        { id: '3', name: 'Créatininémie & Clairance DFG', category: 'Biochimie', ref: '60-110 µmol/L', unit: 'µmol/L' },
        { id: '4', name: 'Bilan Hépatique (ALAT, ASAT, Bilirubine)', category: 'Biochimie', ref: '< 45 UI/L', unit: 'UI/L' },
        { id: '5', name: 'CRP Ultrasensible & Vitesse de Sédimentation', category: 'Inflammation', ref: '< 5.0 mg/L', unit: 'mg/L' },
        { id: '6', name: 'Troponine Ic Haute Sensibilité', category: 'Cardiologie', ref: '< 14 ng/L', unit: 'ng/L' },
        { id: '7', name: 'D-Dimères (Suspicion Thrombose / EP)', category: 'Hémostase', ref: '< 500 ng/mL', unit: 'ng/mL' },
        { id: '8', name: 'Génotypage PGx CYP2C19 & DPYD', category: 'Biotechnologies', ref: 'Normotype *1/*1', unit: 'Allèles' }
      ];

  const toggleTest = (id: string) => {
    setSelectedTests(prev =>
      prev.includes(id) ? prev.filter(tId => tId !== id) : [...prev, id]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((!isExternalPatient && !selectedPatientId) || (isExternalPatient && !externalPatientName.trim()) || selectedTests.length === 0) {
      toast.error('Champs manquants', 'Veuillez renseigner le patient et au moins une analyse biologique.');
      return;
    }

    const orderTests = selectedTests.map(tId => {
      const tDef = testOptions.find(t => t.id === tId);
      return {
        id: `t-${Date.now()}-${tId}`,
        labTestId: tId,
        testName: tDef?.name || 'Analyse biologique',
        referenceRange: (tDef as any)?.ref || 'Normal',
        unit: (tDef as any)?.unit || 'mg/dL',
        result: 'En cours',
        status: 'pending' as const
      };
    });

    const newOrder: LabOrder = {
      id: `LAB-${Date.now().toString().slice(-6)}`,
      patientId: isExternalPatient ? undefined : selectedPatientId,
      patientName: isExternalPatient ? externalPatientName.trim() : undefined,
      doctorId: isExternalPatient && externalPrescriber ? externalPrescriber : selectedDoctorId,
      tests: orderTests,
      status: 'pending',
      priority,
      notes: isExternalPatient
        ? `[Externe / Clinique Partenaire: ${externalPrescriber || 'Non spécifié'} - Tél: ${externalPatientPhone || 'N/A'}] ${notes}`
        : notes,
      createdAt: new Date().toISOString()
    };

    addLabOrder(newOrder);
    toast.success('Demande enregistrée', `Bilan #${newOrder.id} transmis au laboratoire.`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl shadow-2xl border border-cyan-100 max-w-2xl w-full overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center font-bold">
              <FlaskConical className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-gray-900">Nouvelle Prescription d'Analyses</h3>
              <p className="text-xs text-gray-500">Demande d'examens biologiques informatisée</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 modal-scroll max-h-[80vh]">
          {/* Mode Patient Toggle */}
          <div className="flex items-center justify-between p-3 bg-cyan-50/50 rounded-2xl border border-cyan-100 text-xs">
            <div>
              <p className="font-bold text-cyan-950">Origine de la demande</p>
              <p className="text-[11px] text-cyan-800">Sélectionner un dossier patient hospitalisé ou un patient externe.</p>
            </div>
            <label className="flex items-center gap-2 cursor-pointer font-semibold text-gray-700 bg-white px-3 py-1.5 rounded-xl border border-gray-200">
              <input
                type="checkbox"
                checked={isExternalPatient}
                onChange={(e) => setIsExternalPatient(e.target.checked)}
                className="rounded text-cyan-600 focus:ring-cyan-500"
              />
              <span>Patient Externe / Clinique Partenaire</span>
            </label>
          </div>

          {!isExternalPatient ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Dossier Patient" required={true}>
                <CustomSelect
                  options={patientOptions}
                  value={selectedPatientId}
                  onChange={(val) => setSelectedPatientId(val)}
                  searchable={true}
                  placeholder="Sélectionner le patient..."
                />
              </FormField>

              <FormField label="Médecin Prescripteur" required={true} hint={!isSuperAdmin && isDoctor ? "Verrouillé sur votre compte" : ""}>
                <CustomSelect
                  options={doctorOptions}
                  value={selectedDoctorId}
                  onChange={(val) => setSelectedDoctorId(val)}
                  searchable={true}
                  disabled={!isSuperAdmin && isDoctor}
                />
              </FormField>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <FormField label="Nom & Prénom Patient Externe" required={true}>
                <input
                  type="text"
                  required
                  value={externalPatientName}
                  onChange={(e) => setExternalPatientName(e.target.value)}
                  placeholder="Ex: Alain Delon"
                  className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold"
                />
              </FormField>

              <FormField label="Téléphone Patient">
                <input
                  type="tel"
                  value={externalPatientPhone}
                  onChange={(e) => setExternalPatientPhone(e.target.value)}
                  placeholder="+33 6 12 34 56 78"
                  className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                />
              </FormField>

              <FormField label="Prescripteur Externe / Clinique">
                <input
                  type="text"
                  value={externalPrescriber}
                  onChange={(e) => setExternalPrescriber(e.target.value)}
                  placeholder="Dr. Martin / Clinique Pasteur"
                  className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                />
              </FormField>
            </div>
          )}

          {/* Priority Level */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
              Niveau de Priorité <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'routine', label: 'Routine (Standard)', badge: 'Délai usuel' },
                { id: 'urgent', label: 'Urgent (Sous 2h)', badge: 'Prioritaire' },
                { id: 'stat', label: 'STAT (Immédiat)', badge: 'Urgence vitale' }
              ].map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPriority(p.id as any)}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    priority === p.id
                      ? 'border-cyan-600 bg-cyan-50/80 text-cyan-950 ring-2 ring-cyan-600/20'
                      : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <p className="text-xs font-bold">{p.label}</p>
                  <p className="text-[10px] text-gray-500 mt-0.5">{p.badge}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Analyses demandées */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
              Analyses & Bilans Demandés <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 border border-gray-100 rounded-2xl p-3 bg-gray-50/50 max-h-48 overflow-y-auto modal-scroll">
              {testOptions.map((test) => {
                const isSelected = selectedTests.includes(test.id);
                return (
                  <label
                    key={test.id}
                    className={`flex items-start gap-2.5 p-2.5 rounded-xl cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-teal-50 border border-teal-200 text-teal-950 font-bold'
                        : 'bg-white border border-gray-100 hover:bg-gray-100/60 text-gray-700'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleTest(test.id)}
                      className="mt-0.5 rounded text-teal-600 focus:ring-teal-500 border-gray-300"
                    />
                    <div className="text-xs min-w-0">
                      <p className="leading-snug">{test.name}</p>
                      {test.category && (
                        <span className="text-[10px] text-gray-400 font-normal">{test.category}</span>
                      )}
                    </div>
                  </label>
                );
              })}
            </div>
            <p className="text-[11px] text-gray-500">
              {selectedTests.length} analyse(s) sélectionnée(s)
            </p>
          </div>

          <FormField label="Renseignements Cliniques / Observations" value={notes} showWordCount={true}>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Antibiothérapie en cours, suspicion d'embolie..."
              className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-2xl text-xs focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
            />
          </FormField>

          <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-xs font-semibold hover:bg-gray-200"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-gradient-to-r from-cyan-600 to-teal-600 text-white rounded-xl text-xs font-bold shadow-md hover:from-cyan-700 hover:to-teal-700"
            >
              Valider la Prescription
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Modal Consultation et Validation des Résultats Labo
const LabOrderDetails: React.FC<{ order: LabOrder; onClose: () => void; onPrint: () => void }> = ({
  order,
  onClose,
  onPrint
}) => {
  const { patients, users, updateLabOrder } = useApp();
  const toast = useToast();
  const patient = patients.find(p => p.id === order.patientId);
  const doctor = users.find(u => u.id === order.doctorId);

  const [testResults, setTestResults] = useState<{ [key: string]: string }>(() => {
    const map: { [key: string]: string } = {};
    (order.tests || []).forEach(t => {
      map[t.id] = t.result || '95';
    });
    return map;
  });

  const handleValidateResults = async () => {
    const updatedTests = (order.tests || []).map(t => ({
      ...t,
      result: testResults[t.id] || t.result || '95',
      status: 'completed' as const
    }));

    await updateLabOrder(order.id, {
      tests: updatedTests,
      status: 'completed',
      collectedAt: new Date().toISOString()
    });

    toast.success('Résultats validés', `Le dossier d'analyses #${order.id} est maintenant validé et disponible.`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl shadow-2xl border border-cyan-100 max-w-2xl w-full overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="font-bold text-base text-gray-900">Résultats du Bilan #{order.id}</h3>
            <p className="text-xs text-gray-500">
              Patient : <span className="font-bold text-gray-900">{patient ? `${patient.firstName} ${patient.lastName}` : (order.patientName || 'Patient Externe')}</span> • Prescripteur : {doctor?.name || order.doctorId || 'Référent'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 modal-scroll max-h-[75vh]">
          <div className="border border-gray-100 rounded-2xl overflow-hidden shadow-2xs">
            <table className="w-full text-xs">
              <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 font-bold uppercase">
                <tr>
                  <th className="px-4 py-3 text-left">Analyse</th>
                  <th className="px-4 py-3 text-center">Résultat Mesuré</th>
                  <th className="px-4 py-3 text-center">Norme / Réf.</th>
                  <th className="px-4 py-3 text-center">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 bg-white font-medium">
                {(order.tests || []).map((t) => (
                  <tr key={t.id}>
                    <td className="px-4 py-3 font-semibold text-gray-900">{t.testName}</td>
                    <td className="px-4 py-3 text-center">
                      <input
                        type="text"
                        value={testResults[t.id] ?? t.result ?? '95'}
                        onChange={(e) => setTestResults(prev => ({ ...prev, [t.id]: e.target.value }))}
                        className="w-24 px-2 py-1 bg-gray-50 border border-gray-200 rounded-lg text-center font-bold text-cyan-700 text-xs focus:ring-2 focus:ring-teal-500/20"
                      />
                    </td>
                    <td className="px-4 py-3 text-center text-gray-500">{t.referenceRange || '70 - 110'}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                        order.status === 'completed'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}>
                        {order.status === 'completed' ? 'Validé' : 'Saisi'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {order.notes && (
            <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900">
              <span className="font-bold block mb-0.5">Notes & Remarques :</span>
              <p>{order.notes}</p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row justify-between gap-2 pt-2 border-t border-gray-100">
            <button
              type="button"
              onClick={handleValidateResults}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Valider & Clôturer les Résultats</span>
            </button>

            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-xs font-semibold hover:bg-gray-200"
              >
                Fermer
              </button>
              <button
                type="button"
                onClick={onPrint}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimer Compte-Rendu</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LabManagement;
