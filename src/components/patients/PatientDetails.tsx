import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, Edit, Phone, Mail, MapPin, AlertTriangle, Heart } from 'lucide-react';

interface PatientDetailsProps {
  patientId: string;
  onClose: () => void;
  onEdit: () => void;
}

const PatientDetails: React.FC<PatientDetailsProps> = ({ patientId, onClose, onEdit }) => {
  const { patients } = useApp();
  const patient = patients.find(p => p.id === patientId);

  if (!patient) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Patient non trouvé</p>
      </div>
    );
  }

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Détails du Patient</h1>
        <div className="flex space-x-2">
          <button
            onClick={onEdit}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Edit className="w-4 h-4" />
            <span>Modifier</span>
          </button>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Informations personnelles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-500">Nom complet</label>
                <p className="text-lg font-medium text-gray-900">
                  {patient.firstName} {patient.lastName}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Âge</label>
                <p className="text-lg font-medium text-gray-900">
                  {calculateAge(patient.dateOfBirth)} ans
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Date de naissance</label>
                <p className="text-lg font-medium text-gray-900">
                  {new Date(patient.dateOfBirth).toLocaleDateString('fr-FR')}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Sexe</label>
                <p className="text-lg font-medium text-gray-900 capitalize">
                  {patient.gender === 'male' ? 'Masculin' : patient.gender === 'female' ? 'Féminin' : 'Autre'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-gray-400" />
                <span className="text-gray-900">{patient.phone}</span>
              </div>
              {patient.email && (
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-900">{patient.email}</span>
                </div>
              )}
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                <span className="text-gray-900">{patient.address}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact d'urgence</h2>
            <div className="space-y-2">
              <p className="text-gray-900 font-medium">{patient.emergencyContact.name}</p>
              <p className="text-gray-600">{patient.emergencyContact.relationship}</p>
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-gray-400" />
                <span className="text-gray-900">{patient.emergencyContact.phone}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Informations médicales</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Groupe sanguin</label>
                <div className="flex items-center space-x-2">
                  <Heart className="w-4 h-4 text-red-500" />
                  <span className="px-2 py-1 text-sm font-semibold rounded-full bg-red-100 text-red-800">
                    {patient.bloodType}
                  </span>
                </div>
              </div>

              {patient.insurance && (
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Assurance</label>
                  <p className="text-gray-900">{patient.insurance}</p>
                </div>
              )}

              {patient.allergies.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">Allergies</label>
                  <div className="space-y-2">
                    {patient.allergies.map((allergy, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <AlertTriangle className="w-4 h-4 text-yellow-500" />
                        <span className="px-2 py-1 text-sm bg-yellow-100 text-yellow-800 rounded-full">
                          {allergy}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Historique médical</h2>
            {patient.medicalHistory.length === 0 ? (
              <p className="text-gray-500 text-sm">Aucun historique médical enregistré</p>
            ) : (
              <div className="space-y-3">
                {patient.medicalHistory.map((record) => (
                  <div key={record.id} className="border-l-4 border-blue-200 pl-4">
                    <p className="font-medium text-gray-900">{record.title}</p>
                    <p className="text-sm text-gray-600">{record.date}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDetails;