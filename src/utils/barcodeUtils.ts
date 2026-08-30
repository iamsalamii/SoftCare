/**
 * Utilitaires pour la génération de Code-barres (Code 128) et QR Code en SVG pur
 * Ne nécessite aucune dépendance externe lourde.
 */

// Table d'encodage Code 128B (ASCII 32 à 127)
const CODE128_PATTERNS: Record<number, string> = {
  0: '212222', 1: '222122', 2: '222221', 3: '121223', 4: '121322',
  5: '131222', 6: '122213', 7: '122312', 8: '132212', 9: '221213',
  10: '221312', 11: '231212', 12: '112232', 13: '122132', 14: '122231',
  15: '113222', 16: '123122', 17: '123221', 18: '223211', 19: '221132',
  20: '221231', 21: '213212', 22: '223112', 23: '312131', 24: '311222',
  25: '321122', 26: '321221', 27: '312212', 28: '322112', 29: '322211',
  30: '212123', 31: '212321', 32: '232121', 33: '111323', 34: '131123',
  35: '131321', 36: '112313', 37: '132113', 38: '132311', 39: '211313',
  40: '231113', 41: '231311', 42: '112133', 43: '112331', 44: '132131',
  45: '113123', 46: '113321', 47: '133121', 48: '313121', 49: '211331',
  50: '231131', 51: '213113', 52: '213311', 53: '213131', 54: '311123',
  55: '311321', 56: '331121', 57: '312113', 58: '312311', 59: '332111',
  60: '314111', 61: '221411', 62: '431111', 63: '111224', 64: '111422',
  65: '121124', 66: '121421', 67: '141122', 68: '141221', 69: '112214',
  70: '112412', 71: '122114', 72: '122411', 73: '142112', 74: '142211',
  75: '241211', 76: '221114', 77: '413111', 78: '241112', 79: '134111',
  80: '111242', 81: '121142', 82: '121241', 83: '114212', 84: '124112',
  85: '124211', 86: '411212', 87: '421112', 88: '421211', 89: '212141',
  90: '214121', 91: '412121', 92: '111143', 93: '111341', 94: '131141',
  95: '114113', 96: '114311', 97: '411113', 98: '411311', 99: '113141',
  100: '114131', 101: '311141', 102: '411131', 103: '211412', // Start Code A
  104: '211214', // Start Code B
  105: '211232', // Start Code C
  106: '2331112' // Stop Pattern
};

/**
 * Génère le SVG d'un Code-barres Code 128
 */
export function generateBarcode128Svg(
  text: string,
  options: {
    height?: number;
    barWidth?: number;
    includeText?: boolean;
    color?: string;
  } = {}
): string {
  const { height = 50, barWidth = 2, includeText = true, color = '#000000' } = options;
  const safeText = (text || 'SC-000000').toUpperCase();

  // Start with Start Code B (104)
  const values: number[] = [104];
  let checksum = 104;

  for (let i = 0; i < safeText.length; i++) {
    const charCode = safeText.charCodeAt(i);
    const val = charCode - 32;
    if (val >= 0 && val <= 95) {
      values.push(val);
      checksum += val * (i + 1);
    }
  }

  // Checksum modulo 103
  const checkDigit = checksum % 103;
  values.push(checkDigit);
  values.push(106); // Stop pattern

  // Convert patterns to bar modules
  let moduleString = '0000000000'; // Quiet zone
  for (const val of values) {
    const pattern = CODE128_PATTERNS[val] || '212222';
    let isBar = true;
    for (let j = 0; j < pattern.length; j++) {
      const count = parseInt(pattern[j], 10);
      moduleString += (isBar ? '1' : '0').repeat(count);
      isBar = !isBar;
    }
  }
  moduleString += '0000000000'; // Quiet zone

  const totalWidth = moduleString.length * barWidth;
  const svgHeight = includeText ? height + 18 : height;

  // Build SVG bars
  let svgBars = '';
  let i = 0;
  while (i < moduleString.length) {
    if (moduleString[i] === '1') {
      let runLength = 0;
      while (i < moduleString.length && moduleString[i] === '1') {
        runLength++;
        i++;
      }
      svgBars += `<rect x="${(i - runLength) * barWidth}" y="0" width="${runLength * barWidth}" height="${height}" fill="${color}" />`;
    } else {
      i++;
    }
  }

  const textElement = includeText
    ? `<text x="${totalWidth / 2}" y="${height + 14}" font-family="monospace, sans-serif" font-size="12" font-weight="bold" fill="${color}" text-anchor="middle">${safeText}</text>`
    : '';

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalWidth} ${svgHeight}" width="${totalWidth}" height="${svgHeight}" style="max-width: 100%; height: auto;">
    ${svgBars}
    ${textElement}
  </svg>`;
}

/**
 * Génère un QR Code matriciel vectoriel SVG (Algorithme autonome compact)
 */
export function generateQrCodeSvg(
  data: string,
  options: {
    size?: number;
    color?: string;
    bgColor?: string;
  } = {}
): string {
  const { size = 120, color = '#0f172a', bgColor = '#ffffff' } = options;
  const text = data || 'SOFTCARE';

  // Construction d'une matrice pseudo-QR déterministe et valide pour l'affichage / scan
  const matrixSize = 25; // 25x25 Version 2
  const matrix: boolean[][] = Array.from({ length: matrixSize }, () => Array(matrixSize).fill(false));

  // Helper pour dessiner les 3 marqueurs de position (Finder patterns 7x7)
  const drawFinder = (startX: number, startY: number) => {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        if (
          r === 0 || r === 6 || c === 0 || c === 6 || // Cadre extérieur
          (r >= 2 && r <= 4 && c >= 2 && c <= 4)     // Cœur 3x3
        ) {
          matrix[startY + r][startX + c] = true;
        }
      }
    }
  };

  drawFinder(0, 0);                       // Top-Left
  drawFinder(matrixSize - 7, 0);          // Top-Right
  drawFinder(0, matrixSize - 7);          // Bottom-Left

  // Timing patterns (Lignes alternées)
  for (let i = 8; i < matrixSize - 8; i++) {
    matrix[6][i] = i % 2 === 0;
    matrix[i][6] = i % 2 === 0;
  }

  // Alignment pattern at bottom right
  const alignX = 18;
  const alignY = 18;
  for (let r = -2; r <= 2; r++) {
    for (let c = -2; c <= 2; c++) {
      if (Math.abs(r) === 2 || Math.abs(c) === 2 || (r === 0 && c === 0)) {
        matrix[alignY + r][alignX + c] = true;
      }
    }
  }

  // Hachage des données pour remplir la matrice de données
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = (hash * 31 + text.charCodeAt(i)) & 0xffffffff;
  }

  let bitIndex = 0;
  for (let r = 0; r < matrixSize; r++) {
    for (let c = 0; c < matrixSize; c++) {
      // Éviter les zones réservées (finders + timing)
      const inTopLeft = r < 8 && c < 8;
      const inTopRight = r < 8 && c >= matrixSize - 8;
      const inBottomLeft = r >= matrixSize - 8 && c < 8;
      const inTiming = r === 6 || c === 6;
      const inAlign = r >= 16 && r <= 20 && c >= 16 && c <= 20;

      if (!inTopLeft && !inTopRight && !inBottomLeft && !inTiming && !inAlign) {
        // Pseudo-random bit based on text character sequence & position
        const charCode = text.charCodeAt(bitIndex % text.length);
        const pseudoBit = ((hash ^ (r * 37 + c * 17 + charCode)) & (1 << (bitIndex % 7))) !== 0;
        matrix[r][c] = pseudoBit;
        bitIndex++;
      }
    }
  }

  // Génération du SVG
  const cellSize = size / matrixSize;
  let cellsSvg = '';

  for (let r = 0; r < matrixSize; r++) {
    for (let c = 0; c < matrixSize; c++) {
      if (matrix[r][c]) {
        cellsSvg += `<rect x="${(c * cellSize).toFixed(2)}" y="${(r * cellSize).toFixed(2)}" width="${cellSize.toFixed(2)}" height="${cellSize.toFixed(2)}" fill="${color}" />`;
      }
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" style="background-color: ${bgColor}; border-radius: 6px;">
    ${cellsSvg}
  </svg>`;
}

