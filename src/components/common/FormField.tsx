import React from 'react';

interface FormFieldProps {
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  value?: string;
  showWordCount?: boolean;
  maxLength?: number;
  children: React.ReactNode;
  className?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  required = false,
  hint,
  error,
  value = '',
  showWordCount = false,
  maxLength,
  children,
  className = ''
}) => {
  const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0;
  const charCount = value.length;

  return (
    <div className={`space-y-1.5 ${className}`}>
      <div className="flex justify-between items-center text-xs">
        <label className="font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1">
          <span>{label}</span>
          {required && (
            <span className="text-rose-500 font-black text-sm leading-none" title="Champ obligatoire">
              *
            </span>
          )}
        </label>

        {showWordCount && (
          <span className="text-[10px] text-gray-400 font-mono">
            {wordCount} mot{wordCount > 1 ? 's' : ''} {maxLength ? `(${charCount}/${maxLength} car.)` : `(${charCount} car.)`}
          </span>
        )}
      </div>

      {children}

      {hint && !error && (
        <p className="text-[11px] text-gray-400">{hint}</p>
      )}

      {error && (
        <p className="text-[11px] text-rose-500 font-semibold">{error}</p>
      )}
    </div>
  );
};

export default FormField;
