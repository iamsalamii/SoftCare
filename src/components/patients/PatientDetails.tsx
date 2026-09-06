import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, Edit, Phone, Mail, MapPin, AlertTriangle, Heart, Shield, User, Calendar, Activity } from 'lucide-react';

interface PatientDetailsProps {
  patientId: string;
  onClose: () => void;
  onEdit: () => void;
}

export const PatientDetails: React.FC<PatientDetailsProps> = ({ patientId, onClose, onEdit }) => {
  const { patients } = useApp();
  const patient = patients.find(p => p.id === patientId);

  if (!patient) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm space-y-4">
        <div className="w-16 h-16 bg-gray-100 text-gray-400 rounded-2xl flex items-center justify-center mx-auto">
          <User className="w-8 h-8" />
        </div>
        <p className="text-sm font-semibold text-gray-600">Dossier patient introuvable</p>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-xs font-semibold hover:bg-gray-200"
        >
          Retour à la liste
        </button>
      </div>
    );
  }

  const calculateAge = (dateOfBirth?: string) => {
    if (!dateOfBirth) return 'N/A';
    try {
      const today = new Date();
      const birthDate = new Date(dateOfBirth);
      if (isNaN(birthDate.getTime())) return 'N/A';
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return `${age} ans`;
    } catch {
      return 'N/A';
    }
  };

  const emergencyName = typeof patient.emergencyContact === 'object' && patient.emergencyContact !== null
    ? patient.emergencyContact.name
    : (patient.emergencyContactName || (typeof patient.emergencyContact === 'string' ? patient.emergencyContact : 'Non renseigné'));

  const emergencyPhone = typeof patient.emergencyContact === 'object' && patient.emergencyContact !== null
    ? patient.emergencyContact.phone
    : (patient.emergencyContactPhone || 'Non renseigné');

  const emergencyRelation = typeof patient.emergencyContact === 'object' && patient.emergencyContact !== null
    ? patient.emergencyContact.relationship
    : (patient.emergencyContactRelationship || 'Proche');

  const allergiesList = Array.isArray(patient.allergies)
    ? patient.allergies
    : (typeof (patient as any).allergiesJson === 'string' ? JSON.parse((patient as any).allergiesJson || '[]') : []);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-teal-600 flex items-center justify-center text-white text-xl font-black shadow-lg shadow-teal-500/20">
            {patient.firstName?.[0] || 'P'}{patient.lastName?.[0] || ''}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-gray-900">
                {patient.firstName} {patient.lastName}
              </h1>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                patient.status === 'active' || patient.active
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {patient.status || 'Actif'}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              N° Sécurité Sociale : <span className="font-mono font-semibold">{patient.socialSecurityNumber || 'Non renseigné'}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={onEdit}
            className="flex-1 sm:flex-initial px-4 py-2.5 bg-gradient-to-r from-cyan-600 to-teal-600 text-white rounded-xl text-xs font-bold hover:from-cyan-700 hover:to-teal-700 transition-all shadow-md flex items-center justify-center gap-1.5"
          >
            <Edit className="w-3.5 h-3.5" />
            <span>Modifier Dossier</span>
          </button>
          <button
            onClick={onClose}
            className="p-2.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Personal & Contact */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900 flex items-center gap-2 pb-3 border-b border-gray-100">
              <User className="w-4 h-4 text-cyan-600" />
              <span>Informations Personnelles</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 bg-gray-50/80 rounded-2xl border border-gray-100 space-y-1">
                <span className="text-gray-400 font-medium">Âge & Date de naissance</span>
                <p className="font-bold text-gray-900 text-sm">
                  {calculateAge(patient.dateOfBirth)} ({patient.dateOfBirth ? new Date(patient.dateOfBirth).toLocaleDateString('fr-FR') : 'N/A'})
                </p>
              </div>

              <div className="p-3.5 bg-gray-50/80 rounded-2xl border border-gray-100 space-y-1">
                <span className="text-gray-400 font-medium">Genre / Sexe</span>
                <p className="font-bold text-gray-900 text-sm capitalize">
                  {patient.gender === 'male' ? 'Masculin' : patient.gender === 'female' ? 'Féminin' : 'Autre'}
                </p>
              </div>

              <div className="p-3.5 bg-gray-50/80 rounded-2xl border border-gray-100 space-y-1">
                <span className="text-gray-400 font-medium">Téléphone de contact</span>
                <p className="font-bold text-gray-900 text-sm flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-teal-600" />
                  <span>{patient.phone || 'Non renseigné'}</span>
                </p>
              </div>

              <div className="p-3.5 bg-gray-50/80 rounded-2xl border border-gray-100 space-y-1">
                <span className="text-gray-400 font-medium">Email</span>
                <p className="font-bold text-gray-900 text-sm truncate flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-teal-600 flex-shrink-0" />
                  <span className="truncate">{patient.email || 'Non renseigné'}</span>
                </p>
              </div>

              <div className="sm:col-span-2 p-3.5 bg-gray-50/80 rounded-2xl border border-gray-100 space-y-1">
                <span className="text-gray-400 font-medium">Adresse Principale</span>
                <p className="font-bold text-gray-900 text-sm flex items-start gap-1.5">
                  <MapPin className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
                  <span>{patient.address || 'Non renseignée'}{patient.city ? `, ${patient.city}` : ''}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900 flex items-center gap-2 pb-3 border-b border-gray-100">
              <Activity className="w-4 h-4 text-rose-500" />
              <span>Contact d'Urgence / Personne de Confiance</span>
            </h2>

            <div className="p-4 bg-rose-50/50 rounded-2xl border border-rose-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs">
              <div>
                <p className="font-bold text-gray-900 text-sm">{emergencyName}</p>
                <p className="text-rose-700 font-medium mt-0.5">{emergencyRelation}</p>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-xl border border-rose-200 text-rose-900 font-bold shadow-2xs">
                <Phone className="w-3.5 h-3.5 text-rose-600" />
                <span>{emergencyPhone}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Medical Data & Insurance */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900 flex items-center gap-2 pb-3 border-b border-gray-100">
              <Heart className="w-4 h-4 text-teal-600" />
              <span>Profil Médical & Allergies</span>
            </h2>

            <div className="space-y-4 text-xs">
              <div>
                <span className="text-gray-500 block mb-1 font-semibold">Groupe Sanguin</span>
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-red-50 text-red-700 border border-red-200 font-black text-sm">
                  <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                  <span>{patient.bloodType || (patient as any).bloodGroup || 'Non renseigné'}</span>
                </div>
              </div>

              <div>
                <span className="text-gray-500 block mb-1 font-semibold">Assurance & Mutuelle</span>
                <div className="p-3 bg-cyan-50/80 rounded-2xl border border-cyan-200">
                  <p className="font-bold text-cyan-900">{patient.insuranceName || patient.insuranceId || 'Couverture standard / CPAM'}</p>
                  <p className="text-[11px] text-cyan-700 mt-0.5">Police N° : {patient.insurancePolicyNumber || 'POL-90214'}</p>
                </div>
              </div>

              <div>
                <span className="text-gray-500 block mb-2 font-semibold">Allergies Connues</span>
                {allergiesList.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {allergiesList.map((allergy: string, index: number) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-amber-50 text-amber-900 border border-amber-200"
                      >
                        <AlertTriangle className="w-3 h-3 text-amber-600" />
                        <span>{allergy}</span>
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 italic">Aucune allergie connue répertoriée</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDetails;