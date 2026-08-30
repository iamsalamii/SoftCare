import { OrganizationSettings } from '../types';

declare global {
  interface Window {
    print: () => void;
  }
}

export const formatCurrency = (amount: number, organization?: OrganizationSettings): string => {
  const symbol = organization?.currencySymbol || 'E';
  const formattedNumber = new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
  return `${formattedNumber} ${symbol}`;
};

export const formatDate = (date: string | Date, format: string = 'DD/MM/YYYY'): string => {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();

  if (format === 'YYYY-MM-DD') return `${year}-${month}-${day}`;
  return `${day}/${month}/${year}`;
};

export const generateDocumentHeader = (
  organization: OrganizationSettings,
  docType: 'invoice' | 'receipt' | 'report' | 'prescription' | 'lab_result',
  docNumber: string
): string => {
  const docLabels: Record<string, string> = {
    invoice: 'Facture',
    receipt: 'Recu',
    report: 'Rapport',
    prescription: 'Ordonnance',
    lab_result: 'Resultat d\\\'analyse'
  };

  return `
    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 3px solid ${organization.primaryColor};">
      <div style="display: flex; align-items: center; gap: 20px;">
        ${organization.logo ? `<img src="${organization.logo}" alt="Logo" style="max-height: 60px; max-width: 150px;">` : ''}
        <div>
          <h1 style="margin: 0; font-size: 24px; color: ${organization.primaryColor}; font-weight: bold;">${organization.name}</h1>
          <p style="margin: 5px 0 0; color: #666; font-size: 12px;">${organization.address}, ${organization.city}</p>
          <p style="margin: 2px 0 0; color: #666; font-size: 12px;">Tel: ${organization.phone} | Email: ${organization.email}</p>
        </div>
      </div>
      <div style="text-align: right;">
        <h2 style="margin: 0; font-size: 20px; color: #333;">${docLabels[docType]}</h2>
        <p style="margin: 5px 0 0; font-size: 14px;"><strong>N:</strong> ${docNumber}</p>
        <p style="margin: 2px 0 0; font-size: 12px; color: #666;">${formatDate(new Date())}</p>
      </div>
    </div>
  `;
};

export const generateDocumentFooter = (organization: OrganizationSettings): string => {
  return `
    <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; color: #666; font-size: 11px;">
      <p style="margin: 0;"><strong>${organization.name}</strong></p>
      <p style="margin: 3px 0;">${organization.address}, ${organization.city}, ${organization.country}</p>
      <p style="margin: 3px 0;">Tel: ${organization.phone} | Email: ${organization.email} ${organization.website ? `| Web: ${organization.website}` : ''}</p>
      ${organization.taxId ? `<p style="margin: 3px 0;">N fiscal: ${organization.taxId}</p>` : ''}
      ${organization.bankName ? `<p style="margin: 10px 0 0;"><strong>Banque:</strong> ${organization.bankName} - Compte: ${organization.bankAccount} - IBAN: ${organization.bankIban}</p>` : ''}
    </div>
  `;
};

