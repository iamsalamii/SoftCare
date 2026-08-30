import React from 'react';
import { useApp } from '../context/AppContext';
import Sidebar from './Sidebar';
import Header from './Header';
import DashboardHome from './dashboard/DashboardHome';
import PatientManagement from './patients/PatientManagement';
import PatientForm from './patients/PatientForm';
import MedicalRecords from './medical/MedicalRecords';
import PharmacyManagement from './pharmacy/PharmacyManagement';
import PharmacyPOS from './pharmacy/PharmacyPOS';
import AppointmentManagement from './appointments/AppointmentManagement';
import AppointmentForm from './appointments/AppointmentForm';
import UserManagement from './admin/UserManagement';
import Reports from './reports/Reports';
import InvoiceList from './billing/InvoiceList';
import BedManagement from './admissions/BedManagement';
import LabManagement from './lab/LabManagement';
import NursingModule from './nursing/NursingModule';
import EmergencyModule from './emergency/EmergencyModule';
import SurgeryModule from './surgery/SurgeryModule';
import ScheduleModule from './hr/ScheduleModule';
import SettingsModule from './settings/SettingsModule';
import BiotechModule from './biotech/BiotechModule';

const Dashboard: React.FC = () => {
  const { currentView, setCurrentView } = useApp();

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardHome />;
      case 'patients':
        return <PatientManagement />;
      case 'patients-new':
        return <PatientForm onClose={() => setCurrentView('patients')} />;
      case 'medical-records':
        return <MedicalRecords />;
      case 'pharmacy':
        return <PharmacyManagement />;
      case 'pharmacy-pos':
        return <PharmacyPOS />;
      case 'appointments':
        return <AppointmentManagement />;
      case 'appointments-new':
        return <AppointmentForm onClose={() => setCurrentView('appointments')} />;
      case 'admissions':
        return <BedManagement />;
      case 'lab':
        return <LabManagement />;
      case 'biotech':
        return <BiotechModule />;
      case 'nursing':
        return <NursingModule />;
      case 'emergencies':
        return <EmergencyModule />;
      case 'surgery':
        return <SurgeryModule />;
      case 'billing':
        return <InvoiceList />;
      case 'schedule':
        return <ScheduleModule />;
      case 'users':
        return <UserManagement />;
      case 'reports':
        return <Reports />;
      case 'settings':
        return <SettingsModule />;
      default:
        return <DashboardHome />;
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
