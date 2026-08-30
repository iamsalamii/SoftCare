import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import {
  X, ChevronLeft, ChevronRight, Download, Printer, Activity,
  Shield, Dna, Brain, QrCode, BedDouble, Stethoscope, CheckCircle2,
  Lock, Scissors, FileText, Sparkles, Building2, HeartPulse, AlertTriangle
} from 'lucide-react';
import { printDocument, generateDocumentHeader, generateDocumentFooter } from '../../utils/exportUtils';
import { useApp } from '../../context/AppContext';

interface BrochureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BrochureModal: React.FC<BrochureModalProps> = ({ isOpen, onClose }) => {
  const { organizationSettings } = useApp();
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 5;

  if (!isOpen) return null;

  const handleDownloadBrochure = async () => {
    const brochureHtml = `
      <div style="font-family: 'Segoe UI', system-ui, sans-serif; color: #1e293b; max-width: 800px; margin: 0 auto; line-height: 1.5;">
        ${generateDocumentHeader(organizationSettings, 'report', 'BROCHURE-SOFTCARE-2026')}
        
        <!-- PAGE 1 -->
        <div style="page-break-after: always; padding: 30px 0;">
          <div style="background: linear-gradient(135deg, #0891b2 0%, #0d9488 100%); color: white; padding: 40px; border-radius: 12px; text-align: center; margin-bottom: 25px;">
            <h1 style="font-size: 28px; margin: 0 0 10px 0; font-weight: 800;">SoftCare Hospital System</h1>
            <p style="font-size: 16px; margin: 0; opacity: 0.9;">Système d'Information Hospitalier (HIS) & Pôle Biotechnologies de Précision</p>
            <div style="margin-top: 15px; display: inline-block; background: rgba(255,255,255,0.2); padding: 5px 15px; border-radius: 20px; font-size: 12px; font-weight: bold;">
              Édition Médicale & Institutionnelle 2026
            </div>
          </div>

          <h2 style="color: #0891b2; border-bottom: 2px solid #06b6d4; padding-bottom: 8px;">1. Vision Stratégique & Excellence des Soins</h2>
          <p><strong>SoftCare</strong> est une plateforme hospitalière unifiée de nouvelle génération conçue pour décloisonner les services médicaux, sécuriser la dispensation pharmaceutique et intégrer la médecine génomique personnalisée au lit du patient.</p>

          <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <tr style="background: #ecfeff;">
              <td style="padding: 15px; border: 1px solid #cffafe; width: 33%; text-align: center;">
                <h3 style="color: #0e7490; margin: 0; font-size: 22px;">100%</h3>
                <p style="margin: 5px 0 0 0; font-size: 11px; color: #155e75;">Traçabilité Médicamenteuse</p>
              </td>
              <td style="padding: 15px; border: 1px solid #cffafe; width: 33%; text-align: center;">
                <h3 style="color: #0e7490; margin: 0; font-size: 22px;">-40%</h3>
                <p style="margin: 5px 0 0 0; font-size: 11px; color: #155e75;">Temps de Prise en Charge Urgences</p>
              </td>
              <td style="padding: 15px; border: 1px solid #cffafe; width: 33%; text-align: center;">
                <h3 style="color: #0e7490; margin: 0; font-size: 22px;">H24/7</h3>
                <p style="margin: 5px 0 0 0; font-size: 11px; color: #155e75;">Continuité du Parcours Patient</p>
              </td>
            </tr>
          </table>
        </div>

        <!-- PAGE 2 -->
        <div style="page-break-after: always; padding: 30px 0;">
          <h2 style="color: #0891b2; border-bottom: 2px solid #06b6d4; padding-bottom: 8px;">2. Dossier Patient Informatisé & Circuit du Médicament</h2>
          <p>Le module de pharmacie clinique intègre un étiquetage Code-barres (Code 128) et QR Codes 2D Datamatrix garantissant une dispensation sans faille :</p>
          <ul style="padding-left: 20px; font-size: 13px; line-height: 1.6;">
            <li><strong>Dossier Médical Électronique (DME) :</strong> Constantes hémodynamiques, antécédents, allergies et consultations.</li>
            <li><strong>Contrôle à la délivrance :</strong> Détection instantanée des médicaments et vérification automatisée des dates de péremption et lots.</li>
            <li><strong>Point de Vente (POS) & Caisse :</strong> Vérification en direct des contre-indications médicamenteuses.</li>
          </ul>
        </div>

        <!-- PAGE 3 -->
        <div style="page-break-after: always; padding: 30px 0;">
          <h2 style="color: #0891b2; border-bottom: 2px solid #06b6d4; padding-bottom: 8px;">3. Pôle Biotechnologies & Pharmacogénomique (PGx)</h2>
          <p>SoftCare intègre la médecine de précision au cœur des décisions cliniques conformément aux directives internationales CPIC et DPWG :</p>
          <ul style="padding-left: 20px; font-size: 13px; line-height: 1.6;">
            <li><strong>Sécurité PGx :</strong> Blocage automatique des prescriptions à risque toxicologique selon les génotypes (ex: <em>CYP2C19</em> pour le Clopidogrel, <em>DPYD</em> pour le 5-Fluorouracile).</li>
            <li><strong>Biobanque Cryogénique & LIMS :</strong> Gestion cartographique des congélateurs (-80°C et cuves d'azote -196°C) avec traçabilité des puits 2D.</li>
            <li><strong>Essais Cliniques Translationnels :</strong> Suivi des cohortes de recherche et des critères d'inclusion.</li>
          </ul>
        </div>

        <!-- PAGE 4 -->
        <div style="page-break-after: always; padding: 30px 0;">
          <h2 style="color: #0891b2; border-bottom: 2px solid #06b6d4; padding-bottom: 8px;">4. Aide à la Décision Clinique par IA (CDS Hooks)</h2>
          <p>Moteur d'orientation diagnostique analysant les symptômes déclarés et les antécédents pour épauler le praticien :</p>
          <ul style="padding-left: 20px; font-size: 13px; line-height: 1.6;">
            <li>Calcul des indices de confiance diagnostique différentielle.</li>
            <li>Proposition d'examens complémentaires ciblés (ECG, Troponine, Gazométrie).</li>
            <li>Alertes d'interactions croisées entre génétique et protocoles thérapeutiques.</li>
          </ul>
        </div>

        <!-- PAGE 5 -->
        <div style="padding: 30px 0;">
          <h2 style="color: #0891b2; border-bottom: 2px solid #06b6d4; padding-bottom: 8px;">5. Pôles Urgences, Bloc Opératoire & Hospitalisation</h2>
          <p>Coordination en temps réel des flux de soins aigus et des lits hospitaliers :</p>
          <ul style="padding-left: 20px; font-size: 13px; line-height: 1.6;">
            <li><strong>Triage des Urgences :</strong> Échelle de criticité Manchester (Niveau 1 à 5) avec priorisation vitale immédiate.</li>
            <li><strong>Bloc Opératoire :</strong> Planification des vacations chirurgicales, check-lists de sécurité et suivi anesthésique.</li>
            <li><strong>Gestion Centralisée des Lits :</strong> Cartographie des disponibilités par service, admission directe et transferts fluides.</li>
          </ul>
        </div>

        ${generateDocumentFooter(organizationSettings)}
      </div>
    `;

    await printDocument(brochureHtml, organizationSettings, 'Brochure-SoftCare-2026');
  };

