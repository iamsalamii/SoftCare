import React from 'react';
import { createPortal } from 'react-dom';
import { AlertTriangle, X } from 'lucide-react';

export interface ConfirmDialogProps {
  isOpen: boolean;
  onClose?: () => void;
  onCancel?: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  confirmLabel?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
  loading?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onCancel,
  onConfirm,
  title,
  message,
  confirmText,
  confirmLabel,
  cancelText = 'Annuler',
  variant = 'danger',
  loading = false
}) => {
  const handleClose = onCancel || onClose || (() => {});
  const buttonConfirmText = confirmLabel || confirmText || 'Confirmer';

  if (!isOpen) return null;

  const variantConfig = {
    danger: {
      iconBg: 'bg-rose-100 text-rose-600',
      buttonBg: 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/25',
      buttonDisabled: 'disabled:bg-rose-300'
    },
    warning: {
      iconBg: 'bg-amber-100 text-amber-600',
      buttonBg: 'bg-amber-600 hover:bg-amber-700 shadow-amber-600/25',
      buttonDisabled: 'disabled:bg-amber-300'
    },
    info: {
      iconBg: 'bg-cyan-100 text-cyan-600',
      buttonBg: 'bg-cyan-600 hover:bg-cyan-700 shadow-cyan-600/25',
      buttonDisabled: 'disabled:bg-cyan-300'
    }
  };

  const config = variantConfig[variant];

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={handleClose}
      />

      {/* Dialog Shell */}
      <div className="relative bg-white rounded-3xl shadow-2xl border border-gray-100 max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-150 space-y-5">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-1.5 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="flex items-start gap-4">
          <div className={`w-12 h-12 rounded-2xl ${config.iconBg} flex items-center justify-center flex-shrink-0 shadow-xs`}>
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="flex-1 pr-4">
            <h3 className="text-base font-bold text-gray-900 leading-snug">{title}</h3>
            <p className="text-xs text-gray-600 mt-1.5 leading-relaxed">{message}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2.5 pt-2 border-t border-gray-100">
          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            className="px-4 py-2.5 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors text-xs font-semibold disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`px-5 py-2.5 text-white rounded-xl text-xs font-bold transition-all shadow-md disabled:cursor-not-allowed ${config.buttonBg} ${config.buttonDisabled}`}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full" />
                <span>Traitement...</span>
              </span>
            ) : (
              buttonConfirmText
            )}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ConfirmDialog;