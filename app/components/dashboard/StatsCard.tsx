import { ReactNode } from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  iconBgColor?: string;
  change?: number;
  changeLabel?: string;
  className?: string;
}

export function StatsCard({ 
  title, 
  value, 
  icon,
  iconBgColor = 'bg-blue-500',
  change,
  changeLabel,
  className = '' 
}: StatsCardProps) {
  return (
    <div className={`stat-card ${className}`}>
      {icon && (
        <div className={`stat-icon ${iconBgColor}`}>
          {icon}
        </div>
      )}
      <div className="stat-content">
        <span className="stat-label">{title}</span>
        <span className="stat-value">{value}</span>
        {change !== undefined && (
          <span className={`stat-change ${change >= 0 ? 'positive' : 'negative'}`}>
            {change >= 0 ? '↑' : '↓'} {Math.abs(change)}%
            {changeLabel && <span className="ml-1">{changeLabel}</span>}
          </span>
        )}
      </div>
    </div>
  );
}
