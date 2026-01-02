'use client';

import React from 'react';

interface ErrorMessageProps {
  message: string;
  type?: 'error' | 'warning' | 'info';
  onRetry?: () => void;
  onClose?: () => void;
}

export function ErrorMessage({
  message,
  type = 'error',
  onRetry,
  onClose,
}: ErrorMessageProps) {
  const icons = {
    error: (
      <svg
        className="error-icon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="15" y1="9" x2="9" y2="15" />
        <line x1="9" y1="9" x2="15" y2="15" />
      </svg>
    ),
    warning: (
      <svg
        className="error-icon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
    info: (
      <svg
        className="error-icon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="16" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12.01" y2="8" />
      </svg>
    ),
  };

  return (
    <div className={`error-message error-message--${type}`}>
      <div className="error-message__icon">{icons[type]}</div>
      <div className="error-message__content">
        <p className="error-message__text">{message}</p>
        {onRetry && (
          <button className="error-message__retry" onClick={onRetry}>
            Thử lại
          </button>
        )}
      </div>
      {onClose && (
        <button className="error-message__close" onClick={onClose}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}
    </div>
  );
}
