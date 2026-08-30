import React, { useState } from 'react';
import { Sparkles, X, Brain, CheckCircle2, AlertCircle, Stethoscope, ShieldCheck } from 'lucide-react';

interface MedicalAiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSymptoms?: string[];
  patientName?: string;
}

export const MedicalAiAssistantModal: React.FC<MedicalAiAssistantModalProps> = ({
  isOpen,
  onClose,
  initialSymptoms = ['Douleur thoracique', 'Essoufflement'],
  patientName = 'Jean Dupont',
}) => {
  const [symptomsInput, setSymptomsInput] = useState<string>(initialSymptoms.join(', '));
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<any>(null);

  if (!isOpen) return null;

  const handleRunAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      const symptomsList = symptomsInput.split(',').map(s => s.trim().toLowerCase());
      const hasChestPain = symptomsList.some(s => s.includes('poitrine') || s.includes('thoracique') || s.includes('essoufflement'));

      if (hasChestPain) {
        setResults({
          hypotheses: [
            {
              condition: 'Syndrome Coronarien Aigu (SCA / Infarctus)',
              confidence: 92,
              severity: 'critical',
              justification: 'Association douleur thoracique typique et dyspnée d’effort. Facteurs de risque cardiovasculaires identifiés.',
              recommendedTests: ['ECG 12 dérivations immédiat', 'Dosage Troponine I ultrasensible à H0/H3', 'D-Dimères', 'Bilan hémostase'],
              pgxNote: 'Attention : Si mise sous Clopidogrel (Plavix), vérifier le profil CYP2C19 du patient.',
            },
            {
              condition: 'Embolie Pulmonaire',
              confidence: 68,
              severity: 'high',
              justification: 'Dyspnée aiguë sans anomalie auscultatoire évidente.',
              recommendedTests: ['Angioscanner thoracique', 'Gazométrie artérielle'],
            },
          ],
        });
      } else {
        setResults({
          hypotheses: [
            {
              condition: 'Infection Respiratoire Aiguë / Broncho-pneumopathie',
              confidence: 84,
              severity: 'moderate',
              justification: 'Tableau fébrile avec toux et encombrement bronchique.',
              recommendedTests: ['Radiographie thoracique face', 'NFS, CRP, Procalcitonine', 'Gaz du sang si SpO2 < 94%'],
            },
          ],
        });
      }
      setIsAnalyzing(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl shadow-2xl border border-cyan-100 max-w-2xl w-full overflow-hidden">
        {/* Header - SoftCare Medical Cyan / Teal Header */}
        <div className="bg-gradient-to-r from-cyan-600 via-teal-600 to-teal-700 text-white p-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-inner">
              <Brain className="w-6 h-6 text-cyan-100" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg text-white">Assistant Clinique IA & Diagnostic Différentiel</h3>
                <span className="px-2.5 py-0.5 text-[9px] font-bold bg-white/20 border border-white/30 text-cyan-50 rounded-full">
                  CDS Hooks
                </span>
              </div>
              <p className="text-xs text-cyan-100/90 mt-0.5">
                Analyse croisée des symptômes, antécédents et pharmacogénomique pour {patientName}.
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

        {/* Content Body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Input Symptoms */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
              Symptômes & Signes Cliniques Déclarés (séparés par des virgules)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={symptomsInput}
                onChange={(e) => setSymptomsInput(e.target.value)}
                placeholder="Ex: Douleur thoracique, Essoufflement, Fièvre, Toux..."
                className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
              />
              <button
                onClick={handleRunAnalysis}
                disabled={isAnalyzing || !symptomsInput.trim()}
                className="px-5 py-3 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 disabled:opacity-50 text-white rounded-2xl font-bold text-xs flex items-center gap-2 shadow-lg shadow-teal-600/20 transition-all hover:scale-[1.02]"
              >
                {isAnalyzing ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Analyse...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Calculer Hypothèses</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Results Section */}
          {results && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-200">
              <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Hypothèses Diagnostiques Différentielles
                </span>
                <span className="text-[11px] text-teal-700 font-semibold bg-cyan-50 px-2.5 py-0.5 rounded-full border border-cyan-100">
                  {results.hypotheses.length} Pistes Identifiées
                </span>
              </div>

              <div className="space-y-3">
                {results.hypotheses.map((item: any, idx: number) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-2xl border transition-all ${
                      item.severity === 'critical'
                        ? 'bg-rose-50/50 border-rose-200 ring-1 ring-rose-500/10'
                        : 'bg-slate-50 border-gray-200'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <Stethoscope className={`w-4 h-4 ${item.severity === 'critical' ? 'text-rose-600' : 'text-teal-600'}`} />
                        <h4 className="font-bold text-sm text-gray-900">{item.condition}</h4>
                      </div>
                      <span className="px-2.5 py-1 text-[10px] font-mono font-bold bg-white text-teal-900 rounded-lg border border-teal-200 shadow-sm">
                        Indice de confiance: {item.confidence}%
                      </span>
                    </div>

                    <p className="text-xs text-gray-700 mb-3">{item.justification}</p>

                    {item.pgxNote && (
                      <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900 flex items-start gap-2 mb-3">
                        <ShieldCheck className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                        <span><strong>Sécurité PGx :</strong> {item.pgxNote}</span>
                      </div>
                    )}

                    <div>
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5">
                        Examens Complémentaires Suggérés :
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {item.recommendedTests.map((test: string, tIdx: number) => (
                          <span
                            key={tIdx}
                            className="px-2.5 py-1 bg-white border border-gray-200 text-gray-800 text-[11px] rounded-lg font-medium shadow-sm"
                          >
                            {test}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Legal Clinical Disclaimer */}
          <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-[10px] text-gray-500 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
            <span>
              <strong>Information réglementaire :</strong> SoftCare CDS Hooks est un outil d'aide à la décision clinique. Il ne se substitue pas à l'expertise médicale du praticien responsable.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalAiAssistantModal;
