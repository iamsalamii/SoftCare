import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { ScanLine, X, Search, CheckCircle2, AlertCircle, Sparkles, QrCode } from 'lucide-react';
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
  description = 'Scannez le code-barres GS1 ou QR Code 2D avec votre douchette ou saisissez le code.'
}) => {
  const { medications, organizationSettings } = useApp();
  const [inputCode, setInputCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [scannedMedication, setScannedMedication] = useState<Medication | null>(null);
  const [isScanningActive, setIsScanningActive] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  const currency = organizationSettings?.currencySymbol || '€';

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

  const handleSearchCode = (rawCode: string) => {
    let cleanCode = rawCode.trim();
    if (!cleanCode) return;

    let searchTerms: string[] = [cleanCode.toUpperCase()];

    // 1. Try parsing JSON if QR code contains structured JSON payload
    if (cleanCode.startsWith('{') && cleanCode.endsWith('}')) {
      try {
        const parsed = JSON.parse(cleanCode);
        if (parsed.id) searchTerms.push(String(parsed.id).toUpperCase());
        if (parsed.barcode) searchTerms.push(String(parsed.barcode).toUpperCase());
        if (parsed.qrCode) searchTerms.push(String(parsed.qrCode).toUpperCase());
        if (parsed.name) searchTerms.push(String(parsed.name).toUpperCase());
        if (parsed.batchNumber) searchTerms.push(String(parsed.batchNumber).toUpperCase());
      } catch {
        // Not valid JSON, continue with raw string
      }
    }

    // 2. Parse URL patterns (e.g. https://softcare.hospital/med/MED-001 or MED:1)
    if (cleanCode.includes('/med/')) {
      const parts = cleanCode.split('/med/');
      if (parts[1]) searchTerms.push(parts[1].trim().toUpperCase());
    } else if (cleanCode.startsWith('MED:') || cleanCode.startsWith('MED-')) {
      searchTerms.push(cleanCode.replace(/^MED[:\-]/, '').trim().toUpperCase());
    }

    // Find medication matching any extracted term
    const found = medications.find(m => {
      const mId = m.id.toUpperCase();
      const mBarcode = (m.barcode || '').toUpperCase();
      const mBatch = (m.batchNumber || '').toUpperCase();
      const mQr = ((m as any).qrCode || '').toUpperCase();
      const mName = m.name.toUpperCase();
      const mGeneric = (m.genericName || '').toUpperCase();

      return searchTerms.some(term =>
        mBarcode === term ||
        mId === term ||
        mBatch === term ||
        mQr === term ||
        mName === term ||
        (term.length >= 3 && mName.includes(term)) ||
        (term.length >= 3 && mGeneric.includes(term))
      );
    });

    if (found) {
      setScannedMedication(found);
      setError(null);
      // Auto-trigger callback after short delay to show confirmation
      setTimeout(() => {
        onScanSuccess(found);
        onClose();
      }, 600);
    } else {
      setError(`Aucun médicament correspondant au code/QR "${cleanCode}".`);
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

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl border border-cyan-100 shadow-2xl max-w-lg w-full overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center font-bold">
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
        <div className="p-6 space-y-5 modal-scroll">
          {/* Animated Scanner Visual */}
          <div className="relative rounded-2xl bg-gradient-to-b from-slate-950 to-slate-900 p-6 text-center overflow-hidden border border-slate-800 shadow-inner">
            {/* Animated Laser line */}
            {isScanningActive && (
              <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#22d3ee] animate-bounce duration-1000 top-1/2 -translate-y-1/2" />
            )}

            <div className="w-48 h-24 mx-auto border-2 border-dashed border-cyan-500/50 rounded-2xl flex items-center justify-center bg-cyan-950/20 backdrop-blur-xs">
              <div className="space-y-1 text-center">
                <div className="flex items-center justify-center gap-2 text-cyan-400">
                  <ScanLine className="w-6 h-6 animate-pulse" />
                  <QrCode className="w-6 h-6 animate-pulse" />
                </div>
                <span className="text-[10px] font-mono text-cyan-300 block">Lecteur 1D / 2D QR Actif</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 mt-3">
              Pointez la douchette laser ou la caméra vers le code-barres / QR Code.
            </p>
          </div>

          {/* Code Input Form */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
              Saisie Manuelle ou Scan Douchette
            </label>
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Scanner ou saisir: 3400938472910, LOT-2026-A1..."
                className="w-full pl-4 pr-24 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-mono font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
              />
              <button
                type="button"
                onClick={() => handleSearchCode(inputCode)}
                className="absolute right-1.5 top-1.5 bottom-1.5 px-3.5 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-sm transition-all"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Valider</span>
              </button>
            </div>
          </div>

          {/* Feedback states */}
          {error && (
            <div className="flex items-start gap-2.5 p-3.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-xs animate-in fade-in">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {scannedMedication && (
            <div className="flex items-center justify-between p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl animate-in fade-in">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-xs text-emerald-950">{scannedMedication.name}</h4>
                  <p className="text-[11px] text-emerald-700">
                    Stock : {scannedMedication.stock} • Prix : {scannedMedication.price} {currency} • Lot : {scannedMedication.batchNumber || 'N/A'}
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                Identifié !
              </span>
            </div>
          )}

          {/* Quick Demo Simulator */}
          <div className="border-t border-gray-100 pt-3">
            <div className="flex items-center gap-1 text-xs text-gray-500 font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Test rapide avec les médicaments en stock :</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {medications.slice(0, 5).map(med => (
                <button
                  key={med.id}
                  type="button"
                  onClick={() => handleQuickSelectDemo(med)}
                  className="px-2.5 py-1 text-[10px] font-semibold bg-gray-100 hover:bg-cyan-50 hover:text-cyan-800 hover:border-cyan-200 border border-transparent rounded-lg text-gray-700 transition-all"
                >
                  {med.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default BarcodeScannerModal;
