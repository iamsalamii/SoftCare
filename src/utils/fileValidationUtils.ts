/**
 * File validation utilities for SoftCare Medical Information System.
 * Ensures strict security checks against malicious uploads, oversized documents,
 * and invalid MIME types according to HDS/OWASP standards.
 */

export interface FileValidationResult {
  valid: boolean;
  error?: string;
  sanitizedName?: string;
}

export const MAX_UPLOAD_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

export const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/dicom',
  'application/octet-stream' // Often used for DICOM files (.dcm)
];

export const ALLOWED_EXTENSIONS = [
  '.pdf',
  '.jpg',
  '.jpeg',
  '.png',
  '.webp',
  '.dcm'
];

/**
 * Validates a file before upload.
 * @param file Browser File object
 * @param customMaxSizeBytes Optional custom max size in bytes (defaults to 10MB)
 */
export const validateUploadFile = (
  file: File,
  customMaxSizeBytes: number = MAX_UPLOAD_SIZE_BYTES
): FileValidationResult => {
  if (!file) {
    return { valid: false, error: 'Aucun fichier sélectionné.' };
  }

  // 1. Check file size
  if (file.size > customMaxSizeBytes) {
    const maxMb = Math.round(customMaxSizeBytes / (1024 * 1024));
    return {
      valid: false,
      error: `Le fichier dépasse la taille maximale autorisée (${maxMb} Mo).`
    };
  }

  // 2. Check file extension
  const fileName = file.name.toLowerCase();
  const hasValidExtension = ALLOWED_EXTENSIONS.some(ext => fileName.endsWith(ext));

  if (!hasValidExtension) {
    return {
      valid: false,
      error: `Format de fichier non autorisé. Formats acceptés : ${ALLOWED_EXTENSIONS.join(', ')}.`
    };
  }

  // 3. Check MIME type (when provided by browser)
  if (file.type && !ALLOWED_MIME_TYPES.includes(file.type.toLowerCase())) {
    // If extension is .dcm allow octet-stream/empty
    if (!fileName.endsWith('.dcm')) {
      return {
        valid: false,
        error: `Type MIME (${file.type}) non conforme aux exigences de sécurité.`
      };
    }
  }

  // 4. Sanitize file name to prevent directory traversal or injection
  const sanitizedName = file.name
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .replace(/\.{2,}/g, '.');

  return {
    valid: true,
    sanitizedName
  };
};

/**
 * Format bytes to readable string (e.g. 2.4 Mo)
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Octets';
  const k = 1024;
  const sizes = ['Octets', 'Ko', 'Mo', 'Go'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
