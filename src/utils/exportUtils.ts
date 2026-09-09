import { OrganizationSettings } from '../types';

declare global {
  interface Window {
    print: () => void;
  }
}

export const formatCurrency = (amount: number, organization?: OrganizationSettings): string => {
  const symbol = organization?.currencySymbol || '€';
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
  organization: OrganizationSettings,
  format: 'thermal' | 'a4' = 'thermal'
): string => {
  const currency = organization.currencySymbol || '€';
  const rows = receipt.items.map(item => `
    <tr>
      <td style="padding: 4px 0; text-align: left; font-size: ${format === 'thermal' ? '11px' : '13px'};">${item.name}</td>
      <td style="padding: 4px 0; text-align: center; font-size: ${format === 'thermal' ? '11px' : '13px'};">${item.quantity}</td>
      <td style="padding: 4px 0; text-align: right; font-size: ${format === 'thermal' ? '11px' : '13px'};">${item.price.toFixed(2)} ${currency}</td>
      <td style="padding: 4px 0; text-align: right; font-weight: bold; font-size: ${format === 'thermal' ? '11px' : '13px'};">${item.total.toFixed(2)} ${currency}</td>
    </tr>
  `).join('');

  if (format === 'thermal') {
    return `
      <div style="width: 76mm; max-width: 76mm; margin: 0 auto; font-family: 'Courier New', Courier, monospace; font-size: 11px; line-height: 1.3; color: #000; padding: 4px;">
        <div style="text-align: center; margin-bottom: 12px;">
          ${organization.logo ? `<img src="${organization.logo}" alt="Logo" style="max-height: 35px; margin-bottom: 6px;">` : ''}
          <h2 style="margin: 0; font-size: 14px; font-weight: bold; text-transform: uppercase;">${organization.name}</h2>
          <p style="margin: 2px 0;">${organization.address}, ${organization.city}</p>
          <p style="margin: 2px 0;">Tel: ${organization.phone}</p>
        </div>

        <div style="border-top: 1px dashed #000; border-bottom: 1px dashed #000; padding: 6px 0; margin: 8px 0; text-align: center;">
          <div style="font-weight: bold; font-size: 12px;">TICKET DE CAISSE PHARMACIE</div>
          <div>Ticket N° : <strong>${receipt.number}</strong></div>
          <div>Date : ${formatDate(receipt.date)} à ${new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</div>
          <div>Client : ${receipt.customerName || 'Client Comptoir'}</div>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin: 8px 0;">
          <thead>
            <tr style="border-bottom: 1px solid #000; font-size: 11px; text-align: left;">
              <th style="padding-bottom: 4px;">Article</th>
              <th style="text-align: center; padding-bottom: 4px;">Qté</th>
              <th style="text-align: right; padding-bottom: 4px;">P.U</th>
              <th style="text-align: right; padding-bottom: 4px;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>

        <div style="border-top: 1px dashed #000; padding-top: 6px; margin-top: 6px;">
          <div style="display: flex; justify-content: space-between;">
            <span>Sous-total HT :</span>
            <span>${receipt.subtotal.toFixed(2)} ${currency}</span>
          </div>
          ${receipt.tax > 0 ? `
          <div style="display: flex; justify-content: space-between;">
            <span>TVA :</span>
            <span>${receipt.tax.toFixed(2)} ${currency}</span>
          </div>
          ` : ''}
          <div style="display: flex; justify-content: space-between; font-size: 14px; font-weight: bold; margin: 6px 0; border-top: 1px solid #000; border-bottom: 1px solid #000; padding: 4px 0;">
            <span>TOTAL TTC :</span>
            <span>${receipt.total.toFixed(2)} ${currency}</span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span>Règlement (${receipt.paymentMethod}) :</span>
            <span>${receipt.amountReceived.toFixed(2)} ${currency}</span>
          </div>
          ${receipt.change > 0 ? `
          <div style="display: flex; justify-content: space-between; font-weight: bold;">
            <span>Monnaie rendue :</span>
            <span>${receipt.change.toFixed(2)} ${currency}</span>
          </div>
          ` : ''}
        </div>

        <div style="text-align: center; margin-top: 14px; border-top: 1px dashed #000; padding-top: 8px; font-size: 10px;">
          <p style="margin: 0; font-weight: bold;">Merci de votre confiance !</p>
          <p style="margin: 2px 0;">Conservez ce ticket pour tout échange sous 48h.</p>
          ${organization.taxId ? `<p style="margin: 2px 0;">NIF / TVA : ${organization.taxId}</p>` : ''}
        </div>
      </div>
    `;
  }

  // Standard A4 Layout
  return `
    <div style="max-width: 210mm; margin: 0 auto; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 20px; color: #333;">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid ${organization.primaryColor}; padding-bottom: 15px; margin-bottom: 20px;">
        <div>
          ${organization.logo ? `<img src="${organization.logo}" alt="Logo" style="max-height: 50px; margin-bottom: 8px;">` : ''}
          <h1 style="margin: 0; font-size: 22px; color: ${organization.primaryColor};">${organization.name}</h1>
          <p style="margin: 4px 0; font-size: 12px; color: #666;">${organization.address}, ${organization.city}</p>
          <p style="margin: 0; font-size: 12px; color: #666;">Tél : ${organization.phone} | Email : ${organization.email || 'contact@hopital.com'}</p>
        </div>
        <div style="text-align: right;">
          <div style="display: inline-block; background-color: ${organization.primaryColor}15; padding: 8px 16px; border-radius: 8px; border: 1px solid ${organization.primaryColor}40;">
            <h2 style="margin: 0; font-size: 16px; color: ${organization.primaryColor};">FACTURE DE PHARMACIE</h2>
            <p style="margin: 4px 0 0 0; font-size: 13px; font-weight: bold;">N° ${receipt.number}</p>
          </div>
          <p style="margin: 6px 0 0 0; font-size: 12px; color: #666;">Date : ${formatDate(receipt.date)}</p>
        </div>
      </div>

      <div style="background-color: #f8fafc; padding: 12px; border-radius: 8px; margin-bottom: 20px; border: 1px solid #e2e8f0;">
        <p style="margin: 0; font-size: 13px;"><strong>Patient / Acheteur :</strong> ${receipt.customerName || 'Client Comptoir'}</p>
      </div>

      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <thead>
          <tr style="background-color: ${organization.primaryColor}; color: white;">
            <th style="padding: 10px; text-align: left;">Désignation du Médicament</th>
            <th style="padding: 10px; width: 60px; text-align: center;">Qté</th>
            <th style="padding: 10px; width: 120px; text-align: right;">Prix Unitaire</th>
            <th style="padding: 10px; width: 120px; text-align: right;">Montant Total</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>

      <div style="display: flex; justify-content: flex-end;">
        <div style="width: 320px; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 13px;">
            <span>Sous-total HT :</span>
            <span>${receipt.subtotal.toFixed(2)} ${currency}</span>
          </div>
          ${receipt.tax > 0 ? `
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 13px;">
            <span>TVA (${organization.taxRate}%) :</span>
            <span>${receipt.tax.toFixed(2)} ${currency}</span>
          </div>
          ` : ''}
          <div style="display: flex; justify-content: space-between; font-size: 16px; font-weight: bold; border-top: 2px solid #cbd5e1; padding-top: 8px; color: ${organization.primaryColor};">
            <span>TOTAL TTC :</span>
            <span>${receipt.total.toFixed(2)} ${currency}</span>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 12px; color: #64748b; margin-top: 8px;">
            <span>Mode : ${receipt.paymentMethod}</span>
            <span>Reçu : ${receipt.amountReceived.toFixed(2)} ${currency}</span>
          </div>
          ${receipt.change > 0 ? `
          <div style="display: flex; justify-content: space-between; font-size: 13px; font-weight: bold; color: #059669; margin-top: 4px;">
            <span>Rendu :</span>
            <span>${receipt.change.toFixed(2)} ${currency}</span>
          </div>
          ` : ''}
        </div>
      </div>

      <div style="text-align: center; margin-top: 40px; border-top: 1px solid #e2e8f0; padding-top: 15px; font-size: 11px; color: #94a3b8;">
        <p style="margin: 0;">${organization.name} — Délivrance pharmaceutique sécurisée</p>
      </div>
    </div>
  `;
};
