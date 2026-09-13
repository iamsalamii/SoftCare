import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BedDouble, User, Calendar, Plus, Search, RefreshCw, Download, FileSpreadsheet, Printer, X } from 'lucide-react';
import { Bed, Admission } from '../../types';
import { printDocument, generateDocumentHeader, generateDocumentFooter, exportToExcel } from '../../utils/exportUtils';
import CustomSelect from '../common/CustomSelect';

const BedManagement: React.FC = () => {
  const { beds, admissions, patients, departments, users, organizationSettings, rooms, addBed } = useApp();
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAdmissionModal, setShowAdmissionModal] = useState(false);
  const [showNewBedModal, setShowNewBedModal] = useState(false);
  const [selectedBed, setSelectedBed] = useState<Bed | null>(null);
  const [showExportMenu, setShowExportMenu] = useState(false);

  const getDepartmentName = (id: string) => {
    const dept = departments.find(d => d.id === id);
    return dept?.name || 'Inconnu';
  };

  const getPatientName = (id: string) => {
    const patient = patients.find(p => p.id === id);
    return patient ? `${patient.firstName} ${patient.lastName}` : 'Inconnu';
  };

  const getAdmission = (id: string) => {
    return admissions.find(a => a.id === id);
  };

  const filteredBeds = beds.filter(bed => {
    const matchesDept = selectedDepartment === 'all' || bed.departmentId === selectedDepartment;
    const matchesStatus = filterStatus === 'all' || bed.status === filterStatus;
    return matchesDept && matchesStatus;
  });

  const stats = {
    total: beds.length,
    available: beds.filter(b => b.status === 'available').length,
    occupied: beds.filter(b => b.status === 'occupied').length,
    maintenance: beds.filter(b => b.status === 'maintenance').length,
    occupancyRate: beds.length > 0
      ? Math.round((beds.filter(b => b.status === 'occupied').length / beds.length) * 100)
      : 0
  };

  const getStatusText = (status: string) => {
    const texts: Record<string, string> = {
      available: 'Disponible',
      occupied: 'Occupe',
      maintenance: 'Maintenance',
      reserved: 'Reserve'
    };
    return texts[status] || status;
  };

  const generateBedsHTML = () => {
    const rows = filteredBeds.map(bed => {
      const room = rooms.find(r => r.id === bed.roomId);
      const admission = bed.admissionId ? getAdmission(bed.admissionId) : null;
      const patient = admission ? patients.find(p => p.id === admission.patientId) : null;

      return `
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd;">${bed.number}</td>
          <td style="padding: 10px; border: 1px solid #ddd;">${room?.number || 'N/A'}</td>
          <td style="padding: 10px; border: 1px solid #ddd;">${getDepartmentName(bed.departmentId)}</td>
          <td style="padding: 10px; border: 1px solid #ddd;">${bed.type}</td>
          <td style="padding: 10px; border: 1px solid #ddd;">${getStatusText(bed.status)}</td>
          <td style="padding: 10px; border: 1px solid #ddd;">${patient ? `${patient.firstName} ${patient.lastName}` : '-'}</td>
        </tr>
      `;
    }).join('');

    return `
      ${generateDocumentHeader(organizationSettings, 'report', `BED-${Date.now().toString().slice(-8)}`)}
      <h2 style="margin: 20px 0; color: #333;">Etat des Lits</h2>
      <p style="color: #666; margin-bottom: 20px;">Total: ${stats.total} | Disponibles: ${stats.available} | Occupes: ${stats.occupied} | Taux: ${stats.occupancyRate}%</p>
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="background-color: ${organizationSettings.primaryColor};">
            <th style="padding: 10px; color: white; text-align: left;">Lit</th>
            <th style="padding: 10px; color: white; text-align: left;">Chambre</th>
            <th style="padding: 10px; color: white; text-align: left;">Departement</th>
            <th style="padding: 10px; color: white; text-align: left;">Type</th>
            <th style="padding: 10px; color: white; text-align: left;">Statut</th>
            <th style="padding: 10px; color: white; text-align: left;">Patient</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
      ${generateDocumentFooter(organizationSettings)}
    `;
  };

  const handleExportPDF = async () => {
    await printDocument(generateBedsHTML(), organizationSettings, 'Etat-Lits');
    setShowExportMenu(false);
  };

  const handleExportExcel = () => {
    const data = filteredBeds.map(bed => {
      const room = rooms.find(r => r.id === bed.roomId);
      const admission = bed.admissionId ? getAdmission(bed.admissionId) : null;
      const patient = admission ? patients.find(p => p.id === admission.patientId) : null;

      return {
        lit: bed.number,
        chambre: room?.number || 'N/A',
        departement: getDepartmentName(bed.departmentId),
        type: bed.type,
        statut: getStatusText(bed.status),
        patient: patient ? `${patient.firstName} ${patient.lastName}` : '-'
      };
    });
    exportToExcel(data, 'Etat-Lits', ['Lit', 'Chambre', 'Departement', 'Type', 'Statut', 'Patient']);
    setShowExportMenu(false);
  };

  const handlePrint = async () => {
    await printDocument(generateBedsHTML(), organizationSettings, 'Etat-Lits');
    setShowExportMenu(false);
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      available: 'bg-green-500',
      occupied: 'bg-red-500',
      maintenance: 'bg-yellow-500',
      reserved: 'bg-blue-500'
    };
    return colors[status] || 'bg-gray-500';
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      standard: 'border-gray-300',
      icu: 'border-blue-500',
      pediatric: 'border-pink-300',
      maternity: 'border-purple-300',
      emergency: 'border-red-400'
    };
    return colors[type] || 'border-gray-300';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Gestion des Lits</h1>
        <div className="flex gap-2">
          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Exporter
            </button>

            {showExportMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowExportMenu(false)} />
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden">
                  <button
                    onClick={handleExportPDF}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                  >
                    <Download className="w-4 h-4 text-red-500" />
                    <span>Exporter PDF</span>
                  </button>
                  <button
                    onClick={handleExportExcel}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-green-500" />
                    <span>Exporter Excel</span>
                  </button>
                  <button
                    onClick={handlePrint}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                  >
                    <Printer className="w-4 h-4 text-blue-500" />
                    <span>Imprimer</span>
                  </button>
                </div>
              </>
            )}
          </div>

          <button
            onClick={() => setShowNewBedModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 shadow-sm font-medium transition-all"
          >
            <Plus className="w-4 h-4" />
            Nouveau Lit
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Total Lits</p>
          <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Disponibles</p>
          <p className="text-3xl font-bold text-green-600">{stats.available}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Occupés</p>
          <p className="text-3xl font-bold text-red-600">{stats.occupied}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Maintenance</p>
          <p className="text-3xl font-bold text-yellow-600">{stats.maintenance}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Taux d'occupation</p>
          <p className="text-3xl font-bold text-blue-600">{stats.occupancyRate}%</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CustomSelect
            label="Département"
            value={selectedDepartment}
            onChange={setSelectedDepartment}
            options={[
              { value: 'all', label: 'Tous les départements' },
              ...departments.map(d => ({ value: d.id, label: d.name }))
            ]}
          />
          <CustomSelect
            label="Statut"
            value={filterStatus}
            onChange={setFilterStatus}
            options={[
              { value: 'all', label: 'Tous les statuts' },
              { value: 'available', label: 'Disponible' },
              { value: 'occupied', label: 'Occupé' },
              { value: 'maintenance', label: 'Maintenance' },
              { value: 'reserved', label: 'Réservé' }
            ]}
          />
        </div>
      </div>

      {/* Bed Grid */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filteredBeds.map((bed) => {
            const admission = bed.currentAdmissionId ? getAdmission(bed.currentAdmissionId) : null;
            const patient = bed.currentPatientId ? patients.find(p => p.id === bed.currentPatientId) : null;

            return (
              <div
                key={bed.id}
                className={`relative rounded-lg border-2 p-4 cursor-pointer transition-all hover:shadow-md ${getTypeColor(bed.type)} ${
                  bed.status === 'available' ? 'bg-green-50' :
                  bed.status === 'occupied' ? 'bg-red-50' :
                  bed.status === 'maintenance' ? 'bg-yellow-50' : 'bg-blue-50'
                }`}
                onClick={() => setSelectedBed(bed)}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">
                    {bed.roomNumber}-{bed.bedNumber}
                  </span>
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(bed.status)}`} />
                </div>

                <p className="text-xs text-gray-500 mb-2">{getDepartmentName(bed.departmentId)}</p>

                {patient && (
                  <div className="mt-2 pt-2 border-t border-gray-200">
                    <div className="flex items-center gap-1 text-xs text-gray-700">
                      <User className="w-3 h-3" />
                      <span className="truncate">{patient.firstName} {patient.lastName}</span>
                    </div>
                    {admission && (
                      <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                        <Calendar className="w-3 h-3" />
                        <span>Depuis {new Date(admission.admissionDate).toLocaleDateString('fr-FR')}</span>
                      </div>
                    )}
                  </div>
                )}

                {bed.status === 'available' && (
                  <div className="mt-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedBed(bed);
                        setShowAdmissionModal(true);
                      }}
                      className="w-full text-xs bg-green-600 text-white py-1 rounded hover:bg-green-700"
                    >
                      Admettre
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Bed Details Modal */}
      {selectedBed && !showAdmissionModal && (
        <BedDetailsModal bed={selectedBed} onClose={() => setSelectedBed(null)} />
      )}

      {/* Admission Modal */}
      {showAdmissionModal && selectedBed && (
        <AdmissionForm
          bed={selectedBed}
          onClose={() => {
            setShowAdmissionModal(false);
            setSelectedBed(null);
          }}
        />
      )}

      {/* New Bed Modal */}
      {showNewBedModal && (
        <NewBedModal
          onClose={() => setShowNewBedModal(false)}
          onSave={async (bedData) => {
            await addBed(bedData);
            setShowNewBedModal(false);
          }}
        />
      )}
    </div>
  );
};

// Composant Détails du lit
const BedDetailsModal: React.FC<{ bed: Bed; onClose: () => void }> = ({ bed, onClose }) => {
  const { admissions, patients, users, departments, updateBed, updateAdmission, organizationSettings } = useApp();
  const patient = bed.currentPatientId ? patients.find(p => p.id === bed.currentPatientId) : null;
  const admission = bed.currentAdmissionId ? admissions.find(a => a.id === bed.currentAdmissionId) : null;
  const doctor = admission?.doctorId ? users.find(u => u.id === admission.doctorId) : null;
  const department = departments.find(d => d.id === bed.departmentId);
  const currencySymbol = organizationSettings?.currencySymbol || '€';

  const handleReleaseBed = async () => {
    // 1. Update Bed status to available
    await updateBed(bed.id, {
      status: 'available',
      currentPatientId: undefined,
      currentAdmissionId: undefined
    });

    // 2. Discharge admission if exists
    if (admission) {
      await updateAdmission(admission.id, {
        status: 'discharged',
        dischargeDate: new Date().toISOString()
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            Lit {bed.roomNumber}-{bed.bedNumber}
          </h2>
          <button onClick={onClose} className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Département</p>
              <p className="font-medium">{department?.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Type</p>
              <p className="font-medium capitalize">{bed.type}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Statut</p>
              <span className={`px-2.5 py-1 text-xs font-semibold rounded-full inline-block ${
                bed.status === 'available' ? 'bg-green-100 text-green-800' :
                bed.status === 'occupied' ? 'bg-red-100 text-red-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {bed.status === 'available' ? 'Disponible' :
                 bed.status === 'occupied' ? 'Occupé' : 'Maintenance'}
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-500">Tarif/jour</p>
              <p className="font-medium">{bed.dailyRate} {currencySymbol}</p>
            </div>
          </div>

          {bed.features.length > 0 && (
            <div>
              <p className="text-sm text-gray-500 mb-1">Équipements</p>
              <div className="flex flex-wrap gap-2">
                {bed.features.map((feature, idx) => (
                  <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          )}

          {patient && admission && (
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <h3 className="font-semibold text-gray-900">Patient actuel</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-gray-500">Nom</p>
                  <p className="font-medium">{patient.firstName} {patient.lastName}</p>
                </div>
                <div>
                  <p className="text-gray-500">Téléphone</p>
                  <p className="font-medium">{patient.phone}</p>
                </div>
                <div>
                  <p className="text-gray-500">Admission</p>
                  <p className="font-medium">{new Date(admission.admissionDate).toLocaleDateString('fr-FR')}</p>
                </div>
                <div>
                  <p className="text-gray-500">Médecin</p>
                  <p className="font-medium">{doctor?.name}</p>
                </div>
              </div>
              {admission.notes && (
                <div className="text-sm">
                  <p className="text-gray-500">Motif</p>
                  <p className="text-gray-700">{admission.notes}</p>
                </div>
              )}
            </div>
          )}

          <div className="flex gap-3 pt-4 border-t">
            <button onClick={onClose} className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors">
              Fermer
            </button>
            {bed.status === 'occupied' && (
              <button
                onClick={handleReleaseBed}
                className="flex-1 px-4 py-2 bg-rose-600 text-white font-bold rounded-xl hover:bg-rose-700 shadow-md shadow-rose-600/20 transition-all flex items-center justify-center gap-2"
              >
                <span>Libérer le lit</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Composant Formulaire d'admission
const AdmissionForm: React.FC<{ bed: Bed; onClose: () => void }> = ({ bed, onClose }) => {
  const { patients, users, addAdmission, updateBed, beds } = useApp();
  const [searchPatient, setSearchPatient] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<string>('');
  const [formData, setFormData] = useState({
    doctorId: users.find(u => u.role === 'doctor')?.id || '1',
    type: 'planned' as Admission['type'],
    reason: '',
    expectedDischargeDate: '',
    notes: ''
  });

  const filteredPatients = patients.filter(p =>
    `${p.firstName} ${p.lastName}`.toLowerCase().includes(searchPatient.toLowerCase())
  );

  const doctors = users.filter(u => u.role === 'doctor' || u.role === 'surgeon');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient || !formData.doctorId) return;

    const todayStr = new Date().toISOString().split('T')[0];
    if (formData.expectedDischargeDate && formData.expectedDischargeDate < todayStr) {
      alert("Erreur chronologique : La date prévisionnelle de sortie ne peut pas être antérieure à la date d'admission.");
      return;
    }

    const patientObj = patients.find(p => p.id === selectedPatient);
    const doctorObj = users.find(u => u.id === formData.doctorId);
    const admissionId = `ADM-${Date.now().toString().slice(-6)}`;

    const admission: Admission = {
      id: admissionId,
      patientId: selectedPatient,
      patientName: patientObj ? `${patientObj.firstName} ${patientObj.lastName}` : '',
      bedId: bed.id,
      bedNumber: `${bed.roomNumber}-${bed.bedNumber}`,
      roomId: bed.roomId,
      roomNumber: bed.roomNumber,
      departmentId: bed.departmentId,
      attendingDoctorId: formData.doctorId,
      attendingDoctorName: doctorObj?.name || 'Dr. Marie Dubois',
      type: formData.type,
      reason: formData.reason,
      admissionDate: todayStr,
      expectedDischargeDate: formData.expectedDischargeDate,
      notes: formData.notes,
      status: 'admitted',
      dailyRate: bed.dailyRate || 150,
      totalAmount: bed.dailyRate || 150
    };

    await addAdmission(admission);
    await updateBed(bed.id, {
      status: 'occupied',
      currentPatientId: selectedPatient,
      currentAdmissionId: admissionId
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Admission - Lit {bed.roomNumber}-{bed.bedNumber}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <RefreshCw className="w-5 h-5 rotate-45" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Patient Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Patient</label>
            {selectedPatient ? (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center justify-between">
                <span className="font-medium text-blue-900">
                  {patients.find(p => p.id === selectedPatient)?.firstName} {' '}
                  {patients.find(p => p.id === selectedPatient)?.lastName}
                </span>
                <button type="button" onClick={() => setSelectedPatient('')} className="text-blue-600">
                  <RefreshCw className="w-4 h-4 rotate-45" />
                </button>
              </div>
            ) : (
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchPatient}
                  onChange={(e) => setSearchPatient(e.target.value)}
                  placeholder="Rechercher un patient..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                {searchPatient && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-40 overflow-y-auto z-10">
                    {patients
                      .filter(p => `${p.firstName} ${p.lastName}`.toLowerCase().includes(searchPatient.toLowerCase()))
                      .slice(0, 5)
                      .map(p => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => {
                            setSelectedPatient(p.id);
                            setSearchPatient('');
                          }}
                          className="w-full px-4 py-2 text-left hover:bg-blue-50"
                        >
                          {p.firstName} {p.lastName} - {p.phone}
                        </button>
                      ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Doctor */}
          <CustomSelect
            label="Médecin traitant"
            value={formData.doctorId}
            onChange={(val) => setFormData(prev => ({ ...prev, doctorId: val }))}
            options={doctors.map(doc => ({ value: doc.id, label: doc.name }))}
            searchable={true}
          />

          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type d'admission</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: 'planned', label: 'Planifiée' },
                { value: 'emergency', label: 'Urgence' },
                { value: 'transfer', label: 'Transfert' }
              ].map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, type: opt.value as Admission['type'] }))}
                  className={`px-3 py-2 rounded-lg border ${
                    formData.type === opt.value
                      ? 'bg-blue-50 border-blue-500 text-blue-700'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Reason */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Motif d'admission</label>
            <input
              type="text"
              value={formData.reason}
              onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: Explorations cardiologiques"
              required
            />
          </div>

          {/* Expected Discharge */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sortie prévue</label>
            <input
              type="date"
              value={formData.expectedDischargeDate}
              onChange={(e) => setFormData(prev => ({ ...prev, expectedDischargeDate: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Notes additionnelles"
            />
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg">
              Annuler
            </button>
            <button
              type="submit"
              disabled={!selectedPatient || !formData.doctorId}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              Valider l'admission
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Composant Modal Nouveau Lit
const NewBedModal: React.FC<{
  onClose: () => void;
  onSave: (bedData: Partial<Bed>) => Promise<void>;
}> = ({ onClose, onSave }) => {
  const { departments, rooms } = useApp();
  const [roomNumber, setRoomNumber] = useState('101');
  const [bedNumber, setBedNumber] = useState('A');
  const [departmentId, setDepartmentId] = useState(departments[0]?.id || '1');
  const [type, setType] = useState<Bed['type']>('standard');
  const [dailyRate, setDailyRate] = useState(150);
  const [status, setStatus] = useState<Bed['status']>('available');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const dept = departments.find(d => d.id === departmentId);
      await onSave({
        roomNumber,
        bedNumber,
        departmentId,
        department: dept?.name || 'Médecine',
        type,
        dailyRate,
        status,
        features: type === 'icu' ? ['Monitoring', 'Ventilateur'] : ['TV', 'Salle de bain']
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-100">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <BedDouble className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Ajouter un Nouveau Lit</h2>
              <p className="text-xs text-gray-500">Configuration de l'équipement hospitalier</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-xl text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">N° Chambre</label>
              <input
                type="text"
                value={roomNumber}
                onChange={(e) => setRoomNumber(e.target.value)}
                placeholder="Ex: 101, 204..."
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Code / Lettre du Lit</label>
              <input
                type="text"
                value={bedNumber}
                onChange={(e) => setBedNumber(e.target.value)}
                placeholder="Ex: A, B, 1, 2..."
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>
          </div>

          <CustomSelect
            label="Service / Département"
            value={departmentId}
            onChange={setDepartmentId}
            options={departments.map(d => ({ value: d.id, label: d.name }))}
          />

          <div className="grid grid-cols-2 gap-4">
            <CustomSelect
              label="Type de Lit"
              value={type || 'standard'}
              onChange={(val) => setType(val as Bed['type'])}
              options={[
                { value: 'standard', label: 'Standard / Médecine' },
                { value: 'icu', label: 'Soins Intensifs / Réa' },
                { value: 'pediatric', label: 'Pédiatrique' },
                { value: 'maternity', label: 'Maternité' },
                { value: 'emergency', label: 'Urgences / UHCD' }
              ]}
            />
            <CustomSelect
              label="Statut Initial"
              value={status}
              onChange={(val) => setStatus(val as Bed['status'])}
              options={[
                { value: 'available', label: 'Disponible' },
                { value: 'maintenance', label: 'En Maintenance' },
                { value: 'reserved', label: 'Réservé' }
              ]}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Tarif Journalier ({currencySymbol})</label>
            <input
              type="number"
              value={dailyRate}
              onChange={(e) => setDailyRate(parseFloat(e.target.value) || 0)}
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              min="0"
              required
            />
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold text-sm transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm shadow-md shadow-blue-500/20 transition-all disabled:opacity-50"
            >
              {loading ? 'Création...' : 'Créer le Lit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BedManagement;