  const modalContent = (
    <div className="fixed inset-0 z-[9999] overflow-y-auto bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-cyan-100 max-w-3xl w-full my-auto overflow-hidden relative z-[10000] flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-600 via-teal-600 to-teal-700 text-white p-5 sm:p-6 flex justify-between items-center flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-inner">
              <Building2 className="w-6 h-6 text-cyan-100" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg text-white">Brochure Médicale SoftCare</h3>
                <span className="px-2.5 py-0.5 text-[9px] font-bold bg-white/20 border border-white/30 text-cyan-50 rounded-full">
                  Page {currentPage} / {totalPages}
                </span>
              </div>
              <p className="text-xs text-cyan-100/90 mt-0.5">
                Dossier de présentation complet du Système d'Information Hospitalier
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadBrochure}
              className="px-3.5 py-2 bg-white text-teal-800 hover:bg-cyan-50 rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
              title="Télécharger la brochure PDF"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Télécharger PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Dynamic Page Content */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6">
          {/* PAGE 1: PRÉSENTATION & VISION */}
          {currentPage === 1 && (
            <div className="space-y-6 animate-in fade-in">
              <div className="p-6 bg-gradient-to-br from-cyan-50 via-teal-50 to-emerald-50 rounded-3xl border border-cyan-100 text-center space-y-3">
                <span className="px-3 py-1 bg-white text-teal-800 border border-teal-200 rounded-full text-xs font-bold uppercase tracking-wider shadow-2xs">
                  Vision Hospitalière 2026
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                  L'intelligence clinique au service du soignant et du patient
                </h2>
                <p className="text-xs sm:text-sm text-gray-600 max-w-xl mx-auto">
                  SoftCare combine Système d'Information Hospitalier (HIS), traçabilité pharmaceutique par code-barres et médecine de précision génomique au sein d'une interface unifiée.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm text-center">
                  <p className="text-3xl font-black text-teal-600">100%</p>
                  <p className="text-xs font-semibold text-gray-800 mt-1">Traçabilité GS1 & CIP</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">Zéro erreur d'administration</p>
                </div>
                <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm text-center">
                  <p className="text-3xl font-black text-teal-600">-40%</p>
                  <p className="text-xs font-semibold text-gray-800 mt-1">Temps de Triage</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">Orientation rapide des urgences</p>
                </div>
                <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm text-center">
                  <p className="text-3xl font-black text-teal-600">H24/7</p>
                  <p className="text-xs font-semibold text-gray-800 mt-1">Continuité des Soins</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">Parcours patient fluide</p>
                </div>
              </div>
            </div>
          )}

