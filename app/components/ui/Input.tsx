import { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export function Input({
  label,
  error,
  hint,
  className = '',
  id,
  ...props
}: InputProps) {
  const inputId = id || props.name;

  return (
    <div className="form-group">
      {label && (
        <label htmlFor={inputId} className="form-label">
          {label}
          {props.required && <span className="text-danger ml-1">*</span>}
        </label>
      )}
      <input
        id={inputId}
        className={`form-input ${error ? 'error' : ''} ${className}`}
        {...props}
      />
      {hint && !error && (
        <p className="text-muted text-sm mt-1">{hint}</p>
      )}
      {error && (
        <p className="form-error">{error}</p>
      )}
    </div>
  );
}
