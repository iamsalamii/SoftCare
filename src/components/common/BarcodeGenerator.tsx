import React, { useState } from 'react';
import { generateBarcode128Svg, generateQrCodeSvg, generatePharmacyLabelHtml } from '../../utils/barcodeUtils';
import { Printer, QrCode, BarChart, Copy, Check, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { printDocument } from '../../utils/exportUtils';
import { Medication } from '../../types';

interface BarcodeGeneratorProps {
  medication: Medication;
  onClose?: () => void;
}

export const BarcodeGenerator: React.FC<BarcodeGeneratorProps> = ({ medication, onClose }) => {
  const { organizationSettings } = useApp();
  const [codeType, setCodeType] = useState<'barcode' | 'qr' | 'both'>('both');
  const [labelCount, setLabelCount] = useState<number>(1);
  const [copied, setCopied] = useState(false);

  const barcodeValue = medication.barcode || `MED-${medication.batchNumber || medication.id.slice(0, 8)}`;
  const qrData = `SOFTCARE|MED:${medication.name}|CODE:${barcodeValue}|LOT:${medication.batchNumber || 'N/A'}|EXP:${medication.expiryDate || 'N/A'}`;

  const barcodeSvg = generateBarcode128Svg(barcodeValue, { height: 50, barWidth: 2 });
  const qrSvg = generateQrCodeSvg(qrData, { size: 140 });

  const handlePrint = async () => {
    let labelsHtml = '<div style="display: flex; flex-wrap: wrap; gap: 10px; justify-content: center;">';
    const singleLabel = generatePharmacyLabelHtml(medication, organizationSettings.name || 'SoftCare Hôpital');
    for (let i = 0; i < labelCount; i++) {
      labelsHtml += singleLabel;
    }
    labelsHtml += '</div>';

    await printDocument(labelsHtml, organizationSettings, `Etiquettes-${medication.name}`);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(barcodeValue);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-xl p-6 max-w-lg w-full">
      <div className="flex justify-between items-start border-b border-gray-100 pb-4 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-gray-900">{medication.name}</h3>
            {medication.isBiotech && (
              <span className="px-2 py-0.5 text-xs font-semibold bg-purple-100 text-purple-700 rounded-full border border-purple-200">
                Biotech / PGx
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500">
            DCI : {medication.genericName || medication.name} • Lot : {medication.batchNumber || 'Standard'}
          </p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex bg-gray-100 p-1 rounded-xl mb-5">
        <button
          onClick={() => setCodeType('both')}
          className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all ${
            codeType === 'both' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Étiquette Complète
        </button>
        <button
          onClick={() => setCodeType('barcode')}
          className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            codeType === 'barcode' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <BarChart className="w-3.5 h-3.5" /> Code-barres
        </button>
        <button
          onClick={() => setCodeType('qr')}
          className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            codeType === 'qr' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <QrCode className="w-3.5 h-3.5" /> QR Code
        </button>
      </div>

      {/* Code Display Area */}
      <div className="bg-gradient-to-b from-gray-50 to-white rounded-xl p-5 border border-gray-200/80 flex flex-col items-center justify-center min-h-[220px] mb-5 text-center">
        {codeType === 'both' && (
          <div
            className="w-full"
            dangerouslySetInnerHTML={{
              __html: generatePharmacyLabelHtml(medication, organizationSettings.name || 'SoftCare Hôpital')
            }}
          />
        )}

        {codeType === 'barcode' && (
          <div className="flex flex-col items-center">
            <div dangerouslySetInnerHTML={{ __html: barcodeSvg }} className="mb-2" />
            <span className="text-xs text-gray-500 font-mono">Norme Code 128 - Haute Densité</span>
          </div>
        )}

        {codeType === 'qr' && (
          <div className="flex flex-col items-center">
            <div dangerouslySetInnerHTML={{ __html: qrSvg }} className="mb-2 p-2 bg-white rounded-xl shadow-sm border border-gray-100" />
            <span className="text-xs text-gray-500 font-mono">Norme QR Code 2D (Traçabilité Lot/Exp)</span>
          </div>
        )}
      </div>

      {/* Code Metadata & Actions */}
      <div className="space-y-4">
        <div className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg border border-gray-200/60 text-xs">
          <span className="text-gray-500">Identifiant Code :</span>
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-gray-800">{barcodeValue}</span>
            <button
              onClick={handleCopyCode}
              className="p-1 text-gray-500 hover:text-cyan-600 transition-colors"
              title="Copier le code"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-600 font-medium">Nombre d'exemplaires :</label>
            <input
              type="number"
              min="1"
              max="100"
              value={labelCount}
              onChange={(e) => setLabelCount(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-16 px-2 py-1 text-xs border border-gray-300 rounded-lg text-center font-bold"
            />
          </div>

          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-teal-500/20 transition-all hover:scale-[1.02]"
          >
            <Printer className="w-4 h-4" />
            Imprimer l'étiquette
          </button>
        </div>
      </div>
    </div>
  );
};

export default BarcodeGenerator;
