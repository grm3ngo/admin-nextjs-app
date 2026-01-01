import { ReactNode } from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  iconBgColor?: string;
  className?: string;
}

export function StatsCard({ 
  title, 
  value, 
  icon,
  iconBgColor = 'bg-blue-500',
  className = '' 
}: StatsCardProps) {
  return (
    <div className={`stats-card ${className}`}>
      {icon && (
        <div className={`stats-card-icon ${iconBgColor}`}>
          {icon}
        </div>
      )}
      <div className="stats-card-content">
        <span className="stats-card-title">{title}</span>
        <span className="stats-card-value">{value}</span>
      </div>
    </div>
  );
}
