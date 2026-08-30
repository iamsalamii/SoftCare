import React, { useState, useEffect, useRef } from 'react';
import { ScanLine, X, Search, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { Medication } from '../../types';
import { useApp } from '../../context/AppContext';

interface BarcodeScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanSuccess: (medication: Medication) => void;
  title?: string;
  description?: string;
}

export const BarcodeScannerModal: React.FC<BarcodeScannerModalProps> = ({
  isOpen,
  onClose,
  onScanSuccess,
  title = 'Scanner Code-barres / QR Code',
  description = 'Passez le code-barres devant la douchette ou saisissez le code pour identification instantanée.'
}) => {
  const { medications } = useApp();
  const [inputCode, setInputCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [scannedMedication, setScannedMedication] = useState<Medication | null>(null);
  const [isScanningActive, setIsScanningActive] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setInputCode('');
      setError(null);
      setScannedMedication(null);
      setIsScanningActive(true);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSearchCode = (codeToSearch: string) => {
    const cleanCode = codeToSearch.trim().toUpperCase();
    if (!cleanCode) return;

    // Search by barcode, QR code pattern, batch number or ID
    const found = medications.find(m =>
      (m.barcode && m.barcode.toUpperCase() === cleanCode) ||
      (m.batchNumber && m.batchNumber.toUpperCase() === cleanCode) ||
      (m.id.toUpperCase() === cleanCode) ||
      m.name.toUpperCase().includes(cleanCode)
    );

    if (found) {
      setScannedMedication(found);
      setError(null);
      // Auto-trigger callback after short delay to show confirmation
      setTimeout(() => {
        onScanSuccess(found);
        onClose();
      }, 700);
    } else {
      setError(`Aucun médicament trouvé pour le code "${cleanCode}". Vérifiez le code ou ajoutez-le au catalogue.`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearchCode(inputCode);
    }
  };

  const handleQuickSelectDemo = (med: Medication) => {
    const code = med.barcode || med.batchNumber || med.name;
    setInputCode(code);
    handleSearchCode(code);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border border-gray-100 shadow-2xl max-w-lg w-full overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-slate-50 to-gray-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-600 flex items-center justify-center">
              <ScanLine className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-base">{title}</h3>
              <p className="text-xs text-gray-500">{description}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-200/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Animated Scanner Visual */}
          <div className="relative rounded-2xl bg-gradient-to-b from-slate-950 to-slate-900 p-8 text-center overflow-hidden border border-slate-800 shadow-inner">
            {/* Animated Laser line */}
            {isScanningActive && (
              <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#22d3ee] animate-bounce duration-1000 top-1/2 -translate-y-1/2" />
            )}

            <div className="w-48 h-24 mx-auto border-2 border-dashed border-cyan-500/50 rounded-xl flex items-center justify-center bg-cyan-950/20 backdrop-blur-sm">
              <div className="space-y-1">
                <ScanLine className="w-8 h-8 text-cyan-400 mx-auto animate-pulse" />
                <span className="text-[11px] font-mono text-cyan-300">Prêt pour lecture douchette</span>
              </div>
            </div>

            <p className="text-xs text-slate-400 mt-4">
              Pointez la douchette vers l'étiquette ou tapez le code ci-dessous.
            </p>
          </div>

          {/* Code Input Form */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
              Code-barres / Code Lot / Nom
            </label>
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ex: 3400938472910, LOT-2026-A1..."
                className="w-full pl-4 pr-24 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all"
              />
              <button
                onClick={() => handleSearchCode(inputCode)}
                className="absolute right-1.5 top-1.5 bottom-1.5 px-4 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Search className="w-3.5 h-3.5" />
                Valider
              </button>
            </div>
          </div>

          {/* Feedback states */}
          {error && (
            <div className="flex items-start gap-2.5 p-3.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {scannedMedication && (
            <div className="flex items-center justify-between p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-sm text-emerald-950">{scannedMedication.name}</h4>
                  <p className="text-xs text-emerald-700">
                    Stock : {scannedMedication.stock} • Prix : {scannedMedication.price} € • Lot : {scannedMedication.batchNumber || 'N/A'}
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-1 rounded-lg">
                Identifié !
              </span>
            </div>
          )}

          {/* Quick Demo Selector */}
          <div className="border-t border-gray-100 pt-4">
            <div className="flex items-center gap-1 text-xs text-gray-500 font-medium mb-2.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Simulation rapide pour tests :</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {medications.slice(0, 4).map(med => (
                <button
                  key={med.id}
                  onClick={() => handleQuickSelectDemo(med)}
                  className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-cyan-50 hover:text-cyan-700 hover:border-cyan-200 border border-transparent rounded-lg text-gray-700 transition-all"
                >
                  {med.name} ({med.barcode?.slice(-6) || 'CODE'})
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BarcodeScannerModal;
