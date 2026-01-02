import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  headerAction?: ReactNode;
  className?: string;
  noPadding?: boolean;
}

export function Card({ 
  children, 
  title, 
  subtitle,
  headerAction,
  className = '',
  noPadding = false,
}: CardProps) {
  return (
    <div className={`card ${noPadding ? 'p-0' : ''} ${className}`}>
      {(title || headerAction) && (
        <div className="card-header">
          <div>
            {title && <h3 className="card-title">{title}</h3>}
            {subtitle && <p className="text-muted text-sm mt-1">{subtitle}</p>}
          </div>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      {children}
    </div>
  );
}
