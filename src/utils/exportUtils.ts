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
    receipt: 'Reçu',
    report: 'Rapport Médical',
    prescription: 'Ordonnance Médicale',
    lab_result: 'Résultat d\'Analyse'
  };

  return `
    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 25px; padding-bottom: 15px; border-bottom: 2px solid ${organization.primaryColor || '#0891b2'};">
      <div style="display: flex; align-items: center; gap: 15px;">
        ${organization.logo ? `<img src="${organization.logo}" alt="${organization.name}" style="max-height: 55px; max-width: 140px; object-fit: contain;">` : ''}
        <div>
          <h1 style="margin: 0; font-size: 20px; color: ${organization.primaryColor || '#0891b2'}; font-weight: bold;">${organization.name}</h1>
          <p style="margin: 3px 0 0; color: #475569; font-size: 11px;">${organization.address}, ${organization.city}</p>
          <p style="margin: 2px 0 0; color: #475569; font-size: 11px;">Tél: ${organization.phone} | Email: ${organization.email}</p>
        </div>
      </div>
      <div style="text-align: right;">
        <h2 style="margin: 0; font-size: 16px; color: #1e293b; text-transform: uppercase;">${docLabels[docType]}</h2>
        <p style="margin: 4px 0 0; font-size: 12px; font-weight: bold; color: ${organization.primaryColor || '#0891b2'};">N° ${docNumber}</p>
        <p style="margin: 2px 0 0; font-size: 11px; color: #64748b;">Émis le : ${formatDate(new Date())}</p>
      </div>
    </div>
  `;
};

export const generateDocumentFooter = (organization: OrganizationSettings): string => {
  return `
    <div style="margin-top: 30px; padding-top: 15px; border-top: 1px solid #e2e8f0; text-align: center; color: #64748b; font-size: 10px; line-height: 1.4;">
      <p style="margin: 0; font-weight: bold; color: #334155;">${organization.name}</p>
      <p style="margin: 2px 0;">${organization.address}, ${organization.city} &bull; Tél : ${organization.phone} &bull; Email : ${organization.email}</p>
      ${organization.taxId ? `<p style="margin: 2px 0;">NIF / TVA : ${organization.taxId}</p>` : ''}
      ${organization.bankName ? `<p style="margin: 4px 0 0;">Banque : ${organization.bankName} &bull; IBAN : ${organization.bankIban || organization.bankAccount}</p>` : ''}
      <div style="margin-top: 10px; font-size: 8.5px; color: #94a3b8; letter-spacing: 0.5px;">
        &copy; ${new Date().getFullYear()} SoftCare Hospital OS &bull; Système d'Information Hospitalier (HIS) &bull; Tous droits réservés
      </div>
    </div>
  `;
};

export const printDocument = async (
  content: string,
  organization: OrganizationSettings,
  title: string = 'Document'
): Promise<void> => {
  return new Promise((resolve) => {
    // Create an invisible iframe to prevent screen blanking / window freezing
    const existingIframe = document.getElementById('softcare-print-frame');
    if (existingIframe) {
      existingIframe.remove();
    }

    const iframe = document.createElement('iframe');
    iframe.id = 'softcare-print-frame';
    iframe.style.position = 'fixed';
    iframe.style.top = '-9999px';
    iframe.style.left = '-9999px';
    iframe.style.width = '0px';
    iframe.style.height = '0px';
    iframe.style.border = 'none';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document || iframe.contentDocument;
    if (!doc) {
      resolve();
      return;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8" />
        <title>${title}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
            padding: 15mm 20mm;
            max-width: 210mm;
            margin: 0 auto;
            color: #1e293b;
            line-height: 1.4;
            background: #fff;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0;
          }
          th, td {
            border: 1px solid #e2e8f0;
            padding: 8px 10px;
            text-align: left;
            font-size: 11px;
          }
          th {
            background-color: ${organization.primaryColor || '#0891b2'};
            color: white;
            font-weight: 600;
          }
          tr:nth-child(even) { background-color: #f8fafc; }
          @media print {
            body { padding: 5mm 10mm; }
            @page { margin: 8mm; size: auto; }
          }
        </style>
      </head>
      <body>
        ${content}
      </body>
      </html>
    `;

    doc.open();
    doc.write(htmlContent);
    doc.close();

    // Trigger print after iframe renders
    setTimeout(() => {
      try {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
      } catch (err) {
        console.error('Print iframe error:', err);
      } finally {
        setTimeout(() => {
          iframe.remove();
          resolve();
        }, 1000);
      }
    }, 250);
  });
};

export const exportToPDF = async (
  content: string,
  organization: OrganizationSettings,
  filename: string
): Promise<void> => {
  const printWindow = window.open('', '_blank', 'noopener,noreferrer');
  if (!printWindow) {
    alert('Veuillez autoriser les fenetres pop-up pour exporter en PDF');
    return;
  }

  printWindow.document.open();
  printWindow.document.write('<!DOCTYPE html><html><head><title></title></head><body></body></html>');
  printWindow.document.close();

  printWindow.document.title = filename;

  const style = printWindow.document.createElement('style');
  style.textContent = `
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
  `;
  printWindow.document.head.appendChild(style);

  printWindow.document.body.innerHTML = content;

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
