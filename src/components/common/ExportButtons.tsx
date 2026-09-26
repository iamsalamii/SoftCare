import React, { useState } from 'react';
import { FileDown, FileSpreadsheet, Printer, Eye, ChevronDown } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { useApp } from '../../context/AppContext';
import { printDocument, exportToExcel, generateDocumentHeader, generateDocumentFooter } from '../../utils/exportUtils';

interface ExportButtonsProps {
  data: Record<string, unknown>[];
  columns: { key: string; label: string }[];
  title: string;
  filename: string;
  documentType?: 'invoice' | 'receipt' | 'report' | 'prescription' | 'lab_result';
  customContent?: string;
}

const ExportButtons: React.FC<ExportButtonsProps> = ({
  data,
  columns,
  title,
  filename,
  documentType = 'report',
  customContent
}) => {
  const { organizationSettings } = useApp();
  const { error } = useToast();
  const [showMenu, setShowMenu] = useState(false);

  const generateTableHTML = () => {
    const headerRow = columns.map(col => `<th style="padding: 12px; text-align: left; background-color: ${organizationSettings.primaryColor}; color: white;">${col.label}</th>`).join('');

    const dataRows = data.map(row => {
      const cells = columns.map(col => {
        const value = row[col.key];
        return `<td style="padding: 10px; border-bottom: 1px solid #eee;">${value ?? '-'}</td>`;
      }).join('');
      return `<tr>${cells}</tr>`;
    }).join('');

    return `
      ${generateDocumentHeader(organizationSettings, documentType, filename)}
      <h2 style="margin: 20px 0; color: #333;">${title}</h2>
      <p style="color: #666; margin-bottom: 20px;">Genere le ${new Date().toLocaleString('fr-FR')}</p>
      <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
        <thead>
          <tr>${headerRow}</tr>
        </thead>
        <tbody>
          ${dataRows}
        </tbody>
      </table>
      <p style="margin-top: 20px; color: #666; font-size: 12px;">Total: ${data.length} enregistrements</p>
      ${generateDocumentFooter(organizationSettings)}
    `;
  };

  const handlePrint = async () => {
    const content = customContent || generateTableHTML();
    await printDocument(content, organizationSettings, title);
    setShowMenu(false);
  };

  const handleExportPDF = async () => {
    const content = customContent || generateTableHTML();
    const printWindow = window.open('', '_blank', 'noopener,noreferrer');
    if (!printWindow) {
      error('Erreur', 'Veuillez autoriser les fenêtres pop-up pour exporter en PDF');
      return;
    }

    printWindow.document.title = title;
    
    const style = printWindow.document.createElement('style');
    style.textContent = `
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #333; }
      table { width: 100%; border-collapse: collapse; margin: 20px 0; }
      th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
      th { background-color: ${organizationSettings.primaryColor}; color: white; }
      @media print { @page { margin: 10mm; size: A4; } }
    `;
    printWindow.document.head.appendChild(style);
    const parser = new DOMParser();
    const parsedDoc = parser.parseFromString(content, 'text/html');
    Array.from(parsedDoc.body.childNodes).forEach(node => {
      printWindow.document.body.appendChild(printWindow.document.importNode(node, true));
    });
    setTimeout(() => printWindow.print(), 250);
    setShowMenu(false);
  };

  const handleExportExcel = () => {
    const headers = columns.map(col => col.label);
    const exportData = data.map(row => {
      const obj: Record<string, unknown> = {};
      columns.forEach(col => {
        obj[col.label.toLowerCase().replace(/\s+/g, '_')] = row[col.key];
      });
      return obj;
    });
    exportToExcel(exportData, filename, headers);
    setShowMenu(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
      >
        <FileDown className="w-4 h-4" />
        Exporter
        <ChevronDown className="w-3 h-3" />
      </button>

      {showMenu && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden">
            <button
              onClick={handleExportPDF}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
            >
              <FileDown className="w-4 h-4 text-red-500" />
              <span>Exporter en PDF</span>
            </button>
            <button
              onClick={handleExportExcel}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
            >
              <FileSpreadsheet className="w-4 h-4 text-green-500" />
              <span>Exporter en Excel</span>
            </button>
            <button
              onClick={handlePrint}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
            >
              <Printer className="w-4 h-4 text-blue-500" />
              <span>Imprimer</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ExportButtons;
