import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Video, VideoOff, Mic, MicOff, PhoneOff, MessageSquare,
  FileText, Send, User, Shield, Stethoscope, Heart, Sparkles,
  CheckCircle2, Plus, AlertCircle, Clock, Copy, Check
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const TeleconsultationModule: React.FC = () => {
  const { patients, currentUser, addMedicalRecord } = useApp();
  const toast = useToast();

  const [activeSession, setActiveSession] = useState<boolean>(false);
  const [selectedPatientId, setSelectedPatientId] = useState<string>(patients[0]?.id || '');
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [messages, setMessages] = useState<{ sender: string; text: string; time: string }[]>([
    { sender: 'Système', text: 'Connexion WebRTC sécurisée établie (Chiffrement DTLS-SRTP).', time: '10:00' },
    { sender: 'Patient', text: 'Bonjour Docteur, je vous entends très bien.', time: '10:01' }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  // Live vitals & prescription during call
  const [diagnosis, setDiagnosis] = useState('Suivi post-opératoire cardiologique stable.');
  const [prescriptionText, setPrescriptionText] = useState('Paracétamol 1g (1 cp x 3/j si douleur) - 5 jours');
  const [prescriptionSaved, setPrescriptionSaved] = useState(false);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const selectedPatient = patients.find(p => p.id === selectedPatientId) || patients[0];

  useEffect(() => {
    let stream: MediaStream | null = null;
    if (activeSession && isCameraOn) {
      navigator.mediaDevices?.getUserMedia({ video: true, audio: true })
        .then((s) => {
          stream = s;
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = s;
          }
        })
        .catch(() => {
          console.log('Caméra locale non disponible ou refusée - Mode virtuel actif');
        });
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(t => t.stop());
      }
    };
  }, [activeSession, isCameraOn]);

  const handleStartCall = () => {
    setActiveSession(true);
    toast.success('Téléconsultation démarrée', `Salon ouvert avec ${selectedPatient?.firstName} ${selectedPatient?.lastName}`);
  };

  const handleEndCall = () => {
    setActiveSession(false);
    toast.info('Téléconsultation clôturée', 'Le compte-rendu a été archivé.');
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    setMessages(prev => [
      ...prev,
      { sender: currentUser?.name || 'Docteur', text: newMessage, time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) }
    ]);
    setNewMessage('');
  };

  const handleSavePrescription = () => {
    setPrescriptionSaved(true);
    toast.success('Ordonnance transmise', 'Envoyée directement sur le portail sécurisé du patient.');
    setTimeout(() => setPrescriptionSaved(false), 3000);
  };

  const handleCopyPatientLink = () => {
    navigator.clipboard.writeText(`https://teleconsult.softcare.hospital/room/${selectedPatient?.id || 'demo'}`);
    setCopiedLink(true);
    toast.success('Lien copié', 'Lien d\'invitation sécurisé prêt à être envoyé par SMS/Email.');
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-teal-600 flex items-center justify-center text-white shadow-lg shadow-teal-500/20">
            <Video className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-gray-900">Téléconsultation & Visio Médicale</h1>
              <span className="px-2.5 py-0.5 text-[10px] font-bold bg-cyan-50 text-cyan-800 border border-cyan-200 rounded-full">
                WebRTC HD Chiffré
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Consultations vidéo à distance avec télé-prescription et constantes en direct.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={selectedPatientId}
            onChange={(e) => setSelectedPatientId(e.target.value)}
            disabled={activeSession}
            className="px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
          >
            {patients.map(p => (
              <option key={p.id} value={p.id}>{p.firstName} {p.lastName} ({p.gender === 'male' ? 'H' : 'F'})</option>
            ))}
          </select>

          <button
            onClick={handleCopyPatientLink}
            className="px-3 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5"
            title="Copier le lien d'invitation pour le patient"
          >
            {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span className="hidden sm:inline">Lien Patient</span>
          </button>
        </div>
      </div>

      {!activeSession ? (
        /* Waiting Room Card */
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 sm:p-12 text-center max-w-2xl mx-auto space-y-6">
          <div className="w-20 h-20 bg-cyan-50 rounded-3xl flex items-center justify-center text-cyan-600 mx-auto shadow-inner">
            <Video className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-bold text-gray-900">
              Prêt pour la téléconsultation avec {selectedPatient?.firstName} {selectedPatient?.lastName}
            </h3>
            <p className="text-xs text-gray-500 max-w-md mx-auto">
              Le flux audio/vidéo est chiffré de bout en bout conformément aux normes de sécurité sanitaire HDS.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-gray-100 flex items-center justify-center gap-6 text-xs text-gray-700">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-teal-600" />
              <span>Chiffrement DTLS-SRTP</span>
            </div>
            <div className="flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-cyan-600" />
              <span>Télé-prescription Active</span>
            </div>
          </div>

          <button
            onClick={handleStartCall}
            className="px-8 py-4 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white rounded-2xl font-bold text-sm shadow-xl shadow-teal-600/25 transition-all hover:scale-[1.02] flex items-center justify-center gap-2.5 mx-auto"
          >
            <Video className="w-5 h-5" />
            <span>Rejoindre le Salon Médical</span>
          </button>
        </div>
      ) : (
        /* Active Video Room */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Video Stream */}
          <div className="lg:col-span-2 space-y-4">
            <div className="relative bg-slate-950 rounded-3xl overflow-hidden aspect-video border border-slate-800 shadow-2xl flex items-center justify-center">
              {/* Patient Video Simulation */}
              <div className="text-center space-y-3">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-500 to-teal-600 mx-auto flex items-center justify-center text-white text-2xl font-black shadow-xl ring-4 ring-white/10">
                  {selectedPatient?.firstName[0]}{selectedPatient?.lastName[0]}
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white">{selectedPatient?.firstName} {selectedPatient?.lastName}</h4>
                  <span className="text-[10px] text-emerald-400 font-mono bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                    Flux Vidéo HD Sécurisé • Latence 18ms
                  </span>
                </div>
              </div>

              {/* Doctor Pip Video */}
              <div className="absolute top-4 right-4 w-32 sm:w-44 aspect-video bg-slate-900 rounded-2xl overflow-hidden border-2 border-white/20 shadow-lg">
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                {!isCameraOn && (
                  <div className="absolute inset-0 bg-slate-800 flex items-center justify-center text-white text-xs font-bold">
                    Caméra éteinte
                  </div>
                )}
                <div className="absolute bottom-1 left-1 bg-black/60 px-1.5 py-0.5 rounded text-[9px] text-white">
                  Vous (Dr)
                </div>
              </div>

              {/* Call Controls Bar */}
              <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-slate-900/90 backdrop-blur-md px-5 py-2.5 rounded-2xl border border-white/10 shadow-2xl">
                <button
                  onClick={() => setIsMicOn(!isMicOn)}
                  className={`p-3 rounded-xl transition-all ${
                    isMicOn ? 'bg-white/15 text-white hover:bg-white/25' : 'bg-rose-500 text-white'
                  }`}
                  title={isMicOn ? 'Couper le micro' : 'Activer le micro'}
                >
                  {isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                </button>

                <button
                  onClick={() => setIsCameraOn(!isCameraOn)}
                  className={`p-3 rounded-xl transition-all ${
                    isCameraOn ? 'bg-white/15 text-white hover:bg-white/25' : 'bg-rose-500 text-white'
                  }`}
                  title={isCameraOn ? 'Couper la caméra' : 'Activer la caméra'}
                >
                  {isCameraOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                </button>

                <button
                  onClick={handleEndCall}
                  className="px-5 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-xs flex items-center gap-2 shadow-lg shadow-rose-600/30 transition-all hover:scale-105"
                >
                  <PhoneOff className="w-4 h-4" />
                  <span>Terminer</span>
                </button>
              </div>
            </div>

            {/* Live Clinical Notes & Tele-Prescription */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-cyan-600" />
                  <span>Télé-prescription & Compte-rendu de consultation</span>
                </h3>
                <span className="text-[10px] font-bold bg-teal-50 text-teal-800 px-2.5 py-0.5 rounded-full border border-teal-200">
                  Signature Électronique
                </span>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-gray-600 mb-1">Conclusion Diagnostique</label>
                  <input
                    type="text"
                    value={diagnosis}
                    onChange={(e) => setDiagnosis(e.target.value)}
                    className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-gray-600 mb-1">Prescription Médicamenteuse</label>
                  <textarea
                    rows={2}
                    value={prescriptionText}
                    onChange={(e) => setPrescriptionText(e.target.value)}
                    className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleSavePrescription}
                    className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5 transition-all"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{prescriptionSaved ? 'Ordonnance Validée !' : 'Signer & Transmettre'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Side Panel: Encrypted Chat */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 flex flex-col h-[600px]">
            <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
              <MessageSquare className="w-4 h-4 text-teal-600" />
              <h3 className="font-bold text-sm text-gray-900">Messagerie Médicale Chiffrée</h3>
            </div>

            {/* Message Feed */}
            <div className="flex-1 overflow-y-auto py-4 space-y-3">
              {messages.map((m, i) => (
                <div key={i} className={`flex flex-col ${m.sender === 'Système' ? 'items-center text-center' : m.sender === 'Patient' ? 'items-start' : 'items-end'}`}>
                  {m.sender === 'Système' ? (
                    <span className="text-[10px] bg-gray-100 text-gray-600 px-3 py-1 rounded-full font-mono">
                      {m.text}
                    </span>
                  ) : (
                    <div className={`max-w-[85%] p-3 rounded-2xl text-xs space-y-1 ${
                      m.sender === 'Patient'
                        ? 'bg-slate-100 text-gray-800 rounded-tl-none'
                        : 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white rounded-tr-none'
                    }`}>
                      <div className="flex justify-between items-center gap-2 text-[9px] opacity-75">
                        <span className="font-bold">{m.sender}</span>
                        <span>{m.time}</span>
                      </div>
                      <p>{m.text}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Send form */}
            <form onSubmit={handleSendMessage} className="pt-3 border-t border-gray-100 flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Message sécurisé..."
                className="flex-1 px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
              <button
                type="submit"
                className="p-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl transition-colors shadow-sm"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeleconsultationModule;