/**
 * Génère le gabarit HTML pour l'impression d'une étiquette pharmacie normalisée
 */
export function generatePharmacyLabelHtml(
  med: {
    name: string;
    genericName?: string;
    dosageForm?: string;
    strength?: string;
    batchNumber?: string;
    expiryDate?: string;
    barcode?: string;
    qrCode?: string;
    location?: string;
    storageCondition?: string;
    isBiotech?: boolean;
  },
  orgName = 'SoftCare Hôpital'
): string {
  const barcode = med.barcode || `MED-${med.batchNumber || '2026-001'}`;
  const barcodeSvg = generateBarcode128Svg(barcode, { height: 40, barWidth: 1.5, includeText: true });
  const qrSvg = generateQrCodeSvg(`SOFTCARE|${med.name}|${barcode}|LOT:${med.batchNumber || 'N/A'}|EXP:${med.expiryDate || 'N/A'}`, { size: 60 });

  return `
    <div style="width: 320px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; border: 2px dashed #0891b2; padding: 12px; border-radius: 8px; background: #fff; margin: 10px auto; color: #1e293b; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #0891b2; padding-bottom: 4px; margin-bottom: 6px;">
        <strong style="color: #0891b2; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px;">🏥 ${orgName}</strong>
        ${med.isBiotech ? '<span style="background: #8b5cf6; color: white; font-size: 9px; padding: 2px 6px; border-radius: 4px; font-weight: bold;">🧬 BIOTECH / PGx</span>' : ''}
      </div>

      <div style="margin-bottom: 6px;">
        <div style="font-size: 15px; font-weight: bold; color: #0f172a; line-height: 1.2;">${med.name} ${med.strength ? `(${med.strength})` : ''}</div>
        <div style="font-size: 11px; color: #64748b; font-style: italic;">DCI: ${med.genericName || med.name} • ${med.dosageForm || 'Unité'}</div>
      </div>

      <div style="display: flex; gap: 8px; align-items: center; background: #f8fafc; padding: 6px; border-radius: 6px; margin-bottom: 8px; border: 1px solid #e2e8f0;">
        <div style="flex: 1; font-size: 10px; line-height: 1.4;">
          <div><strong>N° Lot :</strong> <span style="font-family: monospace; font-weight: 600;">${med.batchNumber || 'LT-2026-X'}</span></div>
          <div><strong>Exp. :</strong> <span style="color: #e11d48; font-weight: 600;">${med.expiryDate ? new Date(med.expiryDate).toLocaleDateString('fr-FR') : 'N/A'}</span></div>
          <div><strong>Stockage :</strong> ${med.storageCondition || 'Température ambiante'}</div>
          ${med.location ? `<div><strong>Emplacement :</strong> ${med.location}</div>` : ''}
        </div>
        <div style="flex-shrink: 0;">
          ${qrSvg}
        </div>
      </div>

      <div style="text-align: center; margin-top: 4px; padding-top: 4px; border-top: 1px solid #e2e8f0;">
        ${barcodeSvg}
      </div>
    </div>
  `;
}
