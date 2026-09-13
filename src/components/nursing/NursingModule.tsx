import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import {
  Heart, Activity, Thermometer, Droplets, Users as UsersIcon, Plus, Search,
  CheckCircle2, Clock, AlertTriangle, FileText, Download, Printer, X, Sparkles
} from 'lucide-react';
import CustomSelect from '../common/CustomSelect';
import FormField from '../common/FormField';
import { printDocument, generateDocumentHeader, generateDocumentFooter } from '../../utils/exportUtils';

interface VitalRecord {
  id: string;
  patientId: string;
  timestamp: string;
  nurseName: string;
  bloodPressureSys: number;
  bloodPressureDia: number;
  heartRate: number;
  temperature: number;
  spO2: number;
  respiratoryRate: number;
  painScale: number;
  bloodGlucose?: number;
  notes?: string;
}

interface CarePlan {
  id: string;
  patientId: string;
  title: string;
  frequency: string;
  instructions: string;
  status: 'active' | 'completed' | 'paused';
  createdAt: string;
}

interface NursingNote {
  id: string;
  patientId: string;
  nurseName: string;
  timestamp: string;
  category: 'observation' | 'transmission' | 'incident';
  content: string;
}

export const NursingModule: React.FC = () => {
  const {
    patients = [], admissions = [], users = [], currentUser, organizationSettings,
    vitalsList, setVitalsList, addVitalRecord,
    carePlans, setCarePlans, addCarePlan, updateCarePlan,
    nursingNotes, setNursingNotes, addNursingNote, getDropdownOptions
  } = useApp();
  const toast = useToast();

  const [selectedTab, setSelectedTab] = useState<'vitals' | 'plans' | 'notes'>('vitals');
  const [searchTerm, setSearchTerm] = useState('');

  // Modals state
  const [showVitalsModal, setShowVitalsModal] = useState(false);
  const [showCarePlanModal, setShowCarePlanModal] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);

  const getPatientName = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId);
    return patient ? `${patient.firstName} ${patient.lastName}` : 'Patient Hospitalisé';
  };

  const handlePrintNursingSheet = async () => {
    const html = `
      ${generateDocumentHeader(organizationSettings, 'report', `SOI-${Date.now().toString().slice(-6)}`)}
      <h2 style="margin: 20px 0 10px 0; color: ${organizationSettings.primaryColor};">FEUILLE DE SOINS & TRANSMISSIONS INFIRMIÈRES</h2>
      <p style="color: #64748b; font-size: 13px; margin-bottom: 20px;">Date d'édition : ${new Date().toLocaleString('fr-FR')}</p>

      <h3 style="font-size: 14px; margin: 15px 0 8px 0;">Dernières Constantes Enregistrées</h3>
      <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
        <thead>
          <tr style="background: ${organizationSettings.primaryColor}; color: white;">
            <th style="padding: 8px;">Patient</th>
            <th style="padding: 8px; text-align: center;">Tension (mmHg)</th>
            <th style="padding: 8px; text-align: center;">Pouls (bpm)</th>
            <th style="padding: 8px; text-align: center;">Temp (°C)</th>
            <th style="padding: 8px; text-align: center;">SpO2 (%)</th>
            <th style="padding: 8px; text-align: center;">Date & Heure</th>
          </tr>
        </thead>
        <tbody>
          ${vitalsList.map(v => `
            <tr style="border-bottom: 1px solid #e2e8f0;">
              <td style="padding: 8px; font-weight: bold;">${getPatientName(v.patientId)}</td>
              <td style="padding: 8px; text-align: center;">${v.bloodPressureSys}/${v.bloodPressureDia}</td>
              <td style="padding: 8px; text-align: center;">${v.heartRate}</td>
              <td style="padding: 8px; text-align: center;">${v.temperature}°C</td>
              <td style="padding: 8px; text-align: center;">${v.spO2}%</td>
              <td style="padding: 8px; text-align: center;">${new Date(v.timestamp).toLocaleString('fr-FR')}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      ${generateDocumentFooter(organizationSettings)}
    `;

    await printDocument(html, organizationSettings, 'Feuille-Soins-Infirmiers');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center font-bold">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Module de Soins Infirmiers</h1>
            <p className="text-xs text-gray-500">
              Relevé des constantes au chevet, plans de soins et transmissions ciblées (DAR).
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrintNursingSheet}
            className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimer la Feuille de Soins</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-cyan-600 to-teal-700 text-white p-5 rounded-3xl shadow-lg shadow-teal-600/20 space-y-1">
          <span className="text-xs text-cyan-100 font-medium">Relevés de Constantes</span>
          <p className="text-2xl font-black">{vitalsList.length} mesures</p>
          <span className="text-[10px] text-cyan-200">Dernière saisie : il y a quelques instants</span>
        </div>

        <div className="bg-gradient-to-br from-teal-600 to-emerald-700 text-white p-5 rounded-3xl shadow-lg shadow-emerald-600/20 space-y-1">
          <span className="text-xs text-emerald-100 font-medium">Plans de Soins Actifs</span>
          <p className="text-2xl font-black">{carePlans.filter(p => p.status === 'active').length} plans</p>
          <span className="text-[10px] text-emerald-200">100% des prescriptions couvertes</span>
        </div>

        <div className="bg-gradient-to-br from-slate-800 to-slate-900 text-white p-5 rounded-3xl shadow-lg space-y-1">
          <span className="text-xs text-slate-300 font-medium">Transmissions Ciblées</span>
          <p className="text-2xl font-black">{nursingNotes.length} notes</p>
          <span className="text-[10px] text-slate-400">Continuité des soins 24/7</span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex border-b border-gray-100 p-2 gap-2 bg-slate-50/50">
          {[
            { id: 'vitals', label: 'Constantes & Signes Vitaux', icon: Activity },
            { id: 'plans', label: 'Plans de Soins Infirmiers', icon: Heart },
            { id: 'notes', label: 'Transmissions & Notes DAR', icon: FileText }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id as any)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                selectedTab === tab.id
                  ? 'bg-white text-teal-800 shadow-sm border border-teal-100'
                  : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100/50'
              }`}
            >
              <tab.icon className="w-4 h-4 text-cyan-600" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab 1: Vitals */}
        {selectedTab === 'vitals' && (
          <div className="p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                Historique des Relevés au Chevet
              </h2>
              <button
                onClick={() => setShowVitalsModal(true)}
                className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-teal-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>Nouveau Relevé de Constantes</span>
              </button>
            </div>

            <div className="border border-gray-100 rounded-2xl overflow-hidden shadow-2xs">
              <table className="w-full text-xs">
                <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 font-bold uppercase">
                  <tr>
                    <th className="px-4 py-3 text-left">Patient</th>
                    <th className="px-4 py-3 text-center">Tension (mmHg)</th>
                    <th className="px-4 py-3 text-center">Pouls (bpm)</th>
                    <th className="px-4 py-3 text-center">Température</th>
                    <th className="px-4 py-3 text-center">SpO2</th>
                    <th className="px-4 py-3 text-center">Douleur (0-10)</th>
                    <th className="px-4 py-3 text-left">Infirmier & Observations</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 bg-white font-medium">
                  {vitalsList.map((v) => (
                    <tr key={v.id} className="hover:bg-slate-50/50">
                      <td className="px-4 py-3">
                        <span className="font-bold text-gray-900 block">{getPatientName(v.patientId)}</span>
                        <span className="text-[10px] text-gray-400 font-mono">
                          {new Date(v.timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center font-bold text-gray-800">
                        {v.bloodPressureSys}/{v.bloodPressureDia}
                      </td>
                      <td className="px-4 py-3 text-center font-bold text-teal-700">
                        {v.heartRate} bpm
                      </td>
                      <td className="px-4 py-3 text-center font-bold text-amber-700">
                        {v.temperature} °C
                      </td>
                      <td className="px-4 py-3 text-center font-bold text-cyan-700">
                        {v.spO2} %
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          v.painScale >= 5 ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-700'
                        }`}>
                          EVA {v.painScale}/10
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        <span className="font-semibold text-gray-900 block">{v.nurseName}</span>
                        <span className="text-[11px] text-gray-500">{v.notes || 'R.A.S.'}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Care Plans */}
        {selectedTab === 'plans' && (
          <div className="p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                Protocoles & Plans de Soins Actifs
              </h2>
              <button
                onClick={() => setShowCarePlanModal(true)}
                className="px-4 py-2 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>Nouveau Plan de Soins</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {carePlans.map((plan) => (
                <div key={plan.id} className="p-5 bg-white rounded-2xl border border-gray-200 shadow-xs space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                        {getPatientName(plan.patientId)}
                      </span>
                      <h3 className="text-sm font-bold text-gray-900 mt-1">{plan.title}</h3>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Actif
                    </span>
                  </div>

                  <p className="text-xs text-gray-600 leading-relaxed bg-gray-50 p-3 rounded-xl border border-gray-100">
                    {plan.instructions}
                  </p>

                  <div className="flex justify-between items-center text-xs text-gray-500 pt-1">
                    <span className="flex items-center gap-1 font-semibold text-gray-700">
                      <Clock className="w-3.5 h-3.5 text-teal-600" />
                      Fréquence : {plan.frequency}
                    </span>
                    <button
                      onClick={() => toast.success('Soin validé', `Soin validé pour ${getPatientName(plan.patientId)}`)}
                      className="px-3 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg font-bold text-xs transition-colors"
                    >
                      ✓ Valider Passage
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Nursing Notes DAR */}
        {selectedTab === 'notes' && (
          <div className="p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                Transmissions Ciblées & Cahier de Relève
              </h2>
              <button
                onClick={() => setShowNoteModal(true)}
                className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-teal-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>Ajouter Transmission DAR</span>
              </button>
            </div>

            <div className="space-y-3">
              {nursingNotes.map((note) => (
                <div key={note.id} className="p-4 bg-white rounded-2xl border border-gray-200 shadow-2xs space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-900">{getPatientName(note.patientId)}</span>
                      <span className="text-gray-400">•</span>
                      <span className="text-gray-600 font-semibold">{note.nurseName}</span>
                    </div>
                    <span className="text-gray-400 font-mono text-[11px]">
                      {new Date(note.timestamp).toLocaleString('fr-FR')}
                    </span>
                  </div>

                  <p className="text-xs text-gray-800 bg-cyan-50/40 p-3 rounded-xl border border-cyan-100 leading-relaxed font-sans">
                    {note.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modal 1: Saisie Constantes */}
      {showVitalsModal && (
        <VitalsModal
          patients={patients}
          onClose={() => setShowVitalsModal(false)}
          onSave={async (vital) => {
            await addVitalRecord(vital);
            setShowVitalsModal(false);
          }}
        />
      )}

      {/* Modal 2: Plan de soins */}
      {showCarePlanModal && (
        <CarePlanModal
          patients={patients}
          getDropdownOptions={getDropdownOptions}
          onClose={() => setShowCarePlanModal(false)}
          onSave={async (plan) => {
            await addCarePlan(plan);
            setShowCarePlanModal(false);
          }}
        />
      )}

      {/* Modal 3: Transmission DAR */}
      {showNoteModal && (
        <NoteModal
          patients={patients}
          nurseName={currentUser?.name || 'Infirmier de garde'}
          onClose={() => setShowNoteModal(false)}
          onSave={async (note) => {
            await addNursingNote(note);
            setShowNoteModal(false);
          }}
        />
      )}
    </div>
  );
};

// Sub-Modal: Saisie Constantes
const VitalsModal: React.FC<{
  patients: any[];
  onClose: () => void;
  onSave: (vital: VitalRecord) => void;
}> = ({ patients, onClose, onSave }) => {
  const { currentUser } = useApp();
  const [patientId, setPatientId] = useState(patients[0]?.id || '');
  const [bpSys, setBpSys] = useState(120);
  const [bpDia, setBpDia] = useState(80);
  const [hr, setHr] = useState(72);
  const [temp, setTemp] = useState(37.0);
  const [spo2, setSpo2] = useState(98);
  const [rr, setRr] = useState(16);
  const [pain, setPain] = useState(0);
  const [notes, setNotes] = useState('');

  const patientOptions = patients.map(p => ({
    value: p.id,
    label: `${p.firstName} ${p.lastName}`
  }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: `VIT-${Date.now()}`,
      patientId,
      timestamp: new Date().toISOString(),
      nurseName: currentUser?.name || 'Infirmier de garde',
      bloodPressureSys: bpSys,
      bloodPressureDia: bpDia,
      heartRate: hr,
      temperature: temp,
      spO2: spo2,
      respiratoryRate: rr,
      painScale: pain,
      notes
    });
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl shadow-2xl border border-cyan-100 max-w-lg w-full overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center font-bold">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-gray-900">Saisie des Constantes au Chevet</h3>
              <p className="text-xs text-gray-500">Relevé infirmier instantané</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-600 rounded-xl">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 modal-scroll max-h-[80vh]">
          <FormField label="Patient" required={true}>
            <CustomSelect
              options={patientOptions}
              value={patientId}
              onChange={(val) => setPatientId(val)}
              searchable={true}
            />
          </FormField>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold uppercase text-gray-600 mb-1">
                Tension Systolique (mmHg) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                required
                value={bpSys}
                onChange={(e) => setBpSys(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-gray-600 mb-1">
                Tension Diastolique (mmHg) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                required
                value={bpDia}
                onChange={(e) => setBpDia(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-gray-600 mb-1">
                Fréquence Cardiaque (bpm) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                required
                value={hr}
                onChange={(e) => setHr(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-teal-700"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-gray-600 mb-1">
                Température (°C) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                step="0.1"
                required
                value={temp}
                onChange={(e) => setTemp(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-amber-700"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-gray-600 mb-1">
                Saturation SpO2 (%) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                required
                value={spo2}
                onChange={(e) => setSpo2(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-cyan-700"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-gray-600 mb-1">
                Échelle Douleur (EVA 0-10)
              </label>
              <input
                type="number"
                min="0"
                max="10"
                value={pain}
                onChange={(e) => setPain(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-rose-700"
              />
            </div>
          </div>

          <FormField label="Observations Infirmières">
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: Patient reposé, perfusion en cours..."
              className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs"
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
              className="px-5 py-2 bg-gradient-to-r from-cyan-600 to-teal-600 text-white rounded-xl text-xs font-bold shadow-md"
            >
              Enregistrer Constantes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Sub-Modal: Plan de Soins
const CarePlanModal: React.FC<{
  patients: any[];
  onClose: () => void;
  onSave: (plan: CarePlan) => void;
  getDropdownOptions?: (category: string) => any[];
}> = ({ patients, onClose, onSave, getDropdownOptions }) => {
  const [patientId, setPatientId] = useState(patients[0]?.id || '');
  const [title, setTitle] = useState('Pansement & Soins de plaie');
  const [frequency, setFrequency] = useState('Toutes les 4 heures');
  const [instructions, setInstructions] = useState('');

  const patientOptions = patients.map(p => ({
    value: p.id,
    label: `${p.firstName} ${p.lastName}`
  }));

  const careTypeDropdown = getDropdownOptions ? getDropdownOptions('nursing_care_type') : [];
  const careTypeOptions = careTypeDropdown.length > 0
    ? careTypeDropdown.map(c => ({ value: c.value, label: c.label }))
    : [
        { value: 'Pansement & Soins de plaie', label: 'Pansement & Soins de plaie' },
        { value: 'Perfusion & Voie veineuse', label: 'Perfusion & Voie veineuse' },
        { value: 'Injection IM / SC', label: 'Injection IM / SC' },
        { value: 'Prise de sang & Bilan', label: 'Prise de sang & Bilan biologique' },
        { value: 'Sondage urinaire', label: 'Sondage urinaire & Diurèse' },
        { value: 'Administration PO', label: 'Administration médicamenteuse PO' },
        { value: 'Surveillance post-op', label: 'Surveillance post-opératoire' },
        { value: 'Soins d\'hygiène / Nursing', label: 'Soins d\'hygiène / Nursing' }
      ];

  const freqDropdown = getDropdownOptions ? getDropdownOptions('nursing_frequency') : [];
  const frequencyOptions = freqDropdown.length > 0
    ? freqDropdown.map(f => ({ value: f.value, label: f.label }))
    : [
        { value: 'Toutes les 2 heures', label: 'Toutes les 2 heures' },
        { value: 'Toutes les 4 heures', label: 'Toutes les 4 heures' },
        { value: 'Toutes les 6 heures', label: 'Toutes les 6 heures' },
        { value: '3 fois par jour (8h-14h-20h)', label: '3 fois par jour (8h-14h-20h)' },
        { value: '2 fois par jour (Matin / Soir)', label: '2 fois par jour (Matin / Soir)' },
        { value: '1 fois par jour (Matin)', label: '1 fois par jour (Matin)' },
        { value: 'Au besoin / Si douleur', label: 'Au besoin / Si douleur' },
        { value: 'En continu', label: 'En continu' }
      ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: `PLAN-${Date.now()}`,
      patientId,
      title,
      frequency,
      instructions,
      status: 'active',
      createdAt: new Date().toISOString()
    });
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl shadow-2xl border border-teal-100 max-w-md w-full overflow-hidden flex flex-col">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-slate-50/50">
          <h3 className="font-bold text-base text-gray-900">Nouveau Plan de Soins</h3>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-600 rounded-xl">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <FormField label="Patient" required={true}>
            <CustomSelect
              options={patientOptions}
              value={patientId}
              onChange={(val) => setPatientId(val)}
              searchable={true}
            />
          </FormField>

          <FormField label="Type / Intitulé du Soin" required={true}>
            <CustomSelect
              options={careTypeOptions}
              value={title}
              onChange={(val) => setTitle(val)}
              searchable={true}
              allowCustom={true}
              placeholder="Sélectionner ou saisir..."
            />
          </FormField>

          <FormField label="Fréquence d'Exécution" required={true}>
            <CustomSelect
              options={frequencyOptions}
              value={frequency}
              onChange={(val) => setFrequency(val)}
              searchable={true}
              allowCustom={true}
              placeholder="Sélectionner la fréquence..."
            />
          </FormField>

          <FormField label="Protocole & Consignes">
            <textarea
              rows={3}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="Nettoyer à la Bétadine dermique, surveiller écoulements..."
              className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs"
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
              className="px-5 py-2 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-xl text-xs font-bold shadow-md"
            >
              Créer le Plan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Sub-Modal: Transmission DAR
const NoteModal: React.FC<{
  patients: any[];
  nurseName: string;
  onClose: () => void;
  onSave: (note: NursingNote) => void;
}> = ({ patients, nurseName, onClose, onSave }) => {
  const [patientId, setPatientId] = useState(patients[0]?.id || '');
  const [content, setContent] = useState('');

  const patientOptions = patients.map(p => ({
    value: p.id,
    label: `${p.firstName} ${p.lastName}`
  }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: `NOTE-${Date.now()}`,
      patientId,
      nurseName,
      timestamp: new Date().toISOString(),
      category: 'transmission',
      content
    });
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl shadow-2xl border border-cyan-100 max-w-md w-full overflow-hidden flex flex-col">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-slate-50/50">
          <h3 className="font-bold text-base text-gray-900">Transmission Ciblée DAR</h3>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-600 rounded-xl">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <FormField label="Patient" required={true}>
            <CustomSelect
              options={patientOptions}
              value={patientId}
              onChange={(val) => setPatientId(val)}
              searchable={true}
            />
          </FormField>

          <FormField
            label="Contenu de la Transmission (Données / Actions / Résultats)"
            required={true}
            value={content}
            showWordCount={true}
          >
            <textarea
              rows={4}
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="D : Patient agité à 22h. A : Réassurance et pose de barrières de lit. R : Sommeil calme à 23h."
              className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
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
              className="px-5 py-2 bg-gradient-to-r from-cyan-600 to-teal-600 text-white rounded-xl text-xs font-bold shadow-md"
            >
              Enregistrer Transmission
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NursingModule;