          {/* PAGE 2: DOSSIER MÉDICAL & PHARMACIE */}
          {currentPage === 2 && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center font-bold">
                  <QrCode className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Dossier Patient & Circuit du Médicament</h3>
                  <p className="text-xs text-gray-500">Traçabilité complète de la prescription à la dispensation</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 bg-slate-50 rounded-2xl border border-gray-200/70 space-y-2">
                  <h4 className="font-bold text-sm text-gray-900 flex items-center gap-2">
                    <Stethoscope className="w-4 h-4 text-cyan-600" />
                    <span>Dossier Patient Informatisé (DPI)</span>
                  </h4>
                  <p className="text-xs text-gray-600">
                    Historique exhaustif des consultations, examens biologiques, antécédents, constantes vitales et archivage sécurisé.
                  </p>
                </div>

                <div className="p-5 bg-slate-50 rounded-2xl border border-gray-200/70 space-y-2">
                  <h4 className="font-bold text-sm text-gray-900 flex items-center gap-2">
                    <QrCode className="w-4 h-4 text-teal-600" />
                    <span>Moteur d'Étiquetage Pharmaceutique</span>
                  </h4>
                  <p className="text-xs text-gray-600">
                    Génération autonome de Code 128 et QR Codes 2D pour flacons, poches de perfusion et cryotubes de laboratoire.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* PAGE 3: BIOTECHNOLOGIES & PGx */}
          {currentPage === 3 && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
                  <Dna className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Pôle Biotechnologies & Pharmacogénomique</h3>
                  <p className="text-xs text-gray-500">Personnalisation des traitements selon le profil génétique du patient</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="p-4 bg-teal-50/80 rounded-2xl border border-teal-100 space-y-1.5">
                  <h4 className="font-bold text-xs text-teal-950 uppercase">1. Sécurité Pharmacogénomique Active (PGx)</h4>
                  <p className="text-xs text-teal-900">
                    Confrontation directe des prescriptions avec les génotypes du patient (*CYP2C19, CYP2D6, DPYD, SLCO1B1*). Prévention des échecs thérapeutiques et des toxicités aiguës.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-gray-100 space-y-1.5">
                  <h4 className="font-bold text-xs text-gray-900 uppercase">2. Biobanque Cryogénique & LIMS</h4>
                  <p className="text-xs text-gray-600">
                    Gestion spatiale 2D des congélateurs (-80°C / -196°C), traçabilité des consentements patients et étiquetage cryogénique QR Code.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-gray-100 space-y-1.5">
                  <h4 className="font-bold text-xs text-gray-900 uppercase">3. Essais Cliniques Translationnels</h4>
                  <p className="text-xs text-gray-600">
                    Recrutement des cohortes de recherche, suivi des protocoles de thérapie ciblée et inclusion guidée.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* PAGE 4: IA CLINIQUE & CDS HOOKS */}
          {currentPage === 4 && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center font-bold">
                  <Brain className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Assistant Clinique IA (CDS Hooks)</h3>
                  <p className="text-xs text-gray-500">Moteur d'aide au diagnostic différentiel et recommandations</p>
                </div>
              </div>

              <div className="p-5 bg-gradient-to-r from-cyan-50 to-teal-50 rounded-2xl border border-cyan-100 space-y-3 text-xs text-teal-950">
                <p>
                  L'assistant IA SoftCare intervient comme un copilote pour le médecin en analysant les symptômes déclarés, l'historique et les constantes du patient :
                </p>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
                    <span><strong>Calcul probabiliste :</strong> Estimation du niveau de risque et de l'indice de confiance.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
                    <span><strong>Examens complémentaires :</strong> Suggestion d'ECG, dosages enzymatiques ou imageries prioritaires.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
                    <span><strong>Garde-fou éthique :</strong> Le médecin conserve l'entière autorité diagnostique.</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PAGE 5: URGENCES, BLOC & HOSPITALISATION */}
          {currentPage === 5 && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
                  <HeartPulse className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Urgences, Bloc Opératoire & Lits</h3>
                  <p className="text-xs text-gray-500">Coordination hospitalière des soins critiques et continus</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-4 bg-slate-50 rounded-2xl border border-gray-100 space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-gray-900">
                    <AlertTriangle className="w-4 h-4 text-rose-500" />
                    <span>Triage Urgences</span>
                  </div>
                  <p className="text-gray-600">
                    Échelle de criticité Manchester (Niveau 1 à 5) pour la prise en charge immédiate des détresses vitales.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-gray-100 space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-gray-900">
                    <Scissors className="w-4 h-4 text-teal-600" />
                    <span>Bloc Opératoire</span>
                  </div>
                  <p className="text-gray-600">
                    Planification des salles d'opération, check-lists de sécurité de l'OMS et traçabilité anesthésique.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-gray-100 space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-gray-900">
                    <BedDouble className="w-4 h-4 text-cyan-600" />
                    <span>Gestion des Lits</span>
                  </div>
                  <p className="text-gray-600">
                    Vue temps réel du taux d'occupation, régulation des lits de réanimation et transferts fluides.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="p-4 sm:p-6 bg-gray-50 border-t border-gray-100 flex items-center justify-between flex-shrink-0">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-white border border-gray-200 text-gray-700 disabled:opacity-40 rounded-xl text-xs font-bold shadow-2xs hover:bg-gray-100 transition-all flex items-center gap-1.5"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Page Précédente</span>
          </button>

          {/* Dots */}
          <div className="flex gap-1.5">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`h-2 rounded-full transition-all ${
                  currentPage === i + 1 ? 'w-6 bg-teal-600' : 'w-2 bg-gray-300'
                }`}
              />
            ))}
          </div>

          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white disabled:opacity-40 rounded-xl text-xs font-bold shadow-md shadow-teal-600/20 transition-all flex items-center gap-1.5"
          >
            <span>Page Suivante</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default BrochureModal;