export const printDocument = async (
  content: string,
  organization: OrganizationSettings,
  title: string = 'Document'
): Promise<void> => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Veuillez autoriser les fenetres pop-up pour imprimer');
    return;
  }

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>${title}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          padding: 40px;
          max-width: 210mm;
          margin: 0 auto;
          color: #333;
          line-height: 1.5;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
        }
        th, td {
          border: 1px solid #ddd;
          padding: 10px;
          text-align: left;
        }
        th {
          background-color: ${organization.primaryColor};
          color: white;
          font-weight: 600;
        }
        tr:nth-child(even) { background-color: #f9f9f9; }
        h1, h2, h3 { color: #333; }
        .total-row { font-weight: bold; background-color: #f0f0f0; }
        .print-actions {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          background: #333;
          padding: 15px;
          display: flex;
          justify-content: center;
          gap: 15px;
          z-index: 9999;
        }
        .print-actions button {
          padding: 10px 25px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 600;
          font-size: 14px;
        }
        .btn-print {
          background: #2563eb;
          color: white;
        }
        .btn-close {
          background: #dc2626;
          color: white;
        }
        .preview-content {
          margin-top: 70px;
        }
        @media print {
          .print-actions { display: none !important; }
          body { padding: 20mm; margin-top: 0; }
          .preview-content { margin-top: 0; }
          @page { margin: 10mm; }
        }
      </style>
    </head>
    <body>
      <div class="print-actions">
        <button class="btn-print" onclick="window.print()">Imprimer</button>
        <button class="btn-close" onclick="window.close()">Fermer</button>
      </div>
      <div class="preview-content">
        ${content}
      </div>
    </body>
    </html>
  `);

  printWindow.document.close();
  printWindow.focus();
};

export const exportToPDF = async (
  content: string,
  organization: OrganizationSettings,
  filename: string
): Promise<void> => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Veuillez autoriser les fenetres pop-up pour exporter en PDF');
    return;
  }

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>${filename}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          padding: 40px;
          max-width: 210mm;
          margin: 0 auto;
          color: #333;
          line-height: 1.5;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
        }
        th, td {
          border: 1px solid #ddd;
          padding: 10px;
          text-align: left;
        }
        th {
          background-color: ${organization.primaryColor};
          color: white;
          font-weight: 600;
        }
        tr:nth-child(even) { background-color: #f9f9f9; }
        .total-row { font-weight: bold; background-color: #f0f0f0; }
        @media print {
          body { padding: 20mm; }
          @page { margin: 10mm; size: A4; }
        }
      </style>
    </head>
    <body>
      ${content}
    </body>
    </html>
  `);

  printWindow.document.close();
  printWindow.focus();

  setTimeout(() => {
    printWindow.print();
  }, 250);
};

export const exportToExcel = (
  data: Record<string, unknown>[],
  filename: string,
  headers: string[]
): void => {
  const csvContent = [
    headers.join(';'),
    ...data.map(row =>
      headers.map(h => {
        const value = row[h.toLowerCase().replace(/\s+/g, '_')];
        if (typeof value === 'string' && value.includes(';')) {
          return `"${value}"`;
        }
        return value ?? '';
      }).join(';')
    )
  ].join('\n');

  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
};

export const generateInvoiceHTML = (
  invoice: {
    number: string;
    date: string;
    dueDate: string;
    patient: { name: string; address: string; phone: string };
    items: Array<{ description: string; quantity: number; unitPrice: number; total: number }>;
    subtotal: number;
    tax: number;
    discount: number;
    total: number;
    status: string;
  },
  organization: OrganizationSettings
): string => {
  const rows = invoice.items.map(item => `
    <tr>
      <td>${item.description}</td>
      <td style="text-align: center;">${item.quantity}</td>
      <td style="text-align: right;">${formatCurrency(item.unitPrice)}</td>
      <td style="text-align: right;">${formatCurrency(item.total)}</td>
    </tr>
  `).join('');

  return `
    ${generateDocumentHeader(organization, 'invoice', invoice.number)}

    <div style="margin-bottom: 30px;">
      <h3 style="margin: 0 0 10px; font-size: 14px; color: #666;">FACTURE A</h3>
      <p style="margin: 0; font-weight: bold; font-size: 16px;">${invoice.patient.name}</p>
      <p style="margin: 5px 0; color: #666;">${invoice.patient.address}</p>
      <p style="margin: 0; color: #666;">Tel: ${invoice.patient.phone}</p>
    </div>

    <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
      <div>
        <p style="margin: 0; font-size: 12px; color: #666;">Date d'emission</p>
        <p style="margin: 0; font-weight: bold;">${formatDate(invoice.date)}</p>
      </div>
      <div style="text-align: right;">
        <p style="margin: 0; font-size: 12px; color: #666;">Date d'echeance</p>
        <p style="margin: 0; font-weight: bold;">${formatDate(invoice.dueDate)}</p>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th>Description</th>
          <th style="width: 80px;">Qte</th>
          <th style="width: 120px;">Prix unit.</th>
          <th style="width: 120px;">Total</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>

    <div style="display: flex; justify-content: flex-end; margin-top: 20px;">
      <div style="width: 300px;">
        <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee;">
          <span>Sous-total</span>
          <span>${formatCurrency(invoice.subtotal)}</span>
        </div>
        ${invoice.tax > 0 ? `
        <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee;">
          <span>TVA (${organization.taxName || 'TVA'})</span>
          <span>${formatCurrency(invoice.tax)}</span>
        </div>
        ` : ''}
        ${invoice.discount > 0 ? `
        <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; color: green;">
          <span>Remise</span>
          <span>-${formatCurrency(invoice.discount)}</span>
        </div>
        ` : ''}
        <div style="display: flex; justify-content: space-between; padding: 15px 0; font-size: 18px; font-weight: bold; background-color: ${organization.primaryColor}15;">
          <span>TOTAL</span>
          <span style="color: ${organization.primaryColor};">${formatCurrency(invoice.total)}</span>
        </div>
      </div>
    </div>

    ${generateDocumentFooter(organization)}
  `;
};

export const generateReceiptHTML = (
  receipt: {
    number: string;
    date: string;
    customerName: string;
    items: Array<{ name: string; quantity: number; price: number; total: number }>;
    subtotal: number;
    tax: number;
    total: number;
    paymentMethod: string;
    amountReceived: number;
    change: number;
  },
  organization: OrganizationSettings
): string => {
  const rows = receipt.items.map(item => `
    <tr>
      <td>${item.name}</td>
      <td style="text-align: center;">${item.quantity}</td>
      <td style="text-align: right;">${formatCurrency(item.price)}</td>
      <td style="text-align: right;">${formatCurrency(item.total)}</td>
    </tr>
  `).join('');

  return `
    <div style="text-align: center; margin-bottom: 20px;">
      ${organization.logo ? `<img src="${organization.logo}" alt="Logo" style="max-height: 50px; margin-bottom: 10px;">` : ''}
      <h1 style="margin: 0; font-size: 20px; color: ${organization.primaryColor};">${organization.name}</h1>
      <p style="margin: 5px 0; font-size: 12px; color: #666;">${organization.address}, ${organization.city}</p>
      <p style="margin: 0; font-size: 12px; color: #666;">Tel: ${organization.phone}</p>
    </div>

    <div style="text-align: center; border-top: 1px dashed #ccc; border-bottom: 1px dashed #ccc; padding: 10px 0; margin: 15px 0;">
      <h2 style="margin: 0; font-size: 16px;">RECU DE PAIEMENT</h2>
      <p style="margin: 5px 0; font-size: 12px;">N: ${receipt.number}</p>
      <p style="margin: 0; font-size: 12px;">${formatDate(receipt.date)}</p>
    </div>

    <div style="margin: 15px 0;">
      <p style="margin: 0; font-size: 12px;"><strong>Client:</strong> ${receipt.customerName || 'Client'}</p>
    </div>

    <table style="font-size: 11px; width: 100%;">
      <thead>
        <tr>
          <th style="padding: 5px;">Article</th>
          <th style="padding: 5px; width: 40px;">Qte</th>
          <th style="padding: 5px; width: 60px;">Prix</th>
          <th style="padding: 5px; width: 60px;">Total</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>

    <div style="margin-top: 10px; border-top: 1px dashed #ccc; padding-top: 10px;">
      <div style="display: flex; justify-content: space-between; font-size: 12px;">
        <span>Sous-total</span>
        <span>${formatCurrency(receipt.subtotal)}</span>
      </div>
      ${receipt.tax > 0 ? `
      <div style="display: flex; justify-content: space-between; font-size: 12px; margin-top: 5px;">
        <span>TVA</span>
        <span>${formatCurrency(receipt.tax)}</span>
      </div>
      ` : ''}
      <div style="display: flex; justify-content: space-between; font-size: 14px; font-weight: bold; margin-top: 10px; padding-top: 5px; border-top: 1px solid #ddd;">
        <span>TOTAL</span>
        <span>${formatCurrency(receipt.total)}</span>
      </div>
      <div style="display: flex; justify-content: space-between; font-size: 11px; margin-top: 5px;">
        <span>Reglement: ${receipt.paymentMethod}</span>
        <span>Recu: ${formatCurrency(receipt.amountReceived)}</span>
      </div>
      ${receipt.change > 0 ? `
      <div style="display: flex; justify-content: space-between; font-size: 11px;">
        <span>Monnaie</span>
        <span>${formatCurrency(receipt.change)}</span>
      </div>
      ` : ''}
    </div>

    <div style="text-align: center; margin-top: 20px; font-size: 10px; color: #666;">
      <p>Merci de votre visite!</p>
      <p style="margin-top: 15px; font-size: 9px;">${organization.taxId ? `NIF: ${organization.taxId}` : ''}</p>
    </div>
  `;
};
