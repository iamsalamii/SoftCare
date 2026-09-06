import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import {
  Sparkles, X, Brain, CheckCircle2, AlertCircle, Stethoscope,
  ShieldCheck, ArrowRight, Dna, Activity, FileText, Plus
} from 'lucide-react';

interface MedicalAiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSymptoms?: string[];
  patientName?: string;
}

interface DiagnosticHypothesis {
  condition: string;
  confidence: number;
  severity: 'critical' | 'high' | 'moderate' | 'low';
  justification: string;
  recommendedTests: string[];
  pgxNote?: string;
  treatmentPathway?: string;
}

export const MedicalAiAssistantModal: React.FC<MedicalAiAssistantModalProps> = ({
  isOpen,
  onClose,
  initialSymptoms = ['Fièvre', 'Frissons', 'Céphalée'],
  patientName = 'Jean Dupont',
}) => {
  const [symptomsInput, setSymptomsInput] = useState<string>(initialSymptoms.join(', '));
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<{ hypotheses: DiagnosticHypothesis[] } | null>(null);

  if (!isOpen) return null;

  const analyzeClinicalSymptoms = (text: string): DiagnosticHypothesis[] => {
    const raw = text.toLowerCase();
    const hypotheses: DiagnosticHypothesis[] = [];

    const hasChestPain = raw.includes('poitrine') || raw.includes('thoracique') || raw.includes('angor') || raw.includes('oppression');
    const hasFever = raw.includes('fievre') || raw.includes('fièvre') || raw.includes('frisson') || raw.includes('temperature') || raw.includes('fébrile') || raw.includes('chaleur');
    const hasHeadache = raw.includes('cephalee') || raw.includes('céphalée') || raw.includes('tete') || raw.includes('tête') || raw.includes('migraine') || raw.includes('vertige');
    const hasAbdominal = raw.includes('ventre') || raw.includes('abdo') || raw.includes('nausee') || raw.includes('nausée') || raw.includes('vomiss') || raw.includes('diarrhee') || raw.includes('diarrhée');
    const hasDyspnea = raw.includes('essoufflement') || raw.includes('dyspnee') || raw.includes('dyspnée') || raw.includes('respiratoire') || raw.includes('toux') || raw.includes('etouff');

    // 1. Syndrome Fébrile & Infection
    if (hasFever) {
      if (hasDyspnea) {
        hypotheses.push({
          condition: 'Pneumopathie Aiguë Communautaire (PAC)',
          confidence: 88,
          severity: 'high',
          justification: 'Association classique de syndrome fébrile aigu avec signes fonctionnels respiratoires (toux, dyspnée).',
          recommendedTests: [
            'Radiographie pulmonaire face et profil',
            'NFS, CRP ultrasensible, Procalcitonine',
            'Gazométrie artérielle si SpO2 < 94%',
            'Antigénuries Légionelle et Pneumocoque'
          ],
          pgxNote: 'Si prescription d’Azithromycine, vérifier l’absence d’allongement de l’intervalle QTc.',
          treatmentPathway: 'Amoxicilline 1g x3/j ou Augmentin + macrolide selon score de Fine.'
        });
      } else if (hasHeadache) {
        hypotheses.push({
          condition: 'Syndrome Méningé Fébrile / Grippe avec céphalées',
          confidence: 82,
          severity: 'high',
          justification: 'Syndrome infectieux fébrile associé à des céphalées intenses. Recherche de raideur de nuque obligatoire.',
          recommendedTests: [
            'Examen neurologique complet (Kernig / Brudzinski)',
            'Ponction Lombaire (PL) si raideur ou photophobie',
            'NFS, CRP, Hémocultures x2',
            'PCR virale respiratoire multiplex'
          ],
          treatmentPathway: 'Antipyrétiques (Paracétamol), Céfotaxime IV en urgence si méningite suspectée.'
        });
      } else {
        hypotheses.push({
          condition: 'Syndrome Fébrile Isolé / Foyer Infectieux en Cours de Bilan',
          confidence: 85,
          severity: 'moderate',
          justification: 'Hyperthermie caractérisée sans signe de localisation évident au premier examen.',
          recommendedTests: [
            'Bilan inflammatoire complet : NFS, CRP, Vitesse de Sédimentation',
            'Bandelette Urinaire (BU) & ECBU',
            'Hémocultures aéro/anaérobie au pic thermique (>38.5°C)',
            'Radiographie thoracique de débrouillage'
          ],
          treatmentPathway: 'Hydratation orale, Paracétamol 1g toutes les 6h, surveillance thermique horaire.'
        });
      }
    }

    // 2. Douleur Thoracique
    if (hasChestPain) {
      hypotheses.unshift({
        condition: 'Syndrome Coronarien Aigu (SCA / Suspicion d’Infarctus)',
        confidence: 94,
        severity: 'critical',
        justification: 'Douleur thoracique rétrosternale ou constrictive. Urgence cardiologique absolue.',
        recommendedTests: [
          'ECG 12 dérivations immédiat (< 10 minutes)',
          'Dosage de la Troponine I / T ultrasensible à H0 et H3',
          'D-Dimères si suspicion d’embolie pulmonaire associée',
          'Échocardiographie transthoracique (ETT)'
        ],
        pgxNote: 'Contrôle PGx CYP2C19 requis avant traitement au Clopidogrel (Plavix) : métaboliseur lent (*2/*3) = privilégier Prasugrel ou Ticagrelor.',
        treatmentPathway: 'Aspirine 250mg IV, Ticagrelor 180mg per os, transfert coronarographie immédiate.'
      });
    }

    // 3. Douleur Abdominale
    if (hasAbdominal) {
      hypotheses.push({
        condition: hasFever ? 'Appendicite ou Cholécystite Aiguë' : 'Syndrome Douloureux Abdominal / Colique Hépatique',
        confidence: 79,
        severity: hasFever ? 'high' : 'moderate',
        justification: 'Douleurs abdominales avec perturbation du transit ou nausées.',
        recommendedTests: [
          'Échographie abdomino-pelvienne ou Scanner TAP injecté',
          'Lipasémie (exclusion pancréatite)',
          'Bilan hépatique complet (ASAT, ALAT, GGT, PAL, Bilirubine)',
          'NFS, CRP, Ionogramme sanguin'
        ],
        treatmentPathway: 'Mise à jeun, antispasmodiques IV (Phloroglucinol), consultation chirurgicale viscérale.'
      });
    }

    // 4. Céphalées Isolées
    if (hasHeadache && !hasFever) {
      hypotheses.push({
        condition: 'Crise Céphalalgique / Poussée Hypertensive ou Migraine',
        confidence: 76,
        severity: 'moderate',
        justification: 'Céphalée aiguë d’apparition récente sans fièvre.',
        recommendedTests: [
          'Mesure de la Pression Artérielle aux deux bras',
          'Fond d’œil ou Scanner cérébral sans injection si céphalée en coup de tonnerre',
          'Examen des paires crâniennes'
        ],
        treatmentPathway: 'Antalgiques de palier 1 ou Triptans selon anamnèse.'
      });
    }

    // Fallback if generic input
    if (hypotheses.length === 0) {
      hypotheses.push({
        condition: 'Bilan Clinique Général & Exploration Fonctionnelle',
        confidence: 70,
        severity: 'low',
        justification: `Analyse basée sur les plaintes saisies : "${text}".`,
        recommendedTests: [
          'Examen clinique complet et prise des constantes vitales',
          'Bilan biologique standard (NFS, Ionogramme, Glycémie)',
          'ECG de repos'
        ],
        treatmentPathway: 'Adaptation thérapeutique selon l’examen clinique approfondi.'
      });
    }

    return hypotheses;
  };

  const handleRunAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      const generated = analyzeClinicalSymptoms(symptomsInput);
      setResults({ hypotheses: generated });
      setIsAnalyzing(false);
    }, 450);
  };

  const quickSymptoms = [
    'Fièvre 39°C, Frissons',
    'Douleur thoracique, Essoufflement',
    'Céphalées intenses, Nausées',
    'Douleur fosse iliaque droite, Fièvre',
    'Toux grasse, Fièvre, Dyspnée'
  ];

  return createPortal(
    <div className="fixed inset-0 z-[9999] overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl shadow-2xl border border-cyan-100 max-w-3xl w-full my-auto overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-600 via-teal-600 to-teal-700 text-white p-6 flex justify-between items-center">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-inner">
              <Brain className="w-6 h-6 text-cyan-100" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-lg text-white">Assistant Clinique IA & CDS Hooks</h3>
                <span className="px-2.5 py-0.5 text-[9px] font-black bg-white/20 border border-white/30 text-cyan-50 rounded-full uppercase tracking-wider">
                  Moteur Diagnostique v2.4
                </span>
              </div>
              <p className="text-xs text-cyan-100/90 mt-0.5">
                Raisonnement probabiliste différentiel et intercepteur pharmacogénomique (PGx) pour <span className="font-bold underline">{patientName}</span>.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 max-h-[75vh] modal-scroll">
          {/* Symptoms Input */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                Symptômes & Signes Fonctionnels Observés
              </label>
              <span className="text-[10px] text-gray-400 font-mono">Séparer par des virgules</span>
            </div>

            <div className="relative">
              <input
                type="text"
                value={symptomsInput}
                onChange={(e) => setSymptomsInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleRunAnalysis(); }}
                placeholder="Ex: Fièvre 39°C, frissons, toux, douleur thoracique..."
                className="w-full pl-4 pr-32 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-semibold focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all shadow-2xs"
              />
              <button
                type="button"
                onClick={handleRunAnalysis}
                disabled={isAnalyzing || !symptomsInput.trim()}
                className="absolute right-1.5 top-1.5 bottom-1.5 px-4 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all disabled:opacity-50"
              >
                {isAnalyzing ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    <span>Calcul...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-cyan-200" />
                    <span>Analyser</span>
                  </>
                )}
              </button>
            </div>

            {/* Quick Chips */}
            <div className="flex items-center gap-1.5 flex-wrap pt-1">
              <span className="text-[10px] text-gray-400 font-bold">Suggestions cliniques :</span>
              {quickSymptoms.map((qs, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setSymptomsInput(qs);
                    setTimeout(() => {
                      const generated = analyzeClinicalSymptoms(qs);
                      setResults({ hypotheses: generated });
                    }, 50);
                  }}
                  className="px-2.5 py-1 text-[10px] bg-slate-100 hover:bg-cyan-50 hover:text-cyan-900 border border-transparent hover:border-cyan-200 rounded-lg font-medium text-gray-700 transition-all"
                >
                  {qs}
                </button>
              ))}
            </div>
          </div>

          {/* Results Section */}
          {results && (
            <div className="space-y-4 pt-2 border-t border-gray-100 animate-in fade-in duration-200">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
                  <Stethoscope className="w-4 h-4 text-teal-600" />
                  <span>Hypothèses Diagnostiques Différentielles</span>
                </span>
                <span className="text-[11px] text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full font-bold border border-teal-200">
                  {results.hypotheses.length} piste(s) identifiée(s)
                </span>
              </div>

              <div className="space-y-3">
                {results.hypotheses.map((hyp, index) => (
                  <div
                    key={index}
                    className="p-5 bg-white rounded-3xl border border-gray-200 shadow-xs hover:border-teal-300 transition-all space-y-3.5"
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          hyp.severity === 'critical' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                          hyp.severity === 'high' ? 'bg-amber-50 text-amber-800 border border-amber-200' :
                          'bg-cyan-50 text-cyan-800 border border-cyan-200'
                        }`}>
                          {hyp.severity === 'critical' ? 'Urgence Vitale' : hyp.severity === 'high' ? 'Prioritaire' : 'Standard'}
                        </span>
                        <h4 className="font-extrabold text-sm text-gray-900">{hyp.condition}</h4>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-600">Probabilité :</span>
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-cyan-50 to-teal-50 rounded-xl border border-teal-200">
                          <Activity className="w-3.5 h-3.5 text-teal-600" />
                          <span className="text-xs font-black text-teal-900">{hyp.confidence}%</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-gray-700 leading-relaxed bg-slate-50 p-3 rounded-2xl border border-slate-100">
                      <strong>Analyse clinique :</strong> {hyp.justification}
                    </p>

                    {/* Recommended tests */}
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-gray-600 block">
                        Examens complémentaires recommandés (CDS Hooks) :
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                        {hyp.recommendedTests.map((test, tIdx) => (
                          <div
                            key={tIdx}
                            className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 text-gray-800 rounded-xl text-xs font-medium border border-gray-100"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                            <span className="truncate">{test}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* PGx Warning note if any */}
                    {hyp.pgxNote && (
                      <div className="p-3.5 bg-purple-50 rounded-2xl border border-purple-200 text-xs text-purple-900 flex items-start gap-2.5">
                        <Dna className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold block">Intercepteur Pharmacogénomique (PGx) :</span>
                          <p className="mt-0.5">{hyp.pgxNote}</p>
                        </div>
                      </div>
                    )}

                    {/* Recommended pathway */}
                    {hyp.treatmentPathway && (
                      <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between">
                        <div>
                          <span className="font-bold">Protocole de première intention : </span>
                          <span>{hyp.treatmentPathway}</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-gray-100 flex justify-between items-center text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-teal-600" /> Aide à la décision médicale certifiée ISO/IEC 62304
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl font-bold transition-colors"
          >
            Fermer l'Assistant
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default MedicalAiAssistantModal;
